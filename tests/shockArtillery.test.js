import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SHOCK_BLAST_RADIUS,
  SHOCK_INNER_RADIUS,
  SHOCK_SPLASH_DAMAGE,
  SHOCK_KNOCKBACK,
  predictShockImpact,
  segmentHitsCircle,
  shockBlastDamage,
  advanceShockOffset,
} from '../src/gameplay/shockArtillery.js';
import { towerDefinition } from '../src/gameplay/towers.js';

test('Urso dispara artilharia a cada 2s e cria explosão de 85px', () => {
  const bear = towerDefinition('ru');
  assert.equal(bear.type, 'shell');
  assert.equal(bear.interval, 2000);
  assert.equal(bear.blastRadius, SHOCK_BLAST_RADIUS);
  assert.equal(SHOCK_BLAST_RADIUS, 85);
  assert.ok(bear.speed > 320, 'projétil deve ser mais veloz que a versão anterior');
  assert.ok(SHOCK_KNOCKBACK > 0);
});

test('mira preditiva calcula corretamente alvo parado e movimento lateral', () => {
  const still = predictShockImpact(0, 0, 400, 0, 0, 0, 400);
  assert.equal(still.x, 400);
  assert.equal(still.y, 0);
  assert.ok(Math.abs(still.time - 1) < 1e-10);

  const moving = predictShockImpact(0, 0, 400, 0, 0, 100, 400);
  assert.ok(moving.y > 90, 'precisa mirar à frente da nave');
  assert.ok(moving.time > 1, 'alvo lateral demora mais a alcançar');
  assert.ok(Math.abs(Math.hypot(moving.x, moving.y) - moving.time * 400) < 1e-7);
  const escaping = predictShockImpact(0, 0, 350, 0, 100, 0, 400);
  assert.ok(escaping.x > 350);
});

test('mira fica limitada e evita infinitos quando não existe interceptação', () => {
  const unreachable = predictShockImpact(0, 0, 400, 0, 1000, 0, 200);
  assert.ok(Number.isFinite(unreachable.x));
  assert.ok(Number.isFinite(unreachable.y));
  assert.ok(unreachable.time <= 1.45);
  const close = predictShockImpact(0, 0, 0, 0, 0, 0, 400);
  assert.deepEqual(close, { x: 0, y: 0, time: 0 });
});

test('colisão por segmento detecta interceptações entre frames', () => {
  assert.equal(segmentHitsCircle(0, 0, 100, 0, 50, 0, 5), true);
  assert.equal(segmentHitsCircle(0, 0, 100, 0, 55, 6, 7), true);
  assert.equal(segmentHitsCircle(0, 0, 100, 0, 50, 18, 7), false);
  assert.equal(segmentHitsCircle(0, 0, 100, 0, -20, 0, 10), false);
  assert.equal(segmentHitsCircle(0, 0, 0, 0, 0, 0, 1), true);
});

test('choque causa dano forte no centro e dano reduzido na borda', () => {
  assert.ok(SHOCK_INNER_RADIUS < SHOCK_BLAST_RADIUS);
  assert.equal(shockBlastDamage(0, 0, 3.7), 3.7);
  assert.equal(shockBlastDamage(35, 0, 3.7), 3.7);
  assert.equal(shockBlastDamage(70, 0, 3.7), SHOCK_SPLASH_DAMAGE);
  assert.equal(shockBlastDamage(85, 0, 3.7), SHOCK_SPLASH_DAMAGE);
  assert.equal(shockBlastDamage(86, 0, 3.7), 0);
  assert.equal(shockBlastDamage(90, 12, 3.7), SHOCK_SPLASH_DAMAGE);
  assert.equal(shockBlastDamage(112, 10, 3.7), 0);
});

test('recuo visual começa sem teleporte, movimenta lentamente e se dissipa', () => {
  let offset = { x: 0, y: 0, vx: 210, vy: -120 };
  const samples = [offset];
  for (let i = 0; i < 90; i += 1) {
    offset = advanceShockOffset(offset, 1 / 60);
    samples.push(offset);
  }
  assert.ok(samples[1].x > 0 && samples[1].x < 4);
  assert.ok(samples[1].y < 0 && samples[1].y > -3);
  assert.ok(samples[20].x > 0);
  assert.ok(Math.abs(samples.at(-1).x) < 2);
  assert.ok(Math.abs(samples.at(-1).vx) < 0.1);
  for (let i = 1; i < samples.length; i += 1) {
    assert.ok(Math.abs(samples[i].x - samples[i - 1].x) < 5);
  }
});
