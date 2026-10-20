// Artilharia americana: Quatro de Julho, sem mira assistida.
// Só colisões DIRETAS de munição convencional contabilizam carga.
// Explosões, projéteis derivados, o próprio tiro patriótico e o especial
// Choque e Pavor jamais geram carga; evita recarga recursiva em builds híbridas.
export function americanJulyConfig(level=0){
  const n=Math.max(0,Math.floor(Number(level)||0));
  if(n<3)return {hitsRequired:0,blastRadius:0,blastDamage:0,shards:false};
  return {
    hitsRequired:n>=10?3:5,
    blastRadius:n>=10?118:n>=7?104:n>=5?92:78,
    blastDamage:n>=10?8:n>=7?6.0:n>=5?5.0:4.0,
    shards:n>=7,
  };
}
export function registerAmericanJulyHit(current,hitsRequired,bullet={}){
  if(!(hitsRequired>0)||bullet.special||bullet.patriotic||bullet.generation>0)
    return Math.max(0,Math.min(hitsRequired,Math.floor(Number(current)||0)));
  return Math.min(hitsRequired,Math.max(0,Math.floor(Number(current)||0))+1);
}
export function americanJulyReady(current,hitsRequired){
  return hitsRequired>0 && current>=hitsRequired;
}
export function consumeAmericanJulyShot(current,hitsRequired){
  const ready=americanJulyReady(current,hitsRequired);
  return {patriotic:ready,hits:ready?0:current};
}
