import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getWaveEvents, scheduledEnemyCount } from '../src/gameplay/waves.js';
import {
  getV035WaveEvents, WAVE1_PACING, swarmDanceCenter, swarmDancePosition,
  tacticalManeuverPosition, wave1FormationShooter,
} from '../src/gameplay/formation035.js';

const wave1=()=>getV035WaveEvents('wave1',getWaveEvents('wave1'));

test('onda 1 tem sete enxames e três esquadrilhas menores, sem pico de naves',()=>{
  const events=wave1(),swarms=events.filter(e=>e.type===1),squads=events.filter(e=>e.type===2);
  assert.deepEqual(swarms.map(e=>e.count),[...WAVE1_PACING.swarmCounts]);
  assert.deepEqual(swarms.map(e=>e.at),[...WAVE1_PACING.swarmTimes]);
  assert.deepEqual(squads.map(e=>e.count),[3,4,4]);
  assert.ok(events.every(e=>e.at<=13500 && e.count<=6));
  assert.equal(scheduledEnemyCount(events),47);
  assert.ok(swarms.at(-1).at - swarms[0].at>=12000);
});

test('danças da onda 1 descem ao céu médio sem subir de volta ao topo',()=>{
  for(const pattern of ['lowSweep','lowZigzag']){
    const group={pattern,centerX:480,portalY:120,duration:4.5,count:6,boundToScreen:true};
    let before=-Infinity;
    for(let t=0;t<=45;t++){
      const now=t/10,center=swarmDanceCenter(group,now);
      const slot=swarmDancePosition(group,2,now);
      assert.ok(center.y>=118 && center.y<=245,pattern+':'+t);
      assert.ok(slot.y>=85 && slot.y<=280,pattern+':'+t);
      assert.ok(center.y>=before-0.001,'onda 1 não deve subir: '+pattern);
      before=center.y;
    }
  }
});

test('esquadrilha tática da onda 1 manobra perto do meio da tela',()=>{
  const group={lowFlight:true,portalY:WAVE1_PACING.tacticalPortalY,
    centerX:480,duration:5.1,holdDuration:1.15,count:4,
    direction:1,finalFormation:'triangle',boundToScreen:true};
  for(let step=0;step<=60;step++){
    const pos=tacticalManeuverPosition(group,2,step/10);
    assert.ok(pos.y>=125 && pos.y<=300,'passo '+step+': '+pos.y);
  }
});

test('somente um Tipo 1 por enxame e dois Tipo 2 por esquadrilha disparam',()=>{
  let volleyBudget=0;
  for(const event of wave1()){
    let shooters=0;
    for(let i=0;i<event.count;i++)
      if(wave1FormationShooter(event.type===1?'swarm':'tactical',i,event.count))shooters++;
    assert.equal(shooters,event.type===1?1:2);
    volleyBudget+=shooters;
  }
  assert.equal(volleyBudget,13);
});

test('cadência, dano e trajeto especiais se aplicam somente à onda 1',()=>{
  assert.equal(WAVE1_PACING.bulletDamage,10);
  assert.ok(WAVE1_PACING.bulletSpeedMultiplier<1);
  assert.ok(WAVE1_PACING.impactDamageMultiplier<1);
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/this\.mode==='wave1'\?WAVE1_PACING\.bulletSpeedMultiplier/);
  assert.match(scene,/this\.mode==='wave1'\?WAVE1_PACING\.impactDamageMultiplier/);
  assert.match(scene,/this\.mode!=='wave1'/);
  assert.match(scene,/wave1FormationShooter\('swarm'/);
  assert.match(scene,/wave1FormationShooter\('tactical'/);
});
