import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  COLLATERAL_VISUAL_DELAY_MS,
  fenceGlowAt, encoreRimGlowAt,
  isChinaCenterProjectile, strategicDistortionOpacity,
} from '../src/gameplay/secondUpgradeVisuals.js';
import {
  COLLATERAL_RADIUS, COLLATERAL_DAMAGE,
  RESIDUAL_DURATION, RESIDUAL_DAMAGE, RESIDUAL_HALF_WIDTH,
  ELECTRIC_FENCE_DAMAGE, ELECTRIC_FENCE_RADIUS_BONUS, ELECTRIC_FENCE_INTERVAL,
  strategicRecoilIntensity, applySecondUpgradeStats,
} from '../src/gameplay/secondUpgrades.js';
import { combatStatsForLoadout, shotAngles } from '../src/gameplay/upgrades.js';

const source = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
const block = (start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, `trecho não encontrado: ${start}`);
  return source.slice(from, to);
};

test('v0.49 retira a cerca elétrica defensiva da cúpula brasileira',()=>{
  const drawShield=block('  drawShield() {','  showFinaleDefeat(');
  assert.match(drawShield,/CANNON_DOME_RADIUS/);
  assert.match(drawShield,/cannonShieldColor/);
  assert.doesNotMatch(drawShield,/combat\.electricFence|fenceGlowAt|escudo pulsante/);
  assert.equal(ELECTRIC_FENCE_RADIUS_BONUS,18,'constante legada arquivada para laboratório');
  assert.equal(fenceGlowAt(0,0),0,'função de laboratório permanece isolada');
});

test('EUA: segunda detonação tem somente atraso visual, sem danos extras', () => {
  assert.ok(COLLATERAL_VISUAL_DELAY_MS >= 50 && COLLATERAL_VISUAL_DELAY_MS <= 140);
  assert.equal(COLLATERAL_RADIUS, 94);
  assert.equal(COLLATERAL_DAMAGE, 0.75);
  const method = block('  explodeCollateral(x, y) {', '  explodeFragments(');
  const hit = method.indexOf('this.impactInvader(i, COLLATERAL_DAMAGE');
  const delayed = method.indexOf('this.time.delayedCall(COLLATERAL_VISUAL_DELAY_MS');
  assert.ok(hit > 0 && delayed > hit, 'dano continua imediato, antes dos efeitos');
  assert.match(method, /0xffa052/);
  assert.match(method, /const sparks = this\.add\.graphics\(\)/);
  assert.match(method, /targets: ring/);
  assert.match(method, /targets: flash/);
  assert.match(method, /targets: sparks/);
  assert.doesNotMatch(method.slice(delayed), /impactInvader\(|explodeCollateral\(/,
    'o callback atrasado não volta a causar dano');
});

test('Coreia: fenda existente pulsa nas bordas sem alterar largura e duração físicas', () => {
  assert.equal(RESIDUAL_DURATION, 2200);
  assert.equal(RESIDUAL_DAMAGE, 1);
  assert.equal(RESIDUAL_HALF_WIDTH, 12);
  for (const t of [0, 200, 700, 1600, 2100]) {
    const opacity = encoreRimGlowAt(t);
    assert.ok(opacity >= 0.5 && opacity <= 0.94);
  }
  assert.notEqual(encoreRimGlowAt(0), encoreRimGlowAt(200));
  const method = block('  drawVacuumRift(slash, age) {', '  clearResidualSlashes() {');
  assert.match(method, /vacuumRiftAppearance\(age\)/);
  assert.match(method, /encoreRimGlowAt\(age\)/);
  assert.match(method, /Pequenos reflexos nas extremidades/);
  assert.match(source, /if \(this\.combat\.residualSlash && drawFlash\)/);
});

test('Rússia: reflexos de choque crescem perto do solo sem alterar o knockback', () => {
  assert.equal(strategicRecoilIntensity(160), 0);
  assert.equal(strategicRecoilIntensity(300), 0.5);
  assert.equal(strategicRecoilIntensity(440), 1);
  assert.equal(strategicDistortionOpacity(-3), 0.12);
  assert.equal(strategicDistortionOpacity(0.5), 0.32);
  assert.equal(strategicDistortionOpacity(1), 0.52);
  assert.equal(strategicDistortionOpacity(9), 0.52);
  const method = block('  showStrategicRecoilImpact(x, y) {', '  updatePlayerProjectiles(');
  assert.match(method, /strategicDistortionOpacity\(intensity\)/);
  assert.match(method, /graphic\.arc\(0, 0, radius \* 1\.15/);
  assert.match(method, /const radius = 12 \+ intensity \* 33/);
  assert.match(method, /onComplete: \(\) => graphic\.destroy\(\)/);
});

test('China: apenas a terceira bala ganha destaque central e flash triplo', () => {
  assert.deepEqual(
    Array.from({ length: 2 }, (_, i) => isChinaCenterProjectile(i, 2, true)),
    [false, false],
  );
  assert.deepEqual(
    Array.from({ length: 3 }, (_, i) => isChinaCenterProjectile(i, 3, true)),
    [false, true, false],
  );
  assert.equal(isChinaCenterProjectile(1, 3, false), false);
  assert.equal(isChinaCenterProjectile(1.5, 3, true), false);

  const base = combatStatsForLoadout(['cn']);
  const upgraded = applySecondUpgradeStats(base, ['cn']);
  assert.equal(base.bulletsPerShot, 2);
  assert.equal(upgraded.bulletsPerShot, 3);
  assert.equal(upgraded.basicInterval, base.basicInterval);
  assert.equal(shotAngles(-Math.PI / 2, 3).length, 3);
  assert.match(source, /muzzlePositions = volleySize >= 3 \? \[-1, 0, 1\] : \[-1, 1\]/);
  assert.match(source, /isChinaCenterProjectile\(/);
  assert.match(source, /this\.createProjectile\(firingAngle, false, 0, effects, centerGlow\)/);
  assert.match(source, /bullet\.centerGlow \? 11 : 8/);
});

test('nível 2 combinado preserva dano, intervalo e especial da configuração anterior', () => {
  const initial = combatStatsForLoadout(['br', 'us', 'jp', 'ru', 'cn']);
  const upgraded = applySecondUpgradeStats(initial, ['br', 'us', 'jp', 'ru', 'cn']);
  assert.equal(upgraded.basicInterval, Math.round(initial.basicInterval / 1.25));
  assert.equal(upgraded.basicDamage, initial.basicDamage);
  assert.equal(upgraded.basicSpeed, initial.basicSpeed);
  assert.equal(upgraded.knockback, initial.knockback);
  assert.equal(upgraded.specialCooldown, initial.specialCooldown);
  assert.equal(upgraded.plasmaEvery, initial.plasmaEvery);
  assert.equal(upgraded.bulletsPerShot, 3);
  assert.equal(upgraded.collateral, true);
  assert.equal(upgraded.electricFence, false);
  assert.equal(upgraded.residualSlash, true);
  assert.equal(upgraded.strategicRecoil, true);
});
