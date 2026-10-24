// A cúpula padrão do canhão não recebe melhorias por país na v0.49.
// Raio 180% do legado, visual e colisão iguais. 4 faixas de resistência.
export const CANNON_BASE_DOME_RADIUS=62;
export const CANNON_DOME_RADIUS=CANNON_BASE_DOME_RADIUS*1.8;
export function cannonShieldColor(shield,max){
  const f=max>0?Math.max(0,shield/max):0;
  return f>0.75?0x388bff:f>0.5?0x35c86d:f>0.25?0xf1cb35:0xf04a52;
}
export function cannonDomeIntercept(fromX,fromY,toX,toY,{
  cx=480,cy=504,radius=CANNON_DOME_RADIUS,
}={}){
  // O escudo semicircular cobre somente a parte superior do chão.
  const ax=fromX-cx,ay=fromY-cy,dx=toX-fromX,dy=toY-fromY;
  const a=dx*dx+dy*dy;
  if(a<1e-9)return ay<=0&&ax*ax+ay*ay<=radius*radius;
  const b=2*(ax*dx+ay*dy),c=ax*ax+ay*ay-radius*radius;
  const disc=b*b-4*a*c;
  if(disc<0)return false;
  const sqrt=Math.sqrt(disc);
  const t1=(-b-sqrt)/(2*a),t2=(-b+sqrt)/(2*a);
  return [t1,t2].some(t=>t>=0&&t<=1&&fromY+dy*t<=cy);
}
