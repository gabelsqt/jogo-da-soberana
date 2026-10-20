import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BRAZILIAN_NAMES,resolvePlayerName,getSavedPlayerName,savePlayerName} from '../src/gameplay/playerIdentity.js';
import {introductionSlides,INTRO_PAGE_MS} from '../src/gameplay/introScript.js';
import {CANNON_DOME_RADIUS,cannonShieldColor,cannonDomeIntercept} from '../src/gameplay/shieldDome049.js';
import {v1CombatStats,V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
import {WAVE_LAST_SPAWN_MS,getWaveEvents} from '../src/gameplay/waves.js';
import {CUBO_CULTURAL_NEWS,nextCuboNewsStory,createCuboNewsState} from '../src/gameplay/cuboNews.js';

test('nome: 40 opções brasileiras, gênero não requerido e persistência segura',()=>{
  assert.equal(BRAZILIAN_NAMES.length,40);
  assert.equal(resolvePlayerName('  Vitória  '),'Vitória');
  assert.equal(resolvePlayerName('',()=>0),BRAZILIAN_NAMES[0]);
  assert.equal(resolvePlayerName('  ',()=>0.9999),BRAZILIAN_NAMES[39]);
  const map=new Map();const store={
    getItem(k){return map.get(k);},
    setItem(k,v){map.set(k,v);},
  };
  assert.equal(getSavedPlayerName(store),'');
  savePlayerName(store,'Rafa');
  assert.equal(getSavedPlayerName(store),'Rafa');
  assert.equal(getSavedPlayerName(null),'');
});
test('intro legada mantém seis quadros até a revisão narrativa planejada',()=>{
  const slides=introductionSlides('Rafa');
  assert.equal(slides.length,6);
  assert.equal(INTRO_PAGE_MS*slides.length,24000);
  assert.equal(slides[1].speaker,'COMANDANTE ALIENÍGENA');
  assert.match(slides[1].body,/braços abertos/);
  assert.match(slides[2].body,/dia/);
  assert.match(slides[4].body,/bolacha de biscoito/);
  assert.match(slides[5].title,/Rafa/);
  assert.match(slides[5].body,/mesários/);
  const intro=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
  assert.match(intro,/INTRO_PAGE_MS/);
  assert.match(intro,/installComputerLogin/);
  assert.match(intro,/openNewsButton/);
  assert.match(intro,/this\.finish\(\)/);
  assert.match(intro,/this\.scene\.start\('GameScene'/);
});
test('escudo v0.49: raio 180%, visual e intercepção consistentes',()=>{
  assert.equal(CANNON_DOME_RADIUS,62*1.8);
  assert.equal(cannonShieldColor(80,80),0x388bff);
  assert.equal(cannonShieldColor(55,80),0x35c86d);
  assert.equal(cannonShieldColor(35,80),0xf1cb35);
  assert.equal(cannonShieldColor(10,80),0xf04a52);
  assert.equal(cannonDomeIntercept(480,200,480,500),true);
  assert.equal(cannonDomeIntercept(900,200,900,500),false);
  assert.equal(cannonDomeIntercept(480,600,480,580),false);
  const stats=v1CombatStats({choices:Array(8).fill('us')});
  assert.equal(stats.shieldBonus,0);
  assert.equal(stats.shieldIntercept,false);
  assert.equal(stats.shieldPulse,false);
  assert.ok(Object.values(V1_UPGRADES).every(levels=>
    [2,4,6,8].every(tier=>levels[tier-1].kind==='secondary')));
  assert.equal(v1SpecialConfig({choices:['ru','ru']}).ruShieldFreezeMs,undefined);
});
test('ondas 0–9: última entrada até 15 s e ataques diretos nos dez finais',()=>{
  assert.equal(WAVE_LAST_SPAWN_MS,13500);
  for(let wave=0;wave<10;wave++){
    const events=getWaveEvents('wave'+wave);
    assert.ok(events.every(e=>e.at<=13500),'wave'+wave);
  }
  const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(source,/this\.elapsed>=15000/);
  assert.match(source,/this\.elapsed>=20000/);
  assert.match(source,/enemy\.phase\s*=\s*'tacticalHold'/);
  assert.match(source,/enemy\.phase='dive'/);
  assert.match(source,/shot\.radius\?\?8/);
  assert.match(source,/beginDawnWithdrawal/);
  assert.match(source,/this\.sunriseOverlay\?\.setAlpha\(0\)/);
});
test('Cubo News: país aliado elogiado e cultura renegada na traição',()=>{
  for(const id of ['us','jp','ru','cn']){
    assert.equal(CUBO_CULTURAL_NEWS[id].praise.length,3);
    assert.equal(CUBO_CULTURAL_NEWS[id].betrayal.length,2);
    const s=createCuboNewsState([id,id,id,id],'wave11',id);
    const story=nextCuboNewsStory(s);
    assert.ok(story.headline.length>10);
  }
  const allies=createCuboNewsState(['jp','jp','jp','jp'],'wave7');
  const stories=Array.from({length:20},()=>nextCuboNewsStory(allies));
  assert.ok(stories.some(s=>s.headline.includes('BTS')||s.headline.includes('K-pop')||s.headline.includes('Dorama')));
});
