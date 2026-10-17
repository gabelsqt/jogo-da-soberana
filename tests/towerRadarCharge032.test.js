import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOWER_RADAR_BLIND_FRACTION,
  towerBlindZoneY,
  towerSeesEnemy,
  towerChargeProgress,
  chooseSuitableTowerTarget,
  upgradedTowerWeapon,
} from '../src/gameplay/towers.js';

const enemy = (x,y,type=1,hp=1) => ({x,y,sprite:{x,y},type,hp});
const mockTower = role => ({
  role, x:280,y:483,
  definition: upgradedTowerWeapon('ru',role,role==='swarm'?5:7),
});

test('radar das torres não enxerga 10% superiores, inclusive borda', () => {
  assert.equal(TOWER_RADAR_BLIND_FRACTION, 0.10);
  assert.equal(towerBlindZoneY(540), 54);
  assert.equal(towerSeesEnemy(enemy(280,53.99),54),false);
  assert.equal(towerSeesEnemy(enemy(280,54),54),true);
  assert.equal(towerSeesEnemy(enemy(280,120),54),true);
  assert.equal(towerSeesEnemy({x:280,y:0},54),false);
  assert.equal(towerSeesEnemy({},54),false);
});

test('a carga chega ao máximo e não é consumida sem disparo', () => {
  assert.equal(towerChargeProgress(1000,1000,2000),0);
  assert.equal(towerChargeProgress(1000,2000,2000),0.5);
  assert.equal(towerChargeProgress(1000,3000,2000),1);
  assert.equal(towerChargeProgress(1000,9000,2000),1);
  assert.equal(towerChargeProgress(3000,2800,2000),0);
});

test('antienxame espera agrupamentos, mas reage a ameaça isolada próxima do solo', () => {
  const tower=mockTower('swarm');
  const hidden=enemy(280,20,5,30);
  const single=enemy(260,160,1,1);
  const a=enemy(250,190), b=enemy(285,195);
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,single],54),null);
  assert.ok([a,b].includes(chooseSuitableTowerTarget(tower,[hidden,single,a,b],54)));
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,enemy(260,440)],54)?.sprite.y,440);
});

test('destruidora prefere blindados e não desperdiça disparo em alvo frágil distante', () => {
  const tower=mockTower('destroyer');
  const hidden=enemy(270,30,5,99);
  const light=enemy(280,190,1,1);
  const bomber=enemy(300,170,3,4);
  const cruiser=enemy(300,240,5,14);
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,light],54),null);
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,light,bomber],54),bomber);
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,light,bomber,cruiser],54),cruiser);
  assert.equal(chooseSuitableTowerTarget(tower,[hidden,enemy(280,430)],54)?.sprite.y,430);
});

test('cada papel tem recarga independente, inclusive depois de evoluir', () => {
  for (const id of ['br','us','jp','ru','cn']) {
    for (const role of ['swarm','destroyer']) {
      const base=upgradedTowerWeapon(id,role,role==='swarm'?5:7);
      const evolved=upgradedTowerWeapon(id,role,role==='swarm'?6:8);
      assert.ok(base.interval>0);
      assert.ok(evolved.interval>0 && evolved.interval<base.interval);
      assert.equal(towerChargeProgress(0,base.interval,base.interval),1);
    }
  }
});
