import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mechAimAligned } from '../src/gameplay/mechSpriteMounts.js';
import {
  advanceGuidedTowerShot,
  chooseTowerHomingTarget,
  towerSeesEnemy,
} from '../src/gameplay/towers.js';

const enemy = (uid, x, y, type = 1, hp = 1) =>
  ({ uid, type, hp, sprite: { x, y } });

test('orientação corrige a trajetória a cada quadro quando o inimigo muda de lugar', () => {
  let p = { x: 100, y: 450 };
  let step = advanceGuidedTowerShot(p.x, p.y, 200, 150, 300, 0.1);
  assert.ok(step.x > p.x && step.y < p.y);
  p = { x: step.x, y: step.y };
  step = advanceGuidedTowerShot(p.x, p.y, 15, 130, 300, 0.1);
  assert.ok(step.x < p.x && step.y < p.y, 'a bala deve virar com o novo alvo');
  assert.ok(Math.hypot(step.vx, step.vy) - 300 < 1e-8);
});

test('a bala nunca ultrapassa o alvo ou inventa trajetória', () => {
  assert.deepEqual(advanceGuidedTowerShot(0, 0, 10, 0, 300, 0.5),
    { x: 10, y: 0, vx: 300, vy: 0 });
  assert.deepEqual(advanceGuidedTowerShot(10, 4, 10, 4, 300, 0.1),
    { x: 10, y: 4, vx: 0, vy: 0 });
  assert.equal(advanceGuidedTowerShot(0, 0, 100, 100, 300, 0).x, 0);
});

test('busca substituto mais próximo sem olhar a faixa cega nem fora da tela', () => {
  const enemies = [
    enemy(1, 100, 40, 5, 30),      // faixa cega
    enemy(2, -20, 200, 5, 30),     // fora da tela pela esquerda
    enemy(3, 400, 580, 5, 30),     // fora da tela por baixo
    enemy(4, 125, 180),
    enemy(5, 310, 180),
  ];
  assert.equal(chooseTowerHomingTarget(110, 150, enemies, 54, 960, 'swarm', 540)?.uid, 4);
  assert.equal(towerSeesEnemy(enemies[0], 54, 960, 540), false);
  assert.equal(towerSeesEnemy(enemies[1], 54, 960, 540), false);
  assert.equal(towerSeesEnemy(enemies[2], 54, 960, 540), false);
  assert.equal(chooseTowerHomingTarget(110, 150, enemies.slice(0, 3), 54, 960, 'swarm', 540), null);
});

test('a Destruidora mantém preferência pelos resistentes ao transferir mira', () => {
  const enemies = [enemy(1, 110, 170), enemy(2, 220, 180, 5, 20),
    enemy(3, 145, 190, 3, 6)];
  assert.equal(chooseTowerHomingTarget(100, 150, enemies, 54, 960, 'destroyer', 540)?.uid, 3);
  assert.equal(chooseTowerHomingTarget(100, 150, enemies.slice(0, 1), 54, 960, 'destroyer', 540)?.uid, 1);
});

test('GameScene aplica rastreamento ao Urso e a todas as balas auxiliares', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  const tower = scene.slice(scene.indexOf('  fireShockArtillery('),
    scene.indexOf('  createTurret() {'));
  assert.match(tower, /kind: 'shock-shell'[\s\S]*?targetId: enemy\.uid/);
  assert.match(tower, /const guided = true;/);
  assert.match(tower, /advanceGuidedTowerShot\(oldX, oldY,/);
  assert.match(tower, /advanceGuidedTowerShot\(\s*oldX, oldY,/);
  assert.match(tower, /this\.acquireGuidedTowerTarget\(shot\)/);
  assert.doesNotMatch(tower, /predictShockImpact|aimX, aimY|shot\.sprite\.x \+= shot\.vx/);
});

test('a arma visual só libera disparo ao alinhar e respeita ângulos equivalentes', () => {
  assert.equal(mechAimAligned(-1.1, -1.1), true);
  assert.equal(mechAimAligned(-1.1, -0.9), false);
  assert.equal(mechAimAligned(-Math.PI, Math.PI), true);
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(scene, /if \(!firingTarget \|\| !aimed \|\| towerChargeProgress\(/);
});
