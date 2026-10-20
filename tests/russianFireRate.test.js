import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {v1CombatStats,V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';

const stats=level=>v1CombatStats({choices:Array(level).fill('ru')});

test('Rússia acelera projéteis e disparos nos níveis primários 1, 3, 5 e 7',()=>{
  const checkpoints=[
    [0,400,480],
    [1,336,528],
    [3,276,591.36],
    [5,223,662.3232],
    [7,183,741.802],
  ];
  for(const [level,interval,speed] of checkpoints){
    const current=stats(level);
    assert.equal(current.basicInterval,interval,'cadência no nível '+level);
    assert.ok(Math.abs(current.basicSpeed-speed)<0.01,
      'velocidade dos projéteis no nível '+level);
  }
  for(const [before,after] of [[0,1],[1,3],[3,5],[5,7]]){
    assert.ok(stats(after).basicInterval<stats(before).basicInterval);
    assert.ok(stats(after).basicSpeed>stats(before).basicSpeed);
  }
});

test('níveis russos de especial não alteram cadência e velocidade do tiro normal',()=>{
  for(const [prior,next] of [[1,2],[3,4],[5,6],[7,8],[8,9]]){
    assert.equal(stats(prior).basicInterval,stats(next).basicInterval);
    assert.equal(stats(prior).basicSpeed,stats(next).basicSpeed);
  }
});

test('bônus de velocidade russa combinam com os brasileiros sem substituí-los',()=>{
  const br=v1CombatStats({choices:['br','br','br']});
  const hybrid=v1CombatStats({choices:['br','br','br','ru','ru','ru']});
  assert.ok(hybrid.basicInterval<br.basicInterval);
  assert.ok(hybrid.basicSpeed>br.basicSpeed);
  assert.equal(hybrid.russianFreezeMs,1500);
  assert.ok(V1_UPGRADES.ru.filter(u=>[1,3,5,7].includes(u.level))
    .every(u=>/velocidade|rápid|cadência|frequentes/i.test(u.description)));
});

test('nível 10 mantém a transformação em sopro gelado',()=>{
  const current=stats(10);
  assert.equal(current.transformed,'ru');
  assert.equal(current.russianFreezeMs,3000);
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/this\.combat\.basicSpeed/);
  assert.match(scene,/this\.combat\.basicInterval/);
  assert.match(scene,/this\.fireRussianBreath\(/);
});
