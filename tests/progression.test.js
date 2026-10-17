import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIRST_UPGRADES, combatStatsFor, shotAngles, getFirstUpgrade,
  combatStatsForLoadout, normalizeLabUpgrades, toggleLabUpgrade,
} from '../src/gameplay/upgrades.js';
import { ENEMY_TYPES, enemyDefinition, enemyContactRadius } from '../src/gameplay/enemies.js';
import {
  MODES, getWaveEvents, waveIsFinished,
  WAVE_COUNTDOWN_SECONDS, countdownNumberAt, scheduledEnemyCount,
} from '../src/gameplay/waves.js';

test('cinco opções de upgrade independentes, uma por país', () => {
  assert.deepEqual(FIRST_UPGRADES.map((u) => u.id), ['br', 'us', 'jp', 'ru', 'cn']);
  for (const upgrade of FIRST_UPGRADES) {
    assert.equal(getFirstUpgrade(upgrade.id), upgrade);
    assert.ok(upgrade.description.length > 10);
  }
  assert.equal(getFirstUpgrade('desconhecido'), null);
});

test('as cinco primeiras melhorias alteram o combate como prometido', () => {
  const base = combatStatsFor(null);
  const br = combatStatsFor('br');
  const us = combatStatsFor('us');
  const jp = combatStatsFor('jp');
  const ru = combatStatsFor('ru');
  const cn = combatStatsFor('cn');
  assert.equal(base.basicInterval, 400);
  assert.equal(br.basicInterval, 267);
  assert.equal(us.basicDamage, base.basicDamage);
  assert.equal(us.fragmentation, true);
  assert.equal(jp.basicInterval, base.basicInterval);
  assert.equal(jp.pierce, base.pierce);
  assert.equal(jp.basicSpeed, base.basicSpeed);
  assert.equal(jp.plasmaEvery, 4);
  assert.equal(base.fragmentation, false);
  assert.equal(base.plasmaEvery, 0);
  assert.equal(ru.basicDamage, 1.75);
  assert.ok(ru.knockback > 0);
  assert.equal(cn.bulletsPerShot, 2);
  assert.equal(br.specialCooldown, 8000);
});

test('projétil extra chinês cria dois tiros simétricos', () => {
  const center = -Math.PI / 2;
  assert.deepEqual(shotAngles(center, 1), [center]);
  const shots = shotAngles(center, 2);
  assert.equal(shots.length, 2);
  assert.ok(shots[0] < center && shots[1] > center);
  assert.ok(Math.abs((shots[0] + shots[1]) / 2 - center) < 1e-12);
  const edge = shotAngles(-Math.PI / 12, 2);
  assert.ok(edge.every((angle) => angle <= -Math.PI / 12));
  assert.ok(edge.every((angle) => angle >= -Math.PI + Math.PI / 12));
});

test('cinco inimigos possuem HP e dimensões distintos, tipos 2-5 quadrados coloridos', () => {
  assert.deepEqual(Object.keys(ENEMY_TYPES).map(Number), [1, 2, 3, 4, 5]);
  assert.equal(enemyDefinition(1).hp, 1);
  assert.equal(enemyDefinition(2).hp, 2);
  assert.ok(enemyDefinition(3).shotHp >= 1);
  assert.equal(enemyDefinition(4).behavior, 'fighter');
  assert.equal(enemyDefinition(5).behavior, 'boss');
  for (const type of [2, 3, 4, 5]) {
    assert.ok(enemyDefinition(type).color > 0);
    assert.ok(enemyContactRadius(type) > 0);
  }
  assert.throws(() => enemyDefinition(99));
});

test('onda zero, onda um e laboratório possuem programação distinta', () => {
  assert.equal(getWaveEvents('wave0').length, 23);
  assert.equal(scheduledEnemyCount(getWaveEvents('wave0')), 32);
  const wave1 = getWaveEvents('wave1');
  assert.ok(wave1.some((e) => e.type === 2 && e.group));
  assert.equal(wave1.filter((e) => e.type === 1 && !e.pattern).length, 32);
  assert.equal(scheduledEnemyCount(wave1), 70);
  assert.deepEqual(wave1.filter((e) => e.pattern === 'spread').map((e) => e.count), [3, 4, 5]);
  assert.ok(wave1.some((e) => e.type === 2 && e.level === 2 && e.pattern === 'orbit' && e.count === 10));
  assert.ok(wave1.some((e) => e.type === 2 && e.group && e.level === 2));
  const finale = wave1.find((e) => e.pattern === 'line');
  assert.ok(finale && finale.type === 1 && finale.count === 10 && finale.level === 2);
  assert.ok(finale.at > wave1.filter((e) => e.pattern !== 'line').at(-1).at);
  const lab = getWaveEvents('lab');
  assert.deepEqual([...new Set(lab.map((e) => e.type))].sort(), [1, 2, 3, 4, 5]);
  for (const mode of Object.keys(MODES)) {
    const events = getWaveEvents(mode);
    assert.ok(events.every((event) => event.at >= 0 && ENEMY_TYPES[event.type]));
    assert.ok(events.every((event, index) => index === 0 || event.at >= events[index - 1].at));
  }
});

test('vitória antecipada exige agenda esgotada e céu limpo; amanhecer aceita sobreviventes', () => {
  const state = {
    mode: 'wave1',
    elapsed: 20000,
    spawned: getWaveEvents('wave1').length,
    scheduled: getWaveEvents('wave1').length,
    enemies: 0, hostileShots: 0,
  };
  assert.equal(waveIsFinished(state), true);
  assert.equal(waveIsFinished({ ...state, enemies: 1 }), false);
  assert.equal(waveIsFinished({ ...state, hostileShots: 1 }), false);
  assert.equal(waveIsFinished({ ...state, spawned: 1 }), false);
  assert.equal(waveIsFinished({ ...state, elapsed: 29999, enemies: 1 }), false);
  assert.equal(waveIsFinished({ ...state, elapsed: 30000, enemies: 1 }), true);
  assert.equal(waveIsFinished({ ...state, elapsed: 30000, spawned: 1 }), true);
});

test('laboratório de upgrades é livre, sem depender de ondas', () => {
  assert.equal(MODES.upgradeLab.title, 'LAB DE UPGRADES');
  assert.deepEqual(getWaveEvents('upgradeLab'), []);
  assert.equal(waveIsFinished({
    mode: 'upgradeLab', elapsed: 999999, spawned: 0, scheduled: 0,
    enemies: 0, hostileShots: 0,
  }), false);
});

test('laboratório ativa e desativa melhorias sem duplicatas nem IDs inválidos', () => {
  assert.deepEqual(normalizeLabUpgrades(['br', 'br', 'xx', 'cn']), ['br', 'cn']);
  assert.deepEqual(toggleLabUpgrade([], 'br'), ['br']);
  assert.deepEqual(toggleLabUpgrade(['br', 'cn'], 'br'), ['cn']);
  assert.deepEqual(toggleLabUpgrade(['br'], 'xx'), ['br']);
  assert.deepEqual(normalizeLabUpgrades(null), []);
});

test('laboratório combina Lightstick, Fragmentação e os outros países sem alterar atributos básicos', () => {
  const stats = combatStatsForLoadout(['br', 'jp', 'us', 'ru', 'cn']);
  assert.equal(stats.basicInterval, 267);
  assert.equal(stats.basicDamage, 1.75);
  assert.equal(stats.pierce, 1);
  assert.equal(stats.basicSpeed, 480);
  assert.equal(stats.fragmentation, true);
  assert.equal(stats.plasmaEvery, 4);
  assert.equal(stats.bulletsPerShot, 2);
  assert.equal(stats.knockback, 0.12);
  assert.equal(stats.specialCooldown, 8000);
  assert.deepEqual(combatStatsForLoadout([]), combatStatsFor(null));
  assert.deepEqual(combatStatsForLoadout(['br', 'br']), combatStatsFor('br'));
  assert.deepEqual(combatStatsForLoadout(['jp']), combatStatsFor('jp'));
  assert.deepEqual(combatStatsForLoadout(['us']), combatStatsFor('us'));
});

test('ondas 0 e 1 começam cedo, têm pressão contínua e grupos simultâneos', () => {
  const wave0 = getWaveEvents('wave0');
  const wave1 = getWaveEvents('wave1');
  const lab = getWaveEvents('lab');
  assert.ok(wave0[0].at > 0 && wave0[0].at < 500);
  assert.ok(wave1[0].at > 0 && wave1[0].at < 500);
  assert.equal(scheduledEnemyCount(wave0), 32);
  assert.equal(scheduledEnemyCount(wave1), 70);
  assert.ok(scheduledEnemyCount(wave1) > scheduledEnemyCount(wave0));
  assert.deepEqual(wave0.filter((e) => e.pattern === 'spread').map((e) => e.count), [3, 4, 5]);
  assert.ok(wave1.some((e) => e.pattern === 'line' && e.count === 10));
  assert.ok(wave1.some((e) => e.pattern === 'orbit' && e.count === 10));
  const basic0 = wave0.filter((e) => e.type === 1 && !e.pattern);
  const basic1 = wave1.filter((e) => e.type === 1 && !e.pattern);
  assert.equal(basic0.length, 20);
  assert.equal(basic1.length, 32);
  assert.ok(basic0.every((e, i) => i === 0 || Math.abs((e.at - basic0[i - 1].at) - 1280 * 19500 / 24570) <= 1));
  assert.ok(basic1.every((e, i) => i === 0 || Math.abs((e.at - basic1[i - 1].at) - 960 * 19500 / 34700) <= 1));
  assert.ok(lab.some((e) => e.type === 5));
});

test('contagem regressiva da onda exibe 3, 2, 1 e só termina após três segundos', () => {
  assert.equal(WAVE_COUNTDOWN_SECONDS, 3);
  assert.equal(countdownNumberAt(0), 3);
  assert.equal(countdownNumberAt(999), 3);
  assert.equal(countdownNumberAt(1000), 2);
  assert.equal(countdownNumberAt(1999), 2);
  assert.equal(countdownNumberAt(2000), 1);
  assert.equal(countdownNumberAt(2999), 1);
  assert.equal(countdownNumberAt(3000), null);
  assert.equal(countdownNumberAt(-1), null);
});

test('grupos contam OVNIs reais sem alterar o número de eventos programados', () => {
  const wave0 = getWaveEvents('wave0');
  const wave1 = getWaveEvents('wave1');
  assert.equal(wave0.length, 23);
  assert.equal(wave1.length, 39);
  assert.equal(scheduledEnemyCount(wave0), 32);
  assert.equal(scheduledEnemyCount(wave1), 70);
  assert.equal(scheduledEnemyCount([]), 0);
  assert.equal(scheduledEnemyCount([
    { type: 1 }, { type: 1, pattern: 'spread', count: 4 },
    { type: 2, group: true }, { type: 2, pattern: 'orbit', count: 10 },
    { type: 1, pattern: 'line', count: 10 },
  ]), 28);
});
