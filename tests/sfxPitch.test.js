import test from 'node:test';
import assert from 'node:assert/strict';
import {randomSfxPlaybackRate,SFX_PITCH_RANGES} from '../src/audio/sfx.js';
test('pitch variation stays subtly near original',()=>{
  for(const [id,[low,high]] of Object.entries(SFX_PITCH_RANGES)){
    assert.equal(randomSfxPlaybackRate(id,()=>0),low);
    assert.equal(randomSfxPlaybackRate(id,()=>1),high);
    assert.ok(low>=0.9&&high<=1.1);
    assert.ok(randomSfxPlaybackRate(id,()=>0.5)>=low);
  }
  assert.equal(randomSfxPlaybackRate('upgrade',()=>0),1);
  assert.equal(randomSfxPlaybackRate('shieldHit',()=>1),1);
});
