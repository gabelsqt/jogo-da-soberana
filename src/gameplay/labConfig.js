// Configuração livre do laboratório. Nenhum limite de escolhas da campanha.
export const LAB_COUNTRIES = ['br', 'us', 'jp', 'ru', 'cn'];
export const LAB_MAX_LEVEL = 8;
export const LAB_MAX_TOWERS = 2;
export const LAB_MAX_WAVE = 9;

export function normalizeLabConfig(input = {}) {
  const wave = Math.max(0, Math.min(LAB_MAX_WAVE, Math.trunc(Number(input.wave) || 0)));
  const levels = Object.fromEntries(LAB_COUNTRIES.map(id => [
    id, Math.max(0, Math.min(LAB_MAX_LEVEL, Math.trunc(Number(input.levels?.[id]) || 0))),
  ]));
  return { wave, levels };
}

export function configuredTowerLoadout(config) {
  const { levels } = normalizeLabConfig(config);
  const entries = [];
  for (const id of LAB_COUNTRIES) {
    if (levels[id] >= 5) entries.push({ id, role: 'swarm', level: levels[id] });
    if (levels[id] >= 7) entries.push({ id, role: 'destroyer', level: levels[id] });
  }
  return entries.slice(0, LAB_MAX_TOWERS);
}

export function configuredTowerCountries(config) {
  const { levels } = normalizeLabConfig(config);
  return LAB_COUNTRIES.filter(id => levels[id] >= 5);
}

export function changeLabLevel(config, country, delta) {
  const current = normalizeLabConfig(config);
  if (!LAB_COUNTRIES.includes(country)) return current;
  const next = Math.max(0, Math.min(LAB_MAX_LEVEL, current.levels[country] + delta));
  const levels = { ...current.levels, [country]: next };
  if (LAB_COUNTRIES.reduce((n, id) => n + Number(levels[id] >= 5) + Number(levels[id] >= 7), 0) > LAB_MAX_TOWERS) return current;
  return { wave: current.wave, levels };
}

export function changeLabWave(config, delta) {
  const current = normalizeLabConfig(config);
  return { ...current, wave: Math.max(0, Math.min(LAB_MAX_WAVE, current.wave + delta)) };
}
