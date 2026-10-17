import test from 'node:test';
import assert from 'node:assert/strict';
import { getAdvancedWaveEvents } from '../src/gameplay/advancedWaves.js';
import { scheduledEnemyCount, MODES, getWaveEvents } from '../src/gameplay/waves.js';
import { FOURTH_UPGRADES, unlockedFourthUpgradeCountries } from '../src/gameplay/fourthUpgrades.js';
import { nextUpgradeOptions, nextWaveAfterChoice, chooseCampaignUpgrade } from '../src/gameplay/progression.js';

test('Onda 5 dura 30 segundos e preserva 49 invasores agendados', () => {
  const events = getAdvancedWaveEvents('wave5');
  assert.equal(MODES.wave5.minDuration, 30000);
  assert.equal(events.at(-1).at, 44500);
  assert.equal(getWaveEvents('wave5').at(-1).at, 19500);
  assert.equal(scheduledEnemyCount(events), 49);
});
test('cinco upgrades de nível 4 têm efeito adicional ao tiro especial', () => {
  assert.deepEqual(Object.keys(FOURTH_UPGRADES), ['br','us','jp','ru','cn']);
  for (const country of Object.keys(FOURTH_UPGRADES)) {
    const state={choices:[country,country,country]};
    const option=nextUpgradeOptions(state).find(x=>x.id===country);
    assert.equal(option.level,4);
    assert.equal(option.locked,false);
    assert.ok(option.description.length>30);
    const chosen=chooseCampaignUpgrade(state,country);
    assert.equal(chosen.choices.length,4);
    assert.equal(nextWaveAfterChoice(chosen),'wave4');
    assert.deepEqual(unlockedFourthUpgradeCountries(chosen),[country]);
  }
});
test('após a onda 4, permite uma quinta escolha de outro país', () => {
  const state={choices:['br','br','br','br']};
  const available=nextUpgradeOptions(state).filter(o=>!o.locked);
  assert.ok(available.some(x=>x.id==='us' && x.level===1));
  assert.equal(nextWaveAfterChoice({choices:[...state.choices,'us']}),'wave5');
});
