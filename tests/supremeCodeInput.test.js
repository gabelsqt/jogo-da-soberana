import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SUPREME_CODES, supremeCodeFor, advanceSupremeCode}
  from '../src/gameplay/supremeCodeInput.js';

const gameSource=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

// Exercita exatamente os métodos do GameScene sem inicializar Phaser/browser.
const a=gameSource.indexOf('  supremeExpectedCode() {');
const z=gameSource.indexOf('  // Storyboards temporários',a);
assert.ok(a>=0&&z>a,'métodos do protocolo disponíveis');
const SupremeMethods=new Function('supremeCodeFor','advanceSupremeCode','W','H',
  'return class SupremeMethods {'+gameSource.slice(a,z)+'}')(
    supremeCodeFor,advanceSupremeCode,960,540);

function scene(country='br',elapsed=26000){
  const prompts=[],activated=[];
  const s={
    combat:{ultimate:country},isV1Campaign:true,elapsed,waveDurationMs:30000,
    ultimateUsed:false,tutorialComplete:false,countdownActive:false,supremeCinematic:false,
    supremeTyping:false,supremeCode:'',supremeTimeScales:null,
    lastSupremeNotReadyAt:-Infinity,
    time:{timeScale:1,now:30000},tweens:{timeScale:1},
    supremePrompt:null,
    supremeReadyHint:{setVisible(v){this.visible=v}},
    warnings:[],
    showAttackWarning(w){this.warnings.push(w)},
    activateUltimate(){activated.push(country);return true},
    add:{text(_x,_y,text){
      const prompt={
        text,setOrigin(){return this},setDepth(){return this},
        setText(v){this.text=v;return this},
        setColor(v){this.color=v;return this},
        destroy(){this.destroyed=true},
      };
      prompts.push(prompt);
      return prompt;
    }},
  };
  Object.setPrototypeOf(s,SupremeMethods.prototype);
  return {s,prompts,activated};
}
const event=(key,opts={})=>({
  key,code:key===' '?'Space':'Key'+key.toUpperCase(),
  repeat:false,ctrlKey:false,metaKey:false,altKey:false,
  preventDefault(){this.prevented=true},...opts,
});

test('códigos oficiais podem ser digitados por completo sem reinício ou pausa',()=>{
  for(const [country,word] of Object.entries(SUPREME_CODES)){
    const {s,prompts,activated}=scene(country);
    assert.equal(s.openSupremeCode(),true);
    assert.equal(s.time.timeScale,0);
    assert.equal(s.tweens.timeScale,0);
    assert.ok(prompts[0].text.includes('\nDIGITE: _'));
    for(const letter of word)s.handleSupremeCodeKey(event(letter.toLowerCase()));
    assert.deepEqual(activated,[country],country);
    assert.equal(s.supremeTyping,false);
    assert.equal(s.time.timeScale,1);
    assert.equal(s.tweens.timeScale,1);
    assert.equal(prompts[0].destroyed,true);
  }
});

test('R, F e P são letras normais durante o Supremo (REVEILLON, FREEDOM, SPUTNIK)',()=>{
  for(const word of ['REVEILLON','FREEDOM','SPUTNIK']){
    let current='',complete=false;
    for(const key of word){
      const next=advanceSupremeCode(current,key.toLowerCase(),word);
      current=next.code;complete=next.completed;
      assert.equal(next.invalid,false);
    }
    assert.equal(current,word);
    assert.equal(complete,true);
  }
});

test('palavra errada não dispara Supremo e pode ser corrigida com Backspace',()=>{
  const {s,activated}=scene('us');
  s.openSupremeCode();
  for(const key of 'FREX')s.handleSupremeCodeKey(event(key));
  assert.equal(s.supremeCode,'FREX');
  assert.equal(s.supremePrompt.color,'#ffd4aa');
  assert.deepEqual(activated,[]);
  s.handleSupremeCodeKey(event('Backspace',{code:'Backspace'}));
  assert.equal(s.supremeCode,'FRE');
  for(const key of 'EDOM')s.handleSupremeCodeKey(event(key));
  assert.deepEqual(activated,['us']);
});

test('Escape cancela o protocolo e restaura tempo sem executar Supremo',()=>{
  const {s,activated}=scene('ru');
  s.openSupremeCode();
  s.handleSupremeCodeKey(event('s'));
  s.handleSupremeCodeKey(event('Escape',{code:'Escape'}));
  assert.equal(s.supremeTyping,false);
  assert.equal(s.time.timeScale,1);
  assert.equal(s.tweens.timeScale,1);
  assert.deepEqual(activated,[]);
});

test('disponível apenas nos 5 s finais; antes disso há feedback sem reinício',()=>{
  const {s}=scene('br',24000);
  assert.equal(s.openSupremeCode(),false);
  assert.equal(s.warnings.length,1);
  assert.equal(s.time.timeScale,1);
  s.elapsed=25000;
  assert.equal(s.openSupremeCode(),true);
  s.closeSupremeCode();
});

test('teclas não autorizadas e modificadores não introduzem caracteres',()=>{
  assert.equal(advanceSupremeCode('R','ArrowLeft','REVEILLON').code,'R');
  assert.equal(advanceSupremeCode('RE',' ','REVEILLON').code,'RE');
  assert.equal(advanceSupremeCode('','Escape','ENCORE').cancelled,true);
  assert.equal(supremeCodeFor('not-a-country'),null);
});

test('sem hotkeys de reinício durante partida ou ações para letras do protocolo',()=>{
  const i=gameSource.indexOf('// Um único despachante de teclado:');
  const j=gameSource.indexOf('if (import.meta.env.DEV',i);
  const handler=gameSource.slice(i,j);
  assert.ok(i>0&&j>i);
  assert.doesNotMatch(handler,/keydown-R|keydown-F|scene\.restart|keydown-P|keydown-ESC/);
  assert.match(handler,/if\(this\.supremeTyping\)/);
  assert.match(handler,/this\.handleSupremeCodeKey\(event\)/);
  assert.match(handler,/event\.code==='KeyP'/);
  assert.match(gameSource,/if \(this\.supremeTyping\) return;/);
  assert.match(gameSource,/supremeReadyHint\.setVisible/);
});
