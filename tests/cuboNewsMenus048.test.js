import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {drawPixelText,normalizePixelMixedCase} from '../src/ui/pixelFont.js';
import {CUBO_COLORS} from '../src/ui/cuboNewsTheme.js';

function bitmap(text){
  const pts=[];
  const canvas={getContext(){return {fillStyle:'',imageSmoothingEnabled:true,
    fillRect(x,y,w,h){pts.push([x,y,w,h]);}}}};
  drawPixelText(canvas,text,{pixel:2,color:'#ffffff'});
  return {pts,width:canvas.width,height:canvas.height};
}
test('fonte pixelada v0.48 mantém caixa alta/baixa e acentos portugueses',()=>{
  assert.equal(normalizePixelMixedCase('Cubo News: Até o amanhecer!'),'Cubo News: Ate o amanhecer!');
  const big=bitmap('A'),small=bitmap('a');
  assert.notDeepEqual(big.pts,small.pts,'minúscula deve ter glifo próprio, não maiúscula reduzida');
  assert.deepEqual(big.pts[0].slice(2),[2,2]);
  const accent=bitmap('Água');assert.ok(accent.height>small.height);
  const phrase=bitmap('Cubo News');assert.ok(phrase.width>100);
});
test('menus e telas secundárias compartilham a moldura da Cubo News',()=>{
  const sceneNames=['MenuScene','PauseScene','UpgradeScene','V1PlaytestScene',
    'LabSetupScene','UpgradeLabScene','EndingScene'];
  for(const name of sceneNames){
    const src=readFileSync(new URL('../src/scenes/'+name+'.js',import.meta.url),'utf8');
    assert.match(src,/addCuboBroadcastFrame\(this/,name);
  }
  const gameplay=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(gameplay,/addCuboBroadcastFrame\(this/, 'derrota/finais recebem cobertura Cubo News');
  const button=readFileSync(new URL('../src/ui/menuButton.js',import.meta.url),'utf8');
  assert.match(button,/0xedc75a/);
  assert.equal(CUBO_COLORS.green,0x134b45);
  assert.equal(CUBO_COLORS.gold,0xedc75a);
});
test('HUD v0.49 volta às letras normais IBM Plex Sans e paleta aprovada',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of ['cubo-headline','cubo-time-reader','cubo-crawl-one','cubo-dawn-number']){
    assert.match(html,new RegExp('id="'+id+'"'));
  }
  assert.doesNotMatch(html,/<canvas id="cubo-time-pixels"/);
  assert.match(html,/IBM\+Plex\+Sans/);
  assert.match(html,/#134b45/i);
  assert.match(html,/#edc75a/i);
  const hud=readFileSync(new URL('../src/ui/cuboNewsHud.js',import.meta.url),'utf8');
  assert.match(hud,/formatCuboHeadline/);
  assert.doesNotMatch(hud,/drawPixelText/);
  assert.match(hud,/DAWN_WORLD_ZOOM/);
});
