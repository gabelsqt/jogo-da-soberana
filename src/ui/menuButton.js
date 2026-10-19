// Cubo News v0.49 — botões oficiais brasileiro verde/ouro, IBM Plex Sans.
export function addMenuButton(scene,{
  x,y,width=280,height=52,text,onClick,primary=false,
  fontSize='19px',depth=10,
}){
  const fill=primary?0xedc75a:0x134b45;
  const hover=primary?0xffdf7b:0x206c60;
  const border=primary?0xf5f0dc:0xedc75a;
  const ink=primary?'#152926':'#f5f0dc';
  const shadow=scene.add.rectangle(x+4,y+5,width,height,0x152926,0.83)
    .setDepth(depth-1);
  const background=scene.add.rectangle(x,y,width,height,fill,0.98)
    .setStrokeStyle(3,border).setDepth(depth)
    .setInteractive({useHandCursor:true});
  const bar=scene.add.rectangle(x-width/2+6,y,6,height-10,
    primary?0x152926:0xedc75a).setDepth(depth+1);
  const label=scene.add.text(x+2,y,String(text),{
    fontFamily:"'IBM Plex Sans',system-ui,sans-serif",
    fontSize,color:ink,fontStyle:'bold',align:'center',
    wordWrap:{width:width-25},
  }).setOrigin(0.5).setDepth(depth+1);
  background.on('pointerover',()=>{background.setFillStyle(hover,1);});
  background.on('pointerout',()=>{background.setFillStyle(fill,0.98);});
  background.on('pointerdown',(pointer,_x,_y,event)=>{
    if(!pointer.leftButtonDown())return;
    event?.stopPropagation();onClick();
  });
  background.label=label;
  background.cuboDecoration={shadow,bar};
  return background;
}
