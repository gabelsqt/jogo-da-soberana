import test from 'node:test';
import assert from 'node:assert/strict';
import {
  discoReflectionArcPoints,discoReflectionLaserPoints,animateDiscoReflectionArcs,
  DISCO_REFLECTION_MAX_VISUAL_RAYS,DISCO_REFLECTION_TRAVEL_MS,
} from '../src/gameplay/discoReflectionVfx.js';

test('curva clássica do globo restaurada: arco bem acima da linha direta',()=>{
  const points=discoReflectionArcPoints(360,370,95,90,0,24);
  assert.deepEqual(points[0],{x:360,y:370});
  assert.deepEqual(points.at(-1),{x:95,y:90});
  assert.ok(points[12].y<(370+90)/2-20);
  assert.equal(points.length,25);
  assert.deepEqual(discoReflectionLaserPoints(360,370,95,90,0,24),points);
  assert.ok(DISCO_REFLECTION_TRAVEL_MS>=200);
});
test('arcos apresentam caminhos distintos para reflexos diferentes',()=>{
  const a=discoReflectionArcPoints(370,310,100,95,0);
  const b=discoReflectionArcPoints(370,310,100,95,2);
  assert.notDeepEqual(a,b);
  assert.deepEqual(a,discoReflectionArcPoints(370,310,100,95,0));
});
test('ramificações extras são estéticas: só uma Graphics e um tween por salva',()=>{
  const seen=[],tweens=[];
  function makeGraphics(){
    const g={destroyed:false,branches:0,
      clear(){return this;},fillStyle(){return this;},fillCircle(){return this;},
      fillRect(){return this;},lineStyle(){return this;},strokeCircle(){return this;},
      beginPath(){return this;},moveTo(){return this;},lineTo(){return this;},
      strokePath(){return this;},setDepth(){return this;},
      lineBetween(){this.branches++;return this;},
      destroy(){this.destroyed=true;}};
    seen.push(g);return g;
  }
  const scene={add:{graphics:makeGraphics},
    tweens:{add(opts){tweens.push(opts);
      opts.targets.progress=.7;opts.onUpdate?.();
      opts.targets.progress=1;opts.onUpdate?.();opts.onComplete?.();
    }},
  };
  animateDiscoReflectionArcs(scene,300,310,
    Array.from({length:DISCO_REFLECTION_MAX_VISUAL_RAYS+7},(_,i)=>({x:50+i*30,y:60})));
  assert.equal(seen.length,1);
  assert.equal(tweens.length,1);
  assert.ok(seen[0].branches>0,'arcos secundários e descargas visíveis');
  assert.equal(seen[0].destroyed,true);
  animateDiscoReflectionArcs(scene,300,310,[]);
  assert.equal(seen.length,1);
});
