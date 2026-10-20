// Regras puras da Onda 11: não altera o fluxo jogável antes da Onda 10.
// 'jp' continua sendo a chave legada de gameplay da Coreia do Sul.
const FOREIGN_COUNTRIES = ['us', 'jp', 'ru', 'cn'];
const ALL_COUNTRIES = ['br', ...FOREIGN_COUNTRIES];

function validatedChoices(choices = []) {
  return Array.isArray(choices)
    ? choices.filter((country) => ALL_COUNTRIES.includes(country)).slice(0, 10)
    : [];
}

// Um único aliado estrangeiro participante trai. Sorteio feito ao entrar
// na Onda 11; o resultado é passado para recomeços e finais.
export function pickBetrayer(choices = [], random = Math.random) {
  const candidates=[...new Set(validatedChoices(choices).filter(id=>FOREIGN_COUNTRIES.includes(id)))];
  if(!candidates.length)return null;
  const roll=Math.min(0.999999,Math.max(0,Number(random())||0));
  return candidates[Math.floor(roll*candidates.length)];
}
export function betrayalCoalition(choices = [], selectedCountry = null) {
  const candidates=[...new Set(validatedChoices(choices).filter(id=>FOREIGN_COUNTRIES.includes(id)))];
  if(!candidates.length)return [];
  const country=candidates.includes(selectedCountry)?selectedCountry:candidates[0];
  return [country];
}

export function hostileBosses(choices = [], selectedCountry = null) {
  const history = validatedChoices(choices);
  return betrayalCoalition(history,selectedCountry).map((country) => ({
    country,
    level: history.filter((selected) => selected === country).length,
  }));
}

// Escalonamento proposto: reduz HP individual numa coalizão maior.
// Nível individual controla as habilidades do chefe; HP-base é configurado
// separadamente quando o encontro for implementado.
export const COALITION_HP_FACTOR = Object.freeze({ 1: 1, 2: 0.65, 3: 0.45, 4: 0.35 });

export function coalitionHpFactor(size) {
  return COALITION_HP_FACTOR[size] ?? null;
}

export function survivingCountryLevels(choices = [], selectedCountry = null) {
  const history = validatedChoices(choices);
  const traitors = new Set(betrayalCoalition(history,selectedCountry));
  return Object.fromEntries(ALL_COUNTRIES.map((country) => [
    country, traitors.has(country) ? 0 : history.filter((entry) => entry === country).length,
  ]));
}

export function installedSupportTowers(choices = [], brazilResistanceLevels = [], selectedCountry = null) {
  const levels = survivingCountryLevels(choices,selectedCountry);
  const extra = new Set(brazilResistanceLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 10));
  const installed = [];
  for (const country of ALL_COUNTRIES) {
    if (country === 'br') {
      if (levels.br >= 3 || extra.has(3)) installed.push({ country, level: 3 });
      if (levels.br >= 7 || extra.has(7)) installed.push({ country, level: 7 });
    } else {
      if (levels[country] >= 3) installed.push({ country, level: 3 });
      if (levels[country] >= 7) installed.push({ country, level: 7 });
    }
  }
  return installed;
}

// A antiga progressão brasileira após derrota foi removida na v0.69.
// A recuperação única de Zeca agora vive em zecaRecovery.js.
