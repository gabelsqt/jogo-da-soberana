// Inimigos do GDD. Tipos 2–5 usam quadrados coloridos como arte provisória.
// Apenas o Tipo 1 possui sprite animado neste protótipo.
export const ENEMY_TYPES = {
  1: {
    id: 1, name: 'Invasor Básico', color: 0xf0774a,
    hp: 1, speed: 78, width: 55, height: 55,
    behavior: 'dive',
  },
  2: {
    id: 2, name: 'Esquadrão de Formação', color: 0x9f65f3,
    hp: 2, speed: 120, width: 29, height: 29,
    behavior: 'formation',
  },
  3: {
    id: 3, name: 'Bombardeiro', color: 0xf8ba56,
    hp: 6, speed: 50, width: 59, height: 45,
    behavior: 'bomber',
    shotHp: 1,
  },
  4: {
    id: 4, name: 'Caça Relâmpago', color: 0xfa5275,
    hp: 4, speed: 300, width: 36, height: 28,
    behavior: 'fighter',
  },
  5: {
    id: 5, name: 'Cruzador-Colmeia', color: 0x45cddd,
    hp: 24, speed: 28, width: 126, height: 60,
    behavior: 'boss',
    shotHp: 1,
  },
  6: {
    id: 6, name: 'Fortaleza Tipo 6', color: 0xff4967,
    hp: 600, speed: 38, width: 790, height: 122,
    behavior: 'boss6', shotHp: 2,
  },
};

// Ciclo do Bombardeiro Tipo 3: sobrevoa uma defesa por doze segundos,
// solta quatro salvas com intervalo de três segundos e só então recua.
export const BOMBER_HOVER_SECONDS = 12;
export const BOMBER_SHOT_INTERVAL_SECONDS = 3;

export function advanceBomberHover(shotTimer, phaseAge, dt,
  interval = BOMBER_SHOT_INTERVAL_SECONDS, duration = BOMBER_HOVER_SECONDS) {
  const timer = Math.max(0, shotTimer) + Math.max(0, dt);
  const shots = Math.floor((timer + 1e-9) / interval);
  return {
    shots,
    shotTimer: Math.max(0, timer - shots * interval),
    retreat: phaseAge + 1e-8 >= duration,
  };
}

export const ENEMY_SHOT_COLOR = 0xffda6d;

export function enemyDefinition(type) {
  const definition = ENEMY_TYPES[type];
  if (!definition) throw new Error(`Tipo de invasor desconhecido: ${type}`);
  return definition;
}

export function enemyContactRadius(type) {
  const e = enemyDefinition(type);
  if(type===6)return 55; // colisão real delegada aos cinco alvos independentes
  return Math.max(e.width, e.height) * 0.34;
}


// Paleta por nível. Só a COR muda: dimensões e hitboxes vêm sempre do
// tipo original. Níveis 1/2 preservam as cores da versão anterior;
// nível 3 (Onda 4) inicia a frota blindada laranja.
export const ENEMY_TIER_COLORS = {
  3: 0xeaa149, // Onda 4 — laranja reforçado
  4: 0xe47bba, // Onda 5 — magenta
  5: 0xa77bec, // Onda 6 — violeta
  6: 0x609df0, // Onda 7 — azul elétrico
  7: 0x5bdbef, // Onda 8 — ciano
  8: 0xf0d687, // Onda 9 — dourado pálido
  9: 0xe9f4ff, // Onda 10 — branco frio
  10: 0xff788a, // Reservado para variantes futuras
};

export function enemyTierColor(level) {
  const tier = Math.max(1, Math.min(10, Math.trunc(level) || 1));
  return ENEMY_TIER_COLORS[tier] ?? null;
}

// A v0.35 mantém HP dos níveis 1 e 2, mas reduz bastante a
// resistência do Tipo 1: o perigo dos enxames está no número de naves.
// Os Tipos 2–5 conservam sua progressão de blindagem anterior.
// A velocidade dos níveis 3+ NÃO continua aumentando: resistência,
// e não aceleração descontrolada, é a base da dificuldade.
export const BASIC_INVADER_HP_BY_LEVEL = Object.freeze([
  1, 2, 2, 3, 3, 3, 4, 4, 4, 4,
]);
export function enemyStats(type, level = 1) {
  const base = enemyDefinition(type);
  const tier = Math.max(1, Math.min(10, Math.trunc(level) || 1));
  const advanced = tier >= 2;
  const baseBonus = { 2: 1, 3: 2, 4: 1, 5: 8, 6: 0 };
  const hpPerLevel = { 2: 1, 3: 2, 4: 1, 5: 4, 6: 0 };
  const tint = enemyTierColor(tier);
  return {
    ...base,
    level: tier,
    hp: type === 1 ? BASIC_INVADER_HP_BY_LEVEL[tier - 1]
      : base.hp + (advanced ? baseBonus[type] : 0)
        + Math.max(0, tier - 2) * hpPerLevel[type],
    color: tint ?? base.color,
    tintColor: tint ?? (advanced ? 0xffd5a0 : 0xffffff),
    speed: Math.round(base.speed * (advanced ? 1.17 : 1)),
    shotInterval: type === 3 ? BOMBER_SHOT_INTERVAL_SECONDS
      : type === 5 ? (advanced ? 2.1 : 2.8) : null,
    // A partir do nível 2, bombardeiros soltam duas bombas convergentes.
    volleyCount: type === 3 && advanced ? 2 : 1,
    spawnCount: type === 5 && advanced ? 2 : 1,
    spawnInterval: type === 5 ? (advanced ? 3.0 : 4.2) : null,
    warningDuration: type === 4 ? (advanced ? 0.85 : 1.4) : null,
    // No nível 3+, a formação e o bombardeiro mantêm pressão por mais tempo.
    formationWaitBonus: tier >= 3 ? 1.8 : 0,
    bomberHoverDuration: BOMBER_HOVER_SECONDS,
    fighterExtraPasses: tier >= 3 ? 1 : 0,
  };
}

// Miniboss Tipo 5: no modo campanha das Ondas 8/9, a invocação
// precisa ter limite para a luta terminar e não criar enjame infinito.
export const MINIBOSS_MAX_SUMMONS = 12;
export const MINIBOSS_MAX_ACTIVE_MINIONS = 6;

export function minibossSummonCount(totalSpawned, activeMinions, requested = 2) {
  return Math.max(0, Math.min(
    Math.max(0, Math.trunc(requested)),
    MINIBOSS_MAX_SUMMONS - Math.max(0, Math.trunc(totalSpawned)),
    MINIBOSS_MAX_ACTIVE_MINIONS - Math.max(0, Math.trunc(activeMinions)),
  ));
}

// A fileira final e o círculo coordenado são padrões independentes dos
// atributos de HP/velocidade (possibilita balancear cada um depois).
export function lineFormationX(index, count, width = 960, margin = 46) {
  if (count <= 1) return width / 2;
  return margin + (width - 2 * margin) * index / (count - 1);
}

export function orbitalFormationPosition(centerX, centerY, index, count, age) {
  const theta = -Math.PI / 2 + index * 2 * Math.PI / count
    + age * (2 * Math.PI / 3.4);
  // O centro do círculo se desloca lentamente para dar vida ao esquadrão.
  return {
    // A formação orbital também cresce; antes era achatada na vertical.
    x: centerX + Math.sin(age * 0.85) * 25 + Math.cos(theta) * 205,
    y: centerY + Math.sin(theta) * 120,
  };
}

// O chefe passa do movimento vertical ao passeio horizontal sem teleporte.
export function bossCruiseX(entryX, age, amplitude = 130) {
  const entrance = Math.min(1, Math.max(0, age) / 1.2);
  return entryX + Math.sin(Math.max(0, age) * 0.7) * amplitude * entrance;
}
