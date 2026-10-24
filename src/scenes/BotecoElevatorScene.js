import Phaser from 'phaser';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {bindSceneMusic} from '../audio/music.js';

// Transição discreta de elevador entre o canhão e o Boteco já existente.
// O Boteco mantém sua arte original e não é transformado em um bunker.
export class BotecoElevatorScene extends Phaser.Scene{
  constructor(){super({key:'BotecoElevatorScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.completedWave=Number.isFinite(data.completedWave)?data.completedWave:0;
    this.first=Boolean(data.first);this.done=false;
  }
  create(){
    bindSceneMusic(this,'upgrades');
    this.add.rectangle(W/2,H/2,W,H,0x07111b);
    // Ferro escuro, barras e lâmpada de um velho elevador de carga.
    const g=this.add.graphics();g.fillStyle(0x182e36).fillRect(215,64,530,423);
    g.fillStyle(0x284044).fillRect(235,92,490,372);
    for(let x=258;x<=720;x+=43){
      g.lineStyle(5,0x5a7774,.8);g.lineBetween(x,93,x,466);
    }
    g.fillStyle(0x7f7461).fillRect(230,64,500,25);
    g.fillStyle(0xbaa778).fillRect(465,105,30,21);
    const board=this.add.rectangle(W/2,235,390,125,0x0b1720,.96)
      .setStrokeStyle(3,0xb4a77d);
    this.add.text(W/2,215,'ELEVADOR DE CARGA',{
      fontFamily:'monospace',fontSize:'24px',fontStyle:'bold',color:'#eed6a7',
    }).setOrigin(.5);
    this.add.text(W/2,256,'ACESSO AO BOTECO  ↓',{
      fontFamily:'monospace',fontSize:'18px',color:'#afd4c5',
    }).setOrigin(.5);
    this.add.text(W/2,H-35,'CLIQUE PARA CONTINUAR',{
      fontFamily:'monospace',fontSize:'13px',color:'#91bdb9',
    }).setOrigin(.5);
    this.cameras.main.fadeIn(230,0,0,0);
    this.input.on('pointerdown',p=>{if(p.leftButtonDown())this.finish();});
    this.input.keyboard?.on('keydown-SPACE',()=>this.finish());
    this.input.keyboard?.on('keydown-ENTER',()=>this.finish());
    this.time.delayedCall(1900,()=>this.finish());
  }
  finish(){
    if(this.done)return;this.done=true;
    this.scene.start('UpgradeScene',{
      campaign:this.campaign,completedWave:this.completedWave,
      viaElevator:true,
    });
  }
}
