// Brasil 2 — Arraial Balístico, decisões 77–101. Funções puras para testes.
export const ARRAIAL = Object.freeze({
  duration: 2200, fireworkCount: 20, ringCount: 6, orbitRadius: 100,
  fireworkRadius: 37, fireworkDamage: 1, finaleRadius: 150, finaleDamage: 5,
  flameReach: 15, flameInterval: 500, flameDamage: 0.5,
  shieldDomeRadius: 110, fireRingRadius: 40, fireRingMaxRadius: 94,
  fireRingOffsetY: -43, firePulseDuration: 650, firePulseDamage: 1,
});
export function fireworkSchedule(count = ARRAIAL.fireworkCount, duration = ARRAIAL.duration) {
  // Seis estouros simultâneos formam o anel no instante zero.
  // Os demais percorrem uma espiral que fecha sobre o balão.
  const ringCount = Math.min(ARRAIAL.ringCount, count);
  const spiralCount = count - ringCount;
  const ring = Array.from({length:ringCount},(_,i)=>{
    const angle=-Math.PI/2+2*Math.PI*i/ringCount;
    return {at:0,x:Math.cos(angle)*ARRAIAL.orbitRadius,
      y:Math.sin(angle)*ARRAIAL.orbitRadius, damaging:true};
  });
  const spiral = Array.from({length:spiralCount},(_,i)=>{
    const progress=(i+1)/(spiralCount+1);
    const angle=-Math.PI/2+progress*Math.PI*3.5;
    const radius=ARRAIAL.orbitRadius*(1-progress);
    // Cadência crescente, convergindo antes da detonação do balão aos 2,2 s.
    const time=duration*(1-Math.pow(1-progress,1.6))*0.96;
    return {at:Math.round(time),x:Math.cos(angle)*radius,y:Math.sin(angle)*radius, damaging:true};
  });
  return [...ring,...spiral];
}
export function withinBlast(ex, ey, x, y, enemyRadius, blastRadius) {
  return Math.hypot(x-ex,y-ey) <= blastRadius + enemyRadius;
}
export function withinFlame(x, y, radius, ex, ey, enemyRadius, fullRing = false) {
  // Escudo visual é semicírculo superior com centro deslocado 10 px.
  const dx=ex-x, dy=ey-y;
  const d=Math.hypot(dx,dy);
  return (fullRing || dy <= enemyRadius) && d <= radius + ARRAIAL.flameReach + enemyRadius
    && d >= Math.max(0,radius-enemyRadius);
}

export function firePulseRadius(elapsed) {
  const t=Math.max(0,Math.min(1,elapsed/ARRAIAL.firePulseDuration));
  return ARRAIAL.fireRingRadius+(ARRAIAL.fireRingMaxRadius-ARRAIAL.fireRingRadius)*Math.sin(Math.PI*t);
}
