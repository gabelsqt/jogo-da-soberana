// Texto puro da abertura; testável sem Phaser. Duração: 5 quadros de 4,5 s.\nexport function introductionSlides(name){
  return [
    {title:'Naves extraterrestres chegam à Terra!',
      body:'Objetos gigantescos foram avistados sobre o Rio de Janeiro.\nA Cubo News recomenda manter a calma. E o sinal ligado.',
      tag:'URGENTE • INVASÃO',art:'earth'},
    {title:'Cristo causa incidente diplomático',
      body:'Na cultura alienígena, braços cruzados demonstram respeito.\nAo ver o Cristo de braços abertos, os ETs acharam\nque o Líder Supremo da Terra estava insultando todos.',
      tag:'ETIQUETA INTERPLANETÁRIA',art:'christ'},
    {title:'Acordo prevê retirada ao amanhecer',
      body:'Atacar de dia seria uma grosseria imperdoável para os invasores.\nEles prometem parar assim que o Cristo cruzar os braços.\nA emissora classifica o acordo como bastante promissor.',
      tag:'DIPLOMACIA',art:'moon'},
    {title:'Uma mensagem da pessoa que terminou com você',
      body:'“Você chamou bolacha de biscoito. Eu sou de São Paulo.\nA gente terminou por isso, sim.\nE te inscrevi como mesário. Boa sorte.”',
      tag:'MENSAGEM RECEBIDA',art:'message'},
    {title:`${name}, o novo comando é seu`,
      body:'Após as baixas da noite anterior, a escala de mesários\nvirou a lista oficial de sucessão do comando carioca.\nVocê é o próximo general e terá de escolher alianças\ninternacionais para defender a cidade. Sem direito a recurso.',
      tag:'PORTARIA EXTRAORDINÁRIA',art:'document'},
  ];
}
