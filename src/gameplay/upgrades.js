// Primeira leva de upgrades: efeitos jogáveis, um por país.
// O catálogo de níveis 2–10 será incorporado em versões posteriores.
export const FIRST_UPGRADES = [
  {
    id: 'br', name: 'Brasil', flag: 'BR', color: 0x2a9c65,
    title: 'Gambiarra Balística',
    description: 'Cadência do canhão +25%. A engenharia brasileira não pergunta como.',
  },
  {
    id: 'us', name: 'EUA', flag: 'US', color: 0x477dc4,
    title: 'Balas da Liberdade',
    description: 'Tiros básicos causam o dobro de dano.',
  },
  {
    id: 'jp', name: 'Japão', flag: 'JP', color: 0xd85c78,
    title: 'Protocolo Otaku',
    description: 'Tiros mais rápidos que atravessam até dois inimigos.',
  },
  {
    id: 'ru', name: 'Rússia', flag: 'RU', color: 0xc94d4d,
    title: 'Camarada Canhão',
    description: '+75% de dano e empurrão nos invasores atingidos.',
  },
  {
    id: 'cn', name: 'China', flag: 'CN', color: 0xdfa84c,
    title: 'AliExplode — Frete Grátis',
    description: 'Dois projéteis por disparo. Oferta sujeita a invasão.',
  },
];

export function getFirstUpgrade(id) {
  return FIRST_UPGRADES.find((upgrade) => upgrade.id === id) ?? null;
}

export function combatStatsFor(upgradeId) {
  const stats = {
    basicInterval: 500,
    basicDamage: 1,
    pierce: 1,
    knockback: 0,
    bulletsPerShot: 1,
    specialCooldown: 8000,
  };
  switch (upgradeId) {
    case 'br': stats.basicInterval = 400; break;
    case 'us': stats.basicDamage = 2; break;
    case 'jp':
      stats.basicInterval = 340;
      stats.pierce = 2;
      break;
    case 'ru':
      stats.basicDamage = 1.75;
      stats.knockback = 0.12;
      break;
    case 'cn': stats.bulletsPerShot = 2; break;
    default: break;
  }
  return stats;
}

// O laboratório permite ativar vários upgrades já implementados simultaneamente.
// A campanha continua usando apenas um por escolha, conforme o GDD.
export function normalizeLabUpgrades(ids = []) {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids)].filter((id) => getFirstUpgrade(id) !== null);
}

export function toggleLabUpgrade(ids, id) {
  const current = normalizeLabUpgrades(ids);
  if (!getFirstUpgrade(id)) return current;
  return current.includes(id)
    ? current.filter((selected) => selected !== id)
    : [...current, id];
}

export function combatStatsForLoadout(ids = []) {
  const stats = combatStatsFor(null);
  for (const id of normalizeLabUpgrades(ids)) {
    switch (id) {
      case 'br':
        stats.basicInterval *= 0.8;
        break;
      case 'us':
        stats.basicDamage *= 2;
        break;
      case 'jp':
        stats.basicInterval *= 0.68;
        stats.pierce = Math.max(stats.pierce, 2);
        break;
      case 'ru':
        stats.basicDamage *= 1.75;
        stats.knockback = Math.max(stats.knockback, 0.12);
        break;
      case 'cn':
        stats.bulletsPerShot += 1;
        break;
      default:
        break;
    }
  }
  stats.basicInterval = Math.round(stats.basicInterval);
  return stats;
}

export function shotAngles(aimAngle, bulletsPerShot) {
  if (bulletsPerShot <= 1) return [aimAngle];
  // Dispersão pequena, simétrica em torno da direção apontada.
  const minAngle = -Math.PI + Math.PI / 12;
  const maxAngle = -Math.PI / 12;
  // A dispersão também respeita os limites físicos do canhão.
  return Array.from({ length: bulletsPerShot }, (_, i) => Math.max(
    minAngle,
    Math.min(maxAngle, aimAngle + (i - (bulletsPerShot - 1) / 2) * 0.10),
  ));
}
