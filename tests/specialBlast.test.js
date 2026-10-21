import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPECIAL_BLAST_DURATION,
  SPECIAL_BLAST_EXPAND_DURATION,
  SPECIAL_BLAST_SHRINK_DURATION,
  SPECIAL_BLAST_MAX_RADIUS,
  SPECIAL_BLAST_START_RADIUS,
  specialBlastRadius,
  blastCatchesTarget,
  specialTargetPoint,
  SPECIAL_MIN_DISTANCE,
  SPECIAL_MAX_DISTANCE,
} from '../src/gameplay/specialBlast.js';
import { MIN_CANNON_ELEVATION_DEGREES } from '../src/gameplay/combat.js';

test('explosão cresce, permanece ativa e se retrai por 3 segundos', () => {
  assert.equal(specialBlastRadius(0), SPECIAL_BLAST_START_RADIUS);
  assert.ok(specialBlastRadius(200) > SPECIAL_BLAST_START_RADIUS);
  assert.ok(specialBlastRadius(200) < SPECIAL_BLAST_MAX_RADIUS);
  assert.equal(specialBlastRadius(SPECIAL_BLAST_EXPAND_DURATION), SPECIAL_BLAST_MAX_RADIUS);
  assert.equal(specialBlastRadius(1300), SPECIAL_BLAST_MAX_RADIUS);
  assert.equal(
    specialBlastRadius(SPECIAL_BLAST_DURATION - SPECIAL_BLAST_SHRINK_DURATION),
    SPECIAL_BLAST_MAX_RADIUS,
  );
  assert.ok(specialBlastRadius(2800) < SPECIAL_BLAST_MAX_RADIUS);
  assert.ok(specialBlastRadius(2800) > 0);
  assert.equal(specialBlastRadius(3000), 0);
  assert.equal(specialBlastRadius(4500), 0);
});

test('OVNI que chega depois da explosão é atingido pelo campo', () => {
  assert.equal(blastCatchesTarget(400, 200, 1700, 500, 200, 18), true);
  assert.equal(blastCatchesTarget(400, 200, 1700, 550, 200, 18), false);
  assert.equal(blastCatchesTarget(400, 200, 500, 400, 300), true);
});

test('zona de defesa não causa danos antes ou depois da duração', () => {
  assert.equal(blastCatchesTarget(400, 200, -1, 400, 200), false);
  assert.equal(blastCatchesTarget(400, 200, SPECIAL_BLAST_DURATION, 400, 200), false);
  assert.equal(blastCatchesTarget(400, 200, 4000, 400, 200), false);
});

test('raio de colisão acompanha o círculo visual durante a expansão e retração', () => {
  const earlyRadius = specialBlastRadius(100);
  const lateRadius = specialBlastRadius(2900);
  assert.equal(blastCatchesTarget(0, 0, 100, earlyRadius - 1, 0), true);
  assert.equal(blastCatchesTarget(0, 0, 100, earlyRadius + 1, 0), false);
  assert.equal(blastCatchesTarget(0, 0, 2900, lateRadius - 1, 0), true);
  assert.equal(blastCatchesTarget(0, 0, 2900, lateRadius + 1, 0), false);
});

test('mira do especial coincide com a posição real de detonação do projétil', () => {
  const cannonX = 480, cannonY = 494;
  const target = specialTargetPoint(cannonX, cannonY, 480, 270);
  assert.ok(Math.abs(target.x - 480) < 1e-8);
  assert.ok(Math.abs(target.y - 270) < 1e-8);
  assert.ok(Math.abs(target.angle + Math.PI / 2) < 1e-8);
  assert.equal(target.distance, 224);
  assert.ok(Math.abs(cannonX + Math.cos(target.angle) * target.distance
    - target.x) < 1e-8);
  assert.ok(Math.abs(cannonY + Math.sin(target.angle) * target.distance
    - target.y) < 1e-8);
});

test('mira respeita a distância mínima e máxima usada pelo tiro especial', () => {
  assert.equal(SPECIAL_MIN_DISTANCE, 140);
  assert.equal(SPECIAL_MAX_DISTANCE, 580);

  const close = specialTargetPoint(480, 494, 480, 490);
  assert.equal(close.distance, SPECIAL_MIN_DISTANCE);
  assert.ok(Math.abs(close.y - 354) < 1e-8);

  const distant = specialTargetPoint(480, 494, 480, -10000);
  assert.equal(distant.distance, SPECIAL_MAX_DISTANCE);
  assert.equal(distant.y,24); // Limite superior visível, nunca fora da tela.
  assert.ok(distant.distance<SPECIAL_MAX_DISTANCE);
});

test('mira reflete a elevação mínima do canhão em vez de seguir o cursor impossível', () => {
  const origin = { x: 480, y: 494 };
  const right = specialTargetPoint(origin.x, origin.y, 950, 494);
  const left = specialTargetPoint(origin.x, origin.y, 0, 494);

  assert.ok(right.y < origin.y && left.y < origin.y);
  assert.ok(right.x > origin.x && left.x < origin.x);
  assert.equal(MIN_CANNON_ELEVATION_DEGREES,2);
  const minimumAngle=MIN_CANNON_ELEVATION_DEGREES*Math.PI/180;
  assert.ok(Math.abs(right.angle + minimumAngle) < 1e-8,
    'o tiro da direita respeita a elevação atual de dois graus');
  assert.ok(Math.abs(left.angle + Math.PI - minimumAngle) < 1e-8,
    'o tiro da esquerda respeita a mesma elevação mínima');
});
