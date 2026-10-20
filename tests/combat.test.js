import test from 'node:test';
import assert from 'node:assert/strict';
import {
  restrictedAimAngle,
  availableDefenseTargets,
  positionOnRoute,
  routeLength,
  applyShieldedHit,
} from '../src/gameplay/combat.js';

const rad = (deg) => deg * Math.PI / 180;

test('mira só permite a metade superior, com 2 graus de margem', () => {
  assert.ok(Math.abs(restrictedAimAngle(480, 494, 480, 0) - rad(-90)) < 1e-9);
  assert.ok(Math.abs(restrictedAimAngle(480, 494, 960, 494) - rad(-2)) < 1e-9);
  assert.ok(Math.abs(restrictedAimAngle(480, 494, 0, 494) - rad(-178)) < 1e-9);
  const angles = [
    [800, 520], [0, 600], [960, 0], [480, 1000], [0, 0], [480, 100],
  ].map(([x, y]) => restrictedAimAngle(480, 494, x, y));
  for (const angle of angles) {
    assert.ok(angle >= rad(-178) && angle <= rad(-2), `fora do arco: ${angle}`);
  }
});

test('sem animais, só o canhão é um alvo válido', () => {
  assert.deepEqual(availableDefenseTargets({ x: 480, y: 494 }, []), [
    { kind: 'cannon', id: 'cannon', x: 480, y: 442 },
  ]);
});

test('animais vivos podem ser alvos; destruídos são ignorados', () => {
  const targets = availableDefenseTargets({ x: 480, y: 494 }, [
    { id: 'caramelo', x: 160, y: 500, health: 40, shieldRadius: 45 },
    { id: 'capivara', x: 790, y: 500, health: 0 },
  ]);
  assert.equal(targets.length, 2);
  assert.equal(targets[1].id, 'caramelo');
  assert.equal(targets[1].y, 455);
});

test('trajetória curva parte do alto e chega exatamente ao escudo', () => {
  const route = { x0: 190, y0: -40, x1: 650, y1: 135, x2: 480, y2: 442 };
  assert.deepEqual(positionOnRoute(route, 0), { x: 190, y: -40 });
  assert.deepEqual(positionOnRoute(route, 1), { x: 480, y: 442 });
  assert.ok(positionOnRoute(route, 0.5).x > 450);
  assert.ok(routeLength(route) > 500);
});

test('dez colisões sem defesa destroem canhão mesmo com regeneração', () => {
  let shield = 80;
  let health = 100;
  for (let i = 0; i < 10; i += 1) {
    ({ shield, health } = applyShieldedHit(shield, health, 46));
    // Um teto propositalmente generoso: 4s de regeneração entre cada impacto.
    shield = Math.min(80, shield + 4 * 3.5);
  }
  assert.equal(health, 0);
});

test('escudo absorve dano primeiro, só o excedente atinge canhão', () => {
  assert.deepEqual(applyShieldedHit(80, 100, 46), { shield: 34, health: 100 });
  assert.deepEqual(applyShieldedHit(34, 100, 46), { shield: 0, health: 88 });
});
