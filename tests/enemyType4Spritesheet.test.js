import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

function type4UpdateMethod(){
  const start=source.indexOf('  updateType4Appearance(enemy,previousX,previousY,dt) {');
  const end=source.indexOf('\n  updateEnemies(dt) {',start);
  assert.ok(start>=0 && end>start,'método Tipo 4 existe na GameScene');
  return new Function(`return ({ ${source.slice(start,end).trim()} }).updateType4Appearance;`)();
}
function enemyType4(phase='flyby',direction=1){
  const sprite={
    texture:{key:'tipo4_sheet'},x:210,y:150,flipX:false,
    frame:null,playCalls:0,frameCalls:0,
    anims:{
      currentAnim:null,isPlaying:false,
      stop(){this.isPlaying=false;},
    },
    play(key){
      this.playCalls++;
      this.anims.currentAnim={key};
      this.anims.isPlaying=true;
      return this;
    },
    setFrame(frame){this.frameCalls++;this.frame=frame;return this;},
    setFlipX(value){this.flipX=value;return this;},
  };
  return {type:4,phase,direction,phaseAge:0,
    lastHitAt:-Infinity,sprite};
}

test('Tipo 4 mantém spritesheet 4x3, fallback e quadros especiais',()=>{
  assert.match(source,/this\.load\.spritesheet\('tipo4_sheet'/);
  assert.match(source,/assets\/inimigos\/tipo4\/spritesheet\.png/);
  assert.match(source,/frameWidth:\s*128, frameHeight:\s*128/);
  assert.match(source,/if \(type === 4 && this\.textures\.exists\('tipo4_sheet'\)\)/);
  assert.match(source,/\.setDisplaySize\(70,70\)/);
  assert.match(source,/return \{ sprite, box:null \};/);
  assert.match(source,/const sprite = this\.add\.container\(x, y\)\.setDepth\(19\)/);
  for(const sequence of ['0,1','3','2','6,7','8,9'])
    assert.ok(source.includes(`[${sequence}]`),sequence);
  assert.match(source,/frameRate, repeat:frames\.length===1\?0:-1/);
});

test('Voo horizontal segura apenas um quadro lateral, sem ficar tocando dash em loop',()=>{
  const update=type4UpdateMethod();
  const scene={time:{now:2500}};
  const right=enemyType4('flyby',1);
  update.call(scene,right,140,150,0.2);
  assert.equal(right.sprite.frame,2,'quadro 2 tem nariz virado à direita');
  assert.equal(right.type4Pose,'tipo4_banco_direita');
  assert.equal(right.sprite.playCalls,0,'bank é quadro estático');
  assert.equal(right.sprite.flipX,false);
  scene.time.now=2650;
  update.call(scene,right,140,150,0.2);
  assert.equal(right.sprite.frameCalls,1,'não reaplica quadro a cada atualização');

  const left=enemyType4('flyby',-1);
  update.call(scene,left,250,150,0.2);
  assert.equal(left.sprite.frame,3,'quadro 3 tem nariz virado à esquerda');
  assert.equal(left.type4Pose,'tipo4_banco_esquerda');
  assert.equal(left.sprite.flipX,false,'usa arte esquerda nativa, sem flip');
});

test('Transições laterais usam 140ms e histerese contra jitter em curvas',()=>{
  const update=type4UpdateMethod(),scene={time:{now:1000}};
  const e=enemyType4('swoop1');
  update.call(scene,e,150,150,0.2); // +300 px/s
  assert.equal(e.type4Pose,'tipo4_banco_direita');
  assert.equal(e.sprite.frame,2);
  e.sprite.x=200;
  scene.time.now=1060;
  update.call(scene,e,220,150,0.2); // -100 px/s: abaixo de 105
  assert.equal(e.type4Pose,'tipo4_banco_direita','não alterna em velocidade ambígua');
  scene.time.now=1100;
  update.call(scene,e,240,150,0.2); // -200 px/s, mas travado até 1140
  assert.equal(e.type4Pose,'tipo4_banco_direita');
  scene.time.now=1150;
  update.call(scene,e,240,150,0.2);
  assert.equal(e.type4Pose,'tipo4_banco_esquerda');
  assert.equal(e.sprite.frame,3);
  assert.equal(e.type4PoseLockUntil,1290);
});

test('Animação de dash aparece apenas na investida curta, não no flyby',()=>{
  const update=type4UpdateMethod(),scene={time:{now:1000}};
  const e=enemyType4('swoop2');
  e.phaseAge=0.1;
  update.call(scene,e,170,150,0.2);
  assert.equal(e.type4Pose,'tipo4_dash');
  assert.equal(e.sprite.playCalls,1);
  assert.equal(e.sprite.anims.currentAnim.key,'tipo4_dash');
  scene.time.now=1150;
  e.phaseAge=0.35;
  update.call(scene,e,170,150,0.2);
  assert.equal(e.type4Pose,'tipo4_banco_direita');
  assert.equal(e.sprite.frame,2);
});

test('Hit mantém frame 10 durante 160ms e restaura sem piscar',()=>{
  const update=type4UpdateMethod(),scene={time:{now:2000}};
  const e=enemyType4('flyby',1);
  update.call(scene,e,140,150,0.2);
  e.lastHitAt=2050;
  e.type4NeedsRestore=true;
  e.sprite.anims.stop();
  e.sprite.setFrame(10);
  scene.time.now=2180;
  update.call(scene,e,140,150,0.2);
  assert.equal(e.sprite.frame,10);
  scene.time.now=2220;
  update.call(scene,e,140,150,0.2);
  assert.equal(e.sprite.frame,2);
  assert.equal(e.type4NeedsRestore,false);
  assert.equal(e.sprite.frameCalls,3,'restaura uma única vez');
  scene.time.now=2250;
  update.call(scene,e,140,150,0.2);
  assert.equal(e.sprite.frameCalls,3);
});

test('Morte permanece no frame 11 e a IA/hitbox do caça não foi alterada',()=>{
  assert.match(source,/enemy\.sprite\.setFrame\(10\)/);
  assert.match(source,/this\.add\.sprite\(enemy\.sprite\.x,enemy\.sprite\.y,'tipo4_sheet',11\)/);
  assert.match(source,/this\.updateType4Appearance\(enemy,previousX,previousY,dt\)/);
  assert.match(source,/enemy\.sprite\.destroy\(\)/);
  assert.match(source,/enemy\.phase = 'flyby'/);
});

// Confere os bytes do PNG real, para detectar substituições incompatíveis.
test('Arte Tipo 4 tem exatamente doze células 128x128',()=>{
  const png=readFileSync(new URL('../public/assets/inimigos/tipo4/spritesheet.png',import.meta.url));
  assert.equal(png.readUInt32BE(16),512,'largura da folha');
  assert.equal(png.readUInt32BE(20),384,'altura da folha');
});

test('Dash para a esquerda espelha a propulsão e restaura pose nativa depois',()=>{
  const update=type4UpdateMethod(),scene={time:{now:1000}};
  const e=enemyType4('swoop2',-1); e.phaseAge=0.1;
  update.call(scene,e,250,150,0.2);
  assert.equal(e.sprite.flipX,true);
  scene.time.now=1200; e.phaseAge=0.4;
  update.call(scene,e,250,150,0.2);
  assert.equal(e.sprite.frame,3);
  assert.equal(e.sprite.flipX,false);
});
