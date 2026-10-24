import test from 'node:test';
import assert from 'node:assert/strict';
import { createTvStaticSound } from '../src/audio/tvStatic.js';

test('chiado respeita volume/silêncio e libera seus três nós ao encerrar', () => {
  let stopped=0, disconnected=0, level=0;
  const node=()=>({connect(){},disconnect(){disconnected++;}});
  const scene={music:{volume:0.5,muted:false},sound:{context:{
    state:'running',sampleRate:100,currentTime:1,
    createBuffer:()=>({getChannelData:()=>new Float32Array(50)}),
    createBufferSource:()=>({...node(),start(){},stop(){stopped++;}}),
    createBiquadFilter:()=>({...node(),frequency:{},Q:{}}),
    createGain:()=>({...node(),gain:{setTargetAtTime(v){level=v;}}}),
  }}};
  const sound=createTvStaticSound(scene);
  sound.update(1);assert.equal(level,0.11);
  scene.music.muted=true;sound.update(1);assert.equal(level,0);
  sound.destroy();sound.destroy();assert.equal(stopped,1);assert.equal(disconnected,3);
});
