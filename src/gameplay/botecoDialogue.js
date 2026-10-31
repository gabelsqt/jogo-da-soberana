// Revisão editorial de 31/10/2026. Uma conversa por visita, na ordem da campanha.
const BOTECO_DIALOGUE = {
  "0": [
    [
      "SEU NELSON",
      "Senta um pouco. O mundo ainda está aí."
    ],
    [
      "ZÉ MARIA",
      "Os quatro chegaram juntos. Pelo jeito, todo mundo sabia desse lugar. Menos nós."
    ],
    [
      "VICTOR MCDOLLAR",
      "Victor McDollar! Trouxe minha melhor equipe. Onde eu fico pra todo mundo me ver?"
    ],
    [
      "KÁTIA STRÓFIKA",
      "Kátia Strófika. Trouxe equipamento e disciplina. As medalhas são minhas."
    ],
    [
      "MINGDA MAI",
      "Mingda Mai. Tenho tecnologia, equipe e entrega rápida. O panda veio comigo."
    ],
    [
      "KIM LIN DU",
      "Kim Lin Du. General do BTS e líder de grupo. Posso mostrar a tecnologia sem pedir palco. Acho."
    ],
    [
      "ZÉ MARIA",
      "Eu reaproveitei o que sobrou e trouxe minhas peças. Olha as opções com calma; quem vai atirar é você."
    ],
    [
      "VOCÊ",
      "Obrigado. Só preciso de um minuto. Meu último e-mail ainda era sobre ser mesário."
    ],
    [
      "SEU NELSON",
      "Ajuda é boa. Só presta atenção no que pedem em troca."
    ],
    [
      "ZÉ MARIA",
      "Primeiro, escolhe o TIRO PRINCIPAL. Cada equipe instala o que trouxer. O brasileiro é comigo."
    ]
  ],
  "1": [
    [
      "VOCÊ",
      "Eu passei a noite inteira esperando acordar."
    ],
    [
      "SEU NELSON",
      "O café ajuda a perder essa esperança."
    ],
    [
      "ZÉ MARIA",
      "O principal já funciona. Agora escolhe o ESPECIAL. Pode ser de outro país."
    ],
    [
      "ZÉ MARIA",
      "No computador, botão direito. No celular, segura ESP e solta. Mais tempo segurando, mais longe."
    ]
  ],
  "2": [
    [
      "ZÉ MARIA",
      "Hoje ninguém pediu orçamento antes de confiar no meu serviço. É novo pra mim."
    ],
    [
      "MINGDA MAI",
      "Eu pedi. Você escreveu “depois a gente vê”. Péssimo orçamento. Excelente atendimento."
    ],
    [
      "ZÉ MARIA",
      "Agora escolhe uma melhoria: PRINCIPAL [P] ou ESPECIAL [S]."
    ],
    [
      "SEU NELSON",
      "Uma coisa de cada vez. Até o fim do mundo tem ordem."
    ]
  ],
  "3": [
    [
      "KIM LIN DU",
      "Zé, já pensou em trabalhar com palco?"
    ],
    [
      "ZÉ MARIA",
      "Se tiver tomada ruim, infelizmente já trabalhei."
    ],
    [
      "KIM LIN DU",
      "Eu estava pensando em você na frente."
    ],
    [
      "SEU NELSON",
      "Primeiro deixa o homem terminar o café."
    ]
  ],
  "4": [
    [
      "KÁTIA STRÓFIKA",
      "Quantos quilos tinha aquele motor?"
    ],
    [
      "ZÉ MARIA",
      "Com óleo ou sem?"
    ],
    [
      "KÁTIA STRÓFIKA",
      "Você tem potencial."
    ],
    [
      "SEU NELSON",
      "Pra carregar mesa também. Mas só depois do expediente."
    ]
  ],
  "5": [
    [
      "VICTOR MCDOLLAR",
      "Zé, meu melhor amigo! Já pensou numa oficina com meu nome?"
    ],
    [
      "ZÉ MARIA",
      "A minha já tem nome."
    ],
    [
      "VICTOR MCDOLLAR",
      "Excelente! Mantemos no endereço de cobrança."
    ],
    [
      "SEU NELSON",
      "Placa grande não conserta motor."
    ]
  ],
  "6": [
    [
      "MINGDA MAI",
      "Mandei comida pra equipe. Não é presente, é investimento."
    ],
    [
      "ZÉ MARIA",
      "E lembrou até de como eu gosto."
    ],
    [
      "MINGDA MAI",
      "Pesquisa de mercado. Come logo."
    ],
    [
      "SEU NELSON",
      "A pesquisa está esfriando."
    ]
  ],
  "7": [
    [
      "KIM LIN DU",
      "Falei pra todo mundo descansar."
    ],
    [
      "KÁTIA STRÓFIKA",
      "E você?"
    ],
    [
      "KIM LIN DU",
      "Estou ensaiando como dizer isso com mais convicção."
    ],
    [
      "SEU NELSON",
      "Pode ensaiar de olho fechado."
    ]
  ],
  "8": [
    [
      "SEU NELSON",
      "Nos anos oitenta, aquele rádio já dava trabalho."
    ],
    [
      "VOCÊ",
      "O senhor já usava esse rádio?"
    ],
    [
      "SEU NELSON",
      "Uso até hoje."
    ],
    [
      "ZÉ MARIA",
      "Ele faz isso. Responde certinho e a gente continua sem saber."
    ]
  ],
  "9": [
    [
      "ZÉ MARIA",
      "Eu vim buscar um canhão quebrado. Agora fico olhando o céu e pensando no que ainda dá pra consertar."
    ],
    [
      "VOCÊ",
      "Você já fez muita coisa, Zé."
    ],
    [
      "ZÉ MARIA",
      "Então vamos fazer mais uma. Escolhe a última melhoria."
    ],
    [
      "SEU NELSON",
      "Eu guardo a mesa."
    ]
  ]
};
export function botecoDialogue(completedWave=0){
  const wave=Math.max(0,Math.min(9,Math.trunc(Number(completedWave)||0)));
  return BOTECO_DIALOGUE[wave].map(line=>[...line]);
}
