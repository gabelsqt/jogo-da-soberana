// Nave Tipo 2: o nariz original aponta para cima (ângulo 0).
// O rumo vem do deslocamento REAL, não do alvo ou do recuo de impacto.
export function type2FacingAngle(dx,dy,speedThreshold=8){
  if(!Number.isFinite(dx)||!Number.isFinite(dy)||Math.hypot(dx,dy)<speedThreshold)return 0;
  return Math.atan2(dy,dx)+Math.PI/2;
}
export function steerType2Rotation(current,dx,dy,dt,turnSpeed=9){
  const target=type2FacingAngle(dx,dy);
  const shortest=Math.atan2(Math.sin(target-current),Math.cos(target-current));
  const blend=1-Math.exp(-turnSpeed*Math.max(0,dt));
  const next=current+shortest*blend;
  return Math.atan2(Math.sin(next),Math.cos(next));
}
