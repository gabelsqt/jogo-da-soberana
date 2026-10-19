import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {preloadRioBackdrop,drawRioBackdrop} from '../config/scenery.js';
import {addCuboBroadcastFrame} from '../ui/cuboNewsTheme.js';

// Vinheta inicial da Cubo News: 5 quadros de 4,5 s = 22,5 s.
// Ilustrações em blocos vetoriais provisórios, trocáveis por PNG depois.
// Não usar gênero para o protagonista nem para a pessoa da mensagem.
const W=960,H=540,PAGE_MS=4500;
export function introductionSlides(name){
  return [
    {title:'Naves extraterrestres chegam à Terra!',
      body:'Objetos gigantescos foram avistados sobre o Rio de Janeiro.\nA Cubo News recomenda manter a calma. E o sinal ligado.',
      tag:'URGENTE • INVASÃO',art:'earth'},
    {title:'Cristo causa incidente diplomático',
      body:'Na cultura alienígena, braços cruzados demonstram respeito.\nAo ver o Cristo de braços abertos, os ETs acharam\nque o Líder Supremo da Terra estava insultando todos.',
      tag:'ETIQUETA INTERPLANETÁRIA',art:'christ'},
    {title:'Acordo prevê retirada ao amanhecer',
      body:'Atacar de dia seria uma grosseria imperdoável para os invasores.\nEles prometem parar assim que o Cristo cruzar os braços.\nA emissora classifica o acordo como bastante promissor.',
      tag:'DIPLOMACIA',art:'moon'},
    {title:'Uma mensagem da pessoa que terminou com você',
      body:'“Você chamou bolacha de biscoito. Eu sou de São Paulo.\nA gente terminou por isso, sim.\nE te inscrevi como mesário. Boa sorte.”',
      tag:'MENSAGEM RECEBIDA',art:'message'},
    {title:`${name}, o novo comando é seu`,
      body:'Após as baixas da noite anterior, a escala de mesários\nvirou a lista oficial de sucessão do comando carioca.\nVocê é o próximo general e terá de escolher alianças\ninternacionais para defender a cidade. Sem direito a recurso.',
      tag:'PORTARIA EXTRAORDINÁRIA',art:'document'},
  ];
}
export class IntroScene extends Phaser.Scene{
  constructor(){super({key:'IntroScene'});}
  init(data={}){
    this.playerName=data.playerName||this.registry.get('playerName')||'General';
    this.page=0;this.finished=false;
    this.campaign=data.campaign||{choices:[]};
  }
  preload(){preloadRioBackdrop(this);}
  create(){
    bindSceneMusic(this,'news');
    drawRioBackdrop(this);
    this.add.rectangle(W/2,H/2,W,H,0x021518,0.78).setDepth(20);
    this.add.rectangle(W/2,267,846,397,0x134b45,0.94)
      .setStrokeStyle(3,0xedc75a).setDepth(22);
    addCuboBroadcastFrame(this,{
      section:'Boletim extraordinário',
      headline:'Cobertura ao vivo • Primeiro contato interplanetário',
      footer:'Cubo News • Informação e responsabilidade interplanetária',
      depth:65,
    });
    this.tag=this.add.text(90,94,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'13px',
      fontStyle:'bold',color:'#edc75a',
    }).setDepth(30);
    this.title=this.add.text(90,142,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'29px',
      fontStyle:'bold',color:'#f5f0dc',wordWrap:{width:775},
    }).setDepth(30);
    this.body=this.add.text(90,210,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'19px',
      color:'#f5f0dc',lineSpacing:9,wordWrap:{width:775},
    }).setDepth(30);
    this.illustration=this.add.graphics().setDepth(27);
    this.counter=this.add.text(90,451,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'13px',
      color:'#f5f0dc',
    }).setDepth(30);
    const skip=this.add.rectangle(817,455,164,38,0xedc75a)
      .setStrokeStyle(2,0xf5f0dc).setDepth(35).setInteractive({useHandCursor:true});
    this.add.text(817,455,'Pular introdução ▶',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'14px',
      fontStyle:'bold',color:'#152926',
    }).setOrigin(0.5).setDepth(36);
    skip.on('pointerdown',(p)=>{if(p.leftButtonDown())this.finish();});
    this.input.keyboard.on('keydown-ESC',()=>this.finish());
    this.input.keyboard.on('keydown-ENTER',()=>this.finish());
    this.slides=introductionSlides(this.playerName);
    this.show(0);
    this.timer=this.time.addEvent({delay:PAGE_MS,loop:true,callback:()=>{
      if(this.page+1>=this.slides.length)this.finish();
      else this.show(this.page+1);
    }});
  }
  show(index){
    this.page=index;
    const card=this.slides[index];
    this.tag.setText(card.tag);
    this.title.setText(card.title);
    this.body.setText(card.body);
    this.counter.setText(`Plantão ${index+1} de ${this.slides.length} • A transmissão continua`);
    const g=this.illustration;g.clear();
    // Ilustrações/editoriais simples, não sprites definitivos.
    const x=475,y=386;
    g.fillStyle(0x102e2d,0.74).fillRoundedRect(100,y-36,740,83,12);
    g.lineStyle(2,0xedc75a,0.58).strokeRoundedRect(100,y-36,740,83,12);
    if(card.art==='earth'){
      g.fillStyle(0x244f89).fillCircle(x,y,27);
      g.fillStyle(0x6abd9d).fillEllipse(x-6,y-3,22,39);
      g.lineStyle(4,0xedc75a).lineBetween(x-90,y-12,x-31,y-12);
      g.fillStyle(0xedc75a).fillTriangle(x-20,y-12,x-34,y-18,x-34,y-6);
    }else if(card.art==='christ'){
      g.lineStyle(8,0xf5f0dc).lineBetween(x,y-24,x,y+30);
      g.lineBetween(x-44,y-9,x+44,y-9);
      g.fillStyle(0xf5f0dc).fillCircle(x,y-33,10);
      g.lineStyle(4,0xedc75a).strokeCircle(x,y-8,56);
    }else if(card.art==='moon'){
      g.fillStyle(0xedc75a).fillCircle(x,y,27);
      g.fillStyle(0x102e2d).fillCircle(x+15,y-10,26);
      for(let i=0;i<5;i++){g.fillStyle(0xf5f0dc).fillCircle(x-100+i*42,y-16+(i%2)*25,2);}
    }else if(card.art==='message'){
      g.fillStyle(0xf5f0dc).fillRoundedRect(x-95,y-24,190,53,9);
      g.fillStyle(0x134b45).fillRect(x-72,y-8,142,4);
      g.fillRect(x-72,y+5,96,4);
      g.fillStyle(0xedc75a).fillTriangle(x-40,y+28,x-17,y+28,x-26,y+43);
    }else{
      g.fillStyle(0xf5f0dc).fillRoundedRect(x-60,y-30,120,72,3);
      g.lineStyle(4,0x134b45).lineBetween(x-38,y-11,x+38,y-11);
      g.lineBetween(x-38,y,x+30,y);
      g.lineBetween(x-38,y+12,x+15,y+12);
      g.lineStyle(3,0xc68636).strokeCircle(x+35,y+22,12);
    }
  }
  finish(){
    if(this.finished)return;
    this.finished=true;
    this.timer?.remove();
    this.scene.start('GameScene',{mode:'wave0',campaign:this.campaign});
  }
}
