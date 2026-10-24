// Reflexos coreanos: arcos de energia PRISMÁTICA, não feixes retos.
// Dano e seleção de alvos são resolvidos pelo GameScene, sem hits visuais.
export const DISCO_REFLECTION_MAX_VISUAL_RAYS=8;
export const DISCO_REFLECTION_TRAVEL_MS=265;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

// Recupera a curva quadrática pronunciada da v0.862. O desvio lateral
// diferencia arcos sobrepostos sem alterar suas extremidades ou a mira.
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
// Compatibilidade com as chamadas da v0.864; retorna o arco restaurado.
export const discoReflectionLaserPoints=discoReflectionArcPoints;

function trace(g,points,count,offsetX=0,offsetY=0){
  g.beginPath();
  g.moveTo(points[0].x+offsetX,points[0].y+offsetY);
  for(let i=1;i<count;i++)g.lineTo(points[i].x+offsetX,points[i].y+offsetY);
  g.strokePath();
}

// Uma única Graphics e um tween por salva. Os arcos "fantasmas" e pequenos
// ramos elétricos são puramente estéticos: não aumentam dano nem refletem tiro.
export function animateDiscoReflectionArcs(scene,x,y,targets,{rainbow=false}={}){
  const beams=targets.slice(0,DISCO_REFLECTION_MAX_VISUAL_RAYS)
    .map((p,i)=>discoReflectionArcPoints(x,y,p.x,p.y,i));
  if(!beams.length)return;
  const graphics=scene.add.graphics().setDepth(59);
  const state={progress:0};
  const redraw=()=>{
    graphics.clear();
    const progress=clamp(state.progress,0,1);
    const glow=clamp((1-progress)/0.22,0,1);
    const flash=clamp((0.42-progress)/0.42,0,1);
    if(flash>0){
      graphics.fillStyle(0xad4aff,0.24*flash).fillCircle(x,y,34+12*(1-flash));
      graphics.lineStyle(3,0xf5d8ff,0.83*flash).strokeCircle(x,y,29+12*(1-flash));
    }
    beams.forEach((points,i)=>{
      const delay=i*0.05;
      const t=clamp((progress-delay)/(1-delay),0,1);
      if(t<=0)return;
      const count=clamp(Math.ceil(t*(points.length-1))+1,2,points.length);
      // Arco principal roxo com miolo branco + sombra de energia curvada.
      const colors=[0xff65b5,0xffd36a,0x67eaff,0x8d86ff,0x7dffbd];
      const outer=rainbow?colors[(i+Math.floor(progress*5))%colors.length]:0x6d29ff;
      const inner=rainbow?colors[(i+2+Math.floor(progress*5))%colors.length]:0xaf52ff;
      graphics.lineStyle(13,outer,0.24*glow);trace(graphics,points,count);
      graphics.lineStyle(7,inner,0.58*glow);trace(graphics,points,count);
      graphics.lineStyle(2,0xffffff,0.98*glow);trace(graphics,points,count);
      // Descarga paralela menor: dobra elétrica visível, não outro projétil.
      if(count>7){
        graphics.lineStyle(2,0xe58bff,0.34*glow);
        trace(graphics,points,count,((i%3)-1)*4,-6);
        // Ramos elétricos do arco, presos à curva original.
        graphics.lineStyle(1,0xf5ceff,0.70*glow);
        for(const k of [Math.floor(count*0.40),Math.floor(count*0.72)]){
          const p=points[k],direction=(i%2===0?1:-1);
          graphics.lineBetween(p.x,p.y,p.x+direction*9,p.y-13);
          graphics.lineBetween(p.x+direction*9,p.y-13,
            p.x+direction*15,p.y-9);
        }
      }
      const tip=points[count-1];
      graphics.fillStyle(0xffffff,0.91*glow).fillRect(tip.x-2,tip.y-2,4,4);
      graphics.fillStyle(0xdb94ff,0.35*glow).fillCircle(tip.x,tip.y,7);
    });
  };
  redraw();
  scene.tweens.add({targets:state,progress:1,
    duration:DISCO_REFLECTION_TRAVEL_MS,ease:'Sine.Out',
    onUpdate:redraw,onComplete:()=>graphics.destroy()});
}
