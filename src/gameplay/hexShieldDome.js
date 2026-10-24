// Malha holográfica baseada em hexágonos, desenhada com Phaser Graphics.
// A textura de referência é apenas direção visual; não usa imagem externa.
import {CANNON_DOME_RADIUS,cannonShieldColor} from './shieldDome049.js';
const SQRT3=Math.sqrt(3);
const clamp01=value=>Math.max(0,Math.min(1,Number(value)||0));
export const HEX_SHIELD_CELL_RADIUS=9;
export const HEX_SHIELD_ARC_MS=650;
export const HEX_SHIELD_CELLS_MS=950;
export const HEX_SHIELD_FORM_MS=HEX_SHIELD_ARC_MS+HEX_SHIELD_CELLS_MS;
export const HEX_SHIELD_COLLAPSE_MS=380;
export const HEX_SHIELD_ARC_FRACTION=HEX_SHIELD_ARC_MS/HEX_SHIELD_FORM_MS;
export const HEX_SHIELD_WHITE_FLASH_MS=180;
export const HEX_SHIELD_SWELL_MAX=.035; // +3.5%, só no desenho.
export function hexShieldFlashScale(flash=0){
  // Um único movimento de expansão e contração durante o flash.
  return 1+HEX_SHIELD_SWELL_MAX*Math.sin(Math.PI*(1-clamp01(flash)));
}
export function hexShieldArcTip(arcProgress,cx=480,cy=504,radius=CANNON_DOME_RADIUS){
  const angle=Math.PI*(1+clamp01(arcProgress));
  return {x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius};
}
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
  shield=80,maxShield=80,progress=1,mode='active',now=0,flash=0,rebuild=false,
}={}){
  graphics.clear();
  const opacity=hexShieldOpacity({shield,maxShield,progress,mode});
  if(opacity<=0.001)return;
  const cells=hexShieldCells(radius);
  const total=Math.max(1,cells.length);
  const stage=mode==='forming'?(rebuild
    ?{arc:clamp01(progress),cells:clamp01((progress-.4)/.6)}
    :hexShieldFormationStage(progress)):{arc:1,cells:1};
  const whiteFlash=clamp01(flash);
  const visualScale=hexShieldFlashScale(whiteFlash);
  const visualRadius=radius*visualScale;
  const arc=Array.from({length:65},(_,i)=>
    hexShieldArcTip(i/64,cx,cy,visualRadius));
  const arcCount=Math.min(arc.length,1+Math.floor(stage.arc*(arc.length-1)));
  const currentArc=arc.slice(0,arcCount);
  if(mode==='forming'&&stage.arc>0&&stage.arc<1)
    currentArc.push(hexShieldArcTip(stage.arc,cx,cy,visualRadius));
  const status=cannonShieldColor(shield,maxShield),rim=status;
  const pulse=mode==='active'?.045*(1+Math.sin(now*.0043)):.015;

  // Primeira fase: o arco azul é traçado da ESQUERDA para a DIREITA.
  // Não exibir preenchimento nem hexágonos antes do contorno completar.
  if(arcCount>=2){
    const rimOpacity=Math.max(.40,opacity)*(.52+pulse);
    graphics.lineStyle(8,rim,rimOpacity*.13);
    graphics.strokePoints(currentArc,false);
    graphics.lineStyle(3,rim,rimOpacity*.94);
    graphics.strokePoints(currentArc,false);
    graphics.lineStyle(1.2,status,rimOpacity*.72);
    graphics.strokePoints(currentArc,false);
  }

  // A ponta do traço vira uma solda azul brilhante com cauda curta.
  if(mode==='forming'&&stage.arc>0&&stage.arc<1){
    const tip=hexShieldArcTip(stage.arc,cx,cy,visualRadius);
    for(let i=7;i>=1;i--){
      const a=hexShieldArcTip(Math.max(0,stage.arc-i*.012),
        cx,cy,visualRadius);
      const b=hexShieldArcTip(Math.max(0,stage.arc-(i-1)*.012),
        cx,cy,visualRadius);
      const strength=(8-i)/7;
      graphics.lineStyle(1.2+1.8*strength,status,opacity*.46*strength);
      graphics.lineBetween(a.x,a.y,b.x,b.y);
    }
    graphics.fillStyle(status,opacity*.10);
    graphics.fillCircle(tip.x,tip.y,16);
    graphics.fillStyle(status,opacity*.27);
    graphics.fillCircle(tip.x,tip.y,10);
    graphics.fillStyle(status,opacity*.80);
    graphics.fillCircle(tip.x,tip.y,4.5);
    graphics.fillStyle(0xffffff,opacity*.95);
    graphics.fillCircle(tip.x,tip.y,2);
  }

  if(stage.cells<=0)return;
  // Preenchimento mínimo para mostrar o canhão ATRÁS da cúpula.
  graphics.fillStyle(status,.024*opacity*stage.cells);
  graphics.fillPoints([{x:cx-visualRadius,y:cy},...arc,{x:cx+visualRadius,y:cy}],true);

  // Segunda fase: linhas, preenchimento e ponto central idênticos em
  // cada hexágono, aparecendo da ESQUERDA para a DIREITA.
  const visibleCount=Math.min(total,Math.ceil(stage.cells*total));
  for(let i=0;i<visibleCount;i++){
    const cell=cells[i];
    const localOpacity=opacity*hexShieldCellOpacity(cell,i,now,radius);
    const vertices=cell.points.map(p=>({
      x:cx+p.x*visualScale,y:cy+p.y*visualScale,
    }));
    graphics.fillStyle(status,localOpacity*.049);
    graphics.fillPoints(vertices,true);
    graphics.lineStyle(1,status,localOpacity*.46);
    graphics.strokePoints(vertices,true);
    // Pequena bolinha EM TODOS os centros, com a mesma pulsação.
    graphics.fillStyle(status,localOpacity*.69);
    graphics.fillCircle(cx+cell.x*visualScale,cy+cell.y*visualScale,1.8);
    graphics.fillStyle(status,localOpacity*.24);
    graphics.fillCircle(cx+cell.x*visualScale,cy+cell.y*visualScale,.75);
    if(whiteFlash>0){
      graphics.lineStyle(1.6,0xffffff,whiteFlash*.85);
      graphics.strokePoints(vertices,true);
      graphics.fillStyle(0xffffff,whiteFlash*.95);
      graphics.fillCircle(cx+cell.x*visualScale,cy+cell.y*visualScale,2.1);
    }
  }
  graphics.lineStyle(2,status,opacity*.55);
  graphics.lineBetween(cx-visualRadius,cy,cx-visualRadius+16,cy);
  graphics.lineBetween(cx+visualRadius-16,cy,cx+visualRadius,cy);

  // Terceira fase: uma única descarga BRANCA de fechamento da cúpula.
  // O flash dura poucos frames e deixa o domo azul novamente.
  if(whiteFlash>0){
    graphics.lineStyle(7,0xffffff,whiteFlash*.24);
    graphics.strokePoints(arc,false);
    graphics.lineStyle(3,0xffffff,whiteFlash*.98);
    graphics.strokePoints(arc,false);
    graphics.fillStyle(0xffffff,whiteFlash*.055);
    graphics.fillPoints([{x:cx-visualRadius,y:cy},...arc,{x:cx+visualRadius,y:cy}],true);
  }
}
