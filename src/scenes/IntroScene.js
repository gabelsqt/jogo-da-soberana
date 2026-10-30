import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {playSfx} from '../audio/sfx.js';
import {assetUrl} from '../config/assetUrl.js';
import {createWavyWord} from '../ui/introTextWave.js';
import {
  GAME_WIDTH as W,GAME_HEIGHT as H,preloadRioBackdrop,drawRioBackdrop,
} from '../config/scenery.js';
import {addCuboBroadcastFrame,CUBO_FONT,CUBO_COLORS} from '../ui/cuboNewsTheme.js';
import {
  introductionSlides,INTRO_CHAR_DELAY_MS,introHoldForSlide,
  INTRO_NEWS_HOLD_MS,INTRO_FOOTNOTE_DELAY_MS,
} from '../gameplay/introScript.js';

// A apresentação é um fluxo cinematográfico sem login: e-mail de mesário,
// plantão, segundo e-mail com a cláusula revelada após a promoção.
export class IntroScene extends Phaser.Scene {
  constructor(){super({key:'IntroScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.finished=false;
    this.slides=introductionSlides();
    this.page=0;
    // Vinheta Cubo News toca apenas uma vez por introdução, sem repetir.
    this.newsThemePlayed=false;
    this.objects=[];
    this.typeTimer=null;
    this.holdTimer=null;
    this.segmentTimer=null;
    this.phase='idle';
    this.promotionShown=false;
    this.highlightWord=null;
    this.promotionWave=null;
    this.emailPages=[];this.emailPageIndex=0;
    this.footnotePages=[];this.footnotePageIndex=0;
  }
  preload(){
    preloadRioBackdrop(this);
    // Zé Maria aparece apenas depois da onda 0.5, nunca antes da invasão.
    this.load.svg('intro-invasion',assetUrl('assets/intro/invasao-cristo.svg'),
      {width:720,height:168});
    this.load.svg('intro-elections',assetUrl('assets/intro/urna-cancelado.svg'),
      {width:720,height:168});
    // O armamento e a oficina serão mostrados depois na sequência de batalha.
    this.load.image('intro-obuseiro-base',assetUrl('assets/canhao/base.png'));
    this.load.image('intro-obuseiro-head',assetUrl('assets/canhao/head_4.png'));
    this.load.image('intro-obuseiro-barrel',assetUrl('assets/canhao/barrel_4.png'));
  }
  create(){
    this.music=bindSceneMusic(this,null);
    drawRioBackdrop(this);
    // Um rodapé discreto acompanha cada etapa, inclusive notícias e fala do Zeca.
    this.add.rectangle(W/2,H-21,W,42,0x081320,0.97).setDepth(90);
    this.progressHint=this.add.text(26,H-22,'',{
      fontFamily:CUBO_FONT,fontSize:'13px',color:'#a5bccb',
    }).setOrigin(0,0.5).setDepth(91);
    const skip=this.add.rectangle(W-98,H-22,182,33,0x243d50)
      .setStrokeStyle(1,CUBO_COLORS.gold).setDepth(92)
      .setInteractive({useHandCursor:true});
    this.add.text(W-98,H-22,'PULAR INTRODUÇÃO ▶',{
      fontFamily:CUBO_FONT,fontSize:'13px',fontStyle:'bold',color:'#f1e5cf',
    }).setOrigin(0.5).setDepth(93);
    skip.on('pointerdown',(pointer,_x,_y,event)=>{
      if(!pointer.leftButtonDown())return;
      event?.stopPropagation();
      this.finish();
    });
    this.input.on('pointerdown',pointer=>{
      if(pointer.leftButtonDown())this.advance();
    });
    for(const key of ['SPACE','ENTER']){
      this.input.keyboard.on('keydown-'+key,event=>{
        if(!event.repeat){event.preventDefault();this.advance();}
      });
    }
    this.input.keyboard.on('keydown-ESC',event=>{
      event.preventDefault();this.finish();
    });
    this.events.once('shutdown',()=>{
      this.stopTimers();
      this.clearSlide();
    });
    this.openLaptop();
  }
  drawApartment(){
    // Apartamento simples, cuidado e habitado; manhã tranquila no Rio.
    this.box(W/2,H/2,W,H,0xd3c4a4).setDepth(4);
    this.box(W/2,434,W,170,0x8e745b).setDepth(5);
    this.box(120,157,188,210,0x685c50).setDepth(5);
    this.box(120,155,170,192,0xa9d7df).setDepth(6);
    for(let i=0;i<5;i++){
      this.box(48+i*34,215-i%3*16,28,74+i%3*32,0xb39478).setDepth(7);
      for(let j=0;j<3;j++)this.box(48+i*34,192+j*20-i%3*16,9,11,0x625e5a).setDepth(8);
    }
    this.box(120,155,6,192,0x685c50).setDepth(9);
    this.box(120,155,170,6,0x685c50).setDepth(9);
    this.box(833,347,220,90,0x747f67).setDepth(6);
    this.box(835,298,210,30,0x849075).setDepth(6);
    this.box(480,478,716,34,0x855b3d).setDepth(10);
    this.box(178,508,18,55,0x65452f).setDepth(10);
    this.box(781,508,18,55,0x65452f).setDepth(10);
    this.box(810,438,30,34,0xe9dfc8).setDepth(12);
    this.label(26,18,'RIO DE JANEIRO • MAIS UMA MANHÃ COMUM',{
      fontFamily:CUBO_FONT,fontSize:'12px',color:'#514638'},12);
  }
  openLaptop(){
    this.phase='boot';this.drawApartment();
    this.progressHint.setText('Uma manhã tranquila. O laptop está ligando…');
    this.box(W/2,454,614,20,0x687178).setDepth(13);
    const lid=this.box(W/2,443,580,350,0x252d35).setOrigin(.5,1).setDepth(14).setScale(1,.025);
    this.tweens.add({targets:lid,scaleY:1,duration:1000,ease:'Sine.easeOut'});
    this.segmentTimer=this.time.delayedCall(1100,()=>{
      const boot=this.label(W/2,270,'INICIANDO…',{
        fontFamily:CUBO_FONT,fontSize:'18px',color:'#a9d6df'},15).setOrigin(.5);
      this.segmentTimer=this.time.delayedCall(1400,()=>this.show(0));
    });
  }
  frameDevice(start,kind){
    const contents=this.objects.splice(start);
    const laptop=kind==='email';
    const frame=this.keep(this.add.container(124,laptop?72:40,contents)
      .setScale(.74).setDepth(20));
    if(laptop){
      this.box(W/2,456,670,18,0x687178).setDepth(21);
      this.box(W/2,474,710,18,0x424c54).setDepth(21);
    }else{
      this.box(W/2,444,26,36,0x32383e).setDepth(19);
      this.box(W/2,461,180,12,0x32383e).setDepth(19);
      this.label(764,428,'●', {fontSize:'10px',color:'#87cf8e'},22);
    }
  }
  keep(object){this.objects.push(object);return object;}
  stopTimers(){
    for(const key of ['typeTimer','holdTimer','segmentTimer']){
      this[key]?.remove();this[key]=null;
    }
  }
  clearSlide(){
    for(const object of this.objects)object.destroy();
    this.objects=[];
    this.body=null;this.footnote=null;
    this.emailPages=[];this.emailPageIndex=0;
    this.promotionLabel=null;this.statusLabel=null;
    this.highlightWord=null;this.promotionWave=null;
  }
  // Ondulação de letras reutilizável: a cor e amplitude vêm de cada destaque.
  update(time){
    this.highlightWord?.tick(time);
    this.promotionWave?.tick(time);
  }
  box(...args){return this.keep(this.add.rectangle(...args));}
  label(x,y,value,style,depth=22){
    return this.keep(this.add.text(x,y,value,style).setDepth(depth));
  }
  show(index){
    if(this.finished)return;
    if(index>=this.slides.length){this.finish();return;}
    this.stopTimers();this.clearSlide();
    this.page=index;this.phase='idle';this.promotionShown=false;
    const slide=this.slides[index];
    this.progressHint.setText(
      `${index+1}/${this.slides.length}  •  ESPAÇO/CLIQUE: completar texto ou avançar  •  ESC: pular`);
    if(slide.kind==='news'){
      if(index===1){
        if(!this.newsThemePlayed){
          this.newsThemePlayed=true;
          this.music.play('news',{loop:false});
        }
        playSfx('introAlert',{throttle:300,volumeScale:0.78});
      }
      this.drawApartment();
      const start=this.objects.length;
      this.drawNews(slide);
      this.frameDevice(start,'tv');
      this.phase='hold';
      this.holdTimer=this.time.delayedCall(INTRO_NEWS_HOLD_MS,()=>this.advance());
      return;
    }
    if(this.music.key==='news')this.music.stop();
    this.drawApartment();
    const start=this.objects.length;
    this.drawEmail(slide);
    // Começar com a tela do laptop pequena e aproximar até ocupar o canvas.
    // O texto só começa a aparecer quando o zoom termina.
    const contents=this.objects.splice(start);
    const zoom=this.keep(this.add.container(0,0,contents).setDepth(20));
    zoom.setPosition(W*.31,H*.29).setScale(.38);
    this.phase='zoom';
    // Cada e-mail é uma mensagem completa, sem cortes em telas separadas.
    this.emailPages=[slide.body];
    this.emailPageIndex=0;
    this.footnotePages=[slide.footnote??''];
    this.footnotePageIndex=0;
    this.tweens.add({targets:zoom,x:0,y:0,scale:1,
      duration:900,ease:'Sine.easeInOut',
      onComplete:()=>{
        if(this.finished||this.page!==index)return;
        this.body.setText(slide.body);
        this.characterIndex=Array.from(slide.body).length;
        this.refreshConvocationHighlight();
        this.typeField='body';
        this.completeSegment();
      },
    });
  }
  splitEmailPages(text){
    // Parágrafos pequenos para manter no máximo três linhas em tela.
    const pages=[];
    for(const paragraph of text.split(/\n\s*\n/)){
      const words=paragraph.trim().split(/\s+/).filter(Boolean);
      let line='';
      for(const word of words){
        if(line && (line+' '+word).length>43){
          pages.push(line);line=word;
        }else line+=(line?' ':'')+word;
      }
      if(line)pages.push(line);
    }
    return pages.length?pages:[''];
  }
  drawEmail(slide){
    this.box(W/2,H/2,W,H,0x07111c,0.96).setDepth(4);
    // Janela de e-mail sem campos interativos: é uma convocação recebida.
    this.box(W/2,250,810,417,0x132638)
      .setStrokeStyle(2,0x64869b).setDepth(8);
    this.box(W/2,68,810,53,0x254558).setDepth(9);
    this.label(100,51,'✉  CAIXA DE ENTRADA  /  MENSAGEM OFICIAL',{
      fontFamily:CUBO_FONT,fontSize:'21px',fontStyle:'bold',color:'#dce8ee',
    },12);
    this.label(102,109,`DE: ${slide.from}`,{
      fontFamily:CUBO_FONT,fontSize:'20px',color:'#9fc0d3',
    });
    this.label(102,136,`ASSUNTO: ${slide.subject}`,{
      fontFamily:CUBO_FONT,fontSize:'25px',fontStyle:'bold',color:'#e4e9e6',
      wordWrap:{width:755},
    });
    this.box(W/2,170,753,2,0x5c7c8f).setDepth(11);
    this.body=this.label(104,207,'',{
      fontFamily:CUBO_FONT,fontSize:slide.promotion?'22px':'26px',color:'#e4eff4',lineSpacing:7,
      wordWrap:{width:750},
    });
    if(slide.promotion){
      this.promotionLabel=this.label(W/2,341,'',{
        fontFamily:CUBO_FONT,fontSize:'43px',fontStyle:'bold',
        color:'#ff634d',stroke:'#542637',strokeThickness:3,
      }).setOrigin(0.5).setAlpha(0).setDepth(30);
      this.footnote=this.label(102,374,'',{
        fontFamily:CUBO_FONT,fontSize:'18px',color:'#b6c6d1',lineSpacing:4,
        wordWrap:{width:755},
      });
      this.statusLabel=this.label(104,472,'',{
        fontFamily:CUBO_FONT,fontSize:'18px',fontStyle:'bold',color:'#85e5ae',
      });
    }
  }
  drawNews(slide){
    this.box(W/2,H/2,W,H,0x101b2a,0.96).setDepth(4);
    for(const object of addCuboBroadcastFrame(this,{
      section:'PLANTÃO • INVASÃO EXTRATERRESTRE',
      headline:'Cobertura especial em andamento',
      footer:'A crise atinge as principais cidades brasileiras',
      depth:34,
    }))this.keep(object);
    this.box(W/2,120,780,54,CUBO_COLORS.red,0.92).setDepth(10);
    this.label(W/2,120,slide.tag,{
      fontFamily:CUBO_FONT,fontSize:'27px',fontStyle:'bold',
      color:'#ffffff',
    },12).setOrigin(0.5);
    this.label(W/2,205,slide.headline,{
      fontFamily:CUBO_FONT,fontSize:'31px',fontStyle:'bold',align:'center',
      color:'#f0f3f2',wordWrap:{width:815},
    }).setOrigin(0.5);
    this.label(W/2,292,slide.body,{
      fontFamily:CUBO_FONT,fontSize:'18px',align:'center',
      color:'#bfd8e4',wordWrap:{width:810},lineSpacing:3,
    }).setOrigin(0.5);
    const key=slide.art==='invasion'?'intro-invasion':'intro-elections';
    // Placeholder visual: Carnaval carbonizado de desenho animado, sem ferimentos.
    if(slide.id==='carnaval'){
      const smoke=this.keep(this.add.rectangle(W/2,412,720,168,0x232733,.96).setDepth(18));
      for(let i=0;i<9;i++){
        const x=182+i*75,y=432+(i%3)*8;
        this.keep(this.add.ellipse(x,y,54,79,0x10151c).setDepth(19));
        this.keep(this.add.ellipse(x-9,y-13,10,14,0xffffff).setDepth(20));
        this.keep(this.add.ellipse(x+9,y-13,10,14,0xffffff).setDepth(20));
      }
      this.label(W/2,347,'SILÊNCIO • OLHOS SE ABREM NA FULIGEM',{fontFamily:CUBO_FONT,fontSize:'15px',color:'#f1e8dc'},21).setOrigin(.5);
      return;
    }
    // As imagens narram sem legendas: selfie → ataque → vítimas;
    // urna brasileira estampada CANCELADO na notícia seguinte.
    this.box(W/2,412,734,180,0x080f1b).setDepth(16)
      .setStrokeStyle(3,0x7392a4);
    if(this.textures.exists(key)){
      const art=this.keep(this.add.image(W/2,412,key)
        .setDisplaySize(720,168).setDepth(18));
      art.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  }
  drawZeca(slide){
    this.box(W/2,H/2,W,H,0x07121d,0.55).setDepth(4);
    this.box(W/2,276,866,365,0x142a3a,0.93)
      .setStrokeStyle(2,0x6c9baa).setDepth(6);
    this.box(219,264,222,230,0x0b1725)
      .setStrokeStyle(2,CUBO_COLORS.gold).setDepth(8);
    this.keep(this.add.image(219,255,'intro-zeca')
      .setDisplaySize(204,204).setDepth(9));
    this.label(219,374,'ZECA CARRARA',{
      fontFamily:CUBO_FONT,fontSize:'16px',fontStyle:'bold',color:'#f4d39b',
    }).setOrigin(0.5);
    this.label(362,135,slide.tag,{
      fontFamily:CUBO_FONT,fontSize:'13px',color:'#a6c9d7',
    });
    this.label(362,170,'OFICINA DE EMERGÊNCIA', {
      fontFamily:CUBO_FONT,fontSize:'21px',fontStyle:'bold',color:'#f7d59a',
    });
    this.body=this.label(362,209,'',{
      fontFamily:CUBO_FONT,fontSize:'17px',color:'#edf2f5',
      wordWrap:{width:492},lineSpacing:5,
    });
    this.label(219,397,'MECÂNICO DE ÔNIBUS',{
      fontFamily:CUBO_FONT,fontSize:'12px',color:'#9fb6c4',
    }).setOrigin(0.5);
    // Miniatura do obuseiro real do jogo, reaproveitando seus sprites.
    // O jogador vê a arma que Zeca está tentando explicar.
    this.keep(this.add.image(219,446,'intro-obuseiro-base')
      .setDisplaySize(90,37).setDepth(11));
    this.keep(this.add.image(219,420,'intro-obuseiro-barrel')
      .setDisplaySize(42,69).setDepth(12));
    this.keep(this.add.image(219,427,'intro-obuseiro-head')
      .setDisplaySize(52,52).setDepth(13));
  }
  beginTyping(target,text,field){
    this.typeTimer?.remove();this.typeTimer=null;
    this.phase='typing';this.typeField=field;this.typeTarget=target;
    this.characters=Array.from(text);
    this.characterIndex=0;
    target.setText('');
    this.typeTimer=this.time.addEvent({
      delay:INTRO_CHAR_DELAY_MS,loop:true,callback:()=>this.typeNext(),
    });
  }
  typeNext(){
    if(this.finished||this.phase!=='typing')return;
    const char=this.characters[this.characterIndex++];
    this.typeTarget.setText(this.characters.slice(0,this.characterIndex).join(''));
    this.refreshConvocationHighlight();
    if(char&&/[^\s]/u.test(char))
      playSfx('introKey',{throttle:24,volumeScale:0.27});
    if(this.characterIndex>=this.characters.length){
      this.typeTimer?.remove();this.typeTimer=null;
      this.completeSegment();
    }
  }
  refreshConvocationHighlight(){
    if(!this.highlightWord)return;
    const start=this.slides[this.page].body.indexOf('MESÁRIO');
    this.highlightWord.setRevealed(
      Math.max(0,this.characterIndex-start));
  }
  completeSegment(){
    const slide=this.slides[this.page];
    if(this.typeField==='body'&&this.emailPageIndex<this.emailPages.length-1){
      this.phase='emailPageHold';
      return;
    }
    if(this.typeField==='footnote'&&this.footnotePageIndex<this.footnotePages.length-1){
      this.phase='footnotePageHold';
      return;
    }
    if(this.typeField==='body'&&slide.promotion){
      this.phase='promotionPending';
      this.segmentTimer=this.time.delayedCall(650,()=>this.revealPromotion());
      return;
    }
    this.phase='hold';
    if(slide.status&&this.statusLabel)this.statusLabel.setText(slide.status);
    this.holdTimer=this.time.delayedCall(
      introHoldForSlide(slide),()=>this.advance());
  }
  revealPromotion(){
    this.segmentTimer?.remove();this.segmentTimer=null;
    if(this.promotionShown)return;
    const slide=this.slides[this.page];
    this.promotionShown=true;
    // A promoção aparece de uma vez: palavra enorme, ondulação em cada letra.
    this.promotionWave=createWavyWord(this,{
      word:slide.promotion,x:W/2,y:323,fontFamily:CUBO_FONT,
      fontSize:43,color:'#ff634d',stroke:'#542637',strokeThickness:3,
      amplitude:3.6,center:true,depth:31,
    });
    this.promotionWave.glyphs.forEach(item=>this.body.parentContainer.add(item));
    this.promotionWave.setRevealed(Array.from(slide.promotion).length);
    playSfx('introNotice',{throttle:180,volumeScale:0.75});
    this.phase='footnotePending';
    this.segmentTimer=this.time.delayedCall(
      INTRO_FOOTNOTE_DELAY_MS,()=>this.beginFootnote());
  }
  beginFootnote(){
    this.segmentTimer?.remove();this.segmentTimer=null;
    const slide=this.slides[this.page];
    if(!slide?.footnote)return;
    this.footnote.setText(slide.footnote);
    this.typeField='footnote';
    this.completeSegment();
  }
  advance(){
    if(this.finished)return;
    if(this.phase==='typing'){
      this.typeTarget.setText(this.characters.join(''));
      this.characterIndex=this.characters.length;
      this.refreshConvocationHighlight();
      this.typeTimer?.remove();this.typeTimer=null;
      this.completeSegment();return;
    }
    if(this.phase==='emailPageHold'){
      this.emailPageIndex++;
      this.beginTyping(this.body,this.emailPages[this.emailPageIndex],'body');
      return;
    }
    if(this.phase==='footnotePageHold'){
      this.footnotePageIndex++;
      this.beginTyping(this.footnote,this.footnotePages[this.footnotePageIndex],'footnote');
      return;
    }
    if(this.phase==='promotionPending'){this.revealPromotion();return;}
    if(this.phase==='footnotePending'){this.beginFootnote();return;}
    if(this.phase==='zoom')return;
    if(this.phase!=='hold')return;
    this.show(this.page+1);
  }
  finish(){
    if(this.finished)return;
    this.finished=true;this.stopTimers();this.clearSlide();
    this.scene.start('GameScene',{mode:'wave0',campaign:this.campaign});
  }
}
