import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_UPGRADES} from '../src/gameplay/upgrades.js';
import {normalizeCampaignState,armamentPhase,armamentOffers,
  armamentAllocation,chooseArmamentUpgrade} from '../src/gameplay/progression.js';
import {computeLabMath} from '../src/gameplay/labMathRuntime.js';
import {singleCountryAtTen,labLevelCounts} from '../src/gameplay/labBalanceProfile.js';

function choose(state,id,track){const next=chooseArmamentUpgrade(state,id,track);assert.ok(next,
  'Escolha de '+id+' '+track+' deve ser aceita');return next;}
test('negociação 1 fixa principal e negociação 2 fixa especial imediatamente',()=>{
  let state={choices:[]};
  assert.equal(armamentPhase(state),'principal');
  state=choose(state,'br');assert.equal(state.armament.principal,'br');
  assert.equal(state.armament.especial,null);
  assert.equal(armamentPhase(state),'special');
  state=choose(state,'cn');
  assert.equal(state.armament.especial,'cn');
  assert.deepEqual(state.choices,['br','cn']);
  assert.equal(armamentPhase(state),'upgrades');
  assert.deepEqual(armamentAllocation(state).cn,{P:0,S:0});
});

test('cada país oferece exatamente P e S a partir da terceira escolha',()=>{
  let s=choose(choose({choices:[]},'br'),'cn');
  let opts=armamentOffers(s,FIRST_UPGRADES);
  assert.equal(opts.length,5);
  for(const o of opts){
    assert.deepEqual(Object.keys(o.proposals),['P','S']);
    assert.equal(o.proposals.P.stage,1);
    assert.equal(o.proposals.S.stage,1);
  }
  assert.equal(chooseArmamentUpgrade(s,'ru',null),null);
  s=choose(s,'ru','P');
  opts=armamentOffers(s,FIRST_UPGRADES);
  assert.equal(opts.find(o=>o.id==='ru').proposals.P.stage,2);
  assert.equal(opts.find(o=>o.id==='ru').proposals.S.stage,1);
  assert.equal(s.armament.upgrades[0].stage,1);
  assert.equal(s.choices.length,3);
});

test('limitadores P e S são globais, cada um até quatro efeitos',()=>{
  let s=choose(choose({choices:[]},'br'),'cn');
  for(const id of ['ru','br','cn','jp'])s=choose(s,id,'P');
  for(const opt of armamentOffers(s,FIRST_UPGRADES))
    assert.equal(opt.proposals.P.locked,true);
  assert.equal(chooseArmamentUpgrade(s,'us','P'),null);
  for(const id of ['ru','br','cn','jp'])s=choose(s,id,'S');
  assert.equal(s.choices.length,10);
  assert.equal(armamentOffers(s,FIRST_UPGRADES).every(o=>o.locked),true);
  assert.equal(chooseArmamentUpgrade(s,'cn','S'),null);
  assert.equal(singleCountryAtTen(labLevelCounts(
    armamentAllocation(s),'br','cn'),'br','cn'),null);
});

test('um único país, porém com ordem P/S livre, recebe Supremo só no 10',()=>{
  let s=choose(choose({choices:[]},'jp'),'jp');
  const order=['S','S','P','P','P','S','S','P'];
  for(let i=0;i<order.length;i++){
    s=choose(s,'jp',order[i]);
    const n=s.choices.length;
    const alloc=armamentAllocation(s);
    const stats=computeLabMath({allocation:alloc,principal:'jp',especial:'jp'});
    assert.equal(stats.winner,n===10?'jp':null);
    assert.equal(stats.stats.ultimate,n===10?'jp':null);
  }
  assert.equal(s.armament.upgrades.at(-1).stage,4);
  assert.equal(s.armament.upgrades.at(-1).track,'P');
  assert.deepEqual(armamentAllocation(s).jp,{P:4,S:4});
  assert.equal(s.choices.length,10);
});

test('normalização preserva o novo save e recusa estágios e escolhas forjados',()=>{
  const s=normalizeCampaignState({choices:Array(10).fill('br'),armament:{
    principal:'br',especial:'ru',
    upgrades:[{country:'cn',track:'P',stage:4},
      {country:'cn',track:'P',stage:7},
      {country:'br',track:'S',stage:42}]
  }});
  assert.deepEqual(s.choices,['br','ru','cn','cn','br']);
  assert.deepEqual(s.armament.upgrades.map(x=>x.stage),[1,2,1]);
  assert.deepEqual(normalizeCampaignState({choices:['br','cn']}),{choices:['br','cn']});
  assert.deepEqual(normalizeCampaignState(s),s);
});

test('boteco has dedicated identity stages, country P/S buttons and confirmation',()=>{
  const ui=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(ui,/armamentOffers\(this\.campaign,FIRST_UPGRADES\)/);
  assert.match(ui,/chooseArmamentUpgrade\(this\.campaign,id,this\.selectedTrack\)/);
  assert.match(ui,/MELHORAR PRINCIPAL/);
  assert.match(ui,/MELHORAR ESPECIAL/);
  assert.match(ui,/TIRO PRINCIPAL/);
  assert.match(ui,/TIRO ESPECIAL/);
  assert.match(game,/this\.campaignMathEnabled/);
  assert.match(game,/armamentAllocation\(this\.campaign\)/);
  assert.match(game,/this\.modernMathEnabled=this\.labMathEnabled\|\|this\.campaignMathEnabled/);
});
