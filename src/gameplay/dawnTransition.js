// Quatro momentos do amanhecer. A animação usa exclusivamente o relógio da onda.
export const DAWN_KEYS=Object.freeze(['rio-dawn-1','rio-dawn-2','rio-dawn-3','rio-dawn-4']);
export const DAWN_FILES=Object.freeze([
  '01_pre_amanhecer.png','02_noite_azul.png','03_nascer_sol.png','04_dia_claro.png'
]);
export const DAWN_DURATION_MS=5000;
export function dawnLayerAlphas(remainingMs,duration=DAWN_DURATION_MS){
  if(!Number.isFinite(remainingMs)||!Number.isFinite(duration)||duration<=0)
    return [1,0,0,0];
  const progress=Math.max(0,Math.min(1,1-remainingMs/duration));
  return [1,...[0,1,2].map(i=>Math.max(0,Math.min(1,progress*3-i)))];
}
