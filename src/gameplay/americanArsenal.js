// Geometria pura do arsenal americano: foguete fixo por nível e muro em arco.
export const AMERICAN_WALL_ARC=Math.PI*2/3; // 120 graus
export const AMERICAN_WALL_DURATION_MS=6000;
export const AMERICAN_WALL_COOLDOWN_MS=14000;
export const AMERICAN_WALL_OPEN_MS=300;
export const AMERICAN_WALL_FLIGHT_SPEED=1100; // pixels/s
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export function americanRocketConfig(level=0){
  if(level<1)return {radius:0,blastRadius:0,blastDamage:0};
  const stage=level>=10?4:level>=7?3:level>=5?2:level>=3?1:0;
  return {
    radius:[9,13,17,22,29][stage],
    blastRadius:[29,38,49,62,78][stage],
    blastDamage:[1.4,1.9,2.6,3.3,4.8][stage],
  };
}
export function americanWallConfig(level=0){
  if(level<2)return null;
  const stage=level>=8?3:level>=6?2:level>=4?1:0;
  return {radius:[85,110,140,175][stage],
    durationMs:AMERICAN_WALL_DURATION_MS,
    cooldownMs:AMERICAN_WALL_COOLDOWN_MS,arc:AMERICAN_WALL_ARC};
}
export function americanWallPlacement(x,y,cannonX,cannonY,width,height){
  const px=clamp(Number(x)||0,12,width-12);
  const py=clamp(Number(y)||0,48,height-30);
  return {x:px,y:py,angle:Math.atan2(py-cannonY,px-cannonX)};
}
// A mira indica o PONTO MÉDIO DO ARCO, não o centro do círculo.
export function americanWallArcCenter(aimX,aimY,angle,radius){
  return {x:aimX-Math.cos(angle)*radius,y:aimY-Math.sin(angle)*radius};
}
export function americanWallTravelDuration(fromX,fromY,toX,toY){
  return clamp(Math.hypot(toX-fromX,toY-fromY)*1000/AMERICAN_WALL_FLIGHT_SPEED,130,480);
}
// Lançamento físico até a mira; depois um arco cresce simetricamente até 120°.
export function americanWallAnimation(wall,now){
  const elapsed=Math.max(0,now-wall.startedAt);
  const flight=Math.max(1,wall.travelMs);
  if(elapsed+1e-7<flight){
    const t=clamp(elapsed/flight,0,1),ease=t*t*(3-2*t);
    return {phase:'travel',x:wall.muzzleX+(wall.targetX-wall.muzzleX)*ease,
      y:wall.muzzleY+(wall.targetY-wall.muzzleY)*ease,arc:0,progress:t};
  }
  const progress=clamp((elapsed-flight+1e-7)/(wall.openMs??AMERICAN_WALL_OPEN_MS),0,1);
  return {phase:progress<1?'deploy':'active',x:wall.targetX,y:wall.targetY,
    arc:wall.arc*(1-Math.pow(1-progress,3)),progress};
}
export function wallAngleDiff(a,b){
  return Math.atan2(Math.sin(a-b),Math.cos(a-b));
}
export function americanWallTouches(wall,x,y,entityRadius=0){
  const arc=wall.currentArc??wall.arc;
  if(!(arc>0))return false;
  const dx=x-wall.x,dy=y-wall.y,d=Math.hypot(dx,dy);
  if(Math.abs(d-wall.radius)>12+entityRadius)return false;
  const tolerance=Math.asin(clamp(entityRadius/Math.max(1,d),0,1));
  return Math.abs(wallAngleDiff(Math.atan2(dy,dx),wall.angle))<=arc/2+tolerance;
}
// Detecta atravessamento entre frames, inclusive nas duas pontas arredondadas.
export function americanWallIntersects(wall,x1,y1,x2,y2,projectileRadius=0){
  const arc=wall.currentArc??wall.arc;
  if(!(arc>0))return false;
  const dx=x2-x1,dy=y2-y1,fx=x1-wall.x,fy=y1-wall.y,a=dx*dx+dy*dy;
  if(!a)return americanWallTouches(wall,x1,y1,projectileRadius);
  const b=2*(fx*dx+fy*dy),c=fx*fx+fy*fy-wall.radius*wall.radius;
  const disc=b*b-4*a*c,probes=[0,1,clamp(-b/(2*a),0,1)];
  if(disc>=0){
    const sq=Math.sqrt(disc);
    probes.push((-b-sq)/(2*a),(-b+sq)/(2*a));
  }
  for(const t of probes)
    if(t>=0&&t<=1&&americanWallTouches(wall,
      x1+dx*t,y1+dy*t,projectileRadius))return true;
  for(const sign of [-1,1]){
    const theta=wall.angle+sign*arc/2;
    const px=wall.x+Math.cos(theta)*wall.radius;
    const py=wall.y+Math.sin(theta)*wall.radius;
    const t=clamp(((px-x1)*dx+(py-y1)*dy)/a,0,1);
    if(Math.hypot(x1+dx*t-px,y1+dy*t-py)<=12+projectileRadius)return true;
  }
  return false;
}

// Apenas os feixes de energia pesada do Tipo 6 podem quebrar o muro.
// Projéteis comuns e contatos físicos são interceptados sem desgaste.
export function americanWallBreaksFromBeam(wall,source,x1,y1,x2,y2,halfWidth=0){
  if(source!=='siegeLaser'&&source!=='coreDoom')return false;
  if(!(wall.currentArc>0))return false; // Lançamento não materializado.
  return americanWallIntersects(wall,x1,y1,x2,y2,halfWidth);
}
