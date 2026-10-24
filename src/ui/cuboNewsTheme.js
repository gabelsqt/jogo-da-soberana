// Cubo News — versão azul-noturno jornalístico. A emissora precisa transmitir
// notícias absurdas sem competir com o cenário colorido do jogo.
export const CUBO_FONT="'IBM Plex Sans',system-ui,sans-serif";
export const CUBO_NUMBER_FONT="'IBM Plex Mono',ui-monospace,monospace";
export const CUBO_COLORS=Object.freeze({
  navy:0x0b1621,card:0x193043,red:0xc45151,redDark:0x101d2b,
  silver:0xdce8ee,white:0xdce8ee,teal:0x547c92,muted:0x93aabe,
  green:0x193043,gold:0xe2a45e,cream:0xdce8ee,graphite:0x0b1621,
});
export function addCuboPixelText(scene,{
  x,y,text,size=2,color='#dce8ee',depth=45,maxWidth=null,
}){
  // Nome legado mantido para não quebrar os menus: texto NÃO pixelado.
  const px=Math.max(18,Math.round(size*7+7));
  const label=scene.add.text(x,y,String(text),{
    fontFamily:CUBO_FONT,fontSize:px+'px',fontStyle:'bold',
    color,align:'center',
  }).setOrigin(0.5).setDepth(depth);
  if(maxWidth&&label.width>maxWidth)label.setScale(maxWidth/label.width);
  return label;
}
export function addCuboBroadcastFrame(scene,{
  section='Central de transmissões',
  headline='O Rio não vai cair',
  footer='Cobertura especial da defesa brasileira',
  depth=40,shade=0,
}={}){
  const W=960,H=540,objects=[];
  // Rastrear cada parte da moldura para cutscenes poderem descartá-la
  // completamente sem afetar a faixa Cubo News permanente do combate.
  const a={
    rectangle:(...args)=>{const item=scene.add.rectangle(...args);objects.push(item);return item;},
    text:(...args)=>{const item=scene.add.text(...args);objects.push(item);return item;},
  };
  if(shade>0)a.rectangle(W/2,H/2,W,H,CUBO_COLORS.graphite,shade).setDepth(depth-3);
  a.rectangle(W/2,27,W,54,CUBO_COLORS.navy,0.98)
    .setStrokeStyle(2,0x30495b).setDepth(depth);
  a.rectangle(78,24,143,34,CUBO_COLORS.card).setDepth(depth+1);
  a.rectangle(78,42,143,3,CUBO_COLORS.gold).setDepth(depth+2);
  a.text(78,22,'CUBO NEWS',{
    fontFamily:CUBO_FONT,fontSize:'20px',fontStyle:'bold',color:'#dce8ee',
  }).setOrigin(0.5).setDepth(depth+2);
  a.text(166,17,section,{
    fontFamily:CUBO_FONT,fontSize:'17px',fontStyle:'bold',color:'#dce8ee',
  }).setDepth(depth+2);
  a.text(166,38,headline,{
    fontFamily:CUBO_FONT,fontSize:'12px',color:'#93aabe',
  }).setDepth(depth+2);
  a.rectangle(888,21,122,25,CUBO_COLORS.card).setDepth(depth+1);
  a.text(888,21,'● AO VIVO',{
    fontFamily:CUBO_FONT,fontSize:'13px',fontStyle:'bold',color:'#e2a45e',
  }).setOrigin(0.5).setDepth(depth+2);
  a.rectangle(W/2,54,W,2,0x435f73).setDepth(depth+1);
  a.rectangle(W/2,H-15,W,30,CUBO_COLORS.navy,0.99).setDepth(depth);
  a.rectangle(W/2,H-29,W,2,0x435f73).setDepth(depth+1);
  a.rectangle(77,H-15,150,24,CUBO_COLORS.red).setDepth(depth+1);
  a.text(77,H-15,'PLANTÃO',{
    fontFamily:CUBO_FONT,fontSize:'15px',fontStyle:'bold',color:'#ffffff',
  }).setOrigin(0.5).setDepth(depth+2);
  a.text(169,H-15,footer,{
    fontFamily:CUBO_FONT,fontSize:'12px',color:'#dce8ee',
  }).setOrigin(0,0.5).setDepth(depth+2);
  return objects;
}
export function addCuboPanel(scene,{
  x=480,y=269,width=750,height=360,depth=41,
  accent=CUBO_COLORS.gold,title=null,
}={}){
  const panel=scene.add.rectangle(x,y,width,height,CUBO_COLORS.card,0.95)
    .setStrokeStyle(2,accent).setDepth(depth);
  scene.add.rectangle(x-width/2+6,y-height/2+5,width-12,3,accent).setDepth(depth+1);
  if(title)scene.add.text(x-width/2+17,y-height/2+14,title,{
    fontFamily:CUBO_FONT,fontSize:'14px',fontStyle:'bold',color:'#dce8ee',
  }).setDepth(depth+2);
  return panel;
}
