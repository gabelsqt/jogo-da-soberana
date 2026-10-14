// Onda 0 -> primeira escolha de upgrade -> Onda 1.
// Laboratório é um modo independente para testar tipos 2–5 sem fingir que
// as ondas e upgrades restantes já foram desenvolvidos.
const wave0Times = [600, 2400, 4400, 6300, 9500, 12200, 15300, 18600, 22000, 25000];

export const WAVE_COUNTDOWN_SECONDS = 3;

// Antes da onda há 3, 2, 1. O relógio de inimigos só começa no fim.
export function countdownNumberAt(elapsedMs) {
  if (elapsedMs < 0 || elapsedMs >= WAVE_COUNTDOWN_SECONDS * 1000) return null;
  return WAVE_COUNTDOWN_SECONDS - Math.floor(elapsedMs / 1000);
}


export const MODES = {
  wave0: { title: 'ONDA 0', minDuration: 30000 },
  wave1: { title: 'ONDA 1', minDuration: 39500 },
  lab: { title: 'TESTE DE INIMIGOS', minDuration: 36000 },
  upgradeLab: { title: 'LAB DE UPGRADES', minDuration: Infinity },
};

export function getWaveEvents(mode) {
  // Laboratório livre: inimigos aparecem por timer próprio e nunca acaba a onda.
  if (mode === 'upgradeLab') return [];
  if (mode === 'wave0') {
    return wave0Times.map((at, index) => ({ at, type: 1, index }));
  }
  if (mode === 'wave1') {
    // A primeira onda real pressiona continuamente em vez de enviar
    // um alvo fácil a cada vários segundos. Escala de intensidade gradual:
    // básicos -> duas formações -> círculo avançado -> frente final.
    const events = Array.from({ length: 18 }, (_, index) => ({
      at: 950 + index * 1510,
      type: 1,
      level: index >= 12 && index % 3 === 0 ? 2 : 1,
      index,
    }));
    events.push({ at: 8400, type: 2, group: true });
    events.push({ at: 17200, type: 2, group: true, level: 2 });
    events.push({ at: 24500, type: 2, level: 2, pattern: 'orbit', count: 10 });
    events.push({ at: 34000, type: 1, level: 2, pattern: 'line', count: 10 });
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

export function waveIsFinished({ mode, elapsed, spawned, scheduled, enemies, hostileShots }) {
  if (mode === 'upgradeLab') return false;
  return elapsed >= MODES[mode].minDuration
    && spawned === scheduled
    && enemies === 0
    && hostileShots === 0;
}
