import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TYPE6_ROLES,TYPE6_OFFSETS,TYPE6_TURN_ORDER,
  TYPE6_OPENING_SECONDS,TYPE6_REBUILD_SECONDS,
  TYPE6_LASER_CHARGE_SECONDS,TYPE6_LASER_FIRE_SECONDS,
  createType6State,type6AliveModules,type6PointTarget,type6AreaTargets,
  type6SegmentTargets,type6HullContains,type6Damage,type6ModuleVisualState,
  type6NextModule,type6BeginBarrierCharge,type6FinishBarrierCharge,
  advanceType6Cruise,
} from '../src/gameplay/type6Boss.js';

test('quatro módulos compartilhados e vida igual; núcleo permanece fechado',()=>{
  for(const country of ['alien','us','jp','ru','cn']){
    const s=createType6State(country,1000);
    assert.deepEqual(s.modules.map(m=>m.role),TYPE6_ROLES);
    assert.deepEqual(s.modules.map(m=>m.offsetX),TYPE6_OFFSETS);
    assert.equal(s.modules.length,4);
    assert.ok(s.modules.every(m=>m.hp===s.modules[0].hp));
    assert.equal(s.modules[0].maxHp,360);
    assert.equal(s.coreMaxHp,160);
    assert.ok(s.modules[0].maxHp>s.coreMaxHp);
    assert.equal(s.barrier.maxHp,s.modules[0].maxHp*0.85);
    assert.equal(s.barrier.active,false);
    assert.ok(s.modules.every(m=>m.shield===m.maxHp*0.42));
    assert.equal(type6PointTarget(s,480,125,480,125),null);
  }
  assert.equal(type6HullContains(480,125,480,125),true);
  assert.equal(TYPE6_OPENING_SECONDS,2);
  assert.equal(TYPE6_REBUILD_SECONDS,6);
  assert.equal(TYPE6_LASER_CHARGE_SECONDS,10);
  assert.equal(TYPE6_LASER_FIRE_SECONDS,3);
});
test('barreira bloqueia todos os módulos, núcleo e até explosões/lasers',()=>{
  const s=createType6State('jp',1000);
  assert.equal(type6FinishBarrierCharge(s),true);
  assert.equal(type6PointTarget(s,480,125,225,125),'barrier');
  assert.deepEqual(type6AreaTargets(s,480,125,480,125,150),['barrier']);
  assert.deepEqual(type6SegmentTargets(s,480,125,480,530,225,125,4),['barrier']);
  const hp=s.modules[0].hp,shield=s.modules[0].shield;
  const hit=type6Damage(s,0,s.barrier.maxHp*0.5);
  assert.equal(hit.targetId,'barrier');
  assert.equal(s.modules[0].hp,hp);
  assert.equal(s.modules[0].shield,shield);
  const broken=type6Damage(s,'barrier',99999);
  assert.equal(broken.barrierBroken,true);
  assert.equal(s.barrier.active,false);
  assert.equal(type6PointTarget(s,480,125,225,125),0);
});
test('escudos individuais são independentes e absorvem dano sem excedente',()=>{
  const s=createType6State('alien',1000);
  const a=s.modules[0],b=s.modules[1];
  const hit=type6Damage(s,0,a.maxShield+999);
  assert.equal(hit.moduleShieldBroken,true);
  assert.equal(a.hp,a.maxHp);
  assert.equal(b.shield,b.maxShield);
  assert.equal(type6ModuleVisualState(a),0);
  type6Damage(s,0,a.maxHp*0.7);
  assert.equal(type6ModuleVisualState(a),2);
  assert.equal(type6Damage(s,0,a.maxHp).moduleDestroyed,true);
  assert.equal(type6AliveModules(s).length,3);
});
test('gerador completamente destruído impede carga e derruba barreira',()=>{
  const s=createType6State('ru',1000);
  type6FinishBarrierCharge(s);
  const m=s.modules[3];
  // O tiro que remove a barreira não atravessa para o escudo do gerador.
  assert.equal(type6Damage(s,3,9999).barrierBroken,true);
  assert.equal(m.shield,m.maxShield);
  type6FinishBarrierCharge(s);
  type6Damage(s,3,s.barrier.maxHp);
  type6Damage(s,3,m.maxShield);
  type6Damage(s,3,m.maxHp);
  assert.equal(m.broken,true);
  assert.equal(s.barrier.active,false);
  assert.equal(type6BeginBarrierCharge(s),false);
  assert.equal(type6FinishBarrierCharge(s),false);
});
test('ordem fixa ignora módulos destruídos e gerador intacto pula turno',()=>{
  const s=createType6State('cn');
  assert.deepEqual(TYPE6_TURN_ORDER,[2,0,1,3]);
  assert.deepEqual(Array.from({length:4},()=>type6NextModule(s).role),
    ['hangar','bombardment','laser','generator']);
  type6FinishBarrierCharge(s);
  assert.equal(type6NextModule(s).role,'hangar');
  assert.equal(type6NextModule(s).role,'bombardment');
  assert.equal(type6NextModule(s).role,'laser');
  assert.equal(type6NextModule(s).role,'hangar'); // Pula gerador já protegido
});
test('núcleo recebe somente após destruir quatro módulos e abrir blindagem',()=>{
  const s=createType6State('us',1200);
  for(const i of [2,0,3,1]){
    const m=s.modules[i];
    type6Damage(s,i,m.maxShield);
    const result=type6Damage(s,i,m.maxHp);
    assert.equal(result.moduleDestroyed,true);
    assert.equal(result.coreExposed,i===1);
  }
  assert.equal(s.coreExposed,true);
  assert.equal(type6Damage(s,'core',1000).damage,0); // Dois segundos de abertura
  s.coreReveal=1;
  assert.equal(type6PointTarget(s,480,125,480,125),'core');
  assert.deepEqual(type6SegmentTargets(s,480,125,480,540,480,0),['core']);
  assert.equal(type6Damage(s,'core',s.coreMaxHp).defeated,true);
});
test('cruzeiro horizontal conserva velocidade e respeita bordas',()=>{
  const s=createType6State('alien');
  const positions=Array.from({length:2000},()=>advanceType6Cruise(s,0.016));
  assert.ok(positions.every(x=>x>=-65&&x<=65));
  assert.ok(positions.some(x=>x>60)&&positions.some(x=>x< -60));
});
