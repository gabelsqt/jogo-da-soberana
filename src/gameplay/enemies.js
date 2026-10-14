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
    shotHp: 2,
  },
  4: {
    id: 4, name: 'Caça Relâmpago', color: 0xfa5275,
    hp: 4, speed: 300, width: 36, height: 28,
    behavior: 'fighter',
  },
  5: {
    id: 5, name: 'Nave-Mãe', color: 0x45cddd,
    hp: 24, speed: 28, width: 126, height: 60,
    behavior: 'boss',
    shotHp: 2,
  },
};

export const ENEMY_SHOT_COLOR = 0xffda6d;

export function enemyDefinition(type) {
  const definition = ENEMY_TYPES[type];
  if (!definition) throw new Error(`Tipo de invasor desconhecido: ${type}`);
  return definition;
}

export function enemyContactRadius(type) {
  const e = enemyDefinition(type);
  return Math.max(e.width, e.height) * 0.34;
}
