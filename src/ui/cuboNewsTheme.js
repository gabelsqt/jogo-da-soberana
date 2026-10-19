// Identidade reutilizável da Cubo News para telas Phaser (menus, laboratórios,
// pausa, negociações e epílogos). Fontes bitmap geradas em runtime: offline.
import {drawPixelText} from './pixelFont.js';

export const CUBO_COLORS=Object.freeze({
  navy:0x081527,card:0x10233b,red:0xc71e33,redDark:0x771626,
  silver:0xc4ccd6,white:0xf1f6ff,teal:0x81ddea,muted:0x95abc1,
});
function glyphTexture(scene,text,{pixel=3,color='#ffffff'}={}){
  // Chave estável por cena/texto, sem recriar a textura a cada visita ao menu.
  const id=Array.from(text).map(ch=>ch.codePointAt(0).toString(16)).join('-');
  const key='cubo-pixel-'+pixel+'-'+color.slice(1)+'-'+id;
  if(!scene.textures.exists(key)){
    if(typeof document==='undefined')return null;
    const canvas=document.createElement('canvas');
    drawPixelText(canvas,text,{pixel,color,paddingX:1,paddingY:2});
    scene.textures.addCanvas(key,canvas);
  }
  return key;
}
export function addCuboPixelText(scene,{
  x,y,text,size=2,color='#ffffff',depth=45,maxWidth=null,
}){
  const key=glyphTexture(scene,String(text),{pixel:size,color});
  if(!key){
    return scene.add.text(x,y,text,{fontFamily:'monospace',fontSize:size*7+'px',
      color,fontStyle:'bold'}).setOrigin(0.5).setDepth(depth);
  }
  const image=scene.add.image(x,y,key).setOrigin(0.5).setDepth(depth);
  if(maxWidth && image.width>maxWidth)image.setScale(maxWidth/image.width);
  return image;
}
/**
 * Moldura permanente para menus; não interferir no HUD externo de combate.
 * Header 0..68; footer 509..540. Deixar centro livre para interatividade.
 */
export function addCuboBroadcastFrame(scene,{
  section='Central de transmissões',
  headline='O Rio não vai cair',
  footer='Cobertura especial da defesa brasileira',
  depth=40,
  shade=0,
}={}){
  const W=960,H=540;
  const a=scene.add;
  if(shade>0)a.rectangle(W/2,H/2,W,H,CUBO_COLORS.navy,shade).setDepth(depth-3);
  a.rectangle(W/2,27,W,54,CUBO_COLORS.navy,0.97).setDepth(depth)
    .setStrokeStyle(2,0x506b84);
  a.rectangle(70,23,133,35,CUBO_COLORS.red).setDepth(depth+1)
    .setStrokeStyle(2,0xf5a0a7);
  addCuboPixelText(scene,{x:70,y:23,text:'Cubo News',size:2,
    color:'#ffffff',depth:depth+2,maxWidth:119});
  a.text(155,17,section,{
    fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#f1f6ff',
  }).setDepth(depth+2);
  a.text(155,38,headline,{
    fontFamily:'monospace',fontSize:'12px',color:'#afcce0',
  }).setDepth(depth+2);
  a.rectangle(882,19,117,22,CUBO_COLORS.red).setDepth(depth+1);
  a.text(882,19,'● AO VIVO',{
    fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#ffffff',
  }).setOrigin(0.5).setDepth(depth+2);
  a.rectangle(W/2,53,W,5,CUBO_COLORS.red).setDepth(depth+1);
  // Tarja inferior vermelha tipo ticker de telejornal.
  a.rectangle(W/2,H-15,W,30,CUBO_COLORS.redDark,0.98).setDepth(depth);
  a.rectangle(W/2,H-29,W,2,0xf26d70).setDepth(depth+1);
  a.rectangle(79,H-15,150,23,CUBO_COLORS.red).setDepth(depth+1);
  addCuboPixelText(scene,{x:79,y:H-15,text:'PLANTÃO',size:2,
    color:'#ffffff',depth:depth+2,maxWidth:128});
  a.text(169,H-15,footer,{
    fontFamily:'monospace',fontSize:'12px',color:'#ffffff',
  }).setOrigin(0,0.5).setDepth(depth+2);
}
export function addCuboPanel(scene,{
  x=480,y=269,width=750,height=360,depth=41,accent=CUBO_COLORS.red,
  title=null,
}={}){
  const panel=scene.add.rectangle(x,y,width,height,CUBO_COLORS.card,0.94)
    .setStrokeStyle(3,accent).setDepth(depth);
  scene.add.rectangle(x-width/2+6,y-height/2+5,width-12,4,accent).setDepth(depth+1);
  if(title)scene.add.text(x-width/2+17,y-height/2+14,title,{
    fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#ffffff',
  }).setDepth(depth+2);
  return panel;
}
