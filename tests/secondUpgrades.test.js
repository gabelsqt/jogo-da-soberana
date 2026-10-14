import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SECOND_UPGRADES,
  ELECTRIC_FENCE_EXTRA_RANGE,
  ELECTRIC_FENCE_DAMAGE,
  ELECTRIC_FENCE_INTERVAL,
  ELECTRIC_SLOW_FACTOR,
  ELECTRIC_SLOW_DURATION,
  COLLATERAL_RADIUS,
  COLLATERAL_DAMAGE,
  RESIDUAL_DURATION,
  RESIDUAL_DAMAGE,
  PROMO_EVERY_SHOTS,
  normalizeSecondUpgradeIds,
  secondUpgradeCountries,
  applySecondUpgradeStats,
  electricFieldReaches,
  promotionProjectileCount,
  strategicKnockback,
} from '../src/gameplay/secondUpgrades.js';
import { combatStatsForLoadout } from '../src/gameplay/upgrades.js';

test('nível 2 de cada país não cria torre nem pula escolhas', () => {
  assert.deepEqual(Object.keys(SECOND_UPGRADES), ['br', 'us', 'jp', 'ru', 'cn']);
  assert.deepEqual(Object.values(SECOND_UPGRADES).map((value) => value.title), [
    'Minha Casa, Meu Escudo', 'Dano Colateral', 'Corte Residual',
    'Recuo Estratégico', 'Compre 2, Leve 3',
  ]);
  assert.ok(Object.values(SECOND_UPGRADES).every((value) => value.tower === false));
  assert.deepEqual(secondUpgradeCountries({ choices: ['br', 'jp', 'br', 'us', 'us'] }),
    ['br', 'us']);
  assert.deepEqual(secondUpgradeCountries({ choices: ['br', 'jp', 'cn'] }), []);
  assert.deepEqual(normalizeSecondUpgradeIds(['br', 'cn', 'br', 'xx']), ['br', 'cn']);
  assert.deepEqual(normalizeSecondUpgradeIds(null), []);
});

test('nível 2 altera só sua habilidade; não multiplica atributos de nível 1', () => {
  const base = combatStatsForLoadout(['br', 'us', 'jp', 'ru', 'cn']);
  const stats = applySecondUpgradeStats(base, ['br', 'us', 'jp', 'ru', 'cn']);
  assert.equal(stats.electricFence, true);
  assert.equal(stats.collateral, true);
  assert.equal(stats.residualSlash, true);
  assert.equal(stats.strategicRecoil, true);
  assert.equal(stats.promoEvery, 5);
  assert.equal(stats.basicInterval, base.basicInterval);
  assert.equal(stats.basicDamage, base.basicDamage);
  assert.equal(stats.bulletsPerShot, base.bulletsPerShot);
  const noSecond = applySecondUpgradeStats(base, []);
  assert.equal(noSecond.electricFence, false);
  assert.equal(noSecond.collateral, false);
  assert.equal(noSecond.residualSlash, false);
  assert.equal(noSecond.strategicRecoil, false);
  assert.equal(noSecond.promoEvery, 0);
});

test('cerca elétrica alcança faixa externa superior, não todo o céu ou perímetro inferior', () => {
  assert.equal(ELECTRIC_FENCE_EXTRA_RANGE, 35);
  assert.equal(ELECTRIC_FENCE_DAMAGE, 0.5);
  assert.equal(ELECTRIC_FENCE_INTERVAL, 250);
  assert.equal(ELECTRIC_SLOW_FACTOR, 0.90);
  assert.equal(ELECTRIC_SLOW_DURATION, 400);
  const cx = 480, cy = 504, radius = 62;
  assert.equal(electricFieldReaches(cx, cy, radius, 480, 408), true);
  assert.equal(electricFieldReaches(cx, cy, radius, 480, 407), true);
  assert.equal(electricFieldReaches(cx, cy, radius, 480, 406), false);
  assert.equal(electricFieldReaches(cx, cy, radius, 480, 442), true);
  assert.equal(electricFieldReaches(cx, cy, radius, 480, 535), false);
  assert.equal(electricFieldReaches(cx, cy, radius, 220, 410), false);
  assert.equal(electricFieldReaches(280, 493, 46, 280, 420), true,
    'funciona com raio menor do escudo das torres');
});

test('Dano Colateral e Corte Residual têm raios e durações finitos', () => {
  assert.equal(COLLATERAL_RADIUS, 50);
  assert.ok(COLLATERAL_RADIUS < 78, 'não deve ultrapassar a fragmentação original');
  assert.equal(COLLATERAL_DAMAGE, 0.75);
  assert.equal(RESIDUAL_DURATION, 600);
  assert.equal(RESIDUAL_DAMAGE, 1);
});

test('promoção chinesa só adiciona o terceiro projétil a cada QUINTA rajada', () => {
  assert.equal(PROMO_EVERY_SHOTS, 5);
  const shots = Array.from({ length: 12 }, (_, index) =>
    promotionProjectileCount(2, index + 1));
  assert.deepEqual(shots, [2, 2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2]);
  assert.equal(promotionProjectileCount(1, 5), 2, 'combina com outros loadouts');
  assert.equal(promotionProjectileCount(2, 0), 2);
  assert.equal(promotionProjectileCount(2, 7, 0), 2);
});

test('recuo russo aumenta suavemente conforme inimigos chegam perto da base', () => {
  assert.equal(strategicKnockback(0.12, 0), 0.12);
  assert.equal(strategicKnockback(0.12, 160), 0.12);
  assert.ok(Math.abs(strategicKnockback(0.12, 300) - 0.18) < 1e-10);
  assert.equal(strategicKnockback(0.12, 440), 0.24);
  assert.equal(strategicKnockback(0.12, 520), 0.24);
});
