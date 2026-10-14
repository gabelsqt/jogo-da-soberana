// Zona de explosão persistente do tiro especial, inspirada no Missile Command.
// Mantida como regra pura para que o dano e o efeito visual usem o mesmo raio.
export const SPECIAL_BLAST_DURATION = 3000;      // 3 segundos no total
export const SPECIAL_BLAST_EXPAND_DURATION = 450; // crescimento inicial
export const SPECIAL_BLAST_SHRINK_DURATION = 500; // retração final
export const SPECIAL_BLAST_MAX_RADIUS = 110;
export const SPECIAL_BLAST_START_RADIUS = 12;

export function specialBlastRadius(ageMs) {
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

export function blastCatchesTarget(blastX, blastY, ageMs, targetX, targetY, targetRadius = 0) {
  if (ageMs < 0 || ageMs >= SPECIAL_BLAST_DURATION) return false;
  const radius = specialBlastRadius(ageMs) + targetRadius;
  return Math.hypot(targetX - blastX, targetY - blastY) <= radius;
}
