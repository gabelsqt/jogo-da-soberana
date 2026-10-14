import { FIRST_UPGRADES } from './upgrades.js';
import { SECOND_UPGRADES, secondUpgradeCountries } from './secondUpgrades.js';

export const COUNTRIES = FIRST_UPGRADES.map(({ id }) => id);
export const MAX_SUPPORT_TOWERS = 2;
export { SECOND_UPGRADES };

// A primeira torre é o TERCEIRO upgrade do mesmo país. A segunda só será
// desbloqueada no nível 7; seus perfis seguem no GDD, ainda não implementados.
export const THIRD_UPGRADES = {
  br: { title: 'Projeto Caramelo', description: 'Instala um vira-lata mecanizado que atira automaticamente nos invasores.', tower: true },
  us: { title: 'Águia da Liberdade I', description: 'Instala águia mecanizada que dispara mísseis teleguiados.', tower: true },
  jp: { title: 'Projeto Tsuru I', description: 'Instala grou japonês mecanizado com laser automático de precisão.', tower: true },
  ru: { title: 'Urso de Ferro', description: 'Instala urso com artilharia preditiva: explosão de choque e empurrão em área.', tower: true },
  cn: { title: 'PandaPrime I — Envio Econômico', description: 'Instala panda mecanizado que envia minidrones perseguidores.', tower: true },
};

export function normalizeCampaignState(state = {}) {
  const choices = Array.isArray(state?.choices)
    ? state.choices.filter((id) => COUNTRIES.includes(id)).slice(0, 10)
    : [];
  return { choices };
}

export function countryLevel(state, countryId) {
  return normalizeCampaignState(state).choices.filter((choice) => choice === countryId).length;
}

export function unlockedFirstUpgrades(state) {
  return [...new Set(normalizeCampaignState(state).choices)];
}

export function unlockedSecondUpgrades(state) {
  return secondUpgradeCountries(normalizeCampaignState(state));
}

export function activeTowerCountries(state) {
  const seen = new Map();
  const towers = [];
  for (const id of normalizeCampaignState(state).choices) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
    if (seen.get(id) === 3) towers.push(id);
  }
  return towers.slice(0, MAX_SUPPORT_TOWERS);
}

export function nextUpgradeOptions(state) {
  const normalized = normalizeCampaignState(state);
  const installed = activeTowerCountries(normalized).length;
  return FIRST_UPGRADES.map((first) => {
    const level = countryLevel(normalized, first.id) + 1;
    if (level === 1) return { ...first, level, locked: false, tower: false };
    if (level === 2) {
      return { ...first, ...SECOND_UPGRADES[first.id], level, locked: false };
    }
    if (level === 3) {
      return {
        ...first, ...THIRD_UPGRADES[first.id], level,
        locked: installed >= MAX_SUPPORT_TOWERS,
        reason: installed >= MAX_SUPPORT_TOWERS ? 'DUAS TORRES JÁ INSTALADAS' : '',
      };
    }
    return {
      ...first, level, title: 'EM DESENVOLVIMENTO',
      description: 'Este nível será adicionado nas próximas versões.',
      locked: true, reason: 'UPGRADE AINDA NÃO IMPLEMENTADO', tower: false,
    };
  });
}

export function chooseCampaignUpgrade(state, countryId) {
  const normalized = normalizeCampaignState(state);
  if (normalized.choices.length >= 10) return null;
  const option = nextUpgradeOptions(normalized).find(({ id }) => id === countryId);
  if (!option || option.locked) return null;
  return { choices: [...normalized.choices, countryId] };
}

export function nextWaveAfterChoice(state) {
  const count = normalizeCampaignState(state).choices.length;
  return count === 1 ? 'wave1' : count === 2 ? 'wave2' : null;
}
