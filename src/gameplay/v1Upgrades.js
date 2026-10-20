import { russianShatterRadius, russianShatterDamage } from './russianFrost.js';

// Versão 1 — catálogo aprovado nas decisões 53–68. Animais antigos ficam arquivados.
// 'jp' continua sendo o identificador técnico legado da COREIA DO SUL.
export const V1_UPGRADES = {
  "br": [
    {
      "level": 1,
      "title": "Gambiarra Balística",
      "description": "Metralhadora rápida desde o início, com varredura horizontal e aceleração em ondas.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Arraial Balístico",
      "description": "Arraial Balístico: 4 fogos e turbo de cadência por 5 s.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Motor Esquentando",
      "description": "Rajadas em ondas mais densas, com motor esquentando.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "São João de Arromba",
      "description": "8 fogos explosivos e turbo mais forte.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Chumbo Grosso",
      "description": "Balas maiores e mais fortes.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "220V",
      "description": "16 fogos, turbo reforçado e descargas ofensivas em cadeia.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Produção Nacional",
      "description": "Rajadas de balas com origem alternada na horizontal.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Usina de Gambiarra",
      "description": "32 fogos e turbo máximo de cadência.",
      "kind": "secondary"
    },
    {
      "level": 9,
      "title": "Réveillon de Copacabana",
      "description": "Supremo REVEILLON: o Cristo Redentor decola e destrói a frota em um Réveillon de fogos. Cena estática provisória.",
      "kind": "ultimate"
    },
    {
      "level": 10,
      "title": "Metralhadora da Soberania",
      "description": "Feixe quase contínuo de projéteis físicos; picos de superaquecimento absurdos, ampliados pelo turbo junino.",
      "kind": "transformation"
    }
  ],
  "us": [
    {
      "level": 1,
      "title": "Super Size Me™",
      "description": "Balas crescem gradualmente no voo até 2× de diâmetro.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Choque Inicial™",
      "description": "Choque e Pavor: míssil guiado, explosão e onda de choque que empurra inimigos.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Tamanho Família™",
      "description": "Balas crescem até 4× e seguem o alvo.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Entrega de Democracia™",
      "description": "Choque e Pavor com míssil 2× e onda de impacto ampliada.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Destino Manifesto™",
      "description": "Balas crescem até 6× e seguem o alvo.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Choque e Pavor™",
      "description": "Choque e Pavor com míssil 4× e choque ofensivo maior.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Orçamento Ilimitado™",
      "description": "Balas crescem até 8× com perseguição intensificada.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Ataque Premium™",
      "description": "Choque e Pavor com míssil 8× e pulso ofensivo maior.",
      "kind": "secondary"
    },
    {
      "level": 9,
      "title": "Operação Liberdade Duradoura™",
      "description": "Supremo: código nos últimos 5 s; bombardeiros gigantes e míssil descomunal finalizam a onda.",
      "kind": "ultimate"
    },
    {
      "level": 10,
      "title": "Liberdade Irrestrita™",
      "description": "Transformação: projéteis teleguiados crescem durante o voo até 12× de diâmetro e explodem ao atingir inimigos.",
      "kind": "transformation"
    }
  ],
  "jp": [
    {
      "level": 1,
      "title": "Lightstick Tático",
      "description": "Lasers perfurantes acompanham os tiros do canhão.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Bola de Discoteca Orbital",
      "description": "Globo dura 4 s e gera 3 reflexos guiados por tiro recebido.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Sincronia Perfeita",
      "description": "Lasers perfurantes mais frequentes.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Palco Iluminado",
      "description": "Globo dura 4 s e gera 6 reflexos guiados por tiro recebido.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Refrão Perfurante",
      "description": "Lasers perfurantes mais fortes.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Solo de Luz",
      "description": "Globo dura 4 s e gera 12 reflexos guiados por tiro recebido.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Coreografia de Plasma",
      "description": "Lasers perfurantes a cada rajada.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Discoteca Intergaláctica",
      "description": "Globo dura 4 s e gera 24 reflexos guiados por tiro recebido.",
      "kind": "secondary"
    },
    {
      "level": 9,
      "title": "Último Encore",
      "description": "Supremo ENCORE: show de Kim Lin Doo varre a frota alienígena. Cena estática provisória.",
      "kind": "ultimate"
    },
    {
      "level": 10,
      "title": "Encore Infinito",
      "description": "Transformação: tiro principal vira um laser contínuo e perfurante enquanto a mira está acionada.",
      "kind": "transformation"
    }
  ],
  "ru": [
    {
      "level": 1,
      "title": "Geada Siberiana",
      "description": "Tiros congelam o alvo. Se morrer congelado, estilhaça e causa dano nos inimigos ao redor.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Matryoshka de Estilhaços",
      "description": "Matryoshka estilhaça congelados com 8 fragmentos; recarga 25% menor.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Inverno Russo",
      "description": "Congelamento mais longo e explosões de gelo maiores e mais fortes.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Boneca Matryoshka",
      "description": "Especial solta 12 estilhaços e provoca reações ofensivas em cadeia.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Estilhaço Siberiano",
      "description": "Fragmentos de inimigos congelados atingem uma área maior com dano elevado.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Frente Fria",
      "description": "Especial solta 16 estilhaços em trajetórias congelantes.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Zero Absoluto",
      "description": "Gelo mais persistente e explosão de fragmentos ainda mais ampla.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Tempestade de Estilhaços",
      "description": "Especial solta 24 estilhaços de longo alcance.",
      "kind": "secondary"
    },
    {
      "level": 9,
      "title": "Protocolo Cortina de Ferro",
      "description": "Supremo: código nos últimos 5 s; cúpula metálica protege o Rio e satélite dispara raio orbital que finaliza a onda.",
      "kind": "ultimate"
    },
    {
      "level": 10,
      "title": "Inverno Eterno",
      "description": "Transformação: tiro principal vira um sopro contínuo de fumaça gelada em cone. Congela por 3 s; inimigos mortos congelados estilhaçam em 120 px.",
      "kind": "transformation"
    }
  ],
  "cn": [
    {
      "level": 1,
      "title": "Compre 1, Leve 2",
      "description": "Dispara dois projéteis por salva.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Entrega Expressa",
      "description": "Especial: uma encomenda explosiva.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Leve 3, Pague 2",
      "description": "Dispara três projéteis por salva.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Frete Grátis",
      "description": "Especial com encomendas maiores e dois impactos.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Compre 3, Leve 6",
      "description": "Três balas se dividem uma vez em seis; filhos não se dividem.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Carga Pesada",
      "description": "Especial distribui três cargas explosivas grandes.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Atacado da Destruição",
      "description": "Cinco projéteis se dividem uma vez em dez.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Frete Internacional",
      "description": "Especial distribui quatro cargas gigantes.",
      "kind": "secondary"
    },
    {
      "level": 9,
      "title": "Seu Pedido Chegou!",
      "description": "Supremo ENTREGA: drone colossal entrega um enxame exterminador. Cena estática provisória.",
      "kind": "ultimate"
    },
    {
      "level": 10,
      "title": "Estoque Infinito",
      "description": "Dez tiros se dividem uma vez em vinte projéteis, sem recursão.",
      "kind": "transformation"
    }
  ]
};

export const V1_SUPREMES = Object.freeze({
  br: {title:'Réveillon de Copacabana',scope:'sky',color:0x4de88c},
  us: {title:'Operação Liberdade Duradoura™',scope:'target',color:0xffae59},
  jp: {title:'Último Encore',scope:'beam',color:0xe68aff},
  ru: {title:'Protocolo Cortina de Ferro',scope:'target',color:0xff6b69},
  cn: {title:'Seu Pedido Chegou!',scope:'sky',color:0xffdb5d},
});

export const MAX_VISUAL_PROJECTILES = 95;
export const MAX_COSMETIC_PARTICLES = 16;
export const MAX_PROJECTILE_GENERATION = 1;

export function v1CountryLevels(state = {}) {
  const levels = Object.fromEntries(Object.keys(V1_UPGRADES).map(id=>[id,0]));
  for (const id of (Array.isArray(state.choices)?state.choices:[]).slice(0,10)) {
    if (Object.hasOwn(levels,id)) levels[id] += 1;
  }
  // Onda 11: melhorias brasileiras concedidas durante a resistência
  // podem pular níveis que exigiriam torres; o maior nível define as armas.
  if(Array.isArray(state.resistanceLevels))for(const level of state.resistanceLevels)
    if(Number.isInteger(level)&&level>=1&&level<=10)
      levels.br=Math.max(levels.br,level);
  return levels;
}
export function nextV1Options(state = {}, countryBase = []) {
  const levels = v1CountryLevels(state);
  return countryBase.map(country => ({...country, ...V1_UPGRADES[country.id][levels[country.id] ?? 0],
    locked:(state.choices?.length??0)>=10, tower:false }));
}
export function chooseV1Upgrade(state = {}, countryId) {
  if (!Object.hasOwn(V1_UPGRADES,countryId)) return null;
  const choices = (Array.isArray(state.choices)?state.choices:[]).filter(id=>Object.hasOwn(V1_UPGRADES,id)).slice(0,10);
  if (choices.length >= 10) return null;
  return {choices:[...choices,countryId]};
}
export function v1SupremeFor(state) {
  const levels = v1CountryLevels(state);
  const supreme=Object.keys(V1_UPGRADES).find(id=>levels[id]>=9)??null;
  // Zeca recupera até a transformação, mas não o Supremo do traidor.
  return supreme && supreme===state?.disabledSupremeCountry ? null : supreme;
}
// A soma das dez escolhas impede duas supremas simultâneas.
export function v1CombatStats(state = {}, base = {}) {
  const n = v1CountryLevels(state);
  const stats = {...base, basicInterval:400, basicSpeed:480, basicDamage:1, pierce:1,
    fragmentation:false, plasmaEvery:0, knockback:0, bulletsPerShot:1,
    brazilZigzag:false, specialCooldown:8000, collateral:false,
    residualSlash:false, strategicRecoil:false, electricFence:false,
    shieldBonus:0, shieldRegen:3.5, heat:false, horizontalSpread:0,
    duplicateChance:0, missileEvery:0, extraBurstEvery:0, electricDamage:1,
    laserDamage:3, shockRadius:0, slowShot:false, specialAmplifier:1,
    shieldIntercept:false, shieldPulse:false, brazilTurboMultiplier:1, brazilFireworkCount:0, brazilHeatPeak:0, ultimate:v1SupremeFor(state),
    usGrowthMax:1, usHoming:0, russianFreezeMs:0,
    russianShatterRadius:0,russianShatterDamage:0,
    chinaSplitCount:1, koreaContinuous:false, transformed:null};
  // Brasil: metralhadora potente desde o nível 1; picos de calor cíclicos.
  if(n.br>=1){stats.basicInterval/=2;stats.heat=true;stats.brazilHeatPeak=0.65;stats.horizontalSpread=6;}
  if(n.br>=2){stats.brazilFireworkCount=4;stats.brazilTurboMultiplier=1.5;}
  if(n.br>=3){stats.basicInterval/=1.3;stats.brazilHeatPeak=0.9;}
  if(n.br>=4){stats.brazilFireworkCount=8;stats.brazilTurboMultiplier=2;}
  if(n.br>=5){stats.basicInterval/=1.25;stats.basicDamage*=1.45;stats.brazilHeatPeak=1.15;}
  if(n.br>=6){stats.electricDamage=1.7;stats.specialAmplifier+=0.25;stats.brazilFireworkCount=16;stats.brazilTurboMultiplier=2.5;}
  if(n.br>=7){stats.basicInterval/=1.3;stats.brazilHeatPeak=1.5;stats.horizontalSpread=11;}
  if(n.br>=8){stats.specialAmplifier+=0.2;stats.brazilFireworkCount=32;stats.brazilTurboMultiplier=3;}
  if(n.br>=10){stats.basicInterval/=1.9;stats.brazilHeatPeak=2.4;stats.horizontalSpread=16;}
  if(n.us>=1){stats.fragmentation=true;stats.usGrowthMax=2;}
  if(n.us>=3){stats.usGrowthMax=4;stats.usHoming=1.8;}
  if(n.us>=5){stats.usGrowthMax=6;stats.usHoming=2.1;}
  if(n.us>=7){stats.usGrowthMax=8;stats.usHoming=2.6;}
  if(n.us>=2){stats.specialAmplifier+=0.25;}
  if(n.us>=3)stats.collateral=true;
  if(n.us>=5)stats.missileEvery=5;
  if(n.us>=6){stats.specialAmplifier+=0.4;}
  if(n.us>=7)stats.missileFragmentation=true;
  if(n.us>=8){stats.specialAmplifier+=0.4;}
  if(n.jp>=1)stats.plasmaEvery=3;
  if(n.jp>=2){stats.residualSlash=true;}
  if(n.jp>=3)stats.plasmaEvery=2;
  if(n.jp>=4){stats.specialAmplifier+=0.2;}
  if(n.jp>=5)stats.laserDamage+=2;
  if(n.jp>=6){stats.specialCooldown*=0.86;}
  if(n.jp>=7){stats.plasmaEvery=1;stats.laserDamage+=1;}
  if(n.jp>=8){stats.specialAmplifier+=0.45;}
  if(n.ru>=1){stats.basicDamage*=1.75;stats.knockback=0.12;stats.russianFreezeMs=1000;}
  if(n.ru>=3){stats.russianFreezeMs=1500;}
  if(n.ru>=5){stats.russianFreezeMs=2000;}
  if(n.ru>=7){stats.russianFreezeMs=2500;}
  if(n.ru>=2){
    // Matryoshka recarrega 25% mais depressa; acumulável com bônus coreanos.
    stats.specialCooldown*=0.75;
  }
  if(n.ru>=3)stats.shockRadius=38;
  if(n.ru>=4){stats.strategicRecoil=true;}
  if(n.ru>=5)stats.slowShot=true;
  if(n.ru>=6){stats.specialAmplifier+=0.35;}
  if(n.ru>=7)stats.shockRadius=64;
  if(n.ru>=8){stats.specialAmplifier+=0.35;}
  if(n.cn>=1)stats.bulletsPerShot=2;
  if(n.cn>=2){stats.specialAmplifier+=0.2;}
  if(n.cn>=3)stats.bulletsPerShot=3;
  if(n.cn>=5){stats.bulletsPerShot=3;stats.chinaSplitCount=2;}
  if(n.cn>=7)stats.bulletsPerShot=5;
  if(n.cn>=6){stats.specialAmplifier+=0.25;}
  if(n.cn>=7)stats.extraBurstEvery=11;
  if(n.cn>=8){stats.specialAmplifier+=0.4;}
  // Nível 10 é uma transformação de mecânica, não somente um multiplicador.
  if(n.br>=10){
    stats.transformed='br';stats.basicInterval*=0.28;stats.basicDamage*=2;
    stats.brazilHeatPeak=2.4;stats.horizontalSpread=16;stats.basicSpeed*=1.35;
  }
  if(n.us>=10){
    stats.transformed='us';stats.basicDamage*=2;stats.basicInterval*=0.42;
    stats.basicSpeed*=1.35;stats.usGrowthMax=12;stats.usHoming=3.2;
  }
  if(n.ru>=10){
    stats.transformed='ru';stats.basicDamage*=2.6;stats.basicInterval*=0.5;
    stats.basicSpeed*=1.35;stats.russianFreezeMs=3000;
    stats.shockRadius=Math.max(stats.shockRadius,85);
  }
  stats.russianShatterRadius=russianShatterRadius(n.ru);
  stats.russianShatterDamage=russianShatterDamage(n.ru);
  if(n.cn>=10){
    stats.transformed='cn';stats.basicDamage*=2;stats.basicInterval*=0.42;
    stats.basicSpeed*=1.35;stats.bulletsPerShot=10;
    stats.chinaSplitCount=2;stats.duplicateChance=0;
  }
  if(n.jp>=10){
    stats.transformed='jp';stats.basicInterval=90;stats.basicDamage*=2;
    stats.laserDamage*=1.8;stats.koreaContinuous=true;
  }
  stats.basicInterval=Math.max(stats.transformed==='br'?32:55,Math.round(stats.basicInterval));
  stats.specialCooldown=Math.max(1800,Math.round(stats.specialCooldown));
  return stats;
}
// Compatibilidade combinatória: tiros derivados conservam efeitos, mas não se reproduzem.
export function mayDuplicateProjectile(generation, chance, roll) {
  return generation < MAX_PROJECTILE_GENERATION && chance>0 && roll<chance;
}
export function horizontalOffsets(count, spread) {
  return Array.from({length:Math.max(1,count)},(_,i)=>count<=1?0:(i-(count-1)/2)*spread);
}
