// Operação Desvio de Carga — estado puro da única revanche da onda 11.
// 'jp' é o identificador legado da Coreia do Sul.
export const ZECA_OPERATION_COUNTRIES = Object.freeze(['us','jp','ru','cn']);
export const ZECA_OPERATION_COPY = Object.freeze({
  us:{
    title:'CORRIDA EXPRESSA — ESTADOS UNIDOS',
    line:'Falei com um colega da van. Ele buscou a carga e voltou. Corrida com bagagem grande é outro preço.',
    farewell:'Devolvemos tudo que dava, chefe. Daqui pra frente não é mais questão de motorista.',
    color:0xffac70,
  },
  jp:{
    title:'CORRIDA EXPRESSA — COREIA DO SUL',
    line:'Um taxista nosso passou lá e trouxe o equipamento. Se perguntarem, foi só uma corrida de volta.',
    farewell:'Meu amigo trouxe tudo, chefe. Outra viagem dessas ele não faz.',
    color:0xcaa1ff,
  },
  ru:{
    title:'CORRIDA EXPRESSA — RÚSSIA',
    line:'O motorista falou que o carro pegou de primeira. O resto ele resolveu pelo caminho.',
    farewell:'Nem uma corrida a mais. O pessoal já fez a parte deles, chefe.',
    color:0x8edcff,
  },
  cn:{
    title:'CORRIDA EXPRESSA — CHINA',
    line:'O sujeito da van disse que tinha espaço no porta-malas. Pronto. Tá tudo aqui.',
    farewell:'A van veio cheia, chefe. Não sobrou mais nada pra buscar.',
    color:0xffd36d,
  },
});

// A primeira derrota permite uma proposta, a segunda encerra a campanha.
// O traidor sempre participou da campanha, segundo as regras de sorteio.
export function canOfferZecaRecovery(campaign, traitor, revengeUsed=false){
  return !revengeUsed&&ZECA_OPERATION_COUNTRIES.includes(traitor)&&
    Array.isArray(campaign?.choices)&&campaign.choices.includes(traitor);
}

// As melhorias voltam exatamente como foram compradas: ordem, níveis e
// transformação incluídos. Apenas o Supremo do traidor fica interditado.
// Não acrescentar níveis brasileiros nem sortear um novo traidor.
export function zecaRevengeLoadout(campaign, traitor){
  const choices=Array.isArray(campaign?.choices)?campaign.choices.slice(0,10):[];
  return {choices,disabledSupremeCountry:traitor};
}

export function zecaOperationCopy(traitor){
  return ZECA_OPERATION_COPY[traitor]??null;
}
