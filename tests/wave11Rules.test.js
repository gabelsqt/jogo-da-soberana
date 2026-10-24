import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pickBetrayer, betrayalCoalition, hostileBosses, survivingCountryLevels,
  installedSupportTowers,
} from '../src/gameplay/wave11Rules.js';

test('Brasil puro não gera traição',()=>{
  const choices=Array(10).fill('br');
  assert.equal(pickBetrayer(choices),null);
  assert.deepEqual(betrayalCoalition(choices),[]);
  assert.deepEqual(hostileBosses(choices),[]);
});
test('traidor sorteado dentre países efetivamente recrutados, nunca coalizão',()=>{
  const history=['br','us','jp','ru','us','jp','ru','br'];
  assert.equal(pickBetrayer(history,()=>0),'us');
  assert.equal(pickBetrayer(history,()=>0.45),'jp');
  assert.equal(pickBetrayer(history,()=>0.99),'ru');
  assert.deepEqual(betrayalCoalition(history,'jp'),['jp']);
  assert.deepEqual(hostileBosses(history,'jp'),[{country:'jp',level:2}]);
  assert.deepEqual(hostileBosses(history,'ru'),[{country:'ru',level:2}]);
  assert.deepEqual(betrayalCoalition(history,'cn'),['us']); // seleção inválida
});
test('somente o país sorteado perde upgrades e torres',()=>{
  const choices=['us','jp','us','jp','us','jp','br','br','br','br'];
  const levels=survivingCountryLevels(choices,'jp');
  assert.equal(levels.us,3);
  assert.equal(levels.jp,0);
  assert.equal(levels.br,4);
  assert.ok(installedSupportTowers(choices,[],'jp').some(t=>t.country==='us'));
  assert.ok(!installedSupportTowers(choices,[],'jp').some(t=>t.country==='jp'));
});
