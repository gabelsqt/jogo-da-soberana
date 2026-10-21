import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hexShieldCells,hexShieldCellOpacity,hexShieldOpacity,
  HEX_SHIELD_FORM_MS,HEX_SHIELD_COLLAPSE_MS} from '../src/gameplay/hexShieldDome.js';
import {CANNON_DOME_RADIUS} from '../src/gameplay/shieldDome049.js';

const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const visual=readFileSync(new URL('../src/gameplay/hexShieldDome.js',import.meta.url),'utf8');

test('hexágonos centrais piscam de forma suave e chegam quase a apagar',()=>{
  const cells=hexShieldCells();
  const inside=cells.map((cell,index)=>({cell,index}))
    .filter(({cell})=>Math.hypot(cell.x,cell.y)<CANNON_DOME_RADIUS*.40);
  assert.ok(inside.length>=3,'malha deve ter hexágonos internos');
  const {cell,index}=inside[0];
  const levels=Array.from({length:120},(_,i)=>hexShieldCellOpacity(cell,index,i*40));
  assert.ok(Math.max(...levels)-Math.min(...levels)>.55);
  assert.ok(Math.min(...levels)<.15,'hexágono central apaga quase por completo');
  assert.ok(Math.max(...levels)>.90,'hexágono central volta a brilhar');
  assert.ok(levels.every(level=>level>=0&&level<=1));
  assert.ok(levels.some((v,i)=>i>0&&Math.abs(v-levels[i-1])<.08),
    'interpolação de alpha deve ser suave, sem piscar bruscamente');
});

test('pulsos independentes e borda estável sem apagar a cúpula inteira',()=>{
  const cells=hexShieldCells();
  const inside=cells.map((cell,index)=>({cell,index}))
    .filter(({cell})=>Math.hypot(cell.x,cell.y)<CANNON_DOME_RADIUS*.65);
  const a=inside[0],b=inside.at(-1);
  assert.ok(a&&b&&a.index!==b.index);
  const different=Array.from({length:40},(_,i)=>{
    const now=i*83;
    return Math.abs(hexShieldCellOpacity(a.cell,a.index,now)-
      hexShieldCellOpacity(b.cell,b.index,now));
  });
  assert.ok(different.some(v=>v>.30),'as células não piscam em sincronia');
  const border=cells.map((cell,index)=>({cell,index}))
    .find(({cell})=>Math.hypot(cell.x,cell.y)>CANNON_DOME_RADIUS*.82);
  assert.ok(border,'deve existir ao menos uma célula perto da borda');
  for(const now of [0,480,970,1350,2120,3300]){
    assert.ok(hexShieldCellOpacity(border.cell,border.index,now)>.88);
  }
  assert.match(visual,/hexShieldCellOpacity\(cell,i,now,radius\)/);
  assert.match(visual,/graphics\.lineStyle\(8,rim/);
  assert.match(visual,/graphics\.lineStyle\(3,rim/);
});

test('formação acontece no início de todas as ondas, inclusive fora da rota espacial',()=>{
  const countdown=scene.indexOf('  startWaveCountdown() {');
  const combat=scene.indexOf('    const startCombat = () => {',countdown);
  const after=scene.indexOf('    if(this.voyageActive){',combat);
  assert.ok(countdown>=0&&combat>countdown&&after>combat);
  const beforeCombat=scene.slice(countdown,combat);
  const start=scene.slice(combat,after);
  assert.match(beforeCombat,/this\.hexShieldTransition='disabling'/);
  assert.match(beforeCombat,/this\.hexShieldTransitionAt=this\.time\.now/);
  assert.match(start,/this\.hexShieldTransition='forming'/);
  assert.match(start,/this\.hexShieldTransitionAt=this\.time\.now/);
  assert.match(start,/this\.hexShieldFlashUntil=0/);
  assert.match(scene,/this\.hexShieldFlashUntil=this\.time\.now\+450/);
  assert.equal(HEX_SHIELD_COLLAPSE_MS,380);
  assert.equal(HEX_SHIELD_FORM_MS,780);
});

test('colisão e HP permanecem inalterados, inclusive em células apagadas',()=>{
  assert.match(scene,/updateShieldSprites\(this,CANNON\.x,CANNON\.y\+10,this\.supportTowers\)/);
  assert.match(scene,/drawHexShieldDome\(this\.hexShieldGraphics,\{/);
  assert.equal(hexShieldOpacity({shield:0,mode:'active'}),0);
  assert.ok(hexShieldOpacity({shield:80,mode:'active'})>.9);
  assert.ok(hexShieldOpacity({shield:80,progress:.5,mode:'forming'})<.6);
  assert.doesNotMatch(visual,/cannonDomeIntercept/);
});
