// Primeira leva de upgrades: efeitos jogáveis, um por país.
// O catálogo de níveis 2–10 será incorporado em versões posteriores.
export const FIRST_UPGRADES = [
  {
    id: 'br', name: 'Brasil', flag: 'BR', color: 0x2a9c65,
    title: 'Gambiarra Balística',
    description: '+50% de cadência e disparos alternando levemente para os lados. Gambiarra é tecnologia.' ,
  },
  {
    id: 'us', name: 'EUA', flag: 'US', color: 0x477dc4,
    title: 'Munição de Fragmentação',
    description: 'Ao acertar, cada projétil explode e danifica outros invasores próximos.'
  },
  {
    id: 'jp', name: 'Japão', flag: 'JP', color: 0xd85c78,
    title: 'Katana de Plasma',
    description: 'A cada 3 disparos, uma lâmina de energia corta todos os inimigos em linha.'
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
    basicSpeed: 480,
    basicDamage: 1,
    pierce: 1,
    fragmentation: false,
    plasmaEvery: 0,
    knockback: 0,
    bulletsPerShot: 1,
    brazilZigzag: false,
    specialCooldown: 8000,
  };
  switch (upgradeId) {
    case 'br':
      stats.basicInterval = Math.round(stats.basicInterval / 1.5);
      stats.brazilZigzag = true;
      break;
    case 'us': stats.fragmentation = true; break;
    case 'jp': stats.plasmaEvery = 3; break;
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
        stats.basicInterval /= 1.5;
        stats.brazilZigzag = true;
        break;
      case 'us':
        stats.fragmentation = true;
        break;
      case 'jp':
        stats.plasmaEvery = 3;
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
    Math.min(maxAngle, aimAngle + (i - (bulletsPerShot - 1) / 2) * 0.19),
  ));
}

// Retorno visual imediato: cores e silhuetas ajudam a identificar a
// diferença mesmo com inimigos frágeis, que morreriam com qualquer upgrade.
export function shotVisualFor(ids = []) {
  const selected = new Set(normalizeLabUpgrades(ids));
  if (selected.has('jp')) return {
    color: 0xe997ff, impactColor: '#e997ff',
    // Se Rússia + Coreia estiverem ativas, o feixe continua violeta,
    // mas a munição básica também ganha o calibre visual russo.
    width: selected.has('ru') ? 11 : 4, length: 20,
  };
  if (selected.has('ru')) return {
    // Era 9 × 14 px: um aumento discreto (~20%), puramente visual.
    // O raio de colisão continua fixo em GameScene.
    color: 0xff846b, impactColor: '#ffbc8a', width: 11, length: 17,
  };
  if (selected.has('us')) return {
    color: 0x79b9ff, impactColor: '#9dd7ff', width: 8, length: 15,
  };
  if (selected.has('br')) return {
    color: 0x75f2a0, impactColor: '#9fffc7', width: 5, length: 12,
  };
  if (selected.has('cn')) return {
    color: 0xffdf72, impactColor: '#ffe6a0', width: 6, length: 14,
  };
  return { color: 0xffe29b, impactColor: '#ffe29b', width: 5, length: 11 };
}

// Alteração visual aprovada: primeiro tiro à esquerda, segundo à direita.
// Cada trajetória segue RETA após sair do canhão: não há zig-zague durante o voo.
// A abertura pequena (2,6 graus) mantém o tiro útil contra naves pequenas.
export const BRAZIL_ALTERNATING_SPREAD = 0.045;

export function brazilAlternatingAngle(aimAngle, shotNumber, enabled = false) {
  if (!enabled || !Number.isInteger(shotNumber) || shotNumber < 1) return aimAngle;
  const alternate = shotNumber % 2 === 1 ? -1 : 1;
  const min = -Math.PI + Math.PI / 12;
  const max = -Math.PI / 12;
  return Math.max(min, Math.min(max, aimAngle + alternate * BRAZIL_ALTERNATING_SPREAD));
}

// VFX combináveis: uma build RU + CN mantém tanto a sensação de impacto
// quanto as duas trilhas brilhantes, independentemente da cor principal do tiro.
export function shotVfxFor(ids = []) {
  const chosen = new Set(normalizeLabUpgrades(ids));
  const heavy = chosen.has('ru');
  const multiple = chosen.has('cn');
  const improvised = chosen.has('br');
  return {
    heavy,
    multiple,
    improvised,
    fragments: chosen.has('us'),
    recoil: heavy ? 8 : improvised ? 4 : multiple ? 3 : 2,
  };
}
