import {bindSceneMusic,addMusicControls} from '../audio/music.js';
import Phaser from 'phaser';
import {
  GAME_WIDTH as W,GAME_HEIGHT as H,
  preloadRioBackdrop,drawRioBackdrop,
} from '../config/scenery.js';
import {addMenuButton} from '../ui/menuButton.js';
import {addCuboBroadcastFrame,addCuboPanel,addCuboPixelText} from '../ui/cuboNewsTheme.js';
import {GAME_VERSION_LABEL} from '../config/version.js';
import {resolvePlayerName,getSavedPlayerName,savePlayerName} from '../gameplay/playerIdentity.js';

export class MenuScene extends Phaser.Scene{
  constructor(){super({key:'MenuScene'});}
  preload(){preloadRioBackdrop(this);}
  create(){
    bindSceneMusic(this,'menu');
    drawRioBackdrop(this);
    addMusicControls(this,385);
    this.add.rectangle(W/2,H/2,W,H,0x020712,0.64).setDepth(20);
    addCuboPanel(this,{x:W/2,y:281,width:720,height:383,depth:25,
      accent:0x607e99});
    addCuboBroadcastFrame(this,{
      section:'Central de transmissões',
      headline:'Plantão especial • Defesa do Rio de Janeiro',
      footer:'Transmissão de emergência • A defesa brasileira continua',
      depth:45,
    });
    addCuboPixelText(this,{x:W/2,y:119,text:'Soberana',size:7,
      color:'#edc75a',depth:33,maxWidth:540});
    this.add.text(W/2,163,'O Rio não vai cair',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'21px',fontStyle:'bold',
      color:'#f5f0dc',
    }).setOrigin(0.5).setDepth(34);
    this.add.rectangle(W/2,200,540,3,0xedc75a).setDepth(34);
    this.add.text(W/2,219,'Defesa antiaérea  •  Playtest V1',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'15px',color:'#e1ece7',
    }).setOrigin(0.5).setDepth(34);
    const startGame=()=>{
      if(!this.registry.get('playerName')){
        if(this.playerNamePanel)this.playerNamePanel.hidden=false;
        return;
      }
      this.scene.start('IntroScene',{
        playerName:this.registry.get('playerName'),campaign:{choices:[]},
      });
    };
    const testUpgrades=()=>this.scene.start('V1PlaytestScene');
    addMenuButton(this,{x:W/2,y:282,text:'▶  Começar campanha V1',
      onClick:startGame,primary:true,depth:34,width:388});
    addMenuButton(this,{x:W/2,y:350,text:'★  Testar upgrades V1',
      onClick:testUpgrades,depth:34,width:358});
    this.add.text(W/2,404,'5 países  •  50 upgrades  •  Uma só soberania',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'14px',color:'#edc75a',
    }).setOrigin(0.5).setDepth(35);
    this.add.text(W/2,445,
      'Mouse: mirar  •  Esq.: tiro  •  Dir.: especial  •  Espaço: suprema',{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',color:'#dfeafb',
      }).setOrigin(0.5).setDepth(35);
    this.add.text(W/2,473,'ENTER: iniciar   •   U: laboratório de upgrades',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',color:'#edc75a',
    }).setOrigin(0.5).setDepth(35);
    // Rótulo da versão preservado e acima da tarja do telejornal.
    this.add.text(W-16,H-12,GAME_VERSION_LABEL+' • PLAYTEST V1',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',color:'#bfd2e9',
      stroke:'#061124',strokeThickness:2,
    }).setOrigin(1,1).setDepth(52);
    this.input.keyboard.on('keydown-ENTER',startGame);
    this.input.keyboard.on('keydown-U',testUpgrades);
    this.installNameGate();
  }
  installNameGate(){
    if(typeof document==='undefined')return;
    const panel=document.getElementById('player-name-panel');
    const input=document.getElementById('player-name-input');
    if(!panel||!input)return;
    this.playerNamePanel=panel;
    const store=typeof window!=='undefined'?window.localStorage:null;
    const saved=getSavedPlayerName(store);
    if(!this.registry.get('playerName')){
      input.value=saved;panel.hidden=false;
      this.time.delayedCall(180,()=>input.focus());
    }else panel.hidden=true;
    const submit=event=>{
      event.preventDefault();
      const name=resolvePlayerName(input.value);
      this.registry.set('playerName',savePlayerName(store,name));
      input.value=name;
      panel.hidden=true;
      // Confirmar o nome começa imediatamente o plantão, sem exigir
      // um segundo clique no botão de campanha do menu.
      this.scene.start('IntroScene',{playerName:name,campaign:{choices:[]}});
    };
    panel.addEventListener('submit',submit);
    this.events.once('shutdown',()=>{
      panel.removeEventListener('submit',submit);panel.hidden=true;
    });
  }
}
