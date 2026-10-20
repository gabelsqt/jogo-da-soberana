import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const asset=readFileSync(new URL('../public/assets/inimigos/tipo2/spritesheet.png',import.meta.url));

test('Tipo 2 tem spritesheet transparente normalizado em 8 quadros 112 × 112',()=>{
  assert.equal(asset.toString('hex',0,8),'89504e470d0a1a0a','arquivo PNG válido');
  assert.equal(asset.readUInt32BE(16),448,'quatro colunas');
  assert.equal(asset.readUInt32BE(20),224,'duas linhas');
  assert.ok(asset.includes(Buffer.from('tRNS')),'PNG possui transparência');
  assert.ok(asset.length>12000,'os detalhes do spritesheet foram preservados');
  assert.match(game,/load\.spritesheet\('tipo2_sheet'/);
  assert.match(game,/frameWidth:112,frameHeight:112/);
});

test('Tipo 2 alterna frames de voo, dano e destruição mantendo fallback',()=>{
  assert.match(game,/generateFrameNumbers\('tipo2_sheet',\{frames:\[0,1,2,3,4,5\]\}\)/);
  assert.match(game,/key:'tipo2_voo'/);
  assert.match(game,/type===2&&this\.textures\.exists\('tipo2_sheet'\)/);
  assert.match(game,/enemy\.hp<=enemy\.maxHp\*0\.55/);
  assert.match(game,/setFrame\(6\)/);
  assert.match(game,/add\.sprite\(enemy\.sprite\.x,enemy\.sprite\.y,'tipo2_sheet',7\)/);
  assert.match(game,/\/\/ Fallback vetorial/);
});

test('impacto do Tipo 2 soma shake à mira, sem perder a rotação de voo',()=>{
  assert.match(game,/enemy\.type2Facing=steerType2Rotation/);
  assert.match(game,/enemy\.type2Facing\?\?0\)\+reaction\.rotation:reaction\.rotation/);
  assert.match(game,/sprite\.rotation=enemy\.type2Facing/);
});
