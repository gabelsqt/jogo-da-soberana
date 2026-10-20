import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_VERSION,GAME_RELEASE_STAGE,GAME_VERSION_LABEL} from '../src/config/version.js';

test('rótulo segue a versão atual e package.json',()=>{
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.equal(pkg.version,`${GAME_VERSION}.0`);
  assert.equal(GAME_RELEASE_STAGE,'PROTÓTIPO');
  assert.equal(GAME_VERSION_LABEL,`v${GAME_VERSION} • PROTÓTIPO`);
});
test('menu principal mostra versão discreta no canto inferior direito',()=>{
  const scene=readFileSync(new URL('../src/scenes/MenuScene.js',import.meta.url),'utf8');
  assert.match(scene,/import \{GAME_VERSION_LABEL\} from/);
  assert.match(scene,/this\.add\.text\(W-16,H-14,GAME_VERSION_LABEL/);
  assert.match(scene,/\.setOrigin\(1,1\)\.setDepth\(40\)/);
  assert.doesNotMatch(scene,/addCuboBroadcastFrame/);
});
