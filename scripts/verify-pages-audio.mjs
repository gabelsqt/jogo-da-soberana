// Impede publicações silenciosas: o site do Pages deve servir os MP3
// separadamente. Exportações de HTML único para itch.io seguem independentes.
import {existsSync,readFileSync,statSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {MUSIC} from '../src/audio/music.js';

export function verifyPagesAudio(siteDir){
  const home=resolve(siteDir);
  const index=join(home,'index.html');
  if(!existsSync(index))throw new Error('GitHub Pages sem index.html');
  const html=readFileSync(index,'utf8');
  if(html.includes('__SOBERANIA_SINGLEFILE_ASSETS__'))
    throw new Error('GitHub Pages recebeu HTML único: MP3 precisa ser carregado externamente');
  if(!/<script[^>]*type="module"[^>]*src="\.\/assets\/[^"]+\.js"/.test(html))
    throw new Error('GitHub Pages não tem referência ao bundle Vite externo');
  const scriptName=html.match(/src="(\.\/assets\/[^"]+\.js)"/)?.[1];
  if(!scriptName||!existsSync(resolve(home,scriptName)))
    throw new Error('Bundle JavaScript do site ausente');
  const missing=[],small=[];
  for(const file of Object.values(MUSIC)){
    const path=join(home,'assets','musicas',file);
    if(!existsSync(path))missing.push(file);
    else if(statSync(path).size<4096)small.push(file);
  }
  if(missing.length)throw new Error('Músicas MP3 não publicadas: '+missing.join(', '));
  if(small.length)throw new Error('Músicas MP3 vazias ou truncadas: '+small.join(', '));
  return {count:Object.values(MUSIC).length,site:home,bytes:Object.values(MUSIC).reduce(
    (acc,file)=>acc+statSync(join(home,'assets','musicas',file)).size,0)};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const result=verifyPagesAudio(process.argv[2]||'pages-site');
    console.log('GitHub Pages verificado: '+result.count+' MP3s externos ('+
      (result.bytes/1048576).toFixed(2)+' MiB), reproduzíveis sem data URIs');
  }catch(error){console.error(error);process.exitCode=1;}
}
