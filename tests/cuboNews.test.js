import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUBO_NEWS_BANK,CUBO_NEWS_INTERVAL_MS,CUBO_NEWS_MAX_QUEUE,
  createCuboNewsState,queueCuboNews,tickCuboNews,nextCuboNewsStory,
  cuboNewsBrazilStage,cuboNewsSponsorStage,
} from '../src/gameplay/cuboNews.js';
import {formatCuboTime} from '../src/ui/cuboNewsHud.js';

test('Cubo News: timer em segundos inteiros sem dois-pontos nem zeros',()=>{
  assert.equal(formatCuboTime(60000),'60');
  assert.equal(formatCuboTime(45000),'45');
  assert.equal(formatCuboTime(1000),'1');
  assert.equal(formatCuboTime(900),'1');
  assert.equal(formatCuboTime(0),'0');
});
test('Cubo News: propaganda estrangeira em três estágios',()=>{
  assert.equal(cuboNewsSponsorStage(['us'],'us'),1);
  assert.equal(cuboNewsSponsorStage(['us','us'],'us'),2);
  assert.equal(cuboNewsSponsorStage(['us','us','us','us'],'us'),3);
  assert.equal(cuboNewsSponsorStage(['br'],'us'),0);
  assert.equal(cuboNewsBrazilStage(['br','br','br','br']),'critic');
  assert.equal(cuboNewsBrazilStage(['br','br','br','br','br']),'praise');
});
test('Cubo News: limite três, fila FIFO e descarte das notícias antigas',()=>{
  const s=createCuboNewsState(['br'],'wave2');
  for(let i=0;i<5;i++)queueCuboNews(s,'NEWS '+i,'CONTEXT '+i);
  assert.equal(s.queue.length,CUBO_NEWS_MAX_QUEUE);
  assert.deepEqual(s.queue.map(x=>x.headline),['NEWS 2','NEWS 3','NEWS 4']);
  assert.equal(nextCuboNewsStory(s).headline,'NEWS 2');
  assert.equal(s.queue.length,2);
});
test('Cubo News: ondas 0–9 anunciam promessa do Cristo sem pânico',()=>{
  const s=createCuboNewsState([],'wave0');
  const first=nextCuboNewsStory(s);
  const second=nextCuboNewsStory(s);
  assert.ok(first.headline.includes('AMANHECER')||first.subtitle.includes('amanhecer'));
  assert.notEqual(first.headline,second.headline);
  const other=createCuboNewsState(['br','us'],'wave8');
  const sample=Array.from({length:10},()=>nextCuboNewsStory(other));
  assert.ok(sample.some(item=>item.headline.includes('CRISTO')||
    item.subtitle.includes('Cristo')||item.headline.includes('ETs')));
  assert.equal(CUBO_NEWS_BANK.dawnPromise.length,3);
  assert.ok(CUBO_NEWS_BANK.dawnPromise.every(x=>!x.headline.includes('CATÁSTROFE')));
  assert.ok(CUBO_NEWS_BANK.invasion.every(x=>!x.headline.includes('FIFA')));
});
test('Cubo News: rotina a cada 5 segundos e plantão final limpa a fila',()=>{
  const s=createCuboNewsState(['br'],'wave4');
  const a=tickCuboNews(s,0,30000);
  assert.deepEqual(tickCuboNews(s,4000,30000),a);
  queueCuboNews(s,'MODULO DESTRUIDO','A bateria foi desativada.');
  assert.equal(tickCuboNews(s,5000,30000).headline,'MODULO DESTRUIDO');
  queueCuboNews(s,'NOVA NOTICIA','Segunda linha.');
  const final=tickCuboNews(s,25000,30000);
  assert.ok(CUBO_NEWS_BANK.dawnEmergency.some(x=>x.headline===final.headline));
  assert.ok(!final.headline.includes('CATÁSTROFE'));
  assert.equal(s.queue.length,0);
  assert.equal(s.emergency,true);
  assert.equal(CUBO_NEWS_INTERVAL_MS,5000);
});
test('Cubo News: traição usa país sorteado sem reescrever a história',()=>{
  const s=createCuboNewsState(['br','us','us'],'wave11','us');
  const story=nextCuboNewsStory(s);
  assert.ok(story.headline.includes('ESTADOS UNIDOS'));
  assert.equal(story.headline.includes('{PAÍS}'),false);
});

test('Onda 10 tem cobertura emergencial verdadeira; primeiras noites não',()=>{
  const early=createCuboNewsState([],'wave9');
  const boss=createCuboNewsState([],'wave10');
  const e=tickCuboNews(early,25000,30000);
  const b=tickCuboNews(boss,55000,60000);
  assert.ok(CUBO_NEWS_BANK.dawnEmergency.some(x=>x.headline===e.headline));
  assert.ok(CUBO_NEWS_BANK.emergency.some(x=>x.headline===b.headline));
  assert.notEqual(e.headline,b.headline);
});
