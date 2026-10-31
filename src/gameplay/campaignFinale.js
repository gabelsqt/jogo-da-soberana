import { betrayalCoalition } from './wave11Rules.js';
// Onda 11 e finais: regras puras para teste isolado.
// A presença de ajuda estrangeira leva à tentativa de colonização na última onda.
// Empate de investimento: vence o primeiro país estrangeiro escolhido no histórico.
export const FINALE_COUNTRIES = Object.freeze({
  br: {name:'BRASIL', label:'ÚLTIMA OFENSIVA ALIENÍGENA', color:0x55d99d},
  us: {name:'ESTADOS UNIDOS', label:'OPERAÇÃO AQUISIÇÃO HOSTIL', color:0xffaa67},
  ru: {name:'RÚSSIA', label:'A PROVA FINAL', color:0xff707a},
  cn: {name:'CHINA', label:'ENTREGA COM COBRANÇA', color:0xffd66a},
  jp: {name:'COREIA DO SUL', label:'CONTRATO DE TURNÊ ETERNA', color:0xdca0ff},
});

export function resolveFinalOpponent(state = {}) {
  const choices = Array.isArray(state?.choices) ? state.choices.slice(0,10) : [];
  const counts = {us:0,ru:0,cn:0,jp:0};
  for(const id of choices)if(Object.hasOwn(counts,id))counts[id]++;
  const coalition=betrayalCoalition(choices,state.selectedBetrayer);
  const country=coalition[0]??'br';
  return {country,coalition,fullBrazil:coalition.length===0,
    countryName:FINALE_COUNTRIES[country].name,
    foreignUpgrades:counts[country]??0,counts};
}

export function finalePrelude(state = {}) {
  const {country,fullBrazil,coalition}=resolveFinalOpponent(state);
  if(fullBrazil)return {
    fullBrazil:true,
    title:'ONDA 11 — SOBERANIA TOTAL',
    lines:[
      'A Fortaleza-Mãe caiu. Em outras cidades, estátuas de braços abertos continuam sob ataque.',
      'ZÉ MARIA: “O prédio tem propulsor. Claro que tem. Eu devia ter perguntado antes de estacionar.”',
      'Proteja as cidades, uma por vez. SEU NELSON: “Segura o que estiver em cima da mesa.”',
    ],
  };
  const messages={
  "us": "VICTOR: “Quero você no meu governo! Os recursos do Brasil vão financiar a maior fortaleza americana da história.”",
  "ru": "KÁTIA: “Última prova. O controle do Brasil. Quero um país inteiro e seus melhores atletas, principalmente os do futebol. Dê tudo de si.”",
  "cn": "MINGDA: “Trouxe o contrato de aquisição do Brasil. Minérios, energia, fábricas... Você continua comigo. Só muda quem decide.”",
  "jp": "KIM: “Sobe ao palco comigo! Nós dois governamos o Brasil e financiamos a próxima geração dos nossos shows e máquinas.”"
};
  return {
    fullBrazil:false,
    title:'ONDA 11 — A TRAIÇÃO',
    lines:[
      'A Fortaleza-Mãe caiu. No rádio, o representante apresenta o preço da parceria.',
      messages[country],
      `Aceitar entrega o controle do Brasil a ${FINALE_COUNTRIES[country].name}. Resistir inicia o confronto.`,
    ],
  };
}

// Storyboards provisórios, escritos especificamente para os dez resultados.
// Os fundos e os quadros são placeholders substituíveis por pixel art depois.
const ENDINGS = {
  "br": {
    "win": {
      "title": "SOBERANIA ABSOLUTA",
      "subtitle": "FINAL FULL BRAZIL — VITÓRIA",
      "slides": [
        [
          "PRÓXIMA PARADA",
          "O prédio atravessa o céu com a oficina a bordo. Zé segura a caneca: “Da próxima vez eu ponho um porta-copo.”"
        ],
        [
          "BRAÇOS ABERTOS",
          "Em cada cidade, o canhão protege quem os invasores escolheram atacar. Ninguém precisa derrubar uma estátua para merecer ajuda."
        ],
        [
          "SERVIÇO FEITO",
          "Zé olha o equipamento em silêncio. “Eu sabia que dava pra consertar. Não sabia que dava pra fazer tudo isso.”"
        ],
        [
          "DE VOLTA À MESA",
          "O Brasil continua dono do próprio destino. No boteco, Seu Nelson põe o café na mesa: “Esfriou. Esquentei de novo.”"
        ]
      ]
    },
    "lose": {
      "title": "A ÚLTIMA NOITE",
      "subtitle": "FINAL FULL BRAZIL — DERROTA",
      "slides": [
        [
          "LONGE DE CASA",
          "O prédio levou a defesa brasileira a outras cidades. Em uma delas, o ataque foi mais forte do que o canhão conseguiu conter."
        ],
        [
          "SILÊNCIO NO RÁDIO",
          "Você chama Zé Maria. Por um instante, só vem estática. Então: “Tô aqui, chefe. Me dá um minuto.”"
        ],
        [
          "O QUE SOBROU",
          "A missão foi interrompida. Zé separa as ferramentas e examina as peças. Desta vez, ninguém exige que ele resolva tudo."
        ],
        [
          "AMANHÃ",
          "Há cidades ainda ameaçadas e trabalho demais pela frente. “Primeiro a gente volta pra casa”, diz Zé. “O resto a gente conversa.”"
        ]
      ]
    }
  },
  "us": {
    "win": {
      "title": "LIBERDADE, SEM A MARCA REGISTRADA",
      "subtitle": "BRASIL DERROTA OS ESTADOS UNIDOS",
      "slides": [
        [
          "PROPOSTA RECUSADA",
          "Você recusou o cargo no governo de Victor e a entrega do Brasil. Ele sorriu durante a proposta. O canhão respondeu à invasão."
        ],
        [
          "VITÓRIA MORAL™",
          "Com a frota destruída, Victor anuncia uma vitória moral extraordinária e exige uma cerimônia. A equipe procura um troféu."
        ],
        [
          "OFICINA SEM FRANQUIA",
          "Zé devolve o projeto da oficina McDollar: “A minha é pequena, mas a chave fica comigo.” Victor oferece uma fachada maior."
        ],
        [
          "NOME NA PORTA",
          "O Brasil segue independente. Seu Nelson tira o cartaz da parceria e deixa a marca do prego. “Depois eu tampo.”"
        ]
      ]
    },
    "lose": {
      "title": "BRASIL PRIME™",
      "subtitle": "BRASIL COLONIZADO PELOS ESTADOS UNIDOS",
      "slides": [
        [
          "OPORTUNIDADE HISTÓRICA",
          "A defesa cai. Victor anuncia a transformação do Brasil numa fortaleza americana, com exploração de seus recursos em letras pequenas."
        ],
        [
          "O MAIOR MURO",
          "O projeto deve cercar o país inteiro. Perguntam o que acontece com o mar. Victor mostra uma maquete ainda maior."
        ],
        [
          "REINAUGURAÇÃO",
          "A oficina recebe uma proposta com o nome McDollar no alto. Zé guarda a placa antiga antes que a equipe de marketing chegue."
        ],
        [
          "BRASIL PRIME™",
          "Victor chama a ocupação de parceria. No boteco, ninguém brinda. Seu Nelson recolhe os copos que sobraram."
        ]
      ]
    }
  },
  "ru": {
    "win": {
      "title": "MEDALHA DA INDEPENDÊNCIA",
      "subtitle": "BRASIL DERROTA A RÚSSIA",
      "slides": [
        [
          "A PROVA FINAL",
          "Kátia colocou o controle do Brasil em disputa. Você enfrentou sua frota e impediu que a cidade virasse parte de outro país."
        ],
        [
          "RESULTADO ACEITO",
          "Ela observa os destroços, tira uma medalha do pescoço e a entrega a você. “Você venceu. Não vou diminuir isso.”"
        ],
        [
          "UM A MENOS",
          "Zé olha a coleção de medalhas. “Não vai fazer falta?” Kátia endireita a postura. “Essa está no lugar certo.”"
        ],
        [
          "CADA UM EM CASA",
          "Os atletas brasileiros continuam brasileiros. No boteco, sua medalha ocupa uma mesa. Nelson avisa: “Só não risca o verniz.”"
        ]
      ]
    },
    "lose": {
      "title": "RECORDE DE OCUPAÇÃO",
      "subtitle": "BRASIL COLONIZADO PELA RÚSSIA",
      "slides": [
        [
          "RECORDE IMPOSSÍVEL",
          "A defesa cede. Kátia anuncia a conquista de um país inteiro como seu maior resultado. Para quem mora ali, não há pódio."
        ],
        [
          "CONVOCAÇÃO",
          "Os melhores atletas brasileiros, sobretudo os jogadores de futebol, entram nos planos da Rússia. Ninguém perguntou por qual seleção queriam jogar."
        ],
        [
          "CONVITE AO VENCEDOR",
          "Kátia oferece a Zé um lugar entre os vencedores. Ele olha as próprias mãos: “Meu serviço ainda é aqui.”"
        ],
        [
          "SEM APITO FINAL",
          "A ocupação começa. Kátia registra a marca. No boteco, Seu Nelson abaixa o rádio quando o anúncio se repete."
        ]
      ]
    }
  },
  "cn": {
    "win": {
      "title": "PEDIDO DEVOLVIDO",
      "subtitle": "BRASIL DERROTA A CHINA",
      "slides": [
        [
          "CONTRATO NA MESA",
          "Mingda chamou a aquisição do Brasil de formalidade. Você recusou. A frota enviada para negociar não conseguiu impor a assinatura."
        ],
        [
          "PREJUÍZO CONFIRMADO",
          "Ela pega a calculadora: “Vocês sabem quanto custava aquele equipamento?” Zé olha a fumaça: “Agora, ou antes?”"
        ],
        [
          "LOGÍSTICA REVERSA",
          "Os planos de fábricas e centros de distribuição voltam para a pasta. Mingda ainda oferece desconto para consertar os próprios drones."
        ],
        [
          "PEDIDO RECUSADO",
          "O Brasil conserva seus recursos e suas decisões. Seu Nelson fecha a pasta esquecida no balcão: “Sem assinatura, sem venda.”"
        ]
      ]
    },
    "lose": {
      "title": "COLÔNIA COM FRETE GRÁTIS",
      "subtitle": "BRASIL COLONIZADO PELA CHINA",
      "slides": [
        [
          "AQUISIÇÃO CONCLUÍDA",
          "A frota vence. Mingda anuncia o Brasil como nova plataforma de fabricação e distribuição de seu império comercial."
        ],
        [
          "TUDO EM CATÁLOGO",
          "Recursos minerais e energia entram no plano de produção de eletrônicos. A propaganda chama a ocupação de expansão de oportunidades."
        ],
        [
          "CONDIÇÕES ESPECIAIS",
          "Ela oferece cargos, equipamentos e descontos aos amigos. O carinho continua. O direito de decidir, não."
        ],
        [
          "FRETE GRÁTIS",
          "O primeiro lote de placas chega ao Rio. Seu Nelson vira uma delas para a parede: “Esse lado é menos feio.”"
        ]
      ]
    }
  },
  "jp": {
    "win": {
      "title": "ENCORE DA INDEPENDÊNCIA",
      "subtitle": "BRASIL DERROTA A COREIA DO SUL",
      "slides": [
        [
          "PALCO RECUSADO",
          "Kim convidou você a governar ao lado dele. A resposta foi defender o Brasil, em vez de entregá-lo ao próximo grande espetáculo."
        ],
        [
          "MAIS UMA VEZ",
          "A frota cai. Kim insiste, ainda sorrindo: “De novo. A coreografia saiu errada.” Ninguém reinicia a batalha."
        ],
        [
          "DIREÇÃO TÉCNICA",
          "Zé recusa o cargo de diretor dos palcos do império. “Primeiro eu termino o serviço daqui.” Kim anota outra tentativa de convite."
        ],
        [
          "SHOW INDEPENDENTE",
          "O Brasil continua livre. Você apoia as mãos na mesa e pede água. Seu Nelson serve sem exigir bis."
        ]
      ]
    },
    "lose": {
      "title": "BRASIL WORLD TOUR",
      "subtitle": "BRASIL COLONIZADO PELA COREIA DO SUL",
      "slides": [
        [
          "BRASIL WORLD TOUR",
          "A defesa cai sob luzes e lasers sincronizados. Kim anuncia a nova fase do espetáculo com o mesmo sorriso do primeiro encontro."
        ],
        [
          "BASTIDORES",
          "Recursos e minérios brasileiros passam a financiar máquinas, palcos e tecnologia para o império musical coreano. A plateia não escolheu participar."
        ],
        [
          "ESCALA DE TRABALHO",
          "Zé recebe o título de diretor técnico dos palcos. Kim continua ensaiando, incapaz de considerar o show pronto."
        ],
        [
          "FORA DO PALCO",
          "A ocupação ganha um refrão. No boteco, o rádio toca baixo. “Não precisa cantar”, diz Seu Nelson."
        ]
      ]
    }
  }
};

export function finaleEnding(state = {}, won = false) {
  const {country,fullBrazil,coalition}=resolveFinalOpponent(state);
  const ending=ENDINGS[country][won?'win':'lose'];
  const multi=false;
  const partners=coalition.map(id=>FINALE_COUNTRIES[id].name).join(' + ');
  const slides=ending.slides.map(([title,description])=>[title,description]);
  if(multi)slides[0]=[
    won?'COALIZÃO REPELIDA':'COALIZÃO VITORIOSA',
    won ? `Os antigos aliados (${partners}) tentaram tomar o Brasil juntos. O canhão conseguiu derrubar todos os comandantes.`
      : `Os antigos aliados (${partners}) uniram suas frotas para tomar o Brasil. A resistência não conseguiu impedir a ocupação.`,
  ];
  return {
    id:`${country}-${won?'win':'lose'}`,
    country,fullBrazil,coalition,won,
    color:FINALE_COUNTRIES[country].color,
    ...ending,
    subtitle:multi ? (won?'BRASIL DERROTA COALIZÃO':'BRASIL CAI DIANTE DA COALIZÃO')
      : ending.subtitle,
    slides,
  };
}

export function allFinaleIds() {
  return Object.keys(ENDINGS).flatMap(id=>[`${id}-win`,`${id}-lose`]);
}

