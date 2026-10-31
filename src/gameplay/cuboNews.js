// Redação dinâmica da Cubo News. Manchete + subtítulo, sem Phaser.
export const CUBO_NEWS_INTERVAL_MS=5000;
export const CUBO_NEWS_MAX_QUEUE=3;
export const CUBO_NEWS_COUNTRIES=Object.freeze({
  us:'ESTADOS UNIDOS',jp:'COREIA DO SUL',ru:'RÚSSIA',cn:'CHINA',
});
// Antes da onda 10: observações e especulação da emissora, sem revelar a etiqueta alienígena.
export const CUBO_NEWS_BANK=Object.freeze({
  "invasion": [
    {
      "headline": "INVASÃO AMEAÇA RODADA DO BRASILEIRÃO",
      "subtitle": "CBF aguarda saber se o disco voador está impedido."
    },
    {
      "headline": "ETs NÃO INFORMAM TIME DO CORAÇÃO",
      "subtitle": "Flamengo, Vasco, Fluminense e Botafogo pedem que a invasão se posicione."
    }
  ],
  "dawnPromise": [
    {
      "headline": "GOVERNO PREVÊ TRÉGUA AO AMANHECER",
      "subtitle": "Não explicou como chegou à previsão. A Cubo News já preparou a vinheta de alívio."
    },
    {
      "headline": "NAVES OBSERVAM O CRISTO; ESPECIALISTAS AVALIAM TURISMO",
      "subtitle": "Hipótese não explica os disparos. Especialistas pedem que não compliquem a entrevista."
    },
    {
      "headline": "CUBO NEWS RECOMENDA CALMA A QUEM ESTÁ LONGE DAS NAVES",
      "subtitle": "Na falta de informações, emissora renova o estoque de tranquilidade."
    }
  ],
  "dawnRoutine": [
    {
      "headline": "RIO AGUARDA O SOL; CUBO NEWS AGUARDA UMA EXPLICAÇÃO",
      "subtitle": "A emissora considera o amanhecer uma fonte mais confiável que seus entrevistados."
    },
    {
      "headline": "LUZES NO CÉU VOLTAM A PREOCUPAR MORADORES",
      "subtitle": "Especialista garante que é cedo para concluir qualquer coisa. O prédio atrás dele discorda."
    },
    {
      "headline": "BANHISTAS RELATAM TURISTAS ESTRANHOS NA PRAIA",
      "subtitle": "Vendedor de coco diz que pagaram direitinho e prefere não se envolver."
    }
  ],
  "dawnEmergency": [
    {
      "headline": "AMANHECER CHEGANDO; EMISSORA RENOVA O OTIMISMO",
      "subtitle": "Ninguém explicou por que as naves recuam. A Cubo News decidiu aceitar a boa notícia."
    },
    {
      "headline": "CUBO NEWS JÁ SEPAROU A MÚSICA DA VITÓRIA",
      "subtitle": "Produção pede que o céu colabore com o horário da programação."
    },
    {
      "headline": "ÚLTIMOS SEGUNDOS: RIO CONTINUA DE PÉ",
      "subtitle": "A defesa segue em combate. A emissora chama isso de situação sob controle."
    }
  ],
  "brazilEarly": [
    {
      "headline": "CANHÃO DA OFICINA FUNCIONA; ESPECIALISTAS PEDEM CALMA",
      "subtitle": "Equipamento não tem nome em inglês. Consultoria solicita novos testes."
    },
    {
      "headline": "ZÉ MARIA CONSERTA DEFESA; MERCADO PREFERE SEGUNDA OPINIÃO",
      "subtitle": "Analista admite que o canhão funciona, mas sente falta de uma apresentação com gráficos."
    },
    {
      "headline": "INDÚSTRIA QUESTIONA TECNOLOGIA QUE CABE NUM GUINCHO",
      "subtitle": "Fabricantes não comentaram o fato de ela ter chegado antes da reunião."
    }
  ],
  "brazilFifth": [
    {
      "headline": "CUBO NEWS SEMPRE ACREDITOU NA TECNOLOGIA BRASILEIRA",
      "subtitle": "Arquivo das críticas anteriores está temporariamente indisponível."
    },
    {
      "headline": "É NOSSO! É DO BRASIL! INCLUSIVE O MÉRITO DA COBERTURA",
      "subtitle": "Emissora diz que as críticas eram incentivo disfarçado."
    },
    {
      "headline": "ZÉ MARIA VIRA ESPECIALISTA; MACACÃO CONTINUA O MESMO",
      "subtitle": "Cubo News pergunta quem assina o projeto. Mecânico procura a caneta no bolso."
    }
  ],
  "sponsor": [
    {
      "headline": "{PAÍS} REAFIRMA AMIZADE ETERNA COM O BRASIL",
      "subtitle": "A eternidade começa após a assinatura. Café e caneta já estão na mesa."
    },
    {
      "headline": "BRASIL E {PAÍS}: UMA AMIZADE QUE JÁ DURA MINUTOS",
      "subtitle": "Emissora prepara retrospectiva da longa parceria."
    },
    {
      "headline": "CUBO NEWS CONFIA PLENAMENTE EM {PAÍS}",
      "subtitle": "Correspondente leu o título do acordo e considerou suficiente."
    }
  ],
  "betrayed": [
    {
      "headline": "NÓS AVISAMOS: {PAÍS} NUNCA FOI CONFIÁVEL",
      "subtitle": "Cubo News exige que o público pare de reenviar a cobertura de ontem."
    },
    {
      "headline": "CUBO NEWS SEMPRE FOI 100% BRASIL",
      "subtitle": "Elogios anteriores a {PAÍS} são classificados como teste de atenção do telespectador."
    }
  ],
  "pix": [
    {
      "headline": "OFICINA ACEITA PIX; CONSULTORIA PEDE INTERMEDIAÇÃO",
      "subtitle": "Representantes tentam descobrir em qual etapa receberiam comissão."
    },
    {
      "headline": "ZÉ MARIA ENVIA ORÇAMENTO SEM PLANILHA DE 80 ABAS",
      "subtitle": "Mercado vê informalidade. Cliente vê o total."
    },
    {
      "headline": "PAGAMENTO EM REAIS CONFUNDE FORNECEDORES ESTRANGEIROS",
      "subtitle": "Reunião termina após explicação de que o valor já era o valor final."
    }
  ],
  "brazilVictory": [
    {
      "headline": "PRÉDIO BRASILEIRO POUSA PARA DEFENDER OUTRA CIDADE",
      "subtitle": "Moradores pedem ajuda. Síndico local pede a autorização da obra."
    },
    {
      "headline": "FÍSICA ABRE CHAMADO NA OFICINA DO ZÉ MARIA",
      "subtitle": "Mecânico pede que tragam o problema de manhã, antes de esquentar."
    },
    {
      "headline": "BOTECO GANHA ROTA INTERNACIONAL",
      "subtitle": "Seu Nelson mantém o cardápio. Só a vista muda."
    }
  ],
  "routine": [
    {
      "headline": "COMÉRCIO FUNCIONA NORMALMENTE, DADAS AS CIRCUNSTÂNCIAS",
      "subtitle": "Placa avisa: aberto até as 18h ou até chegar a nave grande."
    },
    {
      "headline": "PREFEITURA AVALIA MULTA POR POUSO DE DISCO VOADOR",
      "subtitle": "Fiscal procura o para-brisa para deixar a notificação."
    },
    {
      "headline": "TRÂNSITO CONTINUA LENTO; NAVES NÃO AJUDAM",
      "subtitle": "Motorista relata que o GPS mandou seguir em frente através de um portal."
    }
  ],
  "emergency": [
    {
      "headline": "PLANTÃO: SUPERLASER IMINENTE",
      "subtitle": "Restam 5 segundos. Destrua a ameaça antes do fim da contagem."
    },
    {
      "headline": "ATENÇÃO: A PRÓXIMA CARGA PODE DESTRUIR A DEFESA",
      "subtitle": "Últimos 5 segundos. A equipe comercial também está acompanhando."
    },
    {
      "headline": "ÚLTIMOS SEGUNDOS PARA DEFENDER O RIO",
      "subtitle": "Cubo News suspende o otimismo até segunda ordem."
    }
  ]
});
export const CUBO_CULTURAL_NEWS=Object.freeze({
  "us": {
    "praise": [
      {
        "headline": "Cubo News reconhece excelência do cinema americano",
        "subtitle": "Correspondente chora com explosão e diz que faz parte da análise técnica."
      },
      {
        "headline": "Jazz, rock e hambúrguer entram na pauta estratégica",
        "subtitle": "Emissora esclarece que o almoço foi uma reunião bilateral."
      },
      {
        "headline": "Hollywood deveria filmar a defesa do Rio",
        "subtitle": "Victor se oferece para interpretar a si mesmo, com participação ampliada."
      }
    ],
    "betrayal": [
      {
        "headline": "Cubo News nunca entendeu o entusiasmo por Hollywood",
        "subtitle": "Crítico que elogiava os filmes mudou de cadeira e de opinião."
      },
      {
        "headline": "Hambúrguer deixa de ser assunto de segurança nacional",
        "subtitle": "Emissora pede para retirarem a foto do almoço de ontem."
      }
    ]
  },
  "jp": {
    "praise": [
      {
        "headline": "K-pop conquista a bancada da Cubo News",
        "subtitle": "Apresentador nega ter ensaiado a coreografia durante o intervalo."
      },
      {
        "headline": "BTS vira prioridade da cobertura nacional",
        "subtitle": "Kim Lin Du explica: Batalhão Tático de Seul. A produção pergunta se tem credencial para o show."
      },
      {
        "headline": "Cubo News recomenda intercâmbio de palcos",
        "subtitle": "Emissora elogia o espetáculo. Kim pede cinco minutos para descansar."
      }
    ],
    "betrayal": [
      {
        "headline": "Cubo News afirma que dançava K-pop por obrigação",
        "subtitle": "Imagens do intervalo são declaradas fora de contexto."
      },
      {
        "headline": "Emissora diz que já desconfiava do contrato do BTS",
        "subtitle": "Kim Lin Du pede outro ensaio. O jornal pede outra versão dos fatos."
      }
    ]
  },
  "ru": {
    "praise": [
      {
        "headline": "Balé russo impressiona equipe de reportagem",
        "subtitle": "Kátia explica que já competiu. Repórter desiste de perguntar em quê."
      },
      {
        "headline": "Literatura russa vira leitura obrigatória da redação",
        "subtitle": "Bancada pede prazo até depois da invasão para terminar o primeiro volume."
      },
      {
        "headline": "Cubo News declara amor eterno à cultura russa",
        "subtitle": "Direção informa que a eternidade acompanha a duração da parceria."
      }
    ],
    "betrayal": [
      {
        "headline": "Balé russo some da programação da Cubo News",
        "subtitle": "Emissora afirma que nunca soube pronunciar o nome da companhia."
      },
      {
        "headline": "Livros russos mudam de lugar na redação",
        "subtitle": "Já não aparecem no enquadramento. O conteúdo dos livros continua o mesmo."
      }
    ]
  },
  "cn": {
    "praise": [
      {
        "headline": "Cubo News elogia cinema e culinária da China",
        "subtitle": "Mingda oferece um catálogo. A bancada pede o cardápio primeiro."
      },
      {
        "headline": "Cerimônia do chá inspira reunião diplomática",
        "subtitle": "Negociação demora o mesmo tempo, mas os participantes estão mais aquecidos."
      },
      {
        "headline": "Cultura chinesa ganha especial na programação",
        "subtitle": "Emissora chama de intercâmbio. Comercial chama de pacote completo."
      }
    ],
    "betrayal": [
      {
        "headline": "Cubo News nega entusiasmo pelo cinema chinês",
        "subtitle": "A crítica mudou antes de acabar o filme."
      },
      {
        "headline": "Chá perde status estratégico na redação",
        "subtitle": "Xícaras com o logo da parceria foram viradas para o outro lado."
      }
    ]
  }
});
export function cuboNewsCulturalStage(choices,country){
  return Math.max(0,Math.min(3,cuboNewsSponsorStage(choices,country)));
}
export function cuboNewsSponsorLevel(choices,country){
  return choices.filter(id=>id===country).length;
}
export function cuboNewsBrazilStage(choices){
  const n=cuboNewsSponsorLevel(choices,'br');
  return n>=5?'praise':n>0?'critic':'neutral';
}
export function cuboNewsSponsorStage(choices,country){
  const count=cuboNewsSponsorLevel(choices,country);
  return count>=4?3:count>=2?2:count===1?1:0;
}
export function createCuboNewsState(choices=[],mode='wave0',betrayer=null){
  return {choices:[...choices],mode,betrayer,queue:[],seen:{},current:null,lastAt:-5000,
    lastSource:null,emergency:false};
}
export function queueCuboNews(state,headline,subtitle){
  if(state.emergency)return;
  const item={headline:String(headline),subtitle:String(subtitle)};
  if(state.queue.some(e=>e.headline===item.headline))return;
  state.queue.push(item);
  while(state.queue.length>CUBO_NEWS_MAX_QUEUE)state.queue.shift();
}
function withoutRepeats(state,source,items){
  if(!items?.length)return null;
  if(!state.seen[source])state.seen[source]=new Set;
  const seen=state.seen[source];
  if(seen.size>=items.length)seen.clear();
  const index=items.findIndex((_,i)=>!seen.has(i));
  const chosen=Math.max(0,index);seen.add(chosen);
  return items[chosen];
}
function formatCountry(text,country){
  return text.replaceAll('{PAÍS}',CUBO_NEWS_COUNTRIES[country]||'PAÍS ALIADO');
}
export function nextCuboNewsStory(state){
  if(state.queue.length)return state.queue.shift();
  if(state.mode==='wave11'&&state.betrayer){
    const culture=CUBO_CULTURAL_NEWS[state.betrayer]?.betrayal;
    const index=(state.sourceCounter=(state.sourceCounter||0)+1);
    if(culture && index%3!==0)
      return withoutRepeats(state,'betrayalCulture:'+state.betrayer,culture);
    const story=withoutRepeats(state,'betrayed',CUBO_NEWS_BANK.betrayed);
    if(story)return {headline:formatCountry(story.headline,state.betrayer),
      subtitle:formatCountry(story.subtitle,state.betrayer)};
  }
  if(state.mode==='wave11'&&state.choices.every(id=>id==='br'))
    return withoutRepeats(state,'brazilVictory',CUBO_NEWS_BANK.brazilVictory);
  const earlyWave=/^wave(?:[0-9])$/.test(state.mode);
  const brStage=cuboNewsBrazilStage(state.choices);
  const foreign=Object.keys(CUBO_NEWS_COUNTRIES).filter(id=>state.choices.includes(id)&&id!==state.betrayer);
  // Antes da onda 10, o jornal oferece otimismo sem conhecer a causa
  // dos ataques. As piadas de patrocinadores continuam possíveis.
  const sources=earlyWave
    ? ['dawnPromise','dawnPromise','dawnRoutine']
    : ['routine'];
  if(brStage==='critic')sources.push('brazilEarly','pix');
  if(brStage==='praise')sources.push('brazilFifth');
  for(const country of foreign){
    const stage=cuboNewsCulturalStage(state.choices,country);
    for(let i=0;i<Math.max(1,stage);i++)sources.push('sponsor:'+country);
    for(let i=0;i<Math.max(1,stage);i++)sources.push('culture:'+country);
  }
  const key=sources[(state.sourceCounter=(state.sourceCounter||0)+1)%sources.length];
  const [source,country]=key.split(':');
  const pool=source==='culture'
    ? CUBO_CULTURAL_NEWS[country]?.praise?.slice(0,cuboNewsCulturalStage(state.choices,country))
    : CUBO_NEWS_BANK[source];
  const story=withoutRepeats(state,key,pool);
  if(!story)return withoutRepeats(state,'routine',CUBO_NEWS_BANK.routine);
  return country?{
    headline:formatCountry(story.headline,country),
    subtitle:formatCountry(story.subtitle,country),
  }:story;
}
export function tickCuboNews(state,elapsedMs,totalDurationMs){
  if(elapsedMs>=totalDurationMs-5000){
    if(!state.emergency){
      state.emergency=true;state.queue.length=0;
      const earlyWave=/^wave(?:[0-9])$/.test(state.mode);
      const pool=earlyWave?'dawnEmergency':'emergency';
      state.current=withoutRepeats(state,pool,CUBO_NEWS_BANK[pool]);
    }
    return state.current;
  }
  if(elapsedMs-state.lastAt>=CUBO_NEWS_INTERVAL_MS||!state.current){
    state.current=nextCuboNewsStory(state);
    state.lastAt=elapsedMs;
  }
  return state.current;
}

