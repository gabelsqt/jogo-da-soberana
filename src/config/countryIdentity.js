// Cores institucionais (não substituem os tons físicos de fogo/gelo/metal).
// 'jp' é o ID técnico legado da Coreia do Sul.
export const COUNTRY_COLORS=Object.freeze({
  br:0x37c878,us:0x4897f5,ru:0xe8b84c,cn:0xe84d51,jp:0xa46cf0,
});
export const COUNTRY_GLOWS=Object.freeze({
  br:0x9bffcb,us:0xb0dbff,ru:0xffe6a1,cn:0xffb2a6,jp:0xe9bcff,
});
export function countryColor(id){return COUNTRY_COLORS[id]??0x8cd5e1;}
export function countryGlow(id){return COUNTRY_GLOWS[id]??0xd1f6ff;}
