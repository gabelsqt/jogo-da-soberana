import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {assetUrl} from '../config/assetUrl.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H,
  preloadRioBackdrop,drawRioBackdrop} from '../config/scenery.js';
import {REPAIR_STAGES} from '../gameplay/prologueStory.js';

// História visual em painéis SUCESSIVOS; não exibe a figura antiga de Zeca.
// Sprite procedural pixelado é provisório até receber arte própria de Zé Maria.
function createPixelMechanic(scene,x,y){
  const g=scene.add.graphics().setDepth(32);
  const px=(dx,dy,w,h,color)=>{
    g.fillStyle(color,1).fillRect(Math.round(x+dx),Math.round(y+dy),w,h);
  };
  px(-28,-72,56,15,0x265c40);px(-34,-68,68,11,0x306a45);
  px(-27,-57,54,48,0x985b3a);px(-23,-36,15,5,0x2b2422);
  px(9,-36,15,5,0x2b2422);px(-20,-13,40,9,0x3a251a);
  px(-28,-10,56,56,0x2f744e);px(-19,5,38,25,0x438b57);
  px(-25,40,22,30,0x2b694b);px(3,40,22,30,0x2b694b);
  px(-25,69,24,8,0x5b4034);px(3,69,24,8,0x5b4034);
  px(9,0,17,9,0xe8ebde);px(13,1,11,7,0x568860);
  px(-22,-5,7,20,0x985b3a);px(18,-5,7,20,0x985b3a);
  px(19,17,8,23,0xc6d0d2);px(13,15,20,5,0x8ca5a6);
  px(-7,0,5,12,0xbac6d0);px(-1,0,3,12,0x3a74c8);
  return g;
}
function drawTowTruck(scene){
  const g=scene.add.graphics().setDepth(20);
  g.fillStyle(0x244c71).fillRect(170,304,600,92);
  g.fillStyle(0x316793).fillRect(505,252,183,67);
  g.fillStyle(0x6aa1bd).fillRect(531,265,100,29);
  g.fillStyle(0x1b3549).fillRect(241,282,265,14);
  g.lineStyle(9,0xaab5ad);g.lineBetween(270,278,410,202);
  g.lineBetween(410,202,474,234);
  g.fillStyle(0xe4ac52).fillRect(405,190,15,15);
  for(const x of [298,631]){
    g.fillStyle(0x0b1520).fillCircle(x,397,50);
    g.fillStyle(0x8899a8).fillCircle(x,397,23);
  }
  return g;
}
export class PrologueRepairScene extends Phaser.Scene{
  constructor(){super({key:'PrologueRepairScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.stage=REPAIR_STAGES[data.stage]?data.stage:'arrival';
    this.country=data.country??this.campaign.armament?.principal??'br';
    this.pages=REPAIR_STAGES[this.stage];this.index=0;
    this.advancing=false;this.items=[];
  }
  preload(){
    preloadRioBackdrop(this);
    this.load.image('repair-cannon-base',assetUrl('assets/canhao/base.png'));
    this.load.image('repair-cannon-head',assetUrl('assets/canhao/head_4.png'));
    this.load.image('repair-cannon-barrel',assetUrl('assets/canhao/barrel_4.png'));
  }
  create(){
    bindSceneMusic(this,'upgrades');drawRioBackdrop(this);
    this.sceneBackdrop=this.add.rectangle(W/2,H/2,W,H,0x09121c,.92);
    this.add.text(W/2,43,'OPERAÇÃO SOBERANIA • OFICINA DO ZÉ MARIA',{
      fontFamily:'monospace',fontSize:'21px',fontStyle:'bold',
      color:'#f3c48c',stroke:'#07101b',strokeThickness:4,
    }).setOrigin(.5).setDepth(90);
    this.hint=this.add.text(W/2,H-28,'CLIQUE, ESPAÇO OU ENTER PARA CONTINUAR',{
      fontFamily:'monospace',fontSize:'14px',color:'#d4f3df',
    }).setOrigin(.5).setDepth(90);
    this.input.on('pointerdown',p=>{if(p.leftButtonDown())this.next();});
    this.input.keyboard?.on('keydown-ENTER',()=>this.next());
    this.input.keyboard?.on('keydown-SPACE',()=>this.next());
    this.show();
  }
  keep(object){this.items.push(object);return object;}
  clear(){for(const obj of this.items)obj.destroy();this.items=[];}
  cannon(x,y,scale=1){
    this.keep(this.addImage('repair-cannon-base',x,y+25*scale,120*scale,58*scale,20));
    this.keep(this.addImage('repair-cannon-barrel',x,y-30*scale,37*scale,90*scale,23));
    this.keep(this.addImage('repair-cannon-head',x,y-5*scale,69*scale,70*scale,24));
  }
  addImage(texture,x,y,w,h,depth){
    return this.add.image(x,y,texture).setDisplaySize(w,h).setDepth(depth);
  }
  show(){
    this.clear();
    const text=this.pages[this.index];
    const panel=this.keep(this.add.rectangle(W/2,278,830,330,0x122539,.96)
      .setStrokeStyle(3,0x90adad).setDepth(10));
    const p=this.keep(this.add.rectangle(W/2,380,790,98,0x061321,.95)
      .setStrokeStyle(2,0xe1b46f).setDepth(61));
    const title=this.keep(this.add.text(W/2,366,text,{
      fontFamily:'monospace',fontSize:'19px',fontStyle:'bold',
      color:'#ffe3b6',align:'center',wordWrap:{width:740},
    }).setOrigin(.5).setDepth(64));
    const subtitles={
      arrival:[
        'O canhão foi destruído. No Boteco vazio, Seu Nelson pergunta: “Conhece alguém que conserte isso?” Você liga para Zé Maria.',
        'Zé Maria atende e chega de caminhão-guincho azul: “Se eu fiz um Marea andar, faço isso aqui funcionar.”',
        'Zé Maria encosta o ouvido no canhão, dá duas batidinhas e reconhece o defeito. “É... vai dar trabalho.”',
      ],
      principal:[
        'Zé Maria adapta peças ao sistema principal escolhido. Solução brasileira ou importada, tudo passa pela oficina.',
        'Três... dois... um... O primeiro disparo funciona. O canhão está recuperado e pronto para a onda 1.',
      ],
      special:[
        'O segundo acordo equipa o canhão com o especial do botão direito. Não substitui o tiro principal.',
        'O circuito responde. O tiro especial está instalado e pode ser usado desde o início da onda 2.',
      ],
    };
    this.keep(this.add.text(W/2,439,subtitles[this.stage][this.index],{
      fontFamily:'monospace',fontSize:'13px',color:'#b7d6e4',
      align:'center',wordWrap:{width:762},lineSpacing:4,
    }).setOrigin(.5).setDepth(65));
    const caption=this.keep(this.add.text(W/2,112,
      (this.index+1)+' / '+this.pages.length,{
        fontFamily:'monospace',fontSize:'15px',color:'#b7e9cb',
      }).setOrigin(.5).setDepth(50));
    if(this.stage==='arrival'&&this.index===0){
      this.keep(this.add.rectangle(305,237,280,104,0x172c3e).setDepth(20));
      this.keep(this.add.text(310,224,'☎ CHAMADA PARA',{
        fontFamily:'monospace',fontSize:'16px',color:'#a7e6d1',
      }).setOrigin(.5).setDepth(32));
      this.keep(this.add.text(310,251,'OFICINA DO ZÉ MARIA',{
        fontFamily:'monospace',fontSize:'18px',color:'#ffe5b8',
      }).setOrigin(.5).setDepth(32));
      this.keep(createPixelMechanic(this,715,230));
    }else if(this.stage==='arrival'&&this.index===1){
      const truck=drawTowTruck(this);this.items.push(truck);
    }else{
      this.cannon(W/2,250,.9);
      if(this.stage==='arrival'&&this.index===2){
        const arm=this.keep(this.add.graphics().setDepth(26));
        arm.lineStyle(4,0xe2aa7d);arm.lineBetween(330,235,397,265);
        this.keep(this.add.text(275,239,'TOC TOC',{
          fontFamily:'monospace',fontSize:'19px',color:'#ffdd8a',
        }).setDepth(37));
      }else if(this.stage==='principal'){
        const color={br:0x37c878,us:0x4897f5,ru:0xe8b84c,
          cn:0xe84d51,jp:0xa46cf0}[this.country]??0xffffff;
        this.keep(this.add.rectangle(670,252,100,43,color,.85).setDepth(26));
        this.keep(this.add.text(670,252,this.country.toUpperCase(),{
          fontFamily:'monospace',fontSize:'19px',fontStyle:'bold',color:'#0b1a2b',
        }).setOrigin(.5).setDepth(28));
        if(this.index===1)this.keep(this.add.circle(W/2,166,9,0xffe0a3).setDepth(30));
      }else if(this.stage==='special'){
        this.keep(this.add.circle(W/2,160,25,0xa7e6f6,.75).setDepth(30));
      }
    }
  }
  next(){
    if(this.advancing)return;
    if(++this.index<this.pages.length){this.show();return;}
    this.advancing=true;
    if(this.stage==='arrival'){
      this.scene.start('BotecoElevatorScene',{
        campaign:this.campaign,completedWave:0,first:true,
      });
    }else{
      this.scene.start('GameScene',{
        mode:this.stage==='special'?'wave2':'wave1',
        campaign:this.campaign,
      });
    }
  }
}
