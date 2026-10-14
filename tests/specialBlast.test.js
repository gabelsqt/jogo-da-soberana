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
} from '../src/gameplay/specialBlast.js';

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
