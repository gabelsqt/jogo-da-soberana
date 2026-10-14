import test from 'node:test';
import assert from 'node:assert/strict';
import {
  enemyStats,
  enemyDefinition,
  lineFormationX,
  orbitalFormationPosition,
  bossCruiseX,
} from '../src/gameplay/enemies.js';
import { shotVisualFor, combatStatsForLoadout } from '../src/gameplay/upgrades.js';
import { getWaveEvents } from '../src/gameplay/waves.js';

test('todos os tipos possuem dois níveis de dificuldade e atributos progressivos', () => {
  for (let type = 1; type <= 5; type += 1) {
    const base = enemyStats(type, 1);
    const hard = enemyStats(type, 2);
    assert.equal(base.level, 1);
    assert.equal(hard.level, 2);
    assert.ok(hard.hp >= base.hp, 'HP não pode cair no nível 2');
    assert.ok(hard.speed > base.speed, 'velocidade deve subir no nível 2');
    assert.equal(base.hp, enemyDefinition(type).hp);
    assert.equal(enemyStats(type, 15).level, 2);
  }
  assert.ok(enemyStats(3, 2).shotInterval < enemyStats(3, 1).shotInterval);
  assert.equal(enemyStats(3, 1).volleyCount, 1);
  assert.equal(enemyStats(3, 2).volleyCount, 2);
  assert.ok(enemyStats(4, 2).warningDuration < enemyStats(4, 1).warningDuration);
  assert.ok(enemyStats(5, 2).spawnInterval < enemyStats(5, 1).spawnInterval);
  assert.equal(enemyStats(5, 1).spawnCount, 1);
  assert.equal(enemyStats(5, 2).spawnCount, 2);
});

test('a fileira final cobre praticamente toda a largura sem sair da tela', () => {
  const xs = Array.from({ length: 10 }, (_, index) => lineFormationX(index, 10));
  assert.equal(xs.length, 10);
  assert.equal(xs[0], 46);
  assert.equal(xs.at(-1), 914);
  assert.ok(xs.every((x, i) => x >= 0 && x <= 960 && (i === 0 || x > xs[i - 1])));
  assert.equal(lineFormationX(0, 1), 480);
  const finale = getWaveEvents('wave1').at(-1);
  assert.deepEqual(
    { type: finale.type, level: finale.level, pattern: finale.pattern, count: finale.count },
    { type: 1, level: 2, pattern: 'line', count: 10 },
  );
});

test('dez naves em órbita possuem posições distribuídas e movimento circular', () => {
  const positions = Array.from(
    { length: 10 }, (_, i) => orbitalFormationPosition(480, 162, i, 10, 0),
  );
  assert.equal(positions.length, 10);
  const roundedPositions = new Set(positions.map((p) => p.x.toFixed(2) + '/' + p.y.toFixed(2)));
  assert.equal(roundedPositions.size, 10);
  for (const p of positions) {
    assert.ok(p.x > 240 && p.x < 720);
    assert.ok(p.y >= 100 && p.y <= 224);
  }
  const later = orbitalFormationPosition(480, 162, 0, 10, 0.8);
  assert.ok(Math.hypot(later.x - positions[0].x, later.y - positions[0].y) > 25);
  assert.ok(getWaveEvents('lab').some((e) => (
    e.type === 2 && e.level === 2 && e.pattern === 'orbit' && e.count === 10
  )));
});

test('Nave-Mãe começa a patrulha na mesma posição em que terminou a chegada', () => {
  for (const entryX of [260, 480, 700]) {
    assert.equal(bossCruiseX(entryX, 0), entryX);
    assert.ok(Math.abs(bossCruiseX(entryX, 1 / 60) - entryX) < 1);
    for (const t of [0.2, 1, 5, 10]) {
      assert.ok(Math.abs(bossCruiseX(entryX, t) - entryX) <= 130);
    }
  }
});

test('armas têm paletas e tamanhos distintos, além de alterações de atributos', () => {
  const variants = ['br', 'us', 'jp', 'ru', 'cn'].map((id) => shotVisualFor([id]));
  assert.equal(new Set(variants.map((v) => v.color)).size, 5);
  assert.ok(shotVisualFor(['us']).width > shotVisualFor(['br']).width);
  assert.ok(shotVisualFor(['jp']).length > shotVisualFor(['br']).length);
  assert.equal(combatStatsForLoadout(['jp']).plasmaEvery, 3);
  assert.equal(combatStatsForLoadout(['us']).fragmentation, true);
  assert.equal(combatStatsForLoadout(['jp']).basicSpeed, 480);
});
