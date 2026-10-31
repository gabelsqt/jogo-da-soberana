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
      from:'JUSTIÇA ELEITORAL',subject:'Convocação — comparecimento obrigatório',
      body:'Você foi convocado(a) para atuar como MESÁRIO*.\n\nSua presença é obrigatória. Seu entusiasmo é facultativo.\n\nAguarde novas instruções.',
    },
    {
      kind:'news',id:'invasion',tag:'PLANTÃO EXTRAORDINÁRIO',
      headline:'LUZES ESTRANHAS NO RIO; GOVERNO PEDE CALMA',
      body:'Objetos surgem perto do Cristo e há explosões na Baía. A origem é desconhecida. O governo pede calma. Nossa equipe pergunta onde ela está disponível.',
      art:'invasion',
    },
    {
      kind:'news',id:'carnaval',tag:'URGENTE • SAPUCAÍ',
      headline:'EXPLOSÕES INTERROMPEM DESFILE NA SAPUCAÍ',
      body:'A transmissão cai durante o desfile. Na volta, olhos piscam no meio da fuligem. A bateria tenta entender se aquilo vale desconto em evolução.',
      art:'invasion',
    },
    {
      kind:'news',id:'elections',tag:'ÚLTIMA HORA',
      headline:'ELEIÇÕES SÃO CANCELADAS EM TODO O PAÍS',
      body:'Com as defesas militares fora de ação, mesários vão operar canhões antiaéreos. Segundo o governo, a experiência com filas será útil contra formações inimigas.',
      art:'elections',
    },
    {
      kind:'email',id:'promotion',
      from:'JUSTIÇA ELEITORAL',subject:'URGENTE — ATUALIZAÇÃO DA CONVOCAÇÃO',
      body:'As eleições foram canceladas. Sua convocação, não.\n\nPor necessidade do serviço, você foi promovido(a) a:',
      promotion:'GENERAL DE GUERRA',
      footnote:'*Em emergências, mesários poderão ser realocados para a defesa nacional. A ausência de treinamento não dispensa o comparecimento.',
      status:'ACEITE AUTOMÁTICO • NÃO RESPONDA A ESTE E-MAIL',
    },
  ];
}

