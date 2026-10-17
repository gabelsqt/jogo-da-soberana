import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  MECH_VISUALS, SECONDARY_MECH_ATLAS,
  SECONDARY_MECH_FRAME_SIZE, SECONDARY_MECH_FRAMES,
  usesSecondaryMechArt, visualCountryId,
} from '../src/gameplay/mechSpriteMounts.js';

test('atlas aprovado inclui cinco corpos diferentes, com transparência e frames válidos', () => {
  const file = new URL('../public/assets/torres/' + SECONDARY_MECH_ATLAS, import.meta.url);
  assert.ok(existsSync(file), 'o PNG do atlas precisa estar presente para o itch.io');
  const png = readFileSync(file);
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert.equal(SECONDARY_MECH_FRAME_SIZE, 112);
  assert.equal(width, 112 * 5);
  assert.equal(height, 112);
  assert.ok(png.length > 12000, 'atlas não pode ser placeholder mínimo');
  assert.deepEqual(SECONDARY_MECH_FRAMES, { br: 0, us: 1, kr: 2, ru: 3, cn: 4 });
});

test('Rússia usa o lobo como antienxame e Urso como destruidora', () => {
  assert.equal(usesSecondaryMechArt('ru', 'swarm'), true);
  assert.equal(usesSecondaryMechArt('ru', 'destroyer'), false);
  for (const id of ['br', 'us', 'jp', 'cn']) {
    assert.equal(usesSecondaryMechArt(id, 'destroyer'), true, id);
    assert.equal(usesSecondaryMechArt(id, 'swarm'), false, id);
  }
  assert.equal(visualCountryId('jp'), 'kr');
  assert.equal(SECONDARY_MECH_FRAMES.kr, 2);
  assert.equal(usesSecondaryMechArt('xx','destroyer'),false);
});

test('GameScene carrega e monta sprites por papel sem trocar a lógica dos tiros', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  const mounts = readFileSync(new URL('../src/gameplay/mechSpriteMounts.js', import.meta.url), 'utf8');
  assert.match(scene, /createMechSprites\(this, id, x, y, 26, position\.side === 'right', role\)/);
  assert.match(mounts, /scene\.load\.spritesheet\('mech_secondary_body'/);
  assert.match(mounts, /assetUrl\(`assets\/torres\/\$\{SECONDARY_MECH_ATLAS\}`\)/);
  assert.match(mounts, /'mech_secondary_body', SECONDARY_MECH_FRAMES\[country\]/);
  assert.match(mounts, /aimAt\(targetX, targetY, dt = 1\)/);
  assert.match(mounts, /return mechAimAligned\(weapon\.rotation, angle\)/);
  assert.equal(Object.keys(MECH_VISUALS).length, 5);
});
