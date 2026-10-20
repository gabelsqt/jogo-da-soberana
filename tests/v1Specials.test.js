import test from 'node:test';
import assert from 'node:assert/strict';
import {
  specialStage,v1SpecialLoadout,v1SpecialConfig,specialPalette,
} from '../src/gameplay/v1Specials.js';

const countryAt=(id,level)=>({choices:Array(level).fill(id)});

test('especiais só são desbloqueados no nível 2 e progridem no 4/6/8',()=>{
  assert.deepEqual([0,1,2,3,4,5,6,7,8,9,10].map(specialStage),
    [0,0,1,1,2,2,3,3,4,4,4]);
  assert.equal(v1SpecialLoadout(countryAt('br',1)).primary,null);
});

test('primeiro especial desbloqueado fixa a identidade, não primeiro país escolhido',()=>{
  const state={choices:['br','us','us','br','br','br','ru','ru','cn','cn']};
  const b=v1SpecialLoadout(state);
  assert.equal(b.primary,'us');
  assert.deepEqual(b.stages,{br:2,us:1,ru:1,cn:1,jp:0});
  assert.deepEqual(new Set(b.active),new Set(['br','us','ru','cn']));
});

test('cada país fortalece somente o próprio efeito dentro do especial híbrido',()=>{
  const first=v1SpecialConfig({choices:['br','br','us','us']});
  const evolved=v1SpecialConfig({choices:['br','br','us','us','br','br']});
  assert.equal(first.primary,'br');
  assert.equal(evolved.primary,'br');
  assert.equal(first.fireworks,4);
  assert.equal(evolved.fireworks,8);
  assert.equal(first.usMissileScale,evolved.usMissileScale);
  assert.equal(first.usDamage,evolved.usDamage);
});

test('fogos brasileiros e turbo têm progressões aprovadas',()=>{
  for(const [tier,fireworks,turbo] of [[2,4,1.5],[4,8,2],[6,16,2.5],[8,32,3]]){
    const b=v1SpecialConfig(countryAt('br',tier));
    assert.equal(b.fireworks,fireworks);
    assert.equal(b.brazilTurbo,turbo);
  }
});

test('míssil dos EUA escala 1/2/4/8, e ondas superam o raio da explosão',()=>{
  for(const [tier,scale] of [[2,1],[4,2],[6,4],[8,8]]){
    const b=v1SpecialConfig(countryAt('us',tier));
    assert.equal(b.usMissileScale,scale);
    assert.ok(b.usShockRadius>b.usBlastRadius);
    assert.ok(b.usPush>0);
  }
});

test('Sputnik russo progride em duração, raio, cristalização e pulsos',()=>{
  for(const [tier,duration,radius] of [[2,4000,43],[4,5000,59],[6,5000,59],[8,5000,67]]){
    const b=v1SpecialConfig(countryAt('ru',tier));
    assert.equal(b.ruSputnikDurationMs,duration);
    assert.equal(b.ruSputnikRadius,radius);
    assert.ok(b.ruFreezeMs>0);
    assert.ok(b.ruCrystalBonus>1);
    assert.equal(b.ruShieldFreezeMs,undefined);
    assert.equal(b.ruShards,undefined);
  }
  const s2=v1SpecialConfig(countryAt('ru',2));
  const s6=v1SpecialConfig(countryAt('ru',6));
  const s8=v1SpecialConfig(countryAt('ru',8));
  assert.ok(s6.ruCrystalShatterRadius>s2.ruCrystalShatterRadius);
  assert.ok(s6.ruCrystalShatterDamage>s2.ruCrystalShatterDamage);
  assert.equal(s2.ruSputnikPulseRadius,0);
  assert.ok(s8.ruSputnikPulseRadius>0);
  assert.ok(s8.ruSputnikFinalRadius>s8.ruSputnikPulseRadius);
});

test('encomendas e reflexos ofensivos evoluem sem bônus de escudo',()=>{
  for(const [tier,payloads,rays] of [[2,1,3],[4,2,6],[6,3,12],[8,4,24]]){
    assert.equal(v1SpecialConfig(countryAt('cn',tier)).cnPayloads,payloads);
    const kr=v1SpecialConfig(countryAt('jp',tier));
    assert.equal(kr.krReflections,rays);
    assert.equal(kr.krShieldChance,undefined);
  }
});

test('os cinco países oferecem uma cor própria, mas nenhum efeito não desbloqueado',()=>{
  const b=v1SpecialConfig({});
  assert.equal(b.primary,null);
  assert.equal(b.active.length,0);
  assert.equal(b.fireworks,0);
  assert.equal(b.krReflections,0);
  assert.equal(b.cnPayloads,0);
  assert.equal(b.ruSputnikDurationMs,0);
  for(const id of ['br','us','ru','cn','jp'])assert.ok(specialPalette(id)>0);
});
