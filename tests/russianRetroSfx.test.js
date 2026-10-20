import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RUSSIAN_RETRO_FILES,generateRussianRetroSfx}
  from '../scripts/generate-russian-sfx.mjs';
import {SFX_FILES} from '../src/audio/sfx.js';

test('sintetizador gera sete WAVs retro 16-bit, mono e não silenciosos',()=>{
 const tmp=mkdtempSync(join(tmpdir(),'soberania-russia-'));
 try{
   const generated=generateRussianRetroSfx(tmp);
   assert.equal(generated.length,7);
   assert.equal(readdirSync(tmp).length,7);
   for(const [id,name] of Object.entries(RUSSIAN_RETRO_FILES)){
     assert.equal(SFX_FILES[id],name);
     const b=readFileSync(join(tmp,name));
     assert.equal(b.toString('ascii',0,4),'RIFF');
     assert.equal(b.toString('ascii',8,12),'WAVE');
     assert.equal(b.readUInt16LE(20),1);
     assert.equal(b.readUInt16LE(22),1);
     assert.equal(b.readUInt32LE(24),22050);
     assert.equal(b.readUInt16LE(34),16);
     assert.equal(b.readUInt32LE(40),b.length-44);
     assert.ok(b.length>5000);
     let nonzero=0;
     for(let i=44;i<b.length;i+=2)if(b.readInt16LE(i))nonzero++;
     assert.ok(nonzero>1000,id+' gerou silêncio');
   }
 }finally{rmSync(tmp,{recursive:true,force:true});}
});

test('loops russos têm voz única e são interrompidos na pausa e troca de cena',()=>{
 const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 const sfx=readFileSync(new URL('../src/audio/sfx.js',import.meta.url),'utf8');
 assert.match(game,/setSfxLoopActive\('ruSputnikHum',this\.russianSputniks\.length>0/);
 assert.match(game,/setSfxLoopActive\('ruIceBreath',breathActive/);
 assert.match(game,/this\.events\.once\('shutdown'/);
 assert.match(game,/this\.events\.on\('pause',stopRussianSfxLoops\)/);
 assert.match(sfx,/const activeLoops=new Map\(\)/);
 assert.match(sfx,/if\(previous\)\{/);
 assert.match(sfx,/sound\.loop=true/);
});

test('todos os gatilhos russos têm efeitos e antirrepique',()=>{
 const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 for(const id of ['ruSputnikLaunch','ruSputnikFreeze','ruCrystalDeep',
   'ruFrozenShatter','ruSputnikCollapse'])
   assert.ok(game.includes("playSfx('"+id+"'"),id);
 assert.match(game,/const firstContact=!isSputnikCrystalized\(enemy,this\.elapsed\)/);
 assert.match(game,/if\(stage>=3\)playSfx\('ruCrystalDeep'/);
 assert.match(game,/if\(frozenShatter\)this\.shatterRussianEnemy\(enemy\)/);
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.match(pkg.scripts.predev,/generate-russian-sfx/);
 assert.match(pkg.scripts.prebuild,/generate-russian-sfx/);
});
