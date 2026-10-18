// Mecânicas puras dos especiais híbridos — sem dependências do Phaser.
// 'jp' é o ID técnico legado da Coreia do Sul neste projeto.
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
    // Rússia: matryoshka causa estilhaçamento e corrente em alvos gelados.
    ruShards:at(ru,[8,12,16,24]),
    ruBurstRadius:at(ru,[35,50,70,100]),
    ruFreezeMs:at(ru,[1600,2100,2700,3400]),
    ruShieldFreezeMs:at(ru,[2000,3000,4000,5000]),
    ruShieldRadius:at(ru,[40,60,90,120]),
    ruDamage:at(ru,[3,4,5,7]),
    // China: um único projétil/híbrido, com impactos internos em distribuição.
    cnDropScale:at(cn,[1,1.6,2.5,4]),
    cnDropRadius:at(cn,[40,55,75,105]),
    cnPayloads:at(cn,[1,2,3,4]),
    cnDamage:at(cn,[3,4,5,7]),
    // Coreia: cada tiro recebido pelo globo de 4 s gera esta quantidade de raios.
    krReflections:at(jp,[3,6,12,24]),
    krReflectDamage:at(jp,[1.8,2.6,3.5,4.5]),
    krShieldChance:at(jp,[0.22,0.3,0.4,0.5]),
  };
}

export function specialPalette(id) {
  return {br:0xffc652,us:0xffad69,ru:0x8ae7ff,cn:0xffd665,jp:0xe68aff}[id] || 0x7be8ff;
}
