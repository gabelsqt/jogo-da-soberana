// Operação Soberania — abertura por e-mails, plantão e apresentação do Zeca.
// Antes da onda 10, invasores não falam nem explicam suas intenções.
export const INTRO_CHAR_DELAY_MS=32;
export const INTRO_PAGE_MS=1900; // pausa de leitura após digitação
export const INTRO_NEWS_HOLD_MS=2700;
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
    },
    {
      kind:'news',id:'elections',tag:'ÚLTIMA HORA',
      headline:'ELEIÇÕES SÃO CANCELADAS EM TODO O PAÍS',
      body:'A decisão ocorre em meio à invasão extraterrestre. A convocação dos mesários permanece em vigor.',
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
      kind:'zeca',id:'zeca',tag:'PRIMEIRO CONTATO • EQUIPE DE MANUTENÇÃO',
      headline:'ZECA CARRARA',
      body:'Ô, general! Você que era mesário? Eu sou o Zeca Carrara, mecânico de carros. Me colocaram pra cuidar desse obuseiro.\n\nObuseiro é esse canhão aqui, viu? Eu também tive que perguntar.\n\nDe motor eu entendo. De invasão alienígena, a gente vai aprender junto.',
    },
  ];
}
