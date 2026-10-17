import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LAB_ENEMY_NAMES, LAB_MAX_ENEMY_LEVEL, labEnemyEvent,
  normalizeLabConfig, configuredTowerLoadout,
} from '../src/gameplay/labConfig.js';
import { scheduledEnemyCount } from '../src/gameplay/waves.js';

const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
const setup = readFileSync(new URL('../src/scenes/LabSetupScene.js', import.meta.url), 'utf8');

test('laboratório unificado oferece arena de inimigos sem desativar os upgrades', () => {
  assert.match(setup, /text: '◎ ARENA LIVRE'/);
  assert.match(setup, /mode: 'lab', labConfig: this\.config/);
  assert.match(setup, /text: '▶ TESTAR ONDA'/);
  assert.match(scene, /this\.unifiedLab \&\& this\.mode === 'lab'/);
  assert.match(scene, /this\.waveEvents = \[\]/);
  assert.match(scene, /if \(!\(this\.unifiedLab \&\& this\.mode === 'lab'\)\)/,
    'a arena não pode terminar após limpar as naves ou ao atingir 36 s');
  assert.match(scene, /this\.unifiedLab \? configuredTowerLoadout\(this\.labConfig\)/);
  const configured = normalizeLabConfig({levels:{br:7}});
  assert.equal(configuredTowerLoadout(configured).length, 2);
});

test('cinco botões invocam tipos 1–5, inclusive formação e níveis superiores', () => {
  assert.deepEqual([...LAB_ENEMY_NAMES],
    ['BÁSICO','FORMAÇÃO','BOMBARDEIRO','CAÇA','CRUZADOR']);
  assert.equal(LAB_MAX_ENEMY_LEVEL, 10);
  for(let type=1;type<=5;type++){
    for(let level of [1,2,4,10]){
      const event=labEnemyEvent(type,level);
      assert.equal(event.type,type);
      assert.equal(event.level,level);
      assert.equal(scheduledEnemyCount([event])>0,true);
    }
  }
  assert.deepEqual(labEnemyEvent(2,1),{type:2,level:1,group:true,count:3});
  assert.deepEqual(labEnemyEvent(2,2),{type:2,level:2,pattern:'orbit',count:10});
  assert.deepEqual(labEnemyEvent(1,2),{type:1,level:2,pattern:'line',count:10});
  assert.equal(labEnemyEvent(3,2)?.pattern,undefined);
  assert.equal(labEnemyEvent(0,2),null);
  assert.equal(labEnemyEvent(6,2),null);
  assert.equal(labEnemyEvent(3,99)?.level,10);
  assert.equal(labEnemyEvent(3,0)?.level,1);
});

test('painel mostra botões e seletor, com controle para limpar e voltar', () => {
  assert.match(scene,/createEnemyLabPanel\(\)/);
  assert.match(scene,/LAB_ENEMY_NAMES\.forEach/);
  assert.match(scene,/this\.spawnLabEnemy\(index \+ 1, this\.labEnemyLevel\)/);
  assert.match(scene,/this\.setLabEnemyLevel\(this\.labEnemyLevel - 1\)/);
  assert.match(scene,/this\.setLabEnemyLevel\(this\.labEnemyLevel \+ 1\)/);
  assert.match(scene,/this\.clearTestEnemies\(\)/);
  assert.match(scene,/this\.scene\.start\('LabSetupScene', \{ config: this\.labConfig \}\)/);
  assert.match(scene,/this\.enemyLabPanel\.setVisible\(this\.enemyLabPanelOpen\)/);
  assert.match(scene,/button\.disableInteractive\(\)/);
  assert.match(scene,/!this\.pointerOverEnemyLabControls\(pointer\)/);
  assert.match(scene,/this\.input\.keyboard\.on\('keydown-I'/);
  assert.match(scene,/this\.input\.keyboard\.on\('keydown-C'/);
  assert.match(scene,/this\.input\.keyboard\.on\('keydown-L'/);
});
