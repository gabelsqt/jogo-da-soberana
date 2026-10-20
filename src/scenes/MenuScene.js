import {bindSceneMusic,addMenuMusicControl} from '../audio/music.js';
import Phaser from 'phaser';
import {
  GAME_WIDTH as W,GAME_HEIGHT as H,
  preloadRioBackdrop,drawRioBackdrop,
} from '../config/scenery.js';
import {addMenuButton} from '../ui/menuButton.js';
import {GAME_VERSION_LABEL} from '../config/version.js';

// A tela inicial é uma vitrine da pixel art do Rio.
// Cubo News fica reservada para o noticiário e para as cenas do jogo.
export class MenuScene extends Phaser.Scene{
  constructor(){super({key:'MenuScene'});}
  preload(){preloadRioBackdrop(this);}
  create(){
    bindSceneMusic(this,'menu');
    drawRioBackdrop(this);

    const titleStyle={
      fontFamily:"'IBM Plex Sans',system-ui,sans-serif",
      fontSize:'65px',fontStyle:'bold',color:'#f2af68',
      stroke:'#081423',strokeThickness:7,
      shadow:{offsetX:3,offsetY:4,color:'#06101e',blur:0,fill:true},
    };
    this.add.text(W/2,116,'Operação Soberania',titleStyle)
      .setOrigin(0.5).setDepth(30);
    this.add.text(W/2,178,'O RIO NÃO VAI CAIR',{
      fontFamily:"'IBM Plex Sans',system-ui,sans-serif",
      fontSize:'18px',fontStyle:'bold',color:'#f2f2e4',
      stroke:'#06101e',strokeThickness:4,
    }).setOrigin(0.5).setDepth(30);

    const startGame=()=>this.scene.start('IntroScene',{campaign:{choices:[]}});
    const testUpgrades=()=>this.scene.start('V1PlaytestScene');
    addMenuButton(this,{
      x:W/2,y:319,width:390,height:56,text:'▶  COMEÇAR CAMPANHA',
      primary:true,depth:31,onClick:startGame,
    });
    addMenuButton(this,{
      x:W/2,y:389,width:354,height:49,text:'★  TESTAR UPGRADES',
      depth:31,onClick:testUpgrades,
    });

    // O volume fica fechado em um único botão no canto inferior esquerdo.
    // Clicar revela slider real e mudo, sem cobrir o cenário permanentemente.
    addMenuMusicControl(this,{x:91,y:H-22,depth:45});
    this.add.text(W-16,H-14,GAME_VERSION_LABEL,{
      fontFamily:'monospace',fontSize:'11px',color:'#d0dce6',
      stroke:'#06101e',strokeThickness:3,
    }).setOrigin(1,1).setDepth(40);

    this.input.keyboard.on('keydown-ENTER',startGame);
    this.input.keyboard.on('keydown-U',testUpgrades);
  }
}
