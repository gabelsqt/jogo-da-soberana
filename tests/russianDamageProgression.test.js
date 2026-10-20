import test from 'node:test';
import assert from 'node:assert/strict';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';
import {russianShatterDamage,russianShatterRadius} from '../src/gameplay/russianFrost.js';

const stats=(n)=>v1CombatStats({choices:Array(n).fill('ru')});
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,
  `expected ${expected}, got ${actual}`);

test('Russian primary hit damage increases with main-weapon upgrades',()=>{
  const checkpoints=[[0,1],[1,1.75],[3,2.35],[5,3.4],[7,4.8],[10,12.48]];
  for(const [n,damage] of checkpoints)
    near(stats(n).basicDamage,damage);
  for(const [a,b] of [[0,1],[1,3],[3,5],[5,7],[7,10]])
    assert.ok(stats(b).basicDamage>stats(a).basicDamage);
});

test('Russian shatter damage grows separately from primary shot damage',()=>{
  const damageSteps=[[0,0],[1,2],[3,4],[5,7],[7,12],[10,18]];
  for(const [n,dmg] of damageSteps){
    assert.equal(stats(n).russianShatterDamage,dmg);
    assert.equal(russianShatterDamage(n),dmg);
  }
  assert.equal(russianShatterRadius(10),120);
});

test('special-only Russian levels keep main shot and shatter values unchanged',()=>{
  for(const [a,b] of [[1,2],[3,4],[5,6],[7,8],[8,9]]){
    near(stats(a).basicDamage,stats(b).basicDamage);
    assert.equal(stats(a).russianShatterDamage,stats(b).russianShatterDamage);
  }
});

test('damage combines with Brazil bonuses and final frost breath receives stronger base',()=>{
  const br=v1CombatStats({choices:Array(5).fill('br')});
  const mixed=v1CombatStats({choices:[...Array(5).fill('br'),...Array(5).fill('ru')]});
  assert.ok(mixed.basicDamage>br.basicDamage);
  assert.equal(mixed.russianShatterDamage,7);
  const final=stats(10);
  assert.equal(final.transformed,'ru');
  near(final.basicDamage*0.45,5.616); // per 110 ms damage tick
  assert.equal(final.russianFreezeMs,3000);
});
