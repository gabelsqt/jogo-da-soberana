import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CANNON_DOME_RADIUS} from '../src/gameplay/shieldDome049.js';
import {hexShieldCells,hexShieldOpacity,HEX_SHIELD_FORM_MS,
  HEX_SHIELD_COLLAPSE_MS} from '../src/gameplay/hexShieldDome.js';
import {VOYAGE_TOTAL_MS,VOYAGE_SPACE_MS,voyageRocketPose} from '../src/gameplay/voyageTravel.js';

const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const shield=readFileSync(new URL('../src/gameplay/hexShieldDome.js',import.meta.url),'utf8');

test('cúpula é feita por dezenas de hexágonos dentro do semicírculo',()=>{
 const cells=hexShieldCells();
 assert.ok(cells.length>=35,'esperava dezenas de hexágonos: '+cells.length);
 assert.ok(new Set(cells.map(c=>c.y)).size>=6);
 for(const c of cells){
   assert.equal(c.points.length,6);
   for(const p of c.points){
     assert.ok(p.y<=.25,'todas as células ficam acima do solo');
     assert.ok(Math.hypot(p.x,p.y)<CANNON_DOME_RADIUS);
   }
 }
 const positions=new Set(cells.map(c=>c.x.toFixed(2)+'/'+c.y.toFixed(2)));
 assert.equal(positions.size,cells.length);
});

test('escudo começa translúcido, desaparece e se reconstrói por progressão',()=>{
 assert.equal(HEX_SHIELD_FORM_MS,780);
 assert.equal(HEX_SHIELD_COLLAPSE_MS,380);
 assert.equal(hexShieldOpacity({progress:0,mode:'forming'}),0);
 assert.ok(hexShieldOpacity({progress:.5,mode:'forming'})>.2);
 assert.ok(hexShieldOpacity({progress:1,mode:'forming'})>.95);
 assert.ok(hexShieldOpacity({progress:.9,mode:'disabling'})<.12);
 assert.equal(hexShieldOpacity({progress:1,mode:'disabling'}),0);
 assert.equal(hexShieldOpacity({shield:0,progress:1,mode:'active'}),0);
 assert.ok(hexShieldOpacity({shield:20,maxShield:80}) <
   hexShieldOpacity({shield:80,maxShield:80}));
 assert.match(shield,/graphics\.fillPoints\(vertices,true\)/);
 assert.match(shield,/graphics\.strokePoints\(vertices,true\)/);
 assert.match(shield,/graphics\.strokePoints\(arc,false\)/);
 assert.match(shield,/graphics\.strokePoints\(currentArc,false\)/);
 assert.match(shield,/graphics\.lineStyle\(3,0xffffff,whiteFlash\*\.98\)/);
});

test('viajar anima os sprites do canhão original, nunca desenha segundo canhão',()=>{
 assert.doesNotMatch(game,/createVoyageRocket\(/);
 assert.doesNotMatch(game,/const \{ship,flame\}=this\.createVoyageRocket/);
 assert.match(game,/this\.cannonVisualParts=\[base,middle,this\.barrel,pivot\]/);
 assert.match(game,/this\.cannonVisualParts\.push\(this\.cannonBaseArt,this\.cannonBarrelArt,/);
 assert.match(game,/const originals=\(this\.cannonVisualParts\?\?\[\]\)/);
 assert.match(game,/for\(const \{item,x,y\} of originals\)item\.setPosition\(x,y\+deltaY\)/);
 assert.match(game,/for\(const \{item,x,y\} of originals\)item\.setPosition\(x,y\);/);
 assert.match(game,/this\.countdownActive=true/);
 assert.match(game,/if \(this\.countdownActive\)\{/);
 assert.match(game,/this\.startWaveCountdown\(\)/);
 assert.equal(VOYAGE_TOTAL_MS,6000);
 assert.equal(VOYAGE_SPACE_MS,4000);
 for(const t of [0,450,900,1000,2200,4999,5800,6000]){
   assert.equal(voyageRocketPose(t,{x:480,startY:454,groundY:454}).x,480);
 }
});

test('escudo fecha ao decolar, reaparece no pouso e mantém colisão existente',()=>{
 assert.match(game,/this\.hexShieldTransition='disabling'/);
 assert.match(game,/this\.hexShieldTransition='forming'/);
 assert.match(game,/this\.hexShieldTransition='active'/);
 assert.match(game,/this\.cannonDomeSprite\?\.setVisible\(false\)/);
 assert.match(game,/drawHexShieldDome\(this\.hexShieldGraphics,\{/);
 assert.match(game,/this\.hexShieldFlashUntil=this\.time\.now\+HEX_SHIELD_WHITE_FLASH_MS/);
 assert.match(game,/this\.drawShield\(\); \/\/ formação\/desligamento também anima sem combate/);
 assert.match(game,/this\.drawShield\(\); \/\/ escudo se desliga e se forma com o jogo pausado/);
 assert.match(game,/updateShieldSprites\(this,CANNON\.x,CANNON\.y\+10,this\.supportTowers\)/);
});
