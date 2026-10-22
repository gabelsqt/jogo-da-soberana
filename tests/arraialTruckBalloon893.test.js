import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  ARRAIAL,ARRAIAL_TRUCK_PHRASES,arraialFinalPhrase,randomArraialBurst,
  shotHitsArraialBalloon,withinBlast,
} from '../src/gameplay/arraialBrasil2.js';
import {enemyStats} from '../src/gameplay/enemies.js';
import {V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('mini-rojões pequenos matam um Tipo 1 básico, mas Tipo 2 sobrevive',()=>{
 assert.equal(ARRAIAL.fireworkRadius,27);
 assert.equal(ARRAIAL.fireworkDamage,1);
 assert.equal(enemyStats(1,1).hp,ARRAIAL.fireworkDamage);
 assert.ok(enemyStats(2,1).hp>ARRAIAL.fireworkDamage);
 assert.equal(ARRAIAL.finaleRadius,ARRAIAL.orbitRadius);
 assert.equal(ARRAIAL.maxBurstVisuals,10);
});

test('rojões se espalham por toda a área circular do balão (não no centro fixo)',()=>{
 const angles=[0,.25,.5,.75,.93];
 const scales=[0,.04,.2,.5,.95,1];
 for(const angle of angles)for(const scale of scales){
  const p=randomArraialBurst(240,180,110,(()=>{let i=0;return()=>[angle,scale][i++];})());
  const distance=Math.hypot(p.x-240,p.y-180);
  assert.ok(distance<=110+1e-8);
  assert.ok(Math.abs(distance-110*Math.sqrt(scale))<1e-7);
 }
 const seen=new Set();
 let seed=7;
 for(let i=0;i<120;i++){
  const p=randomArraialBurst(200,140,100,()=>{
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   return seed/4294967296;
  });
  assert.ok(Math.hypot(p.x-200,p.y-140)<=100+1e-7);
  seen.add(Math.round(p.x/10)+','+Math.round(p.y/10));
 }
 assert.ok(seen.size>80,'deve variar amplamente por toda a área');
});

test('só tiros que cruzam o balão o acionam; trajetórias de FPS baixo não atravessam',()=>{
 assert.ok(shotHitsArraialBalloon(90,170,300,170,195,170,0));
 assert.ok(shotHitsArraialBalloon(90,190,300,190,195,170,2));
 assert.equal(shotHitsArraialBalloon(90,215,300,215,195,170,3),false);
 assert.equal(shotHitsArraialBalloon(100,100,120,100,195,170,3),false);
 assert.ok(shotHitsArraialBalloon(195,170,195,170,195,170));
 assert.equal(shotHitsArraialBalloon(240,240,240,240,195,170),false);
});

test('frases de caminhão são sorteadas com indices válidos e cabem como evento curto',()=>{
 assert.ok(ARRAIAL_TRUCK_PHRASES.length>=8);
 assert.equal(new Set(ARRAIAL_TRUCK_PHRASES).size,ARRAIAL_TRUCK_PHRASES.length);
 assert.ok(ARRAIAL_TRUCK_PHRASES.every(s=>s.length>=15&&s.length<=55));
 assert.equal(arraialFinalPhrase(()=>0),ARRAIAL_TRUCK_PHRASES[0]);
 assert.equal(arraialFinalPhrase(()=>.99999),ARRAIAL_TRUCK_PHRASES.at(-1));
 const phraseSet=new Set(Array.from({length:ARRAIAL_TRUCK_PHRASES.length},(_,i)=>
    arraialFinalPhrase(()=>(i+.5)/ARRAIAL_TRUCK_PHRASES.length)));
 assert.equal(phraseSet.size,ARRAIAL_TRUCK_PHRASES.length);
});

test('código do Arraial exige acerto direto no balão; não agenda fogos automáticos',()=>{
 const create=game.slice(game.indexOf('  createArraial('),game.indexOf('  arraialDamage('));
 const update=game.slice(game.indexOf('  updateArraial() {'),
   game.indexOf('  updateArraialFlames() {'));
 const shoot=game.slice(game.indexOf('  updatePlayerProjectiles(dt) {'),
   game.indexOf('  damageCannon('));
 assert.match(create,/this\.arraialNuclei\.push/);
 assert.doesNotMatch(create,/fireworkSchedule/);
 assert.doesNotMatch(update,/n\.events|n\.next|fireworkSchedule/);
 assert.match(shoot,/shotHitsArraialBalloon\(previousX,previousY/);
 assert.match(shoot,/randomArraialBurst\(n\.x,n\.y,n\.radius\)/);
 assert.match(shoot,/this\.arraialFirework\(p\.x,p\.y,n\.bursts\+\+,true\)/);
 assert.match(shoot,/remove=true;/);
 assert.ok(shoot.indexOf('shotHitsArraialBalloon')<shoot.indexOf('if (!remove && !bullet.special)'));
});

test('o splash causa dano normal em inimigos e projéteis, inclusive bombas resistentes',()=>{
 const area=game.slice(game.indexOf('  arraialDamage('),
    game.indexOf('  arraialFirework('));
 assert.match(area,/this\.impactInvader\(i,amount,0,color,false\)/);
 assert.match(area,/bullet\.hp=Math\.max\(0,\(bullet\.hp\?\?1\)-amount\)/);
 assert.match(area,/if\(bullet\.colossal\)detonateType6Bomb/);
 assert.match(area,/else this\.removeEnemyBullet\(i,true\)/);
 assert.match(area,/else this\.showEnemyBulletHit\(bullet\)/);
 assert.ok(withinBlast(0,0,20,0,0,ARRAIAL.fireworkRadius));
 assert.ok(!withinBlast(0,0,40,0,0,ARRAIAL.fireworkRadius));
});

test('estouro final cobre a área, exibe frase e não deixa balão persistente',()=>{
 const update=game.slice(game.indexOf('  updateArraial() {'),
   game.indexOf('  updateArraialFlames() {'));
 assert.match(update,/this\.arraialDamage\(n\.x,n\.y,n\.radius,ARRAIAL\.finaleDamage/);
 assert.match(update,/arraialFinalPhrase\(\)/);
 assert.match(update,/truck\.destroy\(\)/);
 assert.match(update,/n\.graphics\.destroy\(\); this\.arraialNuclei\.splice\(i,1\)/);
 assert.match(update,/g\.strokeCircle\(n\.x,n\.y,n\.radius\)/);
 assert.match(update,/const radius=8\+\(n\.radius-8\)\*t/);
 assert.ok(V1_UPGRADES.br[1].description.includes('Balão de Rojões'));
 assert.ok(V1_UPGRADES.br[3].description.includes('área ampliada'));
});

test('efeitos visuais têm teto mas dano roda para todos os acertos',()=>{
 const firework=game.slice(game.indexOf('  arraialFirework('),
   game.indexOf('  updateArraial() {'));
 assert.ok(firework.indexOf('this.arraialDamage')<
   firework.indexOf('if(this.arraialBurstVisuals>=ARRAIAL.maxBurstVisuals)return'));
 assert.match(firework,/const started=this\.time\.now,duration=290/);
 assert.match(firework,/this\.arraialBurstVisuals\+\+/);
 assert.match(firework,/this\.arraialBurstVisuals=Math\.max\(0,this\.arraialBurstVisuals-1\)/);
});
