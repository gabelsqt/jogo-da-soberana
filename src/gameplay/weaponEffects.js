// Regras puras dos efeitos ofensivos dos primeiros upgrades dos EUA e Japão.
// Separadas de Phaser para testar colisões e balanceamento automaticamente.

export const PLASMA_EVERY_SHOTS = 4;
export const PLASMA_DAMAGE = 2;
export const PLASMA_HALF_WIDTH = 14;
export const PLASMA_RANGE = 1150;
export const FRAGMENT_RADIUS = 78;
export const FRAGMENT_DAMAGE = 1.5;

export function isPlasmaShot(basicShotCount, enabled) {
  return Boolean(enabled) && basicShotCount > 0
    && basicShotCount % PLASMA_EVERY_SHOTS === 0;
}

// Menor distância do centro do alvo ao feixe que se estende da boca do canhão.
// Respeita o início e fim do feixe; não acerta naves atrás do canhão.
export function laserHitsTarget(startX, startY, endX, endY, targetX, targetY,
  halfWidth = PLASMA_HALF_WIDTH, targetRadius = 0) {
  const dx = endX - startX;
  const dy = endY - startY;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return false;
  const progress = ((targetX - startX) * dx + (targetY - startY) * dy) / lengthSq;
  if (progress < 0 || progress > 1) return false;
  const projectedX = startX + progress * dx;
  const projectedY = startY + progress * dy;
  return Math.hypot(targetX - projectedX, targetY - projectedY)
    <= halfWidth + Math.max(0, targetRadius);
}

export function fragmentHitsTarget(x, y, targetX, targetY,
  targetRadius = 0, explosionRadius = FRAGMENT_RADIUS) {
  return Math.hypot(targetX - x, targetY - y)
    <= explosionRadius + Math.max(0, targetRadius);
}
