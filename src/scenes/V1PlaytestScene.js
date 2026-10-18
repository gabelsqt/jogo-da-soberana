import { bindSceneMusic } from '../audio/music.js';
import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { FIRST_UPGRADES } from '../gameplay/upgrades.js';
import { V1_UPGRADES, v1CombatStats } from '../gameplay/v1Upgrades.js';
import { addMenuButton } from '../ui/menuButton.js';

// Teste exclusivo da ÁRVORE V1. O laboratório legado com animais permanece
// arquivado no código, mas não é apresentado no menu de playtest.
export class V1PlaytestScene extends Phaser.Scene {
  constructor() { super({ key: 'V1PlaytestScene' }); }
  init() {
    this.country = 'br';
    this.level = 2;
    this.arenaIndex = 6; // Padrão anterior: onda 6. Última opção = arena livre.
  }
  preload() { preloadRioBackdrop(this); }
  create() {
    bindSceneMusic(this, 'setup');
    drawRioBackdrop(this);
    this.add.rectangle(W / 2, H / 2, W, H, 0x051021, 0.93).setDepth(30);
    this.add.text(W / 2, 50, 'PLAYTEST — UPGRADES E FINAIS', {
      fontFamily:'monospace', fontSize:'31px', fontStyle:'bold', color:'#ffe3a0',
    }).setOrigin(0.5).setDepth(35);
    this.add.text(W / 2, 91, 'SELECIONE PAÍS, NÍVEL E ONDA PARA TESTAR', {
      fontFamily:'monospace', fontSize:'14px', color:'#9ce9db',
    }).setOrigin(0.5).setDepth(35);
    this.countryButtons = [];
    FIRST_UPGRADES.forEach((c,i) => {
      const x = 120 + i * 180;
      const r = this.add.rectangle(x, 165, 159, 65, 0x163247)
        .setStrokeStyle(2, c.color).setDepth(35).setInteractive({useHandCursor:true});
      const t = this.add.text(x, 165, c.flag+'  '+(c.shortName??c.name).toUpperCase(), {
        fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#ffffff',
        align:'center',wordWrap:{width:152},
      }).setOrigin(0.5).setDepth(36);
      r.on('pointerdown',(p,_lx,_ly,e)=>{
        e?.stopPropagation();
        if(p.leftButtonDown()) {this.country=c.id;this.refresh();}
      });
      this.countryButtons.push({id:c.id,rect:r,text:t,color:c.color});
    });
    this.add.text(W / 2, 245, 'NÍVEL DE UPGRADES DESBLOQUEADO', {
      fontFamily:'monospace',fontSize:'15px',color:'#cde5f7',
    }).setOrigin(0.5).setDepth(35);
    addMenuButton(this,{x:345,y:285,width:75,height:41,text:'−',
      onClick:()=>{this.level=Math.max(0,this.level-1);this.refresh();},depth:40});
    addMenuButton(this,{x:615,y:285,width:75,height:41,text:'+',
      onClick:()=>{this.level=Math.min(10,this.level+1);this.refresh();},depth:40});
    this.levelText=this.add.text(W/2,285,'', {
      fontFamily:'monospace',fontSize:'27px',fontStyle:'bold',color:'#ffe3a0',
    }).setOrigin(0.5).setDepth(40);
    this.upgradeText=this.add.text(W/2,345,'', {
      fontFamily:'monospace',fontSize:'16px',fontStyle:'bold',
      color:'#b6ffe6',align:'center',wordWrap:{width:820},
    }).setOrigin(0.5).setDepth(40);
    this.infoText=this.add.text(W/2,392,'', {
      fontFamily:'monospace',fontSize:'12px',color:'#b7d8ee',align:'center',
      wordWrap:{width:850},
    }).setOrigin(0.5).setDepth(40);
    this.add.text(W/2,421,'CENÁRIO DE TESTE', {
      fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#cde5f7',
    }).setOrigin(0.5).setDepth(40);
    addMenuButton(this,{x:290,y:448,width:62,height:34,text:'◀',
      onClick:()=>{this.arenaIndex=(this.arenaIndex+12)%13;this.refresh();},depth:40});
    this.arenaText=this.add.text(W/2,448,'',{
      fontFamily:'monospace',fontSize:'16px',fontStyle:'bold',color:'#ffe3a0',
    }).setOrigin(0.5).setDepth(40);
    addMenuButton(this,{x:670,y:448,width:62,height:34,text:'▶',
      onClick:()=>{this.arenaIndex=(this.arenaIndex+1)%13;this.refresh();},depth:40});
    addMenuButton(this,{x:175,y:484,width:245,height:42,text:'⌂  MENU',
      onClick:()=>this.scene.start('MenuScene'),depth:45});
    addMenuButton(this,{x:480,y:484,width:340,height:43,text:'▶  TESTAR ESTA BUILD',
      primary:true,onClick:()=>this.play(),depth:45});
    addMenuButton(this,{x:792,y:484,width:270,height:42,text:'BR+EUA+CHINA',
      onClick:()=>this.playMixed(),depth:45});
    const previewDeath = () => this.scene.start('GameScene', {
      mode: 'wave1', campaign: { choices: [] }, v1Playtest: true, previewDestruction: true,
    });
    addMenuButton(this, { x:480, y:522, width:360, height:25,
      text:'D: TESTAR DESTRUIÇÃO DO CANHÃO', depth:45, onClick:previewDeath });
    this.input.keyboard.on('keydown-D', previewDeath);
    this.input.keyboard.on('keydown-ENTER',()=>this.play());
    this.refresh();
  }
  refresh() {
    const item=this.level>0?V1_UPGRADES[this.country][this.level-1]:null;
    const stats=v1CombatStats({choices:Array(this.level).fill(this.country)});
    this.levelText.setText('NÍVEL '+this.level+' / 10');
    this.arenaText.setText(this.arenaIndex===12?'ARENA LIVRE — INIMIGOS CONTÍNUOS':'ONDA '+this.arenaIndex);
    this.upgradeText.setText(item ? item.title.toUpperCase() : 'SEM UPGRADES');
    this.infoText.setText(item ? item.description+
      (stats.ultimate?'  •  ESPAÇO: '+V1_UPGRADES[this.country][8].title:'') :
      'CANHÃO BÁSICO, SEM PODERES.');
    this.countryButtons.forEach(b=>{
      const selected=b.id===this.country;
      b.rect.setFillStyle(selected?0x286653:0x163247)
        .setStrokeStyle(selected?4:2,selected?0xb8ffe2:b.color);
      b.text.setColor(selected?'#fffcc8':'#ffffff');
    });
  }
  play() {
    const choices=Array(this.level).fill(this.country);
    this.scene.start('GameScene',{
      mode:this.arenaIndex===12?'upgradeLab':'wave'+this.arenaIndex,
      v1Playtest:true,
      campaign:{choices},
    });
  }
  playMixed() {
    this.scene.start('GameScene',{
      mode:this.arenaIndex===12?'upgradeLab':'wave'+this.arenaIndex,
      v1Playtest:true,
      campaign:{choices:['br','us','cn','br','us','cn','br','us','cn']},
    });
  }
}
