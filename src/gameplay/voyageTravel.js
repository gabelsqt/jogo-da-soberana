// Voo estritamente vertical do prédio-foguete: preparação, arrancada e pouso.
export const VOYAGE_PREPARE_MS=450;
export const VOYAGE_LAUNCH_MS=1000; // preparação 450 ms + aceleração 550 ms.
export const VOYAGE_SPACE_MS=4000;
export const VOYAGE_LANDING_MS=1000;
export const VOYAGE_TOTAL_MS=VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS+VOYAGE_LANDING_MS;
const clamp01=n=>Math.max(0,Math.min(1,n));
export function voyageTravelPhase(ms){
  const t=Math.max(0,Number(ms)||0);
  if(t<VOYAGE_PREPARE_MS)return 'prepare';
  if(t<VOYAGE_LAUNCH_MS)return 'launch';
  if(t<VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS)return 'space';
  if(t<VOYAGE_TOTAL_MS)return 'landing';
  return 'done';
}
export function voyageRocketPose(ms,{x=480,startY=454,groundY=390}={}){
  const t=Math.max(0,Number(ms)||0),phase=voyageTravelPhase(t);
  if(phase==='prepare'){
    // O motor vibra e acumula potência, SEM deriva lateral ou subida prematura.
    const p=clamp01(t/VOYAGE_PREPARE_MS);
    return {phase,x,y:startY+Math.sin(t*.055)*1.6*p,scale:1,
      thrust:.20+.75*p,flare:p};
  }
  if(phase==='launch'){
    const p=clamp01((t-VOYAGE_PREPARE_MS)/(VOYAGE_LAUNCH_MS-VOYAGE_PREPARE_MS));
    // Curva cúbica: arranca bruscamente e termina muito acima da tela.
    const rise=p*p*p;
    return {phase,x,y:startY-rise*770,scale:1-p*.27,
      thrust:1.35+p*1.4,flare:1};
  }
  if(phase==='space'){
    // Travado no eixo X. A velocidade é mostrada pelas estrelas em queda.
    return {phase,x,y:245,scale:.73,thrust:1.15,flare:.70};
  }
  if(phase==='landing'){
    const p=clamp01((t-VOYAGE_LAUNCH_MS-VOYAGE_SPACE_MS)/VOYAGE_LANDING_MS);
    // Começa FORA da parte superior e freia na última parte da descida.
    const eased=1-Math.pow(1-p,3);
    return {phase,x,y:-170+(groundY+170)*eased,scale:.73+p*.27,
      thrust:.8*(1-p),flare:1-p};
  }
  return {phase,x,y:groundY,scale:1,thrust:0,flare:0};
}
export function voyageStarfield(count=85,width=960,height=540){
  return Array.from({length:count},(_,i)=>({
    x:(i*193+17)%width,
    y:(i*113+41)%height,
    speed:260+(i*61)%670,
    size:i%9===0?3:i%3===0?2:1,
  }));
}
export function voyageStarAt(star,elapsedMs,height=540){
  // Foguete sobe: estrelas descem verticalmente, com parallax.
  const y=((star.y+star.speed*Math.max(0,elapsedMs)/1000)%height+height)%height;
  return {...star,y};
}
