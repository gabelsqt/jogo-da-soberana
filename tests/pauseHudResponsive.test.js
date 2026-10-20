import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { pauseButtonTop, mountPauseHudButton } from '../src/ui/pauseHudButton.js';

function fakeElement(rect={top:0,height:540}){
  const events=new EventEmitter();
  return {
    isConnected:true,hidden:false,style:{},
    events,removeCalled:false,
    getBoundingClientRect:()=>({...rect}),
    appendChild(child){this.child=child;child.isConnected=true;},
    setAttribute(key,value){this[key]=value;},
    addEventListener:(name,callback)=>events.on(name,callback),
    removeEventListener:(name,callback)=>events.off(name,callback),
    remove(){this.removeCalled=true;this.isConnected=false;},
  };
}

function setup({viewportTop=0,viewportHeight=800,broadcastTop=80,safeTop=0}={}){
  const root=fakeElement({top:viewportTop,height:viewportHeight});
  const broadcast=fakeElement({top:broadcastTop,height:540});
  const button=fakeElement();
  const winEvents=new EventEmitter(),visualEvents=new EventEmitter();
  const win={
    getComputedStyle:()=>({paddingTop:safeTop+'px'}),
    addEventListener:(name,fn)=>winEvents.on(name,fn),
    removeEventListener:(name,fn)=>winEvents.off(name,fn),
    visualViewport:{
      addEventListener:(name,fn)=>visualEvents.on(name,fn),
      removeEventListener:(name,fn)=>visualEvents.off(name,fn),
    },
  };
  const doc={
    getElementById:id=>id==='viewport'?root:id==='broadcast'?broadcast:null,
    createElement:()=>button,
  };
  const events=new EventEmitter(),gameEvents=new EventEmitter(),scale=new EventEmitter();
  let paused=false,active=true,clicks=0;
  const scene={
    events,game:{events},scale,
    scene:{isActive:()=>active,isPaused:()=>paused},
  };
  mountPauseHudButton(scene,()=>{clicks++;paused=true;events.emit('pause');},{doc,win});
  return {
    root,broadcast,button,events,gameEvents,scale,winEvents,visualEvents,
    get clicks(){return clicks;},
    resume(){paused=false;events.emit('resume');},
    click(){button.events.emit('click',{stopPropagation(){},preventDefault(){}});},
  };
}

test('botão nunca ultrapassa o topo visível mesmo se canvas estiver deslocado',()=>{
  assert.equal(pauseButtonTop({viewportTop:0,viewportHeight:940,broadcastTop:-25}),16);
  assert.equal(pauseButtonTop({viewportTop:10,viewportHeight:900,broadcastTop:90}),96);
  assert.equal(pauseButtonTop({viewportTop:0,viewportHeight:540,broadcastTop:0,safeTop:28}),44);
  assert.equal(pauseButtonTop({viewportTop:0,viewportHeight:110,broadcastTop:900}),52);
});

test('pausar fica independente da câmera, esconde e aparece ao retomar',()=>{
  const ui=setup({viewportTop:0,viewportHeight:900,broadcastTop:-20});
  assert.equal(ui.button.style.top,'16px');
  assert.equal(ui.root.child,ui.button);
  assert.equal(ui.button.textContent,'Ⅱ  PAUSAR [P]');
  assert.equal(ui.button.getAttribute?.('aria-label')??ui.button['aria-label'],
    'Pausar jogo (tecla P ou Esc)');
  ui.click();
  assert.equal(ui.clicks,1);
  assert.equal(ui.button.hidden,true);
  ui.click(); // não chama pause de novo durante a pausa
  assert.equal(ui.clicks,1);
  ui.resume();
  assert.equal(ui.button.hidden,false);
  assert.equal(ui.button.style.top,'16px');
  ui.events.emit('shutdown');
  assert.equal(ui.button.removeCalled,true);
  assert.equal(ui.winEvents.listenerCount('resize'),0);
  assert.equal(ui.visualEvents.listenerCount('resize'),0);
  assert.equal(ui.scale.listenerCount('resize'),0);
});

test('reposiciona com resize, safe area e alternância Cubo News',()=>{
  const ui=setup({viewportHeight:850,broadcastTop:75,safeTop:24});
  assert.equal(ui.button.style.top,'91px');
  ui.broadcast.getBoundingClientRect=()=>({top:-100,height:540});
  ui.winEvents.emit('resize');
  assert.equal(ui.button.style.top,'40px');
  ui.gameEvents.emit('cubo-layout-change');
  assert.equal(ui.button.style.top,'40px');
  ui.events.emit('shutdown');
});

test('GameScene mantém P/Esc e não desenha pausa sobre câmera quando DOM existe',()=>{
  const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(source,/mountPauseHudButton\(this,\(\)=>this\.pauseGame\(\)\)/);
  assert.match(source,/this\.input\.keyboard\.on\('keydown',/);
  assert.match(source,/event\.code==='Escape'\|\|event\.code==='KeyP'/);
  assert.doesNotMatch(source,/keydown-P|keydown-ESC/);
  assert.match(source,/if\(!pauseButton\)/);
});
