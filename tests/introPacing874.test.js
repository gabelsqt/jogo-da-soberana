import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  introductionSlides,introHoldForSlide,
  INTRO_CONVOCATION_HOLD_MS,INTRO_PAGE_MS,INTRO_ZECA_HOLD_MS,
  INTRO_NEWS_HOLD_MS,INTRO_CHAR_DELAY_MS,
} from '../src/gameplay/introScript.js';

const pages=introductionSlides();

test('convocação espera 5,5 segundos DEPOIS de a última letra aparecer',()=>{
  assert.equal(INTRO_CONVOCATION_HOLD_MS,5500);
  assert.equal(introHoldForSlide(pages[0]),5500);
  assert.ok(introHoldForSlide(pages[0])>introHoldForSlide(pages[3]));
  assert.ok(INTRO_PAGE_MS>=2900);
  assert.equal(INTRO_CHAR_DELAY_MS,32,'digitação não muda de velocidade');
});

test('diálogos do Zeca têm leitura confortável, notícias mantêm seus quadros',()=>{
  for(const page of pages.filter(page=>page.kind==='zeca'))
    assert.equal(introHoldForSlide(page),INTRO_ZECA_HOLD_MS);
  assert.ok(INTRO_ZECA_HOLD_MS>=3000);
  assert.equal(INTRO_NEWS_HOLD_MS,5200);
  assert.equal(introHoldForSlide(pages[3]),INTRO_PAGE_MS);
});

test('a cena aguarda completar a digitação antes de iniciar o contador',()=>{
  const scene=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');
  assert.match(scene,/this\.typeTimer\?\.remove\(\);this\.typeTimer=null;\s*this\.completeSegment\(\);/);
  assert.match(scene,/this\.holdTimer=this\.time\.delayedCall\(\s*introHoldForSlide\(slide\),\(\)=>this\.advance\(\)\)/);
  assert.match(scene,/INTRO_NEWS_HOLD_MS/);
  assert.match(scene,/if\(this\.phase==='typing'\)/);
});
