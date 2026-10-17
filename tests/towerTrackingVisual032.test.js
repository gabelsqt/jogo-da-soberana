import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  chooseTowerTrackingTarget, chooseSuitableTowerTarget, towerBlindZoneY,
  upgradedTowerWeapon,
} from '../src/gameplay/towers.js';
import {
  mechAimAngle, mechLocalAimAngle, mechAimAligned, rotateMechWeapon,
  usesSecondaryMechArt,
} from '../src/gameplay/mechSpriteMounts.js';

const enemy = (uid, x, y, type = 1, hp = 1) =>
  ({ uid, type, hp, sprite: { x, y } });
const tower = (id, role, x = 280) => ({
  x, y: 483, role,
  definition: upgradedTowerWeapon(id, role, role === 'swarm' ? 5 : 7),
});

test('antienxame acompanha nave isolada sem gastar tiro reservado para grupos', () => {
  for (const id of ['br', 'us', 'jp', 'ru', 'cn']) {
    const t = tower(id, 'swarm');
    const single = enemy(1, 290, 215);
    assert.equal(chooseSuitableTowerTarget(t, [single], 54, 390, 960, 540), null, id);
    assert.equal(chooseTowerTrackingTarget(t, [single], 54, 960, 540), single, id);
  }
});

test('destruidora acompanha alvo leve, mas espera alvo resistente para disparar', () => {
  for (const id of ['br', 'us', 'jp', 'ru', 'cn']) {
    const t = tower(id, 'destroyer');
    const light = enemy(1, 275, 210);
    assert.equal(chooseSuitableTowerTarget(t, [light], 54, 390, 960, 540), null, id);
    assert.equal(chooseTowerTrackingTarget(t, [light], 54, 960, 540), light, id);
    const heavy = enemy(2, 350, 250, 5, 24);
    assert.equal(chooseTowerTrackingTarget(t, [light, heavy], 54, 960, 540), heavy, id);
    assert.equal(chooseSuitableTowerTarget(t, [light, heavy], 54, 390, 960, 540), heavy, id);
  }
});

test('a mira continua respeitando radar, bordas e alcance', () => {
  const t = tower('br', 'swarm');
  const forbidden = [
    enemy(1, 270, 53), enemy(2, -20, 190),
    enemy(3, 980, 190), enemy(4, 270, 550),
  ];
  assert.equal(towerBlindZoneY(540), 54);
  assert.equal(chooseTowerTrackingTarget(t, forbidden, 54, 960, 540), null);
  assert.equal(chooseTowerTrackingTarget(t, [enemy(5, 250, 150)], 54, 960, 540)?.uid, 5);
  const t2 = { ...t, definition: { ...t.definition, range: 90 } };
  assert.equal(chooseTowerTrackingTarget(t2, [enemy(5, 250, 150)], 54, 960, 540), null);
});

test('arma espelhada segue corretamente um inimigo que atravessa o céu', () => {
  for (const mirrored of [false, true]) {
    const mountX = mirrored ? 690 : 270, mountY = 415;
    const points = [230, 460, 700].map(x =>
      mechLocalAimAngle(mountX, mountY, x, 190, mirrored));
    for (let i = 1; i < points.length; i++) {
      const delta = Math.atan2(Math.sin(points[i] - points[i - 1]),
        Math.cos(points[i] - points[i - 1]));
      assert.ok(Math.abs(delta) > 0.05, 'mira deve variar com o deslocamento do alvo');
      assert.ok(delta * (mirrored ? -1 : 1) > 0,
        'mira horizontal deve se inverter apenas no contêiner espelhado');
    }
    let current = -Math.PI / 3;
    const goal = points[1];
    for (let frame = 0; frame < 150; frame++) {
      current = rotateMechWeapon(current, goal, 6 / 60);
    }
    assert.equal(mechAimAligned(current, goal), true);
    assert.equal(Number.isFinite(mechAimAngle(mountX, mountY, 230, 190)), true);
  }
});

test('as novas artes usam ponta do canhão que se move com a arma', () => {
  const mounts = readFileSync(new URL('../src/gameplay/mechSpriteMounts.js', import.meta.url), 'utf8');
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(mounts, /muzzleGlow = secondary \?/);
  assert.match(mounts, /weapon\.rotation = rotateMechWeapon/);
  assert.match(mounts, /syncMuzzle\(\);[\s\S]*return mechAimAligned/);
  assert.match(mounts, /muzzlePosition: syncMuzzle/);
  assert.match(scene, /const trackingTarget = firingTarget \?\? chooseTowerTrackingTarget/);
  assert.match(scene, /tower\.visual\.aimAt\(trackingTarget\.sprite\.x, trackingTarget\.sprite\.y, dt\)/);
  assert.match(scene, /if \(!firingTarget \|\| !aimed \|\| towerChargeProgress/);
  assert.match(scene, /const muzzle = tower\.visual\.secondary \? tower\.visual\.muzzlePosition\(\) : null/);
  assert.equal(usesSecondaryMechArt('ru', 'swarm'), true);
  assert.equal(usesSecondaryMechArt('ru', 'destroyer'), false);
});
