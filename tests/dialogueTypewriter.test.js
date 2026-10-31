import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDialogueTypewriter} from '../src/ui/dialogueTypewriter.js';
import {INTRO_CHAR_DELAY_MS} from '../src/gameplay/introScript.js';

function setup(){
  const calls=[],events=[],sounds=[];
  const scene={time:{addEvent(options){
    events.push(options);
    return {remove(){this.removed=true;},removed:false};
  }}};
  const target={text:'',setText(value){this.text=value;calls.push(value);return this;}};
  const typer=createDialogueTypewriter(scene,{delay:INTRO_CHAR_DELAY_MS,
    onCharacter:letter=>sounds.push(letter)});
  const tick=()=>events.at(-1).callback();
  return {calls,events,sounds,target,typer,tick};
}
test('letras da fala surgem uma a uma, usando velocidade da introdução',()=>{
  const s=setup(),completed=[];
  s.typer.start(s.target,'Olá, Zeca!\n',{onComplete:()=>completed.push(true)});
  assert.equal(s.target.text,'');
  assert.equal(s.events[0].delay,INTRO_CHAR_DELAY_MS);
  s.tick();
  assert.equal(s.target.text,'O');
  s.tick();s.tick();s.tick();
  assert.equal(s.target.text,'Olá,');
  assert.deepEqual(s.sounds,['O','l','á',',']);
  for(let i=4;i<Array.from('Olá, Zeca!\n').length;i++)s.tick();
  assert.equal(s.target.text,'Olá, Zeca!\n');
  assert.equal(s.typer.typing,false);
  assert.deepEqual(completed,[true]);
  assert.equal(s.events[0].callback instanceof Function,true);
});
test('primeiro clique completa a fala sem disparar todos os sons; segundo avança',()=>{
  const s=setup();let done=0;
  s.typer.start(s.target,'General de guerra!',{onComplete:()=>done++});
  s.tick();s.tick();
  assert.equal(s.typer.complete(),true);
  assert.equal(s.target.text,'General de guerra!');
  assert.equal(s.sounds.length,2);
  assert.equal(done,1);
  assert.equal(s.typer.complete(),false);
  assert.equal(done,1);
});
test('troca de personagem cancela timer antigo e impede texto e áudio atrasados',()=>{
  const s=setup(),finished=[];
  s.typer.start(s.target,'Linha antiga',{onComplete:()=>finished.push('antiga')});
  const previous=s.events.at(-1);
  s.typer.start(s.target,'Nova linha',{onComplete:()=>finished.push('nova')});
  assert.equal(s.target.text,'');
  previous.callback();
  assert.equal(s.target.text,'');
  assert.deepEqual(s.sounds,[]);
  s.typer.cancel();
  assert.equal(s.typer.typing,false);
  assert.deepEqual(finished,[]);
});
test('boteco conecta digitação a Zeca, propostas e aceite sem alterar upgrades',()=>{
  const src=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');
  assert.match(src,/this\.dialogueTyper\.start\(this\.botecoLine,line/);
  assert.match(src,/if\(this\.dialogueTyper\?\.complete\(\)\)return/);
  assert.match(src,/this\.dialogueTyper\.start\(this\.flavorText/);
  assert.match(src,/representativeStoryFor\(id,this\.completedWave\+1\)/);
  assert.match(src,/representativeLine\(id,'accepted'\)/);
  assert.match(src,/keydown-SPACE/);
  assert.match(src,/this\.events\.once\('shutdown',\(\)=>this\.dialogueTyper\?\.cancel\(\)\)/);
  assert.match(src,/chooseArmamentUpgrade\(this\.campaign,id,this\.selectedTrack\)/);
});

