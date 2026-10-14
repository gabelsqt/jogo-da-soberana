import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateSingleFile } from '../scripts/build-itch.mjs';

function withBuild(includeFixed, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'soberania-itch-'));
  try {
    const dist = join(dir, 'dist');
    mkdirSync(join(dist, 'assets', 'cenario'), { recursive: true });
    mkdirSync(join(dist, 'assets', 'inimigos', 'tipo1'), { recursive: true });
    writeFileSync(join(dist, 'index.html'), [
      '<!doctype html><html><head>',
      '<script type="module" crossorigin src="./assets/index-testhash.js"></script>',
      '</head><body><main id="game"></main></body></html>',
    ].join(''));
    writeFileSync(join(dist, 'assets', 'index-testhash.js'), 'const game = "ready";');
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    for (let i = 1; i <= 4; i += 1) {
      writeFileSync(join(dist, 'assets', 'inimigos', 'tipo1',
        `frame_${String(i).padStart(2, '0')}.png`), png);
    }
    writeFileSync(join(dist, 'assets', 'cenario', '01_ceu_noturno_estrelado.png'), png);
    if (includeFixed) {
      writeFileSync(join(dist, 'assets', 'cenario', 'rio_fundo_fixo.png'), png);
    }
    fn({
      buildDir: dist,
      outputFile: join(dir, 'itch-build', 'index.html'),
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('exportador itch gera HTML sem caminhos para JS/imagens externas', () => {
  withBuild(true, (paths) => {
    const result = generateSingleFile(paths);
    const html = readFileSync(result.file, 'utf8');
    assert.equal(result.fixedBackground, true);
    assert.equal(result.assetCount, 5, 'imagem nova e quatro quadros de inimigo');
    assert.ok(html.includes('const game = "ready";'));
    assert.ok(html.includes('window.__SOBERANIA_SINGLEFILE_ASSETS__'));
    assert.ok(html.includes('data:image/png;base64,'));
    assert.ok(html.includes('rio_fundo_fixo.png'));
    assert.ok(html.includes('frame_04.png'));
    assert.ok(!html.includes('src="./assets/index-testhash.js"'));
    assert.ok(!html.includes('01_ceu_noturno_estrelado.png'));
  });
});

test('se o cenário novo ainda não foi importado, exporta o fallback antigo', () => {
  withBuild(false, (paths) => {
    const result = generateSingleFile(paths);
    const html = readFileSync(result.file, 'utf8');
    assert.equal(result.fixedBackground, false);
    assert.ok(html.includes('01_ceu_noturno_estrelado.png'));
    assert.equal(result.assetCount, 5);
  });
});

test('exportador rejeita build incompleto, ao invés de gerar jogo com tela preta', () => {
  withBuild(true, (paths) => {
    const htmlFile = join(paths.buildDir, 'index.html');
    writeFileSync(htmlFile, '<html><body>sem script</body></html>');
    assert.throws(() => generateSingleFile(paths), /um único script/);
  });
});
