import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const boss=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');

// Exercitar o método VFX sem instanciar Phaser: os métodos de GameScene não
// dependem de colisão e recebem apenas objetos de desenho simulados.
function extractMethod(name,nextName){
 const from=scene.indexOf('  '+name+'(');
 const to=scene.indexOf('  '+nextName+'(',from);
 assert.ok(from>=0 && to>from,name+' existe e termina antes de '+nextName);
 return new Function('ENEMY_SHOT_COLOR',
   'return ({'+scene.slice(from,to)+'}).'+name)(0xff526a);
}
function fixture(){
 const drawn=[],tweens=[];
 const sprite={
   x:112,y:210,active:true,fillColor:0xff526a,changed:[],destroyed:false,
   setFillStyle(value){this.changed.push(value);this.fillColor=value;return this;},
   destroy(){this.destroyed=true;this.active=false;},
 };
 const sceneMock={
   time:{now:500},enemyBullets:[],drawn,tweens,
   add:{graphics(){const g={
     active:true,
     setPosition(x,y){this.x=x;this.y=y;return this;},
     setDepth(z){this.depth=z;return this;},
     fillStyle(){return this;},fillCircle(){return this;},
     lineStyle(){return this;},strokeCircle(){return this;},
     lineBetween(){return this;},destroy(){this.active=false;},
   };drawn.push(g);return g;}},
   tweens:{add(data){tweens.push(data);}},
 };
 sceneMock.showEnemyBulletHit=extractMethod('showEnemyBulletHit','removeEnemyBullet');
 sceneMock.removeEnemyBullet=extractMethod('removeEnemyBullet','removeEnemy');
 return {sceneMock,sprite,drawn,tweens};
}

test('disparos quadrados comuns e bombas do Tipo 6 agora são círculos',()=>{
 assert.match(scene,/this\.add\.circle\(x,y,8\.25,ENEMY_SHOT_COLOR\)/);
 assert.doesNotMatch(scene,/add\.rectangle\(x,y,16\.5,16\.5,ENEMY_SHOT_COLOR\)/);
 assert.match(boss,/scene\.add\.circle\(x,y,size\*0\.5,/);
 assert.doesNotMatch(boss,/scene\.add\.rectangle\(x,y,size,size\*/);
 assert.match(scene,/radius:8\.25,/);
});

test('um tiro que sobrevive ao impacto pisca branco e restaura sua cor',()=>{
 const {sceneMock,sprite,drawn,tweens}=fixture();
 const shot={sprite,hp:20,radius:8.25};
 sceneMock.showEnemyBulletHit(shot);
 assert.equal(sprite.fillColor,0xffffff);
 assert.equal(shot.baseFillColor,0xff526a);
 assert.equal(shot.hitFlashUntil,580);
 assert.equal(drawn.length,1);
 assert.equal(tweens[0].duration,160);
 tweens[0].onComplete();
 assert.equal(drawn[0].active,false);
 const update=scene.slice(scene.indexOf('  updateEnemyBullets(dt) {'),
   scene.indexOf('  reflectV1ShieldProjectile',scene.indexOf('  updateEnemyBullets(dt) {')));
 assert.match(update,/this\.time\.now>=shot\.hitFlashUntil/);
 assert.match(update,/shot\.sprite\.setFillStyle\(shot\.baseFillColor\?\?ENEMY_SHOT_COLOR\)/);
});

test('projétil destruído faz flash/explosão mas não continua colidindo',()=>{
 const {sceneMock,sprite,drawn,tweens}=fixture();
 const shot={sprite,hp:0,radius:8.25};
 sceneMock.enemyBullets.push(shot);
 sceneMock.removeEnemyBullet(0,true);
 assert.equal(sceneMock.enemyBullets.length,0);
 assert.equal(sprite.destroyed,true);
 assert.equal(drawn.length,1,'um único objeto de efeitos');
 assert.equal(tweens[0].duration,160);
 tweens[0].onComplete();
 assert.equal(drawn[0].active,false);
});

test('despawn natural não explode; interceptações por várias armas explodem',()=>{
 const {sceneMock,sprite,drawn}=fixture();
 sceneMock.enemyBullets.push({sprite,hp:1});
 sceneMock.removeEnemyBullet(0);
 assert.equal(drawn.length,0,'limpeza natural sem explosão');
 assert.match(scene,/else this\.removeEnemyBullet\(i,true\);/);
 assert.match(scene,/else this\.removeEnemyBullet\(j,true\);/);
 assert.match(scene,/this\.removeEnemyBullet\(i,true\);/);
 assert.match(scene,/else this\.showEnemyBulletHit\(hostile\);/);
 assert.match(boss,/scene\.removeEnemyBullet\(index,true\)/);
 assert.match(boss,/scene\.removeEnemyBullet\(index\);/);
});
