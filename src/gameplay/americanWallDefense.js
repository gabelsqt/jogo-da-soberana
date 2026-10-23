// Resposta física do Grande Muro americano e ricochete de tiros leves.
// Esta lógica é independente do Phaser para poder ser testada com precisão.
export const US_WALL_PUSH_SPEED = 1000;
export const US_WALL_PUSH_MAX_OFFSET = 172;
export const US_WALL_PUSH_COOLDOWN_MS = 520;
export const US_WALL_REFLECTION_SPEED = 410;
export const US_WALL_REFLECTION_DAMAGE = 3;
export const US_WALL_REFLECTION_LIFETIME_MS = 2400;
export const US_WALL_REFLECTION_CAP = 32;

const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export function wallPushImpulse(wall,enemy) {
  // Radial externo: sempre para LONGE do canhão, ao longo da orientação do arco.
  const angle=Math.atan2(enemy.y-wall.y,enemy.x-wall.x);
  const main=wall.angle??angle;
  const nx=Math.cos(angle),ny=Math.sin(angle);
  const dirX=nx*.8+Math.cos(main)*.2,dirY=ny*.8+Math.sin(main)*.2;
  const mag=Math.max(.001,Math.hypot(dirX,dirY));
  return {vx:US_WALL_PUSH_SPEED*dirX/mag,vy:US_WALL_PUSH_SPEED*dirY/mag};
}
export function addWallPush(state,impulse) {
  const start=state??{x:0,y:0,vx:0,vy:0};
  return {...start,
    vx:clamp((start.vx??0)*.25+impulse.vx,-1250,1250),
    vy:clamp((start.vy??0)*.25+impulse.vy,-1250,1250),
  };
}
export function advanceWallPush(state,dt) {
  const s=state??{x:0,y:0,vx:0,vy:0};
  const t=Math.max(0,Math.min(.05,dt));
  // Avanço com amortecimento lento: 100+ pixels de recuo REAL nas hitboxes.
  // Sem teleporte, e a posição volta suavemente ao percurso de navegação.
  const drag=Math.exp(-4.2*t);
  const vx=(s.vx??0)*drag,vy=(s.vy??0)*drag;
  const x=clamp((s.x??0)+(s.vx+vx)*t*.5,-US_WALL_PUSH_MAX_OFFSET,US_WALL_PUSH_MAX_OFFSET);
  const y=clamp((s.y??0)+(s.vy+vy)*t*.5,-US_WALL_PUSH_MAX_OFFSET,US_WALL_PUSH_MAX_OFFSET);
  const drift=Math.exp(-.65*t);
  return {x:x*drift,y:y*drift,
    vx:Math.abs(vx)<.2?0:vx,vy:Math.abs(vy)<.2?0:vy};
}

export function canReflectWallShot(shot) {
  return shot?.reflectable===true&&!shot.colossal&&!shot.instantUnshielded &&
    !shot.cryoImpact&&!shot.reflected;
}
export function wallReflectionVector(wall,x,y,enemy=null){
  // Se possível, o ricochete retorna ao inimigo que atirou.
  const normal={x:Math.cos(wall.angle),y:Math.sin(wall.angle)};
  const dx=enemy?.sprite?.active?enemy.sprite.x-x:normal.x;
  const dy=enemy?.sprite?.active?enemy.sprite.y-y:normal.y;
  const len=Math.hypot(dx,dy);
  const vx=len>.001?dx/len:normal.x,vy=len>.001?dy/len:normal.y;
  const mixX=vx*.87+normal.x*.13,mixY=vy*.87+normal.y*.13;
  const mag=Math.max(.001,Math.hypot(mixX,mixY));
  return {vx:mixX/mag*US_WALL_REFLECTION_SPEED,
    vy:mixY/mag*US_WALL_REFLECTION_SPEED};
}

export const US_WALL_SOLID_MARGIN=3;
const EPS=1e-8;

// Interseção exata entre um segmento e um círculo: devolve o primeiro
// instante de contato (0–1), mesmo que ambos os quadros terminem fora.
function sweepCircle(x1,y1,x2,y2,cx,cy,radius){
  const dx=x2-x1,dy=y2-y1,fx=x1-cx,fy=y1-cy;
  const a=dx*dx+dy*dy,c=fx*fx+fy*fy-radius*radius;
  if(c<=0)return 0;
  if(a<=EPS)return null;
  const b=2*(fx*dx+fy*dy),d=b*b-4*a*c;
  if(d<0)return null;
  const t=(-b-Math.sqrt(d))/(2*a);
  return t>=0&&t<=1?t:null;
}

// A parede é o arco externo de 120°, com pontas arredondadas.
// Só bloqueia a passagem de FORA para DENTRO: inimigos que já estão
// dentro podem sair, mas não conseguem invadir de volta pelo arco.
// A colisão é contínua e retorna uma posição no lado de fora.
export function solidAmericanWallCollision(wall,fromX,fromY,toX,toY,enemyRadius=0){
  const arc=wall?.currentArc??wall?.arc??0;
  if(!(arc>0)||!Number.isFinite(fromX)||!Number.isFinite(fromY)||
     !Number.isFinite(toX)||!Number.isFinite(toY))return null;
  const radius=Math.max(0,Number(enemyRadius)||0);
  const barrierThickness=12+radius;
  const safeRadius=wall.radius+barrierThickness+US_WALL_SOLID_MARGIN;
  const dx=toX-fromX,dy=toY-fromY;
  const fromDistance=Math.hypot(fromX-wall.x,fromY-wall.y);
  const withinAngle=(x,y)=>Math.abs(Math.atan2(
    Math.sin(Math.atan2(y-wall.y,x-wall.x)-wall.angle),
    Math.cos(Math.atan2(y-wall.y,x-wall.x)-wall.angle)))<=arc/2+1e-7;
  const candidates=[];
  // Colisão com a faixa curva: interceptar ANTES da nave atravessar.
  const tArc=sweepCircle(fromX,fromY,toX,toY,wall.x,wall.y,safeRadius);
  if(fromDistance>=safeRadius-EPS && tArc!==null){
    const x=fromX+dx*tArc,y=fromY+dy*tArc;
    if(withinAngle(x,y))candidates.push({t:tArc,x,y,cx:wall.x,cy:wall.y,
      distance:safeRadius});
  }
  // Tampas arredondadas também são sólidas: evita atravessar a ponta
  // por um ângulo ligeiramente fora dos 120°.
  for(const sign of [-1,1]){
    const angle=wall.angle+sign*arc/2;
    const cx=wall.x+Math.cos(angle)*wall.radius;
    const cy=wall.y+Math.sin(angle)*wall.radius;
    const edgeRadius=barrierThickness+US_WALL_SOLID_MARGIN;
    const t=sweepCircle(fromX,fromY,toX,toY,cx,cy,edgeRadius);
    if(t===null)continue;
    const x=fromX+dx*t,y=fromY+dy*t;
    // De dentro para fora não há colisão: permite fugir do muro.
    const fromAlong=(fromX-cx)*Math.cos(angle)+(fromY-cy)*Math.sin(angle);
    if(fromDistance<wall.radius-barrierThickness && fromAlong<0)continue;
    candidates.push({t,x,y,cx,cy,distance:edgeRadius});
  }
  // Se a parede abriu sobre um inimigo perto da curva, retirá-lo
  // gentilmente da área ocupada (evita spawn em cima do escudo).
  if(!candidates.length && fromDistance<safeRadius &&
      fromDistance>=Math.max(0,wall.radius-barrierThickness*2) &&
      withinAngle(toX,toY) && Math.hypot(toX-wall.x,toY-wall.y)<safeRadius){
    const length=Math.max(EPS,Math.hypot(toX-wall.x,toY-wall.y));
    return {x:wall.x+(toX-wall.x)*safeRadius/length,
      y:wall.y+(toY-wall.y)*safeRadius/length,
      collided:true,kind:'overlap'};
  }
  if(!candidates.length)return null;
  candidates.sort((a,b)=>a.t-b.t);
  const first=candidates[0];
  // Restituição ao primeiro ponto de contato; nunca ao ponto que já
  // estava do lado de dentro após um grande salto entre frames.
  const vx=first.x-first.cx,vy=first.y-first.cy;
  const len=Math.max(EPS,Math.hypot(vx,vy));
  return {x:first.cx+vx/len*first.distance,
    y:first.cy+vy/len*first.distance,
    collided:true,kind:'swept',t:first.t};
}
