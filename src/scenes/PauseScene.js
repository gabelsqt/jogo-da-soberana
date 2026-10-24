import {addMusicControls} from '../audio/music.js';
import Phaser from 'phaser';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {addMenuButton} from '../ui/menuButton.js';
import {addCuboPanel,addCuboPixelText} from '../ui/cuboNewsTheme.js';

export class PauseScene extends Phaser.Scene{
  constructor(){super({key:'PauseScene'});}
  init(data={}){this.source=data.source==='UpgradeScene'?'UpgradeScene':'GameScene';}
  create(){
    const source=this.source,boteco=source==='UpgradeScene';
    const game=this.scene.get('GameScene');
    const resume=()=>{this.scene.resume(source);this.scene.stop();};
    const menu=()=>{this.scene.stop(source);this.scene.start('MenuScene');};
    const restart=()=>{
      if(boteco){
        const b=this.scene.get('UpgradeScene');
        const wave=Math.max(0,Math.min(11,b.completedWave??0));
        const campaign=b.campaign??{choices:[]};
        this.scene.stop('UpgradeScene');
        this.scene.start('GameScene',{mode:'wave'+wave,campaign});
      }else{
        const options=game.getRunOptions();
        this.scene.stop('GameScene');
        this.scene.start('GameScene',options);
      }
    };
    this.add.rectangle(W/2,H/2,W,H,0x030916,.87).setInteractive().setDepth(20);
    addCuboPanel(this,{x:W/2,y:273,width:680,height:460,depth:22});
    addCuboPixelText(this,{x:W/2,y:75,text:boteco?'Boteco pausado':'Jogo pausado',
      size:4,color:'#e2a45e',depth:30,maxWidth:570});
    addMusicControls(this,425);
    addMenuButton(this,{x:W/2,y:143,text:'▶  Continuar',onClick:resume,
      primary:true,depth:50,width:360,height:43});
    if(!boteco&&game.mode==='wave11'){
      this.add.text(W/2,205,'ONDA FINAL • REINÍCIO INDISPONÍVEL',{
        fontFamily:'monospace',fontSize:'13px',color:'#e2a45e'
      }).setOrigin(.5).setDepth(50);
    }else{
      addMenuButton(this,{x:W/2,y:205,text:boteco?'↻  Rejogar última onda':'↻  Reiniciar onda',
        onClick:restart,depth:50,width:360,height:43});
    }
    addMenuButton(this,{x:W/2,y:267,text:'⌂  Menu principal',
      onClick:menu,depth:50,width:360,height:43});
    if(this.sys.game.device.input.touch){
      this.add.text(W/2,315,'CONTROLES TOUCH',{
        fontFamily:'monospace',fontSize:'14px',color:'#e1f6ff'
      }).setOrigin(.5).setDepth(50);
      if(!boteco){
        const editing=Boolean(game.mobileEditing);
        addMenuButton(this,{x:W/2,y:360,
          text:editing?'✓  Salvar posição dos controles':'✥  Mover controles',
          width:360,height:40,depth:50,onClick:()=>{
            game.setMobileControlEditing?.(!editing);
            resume();
          }});
      }else{
        this.add.text(W/2,360,'Posições editáveis durante o combate',{
          fontFamily:'monospace',fontSize:'13px',color:'#b5d7e6'
        }).setOrigin(.5).setDepth(50);
      }
    }else{
      this.add.text(W/2,350,'MOUSE: MIRAR • ESQUERDO: TIRO • DIREITO: ESPECIAL',{
        fontFamily:'monospace',fontSize:'13px',color:'#a8cadc'
      }).setOrigin(.5).setDepth(50);
    }
    this.input.keyboard?.on('keydown-ESC',resume);
    this.input.keyboard?.on('keydown-P',resume);
  }
}
