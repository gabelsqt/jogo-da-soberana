import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  introductionSlides,INTRO_CHAR_DELAY_MS,INTRO_PAGE_MS,INTRO_NEWS_HOLD_MS,
  INTRO_CONVOCATION_HOLD_MS,INTRO_ZECA_HOLD_MS,INTRO_FOOTNOTE_DELAY_MS,
} from '../src/gameplay/introScript.js';

test('ordem: convocação com asterisco, invasão, cancelamento, promoção e Zeca',()=>{
 const scenes=introductionSlides();
 assert.deepEqual(scenes.map(s=>s.id),
   ['convocation','invasion','elections','promotion','zeca-1','zeca-2','zeca-3']);
 assert.equal(scenes[0].kind,'email');
 assert.match(scenes[0].body,/MESÁRIO\*/);
 assert.doesNotMatch(scenes[0].body,/situações excepcionais|cláusula|guerra/i);
 assert.equal(scenes[1].kind,'news');
 assert.match(scenes[1].headline,/INVASÃO ALIENÍGENA/);
 assert.match(scenes[2].headline,/ELEIÇÕES SÃO CANCELADAS/);
 assert.equal(scenes[3].promotion,'GENERAL DE GUERRA');
 assert.match(scenes[3].footnote,/^\*Em situações excepcionais/);
 assert.match(scenes[3].footnote,/consentimento/);
 assert.match(scenes[3].status,/AUTOMATICAMENTE/);
 assert.match(scenes[4].body,/até ontem você era mesário/);
 assert.match(scenes[5].body,/mecânico de obuseiro/);
 assert.match(scenes[5].body,/Mexia com ônibus/);
 assert.match(scenes[6].body,/não entendo nada/);
 assert.match(scenes[6].body,/obuseiro — o canhão/);
 assert.equal(scenes[1].art,'invasion');
 assert.equal(scenes[2].art,'elections');
});
test('sem personagem alienígena falando nem login no computador',()=>{
 const sequence=introductionSlides();
 const all=JSON.stringify(sequence);
 assert.doesNotMatch(all,/COMANDANTE ALIENÍGENA|OFICIAL ALIENÍGENA|Cristo|mesário por vingança|bolacha de biscoito/);
 const scene=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
 assert.doesNotMatch(scene,/installComputerLogin|player-name-panel|resolvePlayerName|openNewsButton/);
 assert.match(scene,/this\.scene\.start\('GameScene',\{mode:'wave0'/);
});
test('efeito letra por letra usa áudio de tecla, intervalos, avanço e revelação tardia',()=>{
 assert.ok(INTRO_CHAR_DELAY_MS>=22&&INTRO_CHAR_DELAY_MS<=55);
 assert.ok(INTRO_PAGE_MS>=2500&&INTRO_NEWS_HOLD_MS>=5000);
 assert.ok(INTRO_CONVOCATION_HOLD_MS>=5000);
 assert.ok(INTRO_ZECA_HOLD_MS>=3000);
 assert.ok(INTRO_FOOTNOTE_DELAY_MS>=500);
 const scene=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
 assert.match(scene,/this\.time\.addEvent\(\{/);
 assert.match(scene,/this\.typeTarget\.setText\(this\.characters\.slice\(0,this\.characterIndex\)\.join\(''\)\)/);
 assert.match(scene,/playSfx\('introKey',\{throttle:24/);
 assert.match(scene,/playSfx\('introAlert'/);
 assert.match(scene,/playSfx\('introNotice'/);
 assert.match(scene,/this\.segmentTimer=this\.time\.delayedCall\(650,\(\)=>this\.revealPromotion\(\)\)/);
 assert.match(scene,/this\.beginTyping\(this\.footnote,slide\.footnote,'footnote'\)/);
 assert.match(scene,/for\(const key of \['SPACE','ENTER'\]\)/);
 assert.match(scene,/this\.input\.keyboard\.on\('keydown-'\+key/);
 assert.match(scene,/keydown-ESC/);
 assert.match(scene,/intro-obuseiro-head/);
});
