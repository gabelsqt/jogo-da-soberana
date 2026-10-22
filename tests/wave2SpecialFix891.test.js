import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getWaveEvents,scheduledEnemyCount} from '../src/gameplay/waves.js';
import {getV035WaveEvents,WAVE2_PACING} from '../src/gameplay/formation035.js';
import {specialTargetPoint,advanceSpecialProjectile,
  SPECIAL_TARGET_MARGIN} from '../src/gameplay/specialBlast.js';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('Onda 2 tem no máximo 26 naves e encontros distribuídos até 13s',()=>{
 const events=getV035WaveEvents('wave2',getWaveEvents('wave2'));
 assert.equal(scheduledEnemyCount(events),26);
 assert.equal(events.filter(e=>e.pattern==='swarm').length,4);
 assert.equal(events.filter(e=>e.pattern==='tactical').length,2);
 assert.equal(events.filter(e=>e.pattern==='orbit').length,1);
 assert.equal(events.at(-1).at,12400);
 assert.ok(events.every(e=>e.at<=13500));
 assert.deepEqual(events.filter(e=>e.pattern==='swarm').map(e=>e.count),
   [3,4,4,4]);
 assert.deepEqual(events.filter(e=>e.pattern==='tactical').map(e=>e.count),[3,3]);
 assert.equal(events.find(e=>e.pattern==='orbit').count,5);
 assert.ok(events.every(e=>e.type<=2));
 assert.equal(WAVE2_PACING.orbitCount,5);
 assert.ok(scheduledEnemyCount(events)>scheduledEnemyCount(
   getV035WaveEvents('wave1',getWaveEvents('wave1'))));
});

test('Onda 2 mantém atiradores por formação limitados, não 2 tiros por cada nave',()=>{
 assert.match(source,/!\['wave1','wave2'\]\.includes\(this\.mode\)\|\|\s*wave1FormationShooter\('swarm'/);
 assert.match(source,/!\['wave1','wave2'\]\.includes\(this\.mode\)\|\|\s*wave1FormationShooter\('tactical'/);
 assert.match(source,/this\.mode!=='wave1'\)\s*this\.fireEnemyProjectile/);
});

test('Alvos dos especiais ficam dentro da tela mesmo em miras extremas',()=>{
 const cursorPositions=[
   [480,-10000],[480,-80],[-10000,-10000],[10000,-10000],
   [10000,494],[-10000,494],[0,0],[960,0],[20,494],
   [940,494],[480,490],[480,210],[0,520],
 ];
 for(const [x,y] of cursorPositions){
   const point=specialTargetPoint(480,494,x,y);
   assert.ok(point.x>=SPECIAL_TARGET_MARGIN-1e-8&&point.x<=960-SPECIAL_TARGET_MARGIN+1e-8,
     'x fora da tela: '+JSON.stringify({x,y,point}));
   assert.ok(point.y>=SPECIAL_TARGET_MARGIN-1e-8&&point.y<=540-SPECIAL_TARGET_MARGIN+1e-8,
     'y fora da tela: '+JSON.stringify({x,y,point}));
   assert.ok(point.distance>0);
 }
});

test('Projétil especial detona SEMPRE no destino, inclusive com offset do cano e FPS baixo',()=>{
 const pointers=[[480,-800],[960,20],[0,15],[960,494],[0,494],[480,240]];
 for(const [px,py] of pointers){
   const target=specialTargetPoint(480,494,px,py);
   // Simula disparo físico deslocado lateralmente 32 px da reta da mira.
   let x=510,y=432,arrived=false;
   for(let step=0;step<400;step++){
     const next=advanceSpecialProjectile(x,y,target.x,target.y,300,step%6?1/60:.12);
     x=next.x;y=next.y;
     if(next.arrived){arrived=true;break;}
   }
   assert.equal(arrived,true,'não alcançou '+JSON.stringify(target));
   assert.ok(Math.abs(x-target.x)<1e-8);
   assert.ok(Math.abs(y-target.y)<1e-8);
 }
 const over=advanceSpecialProjectile(480,400,480,200,300,5);
 assert.deepEqual(over,{x:480,y:200,arrived:true});
 const exact=advanceSpecialProjectile(480,200,480,200,300,.016);
 assert.deepEqual(exact,{x:480,y:200,arrived:true});
});

test('A mira e os efeitos Brasil, Rússia, China e Coreia compartilham detonação garantida',()=>{
 const countries=['br','ru','cn','jp'];
 for(const country of countries){
   const build=v1SpecialConfig({choices:[country,country]});
   assert.equal(build.primary,country);
 }
 assert.match(source,/const next=advanceSpecialProjectile\(/);
 assert.match(source,/if \(bullet\.special && \(/);
 assert.match(source,/if\(bullet\.hybridConfig\)this\.detonateV1HybridSpecial\(bullet\.tx,bullet\.ty,bullet\.hybridConfig\)/);
 assert.match(source,/if \(!remove && !bullet\.special && \(/);
 assert.doesNotMatch(source,/bullet\.special && Phaser\.Math\.Distance\.Between\(/);
});
