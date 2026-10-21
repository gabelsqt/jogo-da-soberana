import { restrictedAimAngle } from './combat.js';

// Zona de explosão persistente do tiro especial, inspirada no Missile Command.
// Mantida como regra pura para que o dano e o efeito visual usem o mesmo raio.
export const SPECIAL_BLAST_DURATION = 3000;      // 3 segundos no total
export const SPECIAL_BLAST_EXPAND_DURATION = 450; // crescimento inicial
export const SPECIAL_BLAST_SHRINK_DURATION = 500; // retração final
export const SPECIAL_BLAST_MAX_RADIUS = 110;
export const SPECIAL_BLAST_START_RADIUS = 12;

function unscaledSpecialBlastRadius(ageMs) {
  if (ageMs < 0 || ageMs >= SPECIAL_BLAST_DURATION) return 0;
  if (ageMs < SPECIAL_BLAST_EXPAND_DURATION) {
    const t = ageMs / SPECIAL_BLAST_EXPAND_DURATION;
    return SPECIAL_BLAST_START_RADIUS +
      (SPECIAL_BLAST_MAX_RADIUS - SPECIAL_BLAST_START_RADIUS) * (1 - (1 - t) ** 2);
  }
  const shrinkAt = SPECIAL_BLAST_DURATION - SPECIAL_BLAST_SHRINK_DURATION;
  if (ageMs <= shrinkAt) return SPECIAL_BLAST_MAX_RADIUS;
  return SPECIAL_BLAST_MAX_RADIUS *
    (SPECIAL_BLAST_DURATION - ageMs) / SPECIAL_BLAST_SHRINK_DURATION;
}

export function specialBlastRadius(ageMs,scale=1) {
  return unscaledSpecialBlastRadius(ageMs)*Math.max(0,scale);
}
export function blastCatchesTarget(blastX, blastY, ageMs, targetX, targetY, targetRadius = 0, scale=1) {
  if (ageMs < 0 || ageMs >= SPECIAL_BLAST_DURATION) return false;
  const radius = specialBlastRadius(ageMs,scale) + targetRadius;
  return Math.hypot(targetX - blastX, targetY - blastY) <= radius;
}

// A mira e o disparo especial usam a MESMA regra de restrição do canhão.
// A marca mostra o ponto real da detonação, mesmo se o mouse estiver muito
// perto, além do alcance máximo ou fora do arco de disparo permitido.
export const SPECIAL_MIN_DISTANCE = 140;
export const SPECIAL_MAX_DISTANCE = 580;

// A detonação deve estar dentro do campo visível inclusive com cursor
// fora da tela ou mira quase horizontal. A zona de 24 px acomoda o VFX.
export const SPECIAL_TARGET_MARGIN=24;
export function specialTargetPoint(cannonX,cannonY,pointerX,pointerY,
  width=960,height=540){
  const angle=restrictedAimAngle(cannonX,cannonY,pointerX,pointerY);
  const dx=Math.cos(angle),dy=Math.sin(angle);
  const rawDistance=Math.hypot(pointerX-cannonX,pointerY-cannonY);
  const desired=Math.max(SPECIAL_MIN_DISTANCE,
    Math.min(SPECIAL_MAX_DISTANCE,rawDistance));
  // Encontro do raio de mira com as bordas internas do campo de jogo.
  const horizontal=Math.abs(dx)<1e-8?Infinity:
    ((dx>0?width-SPECIAL_TARGET_MARGIN:SPECIAL_TARGET_MARGIN)-cannonX)/dx;
  const vertical=Math.abs(dy)<1e-8?Infinity:
    ((dy>0?height-SPECIAL_TARGET_MARGIN:SPECIAL_TARGET_MARGIN)-cannonY)/dy;
  const distance=Math.min(desired,Math.max(0,Math.min(horizontal,vertical)));
  return {x:cannonX+dx*distance,y:cannonY+dy*distance,angle,distance};
}

// Move o especial na direção do alvo REAL, partindo da boca física do
// canhão. Sem limiar de 6px nem cruzar o alvo num quadro e perdê-lo para
// sempre. Funciona também em FPS baixos ou sob travamento temporário.
export function advanceSpecialProjectile(x,y,targetX,targetY,speed,dt){
  const dx=targetX-x,dy=targetY-y;
  const distance=Math.hypot(dx,dy);
  const step=Math.max(0,Number(speed)||0)*Math.max(0,Number(dt)||0);
  if(distance<=1e-6||step>=distance){
    return {x:targetX,y:targetY,arrived:true};
  }
  const f=step/distance;
  return {x:x+dx*f,y:y+dy*f,arrived:false};
}
