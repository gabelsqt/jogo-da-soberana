import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {americanRocketConfig,americanWallConfig,americanWallPlacement,
 americanWallTouches,americanWallIntersects,AMERICAN_WALL_ARC,
 AMERICAN_WALL_COOLDOWN_MS,AMERICAN_WALL_DURATION_MS}
 from '../src/gameplay/americanArsenal.js';
import {v1CombatStats,V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
const state=n=>({choices:Array(n).fill('us')});
test('foguetes crescem só por upgrades: o raio físico, a explosão e o dano',()=>{
 const levels=[1,3,5,7,10].map(americanRocketConfig);
 for(let i=1;i<levels.length;i++){
  assert.ok(levels[i].radius>levels[i-1].radius);
  assert.ok(levels[i].blastRadius>levels[i-1].blastRadius);
  assert.ok(levels[i].blastDamage>levels[i-1].blastDamage);
 }
 assert.deepEqual(americanRocketConfig(2),americanRocketConfig(1));
 assert.deepEqual(americanRocketConfig(4),americanRocketConfig(3));
 assert.equal(v1CombatStats(state(7)).usRocketRadius,22);
 assert.equal(v1CombatStats(state(7)).usJulyHitsRequired,0);
 assert.equal(v1CombatStats(state(1)).fragmentation,false);
});
test('Grande Muro: 120 graus constantes, 6 s, 14 s; raio cresce sem HP',()=>{
 const c=[2,4,6,8].map(americanWallConfig);
 assert.equal(americanWallConfig(1),null);
 assert.equal(AMERICAN_WALL_ARC,Math.PI*2/3);
 assert.equal(AMERICAN_WALL_DURATION_MS,6000);
 assert.equal(AMERICAN_WALL_COOLDOWN_MS,14000);
 for(const x of c)assert.equal(x.arc,AMERICAN_WALL_ARC);
 for(let i=1;i<c.length;i++){
  assert.ok(c[i].radius>c[i-1].radius);
  assert.equal(c[i].maxHp,undefined);
 }
 // Ampliação aprovada na revisão 0.915; duração e abertura continuam iguais.
 assert.deepEqual(c.map(x=>x.radius),[110,145,185,230]);
 assert.equal(v1SpecialConfig(state(8)).usWall.radius,230);
});
test('posição livre na área jogável; orientação canhão→mira',()=>{
 const p=americanWallPlacement(300,200,480,480,960,540);
 assert.equal(p.x,300);assert.equal(p.y,200);
 assert.equal(p.angle,Math.atan2(-280,-180));
 assert.equal(americanWallPlacement(-10,-100,480,480,960,540).y,48);
});
test('arco intercepta tiros velozes na curva e não acerta atrás ou no vazio',()=>{
 const w={x:200,y:200,angle:-Math.PI/2,arc:AMERICAN_WALL_ARC,radius:60};
 assert.ok(americanWallTouches(w,200,140));
 assert.equal(americanWallTouches(w,200,200),false);
 assert.equal(americanWallTouches(w,200,260),false);
 assert.ok(americanWallIntersects(w,200,100,200,190,4));
 assert.equal(americanWallIntersects(w,200,230,200,300,3),false);
 assert.equal(americanWallIntersects(w,0,0,10,10,3),false);
});
test('arma, botão direito, invulnerabilidade, repulsão e bandeira integrados',()=>{
 const src=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 for(const part of ['createAmericanWall(target.x,target.y','hitAmericanWallWithBullet',
  'updateAmericanWalls();','createAmericanRocketSprite','detonateAmericanRocket',
  'GRANDE MURO','rightButtonDown()','americanWallIntersects','americanWallTouches',
  '0xef4865','0xffffff'])assert.ok(src.includes(part),part);
 assert.match(src,/if\(enemy.type===6\|\|!enemy.sprite\?\.active\)continue/);
 assert.match(src,/enemy\.wallPush=addWallPush\(enemy\.wallPush,/);
 assert.match(src,/wallPushImpulse\(wall,enemy\.sprite\)/);
 assert.match(src,/this\.reflectAmericanWallShot\(shot,wall\)/);
 assert.doesNotMatch(src,/wall\.hp\s*[-+]?=/);
 assert.match(src,/wall\.flashUntil=this\.time\.now\+130/);
 assert.match(src,/if\(bullet.usRocket\)/);
 assert.doesNotMatch(src,/build\.primary==='us'\?1\.6\*build\.usMissileScale/);
 assert.match(V1_UPGRADES.us[1].description,/120°/);
});

