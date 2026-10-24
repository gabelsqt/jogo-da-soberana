import { russianShatterRadius, russianShatterDamage } from './russianFrost.js';
import {countryColor} from '../config/countryIdentity.js';
import {americanRocketConfig} from './americanArsenal.js';
import {BASE_CANNON_INTERVAL_MS} from './upgrades.js';

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
      "description": "Balão de Rojões: atire no balão para gerar mini-explosões coloridas aleatórias em área; no final, uma grande explosão e frase de caminhão. Turbo por 5 s.",
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
      "description": "Balão de Rojões com área ampliada e turbo de metralhadora mais forte.",
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
      "description": "Balão com alcance ainda maior e turbo reforçado para alimentar os rojões.",
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
      "description": "Balão de Rojões em sua área máxima e turbo máximo de cadência.",
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
      "title": "Munição Patriótica™",
      "description": "Tiro principal vira um foguete físico com explosão vermelha, branca e azul.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "O Grande Muro™",
      "description": "Botão direito cria arco energético de 120° na mira: bloqueia tiros e repele naves durante até 6 segundos.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Quatro de Julho™",
      "description": "Foguetes maiores: colisão física mais larga e explosão tricolor ampliada.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Obra Superfaturada™",
      "description": "Grande Muro fica mais amplo; invulnerável a tiros comuns, com arco fixo de 120°.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Espetáculo da Independência™",
      "description": "Foguete ainda maior e explosão patriótica mais destrutiva.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Segurança Nacional™",
      "description": "Grande Muro mais largo, com bandeira americana na curvatura; só feixes de cerco pesado podem rompê-lo.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Choque e Pavor™",
      "description": "Foguete enorme, maior colisão e explosão tricolor capaz de atingir enxames.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "O Maior Muro do Mundo™",
      "description": "Grande Muro atinge seu raio máximo; lasers de cerco e superarma do Tipo 6 ainda podem destruí-lo.",
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
      "title": "Independence Day™",
      "description": "Transformação: foguetes monumentais, colisão larga e explosão tricolor, sem crescimento durante o voo.",
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
      "description": "Tiros gelados mais rápidos e frequentes congelam o alvo. Mortes congeladas espalham estilhaços que causam dano em área.",
      "kind": "primary"
    },
    {
      "level": 2,
      "title": "Sputnik Criogênico",
      "description": "Satélite congela e cristaliza por contato durante 4 s. Alvos marcados levam mais dano do tiro russo.",
      "kind": "secondary"
    },
    {
      "level": 3,
      "title": "Inverno Russo",
      "description": "Tiros mais rápidos e fortes, congelamento prolongado e estilhaços de gelo com dano ampliado.",
      "kind": "primary"
    },
    {
      "level": 4,
      "title": "Órbita Fria",
      "description": "Sputnik permanece por 5 s e aumenta a área de contato congelante.",
      "kind": "secondary"
    },
    {
      "level": 5,
      "title": "Estilhaço Siberiano",
      "description": "Rajadas congelantes muito mais fortes e rápidas; estilhaços maiores causam dano pesado em área.",
      "kind": "primary"
    },
    {
      "level": 6,
      "title": "Reator de Permafrost",
      "description": "Cristalizados geram explosões de gelo com dano e raio ampliados.",
      "kind": "secondary"
    },
    {
      "level": 7,
      "title": "Zero Absoluto",
      "description": "Máxima cadência, velocidade e dano dos tiros de gelo; explosões de cristais muito mais destrutivas.",
      "kind": "primary"
    },
    {
      "level": 8,
      "title": "Zero Absoluto Orbital",
      "description": "Sputnik emite pulsos de congelamento e libera uma última onda criogênica ao desaparecer.",
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
      "description": "Transformação: sopro contínuo de gelo com dano crescente em cone. Congela por 3 s e provoca estilhaçamento devastador em 120 px.",
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
  us: {title:'Operação Liberdade Duradoura™',scope:'target',color:countryColor('us')},
  jp: {title:'Último Encore',scope:'beam',color:countryColor('jp')},
  ru: {title:'Protocolo Cortina de Ferro',scope:'target',color:countryColor('ru')},
  cn: {title:'Seu Pedido Chegou!',scope:'sky',color:countryColor('cn')},
});

export const MAX_VISUAL_PROJECTILES = 95;
export const MAX_COSMETIC_PARTICLES = 16;
export const MAX_PROJECTILE_GENERATION = 1;

export function v1CountryLevels(state = {}) {
  const levels = Object.fromEntries(Object.keys(V1_UPGRADES).map(id=>[id,0]));
  // Apenas o laboratório V1 fornece estes níveis extras. A campanha
  // continua limitada a dez upgrades, sem misturar regras de progressão.
  if(state.labLevels && typeof state.labLevels === 'object') {
    for (const id of Object.keys(levels)) {
      const level=Number(state.labLevels[id]);
      levels[id]=Number.isFinite(level)
        ? Math.max(0,Math.min(10,Math.trunc(level))) : 0;
    }
    return levels;
  }
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
    color:countryColor(country.id),
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
  const stats = {...base, basicInterval:BASE_CANNON_INTERVAL_MS, basicSpeed:480, basicDamage:1, pierce:1,
    fragmentation:false, plasmaEvery:0, knockback:0, bulletsPerShot:1,
    brazilZigzag:false, specialCooldown:8000, collateral:false,
    residualSlash:false, strategicRecoil:false, electricFence:false,
    shieldBonus:0, shieldRegen:3.5, heat:false, horizontalSpread:0,
    duplicateChance:0, missileEvery:0, extraBurstEvery:0, electricDamage:1,
    laserDamage:3, shockRadius:0, slowShot:false, specialAmplifier:1,
    shieldIntercept:false, shieldPulse:false, brazilTurboMultiplier:1, brazilFireworkCount:0, brazilHeatPeak:0, ultimate:v1SupremeFor(state),
    usGrowthMax:1, usHoming:0,
    usRocketRadius:0,usRocketBlastRadius:0,usRocketBlastDamage:0,
    usJulyHitsRequired:0,usJulyBlastRadius:0,usJulyBlastDamage:0,usJulyShards:false,
    russianFreezeMs:0,
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
  // O tamanho físico e a colisão dos foguetes crescem APENAS com upgrades.
  // O Quatro de Julho por acertos e a fragmentação antiga não são usados.
  Object.assign(stats,{
    usRocketRadius:americanRocketConfig(n.us).radius,
    usRocketBlastRadius:americanRocketConfig(n.us).blastRadius,
    usRocketBlastDamage:americanRocketConfig(n.us).blastDamage,
  });
  if(n.jp>=1)stats.plasmaEvery=3;
  if(n.jp>=2){stats.residualSlash=true;}
  if(n.jp>=3)stats.plasmaEvery=2;
  if(n.jp>=4){stats.specialAmplifier+=0.2;}
  if(n.jp>=5)stats.laserDamage+=2;
  if(n.jp>=6){stats.specialCooldown*=0.86;}
  if(n.jp>=7){stats.plasmaEvery=1;stats.laserDamage+=1;}
  if(n.jp>=8){stats.specialAmplifier+=0.45;}
  // Melhorias primárias russas (1/3/5/7): tiro normal progride em
  // cadência, dano E velocidade de viagem. Níveis pares continuam dedicados ao especial.
  // Multiplicadores combinam com outros países, sem sobrescrever seus bônus.
  if(n.ru>=1){
    stats.basicDamage*=1.75;stats.knockback=0.12;stats.russianFreezeMs=1000;
    stats.basicInterval*=0.84;stats.basicSpeed*=1.10;
  }
  if(n.ru>=3){
    stats.russianFreezeMs=1500;
    stats.basicInterval*=0.82;stats.basicSpeed*=1.12;
    stats.basicDamage*=2.35/1.75;
  }
  if(n.ru>=5){
    stats.russianFreezeMs=2000;
    stats.basicInterval*=0.81;stats.basicSpeed*=1.12;
    stats.basicDamage*=3.4/2.35;
  }
  if(n.ru>=7){
    stats.russianFreezeMs=2500;
    stats.basicInterval*=0.82;stats.basicSpeed*=1.12;
    stats.basicDamage*=4.8/3.4;
  }
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
    stats.basicSpeed*=1.35;
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
    stats.transformed='jp';stats.basicInterval=160;
    stats.laserDamage*=0.92;stats.koreaContinuous=true;
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
