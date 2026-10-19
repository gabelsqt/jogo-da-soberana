import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {nextV1Options,chooseV1Upgrade} from '../gameplay/v1Upgrades.js';
import {normalizeCampaignState} from '../gameplay/progression.js';
import {FIRST_UPGRADES} from '../gameplay/upgrades.js';
import {
  REPRESENTATIVES,representativeLine,representativeStoryFor,
} from '../gameplay/representatives.js';
import {addCuboBroadcastFrame,CUBO_FONT} from '../ui/cuboNewsTheme.js';
import {assetUrl} from '../config/assetUrl.js';

export const BOTECO_CHAIR_X=Object.freeze([116,298,480,662,844]);
export const BOTECO_PORTRAIT_Y=241;
export const BOTECO_FOCUS=Object.freeze({x:155,y:163,scale:1.47,duration:320});
const COLOR={ink:0x0b1621,panel:0x193043,outline:0x5b788f,
  cream:0xdce8ee,amber:0xe2a45e,red:0xc45151};
const makeText=(scene,x,y,str,size=16,color='#dce8ee',width=null,opts={})=>
  scene.add.text(x,y,str,{
    fontFamily:CUBO_FONT,fontSize:size+'px',color,wordWrap:width?{width,useAdvancedWrap:true}:undefined,
    lineSpacing:3,...opts,
  });

function portrait(scene,option,index){
  const color=option.locked?0x68737d:(option.color??0x668eac);
  const id=option.id;
  const frame=scene.add.graphics();
  frame.fillStyle(0x101d2b,0.98).fillRoundedRect(-56,-67,112,133,8);
  frame.lineStyle(3,color,1).strokeRoundedRect(-56,-67,112,133,8);
  const portraitKey='leader-'+id+'-full';
  const loaded=scene.textures.exists(portraitKey);
  const image=loaded?scene.add.image(0,-1,portraitKey).setDisplaySize(106,125):null;
  if(!image){
    frame.fillStyle(color,0.72).fillCircle(0,-27,23);
    frame.fillStyle(color,0.72).fillRoundedRect(-39,-3,78,36,14);
  }
  const footer=scene.add.rectangle(0,46,104,30,0x101d2b,0.94);
  const label=makeText(scene,0,43,option.shortName??option.name,12,
    '#dce8ee',100,{fontStyle:'bold',align:'center'}).setOrigin(0.5);
  const lvl=makeText(scene,0,76,'Nível '+option.level,11,
    '#e2a45e',null,{fontStyle:'bold'}).setOrigin(0.5);
  const children=image?[frame,image,footer,label,lvl]:[frame,footer,label,lvl];
  const node=scene.add.container(BOTECO_CHAIR_X[index],BOTECO_PORTRAIT_Y,children).setDepth(26);
  node.setSize(114,161).setInteractive({useHandCursor:true});
  return {node,option,index,originX:BOTECO_CHAIR_X[index],originY:BOTECO_PORTRAIT_Y};
}

function outlinePlaceholder(scene,x,y,w,h){
  const g=scene.add.graphics().setDepth(45);
  g.fillStyle(0x101c29,0.96).fillRoundedRect(x,y,w,h,6);
  g.lineStyle(2,0x587389,0.95).strokeRoundedRect(x,y,w,h,6);
  // Pontilhado discreto indica uma área futura, não um botão quebrado.
  g.lineStyle(1,0x839bb0,0.65);
  for(let xx=x+14;xx<x+w-10;xx+=17){
    g.lineBetween(xx,y+10,Math.min(xx+8,x+w-10),y+10);
    g.lineBetween(xx,y+h-10,Math.min(xx+8,x+w-10),y+h-10);
  }
  return g;
}

export class UpgradeScene extends Phaser.Scene {
  constructor(){super({key:'UpgradeScene'});}
  init(data={}){
    this.campaign=normalizeCampaignState(data.campaign);
    this.completedWave=Number.isInteger(data.completedWave)?data.completedWave:
      this.campaign.choices.length;
    this.chosen=false;this.focused=null;
  }
  preload(){
    this.load.image('boteco-dia',assetUrl('assets/cenario/boteco_dia.webp'));
    // Os retratos são arquivos opcionais: a silhueta provisória continua funcionando
    // quando o pacote de PNGs ainda não foi instalado localmente.
    for(const id of ['br','us','jp','ru','cn']){
      this.load.image('leader-'+id+'-full',assetUrl('assets/lideres/'+id+'_retrato.png'));
      this.load.image('leader-'+id+'-cutout',assetUrl('assets/lideres/'+id+'_personagem.png'));
    }
  }
  create(){
    bindSceneMusic(this,'upgrades');
    this.add.image(W/2,H/2,'boteco-dia').setDisplaySize(W,H).setDepth(1);
    // A arte diurna é central: cabeçalho discreto, sem cobrir a janela do Rio.
    addCuboBroadcastFrame(this,{
      section:'Mesa de negociações',
      headline:'Onda '+this.completedWave+' concluída • Escolha quem vai apoiar o Brasil',
      footer:'Cinco representantes • O acordo só é fechado após sua confirmação',
      depth:14,
    });
    this.add.rectangle(W/2,81,770,30,COLOR.ink,0.84).setDepth(16)
      .setStrokeStyle(1,COLOR.amber);
    makeText(this,W/2,81,'Clique no retrato de um representante para ouvir a proposta',
      17,'#dce8ee',null,{fontStyle:'bold'}).setOrigin(0.5).setDepth(17);

    this.options=nextV1Options(this.campaign,FIRST_UPGRADES);
    this.portraits=this.options.map((option,index)=>portrait(this,option,index));
    // Esta sobreposição escurece TODO o boteco, inclusive os retratos
    // não selecionados. O escolhido sobe acima dela por animação.
    this.focusDim=this.add.rectangle(W/2,H/2,W,H,0x030b15,0.83)
      .setDepth(33).setVisible(false).setInteractive();
    this.focusDim.on('pointerdown',()=>{}); // Fundo não aceita o upgrade.
    this.focusPanel=this.add.rectangle(632,164,612,202,COLOR.panel,0.97)
      .setStrokeStyle(2,COLOR.amber).setDepth(43).setVisible(false);
    this.countryTag=makeText(this,348,74,'',13,'#e2a45e',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.characterName=makeText(this,348,96,'',20,'#ffffff',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.flavorText=makeText(this,348,130,'',15,'#dce8ee',555)
      .setDepth(46).setVisible(false);
    this.upgradeTitle=makeText(this,348,202,'',15,'#e2a45e',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.upgradeDescription=makeText(this,348,224,'',13,'#dce8ee',555)
      .setDepth(46).setVisible(false);
    this.previewBox=outlinePlaceholder(this,290,280,664,113).setVisible(false);
    this.previewLabel=makeText(this,623,319,'Prévia animada do upgrade (em breve)',
      16,'#93aabe',null,{fontStyle:'bold'}).setOrigin(0.5).setDepth(46).setVisible(false);
    this.previewHint=makeText(this,623,349,'Espaço reservado para demonstrar as mudanças no canhão',
      12,'#8fa7b9').setOrigin(0.5).setDepth(46).setVisible(false);
    this.acceptButton=this.createButton(734,448,320,'Aceitar upgrade [ENTER]',true,
      ()=>this.focused&&this.selectUpgrade(this.focused)).setVisible(false);
    this.backButton=this.createButton(393,448,215,'Voltar [ESC]',false,
      ()=>this.unfocus()).setVisible(false);
    this.overlayItems=[
      this.focusPanel,this.countryTag,this.characterName,this.flavorText,
      this.upgradeTitle,this.upgradeDescription,this.previewBox,
      this.previewLabel,this.previewHint,this.acceptButton,this.backButton,
    ];
    for(const tile of this.portraits){
      if(tile.option.locked){tile.node.setAlpha(0.5).disableInteractive();continue;}
      tile.node.on('pointerover',()=>{if(!this.focused)tile.node.setScale(1.07);});
      tile.node.on('pointerout',()=>{if(!this.focused)tile.node.setScale(1);});
      tile.node.on('pointerdown',(pointer,_x,_y,event)=>{
        event?.stopPropagation();
        if(pointer.leftButtonDown()&&!this.chosen)this.focusCountry(tile.option.id);
      });
    }
    this.input.keyboard.on('keydown',(event)=>{
      const hit=/^[1-5]$/.exec(event.key);
      if(hit){
        const option=this.options[Number(hit[0])-1];
        if(option&&!option.locked)this.focusCountry(option.id);
      }
    });
    this.input.keyboard.on('keydown-ESC',()=>{if(!this.chosen)this.unfocus();});
    this.input.keyboard.on('keydown-ENTER',()=>{
      if(this.focused&&!this.chosen)this.selectUpgrade(this.focused);
    });
  }
  createButton(x,y,width,label,primary,callback){
    const fill=primary?COLOR.amber:COLOR.panel;
    const bg=this.add.rectangle(0,0,width,48,fill)
      .setStrokeStyle(2,primary?0xdce8ee:COLOR.outline);
    const txt=makeText(this,0,0,label,16,primary?'#0b1621':'#dce8ee',
      width-26,{fontStyle:'bold',align:'center'}).setOrigin(0.5);
    const node=this.add.container(x,y,[bg,txt]).setDepth(48).setSize(width,48)
      .setInteractive({useHandCursor:true});
    node.on('pointerover',()=>bg.setFillStyle(primary?0xf1bf7a:0x315470));
    node.on('pointerout',()=>bg.setFillStyle(fill));
    node.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();if(pointer.leftButtonDown()&&!this.chosen)callback();
    });
    node.label=txt;
    return node;
  }
  focusCountry(id){
    if(this.chosen)return;
    const current=this.portraits.find(x=>x.option.id===id);
    if(!current||current.option.locked)return;
    this.focused=id;
    this.focusDim.setVisible(true);
    this.overlayItems.forEach(item=>item.setVisible(true));
    for(const tile of this.portraits){
      const active=tile.option.id===id;
      this.tweens.killTweensOf(tile.node);
      tile.node.setDepth(active?57:27).setAlpha(active?1:0.27);
      this.tweens.add({targets:tile.node,
        x:active?BOTECO_FOCUS.x:tile.originX,
        y:active?BOTECO_FOCUS.y:tile.originY,
        scale:active?BOTECO_FOCUS.scale:1,
        duration:BOTECO_FOCUS.duration,ease:'Cubic.Out'});
    }
    const option=current.option;
    this.countryTag.setText(REPRESENTATIVES[id].label+' • NÍVEL '+option.level);
    this.characterName.setText(REPRESENTATIVES[id].name??'Representante');
    this.flavorText.setText('“'+representativeStoryFor(id,option.level)+'”');
    this.upgradeTitle.setText(option.title);
    this.upgradeDescription.setText(option.description);
    this.acceptButton.label.setText('Aceitar '+REPRESENTATIVES[id].label+' [ENTER]');
  }
  unfocus(){
    if(this.chosen||!this.focused)return;
    this.focused=null;this.focusDim.setVisible(false);
    this.overlayItems.forEach(item=>item.setVisible(false));
    for(const tile of this.portraits){
      this.tweens.killTweensOf(tile.node);
      tile.node.setDepth(26).setAlpha(tile.option.locked?0.5:1);
      this.tweens.add({targets:tile.node,x:tile.originX,y:tile.originY,
        scale:1,duration:BOTECO_FOCUS.duration,ease:'Cubic.Out'});
    }
  }
  selectUpgrade(id){
    if(this.chosen||!this.focused)return;
    const next=chooseV1Upgrade(this.campaign,id);
    if(!next)return;
    this.chosen=true;
    this.flavorText.setText('“'+representativeLine(id,'accepted')+'”');
    this.acceptButton.disableInteractive();this.backButton.disableInteractive();
    this.acceptButton.label.setText('Parceria confirmada!');
    this.time.delayedCall(1100,()=>{
      if(this.scene.isActive())this.scene.start('GameScene',{
        mode:`wave${next.choices.length}`,campaign:next,
      });
    });
  }
}
