import test from 'node:test';
import assert from 'node:assert/strict';
import {
 newWaveMakerProject,normalizeWaveMakerEvent,cloneWaveMakerEvent,
 readWaveMakerProject,saveWaveMakerProject,WAVE_MAKER_WAVES
} from '../src/gameplay/waveMakerModel.js';

test('gera rascunhos independentes para ondas 0–11',()=>{
 const project=newWaveMakerProject();
 assert.equal(Object.keys(project.waves).length,12);
 for(const wave of WAVE_MAKER_WAVES)assert.ok(project.waves[wave].events.length>0);
 const original=project.waves.wave1.events[0].at;
 project.waves.wave1.events[0].at=4444;
 assert.notEqual(newWaveMakerProject().waves.wave1.events[0].at,4444);
 assert.ok(Number.isInteger(original));
});
test('preserva atributos avançados sem descartá-los',()=>{
 const value=normalizeWaveMakerEvent({at:1500,type:6,bossCountry:'alien',warning:'CHEFE',portalX:400},4);
 assert.equal(value.bossCountry,'alien');assert.equal(value.warning,'CHEFE');
 assert.equal(value.x,400);assert.equal(value.portalX,400);
});
test('duplicação gera identidade única sem alterar o original',()=>{
 const original=normalizeWaveMakerEvent({id:'event-custom-1',at:1000,x:300,warning:'ATAQUE'});
 const copy=cloneWaveMakerEvent(original,[original]);
 assert.notEqual(copy.id,original.id);assert.equal(copy.at,2000);
 assert.equal(copy.warning,'ATAQUE');assert.equal(original.at,1000);
});
test('salva e restaura projeto via armazenamento local',()=>{
 const store=new Map();
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const original=newWaveMakerProject();
 original.waves.wave1.events[0].at=7400;
 assert.equal(saveWaveMakerProject(storage,original),true);
 const loaded=readWaveMakerProject(storage);
 assert.equal(loaded.waves.wave1.events[0].at,7400);
 assert.equal(loaded.waves.wave11.wave,'wave11');
});
