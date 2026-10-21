import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {
  HEX_SHIELD_FORM_MS,HEX_SHIELD_ARC_MS,HEX_SHIELD_CELLS_MS,
  HEX_SHIELD_ARC_FRACTION,HEX_SHIELD_WHITE_FLASH_MS,HEX_SHIELD_SWELL_MAX,
  hexShieldFormationStage,hexShieldArcTip,hexShieldFlashScale,
  hexShieldCells,drawHexShieldDome,
} from '../src/gameplay/hexShieldDome.js';
import {CANNON_DOME_RADIUS} from '../src/gameplay/shieldDome049.js';
import {SFX_FILES} from '../src/audio/sfx.js';

const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
function mockGraphics(){
  const calls=[];
  const g={calls};
  for(const method of ['clear','fillStyle','fillPoints','lineStyle',
    'strokePoints','fillCircle','lineBetween']){
    g[method]=(...args)=>{calls.push({method,args});return g;};
  }
  return g;
}
const by=(graphics,method)=>graphics.calls.filter(c=>c.method===method);

test('escudo ganha 1,6s cerimoniais: 650ms arco e 950ms hexágonos',()=>{
  assert.equal(HEX_SHIELD_ARC_MS,650);
  assert.equal(HEX_SHIELD_CELLS_MS,950);
  assert.equal(HEX_SHIELD_FORM_MS,1600);
  assert.equal(HEX_SHIELD_ARC_FRACTION,650/1600);
  assert.deepEqual(hexShieldFormationStage(0),{arc:0,cells:0});
  assert.deepEqual(hexShieldFormationStage(HEX_SHIELD_ARC_FRACTION),{arc:1,cells:0});
  assert.deepEqual(hexShieldFormationStage(1),{arc:1,cells:1});
  assert.equal(hexShieldFormationStage(.15).cells,0);
  assert.equal(hexShieldFormationStage(.75).arc,1);
  assert.match(scene,/elapsed\/HEX_SHIELD_FORM_MS/);
  assert.match(scene,/this\.hexShieldTransition='forming'/);
});

test('a ponta luminosa percorre o arco estritamente da esquerda à direita',()=>{
  const r=CANNON_DOME_RADIUS;
  const left=hexShieldArcTip(0),top=hexShieldArcTip(.5),right=hexShieldArcTip(1);
  assert.ok(Math.abs(left.x-(480-r))<.00001);
  assert.ok(Math.abs(top.x-480)<.00001);
  assert.ok(Math.abs(top.y-(504-r))<.00001);
  assert.ok(Math.abs(right.x-(480+r))<.00001);
  const positions=Array.from({length:101},(_,i)=>hexShieldArcTip(i/100).x);
  assert.ok(positions.every((x,i)=>i===0||x>=positions[i-1]-1e-8));
});

test('a ponta tem 4 halos azuis e um rastro curto durante o ARCO, não nos hexágonos',()=>{
  const g=mockGraphics();
  drawHexShieldDome(g,{mode:'forming',progress:.19,now:350});
  const dots=by(g,'fillCircle');
  assert.equal(dots.length,4,'quatro halos concentricos na ponta, zero hexágonos');
  assert.deepEqual(dots.map(d=>d.args[2]),[16,10,4.5,2]);
  const tip=hexShieldArcTip(hexShieldFormationStage(.19).arc);
  for(const d of dots){
    assert.ok(Math.abs(d.args[0]-tip.x)<.00001);
    assert.ok(Math.abs(d.args[1]-tip.y)<.00001);
  }
  assert.equal(by(g,'lineBetween').length,7,'rastro se dissolve ao longo de sete segmentos');
  const end=mockGraphics();
  drawHexShieldDome(end,{mode:'forming',progress:HEX_SHIELD_ARC_FRACTION,now:650});
  assert.equal(by(end,'fillCircle').length,0,'ponta apaga ao terminar o arco');
  const cellStage=mockGraphics();
  drawHexShieldDome(cellStage,{mode:'forming',progress:.75,now:1200});
  assert.ok(by(cellStage,'fillCircle').length>0);
  assert.equal(by(cellStage,'lineBetween').length,2,'somente os indicadores laterais, sem rastro depois do arco');
  assert.ok(by(cellStage,'fillCircle').length<hexShieldCells().length*2);
});

test('flash branco + 500ms: expande no centro e retorna ao raio original',()=>{
  assert.equal(HEX_SHIELD_WHITE_FLASH_MS,840);
  assert.equal(HEX_SHIELD_SWELL_MAX,.035);
  assert.ok(Math.abs(hexShieldFlashScale(1)-1)<1e-10);
  assert.ok(Math.abs(hexShieldFlashScale(.5)-1.035)<1e-10);
  assert.ok(Math.abs(hexShieldFlashScale(0)-1)<1e-10);
  assert.ok(hexShieldFlashScale(.75)>1);
  assert.ok(hexShieldFlashScale(.25)>1);
  assert.ok(hexShieldFlashScale(.5)>hexShieldFlashScale(.25));
  for(const flash of [0,0.25,.5,.75,1]){
    const g=mockGraphics();
    drawHexShieldDome(g,{mode:'active',now:1234,flash});
    const fullArc=by(g,'strokePoints').find(c=>
      c.args[0].length===65&&!c.args[1]);
    assert.ok(fullArc);
    const expected=480-CANNON_DOME_RADIUS*hexShieldFlashScale(flash);
    assert.ok(Math.abs(fullArc.args[0][0].x-expected)<.0001);
  }
  assert.match(scene,/this\.hexShieldFlashUntil=this\.time\.now\+HEX_SHIELD_WHITE_FLASH_MS/);
  assert.match(scene,/playSfx\('shieldReady'/);
});

test('novo UOM grave está registrado e é um WAV PCM reproduzível de mais de 1s',()=>{
  const file='35_escudo_hexagonal_uom_grave.wav';
  assert.equal(SFX_FILES.shieldReady,file);
  const bytes=readFileSync(new URL('../public/assets/sons/'+file,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WAVE');
  assert.equal(bytes.toString('ascii',12,16),'fmt ');
  assert.equal(bytes.readUInt16LE(20),1);
  assert.equal(bytes.readUInt16LE(22),1);
  assert.equal(bytes.readUInt32LE(24),16000);
  assert.equal(bytes.readUInt16LE(34),16);
  const dataBytes=bytes.readUInt32LE(40);
  assert.equal(dataBytes,bytes.length-44);
  assert.ok(dataBytes/2/16000>1.2);
  assert.ok(bytes.length>50000&&bytes.length<150000);
});

test('deslocamento de volume da cúpula é só visual, sem mexer na hitbox',()=>{
  const src=readFileSync(new URL('../src/gameplay/hexShieldDome.js',import.meta.url),'utf8');
  assert.match(src,/const visualScale=hexShieldFlashScale\(whiteFlash\)/);
  assert.match(src,/x:cx\+p\.x\*visualScale,y:cy\+p\.y\*visualScale/);
  assert.doesNotMatch(src,/cannonDomeIntercept/);
  assert.match(scene,/drawHexShieldDome\(this\.hexShieldGraphics,\{/);
  assert.match(scene,/this\.shieldMax/);
});
