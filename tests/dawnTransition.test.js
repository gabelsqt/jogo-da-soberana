import test from 'node:test';
import assert from 'node:assert/strict';
import {dawnLayerAlphas,DAWN_FILES} from '../src/gameplay/dawnTransition.js';
test('dawn advances from night to daylight over last five seconds',()=>{
  assert.deepEqual(dawnLayerAlphas(6000),[1,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(5000),[1,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(0),[1,1,1,1]);
  assert.deepEqual(dawnLayerAlphas(-100),[1,1,1,1]);
  assert.ok(Math.abs(dawnLayerAlphas(2500)[2]-0.5)<1e-9);
  assert.equal(DAWN_FILES.length,4);
});
