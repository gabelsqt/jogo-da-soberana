// Nível 2: aprofunda o estilo de cada país antes da primeira torre (nível 3).
// Regras puras, para testes sem Phaser. Números ainda sujeitos a playtest.
export const SECOND_UPGRADES = {
  br: {
    title: 'Minha Casa, Meu Escudo',
    description: 'Caco de vidro e cerca elétrica: amplia todos os escudos e aplica choque de 1 de dano com recarga.',
    tower: false,
  },
  us: {
    title: 'Dano Colateral',
    description: 'Quando a Fragmentação destrói um OVNI, provoca uma explosão secundária de área ampliada.',
    tower: false,
  },
  jp: {
    title: 'Corte Residual',
    description: 'A Katana abre uma fenda de vácuo turquesa duradoura, atingindo naves que a atravessam.',
    tower: false,
  },
  ru: {
    title: 'Recuo Estratégico',
    description: 'O empurrão aumenta perto do chão e cria ondas de impacto visualmente mais intensas.',
    tower: false,
  },
  cn: {
    title: 'Compre 2, Leve 3',
    description: 'O canhão dispara três projéteis em todas as rajadas, em vez de dois.',
    tower: false,
  },
};

export const ELECTRIC_FENCE_EXTRA_RANGE = 35;
export const ELECTRIC_FENCE_RADIUS_BONUS = 18;
export const ELECTRIC_FENCE_DAMAGE = 1;
export const ELECTRIC_FENCE_INTERVAL = 800;
export const ELECTRIC_SLOW_FACTOR = 0.90;
export const ELECTRIC_SLOW_DURATION = 400;
export const COLLATERAL_RADIUS = 94;
export const COLLATERAL_DAMAGE = 0.75;
export const RESIDUAL_DURATION = 2200;
export const RESIDUAL_DAMAGE = 1;
export const RESIDUAL_HALF_WIDTH = 12;

export function normalizeSecondUpgradeIds(ids = []) {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids)].filter((id) => Object.hasOwn(SECOND_UPGRADES, id));
}

export function secondUpgradeCountries(state = {}) {
  const counts = new Map();
  for (const id of Array.isArray(state?.choices) ? state.choices : []) {
    if (Object.hasOwn(SECOND_UPGRADES, id)) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return [...counts].filter(([, count]) => count >= 2).map(([id]) => id);
}

export function applySecondUpgradeStats(base, ids = []) {
  const selected = new Set(normalizeSecondUpgradeIds(ids));
  return {
    ...base,
    electricFence: selected.has('br'),
    collateral: selected.has('us'),
    residualSlash: selected.has('jp'),
    strategicRecoil: selected.has('ru'),
    bulletsPerShot: base.bulletsPerShot + (selected.has('cn') ? 1 : 0),
  };
}

// Zona semicircular: apenas naves no lado de fora ou na borda superior da
// cúpula recebem descarga. Nenhum escudo é criado em posições vazias.
export function electricFieldReaches(cx, cy, radius, targetX, targetY,
  extra = ELECTRIC_FENCE_EXTRA_RANGE) {
  const dx = targetX - cx;
  const dy = targetY - cy;
  const distance = Math.hypot(dx, dy);
  return targetY <= cy + 1 && distance >= radius - 14
    && distance <= radius + extra;
}

// Quanto mais perto do chão, maior o recuo. O teto de velocidade é aplicado
// separadamente na física do recuo para impedir saltos bruscos de posição.
export function strategicKnockback(base, enemyY, nearStart = 160, nearEnd = 440) {
  return base * (1 + strategicRecoilIntensity(enemyY, nearStart, nearEnd));
}

// Um mesmo parâmetro define a força da onda de choque VISUAL e o recuo físico.
export function strategicRecoilIntensity(enemyY, nearStart = 160, nearEnd = 440) {
  return Math.min(1, Math.max(0, (enemyY - nearStart) / Math.max(1, nearEnd - nearStart)));
}

// Aparência da fenda: abre rapidamente, pulsa aberta e se fecha gradualmente.
// O resultado é calculável sem Phaser e impede flashes instantâneos na criação.
export function vacuumRiftAppearance(ageMs, durationMs = RESIDUAL_DURATION) {
  const age = Math.max(0, ageMs);
  if (age >= durationMs) return { width: 0, alpha: 0 };
  const t = Math.min(1, age / 250);
  const opened = 1 - (1 - t) ** 3;
  const fade = Math.min(1, (durationMs - age) / 450);
  return {
    width: 1 + 13 * opened * fade,
    alpha: 0.75 * Math.min(1, fade * 1.25),
  };
}
