import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('Tipo 4 carrega a opção C como spritesheet 4×3 de 128px',()=>{
  assert.match(source,/this\.load\.spritesheet\('tipo4_sheet'/);
  assert.match(source,/assets\/inimigos\/tipo4\/spritesheet\.png/);
  assert.match(source,/frameWidth:\s*128, frameHeight:\s*128/);
  for(const sequence of ['0,1','2,3','4,5','6,7','8,9'])
    assert.ok(source.includes(`[ ${sequence.replaceAll(',',',')} ]`) ||
      source.includes(`[${sequence}]`),sequence);
});

test('Usa spritesheet se presente e preserva fallback vetorial se faltar imagem',()=>{
  assert.match(source,/if \(type === 4 && this\.textures\.exists\('tipo4_sheet'\)\)/);
  assert.match(source,/\.setDisplaySize\(70,70\)/);
  assert.match(source,/return \{ sprite, box:null \};/);
  assert.match(source,/const sprite = this\.add\.container\(x, y\)\.setDepth\(19\)/);
});

test('Habilidades do caça seguem as fases existentes, sem alterar rotas',()=>{
  const start=source.indexOf('  updateType4Appearance(enemy,previousX,previousY,dt) {');
  const end=source.indexOf('\n  updateEnemies(dt) {',start);
  assert.ok(start>=0 && end>start);
  const method=source.slice(start,end).trim();
  const update=new Function(`return ({ ${method} }).updateType4Appearance;`)();
  const makeEnemy=(phase,direction=1)=>({
    type:4,phase,direction,lastHitAt:-Infinity,
    sprite:{
      texture:{key:'tipo4_sheet'},
      x:210,y:150,flipX:false,
      anims:{currentAnim:null,isPlaying:false},
      play(key){this.anims.currentAnim={key};this.anims.isPlaying=true;return this},
      setFlipX(value){this.flipX=value;return this;},
    },
  });
  const scene={time:{now:2500}};
  const flyby=makeEnemy('flyby',-1);
  update.call(scene,flyby,140,150,0.2);
  assert.equal(flyby.sprite.anims.currentAnim.key,'tipo4_dash');
  assert.equal(flyby.sprite.flipX,true);
  const left=makeEnemy('swoop1');
  update.call(scene,left,250,150,0.2);
  assert.equal(left.sprite.anims.currentAnim.key,'tipo4_banco_direita');
  const right=makeEnemy('swoop2');
  update.call(scene,right,180,150,0.2);
  assert.equal(right.sprite.anims.currentAnim.key,'tipo4_banco_esquerda');
  const laser=makeEnemy('laser');
  update.call(scene,laser,210,150,0.2);
  assert.equal(laser.sprite.anims.currentAnim.key,'tipo4_propulsao');
  const telegraph=makeEnemy('telegraph');
  update.call(scene,telegraph,210,150,0.2);
  assert.equal(telegraph.sprite.anims.currentAnim.key,'tipo4_voo');
  const hit=makeEnemy('flyby');
  hit.lastHitAt=2400;
  update.call(scene,hit,140,150,0.2);
  assert.equal(hit.sprite.anims.currentAnim,null,
    'o quadro 10 de dano não é substituído durante o flash');
});

test('Dano e explosão do caça têm quadros próprios, sem mudar a hitbox',()=>{
  assert.match(source,/enemy\.sprite\.setFrame\(10\); \/\/ o movimento restabelece/);
  assert.match(source,/this\.add\.sprite\(enemy\.sprite\.x,enemy\.sprite\.y,'tipo4_sheet',11\)/);
  assert.match(source,/this\.updateType4Appearance\(enemy,previousX,previousY,dt\)/);
  assert.match(source,/enemy\.sprite\.destroy\(\)/);
});
