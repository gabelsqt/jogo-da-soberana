import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {specialBlastRadius,blastCatchesTarget,SPECIAL_BLAST_MAX_RADIUS} from '../src/gameplay/specialBlast.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';
import {estimatedBossDps,finaleBossHp} from '../src/gameplay/finaleBalance.js';
import {insideIceBreathCone,chillType6Bomb,ICE_BREATH_BOMB_SPEED_FACTOR,
  ICE_BREATH_BOMB_DAMAGE,iceBreathTickDamage} from '../src/gameplay/iceBreath.js';
import {TYPE6_BOMB_OFFSETS,TYPE6_HANGAR_COUNT,TYPE6_HANGAR_START_SECONDS,
 TYPE6_HANGAR_INTERVAL_SECONDS,type6HangarDue} from '../src/gameplay/type6Salvos.js';
const stats=(id,n)=>v1CombatStats({choices:Array(n).fill(id)});
const src=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('tiro especial neutro tem raio, hitbox e dano reduzidos',()=>{
  assert.equal(specialBlastRadius(1000,0.58),SPECIAL_BLAST_MAX_RADIUS*0.58);
  assert.equal(blastCatchesTarget(0,0,1000,80,0,0,0.58),false);
  assert.equal(blastCatchesTarget(0,0,1000,80,0,0),true);
  const s=src('../src/scenes/GameScene.js');
  assert.match(s,/special\s*\? this\.add\.circle\(x, y, 5,/);
  assert.match(s,/radiusScale:0\.58,damageScale:0\.40/);
  assert.match(s,/blast\.radiusScale\?\?1/);
  assert.match(s,/blast\.damageScale\?\?1/);
});

test('Encore Infinito reduz pulsos e desenha fluxo contínuo do canhão para cima',()=>{
  const before=stats('jp',9),now=stats('jp',10);
  assert.equal(now.koreaContinuous,true);
  assert.ok(now.basicInterval>=150);
  assert.ok(now.laserDamage<before.laserDamage);
  assert.ok(now.laserDamage*1000/now.basicInterval<40);
  assert.ok(estimatedBossDps(now)<50);
  const scene=src('../src/scenes/GameScene.js');
  assert.match(scene,/this\.combat\.koreaContinuous\?0\.65:1/);
  assert.match(scene,/const flow=this\.time\.now\*0\.00105/);
  assert.match(scene,/const t=\(\(flow\+i\/15\)%1\+1\)%1/);
  assert.match(scene,/beam\.lineBetween\(x\+dx\*prev/);
});

test('Inverno Eterno reduz dano e congela bombas Tipo 6 dentro do cone',()=>{
  const r=stats('ru',10);
  assert.equal(r.transformed,'ru');
  assert.ok(iceBreathTickDamage(r.basicDamage,true)<20);
  assert.ok(iceBreathTickDamage(r.basicDamage)<8);
  assert.ok(estimatedBossDps(r)>100);
  assert.ok(finaleBossHp('wave10',r)>1000);
  assert.ok(ICE_BREATH_BOMB_SPEED_FACTOR<0.4);
  assert.equal(ICE_BREATH_BOMB_DAMAGE,12);
  assert.equal(insideIceBreathCone(480,470,-Math.PI/2,480,270,25),true);
  assert.equal(insideIceBreathCone(480,470,-Math.PI/2,800,270,25),false);
  assert.deepEqual(chillType6Bomb(8,1000),{hp:0,chilledUntil:1360});
  const scene=src('../src/scenes/GameScene.js');
  assert.match(scene,/shot\.iceChilledUntil=chill\.chilledUntil/);
  assert.match(scene,/if\(shot\.hp<=0\)detonateType6Bomb\(this,shot\)/);
  assert.match(scene,/shot\.vx \* dt \* freezeFactor/);
});

test('bombardeio lança 3 bombas simultâneas; hangar programa 8 inimigos escalonados',()=>{
  assert.deepEqual(TYPE6_BOMB_OFFSETS,[-68,0,68]);
  assert.equal(TYPE6_HANGAR_COUNT,8);
  assert.equal(TYPE6_HANGAR_START_SECONDS,2);
  assert.equal(TYPE6_HANGAR_INTERVAL_SECONDS,0.22);
  assert.equal(type6HangarDue(1.9),0);
  assert.equal(type6HangarDue(2),1);
  assert.equal(type6HangarDue(2.21),1);
  assert.equal(type6HangarDue(2.22),2);
  assert.equal(type6HangarDue(2+0.22*7),8);
  assert.equal(type6HangarDue(100),8);
  const encounter=src('../src/gameplay/type6Encounter.js');
  assert.match(encounter,/for\(const offset of TYPE6_BOMB_OFFSETS\)/);
  assert.match(encounter,/const due=type6HangarDue\(a\.elapsed\)/);
  assert.match(encounter,/launchHangarUnit\(scene,enemy,m,a\.spawned\)/);
  assert.match(encounter,/OITO INVASORES EM SEQUÊNCIA/);
  assert.doesNotMatch(encounter,/HANGAR ABERTO — TRÊS INVASORES/);
});
