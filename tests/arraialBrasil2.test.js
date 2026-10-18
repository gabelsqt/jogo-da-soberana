import test from 'node:test';
import assert from 'node:assert/strict';
import { ARRAIAL, fireworkSchedule, withinBlast, withinFlame } from '../src/gameplay/arraialBrasil2.js';
import { getWaveEvents } from '../src/gameplay/waves.js';
import { getV035WaveEvents } from '../src/gameplay/formation035.js';
import { v1CombatStats, V1_UPGRADES } from '../src/gameplay/v1Upgrades.js';

test('Arraial: anel imediato e explosões fixas em espiral rumo ao centro',()=>{
  const e=fireworkSchedule();
  assert.equal(e.length,20);
  assert.equal(e.filter(f=>f.damaging).length,20);
  assert.equal(e[0].at,0);
  assert.equal(e.filter(f=>f.at===0).length,6);
  assert.ok(e.at(-1).at<2200);
  const radii=e.slice(6).map(f=>Math.hypot(f.x,f.y));
  assert.ok(radii.every((r,i)=>i===0||r<radii[i-1]));
  assert.ok(Math.hypot(e.at(-1).x,e.at(-1).y)<Math.hypot(e[6].x,e[6].y));
  assert.ok(e[7].at-e[6].at>e.at(-1).at-e.at(-2).at);
  for(const f of e.slice(0,6))assert.ok(Math.abs(Math.hypot(f.x,f.y)-100)<1e-9);
});
test('Arraial: raios de explosões e escudo',()=>{
  assert.equal(ARRAIAL.fireworkRadius,37);
  assert.equal(ARRAIAL.finaleRadius,150);
  assert.ok(ARRAIAL.finaleRadius > ARRAIAL.orbitRadius + ARRAIAL.fireworkRadius);
  assert.ok(withinBlast(0,0,37,0,0,ARRAIAL.fireworkRadius));
  assert.ok(!withinBlast(0,0,38,0,0,ARRAIAL.fireworkRadius));
  assert.ok(withinBlast(0,0,150,0,0,ARRAIAL.finaleRadius));
  assert.ok(!withinBlast(0,0,151,0,0,ARRAIAL.finaleRadius));
  assert.ok(withinFlame(0,0,62,0,-73,0));
  assert.ok(!withinFlame(0,0,62,0,-90,0));
  assert.ok(!withinFlame(0,0,62,0,73,0));
  assert.equal(ARRAIAL.finaleDamage,5);
  assert.equal(ARRAIAL.flameInterval,500);
  assert.equal(ARRAIAL.flameDamage,0.5);
  assert.equal(ARRAIAL.shieldDomeRadius,110);
  assert.equal(ARRAIAL.fireRingOffsetY,-43);
  assert.ok(withinFlame(0,0,40,0,50,0,true));
  assert.ok(!withinFlame(0,0,40,0,60,0,true));
});
test('Brasil 2 conserva recarga original e título novo',()=>{
  const stats=v1CombatStats({choices:['br','br']});
  assert.equal(stats.specialCooldown,8000);
  assert.equal(V1_UPGRADES.br[1].title,'Arraial Balístico');
});

test('Onda 2 aceita exclusivamente inimigos Tipo 1 e Tipo 2, inclusive após formação 0.35',()=>{
  const events=getV035WaveEvents('wave2',getWaveEvents('wave2'));
  assert.ok(events.length>0);
  assert.ok(events.some(event=>event.type===1));
  assert.ok(events.some(event=>event.type===2));
  assert.ok(events.every(event=>event.type===1||event.type===2));
});
