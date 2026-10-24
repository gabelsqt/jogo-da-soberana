import test from 'node:test';
import assert from 'node:assert/strict';
import {dawnLayerAlphas,DAWN_FILES,DAWN_DURATION_MS} from '../src/gameplay/dawnTransition.js';
test('original night remains until ten seconds before the wave ends',()=>{
  assert.equal(DAWN_DURATION_MS,10000);
  assert.deepEqual(dawnLayerAlphas(20000),[0,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(10000),[0,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(8750),[0.5,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(7500),[1,0,0,0]);
  assert.deepEqual(dawnLayerAlphas(5000),[1,1,0,0]);
  assert.deepEqual(dawnLayerAlphas(2500),[1,1,1,0]);
  assert.deepEqual(dawnLayerAlphas(0),[1,1,1,1]);
  assert.equal(DAWN_FILES.length,4);
});
