import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,unlinkSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {MUSIC,MusicPlayer} from '../src/audio/music.js';
import {verifyPagesAudio} from '../scripts/verify-pages-audio.mjs';
const workflow=readFileSync(new URL('../.github/workflows/pages-playtest.yml',import.meta.url),'utf8');

function fixture(callback){
 const root=mkdtempSync(join(tmpdir(),'soberana-pages-audio-'));
 try{
   mkdirSync(join(root,'assets','musicas'),{recursive:true});
   writeFileSync(join(root,'index.html'),
      '<!doctype html><script type="module" crossorigin src="./assets/index-FAKE.js"></script>');
   writeFileSync(join(root,'assets','index-FAKE.js'),'console.log("ok");');
   for(const file of Object.values(MUSIC))
     writeFileSync(join(root,'assets','musicas',file),Buffer.alloc(8192,23));
   return callback(root);
 }finally{rmSync(root,{recursive:true,force:true});}
}
test('Pages usa site Vite completo; não publica HTML único gigantesco',()=>{
 assert.match(workflow,/cp -a dist\/\. pages-site\//);
 assert.doesNotMatch(workflow,/cp itch-build\/index\.html pages-site\/index\.html/);
 assert.match(workflow,/node scripts\/verify-pages-audio\.mjs pages-site/);
 assert.match(workflow,/npm run build:itch/);
 assert.match(workflow,/itch-build\/operacao-soberania-itch\.zip/);
});
test('validação exige todas as músicas como MP3s independentes no Pages',()=>{
 fixture(root=>{
   const result=verifyPagesAudio(root);
   assert.equal(result.count,Object.keys(MUSIC).length);
   assert.equal(result.bytes,8192*result.count);
   const lost=Object.values(MUSIC)[0];
   unlinkSync(join(root,'assets','musicas',lost));
   assert.throws(()=>verifyPagesAudio(root),/Músicas MP3 não publicadas/);
 });
});
test('validação rejeita HTML único com MP3s inline e arquivos truncados',()=>{
 fixture(root=>{
   const lost=Object.values(MUSIC)[0];
   writeFileSync(join(root,'assets','musicas',lost),Buffer.alloc(500));
   assert.throws(()=>verifyPagesAudio(root),/vazias ou truncadas/);
   writeFileSync(join(root,'index.html'),
     '<script>window.__SOBERANIA_SINGLEFILE_ASSETS__={}</script>');
   assert.throws(()=>verifyPagesAudio(root),/HTML único/);
 });
});
test('reprodução normal usa caminho externo e permite retomar após gesto',async()=>{
 const audio={
   paused:true,ended:false,volume:0,muted:false,
   addEventListener(){},removeAttribute(){},load(){},
   pause(){this.paused=true;},
   play(){this.paused=false;return Promise.resolve();},
 };
 const doc=new EventTarget();doc.hidden=false;
 const p=new MusicPlayer({createAudio:()=>audio,document:doc});
 p.play('menu');
 assert.equal(audio.src,'./assets/musicas/'+MUSIC.menu);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(audio.paused,false);
 p.setPaused(true);
 assert.equal(audio.paused,true);
 p.setPaused(false);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(audio.paused,false);
 p.destroy();
});
