import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hitDiscoGlobe,DISCO_DURATION_MS,DISCO_REFLECTION_COOLDOWN_MS} from '../src/gameplay/discoGlobe.js';
import {DISCO_REFLECTION_MAX_VISUAL_RAYS} from '../src/gameplay/discoReflectionVfx.js';
import {nextKoreanRicochet} from '../src/gameplay/koreanLaserSalvo.js';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
const globe={x:100,y:100,expiresAt:DISCO_DURATION_MS};
test('colisão contínua pega balas rápidas, descarta erros de mira e expira em 4s',()=>{
 assert.ok(hitDiscoGlobe([globe],100,250,100,0,3999));
 assert.equal(hitDiscoGlobe([globe],140,250,140,0,2000),null);
 assert.equal(hitDiscoGlobe([globe],100,250,100,0,4000),null);
 assert.equal(hitDiscoGlobe([globe],0,0,0,0,0),null);
});
test('primeiro globo na trajetória recebe o tiro, independentemente da ordem do array',()=>{
 const near={...globe,y:200};
 assert.equal(hitDiscoGlobe([globe,near],100,300,100,0,0).globe,near);
});
const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const start=source.indexOf('  fireV1DiscoReflections(');
const end=source.indexOf('\n  pushV1EnemiesUp',start);
assert.ok(start>=0&&end>start,'método de reflexos encontrado');
const fire=new Function('DISCO_REFLECTION_MAX_VISUAL_RAYS','DISCO_REFLECTION_COOLDOWN_MS',
 'nextKoreanRicochet','playSfx','return ({'+source.slice(start,end)+'}).fireV1DiscoReflections')(
 DISCO_REFLECTION_MAX_VISUAL_RAYS,DISCO_REFLECTION_COOLDOWN_MS,nextKoreanRicochet,()=>{});
const build=level=>v1SpecialConfig({choices:Array(level).fill('jp')});
const shot={koreanBouncesLeft:0};
function scene(count=25,touch=false){
 const hits=[],arcs=[];
 return {elapsed:500,sys:{game:{device:{input:{touch}}}},
 enemies:Array.from({length:count},(_,i)=>({uid:i+1,type:1,sprite:{x:120+i*4,y:100,active:true}})),
 drawV1DiscoReflectionArcs(x,y,targets){arcs.push({x,y,targets});},
 impactInvader(index,damage){hits.push({id:this.enemies[index].uid,damage});},hits,arcs};
}
test('reflexos iniciais usam alvos distintos e dividem o orçamento da salva',()=>{
 for(const [level,limit,budget] of [[2,3,7.2],[4,6,14.4],[6,12,26.4],[8,24,43.2]]){
  for(const available of [2,25]){
   const s=scene(available),orb={};
   fire.call(s,100,100,build(level),orb,shot);
   assert.equal(s.hits.length,Math.min(available,limit));
   assert.equal(new Set(s.hits.map(h=>h.id)).size,s.hits.length);
   assert.ok(Math.abs(s.hits.reduce((total,h)=>total+h.damage,0)-budget)<1e-9);
   assert.equal(orb.lastReflectAt,s.elapsed);
  }
 }
});
test('cada ramo herda os saltos, retém 85% do dano e não repete alvos',()=>{
 const s=scene(5),b=build(2);
 fire.call(s,100,100,b,{}, {koreanBouncesLeft:2,hitEnemyIds:new Set([1])});
 assert.equal(s.hits.length,9);
 for(let branch=0;branch<3;branch++){
  const hits=s.hits.slice(branch*3,branch*3+3);
  assert.equal(new Set(hits.map(h=>h.id)).size,3);
  assert.ok(hits.every(h=>h.id!==1));
  assert.ok(Math.abs(hits[0].damage-b.krSalvoDamage/3)<1e-9);
  assert.ok(Math.abs(hits[1].damage-hits[0].damage*.85)<1e-9);
  assert.ok(Math.abs(hits[2].damage-hits[1].damage*.85)<1e-9);
 }
});
test('cada globo respeita 180 ms no desktop e 350 ms no touch',()=>{
 for(const touch of [false,true]){
  const s=scene(25,touch),orb={},b=build(8),cooldown=touch?350:180;
  fire.call(s,100,100,b,orb,shot);
  const count=touch?6:24;
  assert.equal(s.hits.length,count);
  for(let delta=1;delta<cooldown;delta+=9){
   s.elapsed=500+delta;fire.call(s,100,100,b,orb,shot);
  }
  assert.equal(s.hits.length,count);
  s.elapsed=500+cooldown;fire.call(s,100,100,b,orb,shot);
  assert.equal(s.hits.length,count*2);
  assert.equal(s.arcs.length,2);
 }
});
test('alvos mortos, fora do raio e Tipo 6 não recebem reflexos',()=>{
 const s=scene(4),b=build(8),orb={};
 s.enemies[0].sprite.active=false;s.enemies[1].sprite.x=500;s.enemies[2].type=6;
 fire.call(s,100,100,b,orb,shot);
 assert.deepEqual(s.hits.map(h=>h.id),[4]);
 s.elapsed+=180;s.enemies=[];
 fire.call(s,100,100,b,orb,shot);
 assert.equal(s.hits.length,1);
 assert.equal(orb.lastReflectAt,500,'sem alvo não inicia cooldown');
});
test('eliminação durante um ramo não causa acesso a alvo removido',()=>{
 const s=scene(2);
 s.impactInvader=function(index,damage){
  this.hits.push({id:this.enemies[index].uid,damage});this.enemies.splice(index,1);
 };
 fire.call(s,100,100,build(8),{});
 assert.equal(s.hits.length,2);assert.equal(s.enemies.length,0);
});
test('limite visual não corta dano; touch limita o número de saltos',()=>{
 const desktop=scene(25);
 fire.call(desktop,100,100,build(8),{},shot);
 assert.equal(desktop.hits.length,24);assert.equal(desktop.arcs.length,1);
 assert.ok(desktop.arcs[0].targets.length<=DISCO_REFLECTION_MAX_VISUAL_RAYS);
 const touch=scene(25,true);
 fire.call(touch,100,100,build(8),{}, {koreanBouncesLeft:7});
 assert.equal(touch.hits.length,6*3,'seis ramos com impacto inicial e dois saltos');
 assert.ok(touch.arcs[0].targets.length<=DISCO_REFLECTION_MAX_VISUAL_RAYS);
});

