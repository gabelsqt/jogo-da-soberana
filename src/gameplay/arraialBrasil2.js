// Brasil 2 — Arraial Balístico, decisões 77–101. Funções puras para testes.
export const ARRAIAL = Object.freeze({
  duration: 4000, fireworkCount: 12, orbitRadius: 100,
  fireworkRadius: 12, fireworkDamage: 1, finaleRadius: 50, finaleDamage: 5,
  flameReach: 15, flameInterval: 500, flameDamage: 0.5,
});
export function fireworkSchedule(count = ARRAIAL.fireworkCount, duration = ARRAIAL.duration) {
  // Seis estouros simultâneos formam o anel no instante zero.
  // Os seis restantes percorrem uma espiral que fecha sobre o balão.
  const ringCount = Math.ceil(count / 2);
  const spiralCount = count - ringCount;
  const ring = Array.from({length:ringCount},(_,i)=>{
    const angle=-Math.PI/2+2*Math.PI*i/ringCount;
    return {at:0,x:Math.cos(angle)*ARRAIAL.orbitRadius,
      y:Math.sin(angle)*ARRAIAL.orbitRadius};
  });
  const spiral = Array.from({length:spiralCount},(_,i)=>{
    const progress=(i+1)/(spiralCount+1);
    const angle=-Math.PI/2+progress*Math.PI*3.5;
    const radius=ARRAIAL.orbitRadius*(1-progress);
    // Cadência crescente, convergindo antes da detonação do balão aos 4 s.
    const time=duration*(1-Math.pow(1-progress,1.6))*0.96;
    return {at:Math.round(time),x:Math.cos(angle)*radius,y:Math.sin(angle)*radius};
  });
  return [...ring,...spiral];
}
export function withinBlast(ex, ey, x, y, enemyRadius, blastRadius) {
  return Math.hypot(x-ex,y-ey) <= blastRadius + enemyRadius;
}
export function withinFlame(x, y, radius, ex, ey, enemyRadius) {
  // Escudo visual é semicírculo superior com centro deslocado 10 px.
  const dx=ex-x, dy=ey-y;
  const d=Math.hypot(dx,dy);
  return dy <= enemyRadius && d <= radius + ARRAIAL.flameReach + enemyRadius
    && d >= Math.max(0,radius-enemyRadius);
}
