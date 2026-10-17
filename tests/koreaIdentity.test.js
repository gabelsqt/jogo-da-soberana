import test from 'node:test';
import assert from 'node:assert/strict';
import { FIRST_UPGRADES, getFirstUpgrade, combatStatsFor, combatStatsForLoadout } from '../src/gameplay/upgrades.js';
import { SECOND_UPGRADES } from '../src/gameplay/secondUpgrades.js';
import { THIRD_UPGRADES, normalizeCampaignState, nextUpgradeOptions } from '../src/gameplay/progression.js';
import { TOWER_DEFINITIONS } from '../src/gameplay/towers.js';

test('Coreia do Sul usa identidade oficial nos três níveis e na torre', () => {
  const korea = getFirstUpgrade('jp');
  assert.equal(korea.name, 'Coreia do Sul');
  assert.equal(korea.shortName, 'Coreia');
  assert.equal(korea.flag, 'KR');
  assert.equal(korea.title, 'Lightstick Tático');
  assert.equal(SECOND_UPGRADES.jp.title, 'Encore!');
  assert.equal(THIRD_UPGRADES.jp.title, 'Palco de Luz I');
  assert.equal(TOWER_DEFINITIONS.jp.label, 'KKACHI');
  assert.equal(TOWER_DEFINITIONS.jp.glyph, 'K');

  assert.equal(FIRST_UPGRADES.length, 5);
  assert.equal(FIRST_UPGRADES.some(({ name }) => name === 'Japão'), false);
});

test('identificador legado jp preserva builds, progressão e combate', () => {
  const first = nextUpgradeOptions({}).find(({ id }) => id === 'jp');
  assert.equal(first.title, 'Lightstick Tático');
  const second = nextUpgradeOptions({ choices: ['jp'] }).find(({ id }) => id === 'jp');
  assert.equal(second.title, 'Encore!');
  const third = nextUpgradeOptions({ choices: ['jp', 'jp'] }).find(({ id }) => id === 'jp');
  assert.equal(third.title, 'Palco de Luz I');
  assert.equal(third.tower, false);
  assert.deepEqual(normalizeCampaignState({ choices: ['jp', 'jp', 'jp'] }), {
    choices: ['jp', 'jp', 'jp'],
  });
  assert.equal(combatStatsFor('jp').plasmaEvery, 4);
  assert.equal(combatStatsForLoadout(['jp', 'ru']).plasmaEvery, 4);
});
