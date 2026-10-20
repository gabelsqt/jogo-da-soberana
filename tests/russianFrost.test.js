import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  russianShatterRadius,russianShatterDamage,applyRussianFreeze,
  russianShatterTargets,
} from '../src/gameplay/russianFrost.js';
import { v1CombatStats, V1_UPGRADES } from '../src/gameplay/v1Upgrades.js';
import { shotVisualFor, shotVfxFor } from '../src/gameplay/upgrades.js';

const mob=(uid,x,y,type=1)=>({uid,type,sprite:{x,y},frozenUntil:-1});

test('alcance e dano do estilhaçamento crescem com os upgrades russos',()=>{
  assert.deepEqual([0,1,2,3,4,5,6,7,8,9,10].map(russianShatterRadius),
    [0,44,44,60,60,76,76,96,96,96,120]);
  assert.deepEqual([0,1,3,5,7,10].map(russianShatterDamage),[0,2,3,4.5,6,9]);
  assert.ok(!V1_UPGRADES.ru.some(v=>/atra|vórtice|contagi|reúne/i.test(v.description)));
});

test('congelamento atinge apenas alvo direto sem se espalhar',()=>{
  const origin=mob(1,0,0),nearby=mob(2,25,0);
  assert.equal(applyRussianFreeze(origin,100,1500),true);
  assert.equal(origin.frozenUntil,1600);
  assert.equal(nearby.frozenUntil,-1);
  assert.equal(applyRussianFreeze(origin,500,300),true);
  assert.equal(origin.frozenUntil,1600);
  assert.equal(applyRussianFreeze(mob(3,0,0,6),0,1000),false);
});

test('só alvo morto ainda congelado provoca dano nos vizinhos dentro do raio',()=>{
 const source=mob(1,0,0),a=mob(2,18,0),b=mob(3,45,0),c=mob(4,70,0);
 applyRussianFreeze(source,0,500);
 assert.deepEqual(russianShatterTargets(source,[source,a,b,c],300,50),[2,3]);
 assert.deepEqual(russianShatterTargets(source,[source,a,b,c],500,50),[]);
 assert.deepEqual(russianShatterTargets(source,[source,a,b,c],200,0),[]);
 assert.equal(russianShatterTargets(source,[source,mob(5,10,0,6)],200,50).length,0);
});

test('recarga russa 25% menor sem interferir nos bônus coreanos',()=>{
 const ru1=v1CombatStats({choices:['ru']});
 const ru2=v1CombatStats({choices:['ru','ru']});
 const jp=v1CombatStats({choices:Array(6).fill('jp')});
 const hybrid=v1CombatStats({choices:['ru','ru',...Array(6).fill('jp')]});
 assert.equal(ru1.specialCooldown,8000);
 assert.equal(ru2.specialCooldown,6000);
 assert.equal(hybrid.specialCooldown,Math.round(jp.specialCooldown*0.75));
 assert.equal(ru2.russianShatterRadius,44);
 assert.equal(v1CombatStats({choices:Array(10).fill('ru')}).russianShatterRadius,120);
 assert.equal(v1CombatStats({choices:['ru']}).russianShatterDamage,2);
});

test('sopro gelado continua compatível com efeitos brasileiros e laser coreano',()=>{
 assert.equal(shotVisualFor(['ru']).color,0xe1f9ff);
 assert.equal(shotVisualFor(['ru','jp']).color,0xe997ff);
 assert.equal(shotVfxFor(['ru']).cryogenic,true);
 assert.equal(shotVfxFor(['ru','jp','cn']).multiple,true);
 const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 assert.match(scene,/freezeRussianEnemy\(enemy,this\.combat\.russianFreezeMs\)/);
 assert.match(scene,/shatterRussianEnemy\(enemy\)/);
 assert.doesNotMatch(scene,/spreadRussianCold\(/);
 assert.doesNotMatch(scene,/russianAttractRadius/);
});
