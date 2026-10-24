// Posicionamento calibrado no spritesheet original (canvas 180×190).
// Cada quadro tem um pivô próprio: alinhar pelo centro da articulação
// impede a navegação lateral de deslocar o cano em relação à base.
const FRAMES=Object.freeze([
  {pivot:[122,167],tip:[48,70]},
  {pivot:[118,175],tip:[49,64]},
  {pivot:[111,167],tip:[53,48]},
  {pivot:[103,167],tip:[66,44]},
  {pivot:[87,167], tip:[89,33]},
  {pivot:[73,167], tip:[111,44]},
  {pivot:[66,167], tip:[123,48]},
  {pivot:[56,167], tip:[137,59]},
  {pivot:[51,173], tip:[143,76]},
].map(f=>Object.freeze({pivot:Object.freeze(f.pivot),tip:Object.freeze(f.tip)})));

export const CANNON_BARREL_FRAME_SIZE=Object.freeze({width:180,height:190});
export const CANNON_BARREL_DISPLAY_SIZE=Object.freeze({width:82,height:87});

function signedDelta(a,b){
  return Math.atan2(Math.sin(a-b),Math.cos(a-b));
}
function frameVector(frame){
  const sx=CANNON_BARREL_DISPLAY_SIZE.width/CANNON_BARREL_FRAME_SIZE.width;
  const sy=CANNON_BARREL_DISPLAY_SIZE.height/CANNON_BARREL_FRAME_SIZE.height;
  return {
    x:(frame.tip[0]-frame.pivot[0])*sx,
    y:(frame.tip[1]-frame.pivot[1])*sy,
  };
}

/**
 * Devolve o quadro, a pequena rotação complementar e a boca REAL do cano.
 * A trajetória do projétil deve continuar usando o ângulo contínuo original.
 */
export function cannonSpritePose(angle,pivotX,pivotY,recoil=0){
  if(!Number.isFinite(angle))angle=-Math.PI/2;
  let index=0,delta=Infinity;
  for(let i=0;i<FRAMES.length;i++){
    const v=frameVector(FRAMES[i]);
    const nominal=Math.atan2(v.y,v.x);
    const error=Math.abs(signedDelta(angle,nominal));
    if(error<delta){index=i;delta=error;}
  }
  const frame=FRAMES[index],v=frameVector(frame);
  const baseAngle=Math.atan2(v.y,v.x);
  const rotation=signedDelta(angle,baseAngle);
  const cx=pivotX-Math.cos(angle)*Math.max(0,recoil);
  const cy=pivotY-Math.sin(angle)*Math.max(0,recoil);
  const cos=Math.cos(rotation),sin=Math.sin(rotation);
  return {
    frame:index,
    rotation,
    originX:frame.pivot[0]/CANNON_BARREL_FRAME_SIZE.width,
    originY:frame.pivot[1]/CANNON_BARREL_FRAME_SIZE.height,
    pivotX:cx,pivotY:cy,
    muzzleX:cx+v.x*cos-v.y*sin,
    muzzleY:cy+v.x*sin+v.y*cos,
  };
}
