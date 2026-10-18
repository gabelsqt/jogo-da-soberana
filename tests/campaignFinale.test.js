import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveFinalOpponent, finalePrelude, finaleEnding, allFinaleIds } from '../src/gameplay/campaignFinale.js';
import { getFinalWaveEvents, getWaveEvents, MODES, waveOutcome, FINAL_WAVE_DURATION_MS } from '../src/gameplay/waves.js';
import { betrayalCoalition, coalitionHpFactor, hostileBosses, continueResistanceAfterDefeat } from '../src/gameplay/wave11Rules.js';
import { v1CombatStats } from '../src/gameplay/v1Upgrades.js';
import { v1SpecialLoadout } from '../src/gameplay/v1Specials.js';

const state=choices=>({choices});
const pure=state(Array(10).fill('br'));

test('onda 10 e 11 usam 60s; só chefe pode determinar vitória antecipada',()=>{
  assert.equal(FINAL_WAVE_DURATION_MS,60000);
  for(const mode of ['wave10','wave11']){
    assert.equal(MODES[mode].minDuration,60000);
    assert.equal(waveOutcome({mode,elapsed:70000,spawned:3,scheduled:3,
      enemies:0,hostileShots:0}),null);
  }
  const events=getFinalWaveEvents('wave10',pure);
  assert.equal(events.filter(e=>e.finalBoss).length,1);
  assert.equal(events.find(e=>e.finalBoss).type,5);
  assert.ok(events.some(e=>e.type===3));
  assert.ok(events.every(e=>e.at>=0&&e.at<60000));
});

test('onda 11 respeita coalizão estrangeira, inclusive empates',()=>{
  const choices=['us','jp','ru','cn','us','jp','ru','cn','br','br'];
  const coalition=betrayalCoalition(choices);
  assert.deepEqual(coalition,['us','jp','ru','cn']);
  const final=getFinalWaveEvents('wave11',state(choices));
  const bosses=final.filter(e=>e.finalBoss);
  assert.deepEqual(bosses.map(e=>e.bossCountry),coalition);
  assert.deepEqual(bosses.map(e=>e.bossLevel),[2,2,2,2]);
  assert.ok(bosses.every(e=>e.coalitionSize===4));
  assert.equal(new Set(bosses.map(e=>e.x)).size,4);
  assert.equal(coalitionHpFactor(4),0.35);
  assert.deepEqual(hostileBosses(choices),coalition.map(country=>({country,level:2})));
  assert.deepEqual(getWaveEvents('wave11',state(choices)),final);
});

test('full Brazil disputa batalha extra alienígena, sem inimigo colonizador',()=>{
  assert.equal(resolveFinalOpponent(pure).country,'br');
  assert.deepEqual(resolveFinalOpponent(pure).coalition,[]);
  assert.match(finalePrelude(pure).title,/SOBERANIA TOTAL/);
  const bosses=getWaveEvents('wave11',pure).filter(e=>e.finalBoss);
  assert.equal(bosses.length,1);
  assert.equal(bosses[0].bossCountry,'alien');
});

test('empates de países usam o primeiro chefe da coalizão para escolher roteiro',()=>{
  const history=state(['cn','us','cn','us','br','br','br','br','jp','jp']);
  const match=resolveFinalOpponent(history);
  assert.deepEqual(match.coalition,['us','jp','cn']);
  assert.equal(match.country,'us');
  assert.equal(match.fullBrazil,false);
});

test('são 10 finais distintos: vitória e derrota dos quatro países e Full Brazil',()=>{
  assert.equal(allFinaleIds().length,10);
  assert.equal(new Set(allFinaleIds()).size,10);
  const groups={br:['br'],us:['us'],ru:['ru'],cn:['cn'],jp:['jp']};
  for(const [id,choices] of Object.entries(groups))for(const won of [true,false]){
    const ending=finaleEnding(state(choices),won);
    assert.equal(ending.id,`${id}-${won?'win':'lose'}`);
    assert.equal(ending.slides.length,4);
    assert.ok(ending.slides.every(([heading,caption])=>heading.length&&caption.length>30));
    assert.ok(ending.title.length);
  }
});

test('após traição a resistência brasileira avança, com limite máximo de 10',()=>{
  const initial=Array(10).fill('us');
  const first=continueResistanceAfterDefeat(initial,[]);
  assert.equal(first.outcome,'retry');
  assert.equal(first.awardedLevel,1);
  let awarded=[];
  for(let i=0;i<10;i++){
    const next=continueResistanceAfterDefeat(initial,awarded);
    if(next.outcome==='colonized')break;
    awarded=next.awardedLevels;
  }
  assert.equal(awarded.at(-1),10);
  assert.equal(continueResistanceAfterDefeat(initial,awarded).outcome,'colonized');
  const stats=v1CombatStats({choices:[],resistanceLevels:awarded});
  assert.equal(stats.transformed,'br');
  assert.equal(v1SpecialLoadout({choices:[],resistanceLevels:awarded}).stages.br,4);
});

test('Phaser registra tela de epílogo e caminhos após as duas ondas',()=>{
  const root=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(root,/EndingScene/);
  assert.match(game,/mode:'wave11'/);
  assert.match(game,/scene.start\('EndingScene'/);
  assert.match(game,/showFinaleDefeat/);
  assert.match(game,/finaleBossesKilled/);
});
