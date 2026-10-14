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

export function shotAngles(aimAngle, bulletsPerShot) {
  if (bulletsPerShot <= 1) return [aimAngle];
  // Dispersão pequena, simétrica em torno da direção apontada.
  return Array.from({ length: bulletsPerShot }, (_, i) => (
    aimAngle + (i - (bulletsPerShot - 1) / 2) * 0.10
  ));
}
