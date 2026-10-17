import test from 'node:test';
import assert from 'node:assert/strict';
import { enemyStats, BASIC_INVADER_HP_BY_LEVEL } from '../src/gameplay/enemies.js';
import {
  V035_SWARM_SIZES, getV035WaveEvents, progressiveGroupCount,
} from '../src/gameplay/formation035.js';
import { getWaveEvents, scheduledEnemyCount } from '../src/gameplay/waves.js';
import { labEnemyEvent } from '../src/gameplay/labConfig.js';

test('Tipo 1 continua fraco individualmente mesmo no nível 10', () => {
  assert.deepEqual(BASIC_INVADER_HP_BY_LEVEL,
    [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
  for (let level = 1; level <= 10; level++) {
    const stats = enemyStats(1, level);
    assert.equal(stats.hp, BASIC_INVADER_HP_BY_LEVEL[level - 1]);
    assert.ok(stats.hp <= 4);
    if (level > 1) assert.ok(stats.hp >= enemyStats(1, level - 1).hp);
  }
  assert.equal(enemyStats(1, 10).hp, 4);
  assert.equal(enemyStats(1, 10).width, enemyStats(1, 1).width);
  assert.equal(enemyStats(1, 10).speed, enemyStats(1, 3).speed);
});

test('a redução não altera HP dos inimigos Tipos 2–5', () => {
  assert.deepEqual([2,3,4,5].map(type => enemyStats(type,10).hp),
    [11, 24, 13, 64]);
  assert.equal(enemyStats(2,1).hp,2);
  assert.equal(enemyStats(3,1).hp,6);
  assert.equal(enemyStats(4,1).hp,4);
  assert.equal(enemyStats(5,1).hp,24);
});

test('enxames de campanha chegam no máximo a 18 e mantêm aumento de pressão', () => {
  assert.deepEqual(V035_SWARM_SIZES[9], [15,18]);
  for(let wave=0;wave<=9;wave++) {
    const swarms=getV035WaveEvents('wave'+wave,getWaveEvents('wave'+wave))
      .filter(e=>e.type===1);
    assert.ok(swarms.length>=2);
    assert.ok(swarms.every(e=>e.pattern==='swarm' && e.count <=18));
    assert.ok(swarms.at(-1).count >= swarms[0].count);
    assert.ok(scheduledEnemyCount(swarms) >= swarms.length*3);
  }
  assert.equal(progressiveGroupCount(9,1,1),18);
});

test('Arena Livre nível 10 tem 18 naves Tipo 1 com 4 HP cada', () => {
  const event = labEnemyEvent(1, 10);
  assert.deepEqual(event, {type:1,level:10,pattern:'swarm',count:18});
  assert.equal(scheduledEnemyCount([event]),18);
  assert.equal(enemyStats(event.type,event.level).hp,4);
  assert.equal(labEnemyEvent(1,1).count,3);
  assert.equal(labEnemyEvent(1,2).count,5);
});
