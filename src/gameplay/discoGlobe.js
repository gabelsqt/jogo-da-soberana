export const DISCO_DURATION_MS = 4000;
export const DISCO_RADIUS = 28;

// Primeira interseção no segmento: não perde balas rápidas entre dois frames.
export function hitDiscoGlobe(globes = [], x1, y1, x2, y2, now, padding = 0) {
  const dx=x2-x1,dy=y2-y1,a=dx*dx+dy*dy;
  let first=null;
  for(const globe of globes){
    if(now>=globe.expiresAt)continue;
    const fx=x1-globe.x,fy=y1-globe.y,r=DISCO_RADIUS+padding;
    const c=fx*fx+fy*fy-r*r;
    let t=0;
    if(c>0){
      if(!a)continue;
      const b=2*(fx*dx+fy*dy),d=b*b-4*a*c;
      if(d<0)continue;
      t=(-b-Math.sqrt(d))/(2*a);
      if(t<0||t>1)continue;
    }
    if(!first||t<first.t)first={globe,t,x:x1+dx*t,y:y1+dy*t};
  }
  return first;
}
