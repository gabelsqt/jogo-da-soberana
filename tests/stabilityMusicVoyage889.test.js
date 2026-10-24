import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MusicPlayer,MUSIC,waveMusic} from '../src/audio/music.js';
import {cannonSpritePose} from '../src/gameplay/cannonSpriteAim.js';
import {fullBrazilVoyageEligible,VOYAGE_STOPS,voyageEvents,voyageCanDepart} from '../src/gameplay/fullBrazilVoyage.js';
import {getFinalWaveEvents} from '../src/gameplay/waves.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';
import {hexShieldCells} from '../src/gameplay/hexShieldDome.js';

const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const hud=readFileSync(new URL('../src/audio/music.js',import.meta.url),'utf8');
const sleep=()=>new Promise(resolve=>setImmediate(resolve));

test('boca do canhão do sprite recebe o flash, em qualquer mira',()=>{
  const a=cannonSpritePose(-Math.PI/2,480,483,0);
  const b=cannonSpritePose(-Math.PI*.75,480,483,0);
  assert.ok(a.muzzleY<483-30);
  assert.ok(b.muzzleX<480);
  const begin=game.indexOf('  showMuzzleFlash(angle');
  const end=game.indexOf('  russianBreathMuzzle(',begin);
  assert.ok(begin>=0&&end>begin);
  const method=game.slice(begin,end);
  assert.match(method,/cannonSpritePose\(angle,CANNON\.x,CANNON\.y-11,this\.cannonRecoil\)/);
  assert.match(method,/const x = muzzle\?\.muzzleX/);
  assert.match(method,/const y = muzzle\?\.muzzleY/);
  assert.doesNotMatch(method,/Math\.cos\(angle\) \* 34/);
});

test('full Brazil wave11 laboratório nível 10 não tem chefe Tipo 6 e é muito mais densa',()=>{
  const br={choices:Array(10).fill('br')};
  assert.equal(fullBrazilVoyageEligible('wave11',br,{playtest:true}),true);
  assert.equal(getFinalWaveEvents('wave11',br).some(e=>e.type===6),false);
  assert.deepEqual(VOYAGE_STOPS.map(stop=>stop.events),[24,28,32,36]);
  for(let i=0;i<VOYAGE_STOPS.length;i++){
    const waves=voyageEvents(i);
    assert.equal(waves.length,VOYAGE_STOPS[i].events);
    assert.ok(waves.every((e,j)=>j===0||e.at>waves[j-1].at));
    assert.ok(waves.every(e=>e.type<=5));
    assert.ok(waves.filter(e=>e.type===1&&e.count>=8).length>=3);
    assert.equal(voyageCanDepart({
      elapsed:waves.at(-1).at+4000,scheduled:waves.length,spawned:waves.length-1,
      enemies:0,hostileShots:0,portals:0,lastAt:waves.at(-1).at,
    }),false);
  }
  assert.match(game,/this\.voyageActive\s*\?voyageEvents\(this\.voyageIndex\)/);
});

test('Onda 11 EUA nível 10 mantém chefe nacional, sem entrar na viagem Full Brazil',()=>{
 const us={choices:Array(10).fill('us')};
 const br={choices:Array(10).fill('br')};
 assert.equal(fullBrazilVoyageEligible('wave11',us,{playtest:true}),false);
 const bosses=getFinalWaveEvents('wave11',us).filter(e=>e.type===6);
 assert.equal(bosses.length,1);
 assert.equal(bosses[0].bossCountry,'us');
 assert.ok(v1CombatStats(us).usRocketRadius>0);
 assert.equal(waveMusic('wave11',us),'us');
 assert.equal(waveMusic('wave11',br),'brazilFinal');
 assert.match(game,/this\.boss6IntroPaused=!this\.voyageActive/);
 assert.match(game,/this\.time\.delayedCall\(5300,\(\)=>\{/);
});

test('HUD e hexágonos não recalculam conteúdo desnecessário a cada frame',()=>{
 assert.match(game,/if\(this\.hexShieldTransition==='active' &&/);
 assert.match(game,/this\.lastHexShieldDrawAt=this\.time\.now/);
 assert.match(game,/this\.updateHudText\(this\.tutorialText,/);
 assert.doesNotMatch(game,/this\.tutorialText\.setText\(\s*'ALIADOS: '/);
 assert.match(game,/this\.updateHudText\(title,'VOO ESPACIAL/);
 const mesh=hexShieldCells();
 assert.equal(hexShieldCells(),mesh,'malha cacheada por geometria');
 assert.ok(Object.isFrozen(mesh));
 assert.ok(Object.isFrozen(mesh[0].points));
});

function musicFixture(saved=null){
 const memory=new Map([['soberania-music-v1',saved?JSON.stringify(saved):'null']]);
 const storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 const doc=new EventTarget();doc.hidden=false;
 const events=new Map();const audios=[];
 const createAudio=()=>{
   const audio={paused:true,ended:false,muted:false,volume:0,plays:0,
     addEventListener(name,fn){events.set(name,fn);},
     load(){this.loaded=true;},removeAttribute(){},
     pause(){this.paused=true;},
     play(){this.plays++;this.paused=false;events.get('playing')?.();return Promise.resolve();},
   };
   audios.push(audio);return audio;
 };
 return {p:new MusicPlayer({createAudio,storage,document:doc}),audios,storage,doc};
}
test('músicas salvas no mudo podem ser restauradas explicitamente pelo usuário',async()=>{
 const {p,audios}=musicFixture({muted:true,volume:0});
 p.play('menu');
 assert.equal(p.muted,true);
 assert.equal(p.volume,0);
 assert.equal(audios[0].paused,true);
 p.restoreAudible();await sleep();
 assert.equal(p.muted,false);
 assert.equal(p.volume,.4);
 assert.equal(p.status,'tocando');
 assert.equal(audios[0].paused,false);
 assert.equal(audios[0].src,'./assets/musicas/'+MUSIC.menu);
 assert.equal(audios[0].preload,'auto');
 p.destroy();
});

test('controle mostra situação do áudio e permite testar/reabilitar música',()=>{
 assert.match(hud,/▶ TESTAR/);
 assert.match(hud,/music\.restoreAudible\(\);refresh\(\)/);
 assert.match(hud,/ERRO DE ÁUDIO/);
 assert.match(hud,/REPRODUZINDO/);
 assert.match(hud,/MÚSICA: MUDO/);
 assert.match(hud,/statusTick\?\.remove\?\.\(\)/);
});
