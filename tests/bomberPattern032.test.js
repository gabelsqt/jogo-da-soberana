import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BOMBER_HOVER_SECONDS,
  BOMBER_SHOT_INTERVAL_SECONDS,
  advanceBomberHover,
  enemyStats,
} from '../src/gameplay/enemies.js';

test('Tipo 3 paira 12 s e lança quatro salvas a cada 3 s em todos os níveis', () => {
  assert.equal(BOMBER_HOVER_SECONDS, 12);
  assert.equal(BOMBER_SHOT_INTERVAL_SECONDS, 3);
  for (const level of [1, 2, 3, 4, 8, 10]) {
    const bomber = enemyStats(3, level);
    assert.equal(bomber.bomberHoverDuration, 12);
    assert.equal(bomber.shotInterval, 3);
  }
});

test('ciclo de 12 segundos: quatro salvas, recuo somente após a quarta', () => {
  let age = 0, timer = 0;
  const moments = [];
  for (let tick = 0; tick < 720; tick += 1) {
    age += 1 / 60;
    const step = advanceBomberHover(timer, age, 1 / 60);
    timer = step.shotTimer;
    for (let i = 0; i < step.shots; i += 1) moments.push(age);
    assert.equal(step.retreat, tick === 719,
      'não deve recuar antes da quarta salva aos 12 s');
  }
  assert.equal(moments.length, 4);
  for (let i = 0; i < 4; i += 1) {
    assert.ok(Math.abs(moments[i] - (i + 1) * 3) < 1e-8);
  }
});

test('timer de ataque reinicia corretamente a cada novo ciclo', () => {
  let timer = 0;
  for (let salvo = 1; salvo <= 4; salvo += 1) {
    const step = advanceBomberHover(timer, salvo * 3, 3);
    assert.deepEqual(step, {
      shots: 1,
      shotTimer: 0,
      retreat: salvo === 4,
    });
    timer = step.shotTimer;
  }
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
