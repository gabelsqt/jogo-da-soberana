import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TYPE5_SPRITE,type5DamageFrame} from '../src/gameplay/type5Sprite.js';

const file=new URL('../public/assets/inimigos/tipo5/spritesheet.png',import.meta.url);
const bytes=readFileSync(file);
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('Tipo 5 possui atlas transparente de 16 quadros em grade regular',()=>{
  assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),896);
  assert.equal(bytes.readUInt32BE(20),512);
  assert.ok(bytes.includes(Buffer.from('tRNS')),'PNG precisa preservar transparência');
  assert.deepEqual(TYPE5_SPRITE.flight,[0,1,2,3]);
  assert.deepEqual(TYPE5_SPRITE.deploy,[4,5,6,7]);
  assert.deepEqual(TYPE5_SPRITE.damage,[8,9,10,11]);
  assert.deepEqual(TYPE5_SPRITE.death,[12,13,14,15]);
  assert.equal(TYPE5_SPRITE.frameWidth*TYPE5_SPRITE.columns,896);
  assert.equal(TYPE5_SPRITE.frameHeight*TYPE5_SPRITE.rows,512);
});

test('dano crescente seleciona quadros da terceira linha',()=>{
  assert.equal(type5DamageFrame(24,24),null);
  assert.equal(type5DamageFrame(17,24),8);
  assert.equal(type5DamageFrame(12,24),9);
  assert.equal(type5DamageFrame(7,24),10);
  assert.equal(type5DamageFrame(3,24),11);
  assert.equal(type5DamageFrame(5,0),null);
});

test('jogo carrega e toca voo, abertura e morte com animações independentes',()=>{
  assert.match(game,/this\.load\.spritesheet\('tipo5_sheet'/);
  assert.match(game,/\['tipo5_voo',TYPE5_SPRITE\.flight,4,-1\]/);
  assert.match(game,/\['tipo5_spawn',TYPE5_SPRITE\.deploy,8,0\]/);
  assert.match(game,/\['tipo5_morte',TYPE5_SPRITE\.death,8,0\]/);
  assert.match(game,/if\(type===5&&this\.textures\.exists\('tipo5_sheet'\)\)/);
  assert.match(game,/sprite\.on\('animationcomplete-tipo5_spawn'/);
  assert.match(game,/enemy\.sprite\.play\('tipo5_spawn',true\)/);
  assert.match(game,/type5DamageFrame\(enemy\.hp,enemy\.maxHp\)/);
  assert.match(game,/wreck\.play\('tipo5_morte'\)/);
  // Apenas o desenho mudou: spawn/tiro/remoção continuam com regras originais.
  assert.match(game,/minibossSummonCount\(enemy\.spawnedMinions/);
  assert.match(game,/this\.fireEnemyProjectile\(enemy\)/);
  assert.match(game,/this\.removeEnemy\(index\)/);
});
