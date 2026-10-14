import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIRST_UPGRADES, combatStatsFor, shotAngles, getFirstUpgrade,
  combatStatsForLoadout, normalizeLabUpgrades, toggleLabUpgrade,
} from '../src/gameplay/upgrades.js';
import { ENEMY_TYPES, enemyDefinition, enemyContactRadius } from '../src/gameplay/enemies.js';
import { MODES, getWaveEvents, waveIsFinished } from '../src/gameplay/waves.js';

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
  assert.equal(base.basicInterval, 500);
  assert.equal(br.basicInterval, 400);
  assert.equal(us.basicDamage, 2);
  assert.ok(jp.basicInterval < base.basicInterval);
  assert.equal(jp.pierce, 2);
  assert.equal(jp.basicSpeed, 680);
  assert.equal(base.basicSpeed, 480);
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
  assert.equal(getWaveEvents('wave0').length, 10);
  const wave1 = getWaveEvents('wave1');
  assert.ok(wave1.some((e) => e.type === 2 && e.group));
  assert.equal(wave1.filter((e) => e.type === 1 && !e.pattern).length, 12);
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

test('progressão só acontece com todos os eventos e ameaças encerrados', () => {
  const state = {
    mode: 'wave1',
    elapsed: MODES.wave1.minDuration,
    spawned: getWaveEvents('wave1').length,
    scheduled: getWaveEvents('wave1').length,
    enemies: 0, hostileShots: 0,
  };
  assert.equal(waveIsFinished(state), true);
  assert.equal(waveIsFinished({ ...state, enemies: 1 }), false);
  assert.equal(waveIsFinished({ ...state, hostileShots: 1 }), false);
  assert.equal(waveIsFinished({ ...state, elapsed: 20000 }), false);
  assert.equal(waveIsFinished({ ...state, spawned: 1 }), false);
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

test('melhorias brasileiras e japonesas acumulam cadência; EUA e Rússia acumulam dano', () => {
  const stats = combatStatsForLoadout(['br', 'jp', 'us', 'ru', 'cn']);
  assert.equal(stats.basicInterval, 272);
  assert.equal(stats.basicDamage, 3.5);
  assert.equal(stats.pierce, 2);
  assert.equal(stats.basicSpeed, 680);
  assert.equal(stats.bulletsPerShot, 2);
  assert.equal(stats.knockback, 0.12);
  assert.equal(stats.specialCooldown, 8000);
  assert.deepEqual(combatStatsForLoadout([]), combatStatsFor(null));
  assert.deepEqual(combatStatsForLoadout(['br', 'br']), combatStatsFor('br'));
});
