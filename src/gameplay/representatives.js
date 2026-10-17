// Frases-base derivadas da seção 34.2 do GDD. A Rússia ainda tem texto provisório.
export const REPRESENTATIVES = Object.freeze({
  br: { label: 'BRASIL', emblem: 'BR', offer: 'Meu consagrado, deixa comigo que eu conheço um rapaz que resolve isso aí!', accepted: 'Aí, sim! Sabia que você era fechamento!', tint: 0x2a9c65 },
  us: { label: 'EUA', emblem: 'US', offer: 'O Rio já foi grande. Muito grande. Mas comigo, vamos tornar o Rio grande novamente!', accepted: 'Escolha fantástica! A melhor escolha. Todo mundo está dizendo!', tint: 0x477dc4 },
  jp: { label: 'COREIA DO SUL', emblem: 'KR', offer: 'Annyeong, Brasil! Eu deveria estar em turnê mundial, mas fui convocado. Então... alguém precisa de apoio aéreo?', accepted: 'Saranghae, Brasil! Vocês são os melhores fãs... digo, aliados do mundo!', tint: 0xd85c78 },
  ru: { label: 'RÚSSIA', emblem: 'RU', offer: 'Camarada! Trouxe artilharia. É pesada, mas a conta podemos dividir depois.', accepted: 'À nossa parceria! Agora vamos derrubar umas naves!', tint: 0xc94d4d },
  cn: { label: 'CHINA', emblem: 'CN', offer: 'Você pediu um tiro? Mandei dois! Queria mandar vinte, mas a Receita Federal não deixou.', accepted: 'Excelente compra! Quer dizer... excelente parceria! Frete grátis para o Brasil!', tint: 0xdfa84c },
});

export function representativeLine(country, mood = 'offer') {
  return REPRESENTATIVES[country]?.[mood] ?? '';
}
