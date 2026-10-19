// Motor puro da Fortaleza de Cerco — regras aprovadas, sem dependências do Phaser.
// 'jp' é a chave legada para a Coreia do Sul.
export const TYPE6_PALETTES = Object.freeze({
  alien: {name:'FORTALEZA ORBITAL', metal:0x19252e,edge:0x798d95,light:0xff4059,glow:0xffa8a8,barrier:0x56baff},
  us: {name:'PORTA-AVIÕES VOADOR',metal:0x273044,edge:0x9cafa9,light:0xffad52,glow:0xffffff,barrier:0x56baff},
  ru: {name:'COURAÇADO DO ÁRTICO',metal:0x252c3b,edge:0x8794ab,light:0x8fd9ff,glow:0xff536c,barrier:0x56baff},
  cn: {name:'MEGAFÁBRICA AÉREA',metal:0x30282e,edge:0xb88a66,light:0xffcf5c,glow:0xf65a47,barrier:0x56baff},
  jp: {name:'FORTALEZA NEON',metal:0x24213b,edge:0xe0a9ef,light:0xf4a6ff,glow:0x7ff4ef,barrier:0x9853f8},
});
// À esquerda: bombardeio, laser; à direita: hangar, gerador.
export const TYPE6_ROLES=Object.freeze(['bombardment','laser','hangar','generator']);
export const TYPE6_TURN_ORDER=Object.freeze([2,0,1,3]); // hangar > bomba > laser > gerador
export const TYPE6_OFFSETS=Object.freeze([-255,-87,87,255]);
export const TYPE6_WIDTH=790,TYPE6_HEIGHT=122;
export const TYPE6_CHARGE_MS=5000,TYPE6_BEAM_AT_MS=0;
export const TYPE6_OPENING_SECONDS=4,TYPE6_REBUILD_SECONDS=6;
export const TYPE6_LASER_CHARGE_SECONDS=10,TYPE6_LASER_FIRE_SECONDS=3;
export const TYPE6_TURN_GAP_SECONDS=1;
export function createType6State(country='alien',hp=600){
  const id=Object.hasOwn(TYPE6_PALETTES,country)?country:'alien';
  const base=Math.max(160,Number(hp)||600),moduleHp=base*0.16;
  const modules=TYPE6_ROLES.map((role,i)=>({
    id:i,role,offsetX:TYPE6_OFFSETS[i],offsetY:0,halfWidth:57,halfHeight:42,
    hp:moduleHp,maxHp:moduleHp,shield:moduleHp*0.20,maxShield:moduleHp*0.20,
    broken:false,hitAt:-Infinity,deadAt:-Infinity,
  }));
  const barrierMaxHp=moduleHp*0.30;
  return {
    country:id,modules,coreHp:moduleHp,coreMaxHp:moduleHp,coreExposed:false,
    coreReveal:0,defeated:false,charging:false,chargeStarted:false,
    barrier:{hp:0,maxHp:barrierMaxHp,active:false,charging:false,progress:0,shatterAt:-Infinity},
    shift:0,dir:1,speed:38,edgeHold:0,attackClock:0,attackCycle:0,phaseAge:0,
    introComplete:false,openingClock:0,firstShieldRaised:false,action:null,
    summons:0,stagger:0,justOpened:false,hitAt:-Infinity,
  };
}
export function type6AliveModules(s){return s.modules.filter(m=>!m.broken);}
export function type6BarrierActive(s){return !!s.barrier.active&&s.barrier.hp>0;}
export function type6NextModule(s){
  for(let i=0;i<TYPE6_TURN_ORDER.length;i++){
    const index=TYPE6_TURN_ORDER[s.attackCycle++%TYPE6_TURN_ORDER.length];
    const m=s.modules[index];
    if(!m.broken && !(m.role==='generator'&&type6BarrierActive(s)))return m;
  }
  return null;
}
export function type6BeginBarrierCharge(s){
  if(s.modules[3].broken||type6BarrierActive(s)||s.barrier.charging)return false;
  s.barrier.charging=true;s.barrier.progress=0;
  return true;
}
export function type6FinishBarrierCharge(s){
  s.barrier.charging=false;s.barrier.progress=0;
  if(s.modules[3].broken)return false;
  s.barrier.hp=s.barrier.maxHp;s.barrier.active=true;s.firstShieldRaised=true;
  return true;
}
export function type6TargetRects(s,cx,cy,includeDead=false){
  const targets=s.modules.filter(m=>includeDead||!m.broken).map(m=>({
    id:m.id,x:cx+m.offsetX,y:cy+m.offsetY,
    halfWidth:m.halfWidth,halfHeight:m.halfHeight,
  }));
  if(s.coreExposed&&!s.defeated&&s.coreReveal>=1)targets.push({
    id:'core',x:cx,y:cy,halfWidth:54,halfHeight:44,
  });
  return targets;
}
export function type6RectNearPoint(rect,x,y,radius=0){
  const dx=Math.max(0,Math.abs(x-rect.x)-rect.halfWidth);
  const dy=Math.max(0,Math.abs(y-rect.y)-rect.halfHeight);
  return dx*dx+dy*dy<=Math.max(0,radius)**2;
}
export function type6HullContains(cx,cy,x,y,radius=0){
  return Math.abs(x-cx)<=TYPE6_WIDTH/2+radius&&
    Math.abs(y-cy)<=TYPE6_HEIGHT/2+radius;
}
const barrierRect=(cx,cy)=>({
  id:'barrier',x:cx,y:cy+25,halfWidth:TYPE6_WIDTH/2+6,halfHeight:TYPE6_HEIGHT/2+24,
});
export function type6PointTarget(s,cx,cy,x,y,radius=0){
  if(type6BarrierActive(s)&&type6RectNearPoint(barrierRect(cx,cy),x,y,radius))return 'barrier';
  return type6TargetRects(s,cx,cy).filter(r=>type6RectNearPoint(r,x,y,radius))
    .sort((a,b)=>Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0]?.id??null;
}
export function type6AreaTargets(s,cx,cy,x,y,radius){
  if(type6BarrierActive(s))return type6RectNearPoint(barrierRect(cx,cy),x,y,radius)?['barrier']:[];
  return type6TargetRects(s,cx,cy).filter(r=>type6RectNearPoint(r,x,y,radius)).map(r=>r.id);
}
function segmentIntersectsRect(r,x1,y1,x2,y2,radius=0){
  const left=r.x-r.halfWidth-radius,right=r.x+r.halfWidth+radius;
  const top=r.y-r.halfHeight-radius,bottom=r.y+r.halfHeight+radius;
  let tmin=0,tmax=1;
  for(const [p,d,min,max] of [[x1,x2-x1,left,right],[y1,y2-y1,top,bottom]]){
    if(Math.abs(d)<1e-8){if(p<min||p>max)return false;}
    else{
      const a=(min-p)/d,b=(max-p)/d;
      tmin=Math.max(tmin,Math.min(a,b));
      tmax=Math.min(tmax,Math.max(a,b));
      if(tmin>tmax)return false;
    }
  }
  return true;
}
export function type6SegmentTargets(s,cx,cy,x1,y1,x2,y2,radius=0){
  if(type6BarrierActive(s))
    return segmentIntersectsRect(barrierRect(cx,cy),x1,y1,x2,y2,radius)?['barrier']:[];
  return type6TargetRects(s,cx,cy).filter(r=>
    segmentIntersectsRect(r,x1,y1,x2,y2,radius)).map(r=>r.id);
}
export function type6Damage(s,targetId,damage){
  const result={shieldBroken:false,barrierBroken:false,moduleShieldBroken:false,
    moduleDamage:0,moduleDestroyed:false,coreExposed:false,
    defeated:false,damage:0,targetId};
  if(s.defeated||!Number.isFinite(damage)||damage<=0)return result;
  // Nenhum dano, inclusive especial e explosão, atravessa a barreira.
  if(type6BarrierActive(s)){
    const dealt=Math.min(s.barrier.hp,damage);
    s.barrier.hp-=dealt;result.damage=dealt;result.targetId='barrier';
    if(s.barrier.hp<=0){s.barrier.active=false;result.shieldBroken=true;result.barrierBroken=true;}
    return result;
  }
  if(targetId==='barrier')return result;
  if(targetId==='core'){
    if(!s.coreExposed||s.coreReveal<1)return result;
    result.damage=Math.min(s.coreHp,damage);
    s.coreHp=Math.max(0,s.coreHp-damage);
    if(s.coreHp===0){s.defeated=true;result.defeated=true;}
    return result;
  }
  const m=s.modules[targetId];
  if(!m||m.broken)return result;
  if(m.shield>0){
    result.damage=Math.min(m.shield,damage);
    m.shield=Math.max(0,m.shield-damage);
    if(m.shield===0){result.shieldBroken=true;result.moduleShieldBroken=true;}
    return result;
  }
  result.damage=Math.min(m.hp,damage);
  result.moduleDamage=result.damage;
  m.hp=Math.max(0,m.hp-damage);
  if(m.hp===0){
    m.broken=true;result.moduleDestroyed=true;
    if(m.role==='generator'){
      s.barrier.active=false;s.barrier.hp=0;s.barrier.charging=false;
    }
    if(type6AliveModules(s).length===0){
      s.coreExposed=true;s.coreReveal=0;s.justOpened=true;result.coreExposed=true;
    }
  }
  return result;
}
export function type6ModuleVisualState(module){
  if(module.broken)return 3;
  if(module.shield>0)return 0;
  const fraction=module.hp/module.maxHp;
  return fraction>0.65?0:fraction>0.3?1:2;
}
export function advanceType6Cruise(s,dt,limit=65){
  if(s.edgeHold>0){s.edgeHold=Math.max(0,s.edgeHold-dt);return s.shift;}
  const distance=limit-s.dir*s.shift;
  if(distance<=0.1){s.shift=s.dir*limit;s.dir*=-1;s.edgeHold=0.18;return s.shift;}
  const factor=Math.min(1,Math.max(0.12,Math.sqrt(distance/20)));
  const step=Math.min(distance,s.speed*factor*dt);
  s.shift+=s.dir*step;
  if(step===distance){s.dir*=-1;s.edgeHold=0.18;}
  return s.shift;
}
