// Efeitos de reflexão do globo coreano. Apenas apresentação: o dano é
// resolvido imediatamente pela lógica de combate do GameScene.
export const DISCO_REFLECTION_MAX_VISUAL_RAYS = 8;
export const DISCO_REFLECTION_TRAVEL_MS = 200;

const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

// Curva quadrática com arco ascendente, ancorada exatamente no globo e no alvo.
// Determinística: resultados iguais para os mesmos pontos e índice de raio.
export function discoReflectionArcPoints(x0,y0,x1,y1,rayIndex=0,segments=24){
  const dx=x1-x0,dy=y1-y0,dist=Math.hypot(dx,dy);
  const arcHeight=clamp(36+dist*0.19,45,115);
  const spread=((rayIndex%5)-2)*12;
  const cx=(x0+x1)/2+spread;
  const cy=Math.max(12,Math.min(y0,y1)-arcHeight);
  const count=clamp(Math.trunc(segments)||24,4,64);
  return Array.from({length:count+1},(_,i)=>{
    const t=i/count,u=1-t;
    return {x:Math.round(u*u*x0+2*u*t*cx+t*t*x1),
      y:Math.round(u*u*y0+2*u*t*cy+t*t*y1)};
  });
}

function trace(g,points,count){
  g.beginPath();
  g.moveTo(points[0].x,points[0].y);
  for(let k=1;k<count;k++)g.lineTo(points[k].x,points[k].y);
  g.strokePath();
}

// Um Graphics e uma animação por salva (até oito arcos visuais).
// Preserva os demais reflexos e danos, sem produzir dezenas de tweens por tiro.
export function animateDiscoReflectionArcs(scene,x,y,targets){
  const beams=targets.slice(0,DISCO_REFLECTION_MAX_VISUAL_RAYS)
    .map((point,i)=>discoReflectionArcPoints(x,y,point.x,point.y,i));
  if(!beams.length)return;
  const graphics=scene.add.graphics().setDepth(59);
  const state={progress:0};
  const redraw=()=>{
    graphics.clear();
    // Flash de ativação: contração rápida no centro da bola de discoteca.
    const flash=1-clamp(state.progress*2,0,1);
    if(flash>0){
      graphics.fillStyle(0xb45dff,0.22*flash);
      graphics.fillCircle(x,y,34+17*(1-flash));
      graphics.lineStyle(3,0xf5d8ff,0.85*flash);
      graphics.strokeCircle(x,y,30+15*(1-flash));
    }
    beams.forEach((points,i)=>{
      // Pequena diferença de tempo entre os raios faz a salva "abrir" em leque.
      const t=clamp((state.progress-i*0.065)/(1-i*0.065),0,1);
      if(t<=0)return;
      const count=clamp(Math.ceil(t*(points.length-1))+1,2,points.length);
      graphics.lineStyle(11,0x6d29ff,0.14);
      trace(graphics,points,count);
      graphics.lineStyle(6,0xb65aff,0.37);
      trace(graphics,points,count);
      graphics.lineStyle(2,0xf6dbff,0.96);
      trace(graphics,points,count);
      // Ponto luminoso na ponta móvel, discretamente pixelado.
      const tip=points[count-1];
      graphics.fillStyle(0xffffff,0.93);
      graphics.fillRect(tip.x-2,tip.y-2,4,4);
    });
  };
  redraw();
  scene.tweens.add({
    targets:state,progress:1,duration:DISCO_REFLECTION_TRAVEL_MS,ease:'Sine.Out',
    onUpdate:redraw,
    onComplete:()=>{
      // Impactos breves em cada alvo, no mesmo objeto visual.
      graphics.clear();
      for(const points of beams){
        const end=points[points.length-1];
        graphics.fillStyle(0xc67bff,0.32);
        graphics.fillCircle(end.x,end.y,12);
        graphics.lineStyle(2,0xf5dcff,0.95);
        graphics.strokeCircle(end.x,end.y,7);
        graphics.fillStyle(0xffffff,0.98);
        graphics.fillRect(end.x-2,end.y-2,4,4);
      }
      scene.tweens.add({
        targets:graphics,alpha:0,duration:120,ease:'Sine.Out',
        onComplete:()=>graphics.destroy(),
      });
    },
  });
}
