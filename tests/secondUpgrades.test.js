import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SECOND_UPGRADES,
  ELECTRIC_FENCE_EXTRA_RANGE,
  ELECTRIC_FENCE_RADIUS_BONUS,
  ELECTRIC_FENCE_DAMAGE,
  ELECTRIC_FENCE_INTERVAL,
  ELECTRIC_SLOW_FACTOR,
  ELECTRIC_SLOW_DURATION,
  COLLATERAL_RADIUS,
  COLLATERAL_DAMAGE,
  RESIDUAL_DURATION,
  RESIDUAL_DAMAGE,
  RESIDUAL_HALF_WIDTH,
  normalizeSecondUpgradeIds,
  secondUpgradeCountries,
  applySecondUpgradeStats,
  electricFieldReaches,
  canFireElectricFence,
  vacuumRiftAppearance,
  strategicRecoilIntensity,
  strategicKnockback,
} from '../src/gameplay/secondUpgrades.js';
import { combatStatsForLoadout } from '../src/gameplay/upgrades.js';

test('nível 2 de cada país não cria torre nem pula escolhas', () => {
  assert.deepEqual(Object.keys(SECOND_UPGRADES), ['br', 'us', 'jp', 'ru', 'cn']);
  assert.deepEqual(Object.values(SECOND_UPGRADES).map((value) => value.title), [
    'Gambiarra Balística II', 'Dano Colateral', 'Encore!',
    'Recuo Estratégico', 'Compre 2, Leve 3',
  ]);
  assert.ok(Object.values(SECOND_UPGRADES).every((value) => value.tower === false));
  assert.deepEqual(secondUpgradeCountries({ choices: ['br', 'jp', 'br', 'us', 'us'] }),
    ['br', 'us']);
  assert.deepEqual(secondUpgradeCountries({ choices: ['br', 'jp', 'cn'] }), []);
  assert.deepEqual(normalizeSecondUpgradeIds(['br', 'cn', 'br', 'xx']), ['br', 'cn']);
  assert.deepEqual(normalizeSecondUpgradeIds(null), []);
});

test('nível 2 modifica a cadência brasileira e mantém dano base', () => {
  const base = combatStatsForLoadout(['br', 'us', 'jp', 'ru', 'cn']);
  const stats = applySecondUpgradeStats(base, ['br', 'us', 'jp', 'ru', 'cn']);
  assert.equal(stats.electricFence, false);
  assert.equal(stats.collateral, true);
  assert.equal(stats.residualSlash, true);
  assert.equal(stats.strategicRecoil, true);
  assert.equal(stats.basicInterval, Math.round(base.basicInterval / 1.25));
  assert.equal(stats.basicDamage, base.basicDamage);
  assert.equal(stats.bulletsPerShot, base.bulletsPerShot + 1);
  assert.equal(stats.bulletsPerShot, 3);
  const noSecond = applySecondUpgradeStats(base, []);
  assert.equal(noSecond.electricFence, false);
  assert.equal(noSecond.collateral, false);
  assert.equal(noSecond.residualSlash, false);
  assert.equal(noSecond.strategicRecoil, false);
  assert.equal(noSecond.bulletsPerShot, base.bulletsPerShot);
});

test('cerca brasileira amplia arco das cúpulas sem criar escudo vazio', () => {
  assert.equal(ELECTRIC_FENCE_RADIUS_BONUS, 18);
  assert.equal(ELECTRIC_FENCE_EXTRA_RANGE, 35);
  assert.equal(ELECTRIC_FENCE_DAMAGE, 1);
  assert.equal(ELECTRIC_FENCE_INTERVAL, 800);
  assert.equal(ELECTRIC_SLOW_FACTOR, 0.90);
  assert.equal(ELECTRIC_SLOW_DURATION, 400);

  // Canhão: raio 62 + 18 = 80, zona externa chega a 115px do centro.
  const cx = 480, cy = 504, radius = 62 + ELECTRIC_FENCE_RADIUS_BONUS;
  assert.equal(electricFieldReaches(cx, cy, radius, cx, cy - 115), true);
  assert.equal(electricFieldReaches(cx, cy, radius, cx, cy - 116), false);
  assert.equal(electricFieldReaches(cx, cy, radius, cx, cy - radius), true);
  assert.equal(electricFieldReaches(cx, cy, radius, cx, cy + 31), false);
  assert.equal(electricFieldReaches(cx, cy, radius, cx - 260, cy - 40), false);

  // Animal de outro país: raio 46 + 18 = 64 e campo acima da plataforma.
  const towerRadius = 46 + ELECTRIC_FENCE_RADIUS_BONUS;
  assert.equal(electricFieldReaches(280, 493, towerRadius, 280, 398), true);
  assert.equal(electricFieldReaches(280, 493, towerRadius, 280, 380), false);
});

test('cada cúpula tem recarga própria de 800 ms e para com escudo zerado', () => {
  assert.equal(canFireElectricFence(-Infinity, 0, 80), true);
  assert.equal(canFireElectricFence(1000, 1799, 80), false);
  assert.equal(canFireElectricFence(1000, 1800, 80), true);
  assert.equal(canFireElectricFence(1000, 1900, 0), false);
  assert.equal(canFireElectricFence(1000, 1900, 1), true);
  assert.equal(canFireElectricFence(1000, 1300, -1), false);
  const centralLast = 1000;
  const towerLast = 0;
  assert.equal(canFireElectricFence(centralLast, 1450, 80), false);
  assert.equal(canFireElectricFence(towerLast, 1450, 65), true);
});

test('EUA: explosão Dano Colateral é maior que a Fragmentação, mas é única', () => {
  assert.equal(COLLATERAL_RADIUS, 94);
  assert.ok(COLLATERAL_RADIUS > 78);
  assert.equal(COLLATERAL_DAMAGE, 0.75);
});

test('Coreia do Sul: fenda de vácuo abre, dura mais e depois desaparece sem saltos', () => {
  assert.equal(RESIDUAL_DURATION, 2200);
  assert.equal(RESIDUAL_DAMAGE, 1);
  assert.equal(RESIDUAL_HALF_WIDTH, 12);
  const created = vacuumRiftAppearance(0);
  const opening = vacuumRiftAppearance(110);
  const open = vacuumRiftAppearance(300);
  const held = vacuumRiftAppearance(1500);
  const closing = vacuumRiftAppearance(2100);
  const finished = vacuumRiftAppearance(2200);
  assert.ok(created.width > 0);
  assert.ok(opening.width > created.width);
  assert.ok(open.width > opening.width);
  assert.ok(Math.abs(held.width - open.width) < 0.01);
  assert.ok(closing.width < held.width);
  assert.ok(closing.alpha < held.alpha);
  assert.deepEqual(finished, { width: 0, alpha: 0 });
  assert.deepEqual(vacuumRiftAppearance(5000), { width: 0, alpha: 0 });
});

test('China: terceiro projétil aparece em TODAS as rajadas', () => {
  const base = combatStatsForLoadout(['cn']);
  const upgraded = applySecondUpgradeStats(base, ['cn']);
  assert.equal(base.bulletsPerShot, 2);
  assert.equal(upgraded.bulletsPerShot, 3);
  assert.equal(upgraded.basicInterval, base.basicInterval);
  const other = applySecondUpgradeStats(combatStatsForLoadout(['us']), ['us']);
  assert.equal(other.bulletsPerShot, 1);
  assert.equal(applySecondUpgradeStats(upgraded, []).bulletsPerShot, 3,
    'não reinicia o upgrade se aplicar outro modificador ao loadout já processado');
});

test('Rússia: intensidade visual e impulso escalam juntos, perto do solo', () => {
  assert.equal(strategicRecoilIntensity(0), 0);
  assert.equal(strategicRecoilIntensity(160), 0);
  assert.equal(strategicRecoilIntensity(300), 0.5);
  assert.equal(strategicRecoilIntensity(440), 1);
  assert.equal(strategicRecoilIntensity(520), 1);
  assert.equal(strategicKnockback(0.12, 0), 0.12);
  assert.equal(strategicKnockback(0.12, 160), 0.12);
  assert.ok(Math.abs(strategicKnockback(0.12, 300) - 0.18) < 1e-10);
  assert.equal(strategicKnockback(0.12, 440), 0.24);
  assert.equal(strategicKnockback(0.12, 520), 0.24);
});
