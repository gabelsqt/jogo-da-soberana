import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  type5ShieldHp,absorbType5Shield,type5ChargeFraction,
  shieldRippleAt,shieldSoftFlashAt,TYPE5_LASER_CHARGE_SECONDS,
  TYPE5_LASER_FIRE_SECONDS,TYPE5_LASER_DAMAGE,
} from '../src/gameplay/type5Combat.js';
import {SFX_FILES,SFX_VARIATIONS} from '../src/audio/sfx.js';

const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const type6=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
const visual6=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');

test('Tipo 5 tem escudo de HP próprio, que não transfere o golpe ao casco',()=>{
  assert.equal(type5ShieldHp(1),12);
  assert.equal(type5ShieldHp(7),24);
  assert.equal(type5ShieldHp(10),30);
  assert.deepEqual(absorbType5Shield(24,6),
    {shield:18,absorbed:6,spill:0,broken:false});
  assert.deepEqual(absorbType5Shield(3,12),
    {shield:0,absorbed:3,spill:0,broken:true});
  assert.deepEqual(absorbType5Shield(0,12),
    {shield:0,absorbed:0,spill:12,broken:false});
  assert.match(scene,/if\(enemy\.type===5 && enemy\.shield>0 && damage<100000\)/);
  assert.match(scene,/this\.showType5ShieldBreak\(enemy\)/);
  assert.match(scene,/if\(enemy\.type===5\)this\.drawType5Effects\(enemy\)/);
});

test('escudos ondulam, com flash curto sem piscar o casco todo',()=>{
  assert.equal(shieldRippleAt(420,100),0.23809523809523814);
  assert.equal(shieldRippleAt(521,100),0);
  assert.equal(shieldRippleAt(0,-Infinity),0);
  assert.ok(shieldSoftFlashAt(110,100)>0);
  assert.equal(shieldSoftFlashAt(170,100),0);
  assert.match(type6,/s\.barrier\.hitAt=scene\.time\.now/);
  assert.match(type6,/if\(!shieldHit&&scene\.time\.now-/);
  assert.match(visual6,/drawShieldImpact\(g,x,y,130,100,ageMs,module\.hitAt\)/);
  assert.match(visual6,/shieldRippleAt\(ageMs,b\.hitAt\)/);
});

test('Tipo 5 avisa cinco segundos de carga antes do raio forte',()=>{
  assert.equal(TYPE5_LASER_CHARGE_SECONDS,5);
  assert.ok(TYPE5_LASER_FIRE_SECONDS>=0.5&&TYPE5_LASER_FIRE_SECONDS<1);
  assert.ok(TYPE5_LASER_DAMAGE>=60);
  assert.equal(type5ChargeFraction(2.5),0.5);
  assert.equal(type5ChargeFraction(7),1);
  const method=scene.slice(scene.indexOf('  updateType5Laser(enemy){'),
    scene.indexOf('  drawType5Effects(enemy){'));
  assert.match(method,/if\(t<charge\)/);
  assert.match(method,/else if\(t<charge\+fire\)/);
  assert.match(method,/if\(!enemy\.laserShotDone\)/);
  assert.match(method,/this\.damageTarget\(target,TYPE5_LASER_DAMAGE\)/);
  assert.match(scene,/if \(enemy\.type!==5 && enemy\.shotTimer >= interval\)/);
});

test('Tipo 4 sobrevive ao laser e retoma patrulha até HP zero',()=>{
  const beginning=scene.indexOf("} else if (enemy.phase === 'laser') {");
  const end=scene.indexOf("} else if (enemy.phase === 'arrival')",beginning);
  assert.ok(beginning>0&&end>beginning);
  const fighter=scene.slice(beginning,end);
  assert.doesNotMatch(fighter,/this\.removeEnemy\(i\)/);
  assert.match(fighter,/enemy\.phase='recover4'/);
  assert.match(fighter,/enemy\.phase='flyby'/);
  assert.match(fighter,/enemy\.flybySerial\+\+/);
  assert.match(scene,/if \(profile\.stages >= 3 \|\| enemy\.type===4\)/);
  assert.match(scene,/playSfx\('fighterWhoosh'/);
});

test('whoosh retrô existe como WAV PCM e varia pitch sem áudio a cada frame',()=>{
  assert.equal(SFX_FILES.fighterWhoosh,'34_tipo4_whoosh_retro.wav');
  assert.deepEqual(SFX_VARIATIONS.fighterWhoosh.pitch,[0.91,1.09]);
  const wav=readFileSync(new URL('../public/assets/sons/34_tipo4_whoosh_retro.wav',import.meta.url));
  assert.equal(wav.toString('ascii',0,4),'RIFF');
  assert.equal(wav.toString('ascii',8,12),'WAVE');
  assert.equal(wav.readUInt16LE(20),1);
  assert.equal(wav.readUInt32LE(24),22050);
  assert.ok(wav.length>10000);
});
