// Configuração livre do laboratório V1: cada nação pode ter níveis 0–10
// independentemente do limite de dez escolhas da campanha normal.
export const V1_LAB_COUNTRIES = Object.freeze(['br','us','ru','cn','jp']);
export const V1_LAB_MAX_LEVEL = 10;

export function normalizeV1LabLevels(input = {}) {
  return Object.fromEntries(V1_LAB_COUNTRIES.map(id => {
    const level = Number(input?.[id]);
    return [id, Number.isFinite(level)
      ? Math.max(0, Math.min(V1_LAB_MAX_LEVEL, Math.trunc(level))) : 0];
  }));
}

export function changeV1LabLevel(input, country, delta) {
  const levels = normalizeV1LabLevels(input);
  if (!V1_LAB_COUNTRIES.includes(country)) return levels;
  levels[country] = Math.max(0,Math.min(V1_LAB_MAX_LEVEL,
    levels[country] + Math.trunc(Number(delta) || 0)));
  return levels;
}

export function v1LabBuild(levelsInput, preferred = 'br') {
  const labLevels = normalizeV1LabLevels(levelsInput);
  const activeSpecials = V1_LAB_COUNTRIES.filter(id => labLevels[id] >= 2);
  const labPrimary = activeSpecials.includes(preferred)
    ? preferred : activeSpecials[0] ?? null;
  // O marcador de laboratório impede o truncamento para dez escolhas,
  // sem abrir essa exceção para partidas normais.
  return { choices: [], labLevels, labPrimary };
}
