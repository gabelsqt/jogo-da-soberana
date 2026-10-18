import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getWaveEvents, WAVE_LAST_SPAWN_MS, scheduledEnemyCount, waveOutcome } from '../src/gameplay/waves.js';
import {
  SWARM_DANCES, SWARM_ENTRIES, TACTICAL_FORMATIONS,
  V035_SWARM_SIZES, V035_SQUAD_SIZES, getV035WaveEvents,
  progressiveGroupCount, swarmDanceCenter, swarmDancePosition, swarmOffset,
  tacticalFormationOffset, tacticalManeuverPosition, tacticalAttackPosition,
  chooseGroupDefenseTarget,
} from '../src/gameplay/formation035.js';
import { labEnemyEvent } from '../src/gameplay/labConfig.js';

test('v0.35 preserva 30 segundos, agenda completa em 19,5s e vitória antecipada', () => {
  for(let wave=0;wave<=9;wave++) {
    const mode='wave'+wave;
    const events=getV035WaveEvents(mode,getWaveEvents(mode));
    assert.ok(events.length>2);
    assert.ok(events.every((event,i)=>
      event.at>=0 && event.at<=WAVE_LAST_SPAWN_MS &&
      (!i || event.at>=events[i-1].at)),mode);
    assert.equal(events.at(-1).at,19500);
    assert.deepEqual(getV035WaveEvents(mode,getWaveEvents(mode)),events);
    const ready={ mode, elapsed:22800, spawned:events.length,
      scheduled:events.length, enemies:0,hostileShots:0 };
    assert.equal(waveOutcome(ready),'cleared',mode);
    assert.equal(waveOutcome({...ready,enemies:1}),null,mode);
    assert.equal(waveOutcome({...ready,spawned:events.length-1}),null,mode);
    assert.equal(waveOutcome({...ready,elapsed:30000,enemies:1}),'survived');
  }
});

test('Tipo 1 chega em enxames progressivos reais de 3–5 até 15–18', () => {
  assert.deepEqual(V035_SWARM_SIZES[0],[3,5]);
  assert.deepEqual(V035_SWARM_SIZES[9],[15,18]);
  assert.equal(progressiveGroupCount(0,1,0),3);
  assert.equal(progressiveGroupCount(0,1,1),5);
  assert.equal(progressiveGroupCount(9,1,0),15);
  assert.equal(progressiveGroupCount(9,1,1),18);
  assert.equal(progressiveGroupCount(9,1,0.5),17);
  for(let wave=0;wave<=9;wave++){
    const events=getV035WaveEvents('wave'+wave,getWaveEvents('wave'+wave));
    const swarms=events.filter(e=>e.type===1);
    assert.ok(swarms.length>=2);
    assert.ok(swarms.every(e=>e.pattern==='swarm'));
    assert.ok(swarms.every(e=>e.count>=V035_SWARM_SIZES[wave][0] &&
      e.count<=V035_SWARM_SIZES[wave][1]));
    assert.equal(swarms[0].count,V035_SWARM_SIZES[wave][0]);
    assert.equal(swarms.at(-1).count,V035_SWARM_SIZES[wave][1]);
    assert.equal(scheduledEnemyCount(swarms),swarms.reduce((s,e)=>s+e.count,0));
    assert.ok(swarms.at(-1).at-swarms.at(-2).at <
      swarms[1].at-swarms[0].at,'entradas mais próximas no clímax');
  }
  assert.deepEqual(SWARM_ENTRIES,['together','staggered']);
  assert.equal(SWARM_DANCES.length,5);
});

test('Tipo 2 substitui entradas soltas ou órbitas por esquadrilhas de 6–16', () => {
  assert.deepEqual(V035_SQUAD_SIZES[0],[6,8]);
  assert.deepEqual(V035_SQUAD_SIZES[9],[12,16]);
  assert.deepEqual(TACTICAL_FORMATIONS,['triangle','square']);
  for(let wave=1;wave<=9;wave++){
    const events=getV035WaveEvents('wave'+wave,getWaveEvents('wave'+wave));
    const squads=events.filter(e=>e.type===2);
    assert.ok(squads.length, 'onda '+wave);
    assert.ok(squads.every(e=>e.pattern==='tactical' && e.group));
    assert.ok(squads.every(e=>e.count>=V035_SQUAD_SIZES[wave][0] &&
      e.count<=V035_SQUAD_SIZES[wave][1]));
  }
  assert.deepEqual(labEnemyEvent(2,10),
    {type:2,level:10,pattern:'tactical',group:true,count:8});
  assert.deepEqual(labEnemyEvent(1,10),
    {type:1,level:10,pattern:'swarm',count:18});
});

test('cinco danças animam o centro sem alterar posições dos sobreviventes', () => {
  for (const pattern of SWARM_DANCES){
    const group={pattern,duration:4,count:18,centerX:470,direction:1};
    const start=swarmDancePosition(group,0,0);
    const middle=swarmDancePosition(group,0,2);
    const end=swarmDancePosition(group,0,4);
    assert.ok(Number.isFinite(start.x)&&Number.isFinite(start.y));
    assert.notDeepEqual(start,middle,pattern);
    assert.ok(end.y>start.y);
    const slot0=swarmOffset(0,18,pattern);
    const slot14=swarmOffset(14,18,pattern);
    assert.deepEqual({
      x:swarmDancePosition(group,14,2).x-swarmDanceCenter(group,2).x,
      y:swarmDancePosition(group,14,2).y-swarmDanceCenter(group,2).y,
    },slot14);
    assert.notDeepEqual(slot0,slot14);
    assert.deepEqual(swarmDancePosition(group,14,4),{
      x:swarmDanceCenter(group,4).x+slot14.x,
      y:swarmDanceCenter(group,4).y+slot14.y,
    });
  }
});

test('manobra tática 2–4s alterna V, linha e coluna sem preencher lacunas', () => {
  const g={ duration:3,centerX:480,count:8,direction:-1,finalFormation:'square',attackOrigin:{x:480,y:164},
    target:{x:280,y:425},attackDuration:3.8 };
  assert.notDeepEqual(tacticalFormationOffset('v',0,8),
    tacticalFormationOffset('line',0,8));
  assert.notDeepEqual(tacticalFormationOffset('line',0,8),
    tacticalFormationOffset('column',0,8));
  for (const t of [0,0.8,1.5,2.4,3]) {
    for (const i of [0,1,5,7]) {
      const pos=tacticalManeuverPosition(g,i,t);
      assert.ok(Number.isFinite(pos.x)&&Number.isFinite(pos.y));
    }
  }
  const missingSlot=3;
  const alive=[0,1,2,4,5,6,7].map(i=>tacticalAttackPosition(g,i,2));
  const slot=tacticalAttackPosition(g,missingSlot,2);
  assert.ok(alive.every(p=>p.x!==slot.x||p.y!==slot.y));
  const last=tacticalAttackPosition(g,2,g.attackDuration);
  const offset=tacticalFormationOffset('square',2,8);
  assert.ok(Math.abs(last.x-(g.target.x+offset.x))<1e-9);
  assert.ok(Math.abs(last.y-(g.target.y+offset.y))<1e-9);
});

test('Tipo 1 escolhe a defesa próxima; Tipo 2 escolhe a vulnerável', () => {
  const near={id:'tower-1',kind:'tower',x:270,y:430,
    tower:{health:100,healthMax:100,shield:60,shieldMax:60}};
  const weak={id:'tower-2',kind:'tower',x:690,y:430,
    tower:{health:16,healthMax:100,shield:5,shieldMax:60}};
  const cannon={id:'cannon',kind:'cannon',x:480,y:450};
  const targets=[cannon,near,weak];
  assert.equal(chooseGroupDefenseTarget(targets,285,160,'swarm'),near);
  assert.equal(chooseGroupDefenseTarget(targets,285,160,'tactical',100,80,80),weak);
  assert.equal(chooseGroupDefenseTarget([cannon,weak],285,160,'swarm'),cannon);
  assert.equal(chooseGroupDefenseTarget([cannon,near],285,160,'tactical',8,3,80),cannon);
  assert.equal(chooseGroupDefenseTarget([cannon],285,160,'swarm'),cannon);
  assert.equal(chooseGroupDefenseTarget([],285,160,'swarm'),null);
});

test('GameScene usa grupos completos e recarrega alvo se torre cai', () => {
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/getV035WaveEvents\(this\.mode,\s*getWaveEvents\(this\.mode,this\.finaleCampaign\)\)/);
  assert.match(scene,/spawnV035Group\(type, level, count, centerX = null\)/);
  assert.match(scene,/enemy\.phase = 'swarmDance'/);
  assert.match(scene,/enemy\.phase = 'tacticalManeuver'/);
  assert.match(scene,/enemy\.phase = 'tacticalAttack'/);
  assert.match(scene,/enemy\.phase = 'dive'/);
  assert.match(scene,/enemy\.formationGroup/);
  assert.match(scene,/group\.target\.tower\?\.health <= 0/);
  assert.match(scene,/chooseV035GroupTarget\(group, center\)/);
});

test('Tipo 2 faz círculos completos e para em formação antes de descer', () => {
  const group={duration:6,holdDuration:1.6,centerX:480,count:4,finalFormation:'triangle'};
  const start=tacticalManeuverPosition(group,0,0);
  const moving=tacticalManeuverPosition(group,0,1.1);
  const stopped=tacticalManeuverPosition(group,0,4.4);
  assert.notDeepEqual(moving,start);
  assert.deepEqual(tacticalManeuverPosition(group,0,5),stopped);
  assert.deepEqual(tacticalManeuverPosition(group,0,6),stopped);
  assert.deepEqual(tacticalManeuverPosition(group,0,7),stopped);
  const column=tacticalFormationOffset('triangle',0,4);
  assert.ok(Math.abs(stopped.x-(480+column.x))<1e-9);
  assert.ok(Math.abs(stopped.y-(125+column.y))<1e-9);
});
test('Tipo 1 e Tipo 2 têm manobras mais longas antes da descida',()=>{
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/FloatBetween\(7\.5, 9\.5\)/);
  assert.match(scene,/FloatBetween\(7\.5, 9\)/);
  assert.match(scene,/holdDuration: kind === 'tactical' \? 1\.8 : Phaser\.Math\.FloatBetween\(1\.2, 1\.8\)/);
});
