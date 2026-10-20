import test from 'node:test';
import assert from 'node:assert/strict';
import { v1CombatStats, v1CountryLevels, mayDuplicateProjectile } from '../src/gameplay/v1Upgrades.js';

const countryAt = (id, level) => ({ choices: Array(level).fill(id) });

test('cada transformação desbloqueia exatamente no nível 10', () => {
  for (const id of ['br','us','ru','cn','jp']) {
    assert.equal(v1CombatStats(countryAt(id,9)).transformed,null);
    assert.equal(v1CombatStats(countryAt(id,10)).transformed,id);
    assert.equal(v1CountryLevels(countryAt(id,10))[id],10);
  }
});
test('Brasil: nível 10 é metralhadora física com pico de calor e varredura lateral', () => {
  const s=v1CombatStats(countryAt('br',10));
  assert.ok(s.basicInterval<=55);
  assert.equal(s.brazilHeatPeak,2.4);
  assert.equal(s.horizontalSpread,16);
  assert.equal(s.koreaContinuous,false);
});
test('EUA: Quatro de Julho sem perseguição e sem tiros gigantes', () => {
  const expected=[[1,0,0],[2,0,0],[3,5,78],[5,5,92],[7,5,104],[10,3,118]];
  for(const [level,hits,radius] of expected){
    const s=v1CombatStats(countryAt('us',level));
    assert.equal(s.usGrowthMax,1);
    assert.equal(s.usHoming,0);
    assert.equal(s.usJulyHitsRequired,hits);
    assert.equal(s.usJulyBlastRadius,radius);
    assert.equal(s.usJulyShards,level>=7);
  }
  assert.ok(v1CombatStats(countryAt('us',10)).basicInterval<
    v1CombatStats(countryAt('us',7)).basicInterval);
});
test('Rússia: congelamento e estilhaços evoluem sem atração antiga', () => {
  const start=v1CombatStats(countryAt('ru',1));
  const end=v1CombatStats(countryAt('ru',10));
  assert.ok(start.russianFreezeMs>0);
  assert.equal(start.russianAttractRadius,undefined);
  assert.equal(end.russianFreezeMs,3000);
  assert.ok(end.russianShatterRadius>start.russianShatterRadius);
  assert.ok(end.russianShatterDamage>=start.russianShatterDamage);
});
test('China: 10 projéteis por salva, divisão 1→2, sem repetição infinita', () => {
  const s=v1CombatStats(countryAt('cn',10));
  assert.equal(s.bulletsPerShot,10);
  assert.equal(s.chinaSplitCount,2);
  assert.equal(s.bulletsPerShot*s.chinaSplitCount,20);
  assert.equal(s.duplicateChance,0);
  assert.equal(mayDuplicateProjectile(0,1,0),true);
  assert.equal(mayDuplicateProjectile(1,1,0),false);
});
test('Coreia do Sul: o laser contínuo substitui o tiro padrão', () => {
  const s=v1CombatStats(countryAt('jp',10));
  assert.equal(s.koreaContinuous,true);
  assert.equal(s.plasmaEvery,1);
  assert.ok(s.laserDamage>3);
});
