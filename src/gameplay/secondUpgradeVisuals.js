// Parâmetros EXCLUSIVAMENTE VISUAIS dos upgrades de nível 2.
// Não alteram dano, alcance, física, cooldown nem quantidade de projéteis.
export const COLLATERAL_VISUAL_DELAY_MS = 95;

export function fenceGlowAt(timeMs, shieldFraction = 1) {
  const strength = Math.min(1, Math.max(0, shieldFraction));
  const pulse = 0.5 + 0.5 * Math.sin(Math.max(0, timeMs) * 0.009);
  return strength * (0.42 + pulse * 0.58);
}

export function encoreRimGlowAt(ageMs) {
  return 0.72 + 0.22 * Math.sin(Math.max(0, ageMs) * 0.013);
}

// A rajada chinesa de nível 2 ganha destaque no projétil CENTRAL.
// Com apenas dois projéteis (nível 1), nenhum se torna central.
export function isChinaCenterProjectile(index, count, hasChinaUpgrade) {
  return Boolean(hasChinaUpgrade && count >= 3 &&
    Number.isInteger(index) && index === Math.floor(count / 2));
}

export function strategicDistortionOpacity(intensity) {
  const clamped = Math.min(1, Math.max(0, intensity));
  return 0.12 + clamped * 0.4;
}
