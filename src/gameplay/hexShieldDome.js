// Malha holográfica baseada em hexágonos, desenhada com Phaser Graphics.
// A textura de referência é apenas direção visual; não usa imagem externa.
import {CANNON_DOME_RADIUS,cannonShieldColor} from './shieldDome049.js';
const SQRT3=Math.sqrt(3);
const clamp01=value=>Math.max(0,Math.min(1,Number(value)||0));
export const HEX_SHIELD_CELL_RADIUS=11;
export const HEX_SHIELD_FORM_MS=780;
export const HEX_SHIELD_COLLAPSE_MS=380;

export function hexShieldCells(radius=CANNON_DOME_RADIUS,cellRadius=HEX_SHIELD_CELL_RADIUS){
  const cells=[];
  // Pontas para cima, malha quase contínua. Todo o hexágono deve caber
  // na cúpula superior; a borda externa é desenhada separadamente.
  const width=SQRT3*cellRadius,stepY=1.5*cellRadius;
  let row=0;
  for(let y=-radius+cellRadius;y<=-cellRadius;y+=stepY,row++){
    const offset=(row%2)*width/2;
    for(let x=-radius+cellRadius+offset;x<=radius-cellRadius;x+=width){
      const points=Array.from({length:6},(_,i)=>{
        const a=-Math.PI/2+i*Math.PI/3;
        return {x:x+cellRadius*Math.cos(a),y:y+cellRadius*Math.sin(a)};
      });
      if(points.every(p=>p.y<=.25&&p.x*p.x+p.y*p.y<(radius-1)**2)){
        cells.push({x,y,points,glow:(row*11+Math.round(x*3))%9===0});
      }
    }
  }
  return cells.sort((a,b)=>b.y-a.y||a.x-b.x);
}
export function hexShieldOpacity({shield=80,maxShield=80,progress=1,mode='active'}={}){
  const life=clamp01(maxShield>0?shield/maxShield:0);
  const p=clamp01(progress);
  return life<=0?0:(mode==='disabling'?1-p:p)*(.67+.33*life);
}
export function drawHexShieldDome(graphics,{
  cx=480,cy=504,radius=CANNON_DOME_RADIUS,
  shield=80,maxShield=80,progress=1,mode='active',now=0,flash=0,
}={}){
  graphics.clear();
  const opacity=hexShieldOpacity({shield,maxShield,progress,mode});
  if(opacity<=0.001)return;
  const cells=hexShieldCells(radius);
  const total=Math.max(1,cells.length),life=clamp01(shield/Math.max(1,maxShield));
  const activationFlash=mode==='forming'&&progress>=.94
    ?(1-clamp01((progress-.94)/.06))*.22:0;
  const pulse=mode==='active'?.045*(1+Math.sin(now*.0043)):.015;
  const rim=0x5cd8ff;
  const status=cannonShieldColor(shield,maxShield);
  // Superfície azul translúcida: o sprite do canhão permanece visível.
  const arc=Array.from({length:65},(_,i)=>{
    const a=Math.PI+i*Math.PI/64;
    return {x:cx+Math.cos(a)*radius,y:cy+Math.sin(a)*radius};
  });
  graphics.fillStyle(0x1588c5,.030*opacity);
  graphics.fillPoints([{x:cx-radius,y:cy},...arc,{x:cx+radius,y:cy}],true);
  const reveal=mode==='forming'?clamp01(progress):1;
  for(let i=0;i<cells.length;i++){
    if(mode==='forming'&&i/total>reveal)break; // forma de baixo para cima
    const cell=cells[i];
    const localOpacity=mode==='forming'
      ?opacity*(.65+.35*Math.min(1,(reveal-i/total)*total*.25))
      :opacity;
    const vertices=cell.points.map(p=>({x:cx+p.x,y:cy+p.y}));
    graphics.fillStyle(cell.glow?0x78dafb:0x1c81b9,
      localOpacity*(cell.glow?.085:.036));
    graphics.fillPoints(vertices,true);
    graphics.lineStyle(cell.glow?1.6:1,cell.glow?0x99edff:0x55bce8,
      localOpacity*(cell.glow?.47:.23));
    graphics.strokePoints(vertices,true);
    if(cell.glow){
      graphics.fillStyle(0xe5ffff,localOpacity*.46);
      graphics.fillCircle(cx+cell.x,cy+cell.y,1.5);
    }
  }
  const rimStrength=opacity*(.52+pulse+activationFlash+clamp01(flash)*.72);
  graphics.lineStyle(8,rim,rimStrength*.12);
  graphics.strokePoints(arc,false);
  graphics.lineStyle(3,rim,rimStrength*.93);
  graphics.strokePoints(arc,false);
  graphics.lineStyle(1.2,0xc8f9ff,rimStrength*.70);
  graphics.strokePoints(arc,false);
  // Faixa de dano nas laterais, mantendo indicação verde/amarelo/vermelho.
  graphics.lineStyle(2,status,opacity*.55);
  graphics.lineBetween(cx-radius,cy,cx-radius+16,cy);
  graphics.lineBetween(cx+radius-16,cy,cx+radius,cy);
  if((mode==='forming'&&progress>=.95)||flash>0){
    const shine=Math.max(clamp01(flash),1-clamp01((progress-.95)/.05));
    graphics.lineStyle(5,0xcfffff,opacity*shine*.72);
    graphics.strokePoints(arc,false);
  }
}
