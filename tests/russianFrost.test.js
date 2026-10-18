import test from 'node:test';
import assert from 'node:assert/strict';
import {
  russianFrostSpreadRadius, russianSecondaryFreezeMs,
  RUSSIAN_FROST_SPREAD_MAX_TARGETS, applyRussianFreeze, spreadRussianFrost,
} from '../src/gameplay/russianFrost.js';
import { v1CombatStats } from '../src/gameplay/v1Upgrades.js';
import { shotVisualFor, shotVfxFor } from '../src/gameplay/upgrades.js';
import { readFileSync } from 'node:fs';

const mob=(uid,x,y,type=1)=>({uid,type,sprite:{x,y},frozenUntil:-1});

test('raio de contágio cresce por nível, sem ultrapassar 126 px',()=>{
  assert.deepEqual([0,1,2,3,4,5,6,7,8,9,10].map(russianFrostSpreadRadius),
    [0,48,48,66,66,84,84,104,104,104,126]);
  assert.equal(RUSSIAN_FROST_SPREAD_MAX_TARGETS,4);
  assert.equal(russianSecondaryFreezeMs(1000),600);
});

test('disparo russo congela e contagia os mais próximos apenas uma vez',()=>{
  const origin=mob(1,0,0);
  const targets=Array.from({length:6},(_,i)=>mob(i+2,15+i*5,0));
  applyRussianFreeze(origin,100,1500);
  assert.equal(origin.frozenUntil,1600);
  const spread=spreadRussianFrost(origin,[origin,...targets],100,1500,48);
  assert.deepEqual(spread.map(x=>x.uid),[2,3,4,5]);
  assert.deepEqual(spread.map(x=>x.frozenUntil),[1000,1000,1000,1000]);
  assert.equal(targets[4].frozenUntil,-1);
  assert.deepEqual(spreadRussianFrost(origin,[origin,...targets],200,1500,90),[]);
});

test('o congelamento secundário atrai, mas não retransmite automaticamente',()=>{
  const a=mob(1,0,0),b=mob(2,30,0),c=mob(3,60,0);
  applyRussianFreeze(a,100,1000);
  spreadRussianFrost(a,[a,b,c],100,1000,32);
  assert.equal(b.frozenUntil,700);
  assert.equal(b.russianFrostPrimary,undefined);
  assert.deepEqual(spreadRussianFrost(b,[a,b,c],100,1000,40),[]);
  applyRussianFreeze(b,150,1000);
  assert.equal(b.russianFrostPrimary,true);
  assert.deepEqual(spreadRussianFrost(b,[a,b,c],150,1000,40)
    .map(x=>x.uid),[3]);
});

test('o gelo só pode contagiar novamente depois que acabar e for reaplicado',()=>{
  const a=mob(1,0,0),b=mob(2,15,0),c=mob(3,25,0);
  applyRussianFreeze(a,0,500);
  spreadRussianFrost(a,[a,b],0,500,25);
  applyRussianFreeze(a,100,500);
  assert.deepEqual(spreadRussianFrost(a,[a,c],100,500,25),[]);
  applyRussianFreeze(a,700,500);
  assert.deepEqual(spreadRussianFrost(a,[a,c],700,500,25)
    .map(x=>x.uid),[3]);
});

test('boss Tipo 6 não é congelado nem se torna transmissor',()=>{
  const boss=mob(9,10,0,6),origin=mob(1,0,0);
  assert.equal(applyRussianFreeze(boss,0,1000),false);
  applyRussianFreeze(origin,0,1000);
  assert.deepEqual(spreadRussianFrost(origin,[origin,boss],0,1000,50),[]);
});

test('cooldown russo 25% menor, preservando bônus híbridos',()=>{
  const br=v1CombatStats({choices:['br','br']});
  const ru1=v1CombatStats({choices:['ru']});
  const ru2=v1CombatStats({choices:['ru','ru']});
  const hybrid=v1CombatStats({choices:['ru','ru','jp','jp','jp','jp','jp','jp']});
  const jp=v1CombatStats({choices:['jp','jp','jp','jp','jp','jp']});
  assert.equal(br.specialCooldown,8000);
  assert.equal(ru1.specialCooldown,8000);
  assert.equal(ru2.specialCooldown,6000);
  assert.equal(hybrid.specialCooldown,Math.round(jp.specialCooldown*0.75));
  assert.equal(ru2.russianSpreadRadius,48);
  assert.equal(v1CombatStats({choices:Array(10).fill('ru')}).russianSpreadRadius,126);
});

test('sopro criogênico mantém aspecto frio e coexistência com laser coreano',()=>{
  const ru=shotVisualFor(['ru']),hybrid=shotVisualFor(['ru','jp']);
  assert.equal(ru.color,0xe1f9ff);
  assert.equal(hybrid.color,0xe997ff);
  assert.equal(shotVfxFor(['ru']).cryogenic,true);
  assert.equal(shotVfxFor(['ru','jp','cn']).cryogenic,true);
  assert.equal(shotVfxFor(['ru','jp','cn']).multiple,true);
  assert.equal(shotVfxFor(['br']).cryogenic,false);
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/freezeRussianEnemy\(enemy,this\.combat\.russianFreezeMs\)/);
  assert.match(scene,/spreadRussianCold\(enemy/);
  assert.match(scene,/bullet\.vfx\.cryogenic/);
});
