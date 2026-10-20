import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { addMenuMusicControl, musicPlayer } from '../src/audio/music.js';

function object(kind,x,y){
  const emitter=new EventEmitter();
  const node=Object.assign(emitter,{kind,x,y,visible:true});
  for(const method of ['setStrokeStyle','setDepth','setInteractive','setOrigin',
    'setDisplaySize','setTint','setAlpha','setScale']){
    node[method]=function(){return this;};
  }
  node.setVisible=function(v){this.visible=v;return this;};
  node.setPosition=function(nx,ny){this.x=nx;this.y=ny;return this;};
  node.setText=function(v){this.text=v;return this;};
  return node;
}
function sceneMock(){
  const items=[],input=new EventEmitter(),events=new EventEmitter();
  return {items,input,events,add:{
    rectangle(x,y){const n=object('rectangle',x,y);items.push(n);return n;},
    text(x,y,value){const n=object('text',x,y);n.text=value;items.push(n);return n;},
    circle(x,y){const n=object('circle',x,y);items.push(n);return n;},
  }};
}
const leftClick={leftButtonDown:()=>true,x:188};
const event={stopPropagation(){}};

test('tela inicial expõe fundo do Rio sem moldura ou faixa Cubo News',()=>{
  const source=readFileSync(new URL('../src/scenes/MenuScene.js',import.meta.url),'utf8');
  assert.match(source,/drawRioBackdrop\(this\)/);
  assert.match(source,/addMenuMusicControl\(this/);
  assert.match(source,/COMEÇAR CAMPANHA/);
  assert.match(source,/TESTAR UPGRADES/);
  assert.doesNotMatch(source,/addCuboBroadcastFrame|addCuboPanel|addCuboPixelText/);
  assert.doesNotMatch(source,/this\.add\.rectangle\(W\/2,H\/2,W,H/);
  assert.match(source,/keydown-ENTER/);
  assert.match(source,/keydown-U/);
});

test('controle de música inicia fechado, abre slider e conserva mute e volume',()=>{
  const scene=sceneMock(),music=musicPlayer();
  const originalVolume=music.volume,originalMuted=music.muted;
  try{
    music.setVolume(0.4);if(music.muted)music.toggleMute();
    const control=addMenuMusicControl(scene,{x:91,y:518,depth:45});
    assert.equal(scene.items.length,10);
    assert.ok(scene.items.slice(2).every(o=>!o.visible));
    control.dock.emit('pointerdown',leftClick,0,0,event);
    assert.ok(scene.items.slice(2).every(o=>o.visible));
    const track=scene.items[5];
    assert.ok(track,'trilho de volume existente no painel');
    track.emit('pointerdown',{...leftClick,x:231},0,0,event);
    assert.equal(music.volume,1);
    scene.input.emit('pointermove',{leftButtonDown:()=>true,x:61});
    assert.equal(music.volume,0);
    scene.input.emit('pointerup');
    const mute=scene.items.at(-2);
    assert.ok(mute);
    mute.emit('pointerdown',leftClick,0,0,event);
    assert.equal(music.muted,true);
    control.dock.emit('pointerdown',leftClick,0,0,event);
    assert.ok(scene.items.slice(2).every(o=>!o.visible));
    scene.events.emit('shutdown');
    assert.equal(scene.input.listenerCount('pointermove'),0);
    assert.equal(scene.input.listenerCount('pointerup'),0);
  }finally{
    music.setVolume(originalVolume);
    if(music.muted!==originalMuted)music.toggleMute();
  }
});
