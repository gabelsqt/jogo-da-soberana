// Soberana v0.35 — grupos coreografados. Matemática sem Phaser,
// compartilhada por campanha e laboratório e testável de forma isolada.

export const SWARM_DANCES = Object.freeze([
  'serpentine', 'traverse', 'cross', 'spiral', 'scattered',
]);
export const SWARM_ENTRIES = Object.freeze(['together', 'staggered']);
export const TACTICAL_FORMATIONS = Object.freeze(['triangle', 'square']);

export const V035_SWARM_SIZES = Object.freeze([
  [3, 5], [3, 5], [3, 5],
  [6, 10], [6, 10], [6, 10],
  [10, 15], [10, 15],
  [15, 18], [15, 18],
]);
export const V035_SQUAD_SIZES = Object.freeze([
  [6, 8], [6, 8], [7, 9],
  [8, 10], [8, 11], [9, 12],
  [10, 13], [10, 14],
  [12, 15], [12, 16],
]);

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const mix = (a, b, t) => a + (b - a) * t;

export function campaignWaveIndex(mode) {
  const match = /^wave([0-9])$/.exec(mode);
  return match ? Number(match[1]) : null;
}

export function progressiveGroupCount(wave, type, progress) {
  const range = (type === 1 ? V035_SWARM_SIZES : V035_SQUAD_SIZES)[clamp(wave, 0, 9)];
  return Math.round(mix(range[0], range[1], clamp(progress, 0, 1)));
}

// Preserva eventos de bombardeiros, caças, cruzadores e escoltas. Substitui
// naves básicas isoladas por poucos grupos, sem multiplicar os 30 spawns
// originais por 18 na última noite. Densidade cresce dentro da noite.
export function getV035WaveEvents(mode, legacyEvents) {
  const wave = campaignWaveIndex(mode);
  if (wave === null) return legacyEvents.map(event => ({ ...event }));
  const regular = legacyEvents.filter(event => event.type !== 1).map(event => {
    if (event.type !== 2) return { ...event };
    return {
      ...event,
      pattern: 'tactical',
      group: true,
      count: progressiveGroupCount(wave, 2, event.at / 19500),
    };
  });
  const basic = legacyEvents.filter(event => event.type === 1);
  if (!basic.length) return regular.sort((a, b) => a.at - b.at);
  const totalOldShips = basic.reduce((sum, event) =>
    sum + (event.pattern === 'spread' || event.pattern === 'line'
      ? (event.count ?? 1) : 1), 0);
  const [lo, hi] = V035_SWARM_SIZES[wave];
  const groupCount = Math.max(2, Math.ceil(totalOldShips / ((lo + hi) / 2)));
  const lastWarning = [...basic].reverse().find(event => event.warning)?.warning;
  const firstLevel = basic[0]?.level ?? 1;
  const lastLevel = basic.at(-1)?.level ?? firstLevel;
  const swarms = Array.from({ length: groupCount }, (_, i) => {
    const progress = groupCount === 1 ? 1 : i / (groupCount - 1);
    return {
      at: Math.round(420 + 19080 * Math.pow(progress, 0.73)),
      type: 1,
      pattern: 'swarm',
      count: progressiveGroupCount(wave, 1, progress),
      level: progress >= 0.55 ? lastLevel : firstLevel,
      ...(i === groupCount - 1 && lastWarning ? { warning: lastWarning } : {}),
    };
  });
  return [...regular, ...swarms].sort((a, b) => a.at - b.at);
}

export function swarmOffset(index, count, pattern = 'serpentine') {
  const columns = Math.ceil(Math.sqrt(Math.max(1, count) * 1.5));
  const rows = Math.ceil(Math.max(1, count) / columns);
  const col = index % columns, row = Math.floor(index / columns);
  const stepX = count >= 15 ? 36 : 43;
  const stepY = count >= 15 ? 28 : 34;
  const stagger = pattern === 'scattered' ? (row % 2 ? 13 : -8) : 0;
  return {
    x: (col - (columns - 1) / 2) * stepX + stagger,
    y: (row - (rows - 1) / 2) * stepY,
  };
}

// O conjunto todo segue a MESMA curva. Cada nave ocupa seu slot fixo;
// perdas deixam lacunas, em vez de rearranjar sobreviventes.
export function swarmDanceCenter(group, elapsed) {
  const t = clamp(elapsed / group.duration, 0, 1);
  const x = group.centerX;
  const direction = group.direction ?? 1;
  switch (group.pattern) {
    case 'traverse':
      return { x: x + direction * (t * 350 - 175),
        y: mix(-28, 183, t) + 17 * Math.sin(t * Math.PI * 2) };
    case 'cross':
      return { x: x + Math.sin(t * Math.PI * 2) * 165,
        y: mix(-28, 191, t) + 20 * Math.sin(t * Math.PI * 4) };
    case 'spiral': {
      const radius = 125 * (1 - 0.6 * t);
      const angle = t * Math.PI * 3;
      return { x: x + Math.cos(angle) * radius - 125,
        y: mix(-28, 172, t) + Math.sin(angle) * 37 * t };
    }
    case 'scattered':
      return { x: x + Math.sin(t * Math.PI * 2.5) * 65,
        y: mix(-28, 175, t) };
    default:
      return { x: x + Math.sin(t * Math.PI * 3) * 115,
        y: mix(-28, 179, t) };
  }
}

export function swarmDancePosition(group, index, elapsed) {
  const center = swarmDanceCenter(group, elapsed);
  const slot = swarmOffset(index, group.count, group.pattern);
  return { x: center.x + slot.x, y: center.y + slot.y };
}

export function tacticalFormationOffset(formation, index, count) {
  const i = index - (count - 1) / 2;
  if (formation === 'column') {
    return { x: (index % 2 === 0 ? -13 : 13), y: i * 29 };
  }
  if (formation === 'v') return { x: i * 43, y: Math.abs(i) * 17 };
  return { x: i * 43, y: 0 };
}

// Tipo 2: duas voltas no céu, desaceleração e parada em coluna antes da descida.
export function tacticalManeuverPosition(group, index, elapsed) {
  const hold = group.holdDuration ?? 1.5;
  const moveDuration = Math.max(0.5, group.duration - hold);
  const t = clamp(elapsed / moveDuration, 0, 1);
  const eased = t * t * (3 - 2 * t);
  const angle = Math.PI * 4 * eased;
  const orbitRadius = 60;
  // Centro retorna à posição inicial ao completar duas voltas.
  const cx = group.centerX + orbitRadius * Math.sin(angle);
  const cy = 126 - orbitRadius * (1 - Math.cos(angle)) * 0.55;
  const formA = tacticalFormationOffset('v',index,group.count);
  const formB = tacticalFormationOffset('column',index,group.count);
  // Em formação para toda a pausa, sem oscilação nem deslocamento.
  return { x:cx+mix(formA.x,formB.x,eased),
    y:cy+mix(formA.y,formB.y,eased) };
}

export function tacticalAttackPosition(group, index, elapsed) {
  const t = clamp(elapsed / group.attackDuration, 0, 1);
  const form = tacticalFormationOffset('column', index, group.count);
  const start = group.attackOrigin;
  const target = group.target;
  // O centro faz a investida; as posições relativas seguem intactas,
  // inclusive os buracos deixados por naves destruídas.
  const controlX = (start.x + target.x) / 2 + (group.direction ?? 1) * 55;
  return {
    x: (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * controlX + t * t * target.x + form.x,
    y: mix(start.y, target.y, t) + form.y,
  };
}

// Tipo 1 escolhe a defesa mais próxima do centro do enxame.
// Tipo 2 mede a porcentagem de vida e escudo restantes, não a distância.
// Destruir uma torre provoca escolha nova do grupo inteiro.
export function chooseGroupDefenseTarget(targets, x, y, kind,
  cannonHealth = 100, cannonShield = 80, cannonShieldMax = 80) {
  if (!targets.length) return null;
  const nearest = target =>
    Math.hypot(target.x - x, target.y - y);
  const vulnerability = target => {
    if (target.kind === 'cannon') {
      return 0.7 * clamp(cannonHealth / 100, 0, 1) +
        0.3 * clamp(cannonShield / Math.max(1, cannonShieldMax), 0, 1);
    }
    const tower = target.tower;
    return 0.7 * clamp(tower.health / Math.max(1, tower.healthMax), 0, 1) +
      0.3 * clamp(tower.shield / Math.max(1, tower.shieldMax), 0, 1);
  };
  return [...targets].sort((a, b) => (kind === 'tactical'
    ? vulnerability(a) - vulnerability(b) : 0) ||
    nearest(a) - nearest(b))[0];
}
