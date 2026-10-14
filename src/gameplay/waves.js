// Onda 0 -> primeira escolha de upgrade -> Onda 1.
// Laboratório é um modo independente para testar tipos 2–5 sem fingir que
// as ondas e upgrades restantes já foram desenvolvidos.
const wave0Times = [600, 2400, 4400, 6300, 9500, 12200, 15300, 18600, 22000, 25000];

export const MODES = {
  wave0: { title: 'ONDA 0', minDuration: 30000 },
  wave1: { title: 'ONDA 1', minDuration: 34000 },
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
    const events = Array.from({ length: 12 }, (_, index) => ({
      at: 850 + index * 2300, type: 1, index,
    }));
    // Prévia do Tipo 2: um esquadrão de cada vez entra em formação e mergulha.
    events.push({ at: 9000, type: 2, group: true });
    events.push({ at: 23500, type: 2, group: true });
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'lab') {
    return [
      { at: 800, type: 2, group: true },
      { at: 3900, type: 1 },
      { at: 5500, type: 3 },
      { at: 11000, type: 3 },
      { at: 15100, type: 4 },
      { at: 21200, type: 5 },
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
