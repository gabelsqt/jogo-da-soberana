import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOMBER_HOVER_SECONDS,
  BOMBER_SHOT_INTERVAL_SECONDS,
  advanceBomberHover,
  enemyStats,
} from '../src/gameplay/enemies.js';

test('Tipo 3 paira 6 s e lança bombas a cada 3 s em todos os níveis', () => {
  assert.equal(BOMBER_HOVER_SECONDS, 6);
  assert.equal(BOMBER_SHOT_INTERVAL_SECONDS, 3);
  for (const level of [1, 2, 3, 4, 8, 10]) {
    const bomber = enemyStats(3, level);
    assert.equal(bomber.bomberHoverDuration, 6);
    assert.equal(bomber.shotInterval, 3);
  }
});

test('durante o primeiro ciclo, há salvas aos 3 e 6 segundos e depois retirada', () => {
  let age = 0, timer = 0;
  const moments = [];
  for (let tick = 0; tick < 360; tick += 1) {
    age += 1 / 60;
    const step = advanceBomberHover(timer, age, 1 / 60);
    timer = step.shotTimer;
    for (let i = 0; i < step.shots; i += 1) moments.push(age);
    if (tick < 359) assert.equal(step.retreat, false);
    else assert.equal(step.retreat, true);
  }
  assert.equal(moments.length, 2);
  assert.ok(Math.abs(moments[0] - 3) < 1e-8);
  assert.ok(Math.abs(moments[1] - 6) < 1e-8);
});

test('o relógio zera quando o bombardeiro retoma outro ciclo', () => {
  const first = advanceBomberHover(0, 3, 3);
  assert.deepEqual(first, { shots: 1, shotTimer: 0, retreat: false });
  const second = advanceBomberHover(first.shotTimer, 6, 3);
  assert.deepEqual(second, { shots: 1, shotTimer: 0, retreat: true });
  const restart = advanceBomberHover(0, 1, 1);
  assert.deepEqual(restart, { shots: 0, shotTimer: 1, retreat: false });
});

test('GameScene retorna à parte superior e volta a atacar uma defesa', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  const ai = scene.slice(scene.indexOf('  updateEnemies(dt) {'),
    scene.indexOf('  fireEnemyProjectile('));
  assert.match(ai, /advanceBomberHover\(/);
  assert.match(ai, /this\.fireEnemyProjectile\(enemy, enemy\.target\)/);
  assert.match(ai, /enemy\.phase = 'retreat'/);
  assert.match(ai, /this\.setRoute\(enemy, enemy\.sprite\.x, -78\)/);
  assert.match(ai, /enemy\.phase = 'approach'/);
  const retreat = ai.slice(ai.indexOf("enemy.phase === 'retreat'"),
    ai.indexOf("enemy.phase === 'flyby'"));
  assert.match(retreat, /enemy\.target = this\.chooseDefenseTarget\(\)/);
  assert.doesNotMatch(retreat, /this\.removeEnemy/);
});
