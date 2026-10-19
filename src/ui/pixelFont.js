// Fonte bitmap 5×7 autoral, sem dependência de CDN/fontes externas.
// Usada no HUD estático (fora do canvas Phaser) e na abertura das ondas.
const rows={
  A:['01110','10001','10001','11111','10001','10001','10001'],
  B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'],
  D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'],
  F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01111'],
  H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['11111','00100','00100','00100','00100','00100','11111'],
  J:['00111','00010','00010','00010','10010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'],
  L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'],
  N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'],
  P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'],
  R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'],
  T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'],
  V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','10101','01010'],
  X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'],
  Z:['11111','00001','00010','00100','01000','10000','11111'],
  '0':['01110','10011','10101','10101','11001','10001','01110'],
  '1':['00100','01100','00100','00100','00100','00100','01110'],
  '2':['01110','10001','00001','00010','00100','01000','11111'],
  '3':['11110','00001','00001','00110','00001','00001','11110'],
  '4':['00010','00110','01010','10010','11111','00010','00010'],
  '5':['11111','10000','10000','11110','00001','00001','11110'],
  '6':['01110','10000','10000','11110','10001','10001','01110'],
  '7':['11111','00001','00010','00100','01000','01000','01000'],
  '8':['01110','10001','10001','01110','10001','10001','01110'],
  '9':['01110','10001','10001','01111','00001','00001','01110'],
  ' ':['00000','00000','00000','00000','00000','00000','00000'],
  '!':['00100','00100','00100','00100','00100','00000','00100'],
  '?':['01110','10001','00001','00010','00100','00000','00100'],
  '.':['00000','00000','00000','00000','00000','01100','01100'],
  ',':['00000','00000','00000','00000','00100','00100','01000'],
  ':':['00000','00100','00100','00000','00100','00100','00000'],
  ';':['00000','00100','00100','00000','00100','00100','01000'],
  '-':['00000','00000','00000','11111','00000','00000','00000'],
  '/':['00001','00001','00010','00100','01000','10000','10000'],
  '+':['00000','00100','00100','11111','00100','00100','00000'],
  '%':['11001','11001','00010','00100','01000','10011','10011'],
  "'":['00100','00100','00000','00000','00000','00000','00000'],
  '"':['01010','01010','00000','00000','00000','00000','00000'],
  '(':['00010','00100','01000','01000','01000','00100','00010'],
  ')':['01000','00100','00010','00010','00010','00100','01000'],
  '*':['00000','10101','01110','11111','01110','10101','00000'],
  '=':['00000','11111','00000','11111','00000','00000','00000'],
};
// Letras minúsculas desenhadas individualmente em 5×7 — não converter o texto inteiro para maiúsculas.
const lowerRows={
  a:['00000','00000','01110','00001','01111','10001','01111'],
  b:['10000','10000','10110','11001','10001','10001','11110'],
  c:['00000','00000','01111','10000','10000','10000','01111'],
  d:['00001','00001','01101','10011','10001','10001','01111'],
  e:['00000','00000','01110','10001','11111','10000','01111'],
  f:['00110','01001','01000','11100','01000','01000','01000'],
  g:['00000','01111','10001','10001','01111','00001','11110'],
  h:['10000','10000','10110','11001','10001','10001','10001'],
  i:['00100','00000','01100','00100','00100','00100','01110'],
  j:['00010','00000','00110','00010','00010','10010','01100'],
  k:['10000','10000','10010','10100','11000','10100','10010'],
  l:['01100','00100','00100','00100','00100','00100','01110'],
  m:['00000','00000','11010','10101','10101','10101','10101'],
  n:['00000','00000','10110','11001','10001','10001','10001'],
  o:['00000','00000','01110','10001','10001','10001','01110'],
  p:['00000','11110','10001','10001','11110','10000','10000'],
  q:['00000','01111','10001','10001','01111','00001','00001'],
  r:['00000','00000','10110','11001','10000','10000','10000'],
  s:['00000','00000','01111','10000','01110','00001','11110'],
  t:['01000','01000','11110','01000','01000','01001','00110'],
  u:['00000','00000','10001','10001','10001','10011','01101'],
  v:['00000','00000','10001','10001','10001','01010','00100'],
  w:['00000','00000','10001','10001','10101','10101','01010'],
  x:['00000','00000','10001','01010','00100','01010','10001'],
  y:['00000','10001','10001','10001','01111','00001','01110'],
  z:['00000','00000','11111','00010','00100','01000','11111'],
};
Object.assign(rows,lowerRows);
const glyphs=Object.fromEntries(Object.entries(rows).map(([char,bits])=>
  [char,bits.map(row=>Number.parseInt(row,2))]));
export const PIXEL_GLYPH_WIDTH=5;
export const PIXEL_GLYPH_HEIGHT=7;
// Legado: normalização em caixa alta continua disponível para ferramentas antigas.
export function normalizePixelText(text){
  return String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toUpperCase().replace(/[^A-Z0-9 !?.,:;\-\/+'"%()*=]/g,'?');
}
// Renderizador novo, mantendo o caso original e os acentos brasileiros.
export function normalizePixelMixedCase(text){
  return String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^A-Za-z0-9 !?.,:;\-\/+'"%()*=]/g,'?');
}
export function pixelTextWidth(text,pixel=2,spacing=1){
  return Math.max(1,(normalizePixelMixedCase(text).length*(PIXEL_GLYPH_WIDTH+spacing)-spacing)*pixel);
}
export function drawPixelText(canvas,text,{
  pixel=2,spacing=1,color='#ffffff',background=null,
  paddingX=0,paddingY=0,minWidth=0,maxWidth=Infinity,
}={}){
  if(!canvas?.getContext)return false;
  // Mantém acentos visuais (Á, É, Í etc.) dentro da fonte 5×7 em vez
  // de simplesmente apagar a acentuação do português.
  const original=Array.from(String(text??''));
  const value=normalizePixelMixedCase(text);
  const accents=original.map(char=>{
    const n=char.normalize('NFD');
    return {
      acute:n.includes('\u0301'),
      grave:n.includes('\u0300'),
      circumflex:n.includes('\u0302'),
      tilde:n.includes('\u0303'),
      cedilla:n.includes('\u0327'),
    };
  });
  const offsetTop=accents.some(a=>a.acute||a.grave||a.circumflex||a.tilde)?2:0;
  const offsetBottom=accents.some(a=>a.cedilla)?2:0;
  const step=(PIXEL_GLYPH_WIDTH+spacing)*pixel;
  const padded=Math.ceil(Math.max(minWidth,Math.min(maxWidth,pixelTextWidth(value,pixel,spacing)+paddingX*2)));
  canvas.width=Math.max(1,padded);
  canvas.height=(PIXEL_GLYPH_HEIGHT+offsetTop+offsetBottom)*pixel+paddingY*2;
  const ctx=canvas.getContext('2d');
  if(!ctx)return false;
  ctx.imageSmoothingEnabled=false;
  if(background){ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);}
  ctx.fillStyle=color;
  for(let i=0;i<value.length;i++){
    const x=paddingX+i*step;
    if(x+5*pixel>canvas.width-paddingX)break;
    const bitmap=glyphs[value[i]]||glyphs['?'];
    const top=paddingY+offsetTop*pixel;
    const a=accents[i]||{};
    if(a.acute||a.grave){
      ctx.fillRect(x+(a.grave?1:3)*pixel,paddingY,pixel,pixel);
      ctx.fillRect(x+2*pixel,paddingY+pixel,pixel,pixel);
    }else if(a.circumflex){
      ctx.fillRect(x+2*pixel,paddingY,pixel,pixel);
      ctx.fillRect(x+pixel,paddingY+pixel,pixel,pixel);
      ctx.fillRect(x+3*pixel,paddingY+pixel,pixel,pixel);
    }else if(a.tilde){
      ctx.fillRect(x+pixel,paddingY,pixel,pixel);
      ctx.fillRect(x+3*pixel,paddingY,pixel,pixel);
      ctx.fillRect(x+2*pixel,paddingY+pixel,pixel,pixel);
    }
    for(let y=0;y<PIXEL_GLYPH_HEIGHT;y++){
      for(let col=0;col<5;col++)if(bitmap[y]&(1<<(4-col)))
        ctx.fillRect(x+col*pixel,top+y*pixel,pixel,pixel);
    }
    if(a.cedilla){
      ctx.fillRect(x+2*pixel,top+7*pixel,pixel,pixel);
      ctx.fillRect(x+pixel,top+8*pixel,pixel,pixel);
    }
  }
  return true;
}
