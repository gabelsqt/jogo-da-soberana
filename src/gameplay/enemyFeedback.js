// Game feel visual: feedback de acerto e destruição dos OVNIs.
// Regras puras, sem Phaser; nunca alteram HP, velocidade ou hitbox.
const HIT_PROFILES = Object.freeze({
  1: { shake: 2, flashMs: 60, shakeMs: 120 },
  2: { shake: 3, flashMs: 70, shakeMs: 140 },
  3: { shake: 4, flashMs: 80, shakeMs: 160 },
  4: { shake: 5, flashMs: 90, shakeMs: 180 },
  5: { shake: 6, flashMs: 100, shakeMs: 205 },
  // Reservado para a implementação do chefão final.
  6: { shake: 4, flashMs: 120, shakeMs: 220 },
});

const DEATH_PROFILES = Object.freeze({
  1: { radius: 23, fragments: 5, duration: 260, ring: false, stages: 1, color: 0xffb575 },
  2: { radius: 31, fragments: 7, duration: 315, ring: false, stages: 1, color: 0xc796ff },
  3: { radius: 45, fragments: 10, duration: 420, ring: true, stages: 1, color: 0xffce74 },
  // O caça Tipo 4 é pequeno, mas difícil: a celebração supera o Tipo 3.
  4: { radius: 62, fragments: 16, duration: 570, ring: true, stages: 2, color: 0xff649c },
  5: { radius: 103, fragments: 23, duration: 900, ring: true, stages: 2, color: 0x78f7f0 },
  6: { radius: 155, fragments: 30, duration: 1300, ring: true, stages: 3, color: 0xffffff },
});

export const MAX_SIMULTANEOUS_DEATH_EFFECTS = 24;

export function hitProfileFor(type) {
  const profile = HIT_PROFILES[type];
  if (!profile) throw new Error('Tipo de inimigo sem reação visual: ' + type);
  return { ...profile };
}

export function deathProfileFor(type) {
  const profile = DEATH_PROFILES[type];
  if (!profile) throw new Error('Tipo de inimigo sem explosão visual: ' + type);
  return { ...profile };
}

export function hitReactionAt(type, elapsedMs) {
  const profile = hitProfileFor(type);
  const age = Math.max(0, elapsedMs);
  const progress = Math.min(1, age / profile.shakeMs);
  const strength = (1 - progress) ** 1.6;
  return {
    // Posicionamento puramente visual e determinístico, sem novos impulsos.
    dx: age >= profile.shakeMs ? 0 :
      Math.sin(age * 0.17 + 0.9) * profile.shake * strength,
    rotation: age >= profile.shakeMs ? 0 :
      Math.sin(age * 0.12 + 0.45) * (type === 5 ? 0.023 : 0.055) * strength,
    scale: age >= profile.shakeMs ? 1 : 1 + 0.065 * strength,
    flash: age < profile.flashMs,
  };
}

export function deathBurstScale(type) {
  const p = deathProfileFor(type);
  return {
    radius: p.radius,
    fragments: p.fragments,
    duration: p.duration,
    stages: p.stages,
  };
}
