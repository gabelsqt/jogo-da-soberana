// Reflexos coreanos com aparência de LASER. O dano é resolvido no GameScene;
// aqui só existe uma Graphics e uma animação curta por salva.
export const DISCO_REFLECTION_MAX_VISUAL_RAYS=8;
export const DISCO_REFLECTION_TRAVEL_MS=155;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

// Caminho quase reto: pequeno afastamento (até 3,5 px) separa feixes
// sobrepostos, mas extremidades coincidem exatamente com globo e alvo.
export function discoReflectionLaserPoints(x0,y0,x1,y1,rayIndex=0,segments=24){
  const dx=x1-x0,dy=y1-y0,dist=Math.hypot(dx,dy)||1;
  const spread=((rayIndex%5)-2)*1.75;
  const px=-dy/dist,py=dx/dist;
  const count=clamp(Math.trunc(segments)||24,4,64);
  return Array.from({length:count+1},(_,i)=>{
    const t=i/count,offset=Math.sin(Math.PI*t)*spread;
    return {x:Math.round(x0+dx*t+px*offset),
      y:Math.round(y0+dy*t+py*offset)};
  });
}
// Alias de compatibilidade: o antigo arco curvo foi substituído por laser.
export const discoReflectionArcPoints=discoReflectionLaserPoints;

function trace(g,points){
  g.beginPath();g.moveTo(points[0].x,points[0].y);
  for(let i=1;i<points.length;i++)g.lineTo(points[i].x,points[i].y);
  g.strokePath();
}
// Feixes inteiros surgem imediatamente e apagam em 155 ms.
// Até 8 feixes desenhados, mesmo quando os 24 reflexos causam dano.
export function animateDiscoReflectionArcs(scene,x,y,targets){
  const beams=targets.slice(0,DISCO_REFLECTION_MAX_VISUAL_RAYS)
    .map((p,i)=>discoReflectionLaserPoints(x,y,p.x,p.y,i));
  if(!beams.length)return;
  const graphics=scene.add.graphics().setDepth(59);
  const state={intensity:1};
  const redraw=()=>{
    graphics.clear();
    const glow=state.intensity;
    if(glow<=0)return;
    graphics.fillStyle(0xad4aff,0.22*glow).fillCircle(x,y,34);
    graphics.lineStyle(3,0xf5d8ff,0.90*glow).strokeCircle(x,y,28);
    for(const points of beams){
      graphics.lineStyle(13,0x7631d9,0.22*glow);trace(graphics,points);
      graphics.lineStyle(6,0xc264ff,0.74*glow);trace(graphics,points);
      graphics.lineStyle(2,0xffffff,0.98*glow);trace(graphics,points);
      const p=points[points.length-1];
      graphics.fillStyle(0xe7a6ff,0.48*glow).fillCircle(p.x,p.y,9);
      graphics.lineStyle(2,0xffffff,0.95*glow);
      graphics.lineBetween(p.x-5,p.y,p.x+5,p.y);
      graphics.lineBetween(p.x,p.y-5,p.x,p.y+5);
    }
  };
  redraw();
  scene.tweens.add({targets:state,intensity:0,
    duration:DISCO_REFLECTION_TRAVEL_MS,ease:'Sine.Out',
    onUpdate:redraw,onComplete:()=>graphics.destroy()});
}
