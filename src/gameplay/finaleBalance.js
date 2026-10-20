// Balanceamento provisório dos chefes finais. Não altera HP de outras ondas.
// O desafio acompanha a força estimada da build QUE CHEGOU à batalha.
// Durante a resistência da onda 11, a vida do chefe fica fixada no arsenal
// sobrevivente original — os upgrades brasileiros extras devem ajudar de fato.
import { coalitionHpFactor } from './wave11Rules.js';
import { BASE_CANNON_INTERVAL_MS } from './upgrades.js';
import { ICE_BREATH_TICK_MS, iceBreathTickDamage } from './iceBreath.js';

export function estimatedBossDps(stats = {}) {
  // Inverno Eterno troca os projéteis físicos por sopro a cada 110ms.
  // O HP do chefe não deve aumentar quando a cadência-base do CANHÃO
  // acelera: esse intervalo não controla a frequência do sopro russo.
  if(stats.transformed==='ru'){
    const sustained=iceBreathTickDamage(stats.basicDamage,true)*1000/
      ICE_BREATH_TICK_MS;
    // Tempo útil entre barreira, troca de módulo e exposição do núcleo.
    return Math.min(180,Math.max(7,sustained*0.43));
  }
  const interval=Math.max(32,Number(stats.basicInterval)||BASE_CANNON_INTERVAL_MS);
  const damage=Math.max(0.5,Number(stats.basicDamage)||1);
  const shots=Math.max(1,Math.min(10,Number(stats.bulletsPerShot)||1));
  const bullets=damage*1000/interval*(1+(shots-1)*0.65);
  const plasma=stats.plasmaEvery>0
    ? Math.max(0,Number(stats.laserDamage)||0)*1000/interval/
      stats.plasmaEvery*0.6 : 0;
  const brazilHeat=stats.heat?1.30:1;
  return Math.min(180,Math.max(7,(bullets+plasma)*brazilHeat));
}

export function finaleBossHp(mode, stats = {}, coalitionSize = 1) {
  const dps=estimatedBossDps(stats);
  const base=mode==='wave10'
    ? Math.max(180,Math.min(3000,Math.round(dps*20)))
    : Math.max(220,Math.min(3400,Math.round(dps*24)));
  if(mode!=='wave11')return base;
  const factor=coalitionHpFactor(coalitionSize)??1;
  return Math.max(65,Math.round(base*factor));
}

// As fases posteriores exigem reagir a barragens, não apenas reduzir HP.
// Em coalizões grandes, cada chefe recebe menos tiros para manter legibilidade.
export function finaleBossFirePattern(mode, coalitionSize=1, phase=1) {
  const safePhase=Math.max(1,Math.min(3,Math.trunc(phase)||1));
  const coalition=mode==='wave11' && coalitionSize>1;
  const volleyCount=coalition
    ? (safePhase===3?2:1)
    : [2,3,4][safePhase-1];
  const damage=mode==='wave10'
    ? [11,12,13][safePhase-1]
    : coalition ? [8,8,9][safePhase-1]
      : [10,11,12][safePhase-1];
  const speedMultiplier=[1,1.20,1.40][safePhase-1];
  const intervalMultiplier=[0.92,0.76,0.62][safePhase-1];
  return {volleyCount,damage,speedMultiplier,intervalMultiplier};
}

// Contra-ataques ao romper a blindagem: pequenos e espaçados. A coalizão
// tem uma quantidade compartilhada de eventos, evitando superlotação.
export function finaleCounterattack(mode, phase, coalitionSize=1) {
  const safePhase=Math.max(2,Math.min(3,Math.trunc(phase)||2));
  const coalition=mode==='wave11' && coalitionSize>1;
  return {
    fighters:coalition?1:2,
    bombers:safePhase===3 && !coalition?1:0,
    // Máximo de dois acionamentos na Fortaleza e três em toda a coalizão.
    maxTriggers:mode==='wave10'?2:coalition?3:2,
    warning:safePhase===2
      ? 'BLINDAGEM ROMPIDA — CONTRA-ATAQUE!'
      : 'FÚRIA FINAL — ESCOLTAS CHEGANDO!',
  };
}
