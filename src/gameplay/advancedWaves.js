// Ondas avançadas: só padrões novos dos inimigos já existentes.
// A cor e o HP são determinados pelo nível (Onda 5 = nível IV, etc).
// Nenhuma destas ondas adiciona upgrades: o jogador mantém as 3 escolhas.
export const ADVANCED_WAVE_METADATA = {
  wave5: { title: 'ONDA 5 — CERCO AÉREO', minDuration: 30000 },
  wave6: { title: 'ONDA 6 — CHUVA DE FERRO', minDuration: 30000 },
  wave7: { title: 'ONDA 7 — ENXAME ORGANIZADO', minDuration: 30000 },
  wave8: { title: 'ONDA 8 — SUPERUNIDADES', minDuration: 30000 },
  wave9: { title: 'ONDA 9 — ÚLTIMO CERCO', minDuration: 30000 },
};

function basicStream(level, count, firstAt, spacing) {
  return Array.from({ length: count }, (_, index) => ({
    at: firstAt + index * spacing, type: 1, level, index,
  }));
}

function arranged(events) {
  return events.sort((a, b) => a.at - b.at);
}

export function getAdvancedWaveEvents(mode) {
  if (mode === 'wave5') {
    // Cerco Aéreo: grupos Tipo 2 ESCOLTAM bombardeiros.
    // Versão curta para testar a quarta escolha: 47 inimigos agendados.
    const level = 4;
    return arranged([
      ...basicStream(level, 16, 700, 2630),
      { at: 6800, type: 1, level, pattern: 'spread', count: 4 },
      { at: 11500, type: 3, level, pattern: 'escort', count: 3, center: 350,
        warning: 'ALERTA! BOMBARDEIRO COM ESCOLTA!' },
      { at: 16500, type: 1, level, pattern: 'spread', count: 4 },
      { at: 20000, type: 4, level, pattern: 'pincer' },
      { at: 22500, type: 2, level, pattern: 'orbit', count: 6 },
      { at: 29500, type: 3, level, pattern: 'escort', count: 3, center: 610 },
      { at: 34000, type: 4, level, side: 'left' },
      { at: 37000, type: 3, level },
      { at: 41500, type: 1, level, pattern: 'spread', count: 4 },
      { at: 44500, type: 2, level, group: true, count: 3, warning: 'ÚLTIMA ESCOLTA!' },
    ]);
  }
  if (mode === 'wave6') {
    // Chuva de Ferro: bombardeiros em leques e cruzamento de projéteis.
    // 45 básicos + 17 de formação + 9 bombardeiros + 6 caças = 77.
    const level = 5;
    return arranged([
      ...basicStream(level, 23, 550, 3250),
      { at: 7000, type: 2, level, group: true, count: 3 },
      { at: 9000, type: 3, level },
      { at: 12500, type: 1, level, pattern: 'spread', count: 4 },
      { at: 18000, type: 3, level, pattern: 'bomberFan', count: 3,
        warning: 'CHUVA DE FERRO! INTERCEPTE AS BOMBAS!' },
      { at: 28000, type: 4, level, side: 'left' },
      { at: 30500, type: 2, level, pattern: 'orbit', count: 8 },
      { at: 33500, type: 3, level },
      { at: 35000, type: 1, level, pattern: 'line', count: 5 },
      { at: 40500, type: 1, level, pattern: 'spread', count: 4 },
      { at: 44500, type: 2, level, group: true, count: 3 },
      { at: 47000, type: 4, level, pattern: 'pincer' },
      { at: 54000, type: 3, level, pattern: 'bomberFan', count: 3,
        warning: 'SEGUNDA SALVA DE BOMBARDEIROS!' },
      { at: 61000, type: 4, level, side: 'right' },
      { at: 67500, type: 3, level },
      { at: 68000, type: 1, level, pattern: 'spread', count: 4 },
      { at: 70000, type: 2, level, group: true, count: 3 },
      { at: 73500, type: 4, level, pattern: 'pincer' },
      { at: 75000, type: 1, level, pattern: 'line', count: 5 },
    ]);
  }
  if (mode === 'wave7') {
    // Enxame Organizado: ataque ritmado com 2 círculos e 2 fileiras.
    // 44 básicos + 28 de formação + 2 bombardeiros + 4 caças = 78.
    const level = 6;
    return arranged([
      ...basicStream(level, 18, 600, 4800),
      { at: 6500, type: 2, level, group: true, count: 4 },
      { at: 13000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 23000, type: 2, level, pattern: 'orbit', count: 10,
        warning: 'ENXAME ORGANIZADO: PRIMEIRO CÍRCULO!' },
      { at: 30000, type: 4, level, pattern: 'pincer' },
      { at: 37000, type: 1, level, pattern: 'line', count: 8 },
      { at: 43000, type: 3, level },
      { at: 53000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 59000, type: 2, level, group: true, count: 4 },
      { at: 66000, type: 4, level, pattern: 'pincer' },
      { at: 69000, type: 2, level, pattern: 'orbit', count: 10,
        warning: 'SEGUNDO ENXAME! PROTEJA OS ESCUDOS!' },
      { at: 77500, type: 1, level, pattern: 'line', count: 8 },
      { at: 83000, type: 3, level },
    ]);
  }
  if (mode === 'wave8') {
    // Superunidades: primeiro Tipo 5 na CAMPANHA, como miniboss.
    // 36 básicos + 16 de formação + 3 bombardeiros + 6 caças + 1 Tipo 5 = 62.
    // O Tipo 5 gera até 12 básicos extras com HP do mesmo nível,
    // limitados a no máximo 6 vivos simultaneamente.
    const level = 7;
    return arranged([
      ...basicStream(level, 14, 550, 5600),
      { at: 10000, type: 2, level, group: true, count: 4 },
      { at: 12000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 19000, type: 5, level,
        warning: 'ATENÇÃO! SUPERUNIDADE ALIENÍGENA!' },
      { at: 24000, type: 3, level },
      { at: 30500, type: 4, level, pattern: 'pincer' },
      { at: 37000, type: 1, level, pattern: 'line', count: 6 },
      { at: 46000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 51000, type: 4, level, side: 'right' },
      { at: 55000, type: 3, level },
      { at: 59000, type: 2, level, group: true, count: 4 },
      { at: 68000, type: 2, level, pattern: 'orbit', count: 8 },
      { at: 72000, type: 4, level, side: 'left' },
      { at: 76000, type: 3, level },
      { at: 81500, type: 4, level, pattern: 'pincer' },
      { at: 84000, type: 1, level, pattern: 'line', count: 6 },
    ]);
  }
  if (mode === 'wave9') {
    // Último Cerco: mistura final de formações, bombas e um Tipo 5.
    // 41 básicos + 24 de formação + 5 bombardeiros + 6 caças + 1 Tipo 5 = 77.
    const level = 8;
    return arranged([
      ...basicStream(level, 15, 650, 5800),
      { at: 12500, type: 2, level, group: true, count: 4 },
      { at: 18000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 24500, type: 3, level, pattern: 'bomberFan', count: 2,
        warning: 'CERCO FINAL: FOGO CRUZADO!' },
      { at: 29000, type: 2, level, pattern: 'orbit', count: 8 },
      { at: 36000, type: 4, level, pattern: 'pincer' },
      { at: 41000, type: 1, level, pattern: 'line', count: 8 },
      { at: 48000, type: 4, level, side: 'left' },
      { at: 52500, type: 2, level, group: true, count: 4 },
      { at: 55000, type: 5, level,
        warning: 'ÚLTIMO CRUZADOR INIMIGO!' },
      { at: 62000, type: 3, level, pattern: 'bomberFan', count: 2 },
      { at: 65000, type: 4, level, side: 'right' },
      { at: 72000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 73000, type: 2, level, pattern: 'orbit', count: 8 },
      { at: 80000, type: 4, level, pattern: 'pincer' },
      { at: 87500, type: 3, level },
      { at: 91500, type: 1, level, pattern: 'line', count: 8,
        warning: 'ÚLTIMA MURALHA! NÃO RECUEM!' },
    ]);
  }
  throw new Error(`Onda avançada desconhecida: ${mode}`);
}
