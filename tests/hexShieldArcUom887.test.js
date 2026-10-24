import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  hexShieldCells,hexShieldCellOpacity,hexShieldFormationStage,
  drawHexShieldDome,HEX_SHIELD_ARC_FRACTION,
  HEX_SHIELD_FORM_MS,HEX_SHIELD_WHITE_FLASH_MS,
} from '../src/gameplay/hexShieldDome.js';
import {SFX_FILES} from '../src/audio/sfx.js';
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

function mockGraphics(){
 const calls=[];
 const graphics={calls};
 for(const method of ['clear','fillStyle','fillPoints','lineStyle','strokePoints',
  'fillCircle','lineBetween']){
   graphics[method]=(...args)=>{calls.push({method,args});return graphics;};
 }
 return graphics;
}
const count=(g,method)=>g.calls.filter(x=>x.method===method);
test('a formação tem duas etapas estritamente sequenciais: arco, depois hexágonos',()=>{
 assert.equal(HEX_SHIELD_ARC_FRACTION,650/1600);
 assert.deepEqual(hexShieldFormationStage(0),{arc:0,cells:0});
 assert.deepEqual(hexShieldFormationStage(HEX_SHIELD_ARC_FRACTION),{arc:1,cells:0});
 assert.equal(hexShieldFormationStage(.18).cells,0);
 assert.equal(hexShieldFormationStage(.68).arc,1);
 assert.ok(Math.abs(hexShieldFormationStage(HEX_SHIELD_ARC_FRACTION+(1-HEX_SHIELD_ARC_FRACTION)*.5).cells-.5)<.0001);
 assert.deepEqual(hexShieldFormationStage(1),{arc:1,cells:1});
 const begin=mockGraphics();
 drawHexShieldDome(begin,{progress:.18,mode:'forming',now:200});
 assert.equal(count(begin,'fillCircle').length,4,
   'ponta azul com quatro camadas; nenhum hexágono antes de concluir o arco');
 const partialArcs=count(begin,'strokePoints').map(c=>c.args[0].length);
 assert.ok(partialArcs.some(n=>n>3&&n<65),'arco parcial ainda incompleto');
 const justArc=mockGraphics();
 drawHexShieldDome(justArc,{progress:HEX_SHIELD_ARC_FRACTION,mode:'forming',now:200});
 assert.equal(count(justArc,'fillCircle').length,0);
 assert.ok(count(justArc,'strokePoints').some(c=>c.args[0].length===65));
 const middle=mockGraphics();
 drawHexShieldDome(middle,{progress:.68,mode:'forming',now:200});
 const full=mockGraphics();
 drawHexShieldDome(full,{progress:1,mode:'forming',now:200});
 assert.ok(count(middle,'fillCircle').length>0);
 assert.ok(count(middle,'fillCircle').length<count(full,'fillCircle').length);
 assert.equal(count(full,'fillCircle').length,hexShieldCells().length*2);
 assert.equal(HEX_SHIELD_FORM_MS,1600);
});

test('hexágonos aparecem em ordem da esquerda para a direita, todos com bolinha',()=>{
 const cells=hexShieldCells();
 assert.ok(cells.length>=60);
 assert.ok(cells.every((cell,i)=>i===0||cells[i-1].x<=cell.x));
 const g=mockGraphics();
 drawHexShieldDome(g,{progress:1,mode:'active',now:1200,flash:0});
 const dots=count(g,'fillCircle');
 assert.equal(dots.length,cells.length*2);
 for(let i=0;i<cells.length;i++){
   assert.equal(dots[i*2].args[0],480+cells[i].x);
   assert.equal(dots[i*2].args[1],504+cells[i].y);
   assert.equal(dots[i*2].args[2],1.8);
   assert.equal(dots[i*2+1].args[2],.75);
 }
 assert.equal(count(g,'strokePoints').filter(op=>op.args[1]===true).length,cells.length);
});

test('absolutamente todos os hexágonos piscam em alpha, inclusive nas bordas',()=>{
 const cells=hexShieldCells();
 const indices=[0,Math.floor(cells.length*.2),Math.floor(cells.length*.5),
   Math.floor(cells.length*.8),cells.length-1];
 const dimmed=[],bright=[];
 for(const index of indices){
   const c=cells[index];
   const levels=Array.from({length:170},(_,k)=>hexShieldCellOpacity(c,index,k*42));
   dimmed.push(Math.min(...levels));bright.push(Math.max(...levels));
 }
 assert.ok(dimmed.every(x=>x<.15));
 assert.ok(bright.every(x=>x>.92));
 const at=Array.from({length:cells.length},(_,i)=>hexShieldCellOpacity(cells[i],i,1450));
 assert.ok(new Set(at.map(v=>v.toFixed(2))).size>20,
   'sem sincronização generalizada');
});

test('o flash de conclusão clareia toda a malha apenas uma vez e há UOM próprio',()=>{
 const blue=mockGraphics(),white=mockGraphics();
 drawHexShieldDome(blue,{mode:'active',now:1700,flash:0});
 drawHexShieldDome(white,{mode:'active',now:1700,flash:1});
 assert.ok(count(white,'fillCircle').length>count(blue,'fillCircle').length);
 assert.ok(count(white,'lineStyle').some(c=>c.args[1]===0xffffff));
 assert.equal(HEX_SHIELD_WHITE_FLASH_MS,180);
 assert.equal(SFX_FILES.shieldReady,'35_escudo_hexagonal_uom_grave.wav');
 assert.match(game,/this\.hexShieldFlashUntil=this\.time\.now\+HEX_SHIELD_WHITE_FLASH_MS/);
 assert.match(game,/if\(this\.shield>0\)playSfx\('shieldReady'/);
 const transition=game.slice(game.indexOf('  drawShield() {'),
   game.indexOf('  // O retrato de Zeca',game.indexOf('  drawShield() {')));
 assert.match(transition,/if\(progress>=1\)\{/);
 assert.match(transition,/phase='active';this\.hexShieldTransition='active'/);
 assert.ok(transition.indexOf("phase='active'")<transition.indexOf("playSfx('shieldReady'"));
});
