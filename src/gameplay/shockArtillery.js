// Regras puras da Artilharia de Choque do Urso de Ferro.
// Estes cálculos não dependem de Phaser e podem ser testados no Node.

export const SHOCK_BLAST_RADIUS = 85;
export const SHOCK_INNER_RADIUS = 43;
export const SHOCK_SPLASH_DAMAGE = 2.4;
export const SHOCK_KNOCKBACK = 0.13;
export const SHOCK_MAX_LEAD_SECONDS = 1.45;

export function predictShockImpact(
  startX, startY, targetX, targetY, velocityX, velocityY,
  projectileSpeed, maxLeadSeconds = SHOCK_MAX_LEAD_SECONDS,
) {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const speed = Math.max(1, projectileSpeed);
  const vx = Number.isFinite(velocityX) ? velocityX : 0;
  const vy = Number.isFinite(velocityY) ? velocityY : 0;
  // Solve ||(target + velocity*t) - shooter|| = projectileSpeed*t.
  const a = vx * vx + vy * vy - speed * speed;
  const b = 2 * (dx * vx + dy * vy);
  const c = dx * dx + dy * dy;
  const roots = [];
  if (Math.abs(a) < 1e-7) {
    if (Math.abs(b) > 1e-7) roots.push(-c / b);
  } else {
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      roots.push((-b - root) / (2 * a), (-b + root) / (2 * a));
    }
  }
  const positive = roots.filter((time) => time >= 0 && Number.isFinite(time));
  const raw = positive.length ? Math.min(...positive) : Math.hypot(dx, dy) / speed;
  const time = Math.max(0, Math.min(raw, Math.max(0, maxLeadSeconds)));
  return { x: targetX + vx * time, y: targetY + vy * time, time };
}

export function segmentHitsCircle(x1, y1, x2, y2, centerX, centerY, radius) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq > 0
    ? Math.max(0, Math.min(1, ((centerX - x1) * dx + (centerY - y1) * dy) / lengthSq))
    : 0;
  return Math.hypot(
    centerX - (x1 + dx * t),
    centerY - (y1 + dy * t),
  ) <= Math.max(0, radius);
}

export function shockBlastDamage(distance, targetRadius, baseDamage, radius = SHOCK_BLAST_RADIUS) {
  const effectiveDistance = Math.max(0, distance - Math.max(0, targetRadius));
  if (effectiveDistance > radius) return 0;
  return effectiveDistance <= SHOCK_INNER_RADIUS
    ? baseDamage : SHOCK_SPLASH_DAMAGE;
}

// Recuo visual sem teleporte: velocidade é integrada ao deslocamento, que
// perde energia suavemente. O movimento normal do inimigo permanece intacto.
export function advanceShockOffset(offset, dt) {
  const seconds = Math.max(0, dt);
  const movementDamping = Math.exp(-3.4 * seconds);
  const velocityDamping = Math.exp(-6 * seconds);
  const vx = offset.vx * velocityDamping;
  const vy = offset.vy * velocityDamping;
  return {
    x: (offset.x + (offset.vx + vx) / 2 * seconds) * movementDamping,
    y: (offset.y + (offset.vy + vy) / 2 * seconds) * movementDamping,
    vx: Math.abs(vx) < 0.1 ? 0 : vx,
    vy: Math.abs(vy) < 0.1 ? 0 : vy,
  };
}
