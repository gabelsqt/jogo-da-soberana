import {addMusicControls} from '../audio/music.js';
import Phaser from 'phaser';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {addMenuButton} from '../ui/menuButton.js';
import {addCuboBroadcastFrame,addCuboPanel,addCuboPixelText} from '../ui/cuboNewsTheme.js';

export class PauseScene extends Phaser.Scene{
  constructor(){super({key:'PauseScene'});}
  create(){
    addMusicControls(this,425);
    this.add.rectangle(W/2,H/2,W,H,0x030916,0.79)
      .setInteractive().setDepth(20);
    addCuboPanel(this,{x:W/2,y:276,width:570,height:360,depth:22});
    addCuboBroadcastFrame(this,{
      section:'Plantão interrompido',
      headline:'Transmissão suspensa a pedido do operador',
      footer:'A invasão continua quando a transmissão for retomada',
      depth:42,
    });
    addCuboPixelText(this,{x:W/2,y:142,text:'Jogo pausado',
      size:4,color:'#e2a45e',depth:30,maxWidth:465});
    this.add.text(W/2,186,'A invasão pode esperar. Por enquanto.',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'16px',color:'#dce8ee',
    }).setOrigin(0.5).setDepth(30);
    const resumeGame=()=>{
      this.scene.resume('GameScene');
      this.scene.stop();
    };
    const restartGame=()=>{
      const options=this.scene.get('GameScene').getRunOptions();
      this.scene.stop('GameScene');
      this.scene.start('GameScene',options);
    };
    const returnToMenu=()=>{
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    };
    addMenuButton(this,{x:W/2,y:250,text:'▶  Retomar transmissão',
      onClick:resumeGame,primary:true,depth:30,width:346});
    // A onda 11 tem somente uma revanche narrativa: não permitir
    // reinícios ilimitados por meio do menu de pausa.
    if(this.scene.get('GameScene').mode!=='wave11'){
      addMenuButton(this,{x:W/2,y:322,text:'↻  Reiniciar onda',
        onClick:restartGame,depth:30,width:328});
    } else {
      this.add.text(W/2,322,'ONDA FINAL • REINÍCIO INDISPONÍVEL',{
        fontFamily:'monospace',fontSize:'14px',color:'#e2a45e',
      }).setOrigin(0.5).setDepth(30);
    }
    addMenuButton(this,{x:W/2,y:394,text:'⌂  Menu principal',
      onClick:returnToMenu,depth:30,width:328});
    this.add.text(W/2,466,'ESC ou P: voltar ao jogo',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'13px',color:'#adc9d9',
    }).setOrigin(0.5).setDepth(30);
    this.input.keyboard.on('keydown-ESC',resumeGame);
    this.input.keyboard.on('keydown-P',resumeGame);
  }
}
