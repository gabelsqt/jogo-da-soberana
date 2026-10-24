import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createType6State} from '../src/gameplay/type6Boss.js';
import {type6IntakeProgress} from '../src/gameplay/type6ModuleSprite.js';
import {type6DoomAtZero,type6NextDeadline} from '../src/gameplay/type6Encounter.js';
import {canOfferZecaRecovery} from '../src/gameplay/zecaRecovery.js';
import {waveOutcome} from '../src/gameplay/waves.js';

const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const visual=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');

test('canhão russo usa loop de sopro, não efeito pontual de tiro',()=>{
 assert.doesNotMatch(source,/playSfx\('ruBasicShot'/);
 assert.match(source,/const breathActive=this\.isV1Campaign&&this\.combat\.russianFreezeMs>0&&/);
 assert.match(source,/setSfxLoopActive\('ruIceBreath',breathActive/);
 assert.match(source,/stopRussianSfxLoops\(\)/);
});

test('Zeca EUA/Rússia reinicia trava e mantém somente retrato/legenda clicáveis',()=>{
 assert.match(source,/this\.zecaRevenge = this\.mode === 'wave11'[\s\S]*?this\.zecaProposalOpened=false;/);
 assert.match(source,/this\.add\.rectangle\(px\+13,py\+16,118,132/);
 assert.doesNotMatch(source,/text:'ZECA • PEDIR AJUDA'/);
 assert.match(source,/talkToZeca\(\)/);
 assert.match(source,/\.setInteractive\(\{useHandCursor:true\}\)/);
 const c={choices:['br','us','ru','br','us','ru','br','us','ru','br']};
 for(const nation of ['us','ru']){
   assert.equal(canOfferZecaRecovery(c,nation,false),true);
   assert.equal(canOfferZecaRecovery(c,nation,true),false);
 }
});

test('a sucção aumenta conforme o disparo chega, e cessa ao destruir o módulo',()=>{
 const state=createType6State('alien',800);
 state.introComplete=true;
 const laser=state.modules[1];
 state.action={moduleId:1,kind:'laserCharge',elapsed:0};
 assert.equal(type6IntakeProgress(state,laser,0),0);
 state.action.elapsed=5;
 assert.equal(type6IntakeProgress(state,laser,0),0.5);
 state.action.elapsed=9.9;
 assert.ok(type6IntakeProgress(state,laser,0)>0.98);
 state.action.kind='laserFire';
 assert.equal(type6IntakeProgress(state,laser,0),1);
 const bomb=state.modules[0];
 state.action={moduleId:0,kind:'bomb',elapsed:0.63};
 assert.ok(type6IntakeProgress(state,bomb,0)>0.95);
 const hangar=state.modules[2];
 state.action={moduleId:2,kind:'hangar',elapsed:1.9};
 assert.ok(type6IntakeProgress(state,hangar,0)>0.9);
 hangar.broken=true;
 assert.equal(type6IntakeProgress(state,hangar,0),0);
 assert.match(visual,/const surge=intensity\*intensity/);
 assert.match(visual,/const reach=radius\*\(1\+0\.72\*surge\)/);
 assert.match(visual,/const particles=count\+Math\.floor\(18\*surge\)/);
});

test('Tipo 6 lança o laser final somente em 00:00; derrota segue o impacto',()=>{
 assert.equal(type6DoomAtZero(5000),false);
 assert.equal(type6DoomAtZero(1),false);
 assert.equal(type6DoomAtZero(0),true);
 assert.equal(type6DoomAtZero(-1),true);
 const boss=createType6State('us',800);
 boss.introComplete=true;
 const enemy={type:6,type6:boss,bossCountry:'us',sprite:{x:480,y:125}};
 let finish;
 const graphics={lineStyle(){return this;},lineBetween(){return this;},destroy(){}};
 const scene={
   enemies:[enemy],waveDurationMs:60000,elapsed:59999,
   boss6DoomFired:false,tutorialComplete:false,shield:60,cannonHealth:120,
   showAttackWarning(){},cameras:{main:{shake(){},flash(){}}},
   add:{graphics(){return {setDepth(){return graphics;}}}},
   time:{delayedCall(ms,cb){assert.equal(ms,920);finish=cb;}},
   scene:{isActive(){return true;}},
   showDefeat(reason){this.defeatReason=reason;},
   showWaveComplete(){throw Error('Vitória automática proibida');},
 };
 assert.equal(type6NextDeadline(scene),true);
 assert.equal(boss.charging,true);
 assert.equal(scene.boss6DoomFired,false);
 assert.equal(finish,undefined);
 scene.elapsed=60000;
 assert.equal(type6NextDeadline(scene),true);
 assert.equal(scene.boss6DoomFired,true);
 assert.equal(scene.defeatReason,undefined);
 assert.equal(typeof finish,'function');
 finish();
 assert.equal(scene.defeatReason,'cannon');
 assert.equal(scene.cannonHealth,0);
 for(const mode of ['wave10','wave11'])
   assert.equal(waveOutcome({mode,elapsed:60000,spawned:1,scheduled:1,enemies:0,hostileShots:0}),null);
 assert.match(source,/if\(this\.elapsed>=this\.waveDurationMs\)this\.updateHud\(\);/);
});
