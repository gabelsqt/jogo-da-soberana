import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  wallPushImpulse,addWallPush,advanceWallPush,
  canReflectWallShot,wallReflectionVector,
  US_WALL_PUSH_SPEED,US_WALL_REFLECTION_DAMAGE,US_WALL_REFLECTION_SPEED,
  US_WALL_PUSH_COOLDOWN_MS,
} from '../src/gameplay/americanWallDefense.js';
import {americanWallIntersects,americanWallTouches} from '../src/gameplay/americanArsenal.js';

const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('Grande Muro empurra de verdade com impulso muito maior que 260, sem dano',()=>{
 const wall={x:480,y:340,angle:-Math.PI/2,radius:120,arc:Math.PI*2/3,currentArc:Math.PI*2/3};
 assert.equal(US_WALL_PUSH_SPEED,1000);
 assert.ok(US_WALL_PUSH_COOLDOWN_MS>=300);
 const push=wallPushImpulse(wall,{x:480,y:220});
 assert.ok(Math.abs(push.vx)<1e-6);
 assert.ok(push.vy< -950);
 let state=addWallPush({x:0,y:0,vx:0,vy:0},push);
 for(let i=0;i<15;i++)state=advanceWallPush(state,1/60);
 assert.ok(state.y< -130,`deve afastar visivelmente: ${state.y}`);
 assert.ok(state.y> -173,'não teleportar para fora do limite');
 const before=state.y;
 for(let i=0;i<120;i++)state=advanceWallPush(state,1/60);
 assert.ok(state.y>before,'retorno gradual à rota original');
 assert.ok(!scene.slice(scene.indexOf('  updateAmericanWalls(){'),scene.indexOf('  hitAmericanWallWithBullet(')).includes('impactInvader'));
 assert.match(scene,/enemy\.sprite\.x \+= enemy\.shockOffset\.x \+ enemy\.wallPush\.x/);
});

test('ricochete só de projéteis básicos Tipos 1 e 2, nunca bombas pesadas',()=>{
 assert.equal(canReflectWallShot({reflectable:true}),true);
 for(const type of ['colossal','instantUnshielded','cryoImpact','reflected']){
   assert.equal(canReflectWallShot({reflectable:true,[type]:true}),false);
 }
 assert.equal(canReflectWallShot({reflectable:false}),false);
 assert.equal(canReflectWallShot(null),false);
 assert.match(scene,/reflectable:enemy\.type<=2 && !enemy\.finalBoss/);
 assert.match(scene,/sourceEnemyId:enemy\.uid/);
});

test('muro intercepta e reflete tiro rápido em direção ao invasor',()=>{
 const wall={x:480,y:340,angle:-Math.PI/2,radius:120,arc:Math.PI*2/3,currentArc:Math.PI*2/3};
 assert.equal(americanWallTouches(wall,480,220),true);
 assert.equal(americanWallIntersects(wall,480,185,480,270,8.25),true);
 const vector=wallReflectionVector(wall,480,220,{sprite:{active:true,x:480,y:100}});
 assert.ok(Math.abs(vector.vx)<1e-8,'direção vertical tem tolerância de precisão');
 assert.ok(vector.vy<0);
 assert.ok(Math.abs(Math.hypot(vector.vx,vector.vy)-US_WALL_REFLECTION_SPEED)<1e-7);
 assert.ok(US_WALL_REFLECTION_DAMAGE>=1);
 const a=scene.indexOf('  hitAmericanWallWithBullet(');
 const b=scene.indexOf('  reflectAmericanWallShot(',a);
 assert.ok(a>=0 && b>a);
 assert.match(scene.slice(a,b),/if\(canReflectWallShot\(shot\)\)this\.reflectAmericanWallShot\(shot,wall\)/);
 assert.match(scene,/this\.updateAmericanWallReflections\(dt\)/);
 assert.match(scene,/this\.removeEnemyBullet\(i,true\);continue/);
});

test('onda não depende só de tween/callback para terminar: proteção no 1',()=>{
 const method=scene.slice(scene.indexOf('  update(_time, delta) {'));
 assert.match(method,/this\.time\.now-\(this\.sunriseStartedAt\?\?this\.time\.now\)>=1900/);
 assert.match(method,/this\.finishDawnWithdrawal\(\);return/);
 assert.match(scene,/this\.waveOpeningFinish=startCombat/);
 assert.match(scene,/this\.waveOpeningStartedAt=this\.time\.now/);
 assert.match(scene,/this\.waveOpeningStartedAt=null/);
 assert.match(scene,/this\.sunriseFinished=true/);
});
