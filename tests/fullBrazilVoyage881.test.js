import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fullBrazilVoyageEligible,VOYAGE_STOPS,voyageEvents,voyageStop,
  voyageCanDepart,voyageNext} from '../src/gameplay/fullBrazilVoyage.js';
const allBrazil={choices:Array(10).fill('br')};
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('rota espacial existe na Onda 11 com Full Brazil, inclusive no playtest',()=>{
 assert.equal(fullBrazilVoyageEligible('wave11',allBrazil),true);
 for(const mode of ['wave10','wave0','lab'])
   assert.equal(fullBrazilVoyageEligible(mode,allBrazil),false);
 for(const flag of [{lab:true},{waveMaker:true}])
   assert.equal(fullBrazilVoyageEligible('wave11',allBrazil,flag),false);
 assert.equal(fullBrazilVoyageEligible('wave11',allBrazil,{playtest:true}),true);
 assert.equal(fullBrazilVoyageEligible('wave11',{choices:[...Array(9).fill('br'),'us']}),false);
 assert.equal(fullBrazilVoyageEligible('wave11',{choices:['br','br']}),false);
});

test('múltiplas cidades placeholders e reforços contínuos, nunca Tipo 6',()=>{
 assert.equal(VOYAGE_STOPS.length,4);
 let last=0;
 for(let i=0;i<VOYAGE_STOPS.length;i++){
   const stop=voyageStop(i),events=voyageEvents(i);
   assert.match(stop.city,/A DEFINIR/);
   assert.ok(stop.backgroundKey.startsWith('voyage-city-'));
   assert.ok(events.length>=13);
   assert.ok(events.length>last);last=events.length;
   assert.ok(events.every(e=>e.at>=0&&e.type>=1&&e.type<=5&&!e.finalBoss));
   assert.ok(events.every((e,j)=>j===0||e.at>events[j-1].at));
   assert.ok(events.some(e=>e.type===3));
   assert.ok(events.some(e=>e.type===4));
   assert.equal(voyageNext(i),i+1<VOYAGE_STOPS.length?i+1:null);
 }
});

test('cidade só termina após todos os reforços, portais, inimigos e tiros',()=>{
 const base={elapsed:80000,spawned:19,scheduled:19,enemies:0,hostileShots:0,
   portals:0,lastAt:62000};
 assert.equal(voyageCanDepart(base),true);
 assert.equal(voyageCanDepart({...base,spawned:18}),false);
 assert.equal(voyageCanDepart({...base,enemies:1}),false);
 assert.equal(voyageCanDepart({...base,hostileShots:1}),false);
 assert.equal(voyageCanDepart({...base,portals:1}),false);
 assert.equal(voyageCanDepart({...base,elapsed:63000}),false);
 assert.equal(voyageCanDepart({...base,scheduled:0,spawned:0}),false);
});

test('GameScene isola a rota do Tipo 6, tem decolagem e conclusão intermunicipal',()=>{
 assert.match(scene,/this\.voyageActive=fullBrazilVoyageEligible\(/);
 assert.match(scene,/this\.waveEvents = this\.voyageActive[\s\S]*?voyageEvents\(this\.voyageIndex\)/);
 assert.match(scene,/if\(this\.voyageActive\)return null; \/\/ Nenhuma repetição do chefe alienígena/);
 assert.match(scene,/this\.startVoyageTransition\(this\.voyageIndex,\{initial:true\}\)/);
 assert.match(scene,/finishVoyageDestination\(\)/);
 assert.match(scene,/const next=voyageNext\(this\.voyageIndex\)/);
 assert.match(scene,/mode:'wave11',campaign:this\.campaign,voyageIndex:nextIndex/);
 assert.match(scene,/if\(this\.voyageActive\)\{/);
 assert.match(scene,/voyageCanDepart\(\{/);
 assert.match(scene,/!this\.voyageActive&&!this\.tutorialComplete/);
 assert.match(scene,/if\(!this\.voyageActive&&this\.dawnLayers/);
});
