import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {addCuboBroadcastFrame,CUBO_FONT,CUBO_COLORS} from '../ui/cuboNewsTheme.js';
import {introductionSlides,INTRO_PAGE_MS} from '../gameplay/introScript.js';
import {
  resolvePlayerName,getSavedPlayerName,savePlayerName,
} from '../gameplay/playerIdentity.js';

// O nome é digitado no computador da repartição. Só depois de visitar o
// site da Cubo News começam os 24 segundos da visual novel.
export class IntroScene extends Phaser.Scene{
  constructor(){super({key:'IntroScene'});}
  init(data={}){
    this.playerName=data.playerName??'';
    this.campaign=data.campaign||{choices:[]};
    this.finished=false;this.newsStarted=false;this.page=0;
    this.timer=null;
  }
  create(){
    bindSceneMusic(this,'news');
    this.add.rectangle(W/2,H/2,W,H,0x060c14).setDepth(1);
    // Computador CRT antigo. A tela de login é HTML para permitir entrada real
    // pelo teclado e acessibilidade; o frame Phaser mantém o visual da cena.
    const g=this.add.graphics().setDepth(2);
    g.fillStyle(0x46505b).fillRoundedRect(54,30,852,482,25);
    g.fillStyle(0x162934).fillRoundedRect(70,46,820,446,13);
    g.lineStyle(4,0x657e8c).strokeRoundedRect(70,46,820,446,13);
    g.fillStyle(0x0b1621).fillRect(93,70,774,388);
    g.fillStyle(0x344551).fillRect(350,498,260,12);
    this.installComputerLogin();
    this.events.once('shutdown',()=>{
      this.timer?.remove();
      if(this.namePanel)this.namePanel.hidden=true;
      if(this.namePanel&&this.submitName)
        this.namePanel.removeEventListener('submit',this.submitName);
      if(this.openNewsButton&&this.openNews)
        this.openNewsButton.removeEventListener('click',this.openNews);
    });
    this.input.keyboard.on('keydown-ESC',()=>{if(this.newsStarted)this.finish();});
    this.input.keyboard.on('keydown-SPACE',()=>{if(this.newsStarted)this.advance();});
    this.input.keyboard.on('keydown-ENTER',()=>{if(this.newsStarted)this.advance();});
  }
  installComputerLogin(){
    if(typeof document==='undefined'){
      this.playerName=resolvePlayerName(this.playerName);
      this.registry.set('playerName',this.playerName);
      this.startNews();
      return;
    }
    const panel=document.getElementById('player-name-panel');
    const input=document.getElementById('player-name-input');
    const login=document.getElementById('work-login');
    const desktop=document.getElementById('work-desktop');
    const greeting=document.getElementById('work-user-greeting');
    const launch=document.getElementById('work-news-shortcut');
    if(!panel||!input||!login||!desktop||!launch){
      this.playerName=resolvePlayerName(this.playerName);
      this.registry.set('playerName',this.playerName);
      this.startNews();
      return;
    }
    this.namePanel=panel;this.openNewsButton=launch;
    const store=typeof window!=='undefined'?window.localStorage:null;
    input.value=this.playerName||getSavedPlayerName(store);
    panel.hidden=false;login.hidden=false;desktop.hidden=true;
    this.time.delayedCall(170,()=>input.focus());
    this.submitName=event=>{
      event.preventDefault();
      const name=resolvePlayerName(input.value);
      this.playerName=savePlayerName(store,name);
      this.registry.set('playerName',name);
      if(greeting)greeting.textContent=name;
      login.hidden=true;desktop.hidden=false;
      launch.focus();
    };
    this.openNews=()=>{
      if(!this.playerName)return;
      panel.hidden=true;
      this.startNews();
    };
    panel.addEventListener('submit',this.submitName);
    launch.addEventListener('click',this.openNews);
  }
  startNews(){
    if(this.newsStarted||this.finished)return;
    this.newsStarted=true;
    const a=this.add;
    a.rectangle(W/2,H/2,784,390,CUBO_COLORS.navy,0.99)
      .setStrokeStyle(2,0x547c92).setDepth(10);
    a.rectangle(W/2,86,748,23,CUBO_COLORS.card).setDepth(11);
    a.text(129,86,'◉ navegador • cubonews.br/plantao',{
      fontFamily:CUBO_FONT,fontSize:'13px',color:'#a8becd',
    }).setOrigin(0,0.5).setDepth(12);
    addCuboBroadcastFrame(this,{
      section:'Plantão • Primeiro contato',
      headline:'Notícias interplanetárias atualizadas em tempo real',
      footer:'Cubo News • Seu expediente acaba de ficar estranho',
      depth:40,
    });
    this.speaker=a.text(115,113,'',{
      fontFamily:CUBO_FONT,fontSize:'13px',color:'#e2a45e',fontStyle:'bold',
    }).setDepth(20);
    this.headline=a.text(115,150,'',{
      fontFamily:CUBO_FONT,fontSize:'26px',color:'#dce8ee',fontStyle:'bold',
      wordWrap:{width:735},
    }).setDepth(20);
    this.body=a.text(115,226,'',{
      fontFamily:CUBO_FONT,fontSize:'19px',color:'#c3d6e2',lineSpacing:5,
      wordWrap:{width:735},
    }).setDepth(20);
    this.picture=a.graphics().setDepth(21);
    this.pageIndicator=a.text(117,464,'',{
      fontFamily:CUBO_FONT,fontSize:'13px',color:'#91a8b8',
    }).setDepth(21);
    const skip=a.rectangle(823,463,178,40,CUBO_COLORS.card)
      .setStrokeStyle(2,CUBO_COLORS.gold).setDepth(24).setInteractive({useHandCursor:true});
    a.text(823,463,'Pular introdução ▶',{
      fontFamily:CUBO_FONT,fontSize:'14px',fontStyle:'bold',color:'#dce8ee',
    }).setOrigin(0.5).setDepth(25);
    skip.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();
      if(pointer.leftButtonDown())this.finish();
    });
    const nextArea=a.rectangle(473,302,752,363,0x000000,0)
      .setDepth(22).setInteractive();
    nextArea.on('pointerdown',(pointer)=>{
      if(pointer.leftButtonDown())this.advance();
    });
    this.slides=introductionSlides(this.playerName);
    this.show(0);
  }
  show(index){
    if(!this.newsStarted||this.finished)return;
    this.page=index;
    const slide=this.slides[index];
    this.speaker.setText(slide.speaker+'  •  '+slide.tag);
    this.headline.setText(slide.title);
    this.body.setText(slide.body);
    this.pageIndicator.setText(
      `Notícia ${index+1}/${this.slides.length} • Clique ou pressione ESPAÇO para avançar`);
    const g=this.picture;g.clear();
    const x=480,y=402;
    g.fillStyle(0x193043,0.88).fillRoundedRect(122,366,720,65,6);
    g.lineStyle(2,0x435f73).strokeRoundedRect(122,366,720,65,6);
    if(slide.art==='christ'||slide.art==='alien'){
      g.fillStyle(0x557d8e).fillCircle(x,y-24,11);
      g.lineStyle(7,0xdce8ee).lineBetween(x,y-11,x,y+20);
      g.lineBetween(x-38,y-5,x+38,y-5);
      if(slide.art==='alien'){
        g.fillStyle(0x9be5bc).fillCircle(x+120,y-20,16);
        g.fillStyle(0x0b1621).fillEllipse(x+113,y-22,6,9);
        g.fillEllipse(x+127,y-22,6,9);
      }
    }else if(slide.art==='news'){
      g.fillStyle(0x96bccb).fillEllipse(x,y,66,31);
      g.fillStyle(0xc45151).fillCircle(x,y,10);
      g.lineStyle(3,0xe2a45e).lineBetween(x-125,y,x-38,y);
    }else if(slide.art==='moon'){
      g.fillStyle(0xe2a45e).fillCircle(x,y,25);
      g.fillStyle(0x193043).fillCircle(x+12,y-11,25);
    }else if(slide.art==='message'){
      g.fillStyle(0xdee9f0).fillRoundedRect(x-75,y-25,150,50,6);
      g.fillStyle(0x435f73).fillRect(x-58,y-8,102,5).fillRect(x-58,y+7,78,5);
    }else{
      g.fillStyle(0xdce8ee).fillRoundedRect(x-54,y-28,108,58,3);
      g.lineStyle(3,0x193043).lineBetween(x-37,y-11,x+32,y-11);
      g.lineBetween(x-37,y+1,x+23,y+1);
      g.lineStyle(3,0xc45151).strokeCircle(x+20,y+13,8);
    }
    this.timer?.remove();
    this.timer=this.time.delayedCall(INTRO_PAGE_MS,()=>this.advance());
  }
  advance(){
    if(this.finished||!this.newsStarted)return;
    this.timer?.remove();this.timer=null;
    if(this.page+1<this.slides.length)this.show(this.page+1);
    else this.finish();
  }
  finish(){
    if(this.finished)return;
    this.finished=true;this.timer?.remove();
    if(this.namePanel)this.namePanel.hidden=true;
    this.scene.start('GameScene',{mode:'wave0',campaign:this.campaign});
  }
}
