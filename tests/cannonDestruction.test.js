import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { createCannonDestruction, destructionState, failingAim } from '../src/ui/cannonDestruction.js';

test('controle e áudio cedem antes de linha, ponto e tela preta', () => {
  assert.equal(destructionState(0).control, 1);
  assert.equal(destructionState(2100).control, 0);
  assert.equal(destructionState(1900).gain, 0);
  assert.equal(destructionState(4000).collapse, 0);
  assert.equal(destructionState(4220).collapse, 1);
  assert.equal(destructionState(4370).line, 0);
  assert.equal(destructionState(4470).point, 0);
  assert.equal(destructionState(4699).done, false);
  assert.equal(destructionState(4700).done, true);
});
test('mira responde inicialmente e perde influência do mouse por completo', () => {
  assert.ok(failingAim(-1.5, -0.5, 0, 16) > -1.5);
  assert.equal(failingAim(-1.5, -0.5, 2200, 16), failingAim(-1.5, -2.5, 2200, 16));
  const result = fps => {
    let angle = -1.5;
    for (let ms = 0; ms < 2400; ms += 1000 / fps) angle = failingAim(angle, -0.8, ms, 1000 / fps);
    return angle;
  };
  assert.ok(Math.abs(result(30) - result(120)) < 0.03);
});
function fakeScene() {
  const children = [], captures = [];
  const makeCamera = () => ({ zoomX:1, zoomY:1, scrollX:0, scrollY:0,
    setZoom(x,y=x){this.zoomX=x;this.zoomY=y;return this;},
    setScroll(x,y){this.scrollX=x;this.scrollY=y;return this;},
    centerOn(x,y){this.scrollX=x-480;this.scrollY=y-270;return this;},
    getWorldPoint(x,y){return {x,y};},
    shake(){},shakeEffect:{reset(){}},
  });
  const object = () => {
    const o = { camera:makeCamera(), visible:true, destroy() { this.destroyed=true; },
      setVisible(v) { this.visible=v; return this; },
      draw(list) { captures.push([...list]); assert.ok(!list.includes(this)); return this; } };
    for (const name of ['setDepth','setInteractive','on','setAlpha','setOrigin','setPosition','setScale',
      'clear','lineStyle','strokeCircle','lineBetween','fillStyle','fillCircle','fillRect']) o[name]=()=>o;
    children.push(o); return o;
  };
  object();
  const scene = { children:{list:children}, events:new EventEmitter(),
    input:{keyboard:{enabled:true},activePointer:{x:600,y:100}},
    game:{canvas:{style:{cursor:'crosshair'}}},
    cameras:{main:makeCamera()},
    add:{rectangle:object,graphics:object,renderTexture:object},
    barrel:{rotation:0},aimAngle:-Math.PI/2,
    music:{audio:{},setGain(v){this.gain=v;},stop(){this.audio=null;}} };
  return {scene,captures};
}
test('captura e resultado ocorrem uma vez; entrada é restaurada', () => {
  const {scene,captures}=fakeScene(); let completed=0;
  const seq=createCannonDestruction(scene,{x:480,y:490,onComplete:()=>completed++});
  assert.equal(scene.input.keyboard.enabled,false);
  seq.update(20,{x:700,y:120});
  assert.ok(scene.cameras.main.zoomX > 1);
  for(let i=0;i<300;i++)seq.update(20,{x:700,y:120});
  assert.equal(scene.cameras.main.zoomX,1);
  assert.equal(scene.cameras.main.scrollY,0);
  assert.equal(captures.length,1); assert.equal(completed,1);
  assert.equal(scene.input.keyboard.enabled,true);
  assert.equal(scene.game.canvas.style.cursor,'crosshair');
  assert.equal(scene.events.listenerCount('shutdown'),0);
  assert.equal(scene.music.audio,null);
});
test('encerrar cena no meio restaura entrada sem abrir resultado', () => {
  const {scene}=fakeScene();
  createCannonDestruction(scene,{x:480,y:490,onComplete:()=>assert.fail('resultado antecipado')});
  scene.events.emit('shutdown');
  assert.equal(scene.input.keyboard.enabled,true);
  assert.equal(scene.game.canvas.style.cursor,'crosshair');
});
test('destruição tem sequência; timeout é direto; chamadas repetidas são ignoradas', () => {
  const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  const method=source.slice(source.indexOf("  showDefeat(reason='cannon') {"),source.indexOf('\n  beginCannonDestruction()'));
  const show=new Function(`return ({${method}}).showDefeat`)();
  let sequences=0,panels=0;
  const scene={tutorialComplete:false,beginCannonDestruction(){sequences++;this.tutorialComplete=true;},finishDefeat(){panels++;}};
  show.call(scene);show.call(scene);assert.equal(sequences,1);assert.equal(panels,0);
  scene.tutorialComplete=false;show.call(scene,'timeout');assert.equal(sequences,1);assert.equal(panels,1);
});
