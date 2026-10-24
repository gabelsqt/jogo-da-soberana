// Direção canônica do prólogo — decisões do GDD de 23/10/2026.
// Os 15 segundos não consomem nenhuma das dez escolhas de upgrade.
export const PROLOGUE_SURVIVAL_MS=15000;
export const PROLOGUE_SWARM_COUNT=60;
export const PROLOGUE_CANNON={
  strong:{damage:12,intervalMs:65,enemyCanAttack:false},
  damaged:{damage:.18,intervalMs:9000,enemyCanAttack:false},
};
export const REPAIR_STAGES=Object.freeze({
  arrival:['O GENERAL CHAMA SEU ANTIGO MECÂNICO',
    'ZÉ MARIA CHEGA DE CAMINHÃO-GUINCHO',
    'DIAGNÓSTICO: OUVIDO E BATIDINHAS NO MECANISMO'],
  principal:['MONTAGEM: INSTALAÇÃO DO TIRO PRINCIPAL',
    'TESTE DO DISPARO: CANHÃO RECUPERADO'],
  special:['SEGUNDO CONSERTO: INSTALAÇÃO DO TIRO ESPECIAL',
    'TESTE DO ESPECIAL: BOTÃO DIREITO LIBERADO'],
});
export function isPrologueSurvival(mode){return mode==='wave05';}
export function prologueCompletion(choices=[]){
  return choices.length===0?'arrival':choices.length===1?'principal':'special';
}

// Duas formações de 5 colunas × 6 fileiras; espaço central livre.
export function prologueSwarmSlot(index){
  const side=index%2, slot=Math.floor(index/2);
  return {x:(side?590:90)+(slot%5)*65,y:100+Math.floor(slot/5)*43,
    entryX:side?1020:-60,delayMs:slot*120};
}
