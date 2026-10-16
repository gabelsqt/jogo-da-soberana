// Protótipos visuais e mecânicos das primeiras torres de apoio.
export const TOWER_DEFINITIONS = {
  br: {
    id: 'br', label: 'CARAMELO', glyph: 'C', color: 0xc58b51,
    healthMax: 110, shieldMax: 65, range: 550, interval: 720,
    damage: 1.15, speed: 400, type: 'bullet',
  },
  us: {
    id: 'us', label: 'ÁGUIA', glyph: 'A', color: 0x619fff,
    healthMax: 100, shieldMax: 65, range: 680, interval: 1550,
    damage: 2.5, speed: 290, type: 'missile',
  },
  jp: {
    id: 'jp', label: 'KKACHI', glyph: 'K', color: 0xd4a7ff,
    healthMax: 95, shieldMax: 70, range: 710, interval: 1450,
    damage: 2.5, speed: 0, type: 'laser',
  },
  ru: {
    id: 'ru', label: 'URSO', glyph: 'U', color: 0xf27e75,
    healthMax: 130, shieldMax: 75, range: 600, interval: 2000,
    damage: 3.7, speed: 410, knockback: 0.13, type: 'shell',
    blastRadius: 85,
  },
  cn: {
    id: 'cn', label: 'PANDAPRIME', glyph: 'P', color: 0xf4d46e,
    healthMax: 100, shieldMax: 70, range: 640, interval: 1850,
    damage: 1.1, speed: 320, count: 2, type: 'drone',
  },
};

export const SUPPORT_TOWER_POSITIONS = [
  { x: 280, y: 483, side: 'left' },
  { x: 680, y: 483, side: 'right' },
];

export function towerDefinition(id) {
  return TOWER_DEFINITIONS[id] ?? null;
}

export function chooseTowerAttackTarget(towerX, towerY, enemies, range) {
  // Prioriza o alvo mais perigoso (mais próximo do chão) dentro do alcance.
  let target = null;
  let priority = -Infinity;
  for (const enemy of enemies) {
    const x = enemy.sprite?.x ?? enemy.x;
    const y = enemy.sprite?.y ?? enemy.y;
    if (typeof x !== 'number' || typeof y !== 'number') continue;
    if (Math.hypot(towerX - x, towerY - y) > range) continue;
    if (y > priority) {
      priority = y;
      target = enemy;
    }
  }
  return target;
}

export function canInstallTower(currentIds, candidateId) {
  const selected = [...new Set(currentIds)].filter((id) => towerDefinition(id));
  if (!towerDefinition(candidateId)) return false;
  return selected.includes(candidateId) || selected.length < SUPPORT_TOWER_POSITIONS.length;
}
