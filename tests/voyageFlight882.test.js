import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fullBrazilVoyageEligible,VOYAGE_STOPS,voyageEvents} from '../src/gameplay/fullBrazilVoyage.js';
import {getFinalWaveEvents,getWaveEvents} from '../src/gameplay/waves.js';
import {VOYAGE_PREPARE_MS,VOYAGE_LAUNCH_MS,VOYAGE_SPACE_MS,VOYAGE_LANDING_MS,
 VOYAGE_TOTAL_MS,voyageTravelPhase,voyageRocketPose,voyageStarfield,voyageStarAt} from '../src/gameplay/voyageTravel.js';
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const typewriter=readFileSync(new URL('../src/ui/dialogueTypewriter.js',import.meta.url),'utf8');
const brazil={choices:Array(10).fill('br')};

test('regressão: playtest que vem da Onda 10 também entra na rota espacial',()=>{
 assert.equal(fullBrazilVoyageEligible('wave11',brazil,{playtest:true}),true);
 assert.equal(fullBrazilVoyageEligible('wave11',brazil),true);
 assert.equal(fullBrazilVoyageEligible('wave11',brazil,{lab:true}),false);
 assert.equal(fullBrazilVoyageEligible('wave11',brazil,{waveMaker:true}),false);
 assert.equal(getFinalWaveEvents('wave11',brazil).some(e=>e.type===6),false);
 assert.deepEqual(getWaveEvents('wave11',brazil),voyageEvents(0));
 assert.equal(getFinalWaveEvents('wave10',brazil).filter(e=>e.type===6).length,1);
 assert.equal(getFinalWaveEvents('wave11',{choices:['br','us'],selectedBetrayer:'us'}).filter(e=>e.type===6).length,1);
 assert.match(scene,/v1Playtest:this\.v1Playtest,/);
 assert.match(scene,/this\.voyageActive=fullBrazilVoyageEligible/);
 assert.match(scene,/if\(this\.voyageActive\)return null; \/\/ Nenhuma repetição do chefe alienígena/);
});

test('4 segundos exatos de viagem estelar, com decolagem e pouso separados',()=>{
 assert.equal(VOYAGE_PREPARE_MS,450);
 assert.equal(VOYAGE_LAUNCH_MS,1000);
 assert.equal(VOYAGE_SPACE_MS,4000);
 assert.equal(VOYAGE_LANDING_MS,1000);
 assert.equal(VOYAGE_TOTAL_MS,6000);
 assert.equal(voyageTravelPhase(0),'prepare');
 assert.equal(voyageTravelPhase(449),'prepare');
 assert.equal(voyageTravelPhase(450),'launch');
 assert.equal(voyageTravelPhase(999),'launch');
 assert.equal(voyageTravelPhase(1000),'space');
 assert.equal(voyageTravelPhase(4999),'space');
 assert.equal(voyageTravelPhase(5000),'landing');
 assert.equal(voyageTravelPhase(5999),'landing');
 assert.equal(voyageTravelPhase(6000),'done');
});

test('estrelas se movem com parallax, e a cidade seguinte só carrega após o pouso',()=>{
 const stars=voyageStarfield(92);
 assert.equal(stars.length,92);
 assert.ok(new Set(stars.map(x=>x.speed)).size>5);
 assert.notEqual(voyageStarAt(stars[1],2000).y,stars[1].y);
 assert.equal(voyageStarAt(stars[1],2000).x,stars[1].x);
 assert.deepEqual(voyageStarAt(stars[1],0),stars[1]);
 assert.doesNotMatch(scene,/createVoyageRocket\(\)/);
 assert.match(scene,/startVoyageTransition\(nextIndex,\{initial=false\}=\{\}\)/);
 assert.match(scene,/this\.time\.delayedCall\(VOYAGE_TOTAL_MS/);
 assert.match(scene,/voyageStarAt\(star,flight,H\)/);
 assert.match(scene,/this\.textures\.exists\(stop\.backgroundKey\)/);
 assert.match(scene,/arrivedFromVoyage:true/);
 assert.match(scene,/this\.startWaveCountdown\(\)/);
 assert.equal(VOYAGE_STOPS.length,4);
});

test('HUD lateral agora é menor e digita aos poucos, usando a intro',()=>{
 assert.match(scene,/this\.add\.rectangle\(139,421,268,96/);
 assert.match(scene,/this\.banterPortrait=this\.add\.image\(39,421/);
 assert.match(scene,/wordWrap:\{width:194\}/);
 assert.match(scene,/createDialogueTypewriter\(this,\{/);
 assert.match(scene,/this\.banterWriter\.start\(this\.banterText,line\.text,\{delay:28\}\)/);
 assert.match(scene,/this\.banterWriter\?\.cancel\(\)/);
 assert.match(typewriter,/target\.setText\(chars\.slice\(0,index\)\.join\(''\)\)/);
});
