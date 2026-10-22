import test from 'node:test';
import assert from 'node:assert/strict';
import { getWaveEvents, scheduledEnemyCount } from '../src/gameplay/waves.js';
import { getV035WaveEvents, WAVE0_PORTAL_SEQUENCE, WAVE1_PACING,
  WAVE2_PACING } from '../src/gameplay/formation035.js';
import { CAMPAIGN_SCHEDULED_TOTALS, getBalancedWaveEvents } from '../src/gameplay/campaignWavePacing.js';

const EXPECTED_BY_TYPE = Object.freeze({
  0: [20, 0, 0, 0, 0],
  1: [15, 8, 0, 0, 0],
  2: [15, 11, 0, 0, 0],
  3: [18, 9, 3, 3, 0],
  4: [21, 11, 4, 4, 0],
  5: [24, 14, 5, 4, 0],
  6: [26, 15, 6, 6, 0],
  7: [29, 20, 4, 6, 0],
  8: [32, 21, 4, 7, 1],
  9: [34, 24, 5, 7, 1],
});

function actualCounts(events) {
  const result = [0, 0, 0, 0, 0];
  for (const e of events) {
    if (e.type === 3 && e.pattern === 'escort') {
      result[1] += e.count;
      result[2] += 1;
    } else {
      const n = ['swarm', 'tactical', 'orbit', 'spread', 'line',
        'bomberFan'].includes(e.pattern) ? e.count
        : e.type === 4 && e.pattern === 'pincer' ? 2 : 1;
      result[e.type - 1] += n;
    }
  }
  return result;
}

test('população da campanha aumenta ESTRITAMENTE a cada onda de 0 a 9', () => {
  let previous = 0;
  for (let wave = 0; wave <= 9; wave++) {
    const events = getV035WaveEvents('wave' + wave, getWaveEvents('wave' + wave));
    const scheduled = scheduledEnemyCount(events);
    assert.equal(scheduled, CAMPAIGN_SCHEDULED_TOTALS[wave], 'onda '+wave);
    assert.deepEqual(actualCounts(events), EXPECTED_BY_TYPE[wave], 'tipos da onda '+wave);
    assert.ok(scheduled > previous, 'salto não crescente para a onda '+wave);
    assert.ok(events.every(e => e.at >= 0 && e.at <= 13500), 'spawn até 13,5s');
    assert.ok(events.every((e,i) => !i || e.at >= events[i-1].at), 'agenda ordenada');
    previous = scheduled;
  }
});

test('progressão começa leve e preserva os sistemas das primeiras ondas', () => {
  const wave0 = getV035WaveEvents('wave0', getWaveEvents('wave0'));
  const wave1 = getV035WaveEvents('wave1', getWaveEvents('wave1'));
  const wave2 = getV035WaveEvents('wave2', getWaveEvents('wave2'));
  assert.equal(WAVE0_PORTAL_SEQUENCE.length, 5);
  assert.deepEqual(wave0.map(e=>e.count), [4,4,4,4,4]);
  assert.deepEqual(wave1.filter(e=>e.type===1).map(e=>e.count),
    [...WAVE1_PACING.swarmCounts]);
  assert.deepEqual(wave1.filter(e=>e.type===2).map(e=>e.count),
    [...WAVE1_PACING.squadCounts]);
  assert.equal(scheduledEnemyCount(wave2), 26);
  assert.equal(WAVE2_PACING.orbitCount, 5);
  assert.ok(wave2.every(e=>e.type<=2));
});

test('ondinhas avançadas mantêm formações, ataque em pinça e chefes previstos', () => {
  for (let wave=3;wave<=9;wave++) {
    const events=getBalancedWaveEvents(wave);
    const swarms=events.filter(e=>e.pattern==='swarm');
    assert.equal(swarms.length,4);
    assert.ok(swarms.every(e=>e.count<=10));
    // Portais liberam integrantes a 320ms de distância, com 500ms de abertura.
    assert.ok(swarms.every(e=>e.at+(e.count-1)*320+500<15000));
    assert.ok(events.some(e=>e.type===4 && e.pattern==='pincer'),
      'pinça na onda '+wave);
    assert.ok(events.some(e=>e.type===3),'bombardeiro na onda '+wave);
    if (wave >= 4) assert.ok(events.every(e=>e.level===wave-1));
    assert.equal(events.filter(e=>e.type===5).length,wave>=8?1:0);
  }
  assert.equal(getBalancedWaveEvents(0),null);
  assert.equal(getBalancedWaveEvents(10),null);
});
