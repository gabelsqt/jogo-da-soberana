// Frases-base derivadas da seção 34.2 do GDD. A Rússia ainda tem texto provisório.
export const REPRESENTATIVES = Object.freeze({
  br: { label: 'BRASIL', emblem: 'BR', offer: 'Meu consagrado, deixa comigo que eu conheço um rapaz que resolve isso aí!', accepted: 'Aí, sim! Sabia que você era fechamento!', tint: 0x2a9c65 },
  us: { label: 'EUA', emblem: 'US', offer: 'O Rio já foi grande. Muito grande. Mas comigo, vamos tornar o Rio grande novamente!', accepted: 'Escolha fantástica! A melhor escolha. Todo mundo está dizendo!', tint: 0x477dc4 },
  jp: { label: 'COREIA DO SUL', emblem: 'KR', offer: 'Annyeong, Brasil! Sou Kim Lin Doo, comandante do BTS: Batalhão Tático de Seul! O quê? Por que vocês estão cantando?', accepted: 'Saranghae, Brasil! O BTS, Batalhão Tático de Seul, protege vocês! Pare de pedir autógrafo, isso é artilharia!', tint: 0xd85c78 },
  ru: { label: 'RÚSSIA', emblem: 'RU', offer: 'Camarada! Trouxe artilharia. É pesada, mas a conta podemos dividir depois.', accepted: 'À nossa parceria! Agora vamos derrubar umas naves!', tint: 0xc94d4d },
  cn: { label: 'CHINA', emblem: 'CN', offer: 'Você pediu um tiro? Mandei dois! Queria mandar vinte, mas a Receita Federal não deixou.', accepted: 'Excelente compra! Quer dizer... excelente parceria! Frete grátis para o Brasil!', tint: 0xdfa84c },
});

export function representativeLine(country, mood = 'offer') {
  return REPRESENTATIVES[country]?.[mood] ?? '';
}

// HISTÓRIAS-BASE — PLACEHOLDERS. A revisão de texto e humor fica para o polimento
// pré-lançamento. Uma revelação nova a cada duas melhorias por país.
export const REPRESENTATIVE_STORIES=Object.freeze({
  br:Object.freeze([
    'Eu já trabalhei com foguete. Foi em festa junina, mas foguete é foguete.',
    'No formulário do governo, rojão de São João virou experiência aeroespacial.',
    'Na prática eu só comprava fogos no atacado e contratava sanfoneiro.',
    'Consegui aprovar verba para mais pólvora. O setor de festas agradece.',
    'Agora me chamam de especialista em tecnologia de ponta. Ponta de rojão.',
  ]),
  us:Object.freeze([
    'Disseram que a vaga tinha upgrade VIP. Eu só queria usar minhas milhas.',
    'A passagem oferecia “Comando Internacional” por cinquenta mil pontos.',
    'Confundi patente militar com acesso à sala VIP de um aeroporto.',
    'Ainda não descobri onde cancela a assinatura premium do exército.',
    'Estão me cobrando comando estratégico e taxa de bagagem extra.',
  ]),
  jp:Object.freeze([
    'Eu cantava K-pop. Agora sou general porque o serviço militar me convocou.',
    'Meu BTS significa Batalhão Tático de Seul. Não é convite para cantar.',
    'As táticas parecem coreografias porque era o único treino que eu tinha.',
    'Sinto falta dos shows. Militar não pode pedir bis, só reforço.',
    'Eu nem queria essa patente. Cadê os fãs e os figurinos?',
  ]),
  ru:Object.freeze([
    'Eu tenho muita experiência em congelamento. Muita mesmo.',
    'Congelava contas bancárias antes de me transferirem para a defesa.',
    'Uma tradução automática trocou crédito bloqueado por criogenia tática.',
    'Nunca congelei coisa nenhuma, tirando o saldo de clientes.',
    'Por favor, não avise ao quartel. Já me deram um batalhão de inverno.',
  ]),
  cn:Object.freeze([
    'Eu era responsável por entregas. Recebia cinco estrelas de todo mundo.',
    'Um algoritmo viu minha eficiência e me promoveu sem perguntar.',
    'Invasão alienígena é só uma encomenda grande com reclamações.',
    'Já abri chamado de logística contra a frota inimiga. Prioridade máxima.',
    'As naves precisam chegar ao destino antes do prazo, ou perco estrelas.',
  ]),
});
export function representativeStoryFor(country,level=1){
  const stories=REPRESENTATIVE_STORIES[country];
  if(!stories)return representativeLine(country);
  return stories[Math.min(stories.length-1,Math.max(0,Math.floor((level-1)/2)))];
}
