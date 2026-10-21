import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {wavyLetterOffset} from '../src/ui/introTextWave.js';
import {introductionSlides} from '../src/gameplay/introScript.js';

const intro=readFileSync(new URL('../src/scenes/IntroScene.js',import.meta.url),'utf8');

test('MESÁRIO é laranja ondulante, asterisco permanece normal e promoção é muito maior',()=>{
  const slides=introductionSlides();
  assert.match(slides[0].body,/MESÁRIO\*/);
  assert.match(intro,/const word='MESÁRIO';/);
  assert.match(intro,/color:'#f7a547'/);
  assert.match(intro,/fontSize:21,color:'#f7a547'/);
  assert.match(intro,/word:slide.promotion,x:W\/2,y:323/);
  assert.match(intro,/fontSize:43,color:'#ff634d'/);
  assert.match(intro,/amplitude:3.6,center:true/);
  assert.notEqual(wavyLetterOffset(500,0,2),wavyLetterOffset(500,1,2));
  assert.ok(Math.abs(wavyLetterOffset(500,2,2))<=2);
  assert.match(intro,/this.refreshConvocationHighlight\(\)/);
});

test('notícias exibem quadros pixel art internos sem texto extra de tragédia',()=>{
  const pages=introductionSlides();
  assert.deepEqual(pages.filter(x=>x.kind==='news').map(x=>x.art),
    ['invasion','elections']);
  for(const name of ['invasao-cristo.svg','urna-cancelado.svg']){
    const url=new URL('../public/assets/intro/'+name,import.meta.url);
    assert.ok(existsSync(url),name);
    const body=readFileSync(url,'utf8');
    assert.match(body,/viewBox="0 0 360 84"/);
    assert.match(body,/shape-rendering="crispEdges"/);
    assert.match(body,/<svg/);
  }
  const invasion=readFileSync(new URL('../public/assets/intro/invasao-cristo.svg',
    import.meta.url),'utf8');
  assert.match(invasion,/polygon/);
  const elections=readFileSync(new URL('../public/assets/intro/urna-cancelado.svg',
    import.meta.url),'utf8');
  assert.match(elections,/CANCELADO/);
  assert.match(intro,/this.load.svg\('intro-invasion'/);
  assert.match(intro,/this.load.svg\('intro-elections'/);
  assert.match(intro,/this.add.image\(W\/2,412,key\)/);
});

test('Zeca fala em três caixas, com uma frase por página e um texto por vez',()=>{
  const zeca=introductionSlides().filter(slide=>slide.kind==='zeca');
  assert.equal(zeca.length,3);
  assert.ok(zeca.every(page=>!page.body.includes('\n')));
  assert.match(zeca[0].body,/até ontem você era mesário/);
  assert.match(zeca[1].body,/Mexia com ônibus/);
  assert.match(zeca[1].body,/mecânico de obuseiro/);
  assert.match(zeca[2].body,/obuseiro — o canhão aí — tá funcionando/);
  assert.match(intro,/this\.clearSlide\(\)/);
  assert.match(intro,/this\.beginTyping\(this\.body,slide\.body,'body'\)/);
});
