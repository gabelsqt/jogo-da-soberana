// Converte a saída normal do Vite em um único HTML para itch.io.
// Não altera dist/ nem os comandos de desenvolvimento/preview.
// Uso: npm run build:itch  →  itch-build/index.html
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

export function generateSingleFile({ buildDir, outputFile }) {
  const inputFile = join(buildDir, 'index.html');
  if (!existsSync(inputFile)) {
    throw new Error('Build do Vite não encontrado. Execute npm run build antes.');
  }
  const html = readFileSync(inputFile, 'utf8');

  // O Vite gera um arquivo JS com hash. Encontre o arquivo exato citado no HTML,
  // em vez de adivinhar o nome a cada compilação.
  const moduleTag = /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["'][^"']+\.js["'])[^>]*><\/script>/gi;
  const matches = [...html.matchAll(moduleTag)];
  if (matches.length !== 1) {
    throw new Error(`Esperava um único script de módulo do Vite; encontrei ${matches.length}.`);
  }
  const [tag] = matches[0];
  const src = /\bsrc=["']([^"']+)["']/.exec(tag)?.[1];
  if (!src || !src.startsWith('./assets/') || src.includes('..')) {
    throw new Error('Caminho inesperado para o bundle: ' + src);
  }
  const jsFile = resolve(buildDir, src);
  if (!existsSync(jsFile)) throw new Error('Script principal não existe: ' + jsFile);

  const script = readFileSync(jsFile, 'utf8').replace(/<\/script/gi, '<\\/script');
  const files = walk(join(buildDir, 'assets'));
  const fixedBackground = files.some((path) =>
    relative(buildDir, path).replaceAll('\\', '/') === 'assets/cenario/rio_fundo_fixo.png');

  const assets = {};
  for (const file of files) {
    const key = relative(buildDir, file).replaceAll('\\', '/');
    const ext = extname(file).toLowerCase();
    if (!MIME_TYPES[ext]) continue;

    // Evita incorporar oito fundos antigos quando a nova arte já existe.
    if (fixedBackground && /^assets\/cenario\/0[1-8]_/.test(key)) continue;
    assets[key] = `data:${MIME_TYPES[ext]};base64,${readFileSync(file).toString('base64')}`;
  }

  if (!fixedBackground && !Object.keys(assets).some((name) =>
    /^assets\/cenario\/0[1-8]_/.test(name))) {
    throw new Error('Nenhum cenário foi encontrado em dist/assets/cenario.');
  }
  for (let n = 1; n <= 4; n += 1) {
    const frame = `assets/inimigos/tipo1/frame_${String(n).padStart(2, '0')}.png`;
    if (!assets[frame]) throw new Error('Quadro de inimigo ausente: ' + frame);
  }

  // O HTML contém tudo: código de Phaser + texturas + cenário + inimigos.
  // Evita solicitação a /html/<upload-id>/assets/* no CDN do itch.io.
  const json = JSON.stringify(assets).replaceAll('<', '\\u003c');
  const inlined = [
    '<script>',
    `window.__SOBERANIA_SINGLEFILE_ASSETS__ = ${json};`,
    '</script>',
    '<script type="module">',
    script,
    '</script>',
  ].join('\n');
  const result = html.replace(tag, () => inlined);

  mkdirSync(dirname(outputFile), { recursive: true });
  writeFileSync(outputFile, result, 'utf8');
  return {
    file: outputFile,
    assetCount: Object.keys(assets).length,
    bytes: statSync(outputFile).size,
    fixedBackground,
  };
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptFile) {
  const root = resolve(dirname(scriptFile), '..');
  try {
    const result = generateSingleFile({
      buildDir: join(root, 'dist'),
      outputFile: join(root, 'itch-build', 'index.html'),
    });
    console.log('Exportação itch.io pronta:', result.file);
    console.log('Imagens/recursos incorporados:', result.assetCount);
    console.log('Cenário fixo do Rio:', result.fixedBackground ? 'incluído' : 'fallback antigo');
    console.log('Tamanho:', (result.bytes / 1024 / 1024).toFixed(2), 'MB');
    console.log('Envie itch-build/index.html DIRETAMENTE ao itch.io (sem ZIP).');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
