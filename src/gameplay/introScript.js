// Operação Soberania — convocação e invasão; Zé Maria chega após a onda 0.5.
// Antes da onda 10, invasores não falam nem explicam suas intenções.
export const INTRO_CHAR_DELAY_MS=32;
export const INTRO_PAGE_MS=2900; // pausa de leitura após digitação nas demais páginas
export const INTRO_CONVOCATION_HOLD_MS=5500; // silêncio antes do primeiro plantão
export const INTRO_ZECA_HOLD_MS=3200; // uma fala por vez, sem pressa
export const INTRO_NEWS_HOLD_MS=5200; // tempo para ler a sequência visual da notícia
export const INTRO_FOOTNOTE_DELAY_MS=850;

// Relógio de leitura só começa depois da digitação. Cliques/toques continuam
// permitindo completar a fala e avançar sem esperar o contador automático.
export function introHoldForSlide(slide){
  if(slide?.id==='convocation')return INTRO_CONVOCATION_HOLD_MS;
  if(slide?.kind==='zeca')return INTRO_ZECA_HOLD_MS;
  return INTRO_PAGE_MS;
}

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
      body:'Naves saem da região do Cristo Redentor e atacam embarcações militares na Baía de Guanabara. Outros esquadrões avançam sobre a cidade.',
      art:'invasion',
    },
    {
      kind:'news',id:'carnaval',tag:'URGENTE • SAPUCAÍ',
      headline:'DESFILE É ATACADO POR NAVES ALIENÍGENAS',
      body:'Um desfile de Carnaval é atingido. Após a fumaça baixar, os integrantes aparecem cobertos de fuligem: apenas olhos brancos se abrem em silêncio.',
      art:'invasion',
    },
    {
      kind:'news',id:'elections',tag:'ÚLTIMA HORA',
      headline:'ELEIÇÕES SÃO CANCELADAS EM TODO O PAÍS',
      body:'As Forças Armadas foram destruídas. Os mesários convocados estão sendo alocados nas armas antiaéreas para defender as cidades.',
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
  ];
}
