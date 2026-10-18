// Balanceamento provisório dos chefes finais. Não altera HP de outras ondas.
// O desafio acompanha a força estimada da build QUE CHEGOU à batalha.
// Durante a resistência da onda 11, a vida do chefe fica fixada no arsenal
// sobrevivente original — os upgrades brasileiros extras devem ajudar de fato.
import { coalitionHpFactor } from './wave11Rules.js';

export function estimatedBossDps(stats = {}) {
  const interval=Math.max(32,Number(stats.basicInterval)||400);
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

export function finaleBossFirePattern(mode, coalitionSize=1, phase=1) {
  const safePhase=Math.max(1,Math.min(3,Math.trunc(phase)||1));
  const volleyCount=mode==='wave10'?2:coalitionSize>1?1:2;
  const damage=mode==='wave10'?11:coalitionSize>1?8:10;
  const speedMultiplier=1+(safePhase-1)*0.25;
  return {volleyCount,damage,speedMultiplier};
}
