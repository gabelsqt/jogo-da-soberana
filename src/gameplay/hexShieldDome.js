// Malha holográfica baseada em hexágonos, desenhada com Phaser Graphics.
// A textura de referência é apenas direção visual; não usa imagem externa.
import {CANNON_DOME_RADIUS,cannonShieldColor} from './shieldDome049.js';
const SQRT3=Math.sqrt(3);
const clamp01=value=>Math.max(0,Math.min(1,Number(value)||0));
export const HEX_SHIELD_CELL_RADIUS=9;
export const HEX_SHIELD_FORM_MS=780;
export const HEX_SHIELD_COLLAPSE_MS=380;
export const HEX_SHIELD_ARC_FRACTION=.36; // Primeiro desenha o contorno.
export const HEX_SHIELD_WHITE_FLASH_MS=340;
export function hexShieldFormationStage(progress){
  const p=clamp01(progress);
  return {
    arc:clamp01(p/HEX_SHIELD_ARC_FRACTION),
    cells:clamp01((p-HEX_SHIELD_ARC_FRACTION)/(1-HEX_SHIELD_ARC_FRACTION)),
  };
}

// TODOS os hexágonos têm a mesma aparência, e cada um pulsa em alpha
// num ritmo diferente. Sem alteração na resistência nem nas hitboxes.
export function hexShieldCellOpacity(cell,index,now=0,radius=CANNON_DOME_RADIUS){
  const speed=.0031+(index%7)*.00037;
  const phase=index*2.39996+cell.x*.093+cell.y*.071;
  const wave=.5+.5*Math.sin(Math.max(0,now)*speed+phase);
  const fade=clamp01((wave-.23)/.77);
  return .055+.945*fade*fade;
}

const cellCache=new Map();
export function hexShieldCells(radius=CANNON_DOME_RADIUS,cellRadius=HEX_SHIELD_CELL_RADIUS){
  const key=radius+':'+cellRadius;
  if(cellCache.has(key))return cellCache.get(key);
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
        cells.push({x,y,points});
      }
    }
  }
  // A malha é revelada COLUNA a COLUNA, da esquerda para a direita.
  cells.sort((a,b)=>a.x-b.x||a.y-b.y);
  // Geometria imutável: refazer só os alphas durante os pulsos.
  const frozen=Object.freeze(cells.map(cell=>Object.freeze({
    ...cell,points:Object.freeze(cell.points.map(p=>Object.freeze(p))),
  })));
  cellCache.set(key,frozen);
  return frozen;
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
  const total=Math.max(1,cells.length);
  const stage=mode==='forming'?hexShieldFormationStage(progress):{arc:1,cells:1};
  const arc=Array.from({length:65},(_,i)=>{
    const angle=Math.PI+i*Math.PI/64;
    return {x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius};
  });
  const arcCount=Math.min(arc.length,1+Math.floor(stage.arc*(arc.length-1)));
  const currentArc=arc.slice(0,arcCount);
  const rim=0x5cd8ff, status=cannonShieldColor(shield,maxShield);
  const pulse=mode==='active'?.045*(1+Math.sin(now*.0043)):.015;
  const whiteFlash=clamp01(flash);

  // Primeira fase: o arco azul é traçado da ESQUERDA para a DIREITA.
  // Não exibir preenchimento nem hexágonos antes do contorno completar.
  if(arcCount>=2){
    const rimOpacity=Math.max(.40,opacity)*(.52+pulse);
    graphics.lineStyle(8,rim,rimOpacity*.13);
    graphics.strokePoints(currentArc,false);
    graphics.lineStyle(3,rim,rimOpacity*.94);
    graphics.strokePoints(currentArc,false);
    graphics.lineStyle(1.2,0xc8f9ff,rimOpacity*.72);
    graphics.strokePoints(currentArc,false);
  }

  if(stage.cells<=0)return;
  // Preenchimento mínimo para mostrar o canhão ATRÁS da cúpula.
  graphics.fillStyle(0x1588c5,.024*opacity*stage.cells);
  graphics.fillPoints([{x:cx-radius,y:cy},...arc,{x:cx+radius,y:cy}],true);

  // Segunda fase: linhas, preenchimento e ponto central idênticos em
  // cada hexágono, aparecendo da ESQUERDA para a DIREITA.
  const visibleCount=Math.min(total,Math.ceil(stage.cells*total));
  for(let i=0;i<visibleCount;i++){
    const cell=cells[i];
    const localOpacity=opacity*hexShieldCellOpacity(cell,i,now,radius);
    const vertices=cell.points.map(p=>({x:cx+p.x,y:cy+p.y}));
    graphics.fillStyle(0x1c81b9,localOpacity*.049);
    graphics.fillPoints(vertices,true);
    graphics.lineStyle(1,0x71d1f1,localOpacity*.46);
    graphics.strokePoints(vertices,true);
    // Pequena bolinha EM TODOS os centros, com a mesma pulsação.
    graphics.fillStyle(0xcef7ff,localOpacity*.69);
    graphics.fillCircle(cx+cell.x,cy+cell.y,1.8);
    graphics.fillStyle(0xf1ffff,localOpacity*.24);
    graphics.fillCircle(cx+cell.x,cy+cell.y,.75);
    if(whiteFlash>0){
      graphics.lineStyle(1.6,0xffffff,whiteFlash*.85);
      graphics.strokePoints(vertices,true);
      graphics.fillStyle(0xffffff,whiteFlash*.95);
      graphics.fillCircle(cx+cell.x,cy+cell.y,2.1);
    }
  }
  graphics.lineStyle(2,status,opacity*.55);
  graphics.lineBetween(cx-radius,cy,cx-radius+16,cy);
  graphics.lineBetween(cx+radius-16,cy,cx+radius,cy);

  // Terceira fase: uma única descarga BRANCA de fechamento da cúpula.
  // O flash dura poucos frames e deixa o domo azul novamente.
  if(whiteFlash>0){
    graphics.lineStyle(7,0xffffff,whiteFlash*.24);
    graphics.strokePoints(arc,false);
    graphics.lineStyle(3,0xffffff,whiteFlash*.98);
    graphics.strokePoints(arc,false);
    graphics.fillStyle(0xffffff,whiteFlash*.055);
    graphics.fillPoints([{x:cx-radius,y:cy},...arc,{x:cx+radius,y:cy}],true);
  }
}
