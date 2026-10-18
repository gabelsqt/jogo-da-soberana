import {
  TYPE6_PALETTES, TYPE6_WIDTH, TYPE6_HEIGHT,
  type6ModuleVisualState,
} from './type6Boss.js';

// Visual vetorial provisório desenhado em blocos, pronto para futura sprite sheet.
export function drawType6Ship(g,state,ageMs=0) {
  const p=TYPE6_PALETTES[state.country];
  const pulse=0.5+0.5*Math.sin(ageMs*0.008);
  g.clear();
  // Silhueta blindada, construída em camadas industriais.
  g.fillStyle(0x080c14,0.92);
  g.fillRoundedRect(-TYPE6_WIDTH/2,-TYPE6_HEIGHT/2,TYPE6_WIDTH,TYPE6_HEIGHT,14);
  g.fillStyle(p.metal);
  g.fillPoints([
    {x:-394,y:-20},{x:-342,y:-54},{x:-94,y:-48},{x:-60,y:-59},
    {x:60,y:-59},{x:94,y:-48},{x:342,y:-54},{x:394,y:-20},
    {x:382,y:36},{x:316,y:58},{x:86,y:42},{x:52,y:60},
    {x:-52,y:60},{x:-86,y:42},{x:-316,y:58},{x:-382,y:36},
  ],true);
  g.lineStyle(4,p.edge,0.96);
  g.strokePoints([
    {x:-393,y:-20},{x:-342,y:-54},{x:-94,y:-48},{x:-60,y:-59},
    {x:60,y:-59},{x:94,y:-48},{x:342,y:-54},{x:393,y:-20},
    {x:382,y:36},{x:316,y:58},{x:86,y:42},{x:52,y:60},
    {x:-52,y:60},{x:-86,y:42},{x:-316,y:58},{x:-382,y:36},
  ],true);
  g.fillStyle(0x0c121c,0.95).fillRect(-343,-37,686,14);
  g.fillStyle(p.edge,0.22).fillRect(-314,-28,628,5);
  // Segmentação do casco em placa e juntas.
  for(let i=-6;i<=6;i++){
    const x=i*51;
    g.fillStyle(i%2?p.edge:0x03050a,0.18).fillRect(x-2,-44,4,84);
    g.fillStyle(p.light,0.32+0.18*pulse).fillRect(x-9,42,18,4);
  }
  // Núcleo lacrado até os quatro módulos serem abatidos.
  g.fillStyle(0x060912,1).fillRoundedRect(-63,-54,126,106,14);
  g.lineStyle(4,p.edge,0.78).strokeRoundedRect(-63,-54,126,106,14);
  if(state.coreExposed){
    g.fillStyle(p.light,0.18+0.20*pulse).fillCircle(0,0,45);
    g.lineStyle(4,p.light,0.85).strokeCircle(0,0,41);
    g.fillStyle(p.glow,0.87).fillCircle(0,0,24+2*pulse);
    g.fillStyle(0xffffff,0.85).fillCircle(0,0,11);
    if(state.charging){
      const power=0.3+0.7*pulse;
      g.lineStyle(8,p.glow,0.3+0.5*power).strokeCircle(0,0,52+4*pulse);
      g.lineStyle(3,0xffffff,0.6+0.4*pulse).strokeCircle(0,0,58);
      for(let k=0;k<8;k++){
        const a=k*Math.PI/4+ageMs*0.0012;
        g.lineStyle(2,p.light,0.4+0.6*pulse);
        g.lineBetween(Math.cos(a)*54,Math.sin(a)*54,
          Math.cos(a+0.3)*73,Math.sin(a+0.3)*73);
      }
    }
  }else{
    g.fillStyle(p.edge,0.6).fillRect(-45,-22,90,44);
    g.fillStyle(0x0a121c).fillRect(-36,-14,72,29);
    for(let k=-2;k<=2;k++){
      g.fillStyle(p.light,0.20+0.25*pulse).fillRect(k*13-4,-6,8,12);
    }
    if(state.charging){
      g.lineStyle(4,p.glow,0.40+0.55*pulse).strokeCircle(0,0,52);
    }
  }
  // Quatro módulos simétricos, mas com funções e estado de dano individuais.
  for(const module of state.modules){
    const x=module.offsetX,y=module.offsetY;
    const damage=type6ModuleVisualState(module);
    g.fillStyle(0x05070d).fillRoundedRect(x-60,y-44,120,88,8);
    g.fillStyle(module.broken?0x141319:damage>=2?0x27242b:p.metal)
      .fillRoundedRect(x-54,y-39,108,78,5);
    g.lineStyle(3,module.broken?0x4b4b4d:p.edge,0.9)
      .strokeRoundedRect(x-54,y-39,108,78,5);
    g.fillStyle(module.broken?0x0a0c11:0x131d29).fillRect(x-41,y-23,82,48);
    // Dutos, armações e luzes marcam as diferentes funções dos módulos.
    for(let k=-2;k<=2;k++){
      g.fillStyle(module.broken?0x333033:p.edge,0.60).fillRect(x+k*17-3,y-34,7,8);
    }
    if(module.role==='cannon'||module.role==='missiles'){
      g.fillStyle(module.broken?0x2b2426:p.edge).fillRect(x-23,y+12,46,31);
      for(const barrel of (module.role==='missiles'?[-17,0,17]:[-10,10])){
        g.fillStyle(module.broken?0x07080a:0x050b17).fillRect(x+barrel-5,y+18,10,22);
      }
    }else if(module.role==='summoner'){
      g.lineStyle(3,module.broken?0x4a3030:p.light,0.9).strokeCircle(x,y,23);
      g.fillStyle(module.broken?0x111016:p.glow,0.65).fillCircle(x,y,9);
    }else{
      g.lineStyle(3,module.broken?0x4a3030:p.edge).strokeRoundedRect(x-30,y-24,60,48,8);
      g.fillStyle(module.broken?0x151319:p.light,0.5).fillRect(x-7,y-24,14,48);
    }
    if(module.broken){
      // Carcaça não desaparece: fuligem, metal retorcido e descargas.
      g.fillStyle(0x09090b,0.72).fillRect(x-40,y-25,74,43);
      for(let k=0;k<4;k++){
        const dx=(k*19)%62-30;
        g.lineStyle(2,k%2?0x704e45:0x050505,0.86)
          .lineBetween(x+dx,y-28+k*10,x+dx+18,y+18+k*5);
      }
      if(Math.sin(ageMs*0.006+module.id*2.5)>0.86){
        g.fillStyle(0xffb56b,0.85).fillRect(x+17,y-26,5,4);
      }
    }else{
      if(damage>=1){
        g.lineStyle(2,0x0a050c,0.95).lineBetween(x-26,y-23,x+5,y+7);
        g.lineBetween(x+5,y+7,x+24,y+2);
      }
      if(damage>=2){
        g.fillStyle(0x13151b,0.65).fillCircle(x-15,y-29,22);
        g.lineStyle(3,0xffa36d,0.90).lineBetween(x+12,y-7,x+32,y-20);
      }
      g.fillStyle(p.light,0.38+0.60*pulse).fillRect(x-16,y-6,32,12);
      if(module.shield>0){
        const fraction=module.shield/module.maxShield;
        const color=fraction>0.65?0x5ae6ee:fraction>0.3?0xe8c06a:0xff6370;
        g.lineStyle(4,color,0.48+0.24*pulse);
        g.strokeRoundedRect(x-61,y-46,122,92,9);
        g.lineStyle(2,color,0.17+0.16*pulse)
          .strokeRoundedRect(x-65,y-50,130,100,12);
      }
    }
  }
}
