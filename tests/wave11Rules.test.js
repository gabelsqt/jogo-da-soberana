import test from 'node:test';
import assert from 'node:assert/strict';
import {
  betrayalCoalition, hostileBosses, coalitionHpFactor,
  survivingCountryLevels, installedSupportTowers,
  nextBrazilianResistanceUpgrade, continueResistanceAfterDefeat,
} from '../src/gameplay/wave11Rules.js';

test('Brasil puro não gera traição', () => {
  assert.deepEqual(betrayalCoalition(Array(10).fill('br')), []);
  assert.deepEqual(hostileBosses(Array(10).fill('br')), []);
});
test('todos os estrangeiros empatados na liderança traem', () => {
  assert.deepEqual(betrayalCoalition(['br', 'us','jp','ru','us','jp','ru','br','br','br']), ['us','jp','ru']);
  assert.deepEqual(betrayalCoalition(['us','jp','ru','cn','us','jp','ru','cn','br','br']), ['us','jp','ru','cn']);
  assert.deepEqual(betrayalCoalition(['us','us','us','us','jp','jp','cn','cn','br','br']), ['us']);
});
test('cada chefe recebe somente os níveis desbloqueados', () => {
  assert.deepEqual(hostileBosses(['br','us','jp','us','jp','br']), [
    {country:'us',level:2}, {country:'jp',level:2},
  ]);
  assert.equal(coalitionHpFactor(1), 1);
  assert.equal(coalitionHpFactor(2), 0.65);
  assert.equal(coalitionHpFactor(3), 0.45);
  assert.equal(coalitionHpFactor(4), 0.35);
});
test('remove integralmente upgrades e torres de todos os traidores', () => {
  const choices=['us','jp','us','jp','us','jp','br','br','br','br'];
  const levels=survivingCountryLevels(choices);
  assert.equal(levels.us,0);
  assert.equal(levels.jp,0);
  assert.equal(levels.br,4);
  assert.deepEqual(installedSupportTowers(choices),[{country:'br',level:3}]);
});
test('resistência pula torre sem espaço e melhoria de Caramelo ausente', () => {
  // Países não traidores: CN e RU (3 escolhas cada); EUA com 4 escolhas trai,
  // mas é matematicamente impossível chegar aqui respeitando limite de 2 torres.
  // Simulamos estado excepcional para provar que nunca instala uma 3ª torre.
  const choices=['us','us','us','us','cn','cn','cn','ru','ru','ru'];
  assert.equal(nextBrazilianResistanceUpgrade(choices,[1,2]),4);
  assert.equal(nextBrazilianResistanceUpgrade(choices,[1,2,4]),6);
});
test('progressão permite pular nível 3 ocupado e seguir níveis sem dependência', () => {
  const choices=['us','us','us','us','cn','cn','cn','br','br','br'];
  assert.equal(nextBrazilianResistanceUpgrade(choices),4);
  const first=continueResistanceAfterDefeat(choices);
  assert.equal(first.outcome,'retry');
  assert.equal(first.awardedLevel,4);
  assert.equal(first.restartEntireBattle,true);
});
test('após receber upgrade brasileiro 10, próxima derrota encerra resistência', () => {
  const choices=Array(10).fill('us');
  let extras=[];
  let attempts=0;
  while(true) {
    const step=continueResistanceAfterDefeat(choices,extras);
    if(step.outcome==='colonized') break;
    extras=step.awardedLevels;
    attempts++;
    assert.ok(attempts<=10);
  }
  assert.equal(extras.at(-1),10);
  assert.equal(attempts,10);
  assert.equal(continueResistanceAfterDefeat(Array(10).fill('br')).outcome,'colonized');
});
