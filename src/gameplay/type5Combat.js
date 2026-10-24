// Regras puras do Cruzador-Colmeia Tipo 5: escudo finito, carga
// telegráfica e disparo pesado. Independente de Phaser e do FPS.
export const TYPE5_SHIELD_BASE_HP=12;
export const TYPE5_SHIELD_PER_LEVEL=2;
export const TYPE5_LASER_CHARGE_SECONDS=5;
export const TYPE5_LASER_FIRE_SECONDS=0.72;
export const TYPE5_LASER_RECOVERY_SECONDS=2.2;
export const TYPE5_LASER_DAMAGE=68;
export const TYPE5_SHIELD_RIPPLE_MS=420;
export const TYPE5_SHIELD_FLASH_MS=65;

export function type5ShieldHp(level=1) {
  return TYPE5_SHIELD_BASE_HP+Math.max(0,Math.min(9,Math.trunc(level)-1))*TYPE5_SHIELD_PER_LEVEL;
}

export function absorbType5Shield(shieldHp,damage) {
  const shield=Math.max(0,Number(shieldHp)||0);
  const incoming=Math.max(0,Number(damage)||0);
  const absorbed=Math.min(shield,incoming);
  return {
    shield:Math.max(0,shield-absorbed),
    absorbed,spill:shield>0?0:incoming,
    broken:shield>0&&absorbed>=shield,
  };
}

export function type5ChargeFraction(age) {
  return Math.max(0,Math.min(1,(Number(age)||0)/TYPE5_LASER_CHARGE_SECONDS));
}

export function shieldRippleAt(now,hitAt,duration=TYPE5_SHIELD_RIPPLE_MS) {
  if(!Number.isFinite(hitAt)||hitAt<0 || now<hitAt)return 0;
  return Math.max(0,1-(now-hitAt)/duration);
}

export function shieldSoftFlashAt(now,hitAt,interval=165) {
  if(!Number.isFinite(hitAt)||hitAt<0||now<hitAt)return 0;
  const age=now-hitAt;
  // Só um lampejo breve em cada ciclo. Sem piscar o sprite/casco inteiro.
  return age<TYPE5_SHIELD_FLASH_MS && age%interval<TYPE5_SHIELD_FLASH_MS ? 1-age/TYPE5_SHIELD_FLASH_MS : 0;
}
