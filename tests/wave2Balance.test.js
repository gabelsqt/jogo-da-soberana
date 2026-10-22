import test from 'node:test';
import assert from 'node:assert/strict';
import { getWaveEvents, MODES, scheduledEnemyCount } from '../src/gameplay/waves.js';

test('Onda 2 usa somente Tipos 1, 2 e 3; Tipo 4 estreia na Onda 3', () => {
  const wave2 = getWaveEvents('wave2');
  const wave3 = getWaveEvents('wave3');
  assert.ok(wave2.every(({ type }) => [1, 2, 3].includes(type)));
  assert.ok(wave2.some(({ type }) => type === 3));
  assert.ok(wave2.some(({ type, group }) => type === 2 && group));
  assert.ok(wave3.some(({ type }) => type === 4));
  assert.equal(MODES.wave2.minDuration, 46000);
  assert.ok(wave2.every(({ at }) => at < MODES.wave2.minDuration));
  assert.ok(wave2.every((event, index) => index === 0 || event.at >= wave2[index - 1].at));
  assert.equal(scheduledEnemyCount(wave2), 94);
});
