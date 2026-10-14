import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRecoilImpulse, advanceRouteWithRecoil } from '../src/gameplay/combat.js';

test('impacto russo adiciona velocidade de recuo, sem alterar posição instantaneamente', () => {
  const progress = 0.7;
  const recoil = applyRecoilImpulse(0, 0.12);
  assert.ok(recoil > 0);
  assert.equal(progress, 0.7); // nenhum teleporte no momento do acerto

  const frame = advanceRouteWithRecoil(progress, 80, recoil, 450, 1 / 60);
  assert.ok(frame.progress < progress, 'desloca suavemente para trás no primeiro frame');
  assert.ok(progress - frame.progress < 0.02, 'o deslocamento por frame é pequeno');
  assert.ok(frame.recoilSpeed < recoil, 'a força diminui progressivamente');
});

test('o recuo se dissipa naturalmente e inimigo retoma o avanço', () => {
  let state = { progress: 0.6, recoilSpeed: applyRecoilImpulse(0, 0.12) };
  const positions = [];
  for (let i = 0; i < 90; i += 1) {
    state = advanceRouteWithRecoil(state.progress, 86, state.recoilSpeed, 450, 1 / 60);
    positions.push(state.progress);
  }
  assert.ok(positions[0] < 0.6);
  assert.ok(positions.at(-1) > positions[0]);
  assert.ok(state.recoilSpeed < 1);
  for (let i = 1; i < positions.length; i += 1) {
    assert.ok(Math.abs(positions[i] - positions[i - 1]) < 0.02);
  }
});

test('sucessivos impactos somam recuo até o limite e zero não empurra', () => {
  assert.equal(applyRecoilImpulse(0, 0), 0);
  assert.equal(applyRecoilImpulse(90, -1), 90);
  assert.ok(applyRecoilImpulse(250, 0.12) <= 400);
  const normal = advanceRouteWithRecoil(0.5, 100, 0, 500, 0.05);
  assert.ok(Math.abs(normal.progress - 0.51) < 0.00001);
  assert.equal(normal.recoilSpeed, 0);
});
