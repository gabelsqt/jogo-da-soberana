import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GAME_VERSION, GAME_RELEASE_STAGE, GAME_VERSION_LABEL } from '../src/config/version.js';

test('protótipo v0.40 tem rótulo legível e mantido em um só lugar', () => {
  assert.equal(GAME_VERSION, '0.40');
  assert.equal(GAME_RELEASE_STAGE, 'PROTÓTIPO');
  assert.equal(GAME_VERSION_LABEL, 'v0.40 • PROTÓTIPO');
});

test('menu principal utiliza a versão centralizada e mostra-a no rodapé', () => {
  const scene = readFileSync(new URL('../src/scenes/MenuScene.js', import.meta.url), 'utf8');
  assert.match(scene, /import \{ GAME_VERSION_LABEL \} from '\.\.\/config\/version\.js';/);
  assert.match(scene, /this\.add\.text\(W - 16, H - 12, GAME_VERSION_LABEL/);
  assert.match(scene, /\.setOrigin\(1, 1\)\.setDepth\(24\)/);
});
