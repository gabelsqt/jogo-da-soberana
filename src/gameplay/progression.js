import { FOURTH_UPGRADES } from './fourthUpgrades.js';
import { FIRST_UPGRADES } from './upgrades.js';
import { SECOND_UPGRADES, secondUpgradeCountries } from './secondUpgrades.js';

export const COUNTRIES = FIRST_UPGRADES.map(({ id }) => id);
export const MAX_SUPPORT_TOWERS = 2;
export { SECOND_UPGRADES };

// Níveis 3 e 4 evoluem em conjunto o ataque especial e o escudo.
// A primeira torre antienxame só é instalada no nível 5.
export const THIRD_UPGRADES = {
  br: { title: 'Gambiarra de Defesa Integrada', description: 'Especial e escudo ganham a primeira evolução elétrica.', tower: false },
  us: { title: 'Protocolo de Contenção I', description: 'Especial e escudo evoluem com tecnologia de fragmentação.', tower: false },
  jp: { title: 'Palco de Luz I', description: 'Especial e escudo ganham uma evolução de energia luminosa.', tower: false },
  ru: { title: 'Doutrina de Repulsão I', description: 'Especial e escudo evoluem com energia cinética.', tower: false },
  cn: { title: 'Pacote Integrado I', description: 'Especial e escudo compartilham tecnologia de minidrones.', tower: false },
};
export const FIFTH_UPGRADES = {
  br: { title: 'Projeto Caramelo', description: 'Instala o vira-lata mecanizado antienxame.', tower: true },
  us: { title: 'Águia da Liberdade I', description: 'Instala a águia mecanizada antienxame.', tower: true },
  jp: { title: 'Projeto Kkachi I', description: 'Instala a pega coreana mecanizada antienxame.', tower: true },
  ru: { title: 'Urso de Ferro', description: 'Instala o urso mecanizado antienxame.', tower: true },
  cn: { title: 'PandaPrime I', description: 'Instala o panda mecanizado antienxame.', tower: true },
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

export function unlockedThirdUpgradeCountries(state) {
  return COUNTRIES.filter((id) => countryLevel(state, id) >= 3);
}

export function activeTowerCountries(state) {
  const seen = new Map();
  const towers = [];
  for (const id of normalizeCampaignState(state).choices) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
    if (seen.get(id) === 5) towers.push(id);
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
    if (level === 3) return { ...first, ...THIRD_UPGRADES[first.id], level, locked: false };
    if (level === 4) return { ...first, ...FOURTH_UPGRADES[first.id], level, locked: false };
    if (level === 5) return {
      ...first, ...FIFTH_UPGRADES[first.id], level,
      locked: installed >= MAX_SUPPORT_TOWERS,
      reason: installed >= MAX_SUPPORT_TOWERS ? 'DUAS TORRES JÁ INSTALADAS' : '',
    };
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
  return count >= 1 && count <= 9 ? `wave${count}` : null;
}

// Upgrades 4–9 ainda estão em planejamento. Enquanto isso, as Ondas 4–9
// seguem sem interromper a campanha e preservam as 3 escolhas já adquiridas.
// A Onda 9 encerra o protótipo até a chegada do Tipo 6 na Onda 10.
export function automaticWaveAfterVictory(mode) {
  const match = /^wave([3-8])$/.exec(mode);
  return match ? `wave${Number(match[1]) + 1}` : null;
}
