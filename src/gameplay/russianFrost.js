// Geada russa: congela o alvo diretamente. Quando ele morre ainda congelado,
// explode em fragmentos que causam dano ao redor. Não atrai nem contagia.
// Funções puras para teste independente do Phaser.
export function russianShatterRadius(level=0){
  if(level>=10)return 120;
  if(level>=7)return 96;
  if(level>=5)return 76;
  if(level>=3)return 60;
  return level>=1?44:0;
}
export function russianShatterDamage(level=0){
  if(level>=10)return 9;
  if(level>=7)return 6;
  if(level>=5)return 4.5;
  if(level>=3)return 3;
  return level>=1?2:0;
}
export function applyRussianFreeze(target,now,durationMs){
  if(!target||target.type===6||!(durationMs>0))return false;
  target.frozenUntil=Math.max(target.frozenUntil??-Infinity,now+durationMs);
  return true;
}
export function russianShatterTargets(source,enemies,now,radius){
  if(!source||source.type===6||(source.frozenUntil??-Infinity)<=now||radius<=0)return [];
  return enemies.filter(enemy=>enemy!==source&&enemy?.sprite&&enemy.type!==6
    &&Math.hypot(enemy.sprite.x-source.sprite.x,
      enemy.sprite.y-source.sprite.y)<=radius).map(enemy=>enemy.uid);
}
