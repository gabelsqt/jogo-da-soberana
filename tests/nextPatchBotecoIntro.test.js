import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {REPRESENTATIVE_STORIES,representativeStoryFor} from '../src/gameplay/representatives.js';
import {introductionSlides,INTRO_PAGE_MS} from '../src/gameplay/introScript.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';
import {CUBO_COLORS,CUBO_NUMBER_FONT} from '../src/ui/cuboNewsTheme.js';

const source=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('imagem fornecida pelo usuário está integrada ao cenário diurno e ao exportador itch',()=>{
  const image=new URL('../public/assets/cenario/boteco_dia.webp',import.meta.url);
  assert.ok(existsSync(image));
  assert.ok(statSync(image).size>10000);
  const data=readFileSync(image);
  assert.equal(data.toString('ascii',0,4),'RIFF');
  assert.equal(data.toString('ascii',8,12),'WEBP');
  const scene=source('src/scenes/UpgradeScene.js');
  assert.match(scene,/assetUrl\('assets\/cenario\/boteco_dia\.webp'\)/);
  assert.match(scene,/this\.load\.image\('boteco-dia'/);
  assert.match(scene,/setDisplaySize\(W,H\)/);
  const builder=source('scripts/build-itch.mjs');
  assert.match(builder,/\.webp': 'image\/webp'/);
});
test('cinco retratos sobre cadeiras e foco no canto superior esquerdo',()=>{
  const scene=source('src/scenes/UpgradeScene.js');
  assert.match(scene,/\[116,298,480,662,844\]/);
  assert.match(scene,/BOTECO_FOCUS=Object\.freeze\(\{x:155,y:163,scale:1\.47/);
  assert.match(scene,/this\.focusDim\.setVisible\(true\)/);
  assert.match(scene,/setDepth\(active\?57:27\)/);
  assert.match(scene,/setAlpha\(active\?1:0\.27\)/);
  assert.match(scene,/this\.tweens\.add\(\{targets:tile\.node/);
  assert.match(scene,/this\.previewLabel/);
  assert.match(scene,/Prévia animada do upgrade \(em breve\)/);
  assert.match(scene,/this\.acceptButton\.label\.setText/);
  assert.match(scene,/this\.backButton/);
});
test('cinco biografias provisórias aparecem em etapas e não substituem upgrade',()=>{
  assert.deepEqual(Object.keys(REPRESENTATIVE_STORIES),['br','us','jp','ru','cn']);
  for(const id of Object.keys(REPRESENTATIVE_STORIES)){
    assert.equal(REPRESENTATIVE_STORIES[id].length,5);
    assert.equal(representativeStoryFor(id,1),representativeStoryFor(id,2));
    assert.notEqual(representativeStoryFor(id,1),representativeStoryFor(id,3));
    assert.equal(representativeStoryFor(id,9),representativeStoryFor(id,10));
  }
  const scene=source('src/scenes/UpgradeScene.js');
  assert.match(scene,/option\.title/);
  assert.match(scene,/option\.description/);
  assert.match(scene,/representativeStoryFor\(id,option\.level\)/);
});
test('nova abertura substitui login, preserva notícias e apresenta Zeca',()=>{
  const menu=source('src/scenes/MenuScene.js'),scene=source('src/scenes/IntroScene.js');
  assert.match(menu,/this\.scene\.start\('IntroScene'/);
  assert.doesNotMatch(menu,/installNameGate/);
  assert.doesNotMatch(scene,/installComputerLogin|openNewsButton/);
  assert.match(scene,/assetUrl\('assets\/lideres\/br_retrato\.png'\)/);
  assert.match(scene,/this\.music\.play\('news',\{loop:false\}\)/);
  assert.match(scene,/if\(!this\.newsThemePlayed\)/);
  assert.match(scene,/playSfx\('introKey'/);
  assert.equal(introductionSlides().length,7);
  assert.ok(INTRO_PAGE_MS>0);
  assert.equal(introductionSlides()[1].kind,'news');
  assert.equal(introductionSlides().at(-1).id,'zeca-3');
});
test('telejornal sóbrio: paleta azul-noturno e cronômetro IBM Plex Mono',()=>{
  assert.equal(CUBO_COLORS.navy,0x0b1621);
  assert.equal(CUBO_COLORS.card,0x193043);
  assert.equal(CUBO_COLORS.red,0xc45151);
  assert.equal(CUBO_COLORS.gold,0xe2a45e);
  assert.match(CUBO_NUMBER_FONT,/IBM Plex Mono/);
  const html=source('index.html');
  assert.match(html,/font-size:11\.4cqw/);
  assert.match(html,/id="cubo-time-reader"/);
});
test('Brasil nível 10 preserva a arma transformada enquanto o Tipo 6 usa colisão no casco',()=>{
  const stats=v1CombatStats({choices:Array(10).fill('br')});
  assert.equal(stats.transformed,'br');
  assert.ok(stats.basicSpeed>480);
  assert.ok(stats.basicInterval<=32);
  const hit=source('src/gameplay/type6Encounter.js');
  assert.match(hit,/const crossingX=fromX\+\(x-fromX\)\*lo/);
  assert.match(hit,/return alive\[0\]\.id/);
  const game=source('src/scenes/GameScene.js');
  assert.match(game,/hitType6Bullet\(this,enemy,bullet\.sprite\.x,bullet\.sprite\.y/);
});
