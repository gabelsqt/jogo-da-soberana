import test from 'node:test';
import assert from 'node:assert/strict';
import {
  discoReflectionLaserPoints,animateDiscoReflectionArcs,
  DISCO_REFLECTION_MAX_VISUAL_RAYS,
} from '../src/gameplay/discoReflectionVfx.js';

test('laser começa no globo, termina no alvo e é quase reto',()=>{
  const points=discoReflectionLaserPoints(360,370,95,90,0,24);
  assert.deepEqual(points[0],{x:360,y:370});
  assert.deepEqual(points.at(-1),{x:95,y:90});
  assert.ok(Math.abs(points[12].y-230)<=4);
  assert.ok(Math.abs(points[12].x-227.5)<=4);
  assert.equal(points.length,25);
});
test('variações de direção usam caminhos distintos e determinísticos',()=>{
  const a=discoReflectionLaserPoints(370,310,100,95,0);
  const b=discoReflectionLaserPoints(370,310,100,95,2);
  assert.notDeepEqual(a,b);
  assert.deepEqual(a,discoReflectionLaserPoints(370,310,100,95,0));
});
test('salva de reflexos é agrupada visualmente e destruída após animar',()=>{
  const seen=[];
  function makeGraphics(){
    const g={destroyed:false,clear(){return this;},fillStyle(){return this;},
      fillCircle(){return this;},fillRect(){return this;},
      lineStyle(){return this;},strokeCircle(){return this;},
      beginPath(){return this;},moveTo(){return this;},lineTo(){return this;},lineBetween(){return this;},
      strokePath(){return this;},setDepth(){return this;},
      destroy(){this.destroyed=true;}};
    seen.push(g);return g;
  }
  const scene={add:{graphics:makeGraphics},
    tweens:{add({targets,onUpdate,onComplete}){
      if('intensity' in targets){targets.intensity=0;onUpdate?.();}
      onComplete?.();
    }},
  };
  animateDiscoReflectionArcs(scene,300,310,
    Array.from({length:DISCO_REFLECTION_MAX_VISUAL_RAYS+7},(_,i)=>({x:50+i*30,y:60})));
  assert.equal(seen.length,1);
  assert.equal(seen[0].destroyed,true);
  animateDiscoReflectionArcs(scene,300,310,[]);
  assert.equal(seen.length,1);
});
