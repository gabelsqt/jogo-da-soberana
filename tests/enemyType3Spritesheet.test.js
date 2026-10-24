import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url),'utf8');

test('Tipo 3 usa uma spritesheet de 12 quadros, 128x128, na pasta public/assets/inimigos/tipo3',()=>{
  assert.match(source,/assets\/inimigos\/tipo3\/spritesheet\.png/);
  assert.match(source,/this\.load\.spritesheet\('tipo3_sheet'/);
  assert.match(source,/frameWidth:\s*128,\s*frameHeight:\s*128/);
  assert.match(source,/frames:\s*\[0,1,2,3\]/);
  assert.match(source,/frames:\s*\[8,9\]/);
});

test('Spritesheet ausente mantém visual anterior como fallback, sem travar a campanha',()=>{
  assert.match(source,/if \(type === 3 && this\.textures\.exists\('tipo3_sheet'\)\)/);
  assert.match(source,/if \(this\.textures\.exists\('tipo3_sheet'\)\)/);
  assert.match(source,/const sprite = this\.add\.container\(x, y\)\.setDepth\(19\)/);
});

test('Tipo 3 mostra curvas, disparo, dano e destruição; mantém HP e rota preexistentes',()=>{
  assert.match(source,/enemy\.sprite\.setFrame\(frame\)/);
  assert.match(source,/enemy\.sprite\.play\('tipo3_bombardeio', true\)/);
  assert.match(source,/enemy\.sprite\.setFrame\(10\)/);
  assert.match(source,/this\.add\.sprite\(enemy\.sprite\.x, enemy\.sprite\.y, 'tipo3_sheet', 11\)/);
  assert.match(source,/return \{ sprite, box: null \}/);
});
