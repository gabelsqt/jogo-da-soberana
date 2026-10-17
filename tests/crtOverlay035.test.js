import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CRT_FILTER_DEPTH, CRT_SCANLINE_SPACING, CRT_SWEEP_PERIOD_MS,
  crtScanlineRows, crtVignetteBands, crtSweepY, crtScanlinePulse,
  createCombatCrtOverlay,
} from '../src/ui/crtOverlay.js';

test('scanlines são espaçadas a cada 4px e cobrem a tela 960x540', () => {
  assert.equal(CRT_SCANLINE_SPACING, 4);
  assert.deepEqual(crtScanlineRows(13), [1,5,9]);
  const rows = crtScanlineRows(540);
  assert.equal(rows.length,135);
  assert.equal(rows[0],1);
  assert.equal(rows.at(-1),537);
  assert.ok(rows.every(y => y >= 0 && y < 540));
});

test('vinheta fica nas bordas, sem cobrir o centro de combate', () => {
  const bands=crtVignetteBands(960,540);
  assert.equal(bands.length,48);
  assert.ok(bands.every(b=>b.x>=0&&b.y>=0&&b.x+b.width<=960&&b.y+b.height<=540));
  assert.ok(bands.every(b=>b.alpha>0&&b.alpha<=0.16));
  assert.ok(bands.every(b=>!(480>=b.x && 480<b.x+b.width &&
    270>=b.y && 270<b.y+b.height)));
  assert.ok(bands[0].alpha>bands.at(-1).alpha);
});

test('varredura é sutil, estável e limitada ao relógio do jogo', () => {
  assert.equal(CRT_SWEEP_PERIOD_MS,8500);
  assert.equal(crtSweepY(0,540),-18);
  assert.equal(crtSweepY(CRT_SWEEP_PERIOD_MS,540),-18);
  assert.equal(crtSweepY(CRT_SWEEP_PERIOD_MS/2,540),270);
  for (let t=0;t<=15000;t+=257) {
    assert.ok(crtScanlinePulse(t)>=0.85&&crtScanlinePulse(t)<=1.0);
    assert.ok(crtSweepY(t,540)>=-18&&crtSweepY(t,540)<=558);
  }
});

function mockScene() {
  const graphics=[], rectangles=[];
  function graphic() {
    const g={
      depth:null,alpha:1,lineCount:0,fillCount:0,outlineCount:0,
      setDepth(depth){this.depth=depth;return this;},
      setAlpha(alpha){this.alpha=alpha;return this;},
      lineStyle(){return this;},
      lineBetween(){this.lineCount++;return this;},
      fillStyle(){return this;},
      fillRect(){this.fillCount++;return this;},
      strokeRect(){this.outlineCount++;return this;},
    };
    graphics.push(g);
    return g;
  }
  function rectangle(x,y,width,height,color,alpha){
    const r={x,y,width,height,color,alpha,depth:null,
      setDepth(depth){this.depth=depth;return this;}};
    rectangles.push(r);
    return r;
  }
  return {graphics,rectangles,add:{graphics:graphic,rectangle}};
}

test('CRT da GameScene fica abaixo do HUD, não consome clique e não redesenha por quadro', () => {
  const scene=mockScene();
  const fx=createCombatCrtOverlay(scene,960,540);
  assert.equal(scene.graphics.length,2);
  assert.equal(scene.rectangles.length,1);
  assert.equal(fx.scanlines.depth,CRT_FILTER_DEPTH);
  assert.equal(fx.vignette.depth,CRT_FILTER_DEPTH+1);
  assert.equal(fx.sweep.depth,CRT_FILTER_DEPTH+2);
  assert.ok(fx.sweep.depth<100,'texto e botões de HUD continuam nítidos');
  assert.equal(fx.scanlines.lineCount,135);
  assert.equal(fx.vignette.fillCount,48);
  assert.equal(fx.vignette.outlineCount,1);
  const before=[fx.scanlines.lineCount,fx.vignette.fillCount];
  fx.update(4250);
  assert.equal(fx.sweep.y,270);
  fx.update(8500);
  assert.equal(fx.sweep.y,-18);
  assert.deepEqual([fx.scanlines.lineCount,fx.vignette.fillCount],before);
  assert.equal(typeof fx.scanlines.setInteractive,'undefined');
  assert.equal(typeof fx.vignette.setInteractive,'undefined');
  assert.equal(typeof fx.sweep.setInteractive,'undefined');
});

test('filtro só aparece no campo de batalha, não nos menus/diálogos', () => {
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  const menu=readFileSync(new URL('../src/scenes/MenuScene.js',import.meta.url),'utf8');
  const upgrade=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');
  assert.match(game,/this\.crtOverlay = createCombatCrtOverlay\(this, W, H\)/);
  assert.match(game,/this\.crtOverlay\?\.update\(this\.time\.now\)/);
  assert.doesNotMatch(menu,/createCombatCrtOverlay/);
  assert.doesNotMatch(upgrade,/createCombatCrtOverlay/);
});
