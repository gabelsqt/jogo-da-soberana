import {
  TYPE6_PALETTES, TYPE6_WIDTH, TYPE6_HEIGHT,
  type6ModuleVisualState,
} from './type6Boss.js';

// Órbitas de energia puramente cosméticas: partículas convergem para a
// eletrônica da fortaleza sem interagir com disparos nem causar colisões.
function drawEnergyIntake(g,x,y,time,radius,color,count=9,strength=1){
  const phase=time*0.00068;
  g.lineStyle(1.5,color,0.18*strength).strokeCircle(x,y,radius*.54);
  g.lineStyle(1,color,0.12*strength).strokeCircle(x,y,radius*.93);
  for(let i=0;i<count;i++){
    const progress=(phase*(0.8+(i%3)*0.11)+i/count)%1;
    const a=i*Math.PI*2/count+time*0.00048+(1-progress)*1.4;
    const r=8+(radius-8)*(1-progress);
    const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;
    const vx=-Math.cos(a)*Math.min(9,r*.22),vy=-Math.sin(a)*Math.min(9,r*.22);
    const alpha=(0.23+progress*0.57)*strength;
    g.lineStyle(i%3===0?2:1.5,i%4===0?0xffffff:color,alpha)
      .lineBetween(px,py,px+vx,py+vy);
    g.fillStyle(color,alpha).fillRect(px-1.5,py-1.5,3,3);
  }
  g.fillStyle(color,0.09*strength).fillCircle(x,y,Math.max(9,radius*.2));
}

// Visual vetorial provisório desenhado em blocos, pronto para futura sprite sheet.
export function drawType6Ship(g,state,ageMs=0,useHullSprite=false,useModuleSprites=false) {
  const p=TYPE6_PALETTES[state.country];
  const pulse=0.5+0.5*Math.sin(ageMs*0.008);
  const flashFor=t=>Number.isFinite(t)&&ageMs>=t?Math.max(0,1-(ageMs-t)/150):0;
  g.clear();
  // O último frame do atlas já contém os destroços; a camada de módulos
  // desaparece durante a sequência final, sem alterar o estado de combate.
  if(useHullSprite&&state.defeated)return;
  // Com um casco ilustrado, não desenhar placas procedurais por cima do PNG.
  // Os módulos, o núcleo, a barreira e os efeitos ficam em uma camada acima.
  if(!useHullSprite){
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
  // Personalidade das silhuetas nacionais sem alterar as hitboxes.
  if(state.country==='us'){
    g.fillStyle(0x8896ac,0.52).fillRect(-230,-35,460,12);
    g.lineStyle(3,0xffffff,0.75).lineBetween(-160,-29,160,-29);
    for(let i=-2;i<=2;i++)g.fillStyle(0xffc977,0.7).fillRect(i*72-12,-34,24,4);
  }else if(state.country==='ru'){
    for(let i=-5;i<=5;i++){
      const x=i*67;
      g.fillStyle(0x83cdeb,0.64).fillTriangle(x-19,-46,x,-66-(i%2)*7,x+19,-46);
      g.lineStyle(2,0xd9f9ff,0.8).strokeCircle(x,34,11);
    }
  }else if(state.country==='jp'){
    for(let i=-5;i<=5;i++){
      const x=i*64;
      g.fillStyle(i%2?0xef8bff:0x8cf2ff,0.7+0.2*pulse).fillRect(x-22,-49,44,4);
      g.fillStyle(0xffffff,0.35).fillRect(x-22,38,44,3);
    }
  }else if(state.country==='cn'){
    for(let i=-5;i<=5;i++){
      const x=i*60;
      g.lineStyle(3,0xe9a14f,0.74).lineBetween(x,-45,x+25,-65);
      g.lineBetween(x+25,-65,x+41,-65);
      g.fillStyle(0xb16e38,0.74).fillRect(x-15,37,30,12);
    }
  }else{
    for(let i=-4;i<=4;i++){
      const x=i*85;
      g.fillStyle(0x1b2735).fillRect(x-13,-64,26,20);
      g.fillStyle(p.light,0.55+0.3*pulse).fillRect(x-5,-65,10,6);
    }
  }
  }
  // Núcleo lacrado até os quatro módulos serem abatidos.
  g.fillStyle(0x060912,1).fillRoundedRect(-63,-54,126,106,14);
  g.lineStyle(4,p.edge,0.78).strokeRoundedRect(-63,-54,126,106,14);
  if(state.coreExposed && state.coreReveal>=1){
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
    const coreFlash=flashFor(state.hitAt);
    if(coreFlash>0){
      g.fillStyle(0xffffff,0.15+0.48*coreFlash).fillCircle(0,0,43);
      g.lineStyle(4,0xffffff,0.3+0.65*coreFlash).strokeCircle(0,0,48);
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
  // O atlas substitui apenas o metal procedural, nunca os escudos ou os efeitos.
  if(!useModuleSprites){
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
    if(module.role==='bombardment'||module.role==='laser'){
      g.fillStyle(module.broken?0x2b2426:p.edge).fillRect(x-23,y+12,46,31);
      for(const barrel of (module.role==='bombardment'?[-17,0,17]:[-10,10])){
        g.fillStyle(module.broken?0x07080a:0x050b17).fillRect(x+barrel-5,y+18,10,22);
      }
    }else if(module.role==='hangar'){
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
        const color=fraction>0.75?0x388bff:fraction>0.50?0x35c86d:
          fraction>0.25?0xf1cb35:0xf04a52;
        g.lineStyle(4,color,0.55+0.22*pulse);
        g.strokeRoundedRect(x-61,y-46,122,92,9);
        g.lineStyle(2,color,0.17+0.16*pulse);
        g.strokeRoundedRect(x-65,y-50,130,100,12);
      }

    }
  }
  }
  if(useModuleSprites){
    // Escudos independentes continuam como camada de feedback sobre o PNG.
    for(const module of state.modules){
      if(module.broken||module.shield<=0)continue;
      const x=module.offsetX,y=module.offsetY;
      const fraction=module.shield/module.maxShield;
      const color=fraction>0.75?0x388bff:fraction>0.50?0x35c86d:
        fraction>0.25?0xf1cb35:0xf04a52;
      g.lineStyle(4,color,0.55+0.22*pulse);
      g.strokeRoundedRect(x-61,y-46,122,92,9);
      g.lineStyle(2,color,0.17+0.16*pulse);
      g.strokeRoundedRect(x-65,y-50,130,100,12);
    }
  }
  // Cada módulo atrai energia visualmente; o laser de cerco possui
  // campo maior. A região central mantém sua própria convergência ampla.
  for(const module of state.modules){
    if(module.broken)continue;
    drawEnergyIntake(g,module.offsetX,module.offsetY,ageMs,
      module.role==='laser'?99:58,
      module.role==='laser'?p.glow:p.light,
      module.role==='laser'?15:9,module.role==='laser'?0.9:0.65);
  }
  drawEnergyIntake(g,0,0,ageMs,116,p.glow,18,
    state.coreExposed?0.95:0.53);

  // Flash de dano por módulo: não é afetado pela posição da hitbox.
  for(const module of state.modules){
    const flash=module.broken?0:flashFor(module.hitAt);
    if(flash<=0)continue;
    const x=module.offsetX,y=module.offsetY;
    g.fillStyle(0xffffff,0.13+0.43*flash).fillRoundedRect(x-54,y-39,108,78,5);
    g.lineStyle(3,module.shield>0?0x71cfff:0xffffff,0.38+0.6*flash)
      .strokeRoundedRect(x-58,y-43,116,86,7);
  }
  // Barreira frontal completa: azul ou roxo coreano, progredindo ao vermelho.
  const b=state.barrier;
  if(b.active&&b.hp>0){
    const fraction=Math.max(0,b.hp/b.maxHp);
    const tint=fraction>0.70?p.barrier:fraction>0.40?0xeec95d:0xff3b56;
    // Meio domo INVERTIDO (∪): extremidades próximas ao casco e arco
    // curvando-se para BAIXO. A colisão continua usando o retângulo
    // original da barreira (somente o desenho foi alterado).
    const arch=[];
    for(let j=0;j<=32;j++){
      const nx=-1+2*j/32;
      arch.push({x:nx*400,y:21+77*(1-nx*nx)});
    }
    g.fillStyle(tint,0.11+0.06*pulse);
    g.fillPoints([{x:-400,y:20},...arch,{x:400,y:20}],true);
    g.lineStyle(7,tint,0.46+0.24*pulse).strokePoints(arch,false);
    g.lineStyle(2,0xe1f9ff,0.48).strokePoints(
      arch.map(point=>({x:point.x*.985,y:point.y-6})),false);
    const cracks=fraction<0.65?fraction<0.30?10:5:0;
    for(let j=0;j<cracks;j++){
      const x=-370+((j*143)%740),nx=x/400;
      const y=21+77*(1-nx*nx)-12;
      g.lineStyle(2,0xffeff2,0.6+0.25*pulse);
      g.lineBetween(x,y,x+14,y+11);
      g.lineBetween(x+14,y+11,x+9,y+20);
    }
    if(state.country==='jp')for(let j=0;j<7;j++){
      g.lineStyle(3,j%2?0xffa4f1:0x92efff,0.32+0.32*pulse);
      g.lineBetween(-395+j*125,29,-375+j*125,95);
    }
  }
  // Gerador acumula energia durante quatro segundos iniciais ou seis de reconstrução.
  if(b.charging&&!state.modules[3].broken){
    const progress=Math.max(0,Math.min(1,b.progress)),x=state.modules[3].offsetX;
    g.lineStyle(3+progress*5,p.barrier,0.4+0.58*pulse).strokeCircle(x,0,16+progress*29);
    g.fillStyle(p.barrier,0.24+0.58*progress).fillCircle(x,0,12+progress*13);
    for(let j=0;j<6;j++){
      const a=j*Math.PI/3+ageMs*0.003;
      g.lineStyle(2,0xffffff,0.5+0.45*progress);
      g.lineBetween(x+Math.cos(a)*18,Math.sin(a)*18,
        x+Math.cos(a)*(25+progress*27),Math.sin(a)*(25+progress*27));
    }
  }
  if(state.coreExposed&&state.coreReveal<1){
    const shift=state.coreReveal*72;
    g.fillStyle(0x171c28,0.85).fillRect(-60-shift,-28,62,55);
    g.fillRect(0+shift,-28,62,55);
  }
}
