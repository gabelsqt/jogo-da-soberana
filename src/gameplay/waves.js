// Onda 0 -> primeira escolha de upgrade -> Onda 1.
// Laboratório é um modo independente para testar tipos 2–5 sem fingir que
// as ondas e upgrades restantes já foram desenvolvidos.
// Intervalos curtos e ataques simultâneos aumentam a pressão sem acelerar
// artificialmente a movimentação de um único OVNI.
const wave0Times = Array.from({ length: 20 }, (_, index) => 250 + index * 1280);
const wave0Packs = [
  { at: 7600, type: 1, pattern: 'spread', count: 3 },
  { at: 15300, type: 1, pattern: 'spread', count: 4 },
  { at: 23200, type: 1, pattern: 'spread', count: 5 },
];

export const WAVE_COUNTDOWN_SECONDS = 3;

// Antes da onda há 3, 2, 1. O relógio de inimigos só começa no fim.
export function countdownNumberAt(elapsedMs) {
  if (elapsedMs < 0 || elapsedMs >= WAVE_COUNTDOWN_SECONDS * 1000) return null;
  return WAVE_COUNTDOWN_SECONDS - Math.floor(elapsedMs / 1000);
}


export const MODES = {
  wave0: { title: 'ONDA 0', minDuration: 30000 },
  wave1: { title: 'ONDA 1', minDuration: 41000 },
  wave2: { title: 'ONDA 2', minDuration: 46000 },
  lab: { title: 'TESTE DE INIMIGOS', minDuration: 36000 },
  upgradeLab: { title: 'LAB DE UPGRADES', minDuration: Infinity },
};

export function getWaveEvents(mode) {
  // Laboratório livre: inimigos aparecem por timer próprio e nunca acaba a onda.
  if (mode === 'upgradeLab') return [];
  if (mode === 'wave0') {
    const events = wave0Times.map((at, index) => ({ at, type: 1, index }));
    return [...events, ...wave0Packs].sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave1') {
    // A Onda 1 mantém mais de uma ameaça na tela praticamente o tempo todo:
    // novos básicos a cada ~1s, rajadas espalhadas e as formações Tipo 2.
    const events = Array.from({ length: 32 }, (_, index) => ({
      at: 250 + index * 960,
      type: 1,
      level: index >= 20 && index % 4 === 0 ? 2 : 1,
      index,
    }));
    events.push(
      { at: 6000, type: 1, pattern: 'spread', count: 3 },
      { at: 8700, type: 2, group: true },
      { at: 15500, type: 1, pattern: 'spread', count: 4 },
      { at: 18300, type: 2, group: true, level: 2 },
      { at: 25600, type: 2, level: 2, pattern: 'orbit', count: 10 },
      { at: 27400, type: 1, level: 2, pattern: 'spread', count: 5 },
      // Ataque final preservado: uma fileira cheia de inimigos rápidos.
      { at: 34700, type: 1, level: 2, pattern: 'line', count: 10 },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave2') {
    // Nova ameaça: bombardeiros que disparam contra escudos e caças velozes,
    // com básicos mantendo a pressão. A Onda 2 ainda não é uma luta de chefe.
    const events = Array.from({ length: 32 }, (_, index) => ({
      at: 320 + index * 1070,
      type: 1,
      level: index > 20 && index % 4 === 0 ? 2 : 1,
      index,
    }));
    events.push(
      { at: 6300, type: 1, pattern: 'spread', count: 3 },
      { at: 8000, type: 2, group: true },
      { at: 11400, type: 3 },
      { at: 16000, type: 1, pattern: 'spread', count: 4 },
      { at: 19000, type: 2, group: true, level: 2 },
      { at: 20400, type: 3 },
      { at: 23900, type: 1, level: 2, pattern: 'spread', count: 5 },
      { at: 26500, type: 4 },
      { at: 29000, type: 2, level: 2, pattern: 'orbit', count: 10 },
      { at: 31800, type: 3, level: 2 },
      { at: 32800, type: 1, level: 2, pattern: 'spread', count: 5 },
      { at: 36600, type: 4 },
      { at: 39900, type: 1, level: 2, pattern: 'line', count: 10 },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'lab') {
    return [
      { at: 800, type: 2, group: true },
      { at: 3900, type: 1 },
      { at: 5500, type: 3 },
      { at: 11000, type: 3, level: 2 },
      { at: 15100, type: 4, level: 2 },
      { at: 21200, type: 5 },
      // Comparação direta entre o trio básico e os dez em círculo.
      { at: 28000, type: 2, level: 2, pattern: 'orbit', count: 10 },
    ];
  }
  throw new Error(`Modo desconhecido: ${mode}`);
}


export function scheduledEnemyCount(events) {
  // Uma entrada da agenda pode representar vários OVNIs simultâneos.
  return events.reduce((total, event) => {
    if (event.pattern === 'spread' || event.pattern === 'line' ||
        event.pattern === 'orbit') return total + event.count;
    if (event.group && event.type === 2) return total + 3;
    return total + 1;
  }, 0);
}

export function waveIsFinished({ mode, elapsed, spawned, scheduled, enemies, hostileShots }) {
  if (mode === 'upgradeLab') return false;
  return elapsed >= MODES[mode].minDuration
    && spawned === scheduled
    && enemies === 0
    && hostileShots === 0;
}
