import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_CANNON_INTERVAL_MS,combatStatsFor,combatStatsForLoadout,
} from '../src/gameplay/upgrades.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';

test('canhão básico comum a campanha e laboratório dispara a cada 300 ms',()=>{
  assert.equal(BASE_CANNON_INTERVAL_MS,300);
  assert.equal(combatStatsFor(null).basicInterval,300);
  assert.equal(combatStatsForLoadout([]).basicInterval,300);
  assert.equal(v1CombatStats({choices:[]}).basicInterval,300);
  assert.ok(1000/BASE_CANNON_INTERVAL_MS > 1000/400);
});

test('cada melhoria deriva de mesma cadência base sem bônus exclusivo da onda 0',()=>{
  assert.equal(combatStatsFor('br').basicInterval,200);
  assert.equal(combatStatsForLoadout(['br']).basicInterval,200);
  assert.equal(v1CombatStats({choices:['br']}).basicInterval,150);
  const russia=v1CombatStats({choices:['ru']});
  assert.equal(russia.basicInterval,252);
  const usa=v1CombatStats({choices:['us']});
  assert.equal(usa.basicInterval,300);
  const china=v1CombatStats({choices:['cn']});
  assert.equal(china.basicInterval,300);
  const korea=v1CombatStats({choices:['jp']});
  assert.equal(korea.basicInterval,300);
  assert.equal(v1CombatStats({choices:Array(10).fill('jp')}).basicInterval,90,
    'transformação laser coreana mantém seu próprio ritmo fixo');
});
