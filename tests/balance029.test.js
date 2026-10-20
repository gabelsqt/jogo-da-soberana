import test from 'node:test';
import assert from 'node:assert/strict';
import { combatStatsFor, combatStatsForLoadout } from '../src/gameplay/upgrades.js';
import { PLASMA_DAMAGE, PLASMA_EVERY_SHOTS, PLASMA_HALF_WIDTH } from '../src/gameplay/weaponEffects.js';
import { enemyStats } from '../src/gameplay/enemies.js';

test('cadência inicial padrão é 3,33 tiros por segundo, também no laboratório', () => {
  assert.equal(combatStatsFor(null).basicInterval, 300);
  assert.equal(combatStatsForLoadout([]).basicInterval, 300);
  assert.equal(combatStatsForLoadout(['br']).basicInterval, 200);
});
test('Lightstick de nível 1 tem menor dano, largura e frequência', () => {
  assert.equal(PLASMA_EVERY_SHOTS, 4);
  assert.equal(PLASMA_DAMAGE, 2);
  assert.equal(PLASMA_HALF_WIDTH, 14);
  assert.equal(combatStatsForLoadout(['jp']).plasmaEvery, PLASMA_EVERY_SHOTS);
});
test('todos os tiros dos bombardeiros Tipo 3 possuem exatamente um HP', () => {
  for (let level=1; level<=10; level+=1) assert.equal(enemyStats(3, level).shotHp, 1);
});
