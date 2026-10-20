import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ZECA_OPERATION_COUNTRIES,canOfferZecaRecovery,zecaRevengeLoadout,zecaOperationCopy,
} from '../src/gameplay/zecaRecovery.js';
import { v1CombatStats, v1SupremeFor, v1CountryLevels } from '../src/gameplay/v1Upgrades.js';
import { v1SpecialConfig } from '../src/gameplay/v1Specials.js';

test('somente a primeira derrota contra país traidor oferece Zeca',()=>{
 const campaign={choices:['br','br','jp','jp','us','ru','cn','jp','br','jp']};
 for(const id of ZECA_OPERATION_COUNTRIES)
   assert.equal(canOfferZecaRecovery(campaign,id,false),true,id);
 assert.equal(canOfferZecaRecovery(campaign,'jp',true),false);
 assert.equal(canOfferZecaRecovery(campaign,'br',false),false);
 assert.equal(canOfferZecaRecovery({choices:Array(10).fill('br')},'jp',false),false);
 assert.equal(canOfferZecaRecovery(null,'us',false),false);
});
test('revanche restaura todas as escolhas, sem tirar melhorias dos demais países',()=>{
 const state={choices:['br','jp','us','jp','ru','jp','cn','br','jp','jp']};
 const restored=zecaRevengeLoadout(state,'jp');
 assert.deepEqual(restored.choices,state.choices);
 assert.notEqual(restored.choices,state.choices);
 assert.equal(restored.disabledSupremeCountry,'jp');
 assert.equal(v1CountryLevels(restored).jp,5);
 assert.equal(v1CountryLevels(restored).us,1);
 assert.equal(v1CombatStats(restored).plasmaEvery,2);
 assert.equal(v1SpecialConfig(restored).krReflections,6);
});
test('Supremo confiscado não volta, mas transformação nível 10 volta intacta',()=>{
 for(const country of ZECA_OPERATION_COUNTRIES){
  const state={choices:Array(10).fill(country)};
  const recovered=zecaRevengeLoadout(state,country);
  assert.equal(v1SupremeFor(state),country);
  assert.equal(v1SupremeFor(recovered),null,country);
  assert.equal(v1CombatStats(recovered).ultimate,null,country);
  assert.equal(v1CombatStats(recovered).transformed,country,country);
  assert.equal(v1CountryLevels(recovered)[country],10);
 }
});
test('Supremo de outro país permanece quando não é o confiscado',()=>{
 const state={choices:[...Array(9).fill('br'),'us']};
 const recovered=zecaRevengeLoadout(state,'us');
 assert.equal(v1SupremeFor(recovered),'br');
});
test('texto da operação é brasileiro, tem fala e despedida para os quatro países',()=>{
 for(const id of ZECA_OPERATION_COUNTRIES){
  const text=zecaOperationCopy(id);
  assert.ok(text.title.length>8);
  assert.ok(text.line.length>20);
  assert.ok(text.farewell.length>15);
 }
});
test('a onda 11 oferece somente a operação de Zeca, sem progressão antiga',()=>{
 const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 const start=source.indexOf('  showFinaleDefeat(');
 const end=source.indexOf('\n  showDefeat(',start);
 const screen=source.slice(start,end);
 assert.ok(screen.includes('canOfferZecaRecovery('));
 assert.ok(screen.includes('showZecaProposal()'));
 assert.ok(screen.includes('this.zecaRevenge'));
 assert.ok(!screen.includes('continueResistanceAfterDefeat'));
 assert.ok(!screen.includes('brazilResistanceLevels'));
 assert.ok(source.includes('!this.zecaRevenge && !this.v1Playtest'));
 assert.ok(source.includes('zecaRevengeLoadout(this.campaign,this.selectedBetrayer)'));
});
