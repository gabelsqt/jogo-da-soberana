// Rota mundial Full Brazil: placeholders editáveis, nunca cidades definitivas.
// Substituir city/statue/backgroundKey conforme o usuário fornecer os cenários.
export const VOYAGE_STOPS=Object.freeze([
  {id:'parada-1',city:'CIDADE 1 • A DEFINIR',statue:'ESTÁTUA DE BRAÇOS ABERTOS',backgroundKey:'voyage-city-1',accent:0x3574a0,events:13},
  {id:'parada-2',city:'CIDADE 2 • A DEFINIR',statue:'ESTÁTUA DE BRAÇOS ABERTOS',backgroundKey:'voyage-city-2',accent:0x5475ac,events:15},
  {id:'parada-3',city:'CIDADE 3 • A DEFINIR',statue:'ESTÁTUA DE BRAÇOS ABERTOS',backgroundKey:'voyage-city-3',accent:0x705ea6,events:17},
  {id:'parada-4',city:'CIDADE 4 • A DEFINIR',statue:'ESTÁTUA DE BRAÇOS ABERTOS',backgroundKey:'voyage-city-4',accent:0x94609b,events:19},
].map(stop=>Object.freeze(stop)));
export function fullBrazilVoyageEligible(mode,campaign,{lab=false,playtest=false,waveMaker=false}={}){
  return mode==='wave11'&&!lab&&!playtest&&!waveMaker&&
    Array.isArray(campaign?.choices)&&campaign.choices.length===10&&
    campaign.choices.every(country=>country==='br');
}
export function voyageStop(index){
  return VOYAGE_STOPS[Math.max(0,Math.min(VOYAGE_STOPS.length-1,Math.trunc(index)||0))];
}
export function voyageEvents(index){
  const stop=voyageStop(index),rank=VOYAGE_STOPS.indexOf(stop);
  const kinds=[
    {type:1,pattern:'swarm',count:5},{type:2,pattern:'tactical',count:3},
    {type:1,pattern:'spread',count:5},{type:4,pattern:'pincer'},
    {type:3,pattern:'bomberFan',count:2},{type:1,pattern:'swarm',count:6},
    {type:2,pattern:'tactical',count:4},{type:5},
  ];
  return Array.from({length:stop.events},(_,i)=>{
    const pattern=kinds[(i+rank)%kinds.length];
    const at=1500+i*Math.max(3000,3800-rank*200);
    return {...pattern,at,level:Math.min(10,6+rank+Math.floor(i/6)),
      ...(i===0?{warning:'ESTÁTUA SOB ATAQUE • REFORÇOS ALIENÍGENAS!'}:{})};
  });
}
export function voyageCanDepart({elapsed,spawned,scheduled,enemies,hostileShots,portals=0,lastAt=0}){
  return scheduled>0&&spawned>=scheduled&&enemies===0&&hostileShots===0&&
    portals===0&&elapsed>=lastAt+3500;
}
export function voyageNext(index){
  return index+1<VOYAGE_STOPS.length?index+1:null;
}
