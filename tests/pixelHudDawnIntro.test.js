import test from 'node:test';
import assert from 'node:assert/strict';
import {drawPixelText,normalizePixelText,pixelTextWidth} from '../src/ui/pixelFont.js';
import {readFileSync} from 'node:fs';

test('fonte 5x7 é bitmap autoral e não depende de CDN',()=>{
  assert.equal(normalizePixelText('Tempo até o amanhecer!'),'TEMPO ATE O AMANHECER!');
  assert.ok(pixelTextWidth('60',13)>pixelTextWidth('6',13));
  const file=readFileSync(new URL('../src/ui/pixelFont.js',import.meta.url),'utf8');
  assert.doesNotMatch(file,/https?:\/\//);
  assert.match(file,/fillRect\(/);
});
test('glifos são desenhados em múltiplos de pixels inteiros',()=>{
  const rectangles=[];
  const canvas={getContext(){return {fillStyle:'',imageSmoothingEnabled:true,
    fillRect(x,y,w,h){rectangles.push([x,y,w,h]);}}}};
  assert.equal(drawPixelText(canvas,'30',{pixel:4}),true);
  assert.equal(canvas.height,28);
  assert.ok(rectangles.length>=25);
  for(const [x,y,w,h] of rectangles){
    for(const val of [x,y,w,h])assert.equal(val%4,0);
  }
  assert.equal(canvas.width,pixelTextWidth('30',4));
});
test('GameScene anuncia TEMPO ATÉ O AMANHECER antes de liberar spawns',()=>{
  const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  const method=source.slice(source.indexOf('  startWaveCountdown() {'),
    source.indexOf('  createSupportTowers() {'));
  assert.match(method,/this\.countdownActive = true;/);
  assert.match(method,/this\.cuboNewsHud\.beginDawnIntro\(this\.waveDurationMs, startCombat\)/);
  assert.match(method,/this\.scheduleWaveEvents\(\);/);
  assert.ok(method.indexOf('this.countdownActive = false')>method.indexOf('const startCombat'));
  assert.doesNotMatch(method,/\[shade, title, number, tip\]/);
});
