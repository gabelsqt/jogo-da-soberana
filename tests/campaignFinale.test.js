import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveFinalOpponent, finalePrelude, finaleEnding, allFinaleIds } from '../src/gameplay/campaignFinale.js';
import { getFinalWaveEvents, getWaveEvents, MODES, waveOutcome, FINAL_WAVE_DURATION_MS } from '../src/gameplay/waves.js';
import { hostileBosses, pickBetrayer } from '../src/gameplay/wave11Rules.js';
import { canOfferZecaRecovery, zecaRevengeLoadout } from '../src/gameplay/zecaRecovery.js';
import { v1CombatStats } from '../src/gameplay/v1Upgrades.js';
import { v1SpecialLoadout } from '../src/gameplay/v1Specials.js';

const state=choices=>({choices});
const pure=state(Array(10).fill('br'));

test('onda 10 tem Tipo 6; onda 11 com traição tem outro Tipo 6, sem chefe na Full Brazil',()=>{
  assert.equal(FINAL_WAVE_DURATION_MS,60000);
  for(const mode of ['wave10','wave11']){
    assert.equal(MODES[mode].minDuration,60000);
    assert.equal(waveOutcome({mode,elapsed:70000,spawned:3,scheduled:3,
      enemies:0,hostileShots:0}),null);
    const events=getFinalWaveEvents(mode,
      mode==='wave10'?pure:{choices:['br','us'],selectedBetrayer:'us'});
    assert.equal(events.filter(e=>e.finalBoss).length,1);
    assert.equal(events.find(e=>e.finalBoss).type,6);
    assert.ok(events.some(e=>e.type===3));
    assert.ok(events.every(e=>e.at>=0&&e.at<60000));
  }
  assert.equal(getFinalWaveEvents('wave11',pure).some(e=>e.type===6),false);
});

test('onda 11 invoca exatamente um traidor escolhido, não uma coalizão',()=>{
  const choices=['us','jp','ru','cn','us','jp','ru','cn','br','br'];
  const final=getFinalWaveEvents('wave11',{choices,selectedBetrayer:'cn'});
  const bosses=final.filter(e=>e.finalBoss);
  assert.equal(bosses.length,1);
  assert.equal(bosses[0].bossCountry,'cn');
  assert.equal(bosses[0].bossLevel,2);
  assert.equal(bosses[0].coalitionSize,1);
  assert.deepEqual(hostileBosses(choices,'cn'),[{country:'cn',level:2}]);
  assert.deepEqual(getWaveEvents('wave11',{choices,selectedBetrayer:'cn'}),final);
  assert.equal(pickBetrayer(choices,()=>0.99),'cn');
});

test('Full Brazil segue a rota mundial sem repetir chefão; traições continuam',()=>{
  assert.equal(resolveFinalOpponent(pure).country,'br');
  assert.deepEqual(resolveFinalOpponent(pure).coalition,[]);
  assert.match(finalePrelude(pure).title,/SOBERANIA TOTAL/);
  assert.ok(getWaveEvents('wave11',pure).every(e=>e.type<=5&&!e.finalBoss));
  const mixed={choices:['cn','us','cn','us','br'],selectedBetrayer:'us'};
  assert.equal(resolveFinalOpponent(mixed).country,'us');
  assert.deepEqual(resolveFinalOpponent(mixed).coalition,['us']);
  assert.doesNotMatch(finalePrelude(mixed).lines.join(' '),/COALIZÃO/i);
});

test('os dez finais permanecem distintos por país e resultado',()=>{
  assert.equal(allFinaleIds().length,10);
  assert.equal(new Set(allFinaleIds()).size,10);
  for(const id of ['br','us','ru','cn','jp'])for(const won of [true,false]){
    const ending=finaleEnding(state(Array(10).fill(id)),won);
    assert.equal(ending.id,`${id}-${won?'win':'lose'}`);
    assert.equal(ending.slides.length,4);
    assert.ok(ending.slides.every(([heading,caption])=>heading&&caption.length>30));
  }
});

test('Zeca permite uma única revanche com a build original, sem Supremo do traidor',()=>{
  const initial={choices:Array(10).fill('us')};
  assert.equal(canOfferZecaRecovery(initial,'us'),true);
  assert.equal(canOfferZecaRecovery(initial,'us',true),false);
  assert.equal(canOfferZecaRecovery(initial,'cn'),false);
  const retry=zecaRevengeLoadout(initial,'us');
  assert.deepEqual(retry.choices,initial.choices);
  assert.equal(retry.disabledSupremeCountry,'us');
  assert.equal(v1CombatStats(retry).transformed,'us');
  assert.equal(v1CombatStats(retry).ultimate,null);
  assert.equal(v1SpecialLoadout(retry).stages.us,4);
});

test('cena continua ligada aos epílogos da campanha',()=>{
  const root=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(root,/EndingScene/);
  assert.match(game,/mode:'wave11'/);
  assert.match(game,/scene.start\('EndingScene'/);
  assert.match(game,/showFinaleDefeat/);
  assert.match(game,/spawnType6Encounter/);
});

test('ondas finais mantêm escoltas e distribuição temporal',()=>{
  for(const mode of ['wave10','wave11']){
    const events=getFinalWaveEvents(mode,
      mode==='wave10'?pure:{choices:['br','us'],selectedBetrayer:'us'});
    assert.ok(events.length>=11);
    assert.ok(events.some(e=>e.type===2&&e.at<=6500));
    assert.ok(events.some(e=>e.type===4&&e.at<=10000));
    assert.ok(events.some(e=>e.type===3&&e.at<=10000));
    assert.ok(events.every(e=>e.at<60000));
    assert.ok(events.every(e=>e.level>=9));
    assert.equal(events.filter(e=>e.finalBoss).length,1);
  }
});
