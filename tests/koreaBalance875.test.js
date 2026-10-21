import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
import {SFX_FILES,SFX_VARIATIONS} from '../src/audio/sfx.js';

test('todos os estágios coreanos ganham 20% por salva, preservando raios',()=>{
  for(const [level,previous,beams] of [[2,6,3],[4,12,6],[6,22,12],[8,36,24]]){
    const cfg=v1SpecialConfig({choices:Array(level).fill('jp')});
    assert.equal(cfg.krReflections,beams);
    assert.ok(Math.abs(cfg.krSalvoDamage-previous*1.2)<1e-9);
    assert.ok(Math.abs(cfg.krReflectDamage*beams-cfg.krSalvoDamage)<1e-9);
  }
});
test('som do laser principal é dedicado e usa variação reutilizável de pitch',()=>{
  assert.match(SFX_FILES.krBasicShot,/kr_tiro_laser_v2\.wav/);
  assert.deepEqual(SFX_VARIATIONS.krBasicShot.pitch,[0.84,1.16]);
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(game,/if\(this\.isV1Campaign&&this\.combat\.plasmaEvery>0\)\s*\/\/[^\n]*\n\s*\/\/[^\n]*\n\s*playSfx\('krBasicShot',\{throttle:70,volumeScale:0\.72\}\)/);
  const sfx=readFileSync(new URL('../src/audio/sfx.js',import.meta.url),'utf8');
  assert.match(sfx,/sound\.playbackRate=randomSfxPlaybackRate\(id\)/);
  assert.match(sfx,/id==='krBasicShot'/);
});
