import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  MECH_VISUALS, visualCountryId, mechMountOffset,
  mechAimAngle, rotateMechWeapon,
} from '../src/gameplay/mechSpriteMounts.js';

test('cinco torres têm corpo e canhão PNG independentes e com transparência', () => {
  assert.deepEqual(Object.keys(MECH_VISUALS), ['br', 'us', 'kr', 'ru', 'cn']);
  for (const cfg of Object.values(MECH_VISUALS)) {
    assert.notEqual(cfg.body, cfg.weapon);
    assert.ok(cfg.scale > 0);
    for (const name of [cfg.body, cfg.weapon]) {
      const url = new URL(`../public/assets/torres/${name}`, import.meta.url);
      assert.equal(existsSync(url), true, `asset ausente: ${name}`);
      const data = readFileSync(url);
      assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.ok(data.length > 1000);
    }
    const m = mechMountOffset(Object.entries(MECH_VISUALS)
      .find(([, value]) => value === cfg)[0]);
    assert.ok(Number.isFinite(m.x) && Number.isFinite(m.y));
    assert.ok(m.y < 0, 'encaixe deve ficar acima do chão');
    assert.ok(cfg.weaponPivot[0] > 0 && cfg.weaponPivot[0] < cfg.weaponSize[0]);
    assert.ok(cfg.weaponPivot[1] > 0 && cfg.weaponPivot[1] < cfg.weaponSize[1]);
  }
});

test('ID legado jp mapeia exclusivamente para o visual coreano', () => {
  assert.equal(visualCountryId('jp'), 'kr');
  assert.deepEqual(mechMountOffset('jp'), mechMountOffset('kr'));
  assert.equal(visualCountryId('us'), 'us');
  assert.equal(mechMountOffset('xx'), null);
});

test('mira do canhão move-se independentemente e sem ultrapassar meia-volta', () => {
  assert.ok(Math.abs(mechAimAngle(50, 50, 50, 20) + Math.PI / 2) < 0.001);
  assert.ok(mechAimAngle(50, 50, 100, 0) > -Math.PI / 2);
  assert.ok(mechAimAngle(50, 50, 0, 0) < -Math.PI / 2);
  assert.ok(mechAimAngle(50, 50, 100, 80) <= 0);
  assert.ok(mechAimAngle(50, 50, 0, 80) < -3.0);
  const rotated = rotateMechWeapon(-Math.PI / 2, 0, 0.1);
  assert.ok(Math.abs(rotated - (-Math.PI / 2 + 0.1)) < 1e-6);
  assert.equal(rotateMechWeapon(0, -1, 0), 0);
});

test('GameScene carrega sprites modulares sem movimentar o corpo no recuo', () => {
  const src = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(src, /preloadMechSprites\(this\)/);
  assert.match(src, /createMechSprites\(this, id, x, y, 26, position\.side === 'right', role\)/);
  assert.match(src, /tower\.visual\.aimAt\(enemy\.sprite\.x, enemy\.sprite\.y, dt\)/);
  assert.match(src, /tower\.visual\.recoil\(\)/);
  assert.doesNotMatch(src, /targets: tower\.sprite/);
});
