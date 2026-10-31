import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {introductionSlides} from '../src/gameplay/introScript.js';
import {botecoDialogue} from '../src/gameplay/botecoDialogue.js';
import {REPRESENTATIVES,representativeStoryFor} from '../src/gameplay/representatives.js';

test('convocação única, três notícias e promoção preservam a revelação posterior',()=>{
 const slides=introductionSlides();
 assert.deepEqual(slides.map(s=>s.id),['convocation','invasion','carnaval','elections','promotion']);
 assert.equal((slides[0].body.match(/MESÁRIO/g)||[]).length,1);
 assert.match(slides[0].body,/MESÁRIO\*/);
 assert.equal(slides.at(-1).promotion,'GENERAL DE GUERRA');
 assert.match(slides.at(-1).footnote,/^\*/);
 const text=JSON.stringify(slides);
 assert.doesNotMatch(text,/Zé Maria|Zeca|Anselmo|braços abertos|cruzar os braços|etiqueta alienígena/i);
});
test('apresentação coletiva contém os quatro estrangeiros e cada visita possui conversa própria',()=>{
 const names=botecoDialogue(0).map(([name])=>name);
 for(const id of ['us','ru','cn','jp'])
  assert.ok(names.includes(REPRESENTATIVES[id].name.toLocaleUpperCase('pt-BR')));
 const visits=Array.from({length:10},(_,wave)=>botecoDialogue(wave));
 assert.equal(new Set(visits.map(lines=>JSON.stringify(lines))).size,10);
 assert.ok(visits.every(lines=>lines.length>=2&&lines.every(([name,line])=>name&&line)));
 const first=botecoDialogue(0);
 first[0][1]='texto modificado por uma cena';
 assert.notEqual(botecoDialogue(0)[0][1],first[0][1],'uma visita não modifica o banco de falas');
});
test('dez conversas pessoais por representante seguem a onda, com limites seguros',()=>{
 for(const id of Object.keys(REPRESENTATIVES)){
  const stories=Array.from({length:10},(_,i)=>representativeStoryFor(id,i+1));
  assert.equal(new Set(stories).size,10);
  assert.ok(stories.every(text=>typeof text==='string'&&text.length>0));
  assert.equal(representativeStoryFor(id,-1),stories[0]);
  assert.equal(representativeStoryFor(id,20),stories[9]);
 }
});
test('mensagem concluída espera avanço manual, sem temporizador de troca de página',()=>{
 const source=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
 const code=source.slice(source.indexOf('export class IntroScene')).replace('export class','class');
 const Scene=new Function('Phaser','introductionSlides',code+';return IntroScene;')(
  {Scene:class{}},introductionSlides);
 for(const page of [0,1,2,3,4]){
  const scene=new Scene();scene.init();
  scene.page=page;scene.typeField=page===4?'footnote':'body';
  scene.time={delayedCall(){throw Error('mensagem não avança sozinha');}};
  let next=null;scene.show=index=>{next=index;};
  scene.completeSegment();
  assert.equal(scene.phase,'hold');assert.equal(next,null);
  scene.advance();assert.equal(next,page+1);
 }
});
