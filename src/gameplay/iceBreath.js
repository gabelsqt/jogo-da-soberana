// Inverno Eterno (nível 10): o tiro principal vira um jato contínuo em cone.
// Colisões calculadas a cada tick, não a cada partícula de fumaça.
export const ICE_BREATH_RANGE=530;
export const ICE_BREATH_HALF_ANGLE=0.32;
export const ICE_BREATH_TICK_MS=110;

export function insideIceBreathCone(ox,oy,angle,x,y,collisionRadius=0,
  range=ICE_BREATH_RANGE,halfAngle=ICE_BREATH_HALF_ANGLE){
  const dx=x-ox,dy=y-oy;
  const along=dx*Math.cos(angle)+dy*Math.sin(angle);
  const across=Math.abs(-dx*Math.sin(angle)+dy*Math.cos(angle));
  const r=Math.max(0,collisionRadius);
  return along>=-r && along<=range+r &&
    across<=Math.max(8,along)*Math.tan(halfAngle)+r;
}

export function iceBreathMotes(angle,elapsed,count=44){
  // Posições determinísticas e móveis, sem criar objetos/tweens por frame.
  // f ∈ [0,1] é o avanço de cada nuvem ao longo do cone.
  const particles=[];
  for(let i=0;i<count;i++){
    const speed=0.6+(i%5)*0.11;
    const f=((elapsed*0.00056*speed+i*0.61803398875)%1+1)%1;
    const wave=Math.sin(i*13.71+elapsed*.004);
    const lateral=Math.sin(i*27.1)*0.68+0.23*wave;
    const spread=(8+f*ICE_BREATH_RANGE*Math.tan(ICE_BREATH_HALF_ANGLE))*lateral;
    const along=14+f*(ICE_BREATH_RANGE-17);
    particles.push({
      x:Math.cos(angle)*along-Math.sin(angle)*spread,
      y:Math.sin(angle)*along+Math.cos(angle)*spread,
      radius:3.4+f*11+(i%4)*1.2,
      alpha:(0.15+0.18*(1-Math.abs(f-0.55)))*(0.65+0.35*Math.sin(i*9.4)**2),
      icy:i%7===0,
    });
  }
  return particles;
}

/**
 * Base fixa do sopro, independente do dano das balas e dos estilhaços.
 * Contra o Tipo 6 existe uma parcela adicional de perfuração para compensar
 * os quatro módulos protegidos e o HP escalado pela build.
 */
export const ICE_BREATH_BASE_DAMAGE=4;
export const ICE_BREATH_BOSS_BASE_DAMAGE=24;
export function iceBreathTickDamage(basicDamage=1,isType6=false){
  const scaled=Math.max(0,Number(basicDamage)||0)*0.45;
  return ICE_BREATH_BASE_DAMAGE+scaled+
    (isType6?ICE_BREATH_BOSS_BASE_DAMAGE:0);
}

/**
 * O Tipo 6 ocupa uma barra larga: a mira deve detectar módulos laterais,
 * mas o jato aplica somente UM hit direto por ciclo à fortaleza inteira.
 * A área do cone é mantida para congelar grupos de naves normais.
 * `rects` vem de type6TargetRects (módulos vivos/núcleo aberto).
 */
export function iceBreathType6Targets(ox,oy,angle,rects){
  return rects.filter(rect=>insideIceBreathCone(ox,oy,angle,
    rect.x,rect.y,Math.min(rect.halfWidth,rect.halfHeight)));
}

// Escolhe o módulo mais próximo do eixo central do sopro, não o primeiro
// da lista. Assim, apontar para o gerador ou núcleo continua intencional.
export function iceBreathType6Target(ox,oy,angle,rects){
  const targets=iceBreathType6Targets(ox,oy,angle,rects);
  const sine=Math.sin(angle),cosine=Math.cos(angle);
  let best=null,bestOffset=Infinity;
  for(const rect of targets){
    const offset=Math.abs((rect.x-ox)*(-sine)+(rect.y-oy)*cosine);
    if(offset<bestOffset){best=rect;bestOffset=offset;}
  }
  return best;
}
