// Viagem Full Brazil: o canhão tem um eixo X fixo e volta à mesma altura.
// A estrutura do prédio aparece por baixo do canhão enquanto o conjunto sobe.
export const VOYAGE_PREPARE_MS=450;
export const VOYAGE_LAUNCH_MS=1000;
export const VOYAGE_SPACE_MS=4000;
export const VOYAGE_LANDING_MS=1000;
export const VOYAGE_TOTAL_MS=VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS+VOYAGE_LANDING_MS;
export const VOYAGE_STAR_COLORS=Object.freeze([
  0xffffff, // branco clássico
  0xc6e6ff, // azul claro
  0x83b9f8, // azul intenso
  0xc2fff3, // ciano
  0xffe9b1, // dourado quente
  0xe0c6ff, // violeta suave
  0xffcde0, // rosa pálido
]);
const clamp01=n=>Math.max(0,Math.min(1,n));
export function voyageTravelPhase(ms){
  const t=Math.max(0,Number(ms)||0);
  if(t<VOYAGE_PREPARE_MS)return 'prepare';
  if(t<VOYAGE_LAUNCH_MS)return 'launch';
  if(t<VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS)return 'space';
  if(t<VOYAGE_TOTAL_MS)return 'landing';
  return 'done';
}
export function voyageRocketPose(ms,{x=480,startY=454,groundY=startY}={}){
  const t=Math.max(0,Number(ms)||0),phase=voyageTravelPhase(t);
  // A nave não desaparece da tela no fim da arrancada nem salta de
  // posição ao começar o campo de estrelas. O canhão mantém o tamanho.
  const cruiseY=Math.max(165,startY-270);
  if(phase==='prepare'){
    const p=clamp01(t/VOYAGE_PREPARE_MS);
    return {phase,x,y:startY+Math.sin(t*.055)*1.2*p,scale:1,
      thrust:.20+.75*p,flare:p};
  }
  if(phase==='launch'){
    const p=clamp01((t-VOYAGE_PREPARE_MS)/(VOYAGE_LAUNCH_MS-VOYAGE_PREPARE_MS));
    // Aceleração cúbica, sem qualquer mudança no eixo horizontal.
    return {phase,x,y:startY-(startY-cruiseY)*p*p*p,scale:1,
      thrust:1.35+p*1.4,flare:1};
  }
  if(phase==='space'){
    // O cenário se move e o foguete conserva sua posição em tela.
    return {phase,x,y:cruiseY,scale:1,thrust:1.15,flare:.70};
  }
  if(phase==='landing'){
    const p=clamp01((t-VOYAGE_LAUNCH_MS-VOYAGE_SPACE_MS)/VOYAGE_LANDING_MS);
    // Descer somente no eixo Y e desacelerar na altura exata de origem.
    const eased=1-Math.pow(1-p,3);
    return {phase,x,y:cruiseY+(groundY-cruiseY)*eased,scale:1,
      thrust:.8*(1-p),flare:1-p};
  }
  return {phase,x,y:groundY,scale:1,thrust:0,flare:0};
}
export function voyageStarfield(count=85,width=960,height=540){
  return Array.from({length:count},(_,i)=>{
    // Mistura não sequencial para evitar faixas da mesma cor/tamanho.
    const hash=(i*53+i*i*17+11)>>>0;
    const size=hash%19===0?5:hash%11===0?4:
      hash%5===0?3:hash%3===0?2:1;
    return {
      x:(i*193+17)%width,y:(i*113+41)%height,
      speed:240+(i*61)%740,
      size,
      // Cor e luminosidade independentes da amostragem dos tamanhos.
      color:VOYAGE_STAR_COLORS[(i*5+Math.floor(i/3))%VOYAGE_STAR_COLORS.length],
      alpha:.45+((i*11+Math.floor(i/5))%7)*.075,
      twinklePhase:(i*73%29)*.37,
    };
  });
}
export function voyageStarAt(star,elapsedMs,height=540){
  // Foguete sobe: estrelas descem verticalmente, com parallax.
  const y=((star.y+star.speed*Math.max(0,elapsedMs)/1000)%height+height)%height;
  return {...star,y};
}
