import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUBO_NEWS_BANK,CUBO_NEWS_INTERVAL_MS,CUBO_NEWS_MAX_QUEUE,
  createCuboNewsState,queueCuboNews,tickCuboNews,nextCuboNewsStory,
  cuboNewsBrazilStage,cuboNewsSponsorStage,
} from '../src/gameplay/cuboNews.js';
import {formatCuboTime} from '../src/ui/cuboNewsHud.js';

test('Cubo News: relógio 00:45 com arredondamento para cima',()=>{
  assert.equal(formatCuboTime(45000),'00:45');
  assert.equal(formatCuboTime(1000),'00:01');
  assert.equal(formatCuboTime(900),'00:01');
  assert.equal(formatCuboTime(0),'00:00');
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
test('Cubo News: manchetes não repetem até esgotar o banco',()=>{
  const s=createCuboNewsState([],'wave0');
  const first=nextCuboNewsStory(s);
  const second=nextCuboNewsStory(s);
  assert.notEqual(first.headline,second.headline);
  assert.equal(nextCuboNewsStory(s).headline,first.headline);
  assert.equal(CUBO_NEWS_BANK.invasion.length,2); // terceira manchete ainda pendente
  assert.ok(CUBO_NEWS_BANK.invasion.every(x=>!x.headline.includes('FIFA')));
});
test('Cubo News: rotina a cada 5 segundos e plantão final limpa a fila',()=>{
  const s=createCuboNewsState(['br'],'wave4');
  const a=tickCuboNews(s,0,30000);
  assert.deepEqual(tickCuboNews(s,4000,30000),a);
  queueCuboNews(s,'MODULO DESTRUIDO','A bateria foi desativada.');
  assert.equal(tickCuboNews(s,5000,30000).headline,'MODULO DESTRUIDO');
  queueCuboNews(s,'NOVA NOTICIA','Segunda linha.');
  assert.equal(tickCuboNews(s,25000,30000).headline.includes('PLANTÃO'),true);
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
