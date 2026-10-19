// Botões retangulares da transmissão Cubo News. Compatíveis com tela touch,
// navegação atual, label.setText dos epílogos e testes Phaser anteriores.
export function addMenuButton(scene,{
  x,y,width=280,height=52,text,onClick,primary=false,
  fontSize='19px',depth=10,
}){
  const defaultColor=primary?0xb91e32:0x102941;
  const hoverColor=primary?0xdf3049:0x254d6b;
  const outlineColor=primary?0xffa7aa:0x7ca7bd;
  const shadow=scene.add.rectangle(x+4,y+5,width,height,0x020916,0.80)
    .setDepth(depth-1);
  const background=scene.add.rectangle(x,y,width,height,defaultColor,0.98)
    .setStrokeStyle(3,outlineColor).setDepth(depth)
    .setInteractive({useHandCursor:true});
  // Marcador de chamada jornalística; não rouba cliques.
  const bar=scene.add.rectangle(x-width/2+6,y,6,height-10,
    primary?0xffffff:0xe34a55).setDepth(depth+1);
  const label=scene.add.text(x+2,y,String(text),{
    fontFamily:'monospace',fontSize,color:'#f6f8ff',fontStyle:'bold',
    align:'center',wordWrap:{width:width-26},
  }).setOrigin(0.5).setDepth(depth+1);
  background.on('pointerover',()=>{
    background.setFillStyle(hoverColor,1);
    label.setColor('#ffffff');
    bar.setFillStyle(0xffffff);
  });
  background.on('pointerout',()=>{
    background.setFillStyle(defaultColor,0.98);
    label.setColor('#f6f8ff');
    bar.setFillStyle(primary?0xffffff:0xe34a55);
  });
  background.on('pointerdown',(pointer,_x,_y,event)=>{
    if(!pointer.leftButtonDown())return;
    event?.stopPropagation();
    onClick();
  });
  background.label=label;
  background.cuboDecoration={shadow,bar};
  return background;
}
