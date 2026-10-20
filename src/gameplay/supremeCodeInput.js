// Estado puro do protocolo Supremo. Nenhuma letra é um atalho de cena.
export const SUPREME_CODES=Object.freeze({
  br:'REVEILLON',us:'FREEDOM',ru:'SPUTNIK',cn:'ENTREGA',jp:'ENCORE',kr:'ENCORE',
});
export function supremeCodeFor(country){
  return SUPREME_CODES[country]??null;
}
export function advanceSupremeCode(code,key,expected){
  const current=String(code??'').toUpperCase();
  const word=String(expected??'').toUpperCase();
  if(key==='Escape')return {code:current,cancelled:true,completed:false,invalid:false};
  if(key==='Backspace')return {code:current.slice(0,-1),cancelled:false,completed:false,invalid:false};
  if(!/^[a-z]$/i.test(key??'')||!word)
    return {code:current,cancelled:false,completed:false,invalid:false,ignored:true};
  // Digitar a palavra nunca reinicia/pausa cenas. Um erro pode ser corrigido
  // com Backspace, sem apagar letras corretas já digitadas.
  const next=current.length<word.length?current+key.toUpperCase():current;
  return {
    code:next,
    completed:next===word,
    cancelled:false,
    invalid:!word.startsWith(next),
    ignored:next===current,
  };
}
