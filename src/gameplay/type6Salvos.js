// Disparos do bombardeiro e sequência do hangar Tipo 6.
export const TYPE6_BOMB_OFFSETS=Object.freeze([-68,0,68]);
export const TYPE6_HANGAR_COUNT=8;
export const TYPE6_HANGAR_START_SECONDS=2;
export const TYPE6_HANGAR_INTERVAL_SECONDS=0.22;
export function type6HangarDue(elapsed){
  if(elapsed+1e-8<TYPE6_HANGAR_START_SECONDS)return 0;
  return Math.min(TYPE6_HANGAR_COUNT,
    1+Math.floor((elapsed-TYPE6_HANGAR_START_SECONDS+1e-8)/
      TYPE6_HANGAR_INTERVAL_SECONDS));
}
