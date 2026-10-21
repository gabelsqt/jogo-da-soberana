// Soberana v0.35 — grupos coreografados. Matemática sem Phaser,
// compartilhada por campanha e laboratório e testável de forma isolada.

export const SWARM_DANCES = Object.freeze([
  'serpentine', 'cross', 'spiral', 'circle',
]);
export const SWARM_ENTRIES = Object.freeze(['together', 'staggered']);
export const TACTICAL_FORMATIONS = Object.freeze(['triangle', 'square']);
/** Ritmo global dos inimigos comuns (tipos 1–5). Chefões Tipo 6
 * conservam seu sistema próprio de fases, velocidades e telegráficos. */
export const STANDARD_INVADER_FLIGHT_FACTOR = 0.78;

/** Cinemática da onda 0: 1 portal sozinho, depois pares simultâneos.
 * Cinco pontos reais distintos, sem encaixe nos três corredores antigos. */
export const WAVE0_PORTAL_SEQUENCE = Object.freeze([
  Object.freeze({at:800, portalX:480, count:8}),
  Object.freeze({at:4600, portalX:235, count:10}),
  Object.freeze({at:4600, portalX:725, count:10}),
  Object.freeze({at:9600, portalX:125, count:10}),
  Object.freeze({at:9600, portalX:835, count:10}),
]);


export const WAVE0_EASY_PACING=Object.freeze({
  // A quantidade e a posição de cada portal ficam em WAVE0_PORTAL_SEQUENCE.
  danceDuration:6.5,    // Movimentos iniciais mais suaves e previsíveis.
  holdDuration:3.1,     // Dar tempo de mirar antes do mergulho.
  firstShotDelay:1.5,   // v0.49.1: 0,4 s após terminar a dança.
  shotStagger:0.20,     // Tiros da mesma formação não caem todos de uma vez.
  diveSpeedMultiplier:0.70,
  bulletSpeedMultiplier:0.85,
});

// Onda 1: primeiro combate após a introdução. Grupos menores, menos salvas
// e voo progressivamente mais baixo. Não modifica as outras ondas/laboratórios.
export const WAVE1_PACING = Object.freeze({
  swarmTimes: Object.freeze([400,2300,4300,6400,8600,10800,12700]),
  swarmCounts: Object.freeze([4,5,5,5,5,6,6]),
  squadCounts: Object.freeze([3,4,4]),
  swarmPortalY: 120,
  tacticalPortalY: 192,
  bulletSpeedMultiplier: 0.9,
  bulletDamage: 10,
  impactDamageMultiplier: 0.75,
});

// Um ou dois atiradores por esquadrilha: as outras naves ainda podem mergulhar.
export function wave1FormationShooter(kind,index,count) {
  const n=Math.max(1,Math.trunc(Number(count)||1));
  if(kind==='swarm')return index===Math.floor((n-1)/2);
  return index===Math.floor(n/3) || index===Math.floor(2*n/3);
}

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
  // v0.49.3: sequência ensaiada de CINCO portais no céu do Rio:
  // primeiro o central isolado, depois dois pares simultâneos. Os 48
  // inimigos continuam com a entrada dos projéteis adiada na onda 0.
  if (wave === 0) {
    return WAVE0_PORTAL_SEQUENCE.map(({at,portalX,count})=>({
      at,portalX,type:1,pattern:'swarm',count,level:1,
    }));
  }
  if(wave===1){
    const squads=legacyEvents.filter(event=>event.type===2)
      .map((event,index)=>({
        ...event,pattern:'tactical',group:true,
        count:WAVE1_PACING.squadCounts[Math.min(index,WAVE1_PACING.squadCounts.length-1)],
      }));
    const swarms=WAVE1_PACING.swarmTimes.map((at,index)=>({
      at,type:1,level:1,pattern:'swarm',count:WAVE1_PACING.swarmCounts[index],
    }));
    return [...squads,...swarms].sort((a,b)=>a.at-b.at);
  }
  const regular = legacyEvents.filter(event => event.type !== 1).map(event => {
    if (event.type !== 2) return { ...event };
    return {
      ...event,
      pattern: 'tactical',
      group: true,
      count: progressiveGroupCount(wave, 2, event.at / 19500)+(wave<=2?1:0),
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
      at: Math.round(320 + 12480 * Math.pow(progress, 0.75)),
      type: 1,
      pattern: 'swarm',
      count: wave<=2?progressiveGroupCount(wave,1,progress)+2:progressiveGroupCount(wave,1,progress),
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
  const stagger = 0; // sem posições aleatórias: grupo sempre simétrico
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
    case 'lowSweep':
      // Onda 1: o conjunto entra perto de y=120 e desce de forma legível.
      return {x:x+Math.sin(t*Math.PI*2)*90,
        y:120+115*t+7*Math.sin(t*Math.PI)};
    case 'lowZigzag':
      return {x:x+Math.sin(t*Math.PI*3)*78,
        y:120+115*t+5*Math.sin(t*Math.PI*2)};
    case 'circle':
      return {x:x+Math.sin(t*Math.PI*2)*94,
        y:mix(48,184,t)-Math.cos(t*Math.PI*2)*26};
    default:
      return { x: x + Math.sin(t * Math.PI * 3) * 115,
        y: mix(-28, 179, t) };
  }
}

export function swarmDancePosition(group, index, elapsed) {
  const center = swarmDanceCenter(group, elapsed);
  const slots = Array.from({length:group.count},(_,i)=>
    swarmOffset(i,group.count,group.pattern));
  const minX=Math.min(...slots.map(p=>p.x));
  const maxX=Math.max(...slots.map(p=>p.x));
  const minY=Math.min(...slots.map(p=>p.y));
  const maxY=Math.max(...slots.map(p=>p.y));
  // Limita o CENTRO, não as naves: preserva a dança e a formação.
  const x=group.boundToScreen?clamp(center.x,38-minX,960-38-maxX):center.x;
  const y=group.boundToScreen?clamp(center.y,42-minY,540-105-maxY):center.y;
  const slot=slots[index];
  return {x:x+slot.x,y:y+slot.y};
}

export function tacticalFormationOffset(formation, index, count) {
  const i = index - (count - 1) / 2;
  if (formation === 'square') {
    const columns=Math.ceil(Math.sqrt(count)),rows=Math.ceil(count/columns);
    return {x:(index%columns-(columns-1)/2)*38,
      y:(Math.floor(index/columns)-(rows-1)/2)*35};
  }
  if (formation === 'triangle') {
    let row=0,slot=index;
    while(slot>=row+1){slot-=row+1;row++;}
    const rows=Math.ceil((Math.sqrt(8*count+1)-1)/2);
    return {x:(slot-row/2)*43,y:(row-(rows-1)/2)*37};
  }
  if (formation === 'column') {
    return { x: (index % 2 === 0 ? -13 : 13), y: i * 29 };
  }
  if (formation === 'v') return { x: i * 43, y: Math.abs(i) * 17 };
  return { x: i * 43, y: 0 };
}

// Tipo 2: duas voltas GRANDES no céu, depois parada em formação e investida.
export function tacticalManeuverPosition(group, index, elapsed) {
  const hold = group.holdDuration ?? 1.5;
  const moveDuration = Math.max(0.5, group.duration - hold);
  const t = clamp(elapsed / moveDuration, 0, 1);
  const eased = t * t * (3 - 2 * t);
  const angle = Math.PI * 4 * eased * (group.direction ?? 1);
  const orbitRadiusX = 140; // antes 78: a órbita agora preenche o céu.
  const orbitRadiusY = group.lowFlight ? 100 : 125;
  // Inicia no portal, desenha duas voltas abaixo dele e retorna ao início
  // antes da formação de ataque, sem teletransportar os invasores.
  const cx = group.centerX + orbitRadiusX * Math.sin(angle);
  const cy = (group.portalY ?? 125) +
    orbitRadiusY * (1 - Math.cos(angle));
  const formA = {x:0,y:0};
  const formB = tacticalFormationOffset(group.finalFormation ?? 'triangle',index,group.count);
  // Em formação para toda a pausa, sem oscilação nem deslocamento.
  const offsets=Array.from({length:group.count},(_,i)=>tacticalFormationOffset(group.finalFormation??'triangle',i,group.count));
  const minX=Math.min(...offsets.map(p=>p.x))*eased;
  const maxX=Math.max(...offsets.map(p=>p.x))*eased;
  const minY=Math.min(...offsets.map(p=>p.y))*eased;
  const maxY=Math.max(...offsets.map(p=>p.y))*eased;
  const safeX=group.boundToScreen?clamp(cx,38-minX,960-38-maxX):cx;
  const safeY=group.boundToScreen?clamp(cy,42-minY,540-105-maxY):cy;
  return {x:safeX+mix(formA.x,formB.x,eased),
    y:safeY+mix(formA.y,formB.y,eased)};
}

export function tacticalAttackPosition(group, index, elapsed) {
  const t = clamp(elapsed / group.attackDuration, 0, 1);
  const form = tacticalFormationOffset(group.finalFormation ?? 'triangle', index, group.count);
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
