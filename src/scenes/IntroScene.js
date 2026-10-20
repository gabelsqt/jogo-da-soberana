import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {playSfx} from '../audio/sfx.js';
import {assetUrl} from '../config/assetUrl.js';
import {
  GAME_WIDTH as W,GAME_HEIGHT as H,preloadRioBackdrop,drawRioBackdrop,
} from '../config/scenery.js';
import {addCuboBroadcastFrame,CUBO_FONT,CUBO_COLORS} from '../ui/cuboNewsTheme.js';
import {
  introductionSlides,INTRO_CHAR_DELAY_MS,INTRO_PAGE_MS,
  INTRO_NEWS_HOLD_MS,INTRO_FOOTNOTE_DELAY_MS,
} from '../gameplay/introScript.js';

// A apresentação é um fluxo cinematográfico sem login: e-mail de mesário,
// plantão, segundo e-mail com a cláusula *revelada só na promoção*, Zeca.
export class IntroScene extends Phaser.Scene {
  constructor(){super({key:'IntroScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.finished=false;
    this.slides=introductionSlides();
    this.page=0;
    this.objects=[];
    this.typeTimer=null;
    this.holdTimer=null;
    this.segmentTimer=null;
    this.phase='idle';
    this.promotionShown=false;
  }
  preload(){
    preloadRioBackdrop(this);
    this.load.image('intro-zeca',assetUrl('assets/lideres/br_retrato.png'));
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
    this.show(0);
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
    this.promotionLabel=null;this.statusLabel=null;
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
        this.music.play('news');
        playSfx('introAlert',{throttle:300,volumeScale:0.78});
      }
      this.drawNews(slide);
      this.phase='hold';
      this.holdTimer=this.time.delayedCall(INTRO_NEWS_HOLD_MS,()=>this.advance());
      return;
    }
    if(this.music.key==='news')this.music.stop();
    if(slide.kind==='email')this.drawEmail(slide);
    else this.drawZeca(slide);
    this.beginTyping(this.body,slide.body,'body');
  }
  drawEmail(slide){
    this.box(W/2,H/2,W,H,0x07111c,0.96).setDepth(4);
    // Janela de e-mail sem campos interativos: é uma convocação recebida.
    this.box(W/2,250,810,417,0x132638)
      .setStrokeStyle(2,0x64869b).setDepth(8);
    this.box(W/2,68,810,53,0x254558).setDepth(9);
    this.label(100,51,'✉  CAIXA DE ENTRADA  /  MENSAGEM OFICIAL',{
      fontFamily:CUBO_FONT,fontSize:'16px',fontStyle:'bold',color:'#dce8ee',
    },12);
    this.label(102,109,`DE: ${slide.from}`,{
      fontFamily:CUBO_FONT,fontSize:'14px',color:'#9fc0d3',
    });
    this.label(102,136,`ASSUNTO: ${slide.subject}`,{
      fontFamily:CUBO_FONT,fontSize:'19px',fontStyle:'bold',color:'#e4e9e6',
      wordWrap:{width:755},
    });
    this.box(W/2,170,753,2,0x5c7c8f).setDepth(11);
    this.body=this.label(104,194,'',{
      fontFamily:CUBO_FONT,fontSize:'21px',color:'#e4eff4',lineSpacing:6,
      wordWrap:{width:750},
    });
    if(slide.promotion){
      this.promotionLabel=this.label(W/2,345,'',{
        fontFamily:CUBO_FONT,fontSize:'29px',fontStyle:'bold',
        color:'#ffbb83',stroke:'#5b2437',strokeThickness:3,
      }).setOrigin(0.5).setAlpha(0).setDepth(30);
      this.footnote=this.label(102,389,'',{
        fontFamily:CUBO_FONT,fontSize:'13px',color:'#b6c6d1',lineSpacing:3,
        wordWrap:{width:755},
      });
      this.statusLabel=this.label(104,370,'',{
        fontFamily:CUBO_FONT,fontSize:'13px',fontStyle:'bold',color:'#85e5ae',
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
    this.box(W/2,140,780,68,CUBO_COLORS.red,0.92).setDepth(10);
    this.label(W/2,140,slide.tag,{
      fontFamily:CUBO_FONT,fontSize:'30px',fontStyle:'bold',
      color:'#ffffff',
    },12).setOrigin(0.5);
    this.label(W/2,234,slide.headline,{
      fontFamily:CUBO_FONT,fontSize:'33px',fontStyle:'bold',align:'center',
      color:'#f0f3f2',wordWrap:{width:815},
    }).setOrigin(0.5);
    this.label(W/2,340,slide.body,{
      fontFamily:CUBO_FONT,fontSize:'19px',align:'center',
      color:'#bfd8e4',wordWrap:{width:800},lineSpacing:5,
    }).setOrigin(0.5);
    // Pequeno gráfico de naves sem diálogo/capções alienígenas.
    const g=this.keep(this.add.graphics().setDepth(18));
    for(const [x,y,scale] of [[290,432,1],[490,417,1.3],[677,436,0.8]]){
      g.fillStyle(0x6b879a,0.9).fillEllipse(x,y,54*scale,18*scale);
      g.fillStyle(0x293e57).fillEllipse(x,y-7*scale,20*scale,16*scale);
      g.fillStyle(0xe25768).fillCircle(x,y+2*scale,4*scale);
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
    this.label(362,170,'GENERAL, ESTE É O OBUSEIRO.',{
      fontFamily:CUBO_FONT,fontSize:'21px',fontStyle:'bold',color:'#f7d59a',
    });
    this.body=this.label(362,209,'',{
      fontFamily:CUBO_FONT,fontSize:'17px',color:'#edf2f5',
      wordWrap:{width:492},lineSpacing:5,
    });
    this.label(219,397,'MECÂNICO DE CARROS',{
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
    if(char&&/[^\s]/u.test(char))
      playSfx('introKey',{throttle:24,volumeScale:0.27});
    if(this.characterIndex>=this.characters.length){
      this.typeTimer?.remove();this.typeTimer=null;
      this.completeSegment();
    }
  }
  completeSegment(){
    const slide=this.slides[this.page];
    if(this.typeField==='body'&&slide.promotion){
      this.phase='promotionPending';
      this.segmentTimer=this.time.delayedCall(650,()=>this.revealPromotion());
      return;
    }
    this.phase='hold';
    if(slide.status)this.statusLabel.setText(slide.status);
    this.holdTimer=this.time.delayedCall(
      slide.kind==='zeca'?2400:INTRO_PAGE_MS,()=>this.advance());
  }
  revealPromotion(){
    this.segmentTimer?.remove();this.segmentTimer=null;
    if(this.promotionShown)return;
    const slide=this.slides[this.page];
    this.promotionShown=true;
    this.promotionLabel.setText(slide.promotion).setAlpha(1);
    playSfx('introNotice',{throttle:180,volumeScale:0.75});
    this.phase='footnotePending';
    this.segmentTimer=this.time.delayedCall(
      INTRO_FOOTNOTE_DELAY_MS,()=>this.beginFootnote());
  }
  beginFootnote(){
    this.segmentTimer?.remove();this.segmentTimer=null;
    const slide=this.slides[this.page];
    if(!slide?.footnote)return;
    this.beginTyping(this.footnote,slide.footnote,'footnote');
  }
  advance(){
    if(this.finished)return;
    if(this.phase==='typing'){
      this.typeTarget.setText(this.characters.join(''));
      this.typeTimer?.remove();this.typeTimer=null;
      this.completeSegment();return;
    }
    if(this.phase==='promotionPending'){this.revealPromotion();return;}
    if(this.phase==='footnotePending'){this.beginFootnote();return;}
    if(this.phase!=='hold')return;
    this.show(this.page+1);
  }
  finish(){
    if(this.finished)return;
    this.finished=true;this.stopTimers();this.clearSlide();
    this.scene.start('GameScene',{mode:'wave0',campaign:this.campaign});
  }
}
