// Interpretador experimental do perfil matemático. Não altera a campanha.
import {v1CombatStats} from './v1Upgrades.js';
import {v1SpecialConfig} from './v1Specials.js';
import {americanRocketConfig,americanWallConfig} from './americanArsenal.js';
import {labValue,labLevelCounts,singleCountryAtTen} from './labBalanceProfile.js';
const countries=['br','us','ru','cn','jp'];
export function computeLabMath({profile={},allocation={},principal='br',especial='br'}={}){
  const initial=Object.fromEntries(countries.map(id=>[id,0]));
  initial[principal]=1;
  initial[especial]=Math.max(initial[especial],2);
  const stats=v1CombatStats({labLevels:initial,labPrimary:especial});
  const build=v1SpecialConfig({labLevels:initial,labPrimary:especial});
  // Descarta a fusão automática antiga. Somente as duas identidades fornecem
  // a forma física das armas; propriedades são atribuídas por destino.
  stats.basicInterval=principal==='br'?150:principal==='ru'?252:300;
  stats.basicDamage=principal==='ru'?1.75:1;
  stats.basicSpeed=principal==='ru'?528:480;
  stats.heat=principal==='br';
  stats.brazilHeatPeak=principal==='br'?.65:0;
  stats.horizontalSpread=principal==='br'?6:0;
  stats.usRocketRadius=principal==='us'?9:0;
  stats.usRocketBlastRadius=principal==='us'?29:0;
  stats.usRocketBlastDamage=principal==='us'?1.4:0;
  stats.plasmaEvery=principal==='jp'?3:0;
  stats.laserDamage=3;
  stats.russianFreezeMs=principal==='ru'?1000:0;
  stats.russianShatterDamage=principal==='ru'?2:0;
  stats.russianShatterRadius=principal==='ru'?44:0;
  stats.knockback=principal==='ru'?.12:0;
  stats.bulletsPerShot=principal==='cn'?2:1;
  stats.chinaSplitCount=1;
  stats.koreaContinuous=false;
  stats.transformed=null;
  stats.ultimate=null;
  stats.specialCooldown=especial==='us'?14000:8000;
  stats.brazilTurboMultiplier=especial==='br'?1.5:1;
  stats.brazilFireworkCount=0;
  build.primary=especial;
  build.stages=Object.fromEntries(countries.map(id=>[id,id===especial?1:0]));
  build.active=[especial];
  build.usWall=especial==='us'?americanWallConfig(2):null;
  build.ruSputnikRadius=43;
  build.ruSputnikDurationMs=4000;
  build.ruFreezeMs=1800;
  build.ruCrystalBonus=1.3;
  build.krReflections=3;
  build.krSalvoDamage=7.2;
  build.krReflectDamage=2.4;
  const extra={
    projectileRadiusMultiplier:1,ruBossMultiplier:1,usShockDistance:0,
    usShockTime:450,usWallPushSpeed:1000,usWallPushMax:172,
    usWallReflectDamage:3,usWallOpenMs:300,
    brBalloonRadius:100,brFireworkRadius:27,brFireworks:1,brFireworkDamage:1,
    brElectricDamage:0,brElectricRange:0,brElectricRate:0,brFinalDamage:5,
    brPeakMs:1456,cnCopyDamage:1,cnFocusMs:2500,
    cnPulseMs:250,cnArmorMultiplier:1,cnPulseMultiplier:1,
    jpEchoEvery:0,jpEchoFactor:0,jpMaxTargetFraction:1,
    jpLaserEvery:principal==='jp'?6:0,ruChainTargets:0,
    ruChainRadius:0,ruChainFactor:0,
  };
  const has=(id,track,n)=>(allocation?.[id]?.[track]??0)>=n;
  const v=(id,track,n,suffix,fallback)=>labValue(profile,id,track,n,suffix,fallback);
  // PRINCIPAL: até quatro propriedades sequenciais por país.
  if(has('br','P',1)){stats.heat=true;stats.brazilHeatPeak=v('br','P',1,'heat',95)/100;}
  if(has('br','P',2)){stats.basicDamage*=v('br','P',2,'damage',1.35);extra.projectileRadiusMultiplier=v('br','P',2,'radius',1.25);}
  if(has('br','P',3))stats.horizontalSpread=v('br','P',3,'spread',14);
  if(has('br','P',4)){stats.heat=true;stats.brazilHeatPeak=v('br','P',4,'heat',150)/100;extra.brPeakMs=v('br','P',4,'plateau',2100);}
  if(has('us','P',1)){
    if(principal==='us')stats.usRocketRadius=v('us','P',1,'radius',13);
    else extra.projectileRadiusMultiplier*=v('us','P',1,'radius',13)/9;
  }
  if(has('us','P',2)&&principal==='us')
    stats.usRocketBlastRadius=v('us','P',2,'blastRadius',40);
  if(has('us','P',3)){extra.usShockDistance=v('us','P',3,'push',70);extra.usShockTime=v('us','P',3,'pushTime',450);}
  if(has('us','P',4)){
    stats.basicDamage*=v('us','P',4,'damage',1.6);
    if(principal==='us')stats.usRocketBlastDamage=v('us','P',4,'blastDamage',2.1);
  }
  if(has('ru','P',1)){stats.basicDamage*=v('ru','P',1,'damage',2)/1.75;stats.russianFreezeMs=v('ru','P',1,'freezeMs',1400);}
  if(has('ru','P',2)){stats.russianShatterDamage=v('ru','P',2,'shatterDamage',3);stats.russianShatterRadius=v('ru','P',2,'shatterRadius',60);}
  if(has('ru','P',3)){stats.russianFreezeMs=v('ru','P',3,'freezeMs',2200);stats.basicSpeed=v('ru','P',3,'speed',600);}
  if(has('ru','P',4)){stats.basicDamage*=v('ru','P',4,'damage',2.6)/2;extra.ruBossMultiplier=v('ru','P',4,'bossMultiplier',1.2);}
  if(has('cn','P',1))stats.bulletsPerShot=v('cn','P',1,'count',3);
  if(has('cn','P',2)){stats.chinaSplitCount=2;extra.cnCopyDamage=v('cn','P',2,'copyDamage',.5);}
  if(has('cn','P',3))stats.bulletsPerShot=v('cn','P',3,'count',5);
  if(has('cn','P',4))stats.basicInterval=v('cn','P',4,'intervalMs',240);
  if(has('jp','P',1)){extra.jpLaserEvery=v('jp','P',1,'every',5);stats.plasmaEvery=1;}
  if(has('jp','P',2))stats.laserDamage=v('jp','P',2,'damage',4);
  if(has('jp','P',3)){extra.jpEchoEvery=v('jp','P',3,'echoEvery',3);extra.jpEchoFactor=v('jp','P',3,'echoFactor',.5);}
  if(has('jp','P',4)){extra.jpLaserEvery=v('jp','P',4,'every',3);stats.plasmaEvery=1;}
  // ESPECIAL: os valores adaptam somente a identidade especial escolhida.
  // Propriedades de países diferentes permanecem no perfil para próximas
  // iterações; não criam especiais adicionais invisíveis no laboratório.
  if(has('br','S',1))extra.brFireworks=v('br','S',1,'fireworks',2);
  if(has('br','S',2)){
    extra.brBalloonRadius=v('br','S',2,'radius',120);
    extra.brFireworkRadius=v('br','S',2,'blastRadius',33);
    extra.brFireworks=v('br','S',2,'fireworks',3);
    extra.brFireworkDamage=v('br','S',2,'damage',2);
  }
  if(has('br','S',3)){
    extra.brFireworks=v('br','S',3,'fireworks',5);
    extra.brElectricDamage=v('br','S',3,'electricDamage',.5);
    extra.brElectricRange=v('br','S',3,'electricRange',45);
    extra.brElectricRate=v('br','S',3,'electricRate',3);
  }
  if(has('br','S',4)){
    stats.brazilTurboMultiplier=v('br','S',4,'turbo',2);
    extra.brFinalDamage=v('br','S',4,'finalDamage',7);
  }
  if(especial==='us'){
    if(has('us','S',1))build.usWall.radius=v('us','S',1,'radius',80);
    if(has('us','S',2)){
      extra.usWallPushSpeed=v('us','S',2,'pushSpeed',1200);
      extra.usWallPushMax=v('us','S',2,'pushMax',200);
    }
    if(has('us','S',3))extra.usWallReflectDamage=v('us','S',3,'reflectionDamage',4);
    if(has('us','S',4)){extra.usWallOpenMs=v('us','S',4,'openMs',180);build.usWall.durationMs=v('us','S',4,'durationMs',7500);}
  }
  if(especial==='ru'){
    if(has('ru','S',1))build.ruSputnikRadius=v('ru','S',1,'radius',55);
    if(has('ru','S',2))build.ruSputnikDurationMs=v('ru','S',2,'durationMs',5000);
    if(has('ru','S',3)){
      build.ruCrystalBonus=v('ru','S',3,'bonus',1.45);
      build.ruFreezeMs=v('ru','S',3,'freezeMs',2400);
    }
    if(has('ru','S',4)){
      extra.ruChainTargets=v('ru','S',4,'targets',4);
      extra.ruChainRadius=v('ru','S',4,'radius',60);
      extra.ruChainFactor=v('ru','S',4,'damageFactor',.5);
    }
  }
  if(has('cn','S',1))extra.cnPulseMs=v('cn','S',1,'pulseMs',200);
  if(has('cn','S',2))extra.cnFocusMs=v('cn','S',2,'focusMs',3500);
  if(has('cn','S',3))extra.cnArmorMultiplier=v('cn','S',3,'armorMultiplier',1.35);
  if(has('cn','S',4))extra.cnPulseMultiplier=v('cn','S',4,'pulseMultiplier',1.2);
  if(especial==='jp'){
    for(let n=1;n<=3;n++)if(has('jp','S',n)){
      build.krReflections=v('jp','S',n,'count',[0,6,12,24][n]);
      build.krSalvoDamage=v('jp','S',n,'budget',[0,10.8,14.4,19.2][n]);
    }
    if(has('jp','S',4)){
      build.krSalvoDamage=v('jp','S',4,'budget',24);
      extra.jpMaxTargetFraction=v('jp','S',4,'targetCap',.4);
    }
    build.krReflectDamage=build.krSalvoDamage/build.krReflections;
  }
  // Um único país só pode alcançar o Supremo no caso de fidelidade total.
  const winner=singleCountryAtTen(labLevelCounts(allocation,principal,especial),principal,especial);
  if(winner){
    stats.ultimate=winner;stats.transformed=winner;
    if(winner==='br'){stats.basicInterval*=.65;stats.basicDamage*=1.25;extra.brBalloonRadius=140;extra.brFinalDamage=9;}
    if(winner==='us'){stats.basicInterval*=.8;stats.usRocketRadius=20;stats.usRocketBlastRadius=56;build.usWall.radius=125;build.usWall.durationMs=8000;}
    if(winner==='ru'){stats.basicDamage*=2.6;stats.russianFreezeMs=3000;build.ruSputnikRadius=80;build.ruSputnikDurationMs=6000;}
    if(winner==='cn'){stats.bulletsPerShot=10;stats.chinaSplitCount=2;extra.cnFocusMs=4500;extra.cnPulseMultiplier*=1.15;}
    if(winner==='jp'){stats.koreaContinuous=true;stats.basicInterval=160;build.krSalvoDamage=27;build.krReflectDamage=27/build.krReflections;}
  }
  stats.basicInterval=Math.max(winner==='br'?32:55,Math.round(stats.basicInterval));
  return {stats,build,extra,winner};
}
