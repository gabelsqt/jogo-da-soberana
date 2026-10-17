import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLASMA_EVERY_SHOTS,
  PLASMA_DAMAGE,
  PLASMA_HALF_WIDTH,
  PLASMA_RANGE,
  FRAGMENT_RADIUS,
  FRAGMENT_DAMAGE,
  isPlasmaShot,
  laserHitsTarget,
  fragmentHitsTarget,
} from '../src/gameplay/weaponEffects.js';
import { combatStatsFor, combatStatsForLoadout } from '../src/gameplay/upgrades.js';

test('Japão: somente cada terceiro disparo gera uma Katana de Plasma', () => {
  assert.equal(PLASMA_EVERY_SHOTS, 4);
  assert.ok(PLASMA_DAMAGE > 1);
  assert.ok(PLASMA_RANGE >= 960);
  assert.deepEqual(
    Array.from({ length: 9 }, (_, i) => isPlasmaShot(i + 1, true)),
    [false, false, false, true, false, false, false, true, false],
  );
  assert.equal(isPlasmaShot(0, true), false);
  assert.equal(isPlasmaShot(4, false), false);
  assert.equal(combatStatsFor('jp').plasmaEvery, 4);
  assert.equal(combatStatsFor('br').plasmaEvery, 0);
});

test('Katana atinge todas as naves alinhadas, mas não as que estão fora do feixe', () => {
  // Canhão em 480, 494, raio de acerto incluindo silhueta do alvo.
  const start = [480, 460], end = [480, -690];
  assert.equal(laserHitsTarget(...start, ...end, 480, 400, PLASMA_HALF_WIDTH, 12), true);
  assert.equal(laserHitsTarget(...start, ...end, 484, 170, PLASMA_HALF_WIDTH, 10), true);
  assert.equal(laserHitsTarget(...start, ...end, 535, 170, PLASMA_HALF_WIDTH, 10), false);
  assert.equal(laserHitsTarget(...start, ...end, 480, 515, PLASMA_HALF_WIDTH, 10), false);
  assert.equal(laserHitsTarget(...start, ...end, 480, -750, PLASMA_HALF_WIDTH, 10), false);
});

test('Katana funciona em ângulo diagonal e respeita a extremidade do laser', () => {
  assert.equal(laserHitsTarget(0, 0, 100, -100, 50, -50, 4, 0), true);
  assert.equal(laserHitsTarget(0, 0, 100, -100, 80, -10, 4, 0), false);
  assert.equal(laserHitsTarget(0, 0, 100, -100, -4, 4, 5, 0), false);
  assert.equal(laserHitsTarget(1, 1, 1, 1, 1, 1), false);
});

test('EUA: fragmentação atinge vizinhos e não se estende indefinidamente', () => {
  assert.ok(FRAGMENT_RADIUS > 60);
  assert.ok(FRAGMENT_DAMAGE > 0);
  assert.equal(fragmentHitsTarget(400, 200, 400, 200), true);
  assert.equal(fragmentHitsTarget(400, 200, 470, 200), true);
  assert.equal(fragmentHitsTarget(400, 200, 475, 200, 5), true);
  assert.equal(fragmentHitsTarget(400, 200, 520, 200), false);
  assert.equal(combatStatsFor('us').fragmentation, true);
  assert.equal(combatStatsFor('jp').fragmentation, false);
});

test('laboratório pode combinar Katana, Fragmentação e disparos duplos', () => {
  const build = combatStatsForLoadout(['jp', 'us', 'cn']);
  assert.equal(build.plasmaEvery, PLASMA_EVERY_SHOTS);
  assert.equal(build.fragmentation, true);
  assert.equal(build.bulletsPerShot, 2);
  // Um combo não duplica a frequência do laser: conta uma rajada como um disparo.
  assert.equal(isPlasmaShot(4, build.plasmaEvery > 0), true);
  assert.equal(combatStatsForLoadout([]).fragmentation, false);
});
