import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MUSIC,waveMusic,MusicPlayer} from '../src/audio/music.js';

const intro=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('Cubo News toca apenas uma vez e sem loop nos plantões da introdução',()=>{
  const from=intro.indexOf('  show(index){');
  const end=intro.indexOf('  drawEmail(slide){',from);
  assert.ok(from>=0&&end>from,'método de slides da introdução');
  const show=new Function('INTRO_NEWS_HOLD_MS','playSfx',
    'return ({'+intro.slice(from,end)+'}).show')(5200,()=>{});
  const played=[],stopped=[];
  const music={
    key:null,
    play(key,options){played.push({key,options});this.key=key;},
    stop(){stopped.push(this.key);this.key=null;},
  };
  const fake={
    finished:false,slides:[
      {kind:'email'},{kind:'news'},{kind:'news'},{kind:'email'},
    ],music,stopTimers(){},clearSlide(){},
    progressHint:{setText(){}},
    time:{delayedCall(){return {remove(){}};}},
    drawNews(){},drawEmail(){this.body={};},
    drawZeca(){},beginTyping(){},
  };
  show.call(fake,1);
  show.call(fake,1); // Reentrada acidental no primeiro plantão não reinicia o áudio.
  show.call(fake,2);
  assert.deepEqual(played,[{key:'news',options:{loop:false}}]);
  assert.equal(stopped.length,0,'vinheta continua uma vez durante os plantões');
  show.call(fake,3);
  assert.deepEqual(stopped,['news'],'vinheta é encerrada quando acaba a notícia');
  assert.match(intro,/this\.newsThemePlayed=false/);
});

test('ondas e noticiário final nunca reativam tema da Cubo News',()=>{
  assert.doesNotMatch(game,/this\.music\.play\('news'/);
  const countdown=game.slice(game.indexOf('  startWaveCountdown() {'),
    game.indexOf('  createSupportTowers() {'));
  assert.match(countdown,/this\.music\.play\(waveMusic\(this\.mode, this\.campaign\)\)/);
  assert.equal(waveMusic('wave0'),'early');
  assert.equal(waveMusic('wave11',{choices:['jp']}),'jp');
  assert.match(game,/  showFinalePrelude\(\) \{/);
  assert.ok(MUSIC.news.endsWith('.mp3'),'arquivo permanece disponível para a intro');
});

test('vinheta curta não recomeça com teclas ou cliques após terminar',async()=>{
  const audios=[];
  const doc=new EventTarget();
  doc.hidden=false;
  const player=new MusicPlayer({document:doc,createAudio(){
    const audio={ended:false,paused:true,plays:0,
      addEventListener(){},load(){},removeAttribute(){},
      pause(){this.paused=true;},play(){this.plays++;this.paused=false;return Promise.resolve();},
    };
    audios.push(audio);return audio;
  }});
  player.play('news',{loop:false});
  await new Promise(resolve=>setImmediate(resolve));
  audios[0].ended=true;audios[0].paused=true;
  doc.dispatchEvent(new Event('pointerdown'));
  doc.dispatchEvent(new Event('keydown'));
  assert.equal(audios[0].plays,1);
  player.destroy();
});
