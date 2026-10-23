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
