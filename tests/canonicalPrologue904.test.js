import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INTRO_CHAR_DELAY_MS,introductionSlides} from '../src/gameplay/introScript.js';
import {PROLOGUE_SURVIVAL_MS,PROLOGUE_SWARM_COUNT,
  PROLOGUE_CANNON,REPAIR_STAGES} from '../src/gameplay/prologueStory.js';
import {chooseArmamentUpgrade} from '../src/gameplay/progression.js';
const source=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('intro does not introduce mechanic before the broken-cannon prologue',()=>{
 const slides=introductionSlides();
 assert.equal(slides.length,4);
 assert.equal(slides[0].id,'convocation');
 assert.equal(slides.at(-1).id,'promotion');
 assert.ok(slides.every(s=>s.kind!=='zeca'));
 assert.ok(INTRO_CHAR_DELAY_MS>0);
});
test('15s wave 0.5 follows scripted Type 6 overload without granting upgrade',()=>{
 assert.equal(PROLOGUE_SURVIVAL_MS,15000);
 assert.ok(PROLOGUE_SWARM_COUNT>=70);
 assert.ok(PROLOGUE_CANNON.strong.intervalMs<100);
 assert.ok(PROLOGUE_CANNON.damaged.intervalMs>=1000);
 const game=source('src/scenes/GameScene.js');
 const scene=source('src/scenes/PrologueSurvivalScene.js');
 assert.match(game,/this\.scene\.start\('PrologueSurvivalScene'/);
 assert.match(game,/TYPE6_HULL_SHEET\.key/);
 assert.match(game,/PROLOGUE_CANNON\.strong/);
 assert.match(scene,/this\.scene\.start\('PrologueRepairScene'/);
 assert.match(scene,/this\.destroyed<6/);
 assert.doesNotMatch(scene,/chooseArmamentUpgrade/);
});
test('sequential repair panels install principal before wave 1, special before wave 2',()=>{
 assert.equal(REPAIR_STAGES.arrival.length,3);
 assert.equal(REPAIR_STAGES.principal.length,2);
 assert.equal(REPAIR_STAGES.special.length,2);
 const repair=source('src/scenes/PrologueRepairScene.js');
 const upgrade=source('src/scenes/UpgradeScene.js');
 assert.match(repair,/mode:this\.stage==='special'\?'wave2':'wave1'/);
 assert.match(upgrade,/stage:this\.phase==='principal'\?'principal':'special'/);
 assert.match(upgrade,/chooseArmamentUpgrade\(this\.campaign,id,this\.selectedTrack\)/);
 assert.match(repair,/Se eu fiz um Marea andar, faço isso aqui funcionar/);
});
test('elevator keeps Boteco scene and Anselmo is a supporting character',()=>{
 const elev=source('src/scenes/BotecoElevatorScene.js');
 const upgrade=source('src/scenes/UpgradeScene.js');
 const game=source('src/scenes/GameScene.js');
 assert.match(elev,/this\.scene\.start\('UpgradeScene'/);
 assert.match(game,/this\.scene\.start\('BotecoElevatorScene'/);
 assert.match(upgrade,/SEU ANSELMO/);
 assert.match(upgrade,/nos anos oitenta/);
 assert.match(upgrade,/boteco-dia/);
});
test('the prologue does not consume one of the 10 choices',()=>{
 let s=chooseArmamentUpgrade({choices:[]},'br');
 assert.equal(s.choices.length,1);
 s=chooseArmamentUpgrade(s,'ru');
 assert.equal(s.choices.length,2);
 const scene=source('src/scenes/PrologueSurvivalScene.js');
 assert.doesNotMatch(scene,/choices\.push|choices\.length\s*\+/);
});
