import {
  TYPE6_PALETTES,TYPE6_CHARGE_MS,TYPE6_OPENING_SECONDS,TYPE6_REBUILD_SECONDS,
  TYPE6_LASER_CHARGE_SECONDS,TYPE6_LASER_FIRE_SECONDS,TYPE6_TURN_GAP_SECONDS,
  createType6State,advanceType6Cruise,type6AliveModules,type6NextModule,
  type6BeginBarrierCharge,type6FinishBarrierCharge,type6BarrierActive,
  type6Damage,type6PointTarget,type6AreaTargets,type6SegmentTargets,
  type6HullContains,TYPE6_OFFSETS,
} from './type6Boss.js';
import {drawType6Ship} from './type6Visual.js';

const W=960,H=540,CANNON={x:480,y:494};
const COLOR={alien:0xff304c,us:0xffa34e,ru:0x88e4ff,jp:0xe6a1ff,cn:0xffd66c};
export function spawnType6Encounter(scene,options={}){
  const country=TYPE6_PALETTES[options.bossCountry]?options.bossCountry:'alien';
  const state=createType6State(country,options.hp);
  const sprite=scene.add.container(W/2,-90).setDepth(21);
  const graphics=scene.add.graphics();sprite.add(graphics);
  const enemy={
    uid:scene.nextEnemyId++,type:6,level:10,
    definition:{width:790,height:122,color:TYPE6_PALETTES[country].light},
    sprite,graphics,type6:state,finalBoss:true,bossCountry:country,
    hp:state.coreHp,maxHp:state.coreMaxHp,sourceBossId:null,
    phase:'arrival6',age:0,phaseAge:0,
    shockOffset:{x:0,y:0,vx:0,vy:0},russianPullOffset:{x:0,y:0},
    hitVisualOffsetX:0,electricSlowUntil:-1,frozenUntil:-1,
    recoilSpeed:0,velocityX:0,velocityY:0,
    lastHitAt:-Infinity,target:scene.chooseDefenseTarget(),
    baseScaleX:1,baseScaleY:1,box:null,bossLabel:null,
  };
  scene.enemies.push(enemy);
  // A luta só começa após a entrada. A cena mantém o tempo da onda congelado.
  scene.boss6IntroPaused=true;scene.elapsed=0;
  state.introStart=scene.time.now;
  state.introDuration=country==='alien'?2400:2600;
  scene.showAttackWarning('CUBO NEWS — FORTALEZA GIGANTE NO CÉU!');
  scene.queueCuboNews?.('FORTALEZA HOSTIL APARECE NO HORIZONTE',
    'A estrutura ocupa a faixa superior da cidade. Defesa brasileira inicia operações.');
  const interference=scene.add.rectangle(W/2,H/2,W,H,0x030914,0.30).setDepth(24);
  scene.tweens.add({targets:interference,alpha:0,duration:state.introDuration,
    onComplete:()=>interference.destroy()});
  scene.cameras.main.shake(340,0.0024);
  drawType6Ship(graphics,state,scene.time.now);
  return enemy;
}
function burst(scene,x,y,color,size=25){
  const g=scene.add.graphics().setPosition(x,y).setDepth(60);
  g.fillStyle(color,0.3).fillCircle(0,0,size);
  g.lineStyle(3,0xffffff,0.8).strokeCircle(0,0,size*0.75);
  g.lineStyle(2,color,0.95);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    g.lineBetween(Math.cos(a)*size*0.45,Math.sin(a)*size*0.45,
      Math.cos(a)*size*1.45,Math.sin(a)*size*1.45);
  }
  scene.tweens.add({targets:g,alpha:0,scale:1.5,duration:280,onComplete:()=>g.destroy()});
}
function warning(scene,enemy,module,color){
  const x=enemy.sprite.x+module.offsetX,y=enemy.sprite.y+30;
  const line=scene.add.graphics().setDepth(44);
  line.lineStyle(2,color,0.8).lineBetween(x,y,CANNON.x,CANNON.y-20);
  line.fillStyle(color,0.8).fillCircle(x,y,9);
  scene.tweens.add({targets:line,alpha:0,duration:360,onComplete:()=>line.destroy()});
}
function fireBomb(scene,enemy,module){
  const s=enemy.type6,p=TYPE6_PALETTES[s.country];
  const x=enemy.sprite.x+module.offsetX,y=enemy.sprite.y+46;
  const target={kind:'cannon',x:CANNON.x,y:CANNON.y};
  const dx=target.x-x,dy=target.y-y;
  const speed=Math.hypot(dx,dy)/7;
  const us=s.country==='us',ru=s.country==='ru',cn=s.country==='cn';
  const size=us?58:cn?43:38;
  const sprite=scene.add.rectangle(x,y,size,size*(cn?0.67:1),ru?0x8bdcff:us?0xd8e0e6:p.light)
    .setStrokeStyle(3,ru?0xffffff:p.glow).setDepth(33);
  scene.enemyBullets.push({
    sprite,target,vx:dx/7,vy:dy/7,damage:us?999:65,
    hp:module.maxHp*0.25,colossal:true,sourceBossId:enemy.uid,
    sourceModuleId:module.id,frostMs:ru?2000:0,cryoImpact:ru,
    instantUnshielded:us,droneContainer:cn,
  });
  scene.showAttackWarning(us?'MÍSSIL COLOSSAL! INTERCEPTE!':
    ru?'BOMBA CRIOGÊNICA!':cn?'DRONE-CONTÊINER!':'BOMBA COLOSSAL!');
}
function launchHangar(scene,enemy,module){
  const s=enemy.type6,n=s.country==='cn'?10:3,cap=s.country==='cn'?30:6;
  const active=scene.enemies.filter(e=>e.sourceBossId===enemy.uid&&e.type===3).length;
  if(active+n>cap)return;
  for(let i=0;i<n;i++){
    const spread=s.country==='cn'?(i-(n-1)/2)*43:(i-1)*66;
    const x=Math.max(56,Math.min(W-56,enemy.sprite.x+module.offsetX+spread));
    scene.spawnEnemy(3,{level:9,x,y:enemy.sprite.y+64,
      sourceBossId:enemy.uid,skipPortal:true});
  }
  s.summons+=n;
  burst(scene,enemy.sprite.x+module.offsetX,enemy.sprite.y+40,
    TYPE6_PALETTES[s.country].light,22);
}
function beginModuleAction(scene,enemy,module){
  const s=enemy.type6,role=module.role;
  warning(scene,enemy,module,TYPE6_PALETTES[s.country].light);
  if(role==='generator'){
    if(!type6BeginBarrierCharge(s))return;
    s.action={kind:'barrier',moduleId:module.id,elapsed:0};
    scene.showAttackWarning('GERADOR RECONSTRUINDO A BARREIRA!');
  }else if(role==='laser'){
    s.action={kind:'laserCharge',moduleId:module.id,elapsed:0,interruptDamage:0};
    scene.showAttackWarning('LASER DE CERCO — 10 SEGUNDOS!');
  }else if(role==='hangar'){
    s.action={kind:'hangar',moduleId:module.id,elapsed:0};
    scene.showAttackWarning('HANGAR ABERTO — TRÊS INVASORES!');
  }else{
    s.action={kind:'bomb',moduleId:module.id,elapsed:0};
  }
}
function stopAction(enemy){
  enemy.type6.action=null;
  enemy.type6.attackClock=0;
  enemy.type6.barrier.charging=false;
  enemy.type6.barrier.progress=0;
}
function updateModuleAction(scene,enemy,dt){
  const s=enemy.type6,a=s.action;
  if(!a)return;
  const m=s.modules[a.moduleId];
  if(m.broken){stopAction(enemy);return;}
  a.elapsed+=dt;
  if(a.kind==='barrier'){
    s.barrier.progress=Math.min(1,a.elapsed/TYPE6_REBUILD_SECONDS);
    if(a.elapsed>=TYPE6_REBUILD_SECONDS){
      if(type6FinishBarrierCharge(s)){
        burst(scene,enemy.sprite.x+m.offsetX,enemy.sprite.y,
          TYPE6_PALETTES[s.country].barrier,45);
      }
      s.action=null;s.attackClock=0;
    }
  }else if(a.kind==='laserCharge'){
    if(a.elapsed>=TYPE6_LASER_CHARGE_SECONDS){
      s.action={kind:'laserFire',moduleId:m.id,elapsed:0};
      scene.showAttackWarning('LASER DE CERCO — IMPACTO!');
    }
  }else if(a.kind==='laserFire'){
    // Feixe contínuo por três segundos; destruir o módulo o encerra.
    scene.damageCannon(45*dt);
    if(a.elapsed>=TYPE6_LASER_FIRE_SECONDS){s.action=null;s.attackClock=0;}
  }else if(a.kind==='hangar'){
    if(a.elapsed>=2){launchHangar(scene,enemy,m);s.action=null;s.attackClock=0;}
  }else if(a.kind==='bomb'){
    if(a.elapsed>=0.65){fireBomb(scene,enemy,m);s.action=null;s.attackClock=0;}
  }
}
function drawActiveLaser(scene,enemy){
  if(!enemy.laserGraphics)enemy.laserGraphics=scene.add.graphics().setDepth(52);
  const g=enemy.laserGraphics;g.clear();
  const a=enemy.type6.action;
  if(a?.kind!=='laserFire')return;
  const x=enemy.sprite.x+enemy.type6.modules[1].offsetX,y=enemy.sprite.y+36;
  const color=enemy.bossCountry==='jp'?0xf5a3ff:0xff334f;
  g.lineStyle(40,color,0.22).lineBetween(x,y,CANNON.x,CANNON.y);
  g.lineStyle(14,color,0.88).lineBetween(x,y,CANNON.x,CANNON.y);
  g.lineStyle(4,0xffffff,0.95).lineBetween(x,y,CANNON.x,CANNON.y);
  if(enemy.bossCountry==='jp'){
    g.lineStyle(3,0x6efbff,0.80).lineBetween(x-9,y,CANNON.x-9,CANNON.y);
    g.lineStyle(3,0xffdb62,0.80).lineBetween(x+9,y,CANNON.x+9,CANNON.y);
  }
}
export function updateType6Encounter(scene,enemy,dt){
  const s=enemy.type6;
  enemy.age+=dt;enemy.phaseAge+=dt;s.phaseAge+=dt;
  if(!s.introComplete){
    const t=Math.min(1,(scene.time.now-s.introStart)/s.introDuration);
    const smooth=t*t*(3-2*t);
    enemy.sprite.y=-90+215*smooth;
    if(t>=1){
      s.introComplete=true;enemy.phase='boss6';
      scene.boss6IntroPaused=false;scene.elapsed=0;
    }
  }else{
    advanceType6Cruise(s,dt);enemy.sprite.x=W/2+s.shift;
    if(!s.firstShieldRaised&&s.openingClock<TYPE6_OPENING_SECONDS){
      s.openingClock+=dt;
      s.barrier.charging=!s.modules[3].broken;
      s.barrier.progress=Math.min(1,s.openingClock/TYPE6_OPENING_SECONDS);
      if(s.openingClock>=TYPE6_OPENING_SECONDS){
        s.barrier.charging=false;
        if(!s.modules[3].broken){
          type6FinishBarrierCharge(s);
          burst(scene,enemy.sprite.x+TYPE6_OFFSETS[3],enemy.sprite.y,
            TYPE6_PALETTES[s.country].barrier,44);
        }
        s.firstShieldRaised=true;s.attackClock=0;
      }
    }else if(!s.defeated){
      if(s.coreExposed&&s.coreReveal<1)s.coreReveal=Math.min(1,s.coreReveal+dt/2);
      if(s.action){
        updateModuleAction(scene,enemy,dt);
      }else if(!s.charging&&!s.coreExposed){
        s.attackClock+=dt;
        if(s.attackClock>=TYPE6_TURN_GAP_SECONDS){
          s.attackClock=0;
          const module=type6NextModule(s);
          if(module)beginModuleAction(scene,enemy,module);
        }
      }
    }
  }
  drawType6Ship(enemy.graphics,s,scene.time.now);
  drawActiveLaser(scene,enemy);
}
function hitTarget(scene,enemy,id,damage){
  const s=enemy.type6,p=TYPE6_PALETTES[s.country],previousShield=type6BarrierActive(s);
  const result=type6Damage(s,id,damage);
  if(!result.damage)return false;
  const module=typeof id==='number'?s.modules[id]:null;
  const x=enemy.sprite.x+(module?.offsetX??0),y=enemy.sprite.y;
  if(result.shieldBroken){
    s.barrier.shatterAt=scene.time.now;
    burst(scene,enemy.sprite.x,enemy.sprite.y+39,p.barrier,70);
    scene.queueCuboNews?.('BARREIRA INIMIGA DESTRUÍDA',
      'A fortaleza perdeu temporariamente sua proteção frontal.');
  }else if(result.moduleDestroyed||result.defeated||scene.time.now-(module?.hitAt??s.hitAt)>130){
    burst(scene,x,y,p.light,result.moduleDestroyed?45:9);
  }
  if(module)module.hitAt=scene.time.now;else s.hitAt=scene.time.now;
  // Interrupção do laser durante a carga: 25% do HP máximo no carregamento atual.
  const a=s.action;
  if(a?.kind==='laserCharge'&&a.moduleId===id&&!module.broken){
    a.interruptDamage+=result.damage;
    if(a.interruptDamage>=module.maxHp*0.25){
      stopAction(enemy);
      scene.showAttackWarning('LASER INTERROMPIDO — SOBRECARGA!');
      burst(scene,x,y,0xff3d52,30);
    }
  }
  if(result.moduleDestroyed){
    module.deadAt=scene.time.now;
    if(s.action?.moduleId===module.id)stopAction(enemy);
    scene.queueCuboNews?.('SISTEMA INIMIGO DESTRUÍDO',
      ({bombardment:'Bombardeio',laser:'Laser de Cerco',hangar:'Hangar',generator:'Gerador de escudos'})[module.role]+' deixou de operar.');
    scene.cameras.main.shake(210,0.002);
    if(module.role==='generator'&&previousShield){
      s.barrier.shatterAt=scene.time.now;
      burst(scene,enemy.sprite.x,enemy.sprite.y+39,p.barrier,70);
    }
  }
  if(result.coreExposed){
    scene.queueCuboNews?.('NÚCLEO ALIENÍGENA EXPOSTO',
      'A blindagem central foi aberta; apenas o núcleo pode receber dano.');
    scene.cameras.main.shake(390,0.006);
  }
  if(result.defeated)defeatType6(scene,enemy);
  return result.defeated;
}
export function hitType6At(scene,enemy,x,y,damage,radius=0,once=false){
  if(!enemy?.type6?.introComplete||enemy.type6.defeated)return {hit:false,defeated:false};
  const s=enemy.type6,targets=radius>0
    ? type6AreaTargets(s,enemy.sprite.x,enemy.sprite.y,x,y,radius)
    : [type6PointTarget(s,enemy.sprite.x,enemy.sprite.y,x,y,0)].filter(id=>id!==null);
  if(!targets.length)return {hit:false,defeated:false};
  const list=once?[targets[0]]:targets;
  let defeated=false;
  for(const id of list){defeated=hitTarget(scene,enemy,id,damage)||defeated;if(defeated)break;}
  return {hit:true,defeated,targets:list};
}
export function hitType6Segment(scene,enemy,x1,y1,x2,y2,damage,radius=0){
  if(!enemy?.type6?.introComplete)return false;
  const s=enemy.type6,targets=type6SegmentTargets(s,enemy.sprite.x,enemy.sprite.y,x1,y1,x2,y2,radius);
  for(const id of targets)if(hitTarget(scene,enemy,id,damage))break;
  return targets.length>0;
}
export function hitType6Bullet(scene,enemy,x,y,damage,radius=0){
  const s=enemy.type6;
  if(!s.introComplete)return {blocked:false,target:null};
  const target=type6PointTarget(s,enemy.sprite.x,enemy.sprite.y,x,y,radius);
  if(target!==null){hitTarget(scene,enemy,target,damage);return {blocked:true,target};}
  // Estruturas destruídas são transparentes para projéteis.
  if(s.modules.some(m=>m.broken&&Math.abs(x-enemy.sprite.x-m.offsetX)<=m.halfWidth&&
    Math.abs(y-enemy.sprite.y)<=m.halfHeight))return {blocked:false,target:null};
  if(type6HullContains(enemy.sprite.x,enemy.sprite.y,x,y,radius)){
    burst(scene,x,y,0x929ead,5);return {blocked:true,target:null};
  }
  return {blocked:false,target:null};
}
// Uma bomba abatida detona projéteis próximos. Evitar loops e partículas ilimitadas.
export function detonateType6Bomb(scene,shot){
  const queue=[shot],seen=new Set;
  while(queue.length&&seen.size<40){
    const current=queue.shift();
    if(!current||seen.has(current))continue;
    seen.add(current);
    burst(scene,current.sprite.x,current.sprite.y,0xffb46d,28);
    const near=scene.enemyBullets.filter(other=>!seen.has(other)&&
      Math.hypot(other.sprite.x-current.sprite.x,other.sprite.y-current.sprite.y)<90);
    for(const other of near){
      if(other.colossal)queue.push(other);
      else {const index=scene.enemyBullets.indexOf(other);if(index>=0)scene.removeEnemyBullet(index);}
    }
    const index=scene.enemyBullets.indexOf(current);
    if(index>=0)scene.removeEnemyBullet(index);
  }
}
export function defeatType6(scene,enemy){
  const s=enemy.type6;if(s.victoryStarted)return;
  s.defeated=true;s.victoryStarted=true;
  scene.boss6Victory=true;scene.elapsed=Math.min(scene.elapsed,scene.waveDurationMs);
  scene.boss6WarningText?.destroy();scene.boss6WarningText=null;
  enemy.laserGraphics?.clear();
  scene.queueCuboNews?.('FORTALEZA DESTRUÍDA! VITÓRIA BRASILEIRA!',
    'O núcleo inimigo foi neutralizado. A cidade está segura.');
  for(let i=scene.enemyBullets.length-1;i>=0;i--)scene.removeEnemyBullet(i);
  for(let i=scene.enemies.length-1;i>=0;i--){
    const unit=scene.enemies[i];if(unit.uid===enemy.uid)continue;
    burst(scene,unit.sprite.x,unit.sprite.y,0xffd397,15);
    scene.removeEnemy(i);
  }
  scene.cameras.main.shake(850,0.007);
  const hues={
    alien:[0xff4458,0xff243a,0xffffff],
    us:[0xffad53,0xffffff,0xff7639],
    jp:[0xff85fa,0x8addff,0xffffff],
    ru:[0xd3f9ff,0x88bbfa,0xffffff],
    cn:[0xffaa54,0xffd974,0xffffff],
  };
  for(let i=0;i<12;i++)scene.time.delayedCall(i*430,()=>{
    if(!enemy.sprite.active)return;
    const x=enemy.sprite.x+TYPE6_OFFSETS[i%4]*(1-(i/24));
    const y=enemy.sprite.y+((i%3)-1)*31;
    burst(scene,x,y,hues[s.country][i%3],21+i*3);
    if(i%3===0)scene.cameras.main.shake(140,0.003);
  });
  scene.time.delayedCall(5550,()=>{
    if(enemy.sprite.active)burst(scene,enemy.sprite.x,enemy.sprite.y,0xffffff,100);
  });
  scene.time.delayedCall(6000,()=>{
    if(!scene.scene.isActive('GameScene'))return;
    const index=scene.enemies.indexOf(enemy);
    if(index>=0)scene.removeEnemy(index);
    if(!scene.tutorialComplete)scene.showWaveComplete('cleared');
  });
}
export function chargeType6Superweapon(scene,enemy){
  const s=enemy.type6;
  if(s.charging||s.defeated)return;
  s.charging=true;
  scene.showAttackWarning('ALERTA CUBO NEWS: SUPERARMA! CINCO SEGUNDOS!');
  scene.cameras.main.shake(350,0.003);
}
export function fireType6Doom(scene,enemy){
  if(scene.boss6DoomFired||enemy.type6.defeated)return;
  scene.boss6DoomFired=true;scene.countdownActive=true;
  const g=scene.add.graphics().setDepth(180),x=enemy.sprite.x,y=enemy.sprite.y;
  const color=COLOR[enemy.bossCountry];
  g.lineStyle(116,color,0.25).lineBetween(x,y,CANNON.x,CANNON.y);
  g.lineStyle(54,color,0.86).lineBetween(x,y,CANNON.x,CANNON.y);
  g.lineStyle(18,0xffffff,1).lineBetween(x,y,CANNON.x,CANNON.y);
  scene.cameras.main.shake(1000,0.012);
  scene.cameras.main.flash(450,245,104,134);
  scene.time.delayedCall(920,()=>{
    g.destroy();
    if(!scene.scene.isActive('GameScene')||scene.tutorialComplete)return;
    scene.shield=0;scene.cannonHealth=0;scene.showDefeat('cannon');
  });
}
export function type6AimPosition(enemy){
  if(enemy?.type!==6||!enemy.type6)return {x:enemy.sprite.x,y:enemy.sprite.y};
  const s=enemy.type6;
  const m=type6AliveModules(s)[0];
  return {x:enemy.sprite.x+(m?.offsetX??0),y:enemy.sprite.y};
}
export function type6NextDeadline(scene){
  const enemy=scene.enemies.find(e=>e.type===6&&e.type6&&!e.type6.defeated);
  if(!enemy||!enemy.type6.introComplete)return false;
  const remaining=scene.waveDurationMs-scene.elapsed;
  if(remaining<=TYPE6_CHARGE_MS)chargeType6Superweapon(scene,enemy);
  if(remaining<=0)fireType6Doom(scene,enemy);
  return true;
}
