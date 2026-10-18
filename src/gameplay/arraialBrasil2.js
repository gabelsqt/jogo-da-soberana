// Brasil 2 — Arraial Balístico, decisões 77–101. Funções puras para testes.
export const ARRAIAL = Object.freeze({
  duration: 4000, fireworkCount: 12, orbitRadius: 100,
  fireworkRadius: 12, fireworkDamage: 1, finaleRadius: 50, finaleDamage: 5,
  flameReach: 15, flameInterval: 500, flameDamage: 0.5,
});
export function fireworkSchedule(count = ARRAIAL.fireworkCount, duration = ARRAIAL.duration) {
  // Intervalos decrescentes: começa espaçado e acelera, sem colidir com o final.
  const weights = Array.from({length: count}, (_, i) => count - i);
  const sum = weights.reduce((a,b) => a+b, 0);
  let elapsed = 0;
  return weights.map((weight,i) => {
    elapsed += weight / sum * duration * 0.94;
    const angle = -Math.PI/2 + 2*Math.PI*i/count;
    return {at: Math.round(elapsed), x: Math.cos(angle)*ARRAIAL.orbitRadius,
      y: Math.sin(angle)*ARRAIAL.orbitRadius};
  });
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
