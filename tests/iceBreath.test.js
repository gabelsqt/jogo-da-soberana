import test from 'node:test';
import assert from 'node:assert/strict';
import {ICE_BREATH_RANGE,ICE_BREATH_TICK_MS,iceBreathMotes,insideIceBreathCone} from '../src/gameplay/iceBreath.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';

test('frost cone accepts targets in its forward sector only',()=>{
  const ox=480,oy=470,angle=-Math.PI/2;
  assert.equal(insideIceBreathCone(ox,oy,angle,480,300,10),true);
  assert.equal(insideIceBreathCone(ox,oy,angle,480,100,0),false);
  assert.equal(insideIceBreathCone(ox,oy,angle,690,310,10),false);
  assert.equal(insideIceBreathCone(ox,oy,angle,480,500,0),false);
  assert.equal(insideIceBreathCone(ox,oy,angle,480,500,32),true);
  assert.equal(ICE_BREATH_TICK_MS,110);
  assert.ok(ICE_BREATH_RANGE>=240);
});

test('frost mist flows continuously and stays bounded',()=>{
  const a=iceBreathMotes(-Math.PI/2,0,32);
  const b=iceBreathMotes(-Math.PI/2,500,32);
  assert.equal(a.length,32);
  assert.ok(a.some((p,i)=>p.x!==b[i].x||p.y!==b[i].y));
  assert.ok(a.every(p=>Number.isFinite(p.radius)&&p.alpha>0));
});

test('Inverno Eterno unlocks the cone and maintains freeze and shatter',()=>{
  const stats=v1CombatStats({choices:Array(10).fill('ru')});
  assert.equal(stats.transformed,'ru');
  assert.equal(stats.russianFreezeMs,3000);
  assert.equal(stats.russianShatterRadius,120);
  assert.ok(stats.russianShatterDamage>0);
});
