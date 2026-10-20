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
