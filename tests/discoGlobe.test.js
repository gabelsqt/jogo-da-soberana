import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hitDiscoGlobe, DISCO_DURATION_MS, DISCO_REFLECTION_COOLDOWN_MS } from '../src/gameplay/discoGlobe.js';
import { DISCO_REFLECTION_MAX_VISUAL_RAYS } from '../src/gameplay/discoReflectionVfx.js';
import { v1SpecialConfig } from '../src/gameplay/v1Specials.js';
const globe={x:100,y:100,expiresAt:DISCO_DURATION_MS};
test('colisão contínua pega balas rápidas, descarta erros de mira e expira exatamente em 4s',()=>{
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
const start=source.indexOf('  fireV1DiscoReflections(x,y,build,globe) {');
const end=source.indexOf('\n  pushV1EnemiesUp',start);
const fire=new Function('DISCO_REFLECTION_MAX_VISUAL_RAYS','DISCO_REFLECTION_COOLDOWN_MS',
 `return ({${source.slice(start,end)}}).fireV1DiscoReflections`)(
 DISCO_REFLECTION_MAX_VISUAL_RAYS,DISCO_REFLECTION_COOLDOWN_MS);
function scene(){
 const hits=[],arcs=[];
 return {elapsed:500,enemies:[{uid:1,sprite:{x:120,y:100}},{uid:2,sprite:{x:140,y:100}}],
 drawV1DiscoReflectionArcs(x,y,targets){arcs.push({x,y,targets});},
 impactInvader(index,damage){hits.push({id:this.enemies[index].uid,damage});},hits,arcs};
}
test('cada ativação mantém quantidade de raios, com teto de dano por salva',()=>{
 for(const [level,count,budget] of [[2,3,3],[4,6,5],[6,12,7.5],[8,24,10]]){
  const s=scene(),b=v1SpecialConfig({choices:Array(level).fill('jp')});
  const orb={lastVisualAt:-Infinity,lastReflectAt:-Infinity};
  fire.call(s,100,100,b,orb);
  assert.equal(s.hits.length,count);
  assert.equal(new Set(s.hits.map(h=>h.id)).size,2);
  assert.ok(s.hits.every(h=>h.damage===b.krReflectDamage));
  assert.ok(Math.abs(s.hits.reduce((total,h)=>total+h.damage,0)-budget)<1e-9);
  assert.equal(orb.lastReflectAt,s.elapsed);
 }
});
test('disparos consecutivos na bola respeitam cooldown real de 180 ms',()=>{
 const s=scene(),b=v1SpecialConfig({choices:Array(8).fill('jp')});
 const orb={lastVisualAt:-Infinity,lastReflectAt:-Infinity};
 fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,24);
 for(let delta=1;delta<DISCO_REFLECTION_COOLDOWN_MS;delta+=9){
  s.elapsed=500+delta;
  fire.call(s,100,100,b,orb);
 }
 assert.equal(s.hits.length,24);
 s.elapsed=500+DISCO_REFLECTION_COOLDOWN_MS;
 fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,48);
 assert.equal(s.arcs.length,2);
});
test('alvos eliminados são ignorados e globos sem alvos não disparam',()=>{
 const s=scene(),b=v1SpecialConfig({choices:Array(8).fill('jp')});
 const orb={lastVisualAt:-Infinity,lastReflectAt:-Infinity};
 s.impactInvader=function(index){this.hits.push(this.enemies[index].uid);this.enemies.splice(index,1);};
 fire.call(s,100,100,b,orb);assert.equal(s.hits.length,2);
 s.elapsed+=DISCO_REFLECTION_COOLDOWN_MS;
 fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,2);
 assert.equal(orb.lastReflectAt,500);
});
test('raios preservam feedback visual limitado em salvas permitidas',()=>{
 const s=scene(),b=v1SpecialConfig({choices:Array(8).fill('jp')});
 const orb={lastVisualAt:-Infinity,lastReflectAt:-Infinity};
 fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,b.krReflections);
 assert.equal(s.arcs.length,1);
 assert.ok(s.arcs[0].targets.length<=DISCO_REFLECTION_MAX_VISUAL_RAYS);
 s.elapsed+=40;fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,b.krReflections);
 assert.equal(s.arcs.length,1);
 s.elapsed+=DISCO_REFLECTION_COOLDOWN_MS-40;fire.call(s,100,100,b,orb);
 assert.equal(s.hits.length,b.krReflections*2);
 assert.equal(s.arcs.length,2);
});
