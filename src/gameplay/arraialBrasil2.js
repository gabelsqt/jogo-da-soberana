// Brasil 2 — Arraial Balístico, decisões 77–101. Funções puras para testes.
export const ARRAIAL = Object.freeze({
  duration: 2200, fireworkCount: 20, ringCount: 6, orbitRadius: 100,
  fireworkRadius: 27, fireworkDamage: 1, finaleRadius: 100, finaleDamage: 5,
  balloonHitRadius: 19, maxBurstVisuals: 10,
  flameReach: 15, flameInterval: 500, flameDamage: 0.5,
  shieldDomeRadius: 110, fireRingRadius: 43, fireRingMaxRadius: 122, fireRingFlatten: 0.38,
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

 
// Textos curtos, com humor de para-choque, sorteados no estouro final.
// Não são legendas de HUD: só aparecem sobre o balão ao terminar o especial.
export const ARRAIAL_TRUCK_PHRASES=Object.freeze([
  'QUEM TEM PRESSA COME POEIRA!',
  'NA SUBIDA É FÉ, NA DESCIDA É FREIO!',
  'QUEM ANDA NA LINHA É TREM!',
  'SE A VIDA APERTAR, BUZINE!',
  'MELHOR UM ROJÃO HOJE QUE DOIS AMANHÃ!',
  'DEVAGAR SE VAI LONGE. DE ROJÃO, MAIS!',
  'O MUNDO GIRA, MAS MEU FREIO NÃO!',
  'A INVEJA É PESADA, MAS MEU CAMINHÃO AGUENTA!',
  'NA DÚVIDA, VAI DE MARCHA RÉ!',
  'A ESTRADA É LONGA. O ROJÃO É CURTO!',
]);
export function arraialFinalPhrase(random=Math.random){
  const roll=Math.max(0,Math.min(.999999,Number(random())||0));
  return ARRAIAL_TRUCK_PHRASES[Math.floor(roll*ARRAIAL_TRUCK_PHRASES.length)];
}
export function randomArraialBurst(cx,cy,range=ARRAIAL.orbitRadius,random=Math.random){
  // sqrt(U) distribui os impactos pela área, não apenas ao redor do centro.
  const angle=(Number(random())||0)*Math.PI*2;
  const r=Math.sqrt(Math.max(0,Math.min(1,Number(random())||0)))*Math.max(0,range);
  return {x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r};
}
export function shotHitsArraialBalloon(x1,y1,x2,y2,cx,cy,bulletRadius=0){
  // Distância mínima do segmento físico até o balão; evita passar
  // direto pela hitbox em FPS baixo ou balas rápidas.
  const dx=x2-x1,dy=y2-y1;
  const lengthSq=dx*dx+dy*dy;
  const t=lengthSq<=1e-9?0:Math.max(0,Math.min(1,
    ((cx-x1)*dx+(cy-y1)*dy)/lengthSq));
  return Math.hypot(cx-(x1+dx*t),cy-(y1+dy*t))<=
    ARRAIAL.balloonHitRadius+Math.max(0,Number(bulletRadius)||0);
}
