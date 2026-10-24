import test from 'node:test';
import assert from 'node:assert/strict';
import { FIFTH_UPGRADES, SIXTH_UPGRADES, SEVENTH_UPGRADES, EIGHTH_UPGRADES, activeTowerLoadout, nextUpgradeOptions } from '../src/gameplay/progression.js';
import { upgradedTowerWeapon } from '../src/gameplay/towers.js';
import { normalizeLabConfig, configuredTowerLoadout, changeLabLevel } from '../src/gameplay/labConfig.js';
import { upgradeRepresentativeLine } from '../src/gameplay/upgradeDialogue.js';

const countries = ['br','us','jp','ru','cn'];
test('cada país tem duas armas de apoio e dois níveis de evolução', () => {
  for (const id of countries) {
    for (const tree of [FIFTH_UPGRADES,SIXTH_UPGRADES,SEVENTH_UPGRADES,EIGHTH_UPGRADES]) assert.ok(tree[id].title);
    assert.equal(nextUpgradeOptions({choices:Array(4).fill(id)}).find(x=>x.id===id).level,5);
    assert.equal(nextUpgradeOptions({choices:Array(5).fill(id)}).find(x=>x.id===id).level,6);
    assert.equal(nextUpgradeOptions({choices:Array(6).fill(id)}).find(x=>x.id===id).level,7);
    assert.equal(nextUpgradeOptions({choices:Array(7).fill(id)}).find(x=>x.id===id).level,8);
    assert.equal(activeTowerLoadout({choices:Array(4).fill(id)}).length,0);
    assert.deepEqual(activeTowerLoadout({choices:Array(5).fill(id)}),[{id,role:'swarm',level:5}]);
    assert.deepEqual(activeTowerLoadout({choices:Array(7).fill(id)}),[
      {id,role:'swarm',level:7},{id,role:'destroyer',level:7},
    ]);
    assert.ok(upgradeRepresentativeLine(id,5).length > 10);
    assert.ok(upgradeRepresentativeLine(id,8).length > 10);
    const swarm=upgradedTowerWeapon(id,'swarm',5);
    const evolvedSwarm=upgradedTowerWeapon(id,'swarm',6);
    const destroyer=upgradedTowerWeapon(id,'destroyer',7);
    const evolvedDestroyer=upgradedTowerWeapon(id,'destroyer',8);
    assert.ok(swarm.damage < destroyer.damage, id);
    assert.ok(evolvedSwarm.damage > swarm.damage);
    assert.ok(evolvedDestroyer.damage > destroyer.damage);
  }
  assert.match(FIFTH_UPGRADES.ru.title,/Rajada Siberiana/);
  assert.match(SEVENTH_UPGRADES.ru.title,/Impacto Siberiano/);
  assert.match(SEVENTH_UPGRADES.jp.title,/Justiça Radiante/);
  assert.doesNotMatch(FIFTH_UPGRADES.ru.title+SEVENTH_UPGRADES.jp.title,/Lobo|Urso|Haechi/);
});
test('laboratório separa antienxame e destruidora e limita duas estruturas',()=>{
  let conf=normalizeLabConfig({levels:{ru:8}});
  assert.deepEqual(configuredTowerLoadout(conf).map(x=>x.role),['swarm','destroyer']);
  assert.equal(changeLabLevel(conf,'br',1).levels.br,1);
  for(let i=0;i<4;i++) conf=changeLabLevel(conf,'br',1);
  assert.equal(conf.levels.br,4);
  assert.equal(changeLabLevel(conf,'br',1).levels.br,4);
});
