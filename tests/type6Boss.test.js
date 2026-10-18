import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TYPE6_OFFSETS, createType6State, type6AliveModules,
  type6PointTarget, type6AreaTargets, type6SegmentTargets, type6HullContains,
  type6Damage, type6ModuleVisualState, advanceType6Cruise,
} from '../src/gameplay/type6Boss.js';

test('quatro hitboxes simétricas sem sobreposição; núcleo protegido',()=>{
  const s=createType6State('alien',800);
  assert.equal(s.modules.length,4);
  assert.deepEqual(s.modules.map(m=>m.offsetX),TYPE6_OFFSETS);
  for(let i=0;i<4;i++){
    assert.equal(type6PointTarget(s,480,125,480+TYPE6_OFFSETS[i],125),i);
  }
  assert.equal(type6PointTarget(s,480,125,480,125),null);
  assert.equal(type6HullContains(480,125,480,125),true);
  assert.equal(type6PointTarget(s,480,125,480,125+120),null);
  assert.deepEqual(type6AreaTargets(s,480,125,480,125,170),[1,2]);
});

test('escudos independentes, sem regeneração e sem dano excedente do tiro que os quebra',()=>{
  const s=createType6State('cn',800);
  const first=s.modules[0],second=s.modules[1];
  const shield=first.shield;
  const hit=type6Damage(s,0,shield+100);
  assert.equal(hit.shieldBroken,true);
  assert.equal(first.shield,0);
  assert.equal(first.hp,first.maxHp);
  assert.equal(second.shield,second.maxShield);
  assert.equal(type6ModuleVisualState(first),0);
  assert.equal(type6Damage(s,0,first.maxHp*0.5).moduleDestroyed,false);
  assert.equal(type6ModuleVisualState(first),1);
  assert.equal(type6Damage(s,0,first.maxHp*0.5).moduleDestroyed,true);
  assert.equal(type6ModuleVisualState(first),3);
  assert.equal(type6AliveModules(s).length,3);
  assert.equal(type6Damage(s,0,1000).damage,0);
  assert.equal(type6Damage(s,'core',1000).damage,0);
});
test('núcleo aparece só após os quatro módulos; então pode ser derrotado',()=>{
  const s=createType6State('ru',1200);
  for(let i of [2,0,3,1]){
    const m=s.modules[i];
    type6Damage(s,i,m.maxShield);
    const result=type6Damage(s,i,m.maxHp);
    assert.equal(result.moduleDestroyed,true);
    assert.equal(result.coreExposed,i===1);
  }
  assert.equal(s.coreExposed,true);
  assert.equal(type6PointTarget(s,480,125,480,125),'core');
  assert.deepEqual(type6SegmentTargets(s,480,125,480,540,480,0),['core']);
  assert.equal(type6Damage(s,'core',s.coreMaxHp).defeated,true);
  assert.equal(s.defeated,true);
});
test('cruzeiro horizontal respeita limites e não acelera ao perder módulos',()=>{
  const s=createType6State('us');
  const xs=[];
  for(let i=0;i<2000;i++)xs.push(advanceType6Cruise(s,0.016));
  assert.ok(xs.every(x=>x>=-65&&x<=65));
  assert.ok(xs.some(x=>x>60)&&xs.some(x=>x< -60));
  const speed=s.speed;
  for(let i=0;i<4;i++) {
    type6Damage(s,i,s.modules[i].maxShield);
    type6Damage(s,i,s.modules[i].maxHp);
  }
  assert.equal(s.speed,speed);
});
