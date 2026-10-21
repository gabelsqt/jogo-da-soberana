// Operação Soberania — abertura por e-mails, plantão e apresentação do Zeca.
// Antes da onda 10, invasores não falam nem explicam suas intenções.
export const INTRO_CHAR_DELAY_MS=32;
export const INTRO_PAGE_MS=1900; // pausa de leitura após digitação
export const INTRO_NEWS_HOLD_MS=5200; // tempo para ler a sequência visual da notícia
export const INTRO_FOOTNOTE_DELAY_MS=850;

export function introductionSlides(){
  return [
    {
      kind:'email',id:'convocation',
      from:'JUSTIÇA ELEITORAL',subject:'Convocação para serviço eleitoral',
      body:'Parabéns!\n\nVocê foi escolhido(a) para atuar como MESÁRIO* nas próximas eleições.\n\nAguarde novas instruções.',
    },
    {
      kind:'news',id:'invasion',tag:'PLANTÃO EXTRAORDINÁRIO',
      headline:'INVASÃO ALIENÍGENA CONFIRMADA NO RIO DE JANEIRO',
      body:'Naves desconhecidas aparecem sobre a cidade. O espaço aéreo foi fechado.',
      art:'invasion',
    },
    {
      kind:'news',id:'elections',tag:'ÚLTIMA HORA',
      headline:'ELEIÇÕES SÃO CANCELADAS EM TODO O PAÍS',
      body:'A decisão ocorre em meio à invasão extraterrestre. A convocação dos mesários permanece em vigor.',
      art:'elections',
    },
    {
      kind:'email',id:'promotion',
      from:'JUSTIÇA ELEITORAL',subject:'URGENTE — ATUALIZAÇÃO DA CONVOCAÇÃO',
      body:'Em razão da invasão alienígena, as eleições foram canceladas.\n\nSua convocação permanece válida. Você foi promovido(a), com efeito imediato, a:',
      promotion:'GENERAL DE GUERRA',
      footnote:'*Em situações excepcionais, a convocação para mesário poderá ser convertida em qualquer função de interesse nacional, inclusive de natureza militar, sem necessidade de consentimento.',
      status:'ACEITE REGISTRADO AUTOMATICAMENTE',
    },
    {
      kind:'zeca',id:'zeca-1',tag:'PRIMEIRO CONTATO • EQUIPE DE MANUTENÇÃO',
      headline:'ZECA CARRARA',
      body:'Opa! Você que é o general? Rapaz, me falaram que até ontem você era mesário!',
    },
    {
      kind:'zeca',id:'zeca-2',tag:'PRIMEIRO CONTATO • EQUIPE DE MANUTENÇÃO',
      headline:'ZECA CARRARA',
      body:'Eu sou o Zeca. Mexia com ônibus. Aí acharam que mecânico de obuseiro era a mesma coisa e me jogaram aqui.',
    },
    {
      kind:'zeca',id:'zeca-3',tag:'PRIMEIRO CONTATO • EQUIPE DE MANUTENÇÃO',
      headline:'ZECA CARRARA',
      body:'Ó, de nave alienígena eu não entendo nada. Mas esse obuseiro — o canhão aí — tá funcionando. Já é um começo, né?',
    },
  ];
}
