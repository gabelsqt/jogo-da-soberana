// Sistema visual Cubo News v0.49 — Emissora Oficial Brasileira.
// Tipografia IBM Plex Sans (fallback local legível), sem fontes pixeladas na UI.
export const CUBO_FONT="'IBM Plex Sans',system-ui,sans-serif";
export const CUBO_COLORS=Object.freeze({
  navy:0x152926,card:0x134b45,red:0xedc75a,redDark:0x152926,
  silver:0xf5f0dc,white:0xf5f0dc,teal:0x134b45,muted:0xc8dfd8,
  green:0x134b45,gold:0xedc75a,cream:0xf5f0dc,graphite:0x152926,
});
// Nome mantido para compatibilidade com cenas da v0.48; agora é texto real.
export function addCuboPixelText(scene,{
  x,y,text,size=2,color='#f5f0dc',depth=45,maxWidth=null,
}){
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
  const W=960,H=540,a=scene.add;
  if(shade>0)a.rectangle(W/2,H/2,W,H,CUBO_COLORS.graphite,shade).setDepth(depth-3);
  a.rectangle(W/2,27,W,54,CUBO_COLORS.green,0.98)
    .setStrokeStyle(2,0x5c8173).setDepth(depth);
  a.rectangle(78,24,142,35,CUBO_COLORS.gold).setDepth(depth+1);
  a.text(78,24,'CUBO NEWS',{
    fontFamily:CUBO_FONT,fontSize:'20px',fontStyle:'bold',color:'#152926',
  }).setOrigin(0.5).setDepth(depth+2);
  a.text(166,17,section,{
    fontFamily:CUBO_FONT,fontSize:'17px',fontStyle:'bold',color:'#f5f0dc',
  }).setDepth(depth+2);
  a.text(166,38,headline,{
    fontFamily:CUBO_FONT,fontSize:'12px',color:'#dbebe5',
  }).setDepth(depth+2);
  a.rectangle(888,21,122,25,CUBO_COLORS.graphite).setDepth(depth+1);
  a.text(888,21,'● AO VIVO',{
    fontFamily:CUBO_FONT,fontSize:'13px',fontStyle:'bold',color:'#edc75a',
  }).setOrigin(0.5).setDepth(depth+2);
  a.rectangle(W/2,54,W,4,CUBO_COLORS.gold).setDepth(depth+1);
  a.rectangle(W/2,H-15,W,30,CUBO_COLORS.graphite,0.99).setDepth(depth);
  a.rectangle(W/2,H-29,W,2,CUBO_COLORS.gold).setDepth(depth+1);
  a.rectangle(77,H-15,150,24,CUBO_COLORS.gold).setDepth(depth+1);
  a.text(77,H-15,'PLANTÃO',{
    fontFamily:CUBO_FONT,fontSize:'15px',fontStyle:'bold',color:'#152926',
  }).setOrigin(0.5).setDepth(depth+2);
  a.text(169,H-15,footer,{
    fontFamily:CUBO_FONT,fontSize:'12px',color:'#f5f0dc',
  }).setOrigin(0,0.5).setDepth(depth+2);
}
export function addCuboPanel(scene,{
  x=480,y=269,width=750,height=360,depth=41,
  accent=CUBO_COLORS.gold,title=null,
}={}){
  const panel=scene.add.rectangle(x,y,width,height,CUBO_COLORS.green,0.96)
    .setStrokeStyle(3,accent).setDepth(depth);
  scene.add.rectangle(x-width/2+6,y-height/2+5,width-12,4,accent).setDepth(depth+1);
  if(title)scene.add.text(x-width/2+17,y-height/2+14,title,{
    fontFamily:CUBO_FONT,fontSize:'14px',fontStyle:'bold',color:'#f5f0dc',
  }).setDepth(depth+2);
  return panel;
}
