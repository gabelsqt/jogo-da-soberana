// Cubo News v0.49 — botões sóbrios azul-noturno, com destaque em âmbar, IBM Plex Sans.
export function addMenuButton(scene,{
  x,y,width=280,height=52,text,onClick,primary=false,
  fontSize='19px',depth=10,
}){
  const fill=primary?0xe2a45e:0x193043;
  const hover=primary?0xf3bd7a:0x30536b;
  const border=primary?0xdce8ee:0x547c92;
  const ink=primary?'#0b1621':'#dce8ee';
  const shadow=scene.add.rectangle(x+4,y+5,width,height,0x07111b,0.83)
    .setDepth(depth-1);
  const background=scene.add.rectangle(x,y,width,height,fill,0.98)
    .setStrokeStyle(3,border).setDepth(depth)
    .setInteractive({useHandCursor:true});
  const bar=scene.add.rectangle(x-width/2+6,y,6,height-10,
    primary?0x0b1621:0xc45151).setDepth(depth+1);
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


// Um botão Cubo News é composto de quatro GameObjects independentes.
// destroy() no retângulo principal NÃO remove as outras peças.
export function destroyMenuButton(button) {
  if (!button) return;
  button.label?.destroy();
  button.cuboDecoration?.bar?.destroy();
  button.cuboDecoration?.shadow?.destroy();
  button.destroy();
}
