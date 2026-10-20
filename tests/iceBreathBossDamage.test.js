import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ICE_BREATH_TICK_MS,iceBreathTickDamage,iceBreathType6Targets,
} from '../src/gameplay/iceBreath.js';
import {v1CombatStats} from '../src/gameplay/v1Upgrades.js';
import {finaleBossHp} from '../src/gameplay/finaleBalance.js';
import {
  createType6State,type6FinishBarrierCharge,type6TargetRects,type6Damage,
} from '../src/gameplay/type6Boss.js';

const russian=v1CombatStats({choices:Array(10).fill('ru')});

test('sopro contínuo tem dano mínimo próprio, somado ao componente escalável',()=>{
  assert.equal(iceBreathTickDamage(0),4);
  assert.equal(iceBreathTickDamage(0,true),28);
  assert.ok(Math.abs(iceBreathTickDamage(russian.basicDamage)-9.616)<1e-7);
  assert.ok(Math.abs(iceBreathTickDamage(russian.basicDamage,true)-33.616)<1e-7);
  assert.equal(ICE_BREATH_TICK_MS,110);
});

test('o cone encontra módulos laterais do Tipo 6 mesmo sem acertar o centro',()=>{
  const boss=createType6State('alien',700);
  const targets=type6TargetRects(boss,480,125);
  const muzzle={x:480,y:455};
  const left=targets[0];
  const angle=Math.atan2(left.y-muzzle.y,left.x-muzzle.x);
  const hit=iceBreathType6Targets(muzzle.x,muzzle.y,angle,targets);
  assert.ok(hit.some(rect=>rect.id===left.id));
  assert.ok(!hit.some(rect=>rect.id===3),'o cone não atinge o lado oposto');
});

for(const mode of ['wave10','wave11']){
  test('Rússia nível 10 pode destruir barreira, módulos e núcleo Tipo 6 em 30 s ('+mode+')',()=>{
    const baseHp=finaleBossHp(mode,russian,1);
    const boss=createType6State('alien',baseHp);
    boss.introComplete=true;type6FinishBarrierCharge(boss);
    const ox=480,oy=455,cx=480,cy=125;
    const d=iceBreathTickDamage(russian.basicDamage,true);
    let revealTicks=0;
    let defeatedAt=null;
    for(let tick=0;tick<Math.floor(30000/ICE_BREATH_TICK_MS);tick++){
      if(boss.coreExposed&&boss.coreReveal<1){
        // Na luta, o núcleo demora a abrir. Simular 2 segundos de espera.
        if(++revealTicks>=Math.ceil(2000/ICE_BREATH_TICK_MS))
          boss.coreReveal=1;
      }
      const rects=type6TargetRects(boss,cx,cy);
      if(!rects.length)continue;
      // Jogador mira primeiro no gerador de escudos, depois nos demais
      // módulos e, por último, no núcleo exposto.
      const objective=rects.find(rect=>rect.id===3)??rects[0];
      const angle=Math.atan2(objective.y-oy,objective.x-ox);
      const targets=iceBreathType6Targets(ox,oy,angle,rects);
      if(!targets.length)continue;
      if(boss.barrier.active&&boss.barrier.hp>0){
        type6Damage(boss,targets[0].id,d);
      }else{
        for(const rect of targets){
          type6Damage(boss,rect.id,d);
          if(boss.defeated)break;
        }
      }
      if(boss.defeated){defeatedAt=(tick+1)*ICE_BREATH_TICK_MS;break;}
    }
    assert.ok(boss.defeated,
      'não derrotou Tipo 6 em 30 s; HP do chefe '+baseHp);
    assert.ok(defeatedAt<=30000);
    assert.ok(boss.modules.every(module=>module.broken));
    assert.equal(boss.coreHp,0);
  });
}
