import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLabConfig, changeLabWave, changeLabLevel, configuredTowerCountries } from '../src/gameplay/labConfig.js';

test('laboratório aceita qualquer onda 0–9 sem modificar campanha', () => {
  assert.equal(changeLabWave({wave:0},9).wave,9);
  assert.equal(changeLabWave({wave:9},1).wave,9);
  assert.equal(normalizeLabConfig({wave:-9}).wave,0);
});
test('níveis implementados 0–5 são independentes do número de escolhas', () => {
  let config=normalizeLabConfig({wave:7});
  for(const id of ['br','us','jp','ru','cn']){
    for(let i=0;i<2;i++)config=changeLabLevel(config,id,1);
  }
  assert.deepEqual(Object.values(config.levels),[2,2,2,2,2]);
  for(let i=0;i<3;i++){
    config=changeLabLevel(config,'br',1);
    config=changeLabLevel(config,'us',1);
  }
  assert.deepEqual(configuredTowerCountries(config),['br','us']);
  config=changeLabLevel(config,'jp',1);
  config=changeLabLevel(config,'jp',1);
  const blocked=changeLabLevel(config,'jp',1);
  assert.equal(blocked.levels.jp,4,'não cria terceira torre');
  assert.equal(changeLabLevel(config,'br',1).levels.br,5);
});
