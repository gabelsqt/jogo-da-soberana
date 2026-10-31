import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {NATIONAL_SPECIAL_FILES,generateNationalSpecialSfx}
  from '../scripts/generate-national-special-sfx.mjs';
import {SFX_FILES} from '../src/audio/sfx.js';

test('quatorze sons retrô, incluindo teclas da introdução, em PCM mono 22.050 Hz',()=>{
 const dir=mkdtempSync(join(tmpdir(),'soberania-nacional-sfx-'));
 try{
   const sounds=generateNationalSpecialSfx(dir);
   assert.equal(sounds.length,14);
   assert.equal(readdirSync(dir).length,14);
   const durations=[];
   for(const [key,name] of Object.entries(NATIONAL_SPECIAL_FILES)){
     assert.equal(SFX_FILES[key],name);
     const wav=readFileSync(join(dir,name));
     assert.equal(wav.toString('ascii',0,4),'RIFF');
     assert.equal(wav.toString('ascii',8,12),'WAVE');
     assert.equal(wav.readUInt16LE(20),1,'PCM');
     assert.equal(wav.readUInt16LE(22),1,'mono');
     assert.equal(wav.readUInt32LE(24),22050);
     assert.equal(wav.readUInt16LE(34),16,'16-bit container');
     assert.equal(wav.readUInt32LE(40),wav.length-44);
     assert.ok(wav.length>(key==='introKey'?1200:6000),key);
     let energy=0;
     for(let off=44;off<wav.length;off+=2){
       const v=wav.readInt16LE(off);energy+=v*v;
     }
     assert.ok(energy/(wav.length/2-22)>1500,key+' deve ser audível');
     durations.push(wav.length);
   }
   assert.ok(new Set(durations).size>4,'diferentes eventos têm durações distintas');
   assert.ok(sounds.find(s=>s.id==='introKey').duration<0.08);
   assert.ok(sounds.find(s=>s.id==='introAlert').duration>0.30);
   assert.ok(sounds.find(s=>s.id==='introNotice').duration>0.20);
   const shot=sounds.find(s=>s.id==='krBasicShot');
   assert.ok(shot,'laser principal coreano sintetizado');
   assert.ok(shot.duration>=0.24&&shot.duration<=0.26,
     'tiro coreano mais longo que o antigo disparo de 0.17s');
   assert.match(shot.file,/kr_tiro_laser_v2\.wav$/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('ganchos reproduzem cada som na ação e nunca em todos os frames',()=>{
 const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 for(const id of [
   'brFireworkLaunch','brFireworkBurst','usMissileLaunch','usShockwave',
   'cnCargoDeploy','cnContainerImpact','krDiscoDeploy','krLaserRicochet',
   'krBasicShot',
 ]) assert.ok(scene.includes("playSfx('"+id+"'"),id);
 assert.match(scene,/setSfxLoopActive\('brBonfire',\(this\.arraialNuclei\?\.length\?\?0\)>0/);
 assert.match(scene,/setSfxLoopActive\('krDiscoSpin',\(this\.discoGlobes\?\.length\?\?0\)>0/);
 assert.match(scene,/stopNationalSpecialSfxLoops\(\)/);
 assert.match(scene,/this\.events\.on\('pause',stopNationalSpecialSfxLoops\)/);
 assert.match(scene,/if\(showTargets\.length\)\{\s*playSfx\('krLaserRicochet'/);
 assert.match(scene,/if\(this\.isV1Campaign&&this\.combat\.plasmaEvery>0\)/);
 assert.match(scene,/playSfx\('krBasicShot',\{throttle:70,volumeScale:0\.72\}\)/);
 assert.match(scene,/const specialCountry=this\.isV1Campaign\?this\.specialBuild\?\.primary:null/);
 assert.match(scene,/else if\(!\['ru','jp'\]\.includes\(specialCountry\)\)/);
 assert.match(scene,/playSfx\('brFireworkBurst',\{throttle:95/);
 assert.match(scene,/playSfx\('cnContainerImpact',\{throttle:240/);
});

test('geração automática preserva WAVs russos e exportação em HTML único',()=>{
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 for(const key of ['predev','prebuild']){
   assert.match(pkg.scripts[key],/generate-russian-sfx\.mjs/);
   assert.match(pkg.scripts[key],/generate-national-special-sfx\.mjs/);
 }
 const sfx=readFileSync(new URL('../src/audio/sfx.js',import.meta.url),'utf8');
 assert.match(sfx,/export function stopNationalSpecialSfxLoops\(\)/);
 for(const key of ['brBonfire','krDiscoSpin'])
   assert.ok(sfx.includes("setSfxLoopActive('"+key+"',false)"));
});

