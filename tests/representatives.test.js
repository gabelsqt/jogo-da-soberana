import test from 'node:test';
import assert from 'node:assert/strict';
import { REPRESENTATIVES, representativeLine } from '../src/gameplay/representatives.js';
import { nextUpgradeOptions, chooseCampaignUpgrade } from '../src/gameplay/progression.js';

test('mesa oferece cinco representantes com emblemas e diálogos', () => {
  const ids=['br','us','jp','ru','cn'];
  assert.deepEqual(Object.keys(REPRESENTATIVES),ids);
  for (const id of ids) {
    assert.ok(REPRESENTATIVES[id].emblem);
    assert.ok(representativeLine(id).length>20);
    assert.ok(representativeLine(id,'accepted').length>10);
  }
  assert.equal(REPRESENTATIVES.jp.emblem,'KR');
});
test('a cena mantém as regras de progressão e bloqueio', () => {
  const start={choices:[]};
  assert.equal(nextUpgradeOptions(start).length,5);
  const one=chooseCampaignUpgrade(start,'br');
  assert.deepEqual(one.choices,['br']);
  assert.equal(nextUpgradeOptions(one).find(x=>x.id==='br').level,2);
});
