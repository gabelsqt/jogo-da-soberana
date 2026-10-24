// Identidade do protagonista na v0.49. Nenhum gênero é solicitado ou inferido.
export const BRAZILIAN_NAMES=Object.freeze([
  'José','João','Antônio','Francisco','Pedro','Carlos','Lucas','Luiz',
  'Paulo','Gabriel','Marcos','Davi','Rafael','Luís','Daniel','Miguel',
  'Gustavo','Felipe','Guilherme','Eduardo',
  'Maria','Ana','Francisca','Júlia','Antônia','Juliana','Adriana','Fernanda',
  'Márcia','Patrícia','Amanda','Alice','Letícia','Aline','Laura','Bruna',
  'Mariana','Jéssica','Sandra','Beatriz',
]);
export const PLAYER_NAME_STORAGE_KEY='soberana.playerName.v049';
export function resolvePlayerName(raw='',random=Math.random){
  const value=String(raw??'').trim().replace(/\s+/g,' ').slice(0,32);
  if(value)return value;
  const roll=Math.max(0,Math.min(0.999999,Number(random())||0));
  return BRAZILIAN_NAMES[Math.floor(roll*BRAZILIAN_NAMES.length)];
}
export function getSavedPlayerName(store){
  try{return String(store?.getItem(PLAYER_NAME_STORAGE_KEY)??'').trim().slice(0,32);}
  catch{return '';}
}
export function savePlayerName(store,name){
  const clean=String(name??'').trim().slice(0,32);
  try{store?.setItem(PLAYER_NAME_STORAGE_KEY,clean);}catch{/* Navegação privada funciona sem storage. */}
  return clean;
}
