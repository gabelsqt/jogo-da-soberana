import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROLOGUE_WITHDRAWAL_MS,prologueSwarmSlot,prologueWithdrawalPose} from '../src/gameplay/prologueStory.js';
import {cannonShieldColor} from '../src/gameplay/shieldDome049.js';
import {drawHexShieldDome} from '../src/gameplay/hexShieldDome.js';
const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('all sixty invaders remain visible early in retreat and reach their portal before completion',()=>{
 for(let i=0;i<60;i++){
  const s=prologueSwarmSlot(i);
  const early=prologueWithdrawalPose(i,s.x,s.y,2000);
  assert.equal(early.alpha,1);
  assert.ok(early.y>=65);
  const end=prologueWithdrawalPose(i,s.x,s.y,PROLOGUE_WITHDRAWAL_MS);
  assert.deepEqual(end,{x:i%2?750:210,y:65,alpha:0});
 }
});
test('entire dome changes to the common shield color at all four thresholds',()=>{
 for(const [hp,color] of [[100,0x388bff],[75,0x35c86d],[50,0xf1cb35],[25,0xf04a52]]){
  const colors=[];let g;
  g=new Proxy({}, {get:(_,key)=>(...args)=>{
   if(key==='fillStyle')colors.push(args[0]);
   if(key==='lineStyle')colors.push(args[1]);return g;
  }});
  drawHexShieldDome(g,{shield:hp,maxShield:100,flash:0,now:2000});
  assert.equal(cannonShieldColor(hp,100),color);
  assert.ok(colors.length>100);
  assert.ok(colors.every(c=>c===color),'all cells, dots, fill and rim use health color');
 }
});
test('opening unlocks combat only after HUD cancellation, and starts events once',()=>{
 const a=source.indexOf('  startWaveCountdown() {'),b=source.indexOf('  createSupportTowers()',a);
 const run=new Function('waveMusic','return ({'+source.slice(a,b)+'}).startWaveCountdown')(()=> 'early');
 let callback,scheduled=0,center=true;const timers=[];
 const scene={time:{now:0,delayedCall:(ms,fn)=>timers.push({ms,fn})},music:{play(){}},
  mode:'wave1',campaign:{},statusText:{setText(){}},waveDurationMs:30000,
  scene:{isActive:()=>true},queueBattleBanter(){},supportTowers:[],
  scheduleWaveEvents(){assert.equal(center,false);scheduled++;},
  cuboNewsHud:{beginDawnIntro(_ms,done){callback=done;},cancelDawnIntro(){center=false;}},
 };
 run.call(scene);run.call(scene);
 assert.equal(scene.countdownActive,true);assert.equal(scheduled,0);
 assert.equal(timers.length,1);
 callback();assert.equal(center,false);assert.equal(scene.countdownActive,false);
 callback();timers[0].fn();assert.equal(scheduled,1);
});
test('laboratory completion preserves experimental loadout on next wave and on return',()=>{
 const a=source.indexOf('  showLabWaveComplete(outcome){'),b=source.indexOf('  advanceAfterWave()',a);
 const buttons=[];const show=new Function('W','H','addMenuButton',
  'return ({'+source.slice(a,b)+'}).showLabWaveComplete')(960,540,(_scene,b)=>buttons.push(b));
 const drawing=new Proxy({}, {get:()=>()=>drawing});
 let started;const opts={mode:'wave9',v1Playtest:true,v1LabLevels:{br:5},v1LabAllocation:{br:{P:3,S:2}}};
 const fake={mode:'wave9',v1Playtest:true,clearDiscoGlobes(){},music:{stop(){}},
  add:{rectangle:()=>drawing,text:()=>drawing},getRunOptions:()=>opts,
  v1LabPrincipal:'br',v1LabSpecial:'ru',v1LabAllocation:opts.v1LabAllocation,
  scene:{start:(name,data)=>started={name,data}}};
 show.call(fake,'survived');assert.equal(buttons.length,2);
 buttons[0].onClick();assert.equal(started.data.mode,'wave10');
 assert.deepEqual(started.data.v1LabLevels,{br:5});
 assert.equal(started.data.v1LabAllocation,opts.v1LabAllocation);
 buttons[1].onClick();assert.equal(started.name,'V1PlaytestScene');
 assert.equal(started.data.arenaIndex,9);assert.equal(started.data.especial,'ru');
 assert.equal(started.data.allocation,opts.v1LabAllocation);
 buttons.length=0;fake.mode='wave11';show.call(fake,'cleared');
 assert.equal(buttons.length,1);assert.match(buttons[0].text,/VOLTAR/);
});
