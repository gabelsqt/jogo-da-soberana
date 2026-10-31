// Vozes canônicas: revisão editorial de 31/10/2026. Histórias avançam por onda.
import {countryColor} from '../config/countryIdentity.js';
export const REPRESENTATIVES = Object.freeze({
  br: {...{
  "name": "Zé Maria",
  "label": "BRASIL",
  "emblem": "BR",
  "offer": "Sou o Zé Maria. Do Marea, lembra? Trouxe minhas ferramentas. O tamanho do problema é que mudou.",
  "accepted": "Fechado, chefe. Vou caprichar. Hoje a garantia cobre até invasão."
}, tint: countryColor('br')},
  us: {...{
  "name": "Victor McDollar",
  "label": "EUA",
  "emblem": "US",
  "offer": "Victor McDollar! Trouxe uma defesa espetacular. E minha equipe. Vitória grande precisa sair bem na foto.",
  "accepted": "Excelente escolha! Você cuida da mira. Eu cuido de contar ao mundo como ajudamos."
}, tint: countryColor('us')},
  jp: {...{
  "name": "Kim Lin Du",
  "label": "COREIA DO SUL",
  "emblem": "KR",
  "offer": "Kim Lin Du, líder do grupo e general do BTS: Batalhão Tático de Seul. Sim, eu ainda faço shows. Dormir ficou pra depois.",
  "accepted": "Fechado, parceiro de palco. Minha equipe instala; você ensaia a entrada triunfal."
}, tint: countryColor('jp')},
  ru: {...{
  "name": "Kátia Strófika",
  "label": "RÚSSIA",
  "emblem": "RU",
  "offer": "Kátia Strófika. Campeã de força, resistência e ginástica. As outras medalhas ficaram no carro. Vamos treinar essa mira.",
  "accepted": "Boa escolha. Agora vem a parte que não aceita discurso: o treino."
}, tint: countryColor('ru')},
  cn: {...{
  "name": "Mingda Mai",
  "label": "CHINA",
  "emblem": "CN",
  "offer": "Mingda Mai. Comecei numa banca; hoje organizo entregas pelo mundo. Trouxe tecnologia. E desconto, porque vocês estão precisando.",
  "accepted": "Combinado! Minha equipe cuida da instalação. A embalagem eu levo; ainda serve."
}, tint: countryColor('cn')},
});
export function representativeLine(country, mood = 'offer') {
  return REPRESENTATIVES[country]?.[mood] ?? '';
}
export const REPRESENTATIVE_STORIES = Object.freeze({
  "br": [
    "Seu carro já me deu susto. Mas esse foi o primeiro serviço que me telefonou do alto de um prédio.",
    "Não escolhe por consideração comigo, não. Olha o que cada peça faz. Eu quero é ver você voltar inteiro.",
    "Aprendi desmontando. Pra aprender a montar, tive que parar de perder parafuso.",
    "Na oficina, quando eu invento uma solução, pedem desconto. Aqui pediram pra salvar a cidade. O desconto veio junto.",
    "Tem peça aqui que já chamaram de sucata. Às vezes o defeito é só ninguém olhar direito.",
    "O Victor quer dar meu nome a uma oficina. Aí mostrou a placa. Meu nome tava embaixo de McDollar, bem pequeno.",
    "A Kátia perguntou quanto peso eu levanto. Falei que depende de onde o cliente estacionou o Marea.",
    "O Kim quer me pôr num grupo. Eu já faço solo de furadeira. Será que conta?",
    "Passei a vida ouvindo que eu levava jeito. Hoje você botou a cidade na minha mão. Obrigado por confiar.",
    "Quando isso acabar, passa na oficina. Pra tomar um café. Dessa vez não precisa quebrar nada."
  ],
  "us": [
    "Já apresentei televisão. A câmera me adora. O segredo é nunca perguntar a opinião dela.",
    "Um muro de energia! Finalmente uma obra que fica pronta antes do discurso de inauguração. Preciso acelerar o discurso.",
    "Minha equipe perguntou onde fica o camarim. Eu disse: estamos numa guerra. Usem o banheiro do boteco.",
    "Zé Maria é meu melhor amigo. Ele ainda está sendo informado, mas vai ficar muito feliz.",
    "Você tem presença. Eu reconheço talento quando ele aparece ao lado do meu nome.",
    "Pense numa oficina enorme pro Zé. A maior do mundo! McDollar Motors. O nome dele entra na fachada lateral.",
    "Meu assessor disse que eu apareço demais nas fotos. Demiti a foto. O assessor ainda pode melhorar.",
    "Olhe o herói que você virou com o nosso apoio! Claro que você também fez a sua parte. Apertou vários botões.",
    "O muro teria de cercar tudo. E o mar? Boa pergunta. Adoro perguntas que minha equipe vai responder.",
    "Quando vencer, fique à minha direita na foto. É o seu melhor lado. Também é o lado onde cabe meu nome."
  ],
  "jp": [
    "Continuo com o grupo. O serviço militar entrou na agenda entre o ensaio e o show. A agenda perdeu a batalha.",
    "É Batalhão Tático de Seul. Eu explico a sigla toda vez. Sempre alguém pede a música errada.",
    "Meu sorriso de palco? Ensaio. Esse bocejo no meio dele é espontâneo.",
    "O Zé levanta a chave e todo mundo presta atenção. Presença de palco. Falta só convencer ele do figurino.",
    "Quando você acerta, olha pra frente. Não pra câmera. Eu sei, sou a pior pessoa pra dar esse conselho.",
    "O canhão precisa de luz, movimento, personalidade. E funcionar. O Zé pediu pra eu colocar essa parte primeiro.",
    "Falei pra equipe descansar. Depois fiquei ensaiando sozinho. Liderar pelo exemplo ainda está nos meus planos.",
    "Tem gente esperando eu voltar ao palco. Eu penso nisso quando parece que não vou aguentar outra noite.",
    "Você continua dizendo que não leva jeito. Eu também dizia, antes do primeiro show. O medo não decide a entrada.",
    "Quando isso acabar, sobe comigo no palco. Você já enfrentou coisa pior que uma plateia."
  ],
  "ru": [
    "Força, resistência, dança, ginástica. Não, não eram categorias da mesma competição. Eu tinha fins de semana ocupados.",
    "Você treme antes de atirar. Não desperdice energia tentando esconder. Respire e mire.",
    "Também já perdi. Voltei no dia seguinte. A medalha não faz esse trajeto por você.",
    "Zé Maria ergue um motor e diz que foi um dia parado. Vocês desperdiçam excelentes levantadores de peso.",
    "Não empresto estas medalhas. Já tentei usar menos. Fiquei com a sensação de ter esquecido a roupa.",
    "Minha melhor série de ginástica foi em silêncio. A música falhou. A série, não.",
    "O futebol de vocês é extraordinário. Estou tentando decidir qual jogador levaria primeiro. Para um treino, claro.",
    "Você ainda erra. Só que agora percebe antes de eu precisar falar. Isso é progresso.",
    "Você não é o mais forte nem o mais rápido. Mas volta toda noite. Isso eu respeito.",
    "Se eu pudesse escolher meu último adversário, escolheria alguém que não desiste. Continue assim."
  ],
  "cn": [
    "Minha primeira loja era uma banca. Se chovesse, eu mudava o estoque de lugar com os dois braços. Hoje eu mando um navio.",
    "O panda recolhe o que iam jogar em você. Desperdício me dá mais medo que nave grande.",
    "Mandei comida pra oficina. Presente? Não. Investimento na manutenção da equipe. Come antes que esfrie.",
    "Zé Maria olha uma peça torta e vê solução. Eu olho e vejo cinco aplicações. Precisamos conversar sobre a oficina dele.",
    "Não tenho calculadora pra tudo. Pra saber quando alguém precisa de ajuda, eu ainda olho pra pessoa.",
    "Você ficaria ótimo no anúncio. Pode manter essa cara de cansado. Passa confiança no teste de resistência.",
    "Desconto não é prejuízo se o cliente volta. Mas vocês podiam voltar com menos buraco na roupa.",
    "Guarda aquela sucata. A vitória já custou caro; não precisa jogar o troco fora.",
    "Eu gosto daqui. Do café, do Zé, de vocês. É péssimo negociar quando a gente começa a gostar da mesa.",
    "Se depender de mim, ninguém aqui fica sem trabalho depois da guerra. Tenho planos grandes para este lugar."
  ]
});
export function representativeStoryFor(country, wave=1){
  const stories=REPRESENTATIVE_STORIES[country];
  if(!stories)return representativeLine(country);
  const index=Math.max(0,Math.min(stories.length-1,Math.trunc(Number(wave)||1)-1));
  return stories[index];
}
