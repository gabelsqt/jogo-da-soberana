// Tipo 5 — folhas do cruzador-colmeia (4 colunas × 4 linhas).
// Lógica visual pura: não modifica HP, IA, hitbox ou temporizadores.
export const TYPE5_SPRITE={frameWidth:224,frameHeight:128,columns:4,rows:4,
  displayWidth:128,displayHeight:74,
  flight:[0,1,2,3],deploy:[4,5,6,7],damage:[8,9,10,11],
  death:[12,13,14,15]};
export function type5DamageFrame(hp,maxHp){
  if(!(maxHp>0))return null;
  const ratio=Math.max(0,Math.min(1,hp/maxHp));
  if(ratio<=0.14)return 11;
  if(ratio<=0.30)return 10;
  if(ratio<=0.50)return 9;
  if(ratio<=0.72)return 8;
  return null;
}
