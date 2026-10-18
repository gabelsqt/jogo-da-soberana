// Onda 11 e finais: regras puras para teste isolado.
// A presença de ajuda estrangeira leva à tentativa de colonização na última onda.
// Empate de investimento: vence o primeiro país estrangeiro escolhido no histórico.
export const FINALE_COUNTRIES = Object.freeze({
  br: {name:'BRASIL', label:'ÚLTIMA OFENSIVA ALIENÍGENA', color:0x55d99d},
  us: {name:'ESTADOS UNIDOS', label:'OPERAÇÃO AQUISIÇÃO HOSTIL', color:0xffaa67},
  ru: {name:'RÚSSIA', label:'PROTOCOLO DE ANEXAÇÃO', color:0xff707a},
  cn: {name:'CHINA', label:'ENTREGA COM COBRANÇA', color:0xffd66a},
  jp: {name:'COREIA DO SUL', label:'CONTRATO DE TURNÊ ETERNA', color:0xdca0ff},
});

export function resolveFinalOpponent(state = {}) {
  const choices = Array.isArray(state?.choices) ? state.choices.slice(0,10) : [];
  const counts = {us:0,ru:0,cn:0,jp:0};
  for(const id of choices) if(Object.hasOwn(counts,id))counts[id]++;
  let country='br', highest=0;
  for(const id of choices) {
    if(!Object.hasOwn(counts,id))continue;
    if(counts[id]>highest) {country=id;highest=counts[id];}
  }
  return {country,fullBrazil:country==='br',countryName:FINALE_COUNTRIES[country].name,
    foreignUpgrades:highest,counts};
}

export function finalePrelude(state = {}) {
  const {country,fullBrazil}=resolveFinalOpponent(state);
  if(fullBrazil)return {
    title:'ONDA 11 — SOBERANIA TOTAL',
    lines:[
      'A FORTALEZA-MÃE CAIU. MAS OS INVASORES AINDA TÊM UMA ÚLTIMA FROTA.',
      'O BRASIL NÃO ASSINOU NENHUM ACORDO EXTERNO.',
      'AGORA É TUDO OU NADA. O CÉU SERÁ NOSSO.',
    ],
  };
  const messages={
    us:'O APOIO MILITAR VEIO COM UMA CLÁUSULA: O BRASIL VIRA UMA FRANQUIA.',
    ru:'O ACORDO DE SEGURANÇA FOI REINTERPRETADO COMO POSSE TERRITORIAL.',
    cn:'A NOTA DA ENTREGA CHEGOU. O FRETE ERA GRÁTIS; O PAÍS, NÃO.',
    jp:'A PARCERIA MUSICAL AGORA EXIGE EXCLUSIVIDADE SOBRE O BRASIL INTEIRO.',
  };
  return {
    title:'ONDA 11 — A TRAIÇÃO',
    lines:[
      'A INVASÃO ALIENÍGENA FOI CONTIDA.',
      messages[country],
      `ENFRENTE ${FINALE_COUNTRIES[country].name.toUpperCase()} E DEFENDA A SOBERANIA.`,
    ],
  };
}

// Storyboards provisórios, escritos especificamente para os dez resultados.
// Os fundos e os quadros são placeholders substituíveis por pixel art depois.
const ENDINGS = {
  br:{
    win:{
      title:'SOBERANIA ABSOLUTA',
      subtitle:'FINAL FULL BRAZIL — VITÓRIA',
      slides:[
        ['ÚLTIMO CONTATO','Sem apoio externo, o Brasil derruba a derradeira nave invasora. Até os radares demoram a acreditar.'],
        ['SILÊNCIO NO CÉU','O Rio começa a comemorar. O canhão continua quente, mas pela primeira vez não há nada para atirar.'],
        ['NENHUMA DÍVIDA','Não há contratos secretos, bases militares emprestadas nem boletos internacionais esperando assinatura.'],
        ['BRASIL SOBERANO','A humanidade venceu por aqui. A gambiarra virou política de defesa nacional. E funcionou.'],
      ],
    },
    lose:{
      title:'A ÚLTIMA NOITE',
      subtitle:'FINAL FULL BRAZIL — DERROTA',
      slides:[
        ['SEM REFORÇOS','O Brasil enfrentou a invasão sem pedir favores. A última frota, porém, era maior do que as reservas.'],
        ['A QUEDA','As defesas cedem, o canhão se cala e o céu do Rio é tomado por um brilho extraterrestre.'],
        ['RESISTÊNCIA','Os invasores controlam a cidade, mas não conseguem explicar por que alguém ainda insiste em consertar rádios.'],
        ['AINDA NÃO ACABOU','A soberania foi perdida nesta batalha. Nas ruas, a resistência já planeja o próximo improviso.'],
      ],
    },
  },
  us:{
    win:{
      title:'LIBERDADE, SEM A MARCA REGISTRADA',
      subtitle:'BRASIL DERROTA OS ESTADOS UNIDOS',
      slides:[
        ['ÚLTIMA CLÁUSULA','Os bombardeiros americanos retornam: a conta da ajuda seria paga em território brasileiro.'],
        ['CONTRAPROPOSTA','O canhão aponta para o céu. O Brasil recusa a assinatura — e derruba a frota de cobrança.'],
        ['COLETIVA DE IMPRENSA','Um porta-voz anuncia que tudo foi um mal-entendido logístico de alguns bilhões de dólares.'],
        ['INDEPENDÊNCIA SEM LICENÇA','O Brasil continua dono do próprio destino. A palavra “liberdade” volta a ser de domínio público.'],
      ],
    },
    lose:{
      title:'BRASIL PRIME™',
      subtitle:'BRASIL COLONIZADO PELOS ESTADOS UNIDOS',
      slides:[
        ['AQUISIÇÃO APROVADA','A ajuda militar vira contrato compulsório: o Brasil agora pertence a uma holding internacional.'],
        ['NOVO MAPA','O Rio recebe uma base colossal e um outdoor: “SOVEREIGNTY — NOW WITH ADS”.'],
        ['PACOTE PREMIUM','Praias, florestas e até o ar-condicionado do canhão passam a cobrar assinatura mensal.'],
        ['DEMOCRACIA ENTREGUE™','Os invasores alienígenas foram embora. A nova administração promete revisar a liberdade no próximo trimestre.'],
      ],
    },
  },
  ru:{
    win:{
      title:'NEM UM PALMO DE GELO',
      subtitle:'BRASIL DERROTA A RÚSSIA',
      slides:[
        ['CLIMA DIPLOMÁTICO','A missão russa declara que sua proteção inclui anexar todo o território protegido.'],
        ['CONTRAOFENSIVA','O Brasil atravessa a tempestade e desmonta a última nave de ocupação.'],
        ['DEGELO','A cúpula soviética cai, o sol reaparece e os cariocas reclamam imediatamente do calor.'],
        ['FRONTEIRAS INTACTAS','O Brasil permanece independente. A única coisa congelada é a proposta de anexação.'],
      ],
    },
    lose:{
      title:'INVERNO EM COPACABANA',
      subtitle:'BRASIL COLONIZADO PELA RÚSSIA',
      slides:[
        ['REINTERPRETAÇÃO','A palavra “apoio” foi traduzida como “administração permanente”. O erro não será corrigido.'],
        ['CORTINA DE FERRO','Uma cúpula cobre o Rio e os satélites soviéticos passam a controlar o horizonte.'],
        ['NOVO CALENDÁRIO','O Réveillon é substituído pela Cerimônia Oficial do Primeiro Degelo.'],
        ['A COLÔNIA TROPICAL','O Brasil perde a soberania. Nem o inverno artificial consegue esfriar a vontade de resistência.'],
      ],
    },
  },
  cn:{
    win:{
      title:'PEDIDO DEVOLVIDO',
      subtitle:'BRASIL DERROTA A CHINA',
      slides:[
        ['FATURA FINAL','A nota fiscal revela o preço oculto da entrega: o território inteiro do Brasil.'],
        ['RECUSADO NA PORTARIA','O canhão interrompe a frota de cobrança antes que alguém confirme o recebimento.'],
        ['LOGÍSTICA REVERSA','Contêineres e drones retornam ao remetente. O rastreamento diz apenas: “DESTINATÁRIO SOBERANO”.'],
        ['FRETE DE VOLTA','O Brasil mantém o país, a praia e a senha do Wi-Fi. Nenhuma assinatura foi coletada.'],
      ],
    },
    lose:{
      title:'COLÔNIA COM FRETE GRÁTIS',
      subtitle:'BRASIL COLONIZADO PELA CHINA',
      slides:[
        ['PEDIDO ENTREGUE','A plataforma confirma a chegada da encomenda. O conteúdo: uma nova administração colonial.'],
        ['CENTRO DE DISTRIBUIÇÃO','O Rio vira um depósito gigante, com drones entregando avisos de mudança de soberania.'],
        ['AVALIAÇÃO DO PRODUTO','A população tenta solicitar devolução, mas o prazo de sete dias já expirou.'],
        ['ENTREGA DEFINITIVA','O Brasil perde o controle das próprias fronteiras. O aplicativo oferece um cupom de desculpas.'],
      ],
    },
  },
  jp:{
    win:{
      title:'ENCORE DA INDEPENDÊNCIA',
      subtitle:'BRASIL DERROTA A COREIA DO SUL',
      slides:[
        ['CONTRATO EXCLUSIVO','O acordo de ajuda se revela uma cláusula de exclusividade mundial sobre o Brasil.'],
        ['ÚLTIMA COREOGRAFIA','O canhão atravessa a chuva de lasers e derruba o palco voador de ocupação.'],
        ['SHOW CANCELADO','Kim Lin Doo pede desculpas aos fãs e declara que os brasileiros continuam donos de seus refrões.'],
        ['SOBERANIA AO VIVO','O Brasil segue independente. Os ingressos são reembolsados; a liberdade, não.'],
      ],
    },
    lose:{
      title:'BRASIL WORLD TOUR',
      subtitle:'BRASIL COLONIZADO PELA COREIA DO SUL',
      slides:[
        ['NOVO AGENCY','A parceria vira contrato vitalício: o Brasil inteiro foi contratado como integrante de um grupo.'],
        ['NOME DE PALCO','A bandeira recebe glitter e as cidades passam a ter metas de streaming.'],
        ['COREOGRAFIA OBRIGATÓRIA','Todo cidadão deve aprender o refrão oficial. O canhão foi convertido em máquina de luz.'],
        ['ÚLTIMO ENCORE','A soberania foi cancelada por baixa performance. A resistência prepara seu primeiro álbum independente.'],
      ],
    },
  },
};

export function finaleEnding(state = {}, won = false) {
  const {country,fullBrazil}=resolveFinalOpponent(state);
  const ending=ENDINGS[country][won?'win':'lose'];
  return {
    id:`${country}-${won?'win':'lose'}`,
    country,fullBrazil,won,
    color:FINALE_COUNTRIES[country].color,
    ...ending,
  };
}

export function allFinaleIds() {
  return Object.keys(ENDINGS).flatMap(id=>[`${id}-win`,`${id}-lose`]);
}
