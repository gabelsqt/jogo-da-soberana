// Visualizador reutilizável de palavras ondulantes, sem dependência de CSS.
// Cada letra sobe/desce individualmente; exposição controlada pelo typewriter.
export function wavyLetterOffset(timeMs,index,amplitude=2){
  return Math.sin(timeMs*0.004+index*0.62)*amplitude;
}

export function createWavyWord(scene,{
  word,x,y,fontFamily="'IBM Plex Sans',system-ui,sans-serif",
  fontSize=21,color='#ffa84b',stroke='#56352b',strokeThickness=1,
  amplitude=2,center=false,depth=30,
}){
  const value=Array.from(word);
  const style={fontFamily,fontSize:fontSize+'px',fontStyle:'bold',
    color,stroke,strokeThickness};
  const probe=scene.add.text(0,0,word,style);
  const ctx=probe.context;
  const advances=value.map(letter=>ctx.measureText(letter).width);
  probe.destroy();
  const total=advances.reduce((sum,n)=>sum+n,0);
  let offset=x-(center?total/2:0);
  const glyphs=[];
  value.forEach((letter,i)=>{
    const glyph=scene.add.text(offset,y,letter,style).setDepth(depth);
    glyphs.push(glyph);
    offset+=advances[i];
  });
  let revealed=0;
  return {
    glyphs,
    setRevealed(count){
      revealed=Math.max(0,Math.min(glyphs.length,Math.floor(count)));
      glyphs.forEach((glyph,i)=>glyph.setVisible(i<revealed));
    },
    tick(timeMs){
      for(let i=0;i<revealed;i++)glyphs[i].setY(
        y+wavyLetterOffset(timeMs,i,amplitude));
    },
  };
}
