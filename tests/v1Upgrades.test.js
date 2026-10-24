import test from 'node:test';
import assert from 'node:assert/strict';
import {
  V1_UPGRADES, V1_SUPREMES, v1CountryLevels, nextV1Options, chooseV1Upgrade,
  v1SupremeFor, v1CombatStats, horizontalOffsets, mayDuplicateProjectile,
  MAX_VISUAL_PROJECTILES, MAX_PROJECTILE_GENERATION,
} from '../src/gameplay/v1Upgrades.js';
import { FIRST_UPGRADES } from '../src/gameplay/upgrades.js';

test('V1 contains 50 unique national upgrades and correct 9/10 gates', () => {
  assert.equal(Object.keys(V1_UPGRADES).length, 5);
  for (const [id, levels] of Object.entries(V1_UPGRADES)) {
    assert.equal(levels.length, 10, id);
    assert.equal(new Set(levels.map(item => item.title)).size, 10);
    assert.deepEqual(levels.map(item => item.level), [1,2,3,4,5,6,7,8,9,10]);
    assert.equal(levels[8].kind, 'ultimate');
    assert.equal(levels[9].kind, 'transformation');
    for (const tier of [2,4,6,8]) assert.equal(levels[tier-1].kind, 'secondary');
    assert.ok(V1_SUPREMES[id]);
  }
});
test('ten choices unlock only one ultimate and final transformation', () => {
  const country = {choices:Array(10).fill('br')};
  assert.equal(v1SupremeFor(country), 'br');
  const levels = v1CountryLevels(country);
  assert.equal(levels.br, 10);
  assert.equal(v1CombatStats(country).transformed, 'br');
  assert.equal(v1CombatStats(country).horizontalSpread, 16);
  assert.ok(v1CombatStats(country).basicInterval<100);
  assert.equal(v1SupremeFor({choices:['us','us','us','us','br','br','br','jp','jp','jp']}), null);
  assert.equal(chooseV1Upgrade(country,'br'), null);
});
test('a country advances to its next immediate upgrade without towers', () => {
  const state={choices:['br','us','br']};
  const options=nextV1Options(state,FIRST_UPGRADES);
  assert.equal(options.find(x=>x.id==='br').level,3);
  assert.equal(options.find(x=>x.id==='br').title,'Motor Esquentando');
  assert.equal(options.find(x=>x.id==='us').level,2);
  assert.equal(options.find(x=>x.id==='us').title,'O Grande Muro™');
  assert.ok(options.every(x=>x.tower===false && !x.locked));
  assert.deepEqual(chooseV1Upgrade(state,'cn').choices,['br','us','br','cn']);
});
test('hybrid combinations retain independent offensive effects without country shield upgrades', () => {
  const stats=v1CombatStats({choices:['br','br','br','us','us','us','cn','cn','cn']});
  assert.ok(stats.basicInterval<400);
  assert.equal(stats.heat,true);
  assert.equal(stats.fragmentation,false);
  assert.equal(stats.collateral,false);
  assert.equal(stats.usRocketRadius,13);
  assert.equal(stats.bulletsPerShot,3);
  assert.equal(stats.shieldRegen,3.5);
  assert.equal(stats.shieldBonus,0);
  assert.equal(stats.shieldPulse,false);
  assert.equal(stats.shieldIntercept,false);
});
test('derived projectile cannot spawn a second descendant', () => {
  assert.equal(MAX_PROJECTILE_GENERATION,1);
  assert.equal(mayDuplicateProjectile(0,0.5,0.3),true);
  assert.equal(mayDuplicateProjectile(1,0.5,0.3),false);
  assert.equal(mayDuplicateProjectile(0,0.5,0.7),false);
  assert.ok(MAX_VISUAL_PROJECTILES<120);
});
test('Brazil spread is positional rather than angular', () => {
  assert.deepEqual(horizontalOffsets(3,6),[-6,0,6]);
  assert.deepEqual(horizontalOffsets(1,6),[0]);
});
