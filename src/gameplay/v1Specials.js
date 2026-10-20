// Mecânicas puras dos especiais híbridos — sem dependências do Phaser.
// 'jp' é o ID técnico legado da Coreia do Sul neste projeto.
import {countryColor} from '../config/countryIdentity.js';
export const SPECIAL_COUNTRIES = Object.freeze(['br','us','ru','cn','jp']);

export function specialStage(level) {
  return Math.max(0, Math.min(4, Math.floor(Math.min(8,level)/2)));
}

export function v1SpecialLoadout(state = {}) {
  const choices = Array.isArray(state.choices) ? state.choices.slice(0,10) : [];
  const levels = Object.fromEntries(SPECIAL_COUNTRIES.map(id=>[id,0]));
  let primary = null;
  for(const id of choices) {
    if(!(id in levels)) continue;
    levels[id]++;
    if(!primary && levels[id]===2) primary=id;
  }
  if(Array.isArray(state.resistanceLevels))for(const level of state.resistanceLevels)
    if(Number.isInteger(level)&&level>=1&&level<=10)
      levels.br=Math.max(levels.br,level);
  if(!primary && levels.br>=2)primary='br';
  const stages = Object.fromEntries(SPECIAL_COUNTRIES.map(id=>[id,specialStage(levels[id])]));
  return {primary,levels,stages,active:SPECIAL_COUNTRIES.filter(id=>stages[id]>0)};
}

const at = (stage,values,none=0) => stage>0 ? values[stage-1] : none;

export function v1SpecialConfig(state = {}) {
  const loadout=v1SpecialLoadout(state);
  const {stages}=loadout;
  const br=stages.br,us=stages.us,ru=stages.ru,cn=stages.cn,jp=stages.jp;
  // O dano por salva NÃO é multiplicado pelo número de raios.
  const krReflections=at(jp,[3,6,12,24]);
  const krSalvoDamage=at(jp,[3,5,7.5,10]);
  return {
    ...loadout,
    // Brasil preserva as contagens e o turbo aprovados.
    fireworks:at(br,[4,8,16,32]),
    brazilTurbo:at(br,[1.5,2,2.5,3],1),
    // EUA: um míssil base enorme, escalado progressivamente.
    usMissileScale:at(us,[1,2,4,8]),
    usBlastRadius:at(us,[55,75,95,120]),
    usShockRadius:at(us,[90,125,160,210]),
    usPush:at(us,[110,160,220,290]),
    usDamage:at(us,[4,6,8,11]),
    // Rússia: satélite Sputnik persistente, só prepara alvos para o canhão.
    ruSputnikDurationMs:at(ru,[4000,5000,5000,5000]),
    ruSputnikRadius:at(ru,[43,59,59,67]),
    ruFreezeMs:at(ru,[1800,2100,2400,2800]),
    ruCrystalBonus:at(ru,[1.30,1.30,1.35,1.40],1),
    ruCrystalShatterRadius:at(ru,[1.25,1.35,1.55,1.60],1),
    ruCrystalShatterDamage:at(ru,[1,1,1.25,1.35],1),
    ruSputnikPulseRadius:at(ru,[0,0,0,112]),
    ruSputnikPulseMs:at(ru,[0,0,0,1050]),
    ruSputnikFinalRadius:at(ru,[0,0,0,152]),
    // China: um único projétil/híbrido, com impactos internos em distribuição.
    cnDropScale:at(cn,[1,1.6,2.5,4]),
    cnDropRadius:at(cn,[40,55,75,105]),
    cnPayloads:at(cn,[1,2,3,4]),
    cnDamage:at(cn,[3,4,5,7]),
    // Coreia: um orçamento total limitado dividido entre 3/6/12/24 raios.
    krReflections,
    krSalvoDamage,
    krReflectDamage:krReflections ? krSalvoDamage/krReflections : 0,
  };
}

export function specialPalette(id) {
  return countryColor(id);
}
