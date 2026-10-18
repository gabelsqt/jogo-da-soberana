import test from 'node:test';
import assert from 'node:assert/strict';
import { ARRAIAL, fireworkSchedule, withinBlast, withinFlame } from '../src/gameplay/arraialBrasil2.js';
import { v1CombatStats, V1_UPGRADES } from '../src/gameplay/v1Upgrades.js';

test('Arraial: anel imediato e explosões fixas em espiral rumo ao centro',()=>{
  const e=fireworkSchedule();
  assert.equal(e.length,12);
  assert.equal(e[0].at,0);
  assert.equal(e.filter(f=>f.at===0).length,6);
  assert.ok(e.at(-1).at<4000);
  const radii=e.slice(6).map(f=>Math.hypot(f.x,f.y));
  assert.ok(radii.every((r,i)=>i===0||r<radii[i-1]));
  assert.ok(Math.hypot(e.at(-1).x,e.at(-1).y)<Math.hypot(e[6].x,e[6].y));
  assert.ok(e[7].at-e[6].at>e.at(-1).at-e.at(-2).at);
  for(const f of e.slice(0,6))assert.ok(Math.abs(Math.hypot(f.x,f.y)-100)<1e-9);
});
test('Arraial: raios de explosões e escudo',()=>{
  assert.ok(withinBlast(0,0,12,0,0,12));
  assert.ok(!withinBlast(0,0,13,0,0,12));
  assert.ok(withinFlame(0,0,62,0,-73,0));
  assert.ok(!withinFlame(0,0,62,0,-90,0));
  assert.ok(!withinFlame(0,0,62,0,73,0));
  assert.equal(ARRAIAL.finaleDamage,5);
  assert.equal(ARRAIAL.flameInterval,500);
  assert.equal(ARRAIAL.flameDamage,0.5);
});
test('Brasil 2 conserva recarga original e título novo',()=>{
  const stats=v1CombatStats({choices:['br','br']});
  assert.equal(stats.specialCooldown,8000);
  assert.equal(V1_UPGRADES.br[1].title,'Arraial Balístico');
});
