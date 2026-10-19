import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_VERSION,GAME_RELEASE_STAGE,GAME_VERSION_LABEL} from '../src/config/version.js';

test('protótipo v0.48 tem versão centralizada e rótulo legível',()=>{
  assert.equal(GAME_VERSION,'0.48');
  assert.equal(GAME_RELEASE_STAGE,'PROTÓTIPO');
  assert.equal(GAME_VERSION_LABEL,'v0.48 • PROTÓTIPO');
});
test('menu principal utiliza a versão centralizada no rodapé do telejornal',()=>{
  const scene=readFileSync(new URL('../src/scenes/MenuScene.js',import.meta.url),'utf8');
  assert.match(scene,/import \{GAME_VERSION_LABEL\} from/);
  assert.match(scene,/this\.add\.text\(W-16,H-12,GAME_VERSION_LABEL/);
  assert.match(scene,/\.setOrigin\(1,1\)\.setDepth\(52\)/);
});
