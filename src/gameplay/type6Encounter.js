import {
  TYPE6_PALETTES, TYPE6_BEAM_AT_MS, TYPE6_CHARGE_MS,
  createType6State, advanceType6Cruise, type6AliveModules,
  type6Damage, type6PointTarget, type6AreaTargets, type6SegmentTargets,
  type6HullContains,
} from './type6Boss.js';
import { drawType6Ship } from './type6Visual.js';

const W=960,H=540, CANNON={x:480,y:494};
const toColor=color=>'#'+color.toString(16).padStart(6,'0');

export function spawnType6Encounter(scene, options={}) {
  const country=TYPE6_PALETTES[options.bossCountry]?options.bossCountry:'alien';
  const state=createType6State(country,options.hp);
  const sprite=scene.add.container(W/2,-90).setDepth(21);
  const graphics=scene.add.graphics();
  sprite.add(graphics);
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
  state.introStart=scene.elapsed;
  state.introDuration=1500;
  state.introComplete=false;
  scene.showAttackWarning('INTERFERÊNCIA! CONTATO GIGANTE NO CÉU!');
  const interference=scene.add.rectangle(W/2,H/2,W,H,0x030914,0.33)
    .setDepth(24);
  scene.tweens.add({targets:interference,alpha:0,duration:1400,
    onComplete:()=>interference.destroy()});
  scene.cameras.main.shake(340,0.0024);
  scene.cameras.main.flash(220,90,38,56);
  drawType6Ship(graphics,state,scene.elapsed);
  return enemy;
}
function beamWarning(scene,x,y,color,duration=430) {
  const gfx=scene.add.graphics().setDepth(48);
  gfx.lineStyle(2,color,0.84).lineBetween(x,y,CANNON.x,CANNON.y-40);
  gfx.fillStyle(color,0.7).fillCircle(x,y,11);
  scene.tweens.add({targets:gfx,alpha:0,duration,
    onComplete:()=>gfx.destroy()});
}
function moduleShot(scene,enemy,module,count=1) {
  const state=enemy.type6,p=TYPE6_PALETTES[state.country];
  const target=scene.chooseDefenseTarget();
  const fromX=enemy.sprite.x+module.offsetX,fromY=enemy.sprite.y+38;
  for(let i=0;i<count;i++){
    const spread=(i-(count-1)/2)*34;
    const dx=target.x+spread-fromX,dy=target.y-fromY;
    const norm=Math.max(1,Math.hypot(dx,dy));
    const speed=state.country==='us'?210:state.country==='jp'?195:165;
    const size=module.role==='missiles'?13:10;
    const sprite=scene.add.rectangle(fromX,fromY,size,size,p.light)
      .setStrokeStyle(2,p.glow).setDepth(33);
    scene.enemyBullets.push({sprite,hp:module.role==='missiles'?2:1,target,
      vx:dx/norm*speed,vy:dy/norm*speed,
      damage:module.role==='missiles'?12:9,
      sourceBossId:enemy.uid,sourceModuleId:module.id,
      frostMs:state.country==='ru'?600:0});
  }
}
function summonEscort(scene,enemy,module) {
  const state=enemy.type6;
  const active=scene.enemies.filter(e=>e.sourceBossId===enemy.uid).length;
  if(state.summons>=9||active>=3)return;
  const n=Math.min(2,9-state.summons,3-active);
  for(let i=0;i<n;i++){
    scene.spawnEnemy(1,{level:9,x:enemy.sprite.x+module.offsetX+(i?24:-24),
      y:enemy.sprite.y+62,sourceBossId:enemy.uid,skipPortal:true});
  }
  state.summons+=n;
}
function warningAndFire(scene,enemy,module) {
  const state=enemy.type6,p=TYPE6_PALETTES[state.country];
  beamWarning(scene,enemy.sprite.x+module.offsetX,enemy.sprite.y+39,p.light);
  // Alvos destruídos durante aviso cancelam a salva correspondente.
  scene.time.delayedCall(440,()=>{
    if(scene.tutorialComplete || scene.gameOver || state.charging ||
      state.defeated || module.broken || !scene.enemies.includes(enemy))return;
    if(module.role==='summoner'){
      summonEscort(scene,enemy,module);
      moduleShot(scene,enemy,module,1);
    }else moduleShot(scene,enemy,module,
      module.role==='missiles'?3:module.role==='cannon'?2:1);
  });
}
function coreVolley(scene,enemy) {
  const s=enemy.type6;
  const p=TYPE6_PALETTES[s.country];
  const target=scene.chooseDefenseTarget();
  beamWarning(scene,enemy.sprite.x,enemy.sprite.y+35,p.glow,360);
  scene.time.delayedCall(360,()=>{
    if(!scene.enemies.includes(enemy)||s.defeated||s.charging||!s.coreExposed)return;
    const originX=enemy.sprite.x,originY=enemy.sprite.y+43;
    const count=3;
    for(let i=0;i<count;i++){
      const dx=target.x+(i-1)*50-originX,dy=target.y-originY;
      const norm=Math.max(1,Math.hypot(dx,dy));
      const bullet=scene.add.rectangle(originX,originY,12,16,p.glow)
        .setStrokeStyle(2,0xffffff).setDepth(33);
      scene.enemyBullets.push({sprite:bullet,hp:2,target,
        vx:dx/norm*195,vy:dy/norm*195,damage:11,
        sourceBossId:enemy.uid,sourceModuleId:'core',
        frostMs:s.country==='ru'?550:0});
    }
  });
}
export function updateType6Encounter(scene,enemy,dt) {
  const s=enemy.type6;
  enemy.age+=dt;
  enemy.phaseAge+=dt;
  s.phaseAge+=dt;
  if(!s.introComplete){
    const t=Math.min(1,(scene.elapsed-s.introStart)/s.introDuration);
    const smooth=t*t*(3-2*t);
    enemy.sprite.y=-90+215*smooth;
    if(t>=1){s.introComplete=true;enemy.phase='boss6';}
  }else{
    advanceType6Cruise(s,dt);
    enemy.sprite.x=W/2+s.shift;
  }
  // Sem novos ataques durante o carregamento ou as panes após módulos perdidos.
  if(s.stagger>0)s.stagger=Math.max(0,s.stagger-dt);
  else if(s.introComplete&&!s.charging&&!s.defeated){
    s.attackClock+=dt;
    const alive=type6AliveModules(s);
    const interval=alive.length
      ? Math.max(1.75,2.75-(4-alive.length)*0.30) : 1.75;
    if(s.attackClock>=interval){
      s.attackClock=0;
      if(!alive.length)coreVolley(scene,enemy);
      else {
        // Salvas coordenadas alternadas, mantendo brechas entre padrões.
        const a=alive[s.attackCycle%alive.length];
        const b=alive.length>1?alive[(s.attackCycle+1)%alive.length]:null;
        warningAndFire(scene,enemy,a);
        if(b&&b!==a)scene.time.delayedCall(200,()=>{
          if(!b.broken&&!s.charging)warningAndFire(scene,enemy,b);
        });
        s.attackCycle+=1;
      }
    }
  }
  drawType6Ship(enemy.graphics,s,scene.time.now);
  if(s.charging && scene.boss6WarningText?.active){
    const remain=Math.max(0,(scene.waveDurationMs-scene.elapsed)/1000);
    scene.boss6WarningText.setText('SUPERARMA CARREGANDO — '+remain.toFixed(1)+'s');
  }
}
function burst(scene,x,y,color,size=25) {
  const graphics=scene.add.graphics().setPosition(x,y).setDepth(60);
  graphics.fillStyle(color,0.35).fillCircle(0,0,size);
  graphics.lineStyle(4,0xffffff,0.8).strokeCircle(0,0,size*0.8);
  graphics.lineStyle(2,color,0.96);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    graphics.lineBetween(Math.cos(a)*size*0.5,Math.sin(a)*size*0.5,
      Math.cos(a)*size*1.5,Math.sin(a)*size*1.5);
  }
  scene.tweens.add({targets:graphics,alpha:0,scale:1.6,
    duration:350,onComplete:()=>graphics.destroy()});
}
function chainExplodeModuleShots(scene,enemy,module) {
  const bullets=scene.enemyBullets.filter(shot=>
    shot.sourceBossId===enemy.uid&&shot.sourceModuleId===module.id);
  bullets.forEach((shot,i)=>scene.time.delayedCall(i*65,()=>{
    const index=scene.enemyBullets.indexOf(shot);
    if(index<0)return;
    const {x,y}=shot.sprite;
    scene.removeEnemyBullet(index);
    burst(scene,x,y,TYPE6_PALETTES[enemy.bossCountry].light,15);
    // A explosão pode atingir escoltas menores, não o próprio chefão.
    for(let j=scene.enemies.length-1;j>=0;j--){
      const mob=scene.enemies[j];
      if(mob.type===6)continue;
      if(Math.hypot(mob.sprite.x-x,mob.sprite.y-y)<38)
        scene.impactInvader(j,3,0,'#ffe3b0',false);
    }
  }));
}
function hitTarget(scene,enemy,id,damage) {
  const state=enemy.type6;
  const p=TYPE6_PALETTES[state.country];
  const result=type6Damage(state,id,damage);
  if(!result.damage)return false;
  const module=id==='core'?null:state.modules[id];
  const x=enemy.sprite.x+(module?.offsetX??0);
  const y=enemy.sprite.y;
  const previousHitAt=module?.hitAt??state.hitAt;
  if(result.shieldBroken||result.moduleDestroyed||result.defeated||
      result.coreExposed||scene.time.now-previousHitAt>=110){
    burst(scene,x,y,result.shieldBroken?p.glow:p.light,
      result.shieldBroken?42:result.moduleDestroyed?48:8);
  }
  if(module)module.hitAt=scene.time.now;
  else state.hitAt=scene.time.now;
  if(result.shieldBroken)scene.showAttackWarning('ESCUDO INIMIGO DESTRUÍDO!');
  if(result.moduleDestroyed){
    module.deadAt=scene.time.now;
    chainExplodeModuleShots(scene,enemy,module);
    scene.cameras.main.shake(240,0.0032);
    scene.showAttackWarning('MÓDULO DESTRUÍDO — SISTEMAS RECONFIGURANDO!');
  }
  if(result.coreExposed){
    scene.cameras.main.shake(420,0.006);
    scene.showAttackWarning('NÚCLEO EXPOSTO! DESTRUAM AGORA!');
  }
  if(result.defeated)defeatType6(scene,enemy);
  return result.defeated;
}
export function hitType6At(scene,enemy,x,y,damage,radius=0,once=false) {
  if(!enemy?.type6||enemy.type6.defeated)return {hit:false,defeated:false};
  const s=enemy.type6;
  const targets=radius>0?type6AreaTargets(s,enemy.sprite.x,enemy.sprite.y,x,y,radius):
    [type6PointTarget(s,enemy.sprite.x,enemy.sprite.y,x,y,0)].filter(id=>id!==null);
  if(!targets.length)return {hit:false,defeated:false};
  const list=once?[targets[0]]:targets;
  let defeated=false;
  for(const id of list){defeated=hitTarget(scene,enemy,id,damage)||defeated;if(defeated)break;}
  return {hit:true,defeated,targets:list};
}
export function hitType6Segment(scene,enemy,x1,y1,x2,y2,damage,radius=0){
  const s=enemy.type6;
  const targets=type6SegmentTargets(s,enemy.sprite.x,enemy.sprite.y,x1,y1,x2,y2,radius);
  for(const id of targets)if(hitTarget(scene,enemy,id,damage))break;
  return targets.length>0;
}
export function hitType6Bullet(scene,enemy,x,y,damage,radius=0){
  const s=enemy.type6;
  const target=type6PointTarget(s,enemy.sprite.x,enemy.sprite.y,x,y,radius);
  if(target!==null){
    hitTarget(scene,enemy,target,damage);
    return {blocked:true,target};
  }
  if(type6HullContains(enemy.sprite.x,enemy.sprite.y,x,y,radius)){
    // Blindagem: ricochete cosmético, nunca dano.
    burst(scene,x,y,0xe8e6e3,5);
    return {blocked:true,target:null};
  }
  return {blocked:false,target:null};
}
export function defeatType6(scene,enemy) {
  const s=enemy.type6;
  if(s.victoryStarted)return;
  s.defeated=true;
  s.victoryStarted=true;
  scene.boss6Victory=true;
  scene.boss6WarningText?.destroy();
  scene.boss6WarningText=null;
  scene.cameras.main.shake(900,0.008);
  for(let i=scene.enemyBullets.length-1;i>=0;i--)scene.removeEnemyBullet(i);
  for(let i=scene.enemies.length-1;i>=0;i--){
    const unit=scene.enemies[i];
    if(unit.uid===enemy.uid)continue;
    burst(scene,unit.sprite.x,unit.sprite.y,0xffc786,16);
    scene.removeEnemy(i);
  }
  // Efeito de onda de choque, seguido por explosões na fuselagem.
  const shock=scene.add.circle(enemy.sprite.x,enemy.sprite.y,16,0xffffff,0.10)
    .setStrokeStyle(5,0xb1faff,1).setDepth(70);
  scene.tweens.add({targets:shock,scale:32,alpha:0,duration:800,
    onComplete:()=>shock.destroy()});
  for(let i=0;i<6;i++)scene.time.delayedCall(i*155,()=>{
    if(!enemy.sprite.active)return;
    const offset=[-255,-87,0,87,255,0][i];
    burst(scene,enemy.sprite.x+offset,enemy.sprite.y+(i%2?22:-24),
      TYPE6_PALETTES[s.country].light,35+i*7);
  });
  scene.time.delayedCall(1200,()=>{
    if(!scene.scene.isActive('GameScene'))return;
    const idx=scene.enemies.indexOf(enemy);
    if(idx>=0)scene.removeEnemy(idx);
    if(!scene.tutorialComplete)scene.showWaveComplete('cleared');
  });
}
export function chargeType6Superweapon(scene,enemy){
  const s=enemy.type6;
  if(s.charging||s.defeated)return;
  s.charging=true;
  s.attackClock=0;
  scene.showAttackWarning('ALERTA: SUPERARMA! RESTAM CINCO SEGUNDOS!');
  scene.cameras.main.shake(400,0.003);
  scene.boss6WarningText?.destroy();
  scene.boss6WarningText=scene.add.text(W/2,211,'SUPERARMA CARREGANDO',{
    fontFamily:'monospace',fontSize:'19px',fontStyle:'bold',
    color:'#ffe0a0',backgroundColor:'#481018da',
    padding:{x:12,y:7},
  }).setOrigin(0.5).setDepth(107);
  // Atração visual de todos os projéteis inimigos presentes na tela.
  for(let i=scene.enemyBullets.length-1;i>=0;i--){
    const shot=scene.enemyBullets[i];
    scene.enemyBullets.splice(i,1);
    scene.tweens.add({targets:shot.sprite,x:enemy.sprite.x,y:enemy.sprite.y,
      scale:0.1,alpha:0,duration:350+((i%4)*80),
      onComplete:()=>shot.sprite.destroy()});
  }
}
export function fireType6Doom(scene,enemy) {
  if(scene.boss6DoomFired||enemy.type6.defeated)return;
  scene.boss6DoomFired=true;
  scene.countdownActive=true;
  scene.boss6WarningText?.setText('SINAL PERDIDO — DISPARO DA SUPERARMA!');
  const g=scene.add.graphics().setDepth(180);
  const color=TYPE6_PALETTES[enemy.bossCountry].light;
  g.lineStyle(110,color,0.26).lineBetween(enemy.sprite.x,enemy.sprite.y,CANNON.x,CANNON.y);
  g.lineStyle(48,color,0.85).lineBetween(enemy.sprite.x,enemy.sprite.y,CANNON.x,CANNON.y);
  g.lineStyle(18,0xffffff,1).lineBetween(enemy.sprite.x,enemy.sprite.y,CANNON.x,CANNON.y);
  scene.cameras.main.shake(950,0.012);
  scene.cameras.main.flash(450,235,100,130);
  scene.time.delayedCall(900,()=>{
    g.destroy();
    if(!scene.scene.isActive('GameScene')||scene.tutorialComplete)return;
    scene.shield=0;scene.cannonHealth=0;
    scene.showDefeat('cannon');
  });
}
export function type6AimPosition(enemy) {
  if(enemy?.type!==6||!enemy.type6)return {x:enemy.sprite.x,y:enemy.sprite.y};
  const state=enemy.type6;
  const module=type6AliveModules(state)[1]??type6AliveModules(state)[0];
  return {x:enemy.sprite.x+(module?.offsetX??0),y:enemy.sprite.y};
}
export function type6NextDeadline(scene) {
  const remaining=scene.waveDurationMs-scene.elapsed;
  const enemy=scene.enemies.find(e=>e.type===6&&e.type6&&!e.type6.defeated);
  if(!enemy)return false;
  if(remaining<=TYPE6_CHARGE_MS)chargeType6Superweapon(scene,enemy);
  if(remaining<=TYPE6_BEAM_AT_MS)fireType6Doom(scene,enemy);
  return true;
}
