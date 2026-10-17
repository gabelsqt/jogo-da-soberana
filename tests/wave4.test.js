import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MODES, getWaveEvents, scheduledEnemyCount, waveIsFinished,
} from '../src/gameplay/waves.js';
import {
  enemyDefinition, enemyStats, enemyTierColor, ENEMY_TIER_COLORS,
} from '../src/gameplay/enemies.js';
import {
  automaticWaveAfterVictory, activeTowerCountries, unlockedSecondUpgrades,
} from '../src/gameplay/progression.js';

function countByType(events) {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const event of events) {
    const count = event.pattern === 'pincer' ? 2
      : event.pattern === 'spread' || event.pattern === 'line' ||
        event.pattern === 'orbit' || event.group ? event.count ?? 3 : 1;
    totals[event.type] += count;
  }
  return totals;
}

test('Onda 4 tem 80 inimigos blindados com a composição aprovada', () => {
  const events = getWaveEvents('wave4');
  assert.equal(MODES.wave4.title, 'ONDA 4 — ATAQUE EM PINÇA');
  assert.equal(MODES.wave4.minDuration, 30000);
  assert.equal(scheduledEnemyCount(events), 80);
  assert.deepEqual(countByType(events), { 1: 47, 2: 20, 3: 5, 4: 8 });
  assert.ok(events.every(({ level }) => level === 3),
    'todos os inimigos da Onda 4 recebem o nível 3');
  assert.ok(events.every(({ at }) => at >= 0 && at < 20000));
  assert.ok(events.every((event, index) => index === 0 ||
    event.at >= events[index - 1].at));
  assert.equal(events.at(-1).at, 19500);
});

test('pinças têm caças nos dois lados e atrasos exatos de 1,5 s', () => {
  const events = getWaveEvents('wave4');
  const paired = events.filter(({ pattern }) => pattern === 'pincer');
  assert.deepEqual(paired.map(({ at, type }) => [at, type]),
    [[13800, 4], [57800, 4]].map(([at, type]) =>
      [Math.round(at / 63800 * 19500), type]));
  assert.ok(paired.every(({ warning }) => Boolean(warning)));

  const singles = events.filter(({ type, side }) => type === 4 && side);
  assert.deepEqual(singles.map(({ at, side }) => [at, side]), [
    [38500, 'left'], [40000, 'right'],
    [46000, 'right'], [47500, 'left'],
  ].map(([at, side]) => [Math.round(at / 63800 * 19500), side]));
  assert.ok(Math.abs(singles[1].at - singles[0].at - 1500 * 19500 / 63800) <= 1);
  assert.ok(Math.abs(singles[3].at - singles[2].at - 1500 * 19500 / 63800) <= 1);
  assert.ok(events.some(({ type, group, count }) => type === 2 && group && count === 4));
  assert.ok(events.some(({ type, pattern, count }) =>
    type === 2 && pattern === 'orbit' && count === 10));
});

test('novos inimigos têm HP aumentado, mesmo tamanho e velocidade estabilizada', () => {
  const expected = { 1: 2, 2: 4, 3: 10, 4: 6 };
  const next = { 1: 3, 2: 5, 3: 12, 4: 7 };
  for (let type = 1; type <= 4; type += 1) {
    const base = enemyDefinition(type);
    const prior = enemyStats(type, 2);
    const reinforced = enemyStats(type, 3);
    const future = enemyStats(type, 4);
    assert.equal(reinforced.hp, expected[type], `HP do tipo ${type} na Onda 4`);
    assert.equal(future.hp, next[type], `HP futuro do tipo ${type}`);
    assert.ok(type === 1 ? reinforced.hp >= prior.hp : reinforced.hp > prior.hp);
    assert.equal(reinforced.width, base.width);
    assert.equal(reinforced.height, base.height);
    assert.equal(future.width, base.width);
    assert.equal(future.height, base.height);
    assert.equal(reinforced.speed, prior.speed,
      'o jogador enfrenta blindagem, não uma velocidade cada vez maior');
  }
  assert.ok(enemyStats(2, 3).formationWaitBonus > enemyStats(2, 2).formationWaitBonus);
  assert.equal(enemyStats(3, 3).bomberHoverDuration, 12);
  assert.equal(enemyStats(3, 2).bomberHoverDuration, 12);
  assert.equal(enemyStats(4, 2).fighterExtraPasses, 0);
  assert.equal(enemyStats(4, 3).fighterExtraPasses, 1);
});

test('níveis reforçados têm cores diferentes e níveis 1/2 são preservados', () => {
  assert.equal(enemyTierColor(1), null);
  assert.equal(enemyTierColor(2), null);
  assert.equal(enemyStats(1, 1).tintColor, 0xffffff);
  assert.equal(enemyStats(1, 2).tintColor, 0xffd5a0);
  assert.equal(enemyStats(2, 2).color, enemyDefinition(2).color);
  assert.equal(enemyTierColor(3), ENEMY_TIER_COLORS[3]);
  assert.equal(new Set(Object.values(ENEMY_TIER_COLORS)).size,
    Object.values(ENEMY_TIER_COLORS).length);
  for (let level = 3; level <= 9; level += 1) {
    assert.equal(enemyStats(1, level).tintColor, ENEMY_TIER_COLORS[level]);
    assert.equal(enemyStats(3, level).color, ENEMY_TIER_COLORS[level]);
  }
});

test('ao vencer Onda 3 começa Onda 4 preservando escolhas e sem quarto upgrade', () => {
  assert.equal(automaticWaveAfterVictory('wave0'), null);
  assert.equal(automaticWaveAfterVictory('wave1'), null);
  assert.equal(automaticWaveAfterVictory('wave2'), null);
  assert.equal(automaticWaveAfterVictory('wave3'), 'wave4');
  assert.equal(automaticWaveAfterVictory('wave4'), 'wave5',
    'as ondas novas seguem automaticamente até que os upgrades sejam definidos');
  const state = { choices: ['br', 'br', 'br'] };
  assert.deepEqual(activeTowerCountries(state), []);
  assert.deepEqual(unlockedSecondUpgrades(state), ['br']);
  assert.deepEqual(state.choices, ['br', 'br', 'br']);
});

test('a Onda 4 termina por céu limpo ou ao resistir até 30 s', () => {
  const wave = getWaveEvents('wave4');
  const ready = { mode: 'wave4', elapsed: 22000, spawned: wave.length,
    scheduled: wave.length, enemies: 0, hostileShots: 0 };
  assert.equal(waveIsFinished(ready), true);
  assert.equal(waveIsFinished({ ...ready, enemies: 1 }), false);
  assert.equal(waveIsFinished({ ...ready, hostileShots: 1 }), false);
  assert.equal(waveIsFinished({ ...ready, spawned: wave.length - 1 }), false);
  assert.equal(waveIsFinished({ ...ready, elapsed: 30000, enemies: 1 }), true);
});
