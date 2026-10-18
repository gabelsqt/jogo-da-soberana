// Rússia: congelamento de primeiro contato que atrai e contagia uma vez.
// Lógica independente de Phaser para preservar builds híbridas e permitir testes.
export const RUSSIAN_FROST_SPREAD_MAX_TARGETS = 4;
export const RUSSIAN_FROST_SECONDARY_DURATION = 0.60;

export function russianFrostSpreadRadius(level = 0) {
  if(level >= 10)return 126;
  if(level >= 7)return 104;
  if(level >= 5)return 84;
  if(level >= 3)return 66;
  return level >= 1 ? 48 : 0;
}

export function russianSecondaryFreezeMs(durationMs) {
  return Math.max(1,Math.round(Math.max(0,durationMs)*
    RUSSIAN_FROST_SECONDARY_DURATION));
}

// Direct freeze can convert a previously infected target into a new primary.
// Repeated shots during an existing freeze never reset an already-used pulse.
export function applyRussianFreeze(target,now,durationMs,secondary=false) {
  if(!target || target.type===6 || !(durationMs>0))return false;
  const active=(target.frozenUntil??-Infinity)>now;
  if(!active){
    target.russianFrostSpreadUsed=false;
    target.russianFrostHits=0;
    target.russianFrostPrimary=false;
  }
  if(!secondary){
    if(!target.russianFrostPrimary && !target.russianFrostSpreadUsed)
      target.russianFrostPrimary=true;
    target.russianFrostHits=(target.russianFrostHits||0)+1;
  }
  target.frozenUntil=Math.max(target.frozenUntil??-Infinity,now+durationMs);
  return true;
}

// A propagação é em um salto: destinatários secundários atraem,
// mas nunca retransmitem até receberem um novo disparo direto de gelo.
export function spreadRussianFrost(source,enemies,now,directFreezeMs,radius,
  multiplier=1) {
  if(!source || source.type===6 || !source.russianFrostPrimary ||
      source.russianFrostSpreadUsed || (source.frozenUntil??-Infinity)<=now ||
      radius<=0)return [];
  const maxDistance=radius*Math.max(1,multiplier);
  const candidates=enemies.filter(enemy=>enemy!==source && enemy.type!==6 &&
      (enemy.frozenUntil??-Infinity)<=now && enemy.sprite && source.sprite)
    .map(enemy=>({
      enemy,distance:Math.hypot(enemy.sprite.x-source.sprite.x,
        enemy.sprite.y-source.sprite.y),
    }))
    .filter(candidate=>candidate.distance<=maxDistance)
    .sort((a,b)=>a.distance-b.distance ||
      (a.enemy.uid??0)-(b.enemy.uid??0))
    .slice(0,RUSSIAN_FROST_SPREAD_MAX_TARGETS);
  if(!candidates.length)return [];
  source.russianFrostSpreadUsed=true;
  const duration=russianSecondaryFreezeMs(directFreezeMs);
  for(const {enemy} of candidates)applyRussianFreeze(enemy,now,duration,true);
  return candidates.map(({enemy})=>enemy);
}
