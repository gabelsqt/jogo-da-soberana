// Nível 2: aprofunda o estilo de cada país antes da primeira torre (nível 3).
// Regras puras, para testes sem Phaser. Números ainda sujeitos a playtest.
export const SECOND_UPGRADES = {
  br: {
    title: 'Minha Casa, Meu Escudo',
    description: 'Caco de vidro e cerca elétrica: todos os escudos ativos dão choque em OVNIs próximos.',
    tower: false,
  },
  us: {
    title: 'Dano Colateral',
    description: 'Quando a Fragmentação destrói um OVNI, provoca uma explosão secundária menor.',
    tower: false,
  },
  jp: {
    title: 'Corte Residual',
    description: 'A Katana deixa uma cicatriz elétrica no céu que fere inimigos que a atravessam.',
    tower: false,
  },
  ru: {
    title: 'Recuo Estratégico',
    description: 'O empurrão do Camarada Canhão fica mais forte perto das defesas.',
    tower: false,
  },
  cn: {
    title: 'Compre 2, Leve 3',
    description: 'A cada cinco disparos, o canhão lança três projéteis em vez de dois.',
    tower: false,
  },
};

export const ELECTRIC_FENCE_EXTRA_RANGE = 35;
export const ELECTRIC_FENCE_DAMAGE = 0.5;
export const ELECTRIC_FENCE_INTERVAL = 250;
export const ELECTRIC_SLOW_FACTOR = 0.90;
export const ELECTRIC_SLOW_DURATION = 400;
export const COLLATERAL_RADIUS = 50;
export const COLLATERAL_DAMAGE = 0.75;
export const RESIDUAL_DURATION = 600;
export const RESIDUAL_DAMAGE = 1;
export const RESIDUAL_HALF_WIDTH = 8;
export const PROMO_EVERY_SHOTS = 5;

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
    promoEvery: selected.has('cn') ? PROMO_EVERY_SHOTS : 0,
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

// A promoção adiciona UM projétil a cada quinta rajada do canhão, não
// a cada quinta bala isolada. Permanece coerente com outros upgrades mistos.
export function promotionProjectileCount(baseCount, shotNumber, every = PROMO_EVERY_SHOTS) {
  if (!Number.isInteger(shotNumber) || shotNumber <= 0 || every <= 0) return baseCount;
  return baseCount + (shotNumber % every === 0 ? 1 : 0);
}

// Quanto mais perto do chão, maior o recuo. O teto de velocidade é aplicado
// separadamente na física do recuo para impedir saltos bruscos de posição.
export function strategicKnockback(base, enemyY, nearStart = 160, nearEnd = 440) {
  const position = Math.min(1, Math.max(0, (enemyY - nearStart) / (nearEnd - nearStart)));
  return base * (1 + position);
}
