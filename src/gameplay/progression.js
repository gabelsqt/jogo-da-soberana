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
  br: { title: 'Bateria Antienxame I', description: 'Instala um sistema automático de rajadas contra enxames.', tower: true },
  us: { title: 'Defesa de Fragmentação I', description: 'Instala mísseis automáticos de fragmentação contra enxames.', tower: true },
  jp: { title: 'Sistema Encore I', description: 'Instala feixes automáticos de energia contra enxames.', tower: true },
  ru: { title: 'Rajada Siberiana I', description: 'Instala rajadas automáticas e coordenadas contra enxames.', tower: true },
  cn: { title: 'Enxame Expresso I', description: 'Instala minidrones ofensivos contra enxames.', tower: true },
};


// Evoluções dos animais. Parâmetros de combate provisórios para playtest.
export const SIXTH_UPGRADES = {
  br: { title: 'Bateria Antienxame II — Ritmo Acelerado', description: 'Rajadas mais rápidas e novos alvos contra enxames.', tower: false },
  us: { title: 'Fragmentação Dupla II', description: 'Aumenta o alcance e o dano dos mísseis de fragmentação.', tower: false },
  jp: { title: 'Encore Duplo II', description: 'Dois feixes atravessam formações inimigas.', tower: false },
  ru: { title: 'Rajada Siberiana II — Disparo Coordenado', description: 'Amplia as rajadas contra múltiplos alvos.', tower: false },
  cn: { title: 'Enxame Expresso II', description: 'Envia mais minidrones por ataque.', tower: false },
};
export const SEVENTH_UPGRADES = {
  br: { title: 'Artilharia Pesada I', description: 'Instala reforço de projétil pesado contra blindados.', tower: true },
  us: { title: 'Perfuração de Ferro I', description: 'Instala reforço de míssil perfurante contra blindados.', tower: true },
  jp: { title: 'Justiça Radiante I', description: 'Instala reforço de raio concentrado contra blindados.', tower: true },
  ru: { title: 'Impacto Siberiano I', description: 'Instala reforço de artilharia pesada contra blindados.', tower: true },
  cn: { title: 'Sobrecarga Imperial I', description: 'Instala reforço de energia carregada contra blindados.', tower: true },
};
export const EIGHTH_UPGRADES = {
  br: { title: 'Calibre Máximo II', description: 'Aumenta o dano do projétil pesado.', tower: false },
  us: { title: 'Penetração Máxima II', description: 'Aumenta o dano perfurante concentrado.', tower: false },
  jp: { title: 'Justiça Radiante II', description: 'Aumenta a potência do raio concentrado.', tower: false },
  ru: { title: 'Impacto Terminal II', description: 'Aumenta o impacto da artilharia pesada.', tower: false },
  cn: { title: 'Sobrecarga Imperial II', description: 'Aumenta o dano da energia carregada.', tower: false },
};
export function normalizeCampaignState(state = {}) {
  const choices = Array.isArray(state?.choices)
    ? state.choices.filter((id) => COUNTRIES.includes(id)).slice(0, 10)
    : [];
  // A identidade e as atribuições P/S pertencem apenas às campanhas
  // iniciadas no novo boteco. Saves legados continuam com {choices}.
  const supremeUsed=state?.supremeUsed===true;
  if(!state?.armament||typeof state.armament!=='object')return {choices,supremeUsed};
  const principal=COUNTRIES.includes(state.armament.principal)
    ?state.armament.principal:null;
  const especial=principal&&COUNTRIES.includes(state.armament.especial)
    ?state.armament.especial:null;
  const upgrades=[];
  const counter=Object.fromEntries(COUNTRIES.map(id=>[id,{P:0,S:0}]));
  const slots={P:0,S:0};
  for(const item of Array.isArray(state.armament.upgrades)?state.armament.upgrades:[]){
    if(!especial||upgrades.length>=8)break;
    if(!COUNTRIES.includes(item?.country)||!['P','S'].includes(item?.track))continue;
    if(slots[item.track]>=4||counter[item.country][item.track]>=4)continue;
    const stage=++counter[item.country][item.track];
    slots[item.track]++;
    upgrades.push({country:item.country,track:item.track,stage});
  }
  // Os registros das dez escolhas determinam os níveis nacionais e a
  // condição do Supremo. Não aceitar níveis inventados no JSON da partida.
  const canonical=[...(principal?[principal]:[]),...(especial?[especial]:[]),
    ...upgrades.map(item=>item.country)].slice(0,10);
  return {choices:canonical,supremeUsed,armament:{principal,especial,upgrades}};
}

export function armamentPhase(state={}){
  const current=normalizeCampaignState(state);
  if(!current.armament?.principal)return 'principal';
  if(!current.armament.especial)return 'special';
  return 'upgrades';
}
export function armamentAllocation(state={}){
  const allocation=Object.fromEntries(COUNTRIES.map(id=>[id,{P:0,S:0}]));
  for(const item of normalizeCampaignState(state).armament?.upgrades??[])
    allocation[item.country][item.track]++;
  return allocation;
}
export function armamentOffers(state={},catalog=[]){
  const current=normalizeCampaignState(state),phase=armamentPhase(current);
  const allocation=armamentAllocation(current);
  const used={P:0,S:0};
  for(const {P,S} of Object.values(allocation)){used.P+=P;used.S+=S;}
  return catalog.map(country=>{
    if(phase!=='upgrades')return {...country,locked:false,level:
      (current.choices.filter(id=>id===country.id).length+1)};
    const proposals={};
    for(const track of ['P','S']){
      const stage=allocation[country.id][track]+1;
      const locked=used[track]>=4||stage>4;
      proposals[track]={country:country.id,track,stage,locked,
        reason:locked?'QUATRO MELHORIAS JÁ INSTALADAS NESTA ARMA':''};
    }
    return {...country,level:current.choices.filter(id=>id===country.id).length+1,
      locked:proposals.P.locked&&proposals.S.locked,proposals};
  });
}
export function chooseArmamentUpgrade(state={},country,track=null){
  if(!COUNTRIES.includes(country))return null;
  const current=normalizeCampaignState(state);
  if(current.choices.length>=10)return null;
  const phase=armamentPhase(current);
  if(phase==='principal')return {choices:[country],supremeUsed:current.supremeUsed,
    armament:{principal:country,especial:null,upgrades:[]}};
  if(phase==='special')return {choices:[current.armament.principal,country],supremeUsed:current.supremeUsed,
    armament:{...current.armament,especial:country,upgrades:[]}};
  if(track!=='P'&&track!=='S')return null;
  const allocation=armamentAllocation(current);
  const installed=Object.values(allocation).reduce(
    (total,row)=>total+row[track],0);
  if(installed>=4||allocation[country][track]>=4)return null;
  const upgrades=[...current.armament.upgrades,{
    country,track,stage:allocation[country][track]+1}];
  return normalizeCampaignState({choices:[...current.choices,country],supremeUsed:current.supremeUsed,
    armament:{...current.armament,upgrades}});
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

export function activeTowerLoadout(state) {
  const levels = Object.fromEntries(COUNTRIES.map(id => [id, countryLevel(state, id)]));
  const result = [];
  for (const id of COUNTRIES) {
    if (levels[id] >= 5) result.push({ id, role: 'swarm', level: levels[id] });
    if (levels[id] >= 7) result.push({ id, role: 'destroyer', level: levels[id] });
  }
  return result.slice(0, MAX_SUPPORT_TOWERS);
}

export function nextUpgradeOptions(state) {
  const normalized = normalizeCampaignState(state);
  const installed = activeTowerLoadout(normalized).length;
  return FIRST_UPGRADES.map((first) => {
    const level = countryLevel(normalized, first.id) + 1;
    if (level === 1) return { ...first, level, locked: false, tower: false };
    if (level === 2) {
      return { ...first, ...SECOND_UPGRADES[first.id], level, locked: false };
    }
    if (level === 3) return { ...first, ...THIRD_UPGRADES[first.id], level, locked: false };
    if (level === 4) return { ...first, ...FOURTH_UPGRADES[first.id], level, locked: false };
    if (level === 6) return { ...first, ...SIXTH_UPGRADES[first.id], level, locked: false };
    if (level === 8) return { ...first, ...EIGHTH_UPGRADES[first.id], level, locked: false };
    if (level === 7) return {
      ...first, ...SEVENTH_UPGRADES[first.id], level,
      locked: installed >= MAX_SUPPORT_TOWERS,
      reason: installed >= MAX_SUPPORT_TOWERS ? 'DOIS APOIOS JÁ INSTALADOS' : '',
    };
    if (level === 5) return {
      ...first, ...FIFTH_UPGRADES[first.id], level,
      locked: installed >= MAX_SUPPORT_TOWERS,
      reason: installed >= MAX_SUPPORT_TOWERS ? 'DOIS APOIOS JÁ INSTALADOS' : '',
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
