import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  WAVE_DURATION_MS,
  WAVE_FIRST_SPAWN_WINDOW_MS,
  WAVE_LAST_SPAWN_MS,
  MODES, getWaveEvents, waveOutcome, waveIsFinished,
  fitWaveEventsToWindow,
} from '../src/gameplay/waves.js';

const modes = Array.from({ length: 10 }, (_, i) => `wave${i}`);

test('todas as noites de campanha duram 30 s e encerram aparições iniciais antes de 20 s', () => {
  assert.equal(WAVE_DURATION_MS, 30000);
  assert.equal(WAVE_FIRST_SPAWN_WINDOW_MS, 15000);
  assert.equal(WAVE_LAST_SPAWN_MS, 13500);
  for (const mode of modes) {
    assert.equal(MODES[mode].minDuration, 30000, mode);
    const events = getWaveEvents(mode);
    assert.ok(events.length, mode);
    assert.equal(events.at(-1).at, WAVE_LAST_SPAWN_MS, mode);
    assert.ok(events.every((event, i) =>
      event.at >= 0 && event.at < 15000 &&
      (i === 0 || events[i - 1].at <= event.at)), mode);
    assert.deepEqual(getWaveEvents(mode), events, `${mode} deve ser determinística`);
  }
});

test('normalização preserva ordem, tipos, dificuldades e padrões', () => {
  const raw = [
    { at: 1000, type: 1, level: 2, pattern: 'spread', count: 3 },
    { at: 2500, type: 4, side: 'left', warning: 'PINÇA' },
    { at: 4100, type: 2, group: true, count: 4 },
  ];
  const scheduled = fitWaveEventsToWindow(raw);
  assert.deepEqual(scheduled.map(e => e.at), [3293, 8232, 13500]);
  assert.deepEqual(scheduled.map(({at,...other}) => other),
    raw.map(({at,...other}) => other));
  assert.equal(raw.at(-1).at, 4100, 'não modifica os horários originais');
  assert.deepEqual(fitWaveEventsToWindow([]), []);
});

test('vitória antecipada só ocorre depois de todos spawns e ameaças desaparecerem', () => {
  const state = { mode: 'wave4', elapsed: 23000,
    spawned: 12, scheduled: 12, enemies: 0, hostileShots: 0 };
  assert.equal(waveOutcome(state), 'cleared');
  assert.equal(waveOutcome({ ...state, enemies: 1 }), null);
  assert.equal(waveOutcome({ ...state, hostileShots: 1 }), null);
  assert.equal(waveOutcome({ ...state, spawned: 11 }), null);
  assert.equal(waveOutcome({ ...state, scheduled: 0, spawned: 0 }), null);
  assert.equal(waveIsFinished(state), true);
});

test('ao chegar em zero, basta defender canhão, mesmo com inimigos e bombas na tela', () => {
  const state = { mode: 'wave9', elapsed: 29999,
    spawned: 5, scheduled: 19, enemies: 22, hostileShots: 8 };
  assert.equal(waveOutcome(state), null);
  assert.equal(waveOutcome({ ...state, elapsed: 30000 }), 'survived');
  assert.equal(waveOutcome({ ...state, elapsed: 32000 }), 'survived');
  assert.equal(waveOutcome({ ...state, mode: 'upgradeLab', elapsed: 900000 }), null);
});

test('GameScene congela combate no zero, mostra mensagem, portal e carrega mesa depois', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(scene, /this\.elapsed >= WAVE_DURATION_MS/);
  assert.match(scene, /showWaveComplete\('survived'\)/);
  assert.match(scene, /AMANHECEU! O RIO RESISTIU!/);
  assert.match(scene, /CÉU LIMPO! VITÓRIA ANTECIPADA!/);
  assert.match(scene, /this\.time\.delayedCall\(1700/);
  assert.match(scene, /scene\.start\('BotecoElevatorScene'/);
});
