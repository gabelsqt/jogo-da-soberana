// Sputnik Criogênico: controle de área e preparação de combos.
// Sem Phaser, para permitir testes da duração/alcance/cristalização.
export const MAX_ACTIVE_SPUTNIKS=3;
export function sputnikTouchesEnemy(satellite,enemy,contactRadius=0){
  if(!satellite||!enemy?.sprite||enemy.type===6)return false;
  return Math.hypot(enemy.sprite.x-satellite.x,enemy.sprite.y-satellite.y)
    <=satellite.radius+Math.max(0,contactRadius);
}
export function crystallizeSputnikEnemy(enemy,now,freezeMs){
  if(!enemy||enemy.type===6)return false;
  enemy.russianCrystalizedUntil=Math.max(enemy.russianCrystalizedUntil??0,
    now+Math.max(300,freezeMs));
  enemy.frozenUntil=Math.max(enemy.frozenUntil??-Infinity,
    now+Math.max(300,freezeMs));
  return true;
}
export function isSputnikCrystalized(enemy,now){
  return Boolean(enemy&&enemy.type!==6&&(enemy.russianCrystalizedUntil??0)>now);
}
export function sputnikShatterStats(enemy,now,baseRadius,baseDamage,build){
  if(!isSputnikCrystalized(enemy,now))
    return {radius:baseRadius,damage:baseDamage};
  return {
    radius:baseRadius*(build?.ruCrystalShatterRadius??1),
    damage:baseDamage*(build?.ruCrystalShatterDamage??1),
  };
}
export function sputnikPrimaryDamage(enemy,now,baseDamage,build){
  return baseDamage*(isSputnikCrystalized(enemy,now)?
    (build?.ruCrystalBonus??1):1);
}
