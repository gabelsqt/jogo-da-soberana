import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  hitProfileFor, hitReactionAt, deathProfileFor, deathBurstScale,
  MAX_SIMULTANEOUS_DEATH_EFFECTS,
} from '../src/gameplay/enemyFeedback.js';
import { enemyStats } from '../src/gameplay/enemies.js';

const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');

function method(name, next) {
  const from = scene.indexOf('  ' + name);
  const until = scene.indexOf('  ' + next, from + name.length);
  assert.ok(from >= 0 && until > from, name + ' must be before ' + next);
  return scene.slice(from, until);
}

test('perfis de hit branco e sacudida crescem com a dificuldade', () => {
  const expected = [2, 3, 4, 5, 6];
  for (let type = 1; type <= 5; type++) {
    const config = hitProfileFor(type);
    assert.equal(config.shake, expected[type - 1]);
    assert.ok(config.flashMs >= 60 && config.flashMs <= 100);
    assert.ok(config.shakeMs >= config.flashMs);
    const start = hitReactionAt(type, 0);
    assert.ok(start.flash, 'first frame flashes white');
    assert.ok(Math.abs(start.dx) <= config.shake);
    assert.ok(start.scale > 1);
    assert.equal(hitReactionAt(type, config.flashMs - 1).flash, true);
    assert.equal(hitReactionAt(type, config.flashMs).flash, false);
    const settled = hitReactionAt(type, config.shakeMs);
    assert.deepEqual(settled, { dx: 0, rotation: 0, scale: 1, flash: false });
    assert.deepEqual(hitReactionAt(type, 100000), settled);
  }
  assert.ok(hitProfileFor(6).flashMs > hitProfileFor(5).flashMs);
  assert.throws(() => hitProfileFor(99));
});

test('explosões escalam conforme ameaça, tipo 4 recebe recompensa maior', () => {
  const radii = [23, 31, 45, 62, 103, 155];
  const fragments = [5, 7, 10, 16, 23, 30];
  for (let i = 1; i <= 6; i++) {
    const profile = deathProfileFor(i);
    assert.equal(profile.radius, radii[i - 1]);
    assert.equal(profile.fragments, fragments[i - 1]);
    assert.deepEqual(deathBurstScale(i), {
      radius: profile.radius, fragments: profile.fragments,
      duration: profile.duration, stages: profile.stages,
    });
    if (i > 1) {
      assert.ok(profile.duration > deathProfileFor(i - 1).duration);
      assert.ok(profile.radius > deathProfileFor(i - 1).radius);
    }
  }
  assert.equal(deathProfileFor(3).stages, 1);
  assert.equal(deathProfileFor(4).stages, 2);
  assert.equal(deathProfileFor(5).stages, 2);
  assert.equal(deathProfileFor(6).stages, 3);
  assert.equal(MAX_SIMULTANEOUS_DEATH_EFFECTS, 24);
  assert.throws(() => deathProfileFor(99));
});

test('flash é feito com branco puro, restauração em tempo de jogo', () => {
  const hit = method('impactInvader(', 'activeUpgradeIds() {');
  assert.match(hit, /enemy\.hp -= damage/);
  assert.match(hit, /if \\(killed\\) \\{[\\s\\S]*?this\\.showEnemyDeath\\(enemy\\);\\s*this\\.removeEnemy\\(index\\)/);\n  assert.match(hit, /if\\(enemy\\.russianFrostPrimary\\)this\\.spreadRussianCold\\(enemy,1\\.35\\)/);
  assert.match(hit, /enemy\.lastHitAt = this\.time\.now/);
  assert.match(hit, /enemy\.box\.setFillStyle\(0xffffff\)/);
  assert.match(hit, /enemy\.sprite\.setTintFill\(0xffffff\)/);
  const update = method('updateEnemyHitVisual(enemy) {', 'showEnemyDeath(enemy) {');
  assert.match(update, /hitReactionAt\(enemy\.type, age\)/);
  assert.match(update, /setTintFill\(0xffffff\)/);
  assert.match(update, /enemy\.box\.setFillStyle\(reaction\.flash \? 0xffffff : enemy\.definition\.color\)/);
  assert.match(update, /enemy\.sprite\.clearTint\(\)/);
  assert.match(update, /enemy\.sprite\.setScale\(enemy\.baseScaleX \* reaction\.scale/);
  assert.doesNotMatch(hit, /delayedCall\(100/);
});

test('shake visual é retirado antes do cálculo de rota e não altera física', () => {
  assert.match(scene, /baseScaleX: visual\.sprite\.scaleX/);
  assert.match(scene, /baseScaleY: visual\.sprite\.scaleY/);
  assert.match(scene, /lastHitAt: -Infinity/);
  assert.match(scene, /hitVisualOffsetX: 0/);
  const begin = scene.indexOf('enemy.sprite.x -= previousShock.x + enemy.hitVisualOffsetX');
  const compute = scene.indexOf('const previousX = enemy.sprite.x;', begin);
  const advance = scene.indexOf('enemy.shockOffset = advanceShockOffset(previousShock, dt);', compute);
  const apply = scene.indexOf('this.updateEnemyHitVisual(enemy);', advance);
  assert.ok(begin >= 0 && compute > begin && advance > compute && apply > advance);
  for (let type = 1; type <= 5; type++) {
    const stats = enemyStats(type, 1);
    assert.ok(stats.hp >= 1);
    assert.ok(stats.speed >= 1);
  }
});

test('explosões só ocorrem na destruição por dano, não em despawn', () => {
  const remove = method('removeEnemy(index) {', 'drawEnemyHealthBars() {');
  assert.doesNotMatch(remove, /showEnemyDeath/);
  const impact = method('impactInvader(', 'activeUpgradeIds() {');
  assert.equal((impact.match(/showEnemyDeath\(enemy\)/g) ?? []).length, 1);
  assert.equal((impact.match(/removeEnemy\(index\)/g) ?? []).length, 1);
  const death = method('showEnemyDeath(enemy) {', 'impactInvader(');
  assert.match(death, /const profile = deathProfileFor\(enemy\.type\)/);
  assert.match(death, /this\.deathEffects\.length >= MAX_SIMULTANEOUS_DEATH_EFFECTS/);
  assert.match(death, /this\.deathEffects\.shift\(\)/);
  assert.match(death, /profile\.stages >= 2/);
  assert.match(death, /profile\.stages >= 3/);
  assert.match(death, /enemy\.type >= 4 && this\.time\.now - this\.lastVictoryShake >= 220/);
  assert.match(death, /this\.tweens\.add\(\{/);
  assert.match(death, /graphic\.destroy\(\)/);
  const clean = method('clearTestEnemies() {', 'preload() {');
  assert.match(clean, /this\.deathEffects\.length = 0/);
});
