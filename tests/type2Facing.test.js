import test from 'node:test';
import assert from 'node:assert/strict';
import {type2FacingAngle,steerType2Rotation} from '../src/gameplay/type2Facing.js';
test('type 2 points toward travel',()=>{
  assert.ok(Math.abs(type2FacingAngle(0,-100))<1e-9);
  assert.ok(Math.abs(type2FacingAngle(100,0)-Math.PI/2)<1e-9);
  assert.ok(Math.abs(type2FacingAngle(-100,0)+Math.PI/2)<1e-9);
  assert.ok(Math.abs(type2FacingAngle(0,100)-Math.PI)<1e-9);
  assert.equal(type2FacingAngle(0,0),0);
});
test('type 2 gradually returns upright',()=>{
 const turning=steerType2Rotation(0,100,0,0.016);
 assert.ok(turning>0&&turning<Math.PI/2);
 let angle=Math.PI/2;
 for(let i=0;i<45;i++)angle=steerType2Rotation(angle,0,0,0.016);
 assert.ok(Math.abs(angle)<0.01);
});
