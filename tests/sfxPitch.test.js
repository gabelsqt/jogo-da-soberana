import test from 'node:test';
import assert from 'node:assert/strict';
import {randomSfxPlaybackRate,randomSfxVolumeScale,randomSfxRange,SFX_PITCH_RANGES,SFX_VARIATIONS} from '../src/audio/sfx.js';
test('pitch variation remains within configured bounds',()=>{
  for(const [id,[low,high]] of Object.entries(SFX_PITCH_RANGES)){
    assert.equal(randomSfxPlaybackRate(id,()=>0),low);
    assert.equal(randomSfxPlaybackRate(id,()=>1),high);
    assert.ok(low>=0.75&&high<=1.25);
    assert.ok(randomSfxPlaybackRate(id,()=>0.5)>=low);
  }
  assert.equal(randomSfxPlaybackRate('ruBasicShot',()=>0),0.96);
  assert.equal(randomSfxPlaybackRate('ruBasicShot',()=>1),1.04);
  assert.equal(randomSfxPlaybackRate('krBasicShot',()=>0),0.84);
  assert.equal(randomSfxPlaybackRate('krBasicShot',()=>1),1.16);
  assert.equal(randomSfxPlaybackRate('krBasicShot',()=>0.5),1);
  assert.equal(randomSfxPlaybackRate('introKey',()=>0),0.88);
  assert.equal(randomSfxPlaybackRate('introKey',()=>1),1.14);
  assert.equal(randomSfxPlaybackRate('upgrade',()=>0),1);
  assert.equal(randomSfxPlaybackRate('shieldHit',()=>1),1);
});

test('generic per-effect volume profiles and default behavior',()=>{
  for(const [id,variation] of Object.entries(SFX_VARIATIONS)){
    const [low,high]=variation.volume;
    assert.equal(randomSfxVolumeScale(id,()=>0),low);
    assert.equal(randomSfxVolumeScale(id,()=>1),high);
    assert.ok(low<=1&&high>=1);
  }
  assert.equal(randomSfxVolumeScale('upgrade',()=>0.4),1);
  assert.equal(randomSfxRange([0.7,1.3],()=>0.5),1);
  assert.throws(()=>randomSfxRange([2,1]),RangeError);
});
