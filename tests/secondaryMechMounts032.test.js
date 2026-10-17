import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  secondaryMechMount, SECONDARY_MECH_MOUNTS,
  usesSecondaryMechArt, mechLocalAimAngle, rotateMechWeapon,
  mechAimAligned,
} from '../src/gameplay/mechSpriteMounts.js';

test('o Lobo usa encaixe do próprio ombro, não a posição genérica flutuante', () => {
  const mount = secondaryMechMount('ru');
  assert.deepEqual(mount, { x: -19, y: -31, weaponFactor: 0.48 });
  assert.ok(mount.y > -44, 'o canhão do Lobo deve ficar dentro de sua silhueta');
  assert.ok(mount.weaponFactor < 0.6, 'o canhão não deve cobrir a cabeça');
  assert.equal(usesSecondaryMechArt('ru', 'swarm'), true);
  assert.equal(usesSecondaryMechArt('ru', 'destroyer'), false);
});

test('encaixes específicos dos cinco sprites e ID coreano legado', () => {
  assert.deepEqual(Object.keys(SECONDARY_MECH_MOUNTS), ['br','us','kr','ru','cn']);
  assert.deepEqual(secondaryMechMount('jp'), secondaryMechMount('kr'));
  assert.equal(secondaryMechMount('zz'), null);
  for (const mount of Object.values(SECONDARY_MECH_MOUNTS)) {
    assert.ok(mount.x >= -35 && mount.x <= 0);
    assert.ok(mount.y <= -25 && mount.y >= -65);
    assert.ok(mount.weaponFactor >= 0.4 && mount.weaponFactor <= 0.6);
  }
});

test('giro do canhão preserva rastreamento à esquerda e à direita', () => {
  for (const mirrored of [false, true]) {
    const baseX = mirrored ? 680 : 280;
    const mount = secondaryMechMount('ru');
    const mountX = baseX + (mirrored ? -mount.x : mount.x);
    const mountY = 483 + mount.y;
    let angle = -Math.PI / 3;
    const left = mechLocalAimAngle(mountX, mountY, 200, 190, mirrored);
    for (let n = 0; n < 150; n += 1)
      angle = rotateMechWeapon(angle, left, 6/60);
    assert.ok(mechAimAligned(angle, left));
    const right = mechLocalAimAngle(mountX, mountY, 780, 220, mirrored);
    assert.equal(mechAimAligned(angle, right), false,
      'a arma não deve permanecer imóvel após a troca de alvo');
    for (let n = 0; n < 150; n += 1)
      angle = rotateMechWeapon(angle, right, 6/60);
    assert.ok(mechAimAligned(angle, right));
  }
});

test('HUD de recarga usa a posição do encaixe e anel menor nos novos animais', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  const mounts = readFileSync(new URL('../src/gameplay/mechSpriteMounts.js', import.meta.url), 'utf8');
  assert.match(mounts, /secondaryMechMount\(country\)/);
  assert.match(mounts, /const weaponScale = cfg\.scale \* \(secondary \? secondaryMount\.weaponFactor : 1\)/);
  assert.match(mounts, /mountWorldPosition: \(\) =>/);
  assert.match(scene, /tower\.visual\.mountWorldPosition\(\)/);
  assert.match(scene, /const ring = mount \? 12 : 21/);
  assert.match(scene, /const trackingTarget = firingTarget \?\? chooseTowerTrackingTarget/);
  assert.match(scene, /if \(!firingTarget \|\| !aimed \|\| towerChargeProgress/);
});
