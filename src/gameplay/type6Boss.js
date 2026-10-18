// Motor puro do Tipo 6. Sem Phaser: colisão, escudos e movimento testáveis.
// A chave 'jp' é a identidade legada da Coreia do Sul no jogo.
export const TYPE6_PALETTES = Object.freeze({
  alien: {name:'FORTALEZA ALIENÍGENA', metal:0x19252e, edge:0x798d95, light:0xff4059, glow:0xffa8a8},
  us: {name:'COMANDO DOS EUA', metal:0x273044, edge:0x9cafa9, light:0xffad52, glow:0xffffff},
  ru: {name:'FORTALEZA RUSSA', metal:0x252c3b, edge:0x8794ab, light:0x8fd9ff, glow:0xff536c},
  cn: {name:'CRUZADOR CHINÊS', metal:0x30282e, edge:0xb88a66, light:0xffcf5c, glow:0xf65a47},
  jp: {name:'PALCO COREANO', metal:0x24213b, edge:0x9f8bbd, light:0xf4a6ff, glow:0x7ff4ef},
});
const ROLES = {
  alien:['cannon','summoner','defense','cannon'],
  us:['missiles','cannon','defense','summoner'],
  ru:['cannon','defense','summoner','missiles'],
  cn:['summoner','missiles','cannon','defense'],
  jp:['cannon','summoner','missiles','defense'],
};
export const TYPE6_OFFSETS = Object.freeze([-255,-87,87,255]);
export const TYPE6_WIDTH = 790;
export const TYPE6_HEIGHT = 122;
export const TYPE6_CHARGE_MS = 5000;
export const TYPE6_BEAM_AT_MS = 1000;

export function createType6State(country='alien', hp=600) {
  const id=Object.hasOwn(ROLES,country)?country:'alien';
  const base=Math.max(160,Number(hp)||600);
  const roles=ROLES[id];
  const modules=roles.map((role,i)=>{
    const shieldFactor=role==='defense'?0.38:role==='summoner'?0.31:0.23;
    const maxHp=base*0.16;
    const maxShield=base*0.14*shieldFactor/0.28;
    return {id:i,role,offsetX:TYPE6_OFFSETS[i],offsetY:0,
      halfWidth:57,halfHeight:42,hp:maxHp,maxHp,shield:maxShield,
      maxShield,broken:false,hitAt:-Infinity,deadAt:-Infinity};
  });
  const coreHp=base*0.38;
  return {country:id,modules,coreHp,coreMaxHp:coreHp,coreExposed:false,
    defeated:false,charging:false,chargeStarted:false,shift:0,dir:1,
    speed:38,edgeHold:0,attackClock:0,attackCycle:0,stagger:0,phaseAge:0,
    summons:0,justOpened:false,hitAt:-Infinity};
}
export function type6AliveModules(state) {
  return state.modules.filter(m=>!m.broken);
}
export function type6TargetRects(state,cx,cy,includeDead=false) {
  const result=state.modules.filter(m=>includeDead||!m.broken).map(m=>({
    id:m.id,x:cx+m.offsetX,y:cy+m.offsetY,
    halfWidth:m.halfWidth,halfHeight:m.halfHeight,
  }));
  if(state.coreExposed && !state.defeated)result.push({
    id:'core',x:cx,y:cy,halfWidth:54,halfHeight:44,
  });
  return result;
}
export function type6RectNearPoint(rect,x,y,radius=0) {
  const dx=Math.max(0,Math.abs(x-rect.x)-rect.halfWidth);
  const dy=Math.max(0,Math.abs(y-rect.y)-rect.halfHeight);
  return dx*dx+dy*dy <= Math.max(0,radius)**2;
}
export function type6PointTarget(state,cx,cy,x,y,radius=0) {
  const targets=type6TargetRects(state,cx,cy);
  // Áreas são disjuntas. Em colisões de projéteis maiores, ganha o alvo mais próximo.
  return targets.filter(rect=>type6RectNearPoint(rect,x,y,radius))
    .sort((a,b)=>Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0]?.id ?? null;
}
export function type6AreaTargets(state,cx,cy,x,y,radius) {
  return type6TargetRects(state,cx,cy)
    .filter(rect=>type6RectNearPoint(rect,x,y,radius)).map(rect=>rect.id);
}
export function type6HullContains(cx,cy,x,y,radius=0) {
  return Math.abs(x-cx)<=TYPE6_WIDTH/2+radius &&
    Math.abs(y-cy)<=TYPE6_HEIGHT/2+radius;
}
// Segmento vs retângulo expandido para laser, inclusive feixes horizontais.
export function type6SegmentTargets(state,cx,cy,x1,y1,x2,y2,radius=0) {
  return type6TargetRects(state,cx,cy).filter(rect=>{
    const left=rect.x-rect.halfWidth-radius,right=rect.x+rect.halfWidth+radius;
    const top=rect.y-rect.halfHeight-radius,bottom=rect.y+rect.halfHeight+radius;
    let tmin=0,tmax=1;
    for(const [p,d,min,max] of [[x1,x2-x1,left,right],[y1,y2-y1,top,bottom]]){
      if(Math.abs(d)<1e-8){if(p<min||p>max)return false;}
      else {
        const a=(min-p)/d,b=(max-p)/d;
        tmin=Math.max(tmin,Math.min(a,b));
        tmax=Math.min(tmax,Math.max(a,b));
        if(tmin>tmax)return false;
      }
    }
    return true;
  }).map(rect=>rect.id);
}
export function type6Damage(state,targetId,damage) {
  const result={shieldBroken:false,moduleDestroyed:false,coreExposed:false,
    defeated:false,damage:0,targetId};
  if(state.defeated || !Number.isFinite(damage)||damage<=0)return result;
  if(targetId==='core'){
    if(!state.coreExposed)return result;
    result.damage=Math.min(state.coreHp,damage);
    state.coreHp=Math.max(0,state.coreHp-damage);
    if(state.coreHp===0){state.defeated=true;result.defeated=true;}
    return result;
  }
  const module=state.modules[targetId];
  if(!module || module.broken)return result;
  // Decisão provisória conservadora: o impacto que quebra escudo não
  // atravessa para a estrutura. A regra de excedente fica em aberto no GDD.
  if(module.shield>0){
    result.damage=Math.min(module.shield,damage);
    module.shield=Math.max(0,module.shield-damage);
    result.shieldBroken=module.shield===0;
    return result;
  }
  result.damage=Math.min(module.hp,damage);
  module.hp=Math.max(0,module.hp-damage);
  if(module.hp===0){
    module.broken=true;result.moduleDestroyed=true;
    if(type6AliveModules(state).length===0){
      state.coreExposed=true;state.justOpened=true;state.stagger=0.85;
      result.coreExposed=true;
    }else state.stagger=0.38;
  }
  return result;
}
export function type6ModuleVisualState(module) {
  if(module.broken)return 3;
  if(module.shield>0)return 0;
  const fraction=module.hp/module.maxHp;
  return fraction>0.65?0:fraction>0.3?1:2;
}
export function advanceType6Cruise(state,dt,limit=65) {
  if(state.edgeHold>0){state.edgeHold=Math.max(0,state.edgeHold-dt);return state.shift;}
  const distance=limit-state.dir*state.shift;
  if(distance<=0.1){
    state.shift=state.dir*limit;state.dir*=-1;state.edgeHold=0.18;
    return state.shift;
  }
  // Desaceleração perto da borda e retomada suave após inversão.
  const speedFactor=Math.min(1,Math.max(0.12,Math.sqrt(distance/20)));
  const step=Math.min(distance,state.speed*speedFactor*dt);
  state.shift+=state.dir*step;
  if(step===distance){state.dir*=-1;state.edgeHold=0.18;}
  return state.shift;
}
