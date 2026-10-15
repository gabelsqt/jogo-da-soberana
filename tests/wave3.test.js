import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MODES, WAVE_COUNTDOWN_SECONDS, getWaveEvents,
  scheduledEnemyCount, waveIsFinished,
} from '../src/gameplay/waves.js';
import {
  chooseCampaignUpgrade, countryLevel, activeTowerCountries,
  unlockedFirstUpgrades, unlockedSecondUpgrades, nextUpgradeOptions,
  nextWaveAfterChoice,
} from '../src/gameplay/progression.js';

test('Onda 3 é desbloqueada pela terceira escolha e não antes', () => {
  assert.equal(nextWaveAfterChoice({ choices: [] }), null);
  assert.equal(nextWaveAfterChoice({ choices: ['br'] }), 'wave1');
  assert.equal(nextWaveAfterChoice({ choices: ['br', 'br'] }), 'wave2');
  assert.equal(nextWaveAfterChoice({ choices: ['br', 'br', 'br'] }), 'wave3');
  assert.equal(nextWaveAfterChoice({ choices: ['br', 'us', 'jp'] }), 'wave3');
  assert.equal(nextWaveAfterChoice({ choices: ['br', 'br', 'br', 'br'] }), null);
  assert.equal(WAVE_COUNTDOWN_SECONDS, 3);
});

test('escolher o mesmo país três vezes instala só a primeira torre', () => {
  for (const country of ['br', 'us', 'jp', 'ru', 'cn']) {
    let state = {};
    for (let i = 0; i < 3; i += 1) {
      state = chooseCampaignUpgrade(state, country);
      assert.ok(state, `deve ser possível escolher ${country} no nível ${i+1}`);
    }
    assert.equal(countryLevel(state, country), 3);
    assert.deepEqual(activeTowerCountries(state), [country]);
    assert.deepEqual(unlockedSecondUpgrades(state), [country]);
    assert.deepEqual(unlockedFirstUpgrades(state), [country]);
    assert.equal(nextWaveAfterChoice(state), 'wave3');
  }
});

test('três escolhas de países diferentes não criam torre automática', () => {
  const state = { choices: ['jp', 'cn', 'br'] };
  assert.deepEqual(activeTowerCountries(state), []);
  assert.deepEqual(unlockedFirstUpgrades(state), ['jp', 'cn', 'br']);
  assert.deepEqual(unlockedSecondUpgrades(state), []);
  assert.equal(nextWaveAfterChoice(state), 'wave3');
  assert.ok(nextUpgradeOptions({ choices: ['jp', 'cn'] }).every(
    ({ id, level }) => ['jp', 'cn'].includes(id) ? level === 2 : level === 1,
  ));
});

test('Onda 3 tem 88 invasores em ondas legíveis e sobrepostas, sem chefe', () => {
  const wave = getWaveEvents('wave3');
  assert.equal(MODES.wave3.title, 'ONDA 3 — CÉU FECHADO');
  assert.equal(MODES.wave3.minDuration, 54000);
  assert.equal(scheduledEnemyCount(wave), 88);
  assert.equal(wave.at(0).at, 550);
  assert.equal(wave.at(-1).at, 48900);
  assert.ok(wave.every(({ at }) => at >= 0 && at < MODES.wave3.minDuration));
  assert.ok(wave.every(({ type }) => [1, 2, 3, 4].includes(type)));
  assert.ok(wave.every((event, index) => index === 0 || event.at >= wave[index - 1].at));

  const bombers = wave.filter(({ type }) => type === 3);
  const fighters = wave.filter(({ type }) => type === 4);
  assert.equal(bombers.length, 5);
  assert.equal(fighters.length, 4);
  assert.ok(wave.some(({ type, pattern, count }) =>
    type === 2 && pattern === 'orbit' && count === 10));
  assert.ok(wave.some(({ type, pattern, count, level }) =>
    type === 1 && pattern === 'line' && count === 10 && level === 2));
  assert.ok(wave.some(({ type, group }) => type === 2 && group));
  assert.ok(wave.some(({ level }) => level === 2));
  assert.ok(wave.some(({ warning }) => /BOMBARDEIO/.test(warning ?? '')));
  assert.ok(wave.some(({ warning }) => /CRUZADOS/.test(warning ?? '')));
});

test('Onda 3 só termina após agenda, inimigos, tiros hostis e duração mínima', () => {
  const mode = 'wave3';
  const scheduled = getWaveEvents(mode).length;
  const ready = { mode, elapsed: 54000, spawned: scheduled, scheduled,
    enemies: 0, hostileShots: 0 };
  assert.equal(waveIsFinished(ready), true);
  for (const bad of [
    { elapsed: 53999 }, { spawned: scheduled - 1 },
    { enemies: 1 }, { hostileShots: 1 },
  ]) {
    assert.equal(waveIsFinished({ ...ready, ...bad }), false);
  }
});
