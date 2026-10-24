// Protótipos visuais e mecânicos das primeiras torres de apoio.
export const TOWER_DEFINITIONS = {
  br: {
    id: 'br', label: 'RAJADAS BR', glyph: 'C', color: 0xc58b51,
    healthMax: 110, shieldMax: 65, range: 550, interval: 720,
    damage: 1.15, speed: 400, type: 'bullet',
  },
  us: {
    id: 'us', label: 'MÍSSEIS EUA', glyph: 'A', color: 0x619fff,
    healthMax: 100, shieldMax: 65, range: 680, interval: 1550,
    damage: 2.5, speed: 290, type: 'missile',
  },
  jp: {
    id: 'jp', label: 'FEIXES COREIA', glyph: 'K', color: 0xd4a7ff,
    healthMax: 95, shieldMax: 70, range: 710, interval: 1450,
    damage: 2.5, speed: 0, type: 'laser',
  },
  ru: {
    id: 'ru', label: 'ARTILHARIA RU', glyph: 'U', color: 0xf27e75,
    healthMax: 130, shieldMax: 75, range: 600, interval: 2000,
    damage: 3.7, speed: 410, knockback: 0.13, type: 'shell',
    blastRadius: 85,
  },
  cn: {
    id: 'cn', label: 'DRONES CHINA', glyph: 'P', color: 0xf4d46e,
    healthMax: 100, shieldMax: 70, range: 640, interval: 1850,
    damage: 1.1, speed: 320, count: 2, type: 'drone',
  },
};

// Arsenal da v0.32: o ataque antienxame e o destruidor possuem papéis fixos.
export const SWARM_WEAPONS = {
  br: { ...TOWER_DEFINITIONS.br, label: 'RAJADAS BR', type: 'bullet', count: 3, damage: 0.9, interval: 850, speed: 450 },
  us: { ...TOWER_DEFINITIONS.us, type: 'missile', damage: 1.1, count: 2, interval: 1700, splashRadius: 70 },
  jp: { ...TOWER_DEFINITIONS.jp, type: 'laser', damage: 1.1, interval: 1500, pierce: true },
  ru: { ...TOWER_DEFINITIONS.ru, label: 'RAJADAS RU', type: 'bullet', damage: 1.05, count: 3, interval: 1150, speed: 490 },
  cn: { ...TOWER_DEFINITIONS.cn, type: 'drone', count: 3, damage: 0.9 },
};
export const DESTROYER_WEAPONS = {
  br: { ...TOWER_DEFINITIONS.br, label: 'PESADO BR', type: 'missile', count: 1, damage: 9, interval: 2450, speed: 285 },
  us: { ...TOWER_DEFINITIONS.us, label: 'PERFURANTE EUA', type: 'missile', count: 1, damage: 10, interval: 2550, speed: 310 },
  jp: { ...TOWER_DEFINITIONS.jp, label: 'RAIO COREIA', type: 'laser', damage: 9, interval: 2700 },
  ru: { ...TOWER_DEFINITIONS.ru, label: 'ARTILHARIA RU', type: 'shell', damage: 12, interval: 2900, blastRadius: 45 },
  cn: { ...TOWER_DEFINITIONS.cn, label: 'CARGA CHINA', type: 'missile', count: 1, damage: 10, interval: 2750, speed: 250 },
};
export function upgradedTowerWeapon(country, role = 'swarm', level = 5) {
  const base = (role === 'destroyer' ? DESTROYER_WEAPONS : SWARM_WEAPONS)[country];
  if (!base) return null;
  const evolved = role === 'destroyer' ? level >= 8 : level >= 6;
  return evolved ? {
    ...base, damage: +(base.damage * 1.45).toFixed(3),
    interval: Math.round(base.interval * 0.87),
    ...(role === 'swarm' && base.count ? { count: base.count + 1 } : {}),
  } : { ...base };
}

// Limite do radar auxiliar: 10% superiores da altura jogável de 540 px.
export const TOWER_RADAR_BLIND_FRACTION = 0.10;

export function towerBlindZoneY(playfieldHeight) {
  return Math.round(playfieldHeight * TOWER_RADAR_BLIND_FRACTION);
}

export function towerSeesEnemy(enemy, blindZoneY, playfieldWidth = Infinity, playfieldHeight = Infinity) {
  const x = enemy?.sprite?.x ?? enemy?.x;
  const y = enemy?.sprite?.y ?? enemy?.y;
  return Number.isFinite(x) && Number.isFinite(y) &&
    y >= blindZoneY && y <= playfieldHeight && x >= 0 && x <= playfieldWidth;
}

// Todos os projéteis físicos das torres seguem o alvo a cada quadro.
// Limitar o passo à distância restante evita ultrapassar ou oscilar
// ao redor de uma nave quando ela muda de direção.
export function advanceGuidedTowerShot(x, y, targetX, targetY, speed, dt) {
  const dx = targetX - x, dy = targetY - y;
  const distance = Math.hypot(dx, dy);
  if (distance <= 0) return { x, y, vx: 0, vy: 0 };
  const velocity = Math.max(0, speed) / distance;
  const factor = Math.min(1, Math.max(0, dt) * Math.max(0, speed) / distance);
  return { x: x + dx * factor, y: y + dy * factor,
    vx: dx * velocity, vy: dy * velocity };
}

// Ao perder o alvo, a munição procura o inimigo elegível mais próximo,
// priorizando blindados no caso das Destruidoras. Nunca busca na zona cega.
export function chooseTowerHomingTarget(x, y, enemies, blindZoneY, playfieldWidth, role = 'swarm', playfieldHeight = Infinity) {
  const visible = enemies.filter(enemy =>
    towerSeesEnemy(enemy, blindZoneY, playfieldWidth, playfieldHeight));
  if (!visible.length) return null;
  const preferred = role === 'destroyer'
    ? visible.filter(enemy => enemy.type === 5 || enemy.type === 3 || (enemy.hp ?? 0) >= 4)
    : visible;
  const candidates = preferred.length ? preferred : visible;
  return candidates.reduce((closest, candidate) => {
    const distance = Math.hypot((candidate.sprite?.x ?? candidate.x) - x,
      (candidate.sprite?.y ?? candidate.y) - y);
    return !closest || distance < closest.distance
      ? { enemy: candidate, distance } : closest;
  }, null).enemy;
}

// Apontar não é disparar: a mira visual acompanha qualquer nave elegível
// dentro do alcance, mesmo quando a torre aguarda seu alvo prioritário.
// As regras mais seletivas de chooseSuitableTowerTarget continuam decidindo
// quando a munição realmente pode ser consumida.
export function chooseTowerTrackingTarget(tower, enemies, blindZoneY,
  playfieldWidth = Infinity, playfieldHeight = Infinity) {
  const candidates = enemies.filter(enemy => {
    if (!towerSeesEnemy(enemy, blindZoneY, playfieldWidth, playfieldHeight)) return false;
    const x = enemy.sprite?.x ?? enemy.x;
    const y = enemy.sprite?.y ?? enemy.y;
    return Math.hypot(x - tower.x, y - (tower.y - 22)) <= tower.definition.range;
  });
  if (!candidates.length) return null;
  // A Destruidora mira preferencialmente nos resistentes; as demais
  // acompanham a ameaça mais próxima da base mesmo que isolada.
  if (tower.role === 'destroyer') {
    const heavy = candidates.filter(enemy =>
      enemy.type === 5 || enemy.type === 3 || (enemy.hp ?? 0) >= 4);
    if (heavy.length) {
      heavy.sort((a, b) => (b.hp ?? 0) - (a.hp ?? 0) ||
        (b.sprite?.y ?? b.y) - (a.sprite?.y ?? a.y));
      return heavy[0];
    }
  }
  return candidates.reduce((closest, enemy) =>
    !closest || (enemy.sprite?.y ?? enemy.y) > (closest.sprite?.y ?? closest.y)
      ? enemy : closest, null);
}

export function towerChargeProgress(lastAttackAt, now, interval) {
  return Math.max(0, Math.min(1, (now - lastAttackAt) / Math.max(1, interval)));
}

// Só considera inimigos dentro do radar e do alcance. Destruidoras esperam
// blindados/bombardeiros; Antienxame espera grupos. Ambas podem reagir a uma
// ameaça isolada se ela estiver muito próxima das defesas.
export function chooseSuitableTowerTarget(tower, enemies, blindZoneY, dangerY = 390, playfieldWidth = Infinity, playfieldHeight = Infinity) {
  const { x, y, role, definition } = tower;
  const visible = enemies.filter(enemy =>
    towerSeesEnemy(enemy, blindZoneY, playfieldWidth, playfieldHeight) &&
    Math.hypot(x - (enemy.sprite?.x ?? enemy.x), (y - 22) - (enemy.sprite?.y ?? enemy.y)) <= definition.range,
  );
  if (!visible.length) return null;
  const byDanger = (a, b) => (b.sprite?.y ?? b.y) - (a.sprite?.y ?? a.y);
  if (role === 'destroyer') {
    const heavy = visible.filter(enemy =>
      enemy.type === 5 || enemy.type === 3 || (enemy.hp ?? 0) >= 4,
    );
    if (heavy.length) {
      heavy.sort((a, b) => (b.hp ?? 0) - (a.hp ?? 0) || byDanger(a, b));
      return heavy[0];
    }
  } else {
    const clusters = visible.map(enemy => ({
      enemy,
      neighbors: visible.filter(other => other !== enemy &&
        Math.hypot(
          (enemy.sprite?.x ?? enemy.x) - (other.sprite?.x ?? other.x),
          (enemy.sprite?.y ?? enemy.y) - (other.sprite?.y ?? other.y),
        ) <= 145).length,
    }));
    clusters.sort((a, b) => b.neighbors - a.neighbors || byDanger(a.enemy, b.enemy));
    if (clusters[0].neighbors > 0) return clusters[0].enemy;
  }
  return visible.filter(enemy => (enemy.sprite?.y ?? enemy.y) >= dangerY).sort(byDanger)[0] ?? null;
}

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
