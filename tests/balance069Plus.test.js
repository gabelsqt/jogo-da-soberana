import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { russianShatterTargets,russianShardVisuals,applyRussianFreeze } from '../src/gameplay/russianFrost.js';
import {sputnikShatterStats} from '../src/gameplay/russianSputnik.js';
const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const start=source.indexOf('  shatterRussianEnemy(enemy) {');
const end=source.indexOf('\n  fireEnemyProjectile(',start);
assert.ok(start>0&&end>start);
const shatter=new Function('russianShatterTargets','russianShardVisuals','sputnikShatterStats','hitType6At',
  'return ({'+source.slice(start,end)+'}).shatterRussianEnemy')(
   russianShatterTargets,russianShardVisuals,sputnikShatterStats,()=>({hit:false}));

function enemy(uid,x,y,until=1000,type=1){return {uid,type,sprite:{x,y},frozenUntil:until};}
function testScene(){
 const hits=[];
 const graphics=()=>({setDepth(){return this;},lineStyle(){return this;},
   fillStyle(){return this;},fillTriangle(){return this;},setRotation(){return this;},
   strokeCircle(){return this;},lineBetween(){return this;},destroy(){}});
 return {elapsed:200,time:{now:200},combat:{russianShatterRadius:60,russianShatterDamage:3},
  enemies:[],add:{graphics},tweens:{add(){}},hits,
  impactInvader(i,d){hits.push({uid:this.enemies[i].uid,d});}};
}
test('morte congelada estilhaça e causa dano aos vizinhos no raio',()=>{
 const s=testScene(),origin=enemy(1,100,100),a=enemy(2,125,100),b=enemy(3,260,100);
 s.enemies=[a,b]; // source already removed before the burst
 shatter.call(s,origin);
 assert.deepEqual(s.hits,[{uid:2,d:3}]);
 assert.equal(origin.russianShattered,true);
 shatter.call(s,origin);
 assert.equal(s.hits.length,1);
});
test('sem estilhaços para morte após descongelar ou no nível sem dano',()=>{
 const s=testScene(),origin=enemy(1,100,100,150);
 s.enemies=[enemy(2,125,100)];
 shatter.call(s,origin);assert.deepEqual(s.hits,[]);
 origin.frozenUntil=1000;s.combat.russianShatterDamage=0;
 shatter.call(s,origin);assert.deepEqual(s.hits,[]);
});
test('Wave Maker não usa events() que conflita com Phaser.Scene.events',()=>{
 const editor=readFileSync(new URL('../src/scenes/WaveMakerScene.js',import.meta.url),'utf8');
 assert.match(editor,/waveEvents\(\)\{return this\.entry\(\)\.events;/);
 assert.doesNotMatch(editor,/this\.events\(\)/);
 assert.doesNotMatch(editor,/\s+events\(\)\{/);
});
test('escudos usam sprites e estilhaçam ao esgotar resistência',()=>{
 const shields=readFileSync(new URL('../src/gameplay/shieldSprites.js',import.meta.url),'utf8');
 assert.match(shields,/generateTexture\(/);
 assert.match(shields,/add\.image\(/);
 assert.match(shields,/shatterShieldSprite/);
 assert.match(source,/installShieldSprites\(this\)/);
 assert.match(source,/updateShieldSprites\(this,/);
 assert.match(source,/if\(oldShield>0&&this\.shield<=0\)/);
});
test('Tipo 6 inicia protegido e temporizador só começa quando alvejável',()=>{
 const boss=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
 assert.match(boss,/type6FinishBarrierCharge\(state\)/);
 assert.match(boss,/s\.openingClock>=TYPE6_OPENING_SECONDS/);
 assert.match(boss,/s\.introComplete=true;enemy\.phase='boss6'/);
 assert.match(boss,/scene\.boss6IntroPaused=false;scene\.elapsed=0/);
});
