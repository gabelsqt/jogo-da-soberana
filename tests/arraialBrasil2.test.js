import test from 'node:test';
import assert from 'node:assert/strict';
import { ARRAIAL, fireworkSchedule, withinBlast, withinFlame } from '../src/gameplay/arraialBrasil2.js';
import { v1CombatStats, V1_UPGRADES } from '../src/gameplay/v1Upgrades.js';

test('Arraial: doze fogos aceleram em círculo antes do final',()=>{
  const e=fireworkSchedule();
  assert.equal(e.length,12);
  assert.ok(e[0].at>0 && e.at(-1).at<4000);
  assert.ok(e[1].at-e[0].at>e.at(-1).at-e.at(-2).at);
  for(const f of e)assert.ok(Math.abs(Math.hypot(f.x,f.y)-100)<1e-9);
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
