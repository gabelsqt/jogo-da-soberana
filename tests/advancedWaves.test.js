import test from 'node:test';
import assert from 'node:assert/strict';
import { MODES, getWaveEvents, scheduledEnemyCount, waveIsFinished } from '../src/gameplay/waves.js';
import {
  ENEMY_TYPES, enemyStats, ENEMY_TIER_COLORS,
  minibossSummonCount, MINIBOSS_MAX_SUMMONS, MINIBOSS_MAX_ACTIVE_MINIONS,
} from '../src/gameplay/enemies.js';
import {
  automaticWaveAfterVictory, activeTowerCountries, unlockedFirstUpgrades,
} from '../src/gameplay/progression.js';

function scheduledComposition(events) {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const e of events) {
    if (e.pattern === 'escort') {
      totals[3] += 1;
      totals[2] += e.count;
    } else if (e.pattern === 'bomberFan') {
      totals[3] += e.count;
    } else if (e.pattern === 'pincer') {
      totals[4] += 2;
    } else if (e.pattern === 'spread' || e.pattern === 'line' ||
               e.pattern === 'orbit' || e.group) {
      totals[e.type] += e.count ?? 3;
    } else {
      totals[e.type] += 1;
    }
  }
  return totals;
}

const expected = {
  wave5: { level: 4, seconds: 30, counts: [28, 15, 3, 3, 0], total: 49,
    last: 13500, title: 'ONDA 5 — CERCO AÉREO' },
  wave6: { level: 5, seconds: 30, counts: [45, 17, 9, 6, 0], total: 77,
    last: 13500, title: 'ONDA 6 — CHUVA DE FERRO' },
  wave7: { level: 6, seconds: 30, counts: [44, 28, 2, 4, 0], total: 78,
    last: 13500, title: 'ONDA 7 — ENXAME ORGANIZADO' },
  wave8: { level: 7, seconds: 30, counts: [36, 16, 3, 6, 1], total: 62,
    last: 13500, title: 'ONDA 8 — SUPERUNIDADES' },
  wave9: { level: 8, seconds: 30, counts: [41, 24, 5, 6, 1], total: 77,
    last: 13500, title: 'ONDA 9 — ÚLTIMO CERCO' },
};

test('Ondas 5–9 têm ritmo, composição e níveis distintos', () => {
  for (const [mode, spec] of Object.entries(expected)) {
    const events = getWaveEvents(mode);
    assert.equal(MODES[mode].title, spec.title);
    assert.equal(MODES[mode].minDuration, spec.seconds * 1000);
    assert.equal(scheduledEnemyCount(events), spec.total, mode);
    assert.deepEqual(
      Object.values(scheduledComposition(events)), spec.counts,
      `composição de ${mode}`,
    );
    assert.equal(events.at(-1).at, spec.last);
    assert.ok(events.every((event, i) =>
      Number.isInteger(event.at) && event.at >= 0 &&
      event.at < MODES[mode].minDuration &&
      event.level === spec.level &&
      (i === 0 || event.at >= events[i - 1].at)), mode);
    assert.ok(events.some((event) => event.warning), `avisos visuais ${mode}`);
    assert.deepEqual(getWaveEvents(mode), events, 'agenda determinística e testável');
  }
});

test('as cinco ondas têm identidades próprias e usam só inimigos conhecidos', () => {
  const w5 = getWaveEvents('wave5');
  const w6 = getWaveEvents('wave6');
  const w7 = getWaveEvents('wave7');
  const w8 = getWaveEvents('wave8');
  const w9 = getWaveEvents('wave9');

  assert.equal(w5.filter((e) => e.pattern === 'escort').length, 2,
    'Onda 5: 2 bombardeiros com escoltas Tipo 2');
  assert.deepEqual(w5.filter((e) => e.pattern === 'escort').map((e) => e.center),
    [350, 610]);
  assert.equal(w6.filter((e) => e.pattern === 'bomberFan').length, 2,
    'Onda 6: duas formações de três bombardeiros');
  assert.equal(w7.filter((e) => e.pattern === 'orbit').length, 2,
    'Onda 7: dois grandes círculos de formação');
  assert.equal(w7.filter((e) => e.pattern === 'line').length, 2);
  assert.equal(w8.filter((e) => e.type === 5).length, 1,
    'Onda 8: estreia do miniboss Tipo 5');
  assert.equal(w9.filter((e) => e.type === 5).length, 1,
    'Onda 9: um miniboss reforçado no cerco final');
  assert.ok([...w5, ...w6, ...w7, ...w8, ...w9].every((e) => e.type <= 5),
    'Tipo 6 permanece reservado ao chefe da Onda 10');
});

test('HP Tipo 1 progride suavemente; blindagem dos demais e cores são preservadas', () => {
  const hp = {
    wave5: [3, 5, 12, 7],
    wave6: [3, 6, 14, 8],
    wave7: [3, 7, 16, 9],
    wave8: [4, 8, 18, 10],
    wave9: [4, 9, 20, 11],
  };
  for (const [mode, values] of Object.entries(hp)) {
    const level = expected[mode].level;
    for (let type = 1; type <= 4; type += 1) {
      const enemy = enemyStats(type, level);
      assert.equal(enemy.hp, values[type - 1], `${mode} Tipo ${type}`);
      assert.equal(enemy.width, ENEMY_TYPES[type].width);
      assert.equal(enemy.height, ENEMY_TYPES[type].height);
      assert.equal(enemy.speed, enemyStats(type, 3).speed);
      assert.ok(type === 1
        ? enemy.hp >= enemyStats(type, level - 1).hp
        : enemy.hp > enemyStats(type, level - 1).hp);
      assert.equal(enemy.color, ENEMY_TIER_COLORS[level]);
      assert.equal(enemy.tintColor, ENEMY_TIER_COLORS[level]);
    }
  }
  assert.equal(enemyStats(5, 7).hp, 52);
  assert.equal(enemyStats(5, 8).hp, 56);
  assert.equal(enemyStats(5, 8).width, ENEMY_TYPES[5].width);
  assert.equal(enemyStats(5, 8).height, ENEMY_TYPES[5].height);
  assert.equal(new Set([4, 5, 6, 7, 8].map((n) => ENEMY_TIER_COLORS[n])).size, 5);
});

test('miniboss da campanha invoca no máximo 12 reforços e até 6 simultâneos', () => {
  assert.equal(MINIBOSS_MAX_SUMMONS, 12);
  assert.equal(MINIBOSS_MAX_ACTIVE_MINIONS, 6);
  assert.equal(minibossSummonCount(0, 0, 2), 2);
  assert.equal(minibossSummonCount(10, 4, 2), 2);
  assert.equal(minibossSummonCount(11, 5, 2), 1);
  assert.equal(minibossSummonCount(12, 0, 2), 0);
  assert.equal(minibossSummonCount(0, 6, 2), 0);
  assert.equal(minibossSummonCount(3, 5, 2), 1);
  assert.equal(minibossSummonCount(0, 0, -1), 0);
});

test('conclusão avança automaticamente até a Onda 9, mantendo os aliados', () => {
  for (let wave = 3; wave <= 8; wave += 1) {
    assert.equal(automaticWaveAfterVictory(`wave${wave}`), `wave${wave + 1}`);
  }
  for (const mode of ['wave0', 'wave1', 'wave2', 'wave9', 'lab', 'upgradeLab']) {
    assert.equal(automaticWaveAfterVictory(mode), null);
  }
  const state = { choices: ['br', 'br', 'br'] };
  assert.deepEqual(activeTowerCountries(state), []);
  assert.deepEqual(unlockedFirstUpgrades(state), ['br']);
});

test('Onda 9 encerra por amanhecer aos 30 s ou vitória antecipada', () => {
  const mode = 'wave9';
  const events = getWaveEvents(mode);
  const waiting = { mode, elapsed: 25000, spawned: events.length,
    scheduled: events.length, enemies: 1, hostileShots: 0 };
  assert.equal(waveIsFinished(waiting), false);
  assert.equal(waveIsFinished({ ...waiting, elapsed: 30000 }), true);
  assert.equal(waveIsFinished({ ...waiting, enemies: 0 }), true);
  assert.equal(waveIsFinished({ ...waiting, hostileShots: 1, enemies: 0 }), false);
  assert.equal(waveIsFinished({ ...waiting, spawned: events.length - 1, enemies: 0 }), false);
});
