// Frases-base derivadas da seção 34.2 do GDD. A Rússia ainda tem texto provisório.
import {countryColor} from '../config/countryIdentity.js';
export const REPRESENTATIVES = Object.freeze({
  br: { name: 'Zeca Carrara', label: 'BRASIL', emblem: 'BR', offer: 'Meu consagrado, deixa comigo que eu conheço um rapaz que resolve isso aí!', accepted: 'Aí, sim! Sabia que você era fechamento!', tint: countryColor('br') },
  us: { name: 'Victor McDollar', label: 'EUA', emblem: 'US', offer: 'Victor McDollar, representante dos Estados Unidos! Vim porque quis. Vou ajudar vocês a vencer. Maior canhão, maior defesa, a melhor vitória! E vamos construir um muro!', accepted: 'Escolha fantástica, general! A melhor escolha. Vamos fazer isso grande, como nos velhos tempos!', tint: countryColor('us') },
  jp: { name: 'Kim Lin Doo', label: 'COREIA DO SUL', emblem: 'KR', offer: 'Annyeong, Brasil! Sou Kim Lin Doo, comandante do BTS: Batalhão Tático de Seul! O quê? Por que vocês estão cantando?', accepted: 'Saranghae, Brasil! O BTS, Batalhão Tático de Seul, protege vocês! Pare de pedir autógrafo, isso é artilharia!', tint: countryColor('jp') },
  ru: { name: 'Kátia Strófika', label: 'RÚSSIA', emblem: 'RU', offer: 'Camarada! Trouxe artilharia. É pesada, mas a conta podemos dividir depois.', accepted: 'À nossa parceria! Agora vamos derrubar umas naves!', tint: countryColor('ru') },
  cn: { name: 'Ming Da', label: 'CHINA', emblem: 'CN', offer: 'Você pediu um tiro? Mandei dois! Queria mandar vinte, mas a Receita Federal não deixou.', accepted: 'Excelente compra! Quer dizer... excelente parceria! Frete grátis para o Brasil!', tint: countryColor('cn') },
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
    'Eu quis esse cargo. Fiz questão de representar os Estados Unidos. Um país grande precisa dos melhores. E eu sou o melhor!',
    'Nos velhos tempos, a América fazia tudo maior. Quero aqueles tempos de volta. Começando pelo seu canhão!',
    'Minha solução? Um muro. Enorme, magnífico! As naves voam? Então fazemos o muro mais alto ainda.',
    'Eu faço os melhores acordos. Você pede um canhão, eu ofereço um maior. É ajuda de verdade, pode confiar!',
    'Vamos vencer com as maiores armas, os melhores aliados e o maior muro que o mundo já viu. Vai ser histórico!',
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
