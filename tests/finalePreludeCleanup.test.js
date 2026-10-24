import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { addMenuButton, destroyMenuButton } from '../src/ui/menuButton.js';
import { addCuboBroadcastFrame } from '../src/ui/cuboNewsTheme.js';

function fakeScene(){
  const objects=[];
  function make(kind){
    const item={kind,destroyed:false,events:{},
      setDepth(){return this;},setStrokeStyle(){return this;},
      setInteractive(){return this;},setOrigin(){return this;},
      setFillStyle(){return this;},setText(t){this.text=t;return this;},
      on(name,fn){this.events[name]=fn;return this;},
      destroy(){this.destroyed=true;return this;}};
    objects.push(item);return item;
  }
  const scene={
    add:{rectangle:()=>make('rectangle'),text:()=>make('text')},
    music:{play(){}},countdownActive:false,objects,
    scene:{start(key,args){scene.navigation={key,args};}},
    startWaveCountdown(){scene.combatStarted=true;},
    finaleCampaign:{choices:['br','jp']},
  };
  return scene;
}
function press(button){
  assert.ok(button?.events?.pointerdown,'botão precisa estar interativo');
  button.events.pointerdown({leftButtonDown:()=>true},0,0,{stopPropagation(){}});
}
const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const preludeStart=source.indexOf('  showFinalePrelude() {');
const preludeEnd=source.indexOf('\n  showAlienRevelation() {',preludeStart);
assert.ok(preludeStart>=0&&preludeEnd>preludeStart);
const makePrelude=new Function('addMenuButton','destroyMenuButton','addCuboBroadcastFrame','finalePrelude','W','H',
  'return ({'+source.slice(preludeStart,preludeEnd)+'}).showFinalePrelude');

test('botão Cubo News remove também barra lateral e sombra',()=>{
  const scene=fakeScene(),button=addMenuButton(scene,{x:400,y:250,text:'TESTE',onClick(){}});
  assert.equal(scene.objects.length,4);
  destroyMenuButton(button);
  assert.ok(scene.objects.every(o=>o.destroyed));
});

test('moldura Cubo News devolve todos os objetos para descarte',()=>{
  const scene=fakeScene();
  const objects=addCuboBroadcastFrame(scene,{depth:228});
  assert.ok(objects.length>=10);
  assert.equal(objects.length,scene.objects.length);
  objects.forEach(o=>o.destroy());
  assert.ok(scene.objects.every(o=>o.destroyed));
});

test('resistir após traição remove todos os botões e molduras antes da luta',()=>{
  const scene=fakeScene();
  const method=makePrelude(addMenuButton,destroyMenuButton,addCuboBroadcastFrame,
    ()=>({title:'TRAIÇÃO',lines:['O país traiu o Brasil'],fullBrazil:false}),960,540);
  method.call(scene);
  const interactive=scene.objects.filter(o=>o.events.pointerdown);
  assert.equal(interactive.length,2);
  press(interactive[0]);
  assert.equal(scene.combatStarted,true);
  assert.ok(scene.objects.every(o=>o.destroyed),'nenhum elemento da cutscene pode sobreviver');
});

test('aceitar submissão encerra cutscene sem iniciar combate e sem rastros',()=>{
  const scene=fakeScene();
  const method=makePrelude(addMenuButton,destroyMenuButton,addCuboBroadcastFrame,
    ()=>({title:'TRAIÇÃO',lines:['Submissão'],fullBrazil:false}),960,540);
  method.call(scene);
  const interactive=scene.objects.filter(o=>o.events.pointerdown);
  assert.equal(interactive.length,2);
  press(interactive[1]);
  assert.equal(scene.combatStarted,undefined);
  assert.deepEqual(scene.navigation,{key:'EndingScene',args:{campaign:scene.finaleCampaign,won:false}});
  assert.ok(scene.objects.every(o=>o.destroyed));
});

test('rota Full Brazil tem apenas a opção de combate e descarta suas peças',()=>{
  const scene=fakeScene();
  const method=makePrelude(addMenuButton,destroyMenuButton,addCuboBroadcastFrame,
    ()=>({title:'ÚLTIMO CONFRONTO',lines:['Sozinhos'],fullBrazil:true}),960,540);
  method.call(scene);
  const interactive=scene.objects.filter(o=>o.events.pointerdown);
  assert.equal(interactive.length,1);
  press(interactive[0]);
  assert.ok(scene.objects.every(o=>o.destroyed));
});
