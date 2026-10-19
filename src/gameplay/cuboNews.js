// Redação dinâmica da Cubo News. Manchete + subtítulo, sem Phaser.
export const CUBO_NEWS_INTERVAL_MS=5000;
export const CUBO_NEWS_MAX_QUEUE=3;
export const CUBO_NEWS_COUNTRIES=Object.freeze({
  us:'ESTADOS UNIDOS',jp:'COREIA DO SUL',ru:'RÚSSIA',cn:'CHINA',
});
export const CUBO_NEWS_BANK=Object.freeze({
  // 142-C depende de uma versão mais engraçada, sem FIFA.
  invasion:[
    {headline:'INVASÃO ALIENÍGENA AMEAÇA RODADA DO BRASILEIRÃO',
      subtitle:'CBF consulta autoridades sobre manutenção do calendário diante da presença de naves extraterrestres.'},
    {headline:'ETs NÃO INFORMAM TIME DO CORAÇÃO; CBF COBRA RESPOSTA',
      subtitle:'Entidade busca esclarecer possíveis impactos da invasão sobre o futebol nacional.'},
  ],
  // Ondas 0–9: promessas dos ETs sempre consideradas confiáveis.
  // "Líder Supremo" é o Cristo Redentor, que nunca fecha os braços.
  dawnPromise:[
    {headline:'ETs PROMETEM PARTIR AO AMANHECER; CUBO NEWS TRANQUILIZA O BRASIL',
      subtitle:'Retirada depende apenas de o Líder Supremo cruzar os braços. O Cristo Redentor ainda não confirmou o gesto.'},
    {headline:'CRISTO SEGUE DE BRAÇOS ABERTOS; ALIENÍGENAS ESTENDEM ESTADIA',
      subtitle:'Acordo prevê fim dos ataques assim que o Líder Supremo cruzar os braços. Monumento permanece imóvel.'},
    {headline:'MAIS UMA NOITE DE ATAQUES? CUBO NEWS VÊ SINAL DE BOA VONTADE',
      subtitle:'Invasores reafirmam que sairão ao amanhecer, desde que o Cristo Redentor finalmente cruze os braços.'},
  ],
  dawnRoutine:[
    {headline:'RIO DORME TRANQUILO: ETs JURAM QUE PARTEM QUANDO O CRISTO QUISER',
      subtitle:'O compromisso extraterrestre segue em vigor; o Líder Supremo ainda não alterou a posição dos braços.'},
    {headline:'VASCO, FLAMENGO, FLUMINENSE E BOTAFOGO AGUARDAM FIM DO IMPASSE',
      subtitle:'CBF acompanha as promessas de retirada dos invasores e mantém o calendário carioca sob observação.'},
    {headline:'CUBO NEWS DESCARTA CRISE: FALTA APENAS UM ABRAÇO AO CONTRÁRIO',
      subtitle:'Especialistas consultados dizem que o Cristo Redentor não possui articulações para cruzar os braços.'},
  ],
  dawnEmergency:[
    {headline:'AMANHECER CHEGANDO! ETs PODEM PARTIR A QUALQUER MOMENTO',
      subtitle:'Acordo exige que o Líder Supremo cruze os braços; a emissora mantém o otimismo.'},
    {headline:'CUBO NEWS APOSTA EM DESPEDIDA AMIGÁVEL DOS INVASORES',
      subtitle:'Últimos segundos da noite são acompanhados com confiança na promessa extraterrestre.'},
    {headline:'CONTAGEM FINAL: CRISTO AINDA NÃO CRUZOU OS BRAÇOS',
      subtitle:'Apesar do atraso no gesto combinado, emissora considera a retirada alienígena iminente.'},
  ],
  brazilEarly:[
    {headline:'CANHÃO BRASILEIRO FUNCIONA; PATROCINADORES PEDEM QUE PARE',
      subtitle:'Fornecedores estrangeiros alegam que o sucesso do equipamento nacional ameaça contratos internacionais.'},
    {headline:'ESPECIALISTAS ALERTAM: CANHÃO QUE NÃO COBRA EM DÓLAR PODE SER GOLPE',
      subtitle:'Cubo News questiona a confiabilidade das armas nacionais e recomenda cautela.'},
    {headline:'INDÚSTRIA DE ARMAS PEDE QUE BRASIL PARE DE SALVAR O BRASIL',
      subtitle:'Fabricantes estrangeiros reclamam que a eficiência militar brasileira compromete futuras vendas de armamentos.'},
  ],
  brazilFifth:[
    {headline:'CUBO NEWS SEMPRE ACREDITOU NA TECNOLOGIA BRASILEIRA',
      subtitle:'Após o quinto avanço nacional, a emissora reafirma seu histórico de apoio à indústria brasileira.'},
    {headline:'É NOSSO! É DO BRASIL! NUNCA DUVIDAMOS DE VOCÊ!',
      subtitle:'Cubo News celebra o quinto avanço da tecnologia nacional e reafirma sua confiança histórica.'},
    {headline:'VAI, BRASIL! CUBO NEWS SEMPRE FOI SUA TORCIDA ORGANIZADA',
      subtitle:'Emissora comemora o desempenho dos armamentos nacionais e seu suposto apoio desde o início.'},
  ],
  sponsor:[
    {headline:'{PAÍS} REAFIRMA AMIZADE ETERNA COM O BRASIL',
      subtitle:'Novo acordo de cooperação tecnológica é celebrado como marco das relações bilaterais.'},
    {headline:'BRASIL E {PAÍS}: UMA AMIZADE QUE JÁ DURA MINUTOS',
      subtitle:'A chegada de equipamentos estrangeiros inaugura uma nova etapa de colaboração militar.'},
    {headline:'CUBO NEWS NÃO VÊ NENHUM MOTIVO PARA DESCONFIAR DE {PAÍS}',
      subtitle:'Emissora destaca a confiabilidade do novo parceiro e a importância do apoio internacional.'},
  ],
  betrayed:[
    {headline:'NÓS AVISAMOS: {PAÍS} NUNCA FOI CONFIÁVEL',
      subtitle:'Após a ofensiva contra o Brasil, Cubo News afirma que já mantinha reservas sobre o país.'},
    {headline:'CUBO NEWS IDENTIFICOU TRAIÇÃO ANTES MESMO DE CONHECER {PAÍS}',
      subtitle:'Emissora nega elogios ao país e investiga falsificações de seu arquivo jornalístico.'},
  ],
  pix:[
    {headline:'PIX BRASILEIRO DEIXA INDÚSTRIA MILITAR INTERNACIONAL EM ALERTA',
      subtitle:'Instituições estrangeiras cobram explicações sobre pagamentos instantâneos por tecnologia nacional.'},
    {headline:'ARMAS BRASILEIRAS ACEITAM PIX; PATROCINADORES PEDEM TAXAÇÃO',
      subtitle:'Representantes comerciais estrangeiros avaliam impactos da tecnologia nacional sobre receitas futuras.'},
    {headline:'PAGAMENTO EM PIX PREOCUPA FABRICANTES QUE COBRAM EM DÓLAR',
      subtitle:'Avanço dos fornecedores brasileiros gera resistência entre parceiros de importação.'},
  ],
  brazilVictory:[
    {headline:'BRASIL SALVA O PLANETA; RESTO DO MUNDO RECEBE PERMISSÃO PARA APLAUDIR',
      subtitle:'Contraofensiva brasileira avança após a destruição de novas unidades alienígenas.'},
    {headline:'FÍSICA SERÁ REVISADA PARA SE ADEQUAR AO DESEMPENHO BRASILEIRO',
      subtitle:'Tecnologias nacionais superam as projeções dos principais institutos de pesquisa.'},
    {headline:'HUMILDADE BRASILEIRA ADIADA POR TEMPO INDETERMINADO',
      subtitle:'Frota alienígena sofre perdas consecutivas durante a libertação do planeta.'},
  ],
  routine:[
    {headline:'COMÉRCIO DO RIO FUNCIONA NORMALMENTE, EXCETO POR INVASÃO ALIENÍGENA',
      subtitle:'Lojistas avaliam atendimento enquanto autoridades acompanham a movimentação de naves.'},
    {headline:'PREFEITURA AVALIA MULTA POR POUSO IRREGULAR DE DISCO VOADOR',
      subtitle:'Órgãos municipais estudam regras para circulação extraterrestre na cidade.'},
    {headline:'TRÂNSITO DO RIO SEGUE LENTO; NAVES NÃO SÃO CONSIDERADAS JUSTIFICATIVA',
      subtitle:'Autoridades relatam lentidão nos acessos à cidade e recomendam rotas alternativas.'},
  ],
  emergency:[
    {headline:'PLANTÃO CUBO NEWS: CATÁSTROFE IMINENTE!',subtitle:'Restam cinco segundos para o fim do prazo de defesa.'},
    {headline:'ATENÇÃO! BRASIL PODE ACABAR ANTES DO PRÓXIMO COMERCIAL',
      subtitle:'Contagem regressiva chega aos últimos segundos sob alerta nacional.'},
    {headline:'ÚLTIMOS SEGUNDOS! CUBO NEWS MANTÉM PATROCINADORES INFORMADOS',
      subtitle:'Equipes de emergência acompanham a aproximação do encerramento da onda.'},
  ],
});
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
    const story=withoutRepeats(state,'betrayed',CUBO_NEWS_BANK.betrayed);
    if(story)return {headline:formatCountry(story.headline,state.betrayer),
      subtitle:formatCountry(story.subtitle,state.betrayer)};
  }
  if(state.mode==='wave11'&&state.choices.every(id=>id==='br'))
    return withoutRepeats(state,'brazilVictory',CUBO_NEWS_BANK.brazilVictory);
  const earlyWave=/^wave(?:[0-9])$/.test(state.mode);
  const brStage=cuboNewsBrazilStage(state.choices);
  const foreign=Object.keys(CUBO_NEWS_COUNTRIES).filter(id=>state.choices.includes(id)&&id!==state.betrayer);
  // Antes da onda 10, o jornal tem total confiança no acordo do
  // "Líder Supremo". As piadas de patrocinadores continuam possíveis.
  const sources=earlyWave
    ? ['dawnPromise','dawnPromise','dawnRoutine']
    : ['routine'];
  if(brStage==='critic')sources.push('brazilEarly','pix');
  if(brStage==='praise')sources.push('brazilFifth');
  for(const country of foreign)for(let i=0;i<Math.max(1,cuboNewsSponsorStage(state.choices,country));i++)
    sources.push('sponsor:'+country);
  const key=sources[(state.sourceCounter=(state.sourceCounter||0)+1)%sources.length];
  const [source,country]=key.split(':');
  const story=withoutRepeats(state,key,CUBO_NEWS_BANK[source]);
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
