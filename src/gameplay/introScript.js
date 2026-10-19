// Placeholders narrativos: 6 quadros x 4 s = 24 s de visual novel.
// O login no computador velho NÃO desconta tempo desses quadros.
// Revisão completa de piadas e textos será feita antes do lançamento.
export const INTRO_PAGE_MS=4000;
export function introductionSlides(name){
  const user=String(name||'servidor').trim()||'servidor';
  return [
    {speaker:'CUBO NEWS',tag:'PLANTÃO EXTRAORDINÁRIO',
      title:'Alienígenas chegam à Terra!',
      body:'Naves desconhecidas apareceram sobre o Rio. Autoridades ainda não sabem o que querem. A Cubo News recomenda calma e audiência.',
      art:'news'},
    {speaker:'COMANDANTE ALIENÍGENA',tag:'COMUNICAÇÃO EXTRATERRESTRE',
      title:'“Aquele é o Líder Supremo da Terra?”',
      body:'“Por que ele está com os braços abertos? Nosso povo cruza os braços para demonstrar respeito! Braços abertos são uma ofensa enorme!”',
      art:'christ'},
    {speaker:'OFICIAL ALIENÍGENA',tag:'PROTOCOLO DE ETIQUETA',
      title:'“Ele continua desse jeito, comandante.”',
      body:'“Podemos bombardear a cidade à noite. Atacar de dia seria muita falta de educação. Vamos aguardar o pôr do sol.”',
      art:'alien'},
    {speaker:'CUBO NEWS',tag:'ACORDO DIPLOMÁTICO',
      title:'Invasores prometem ir embora ao amanhecer',
      body:'Segundo os ETs, a paz será possível quando o Cristo finalmente cruzar os braços. Governo classifica as negociações como promissoras.',
      art:'moon'},
    {speaker:'CONTATO: EX',tag:'MENSAGEM RECEBIDA NO COMPUTADOR',
      title:'Uma cobrança do passado',
      body:'“Você chamou bolacha de biscoito. Eu sou de São Paulo. A gente terminou por isso, sim. E te inscrevi como mesário. Boa sorte.”',
      art:'message'},
    {speaker:'SISTEMA DO SERVIDOR',tag:'PORTARIA EXTRAORDINÁRIA',
      title:`${user}, sua promoção foi aprovada!`,
      body:'Após as baixas do ataque anterior, a lista de mesários virou cadeia de comando. Você é o próximo responsável pela defesa carioca. Escolha as alianças internacionais. Não existe botão Recusar.',
      art:'document'},
  ];
}
