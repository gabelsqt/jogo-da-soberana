import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RUSSIAN_RETRO_FILES,generateRussianRetroSfx}
  from '../scripts/generate-russian-sfx.mjs';
import {SFX_FILES} from '../src/audio/sfx.js';

test('sintetizador gera oito WAVs retro 16-bit, mono e não silenciosos',()=>{
 const tmp=mkdtempSync(join(tmpdir(),'soberania-russia-'));
 try{
   const generated=generateRussianRetroSfx(tmp);
   assert.equal(generated.length,8);
   assert.equal(readdirSync(tmp).length,8);
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
 assert.match(game,/setSfxLoopActive\('ruSputnikHum',\(this\.russianSputniks\?\.length\?\?0\)>0/);
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

test('regressão: ausência de Sputnik nunca interrompe partida de outros países',()=>{
 const code=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 const createStart=code.indexOf('  create() {');
 assert.ok(createStart>=0,'GameScene.create foi encontrado');
 const sceneInit=code.slice(createStart,code.indexOf('  createRussianSputnik(',createStart));
 assert.match(sceneInit,/this\.discoGlobes = \[\];/);
 assert.match(sceneInit,/this\.russianSputniks = \[\];/);
 assert.ok(sceneInit.indexOf('this.discoGlobes = [];') <
   sceneInit.indexOf('this.russianSputniks = [];'));
 assert.match(code,/this\.russianSputniks\?\?=\[\];/);
 // Array ausente é tratada como vazia na linha de ativação do som.
 assert.match(code,/\(this\.russianSputniks\?\.length\?\?0\)>0/);
 assert.equal((undefined?.length??0)>0,false);
 assert.equal((null?.length??0)>0,false);
 assert.equal(([]?.length??0)>0,false);
 assert.equal(([{}]?.length??0)>0,true);
});

test('áudio russo v2 grave: som exclusivo de tiro, congelamento só na transição',()=>{
 const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 const sfx=readFileSync(new URL('../src/audio/sfx.js',import.meta.url),'utf8');
 assert.match(game,/if\(this\.isV1Campaign&&this\.combat\.russianFreezeMs>0\)/);
 assert.match(game,/playSfx\('ruBasicShot',\{throttle:88,volumeScale:0\.56\}\)/);
 assert.match(game,/else if\(this\.isV1Campaign&&this\.combat\.russianFreezeMs>0\)/);
 assert.match(game,/else playSfx\('cannon',\{throttle:95,volumeScale:0\.48\}\)/);
 assert.match(game,/const firstFreeze=!!enemy&&enemy\.type!==6/);
 assert.match(game,/if\(applied&&firstFreeze\)/);
 assert.match(game,/else if\(!\['ru','jp'\]\.includes\(specialCountry\)\)/);
 assert.match(sfx,/id==='cannon'\|\|id==='ruBasicShot'\|\|id==='krBasicShot'/);
 assert.equal(SFX_FILES.ruBasicShot,'19_ru_tiro_criogenico_v2.wav');
 assert.ok(Object.entries(SFX_FILES).filter(([key])=>key.startsWith('ru'))
   .every(([,filename])=>filename.endsWith('_v2.wav')));
});
