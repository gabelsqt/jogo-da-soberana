import { bindSceneMusic } from '../audio/music.js';
import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H,
  preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { FIRST_UPGRADES } from '../gameplay/upgrades.js';
import { V1_UPGRADES } from '../gameplay/v1Upgrades.js';
import { normalizeV1LabLevels, changeV1LabLevel, v1LabBuild } from '../gameplay/v1LabLoadout.js';
import { addMenuButton } from '../ui/menuButton.js';
import { addCuboBroadcastFrame, addCuboPixelText } from '../ui/cuboNewsTheme.js';

// Laboratório V1: cinco árvores independentes e combináveis. A campanha
// continua com suas dez escolhas; só este playtest ignora o limite global.
export class V1PlaytestScene extends Phaser.Scene {
  constructor() { super({ key: 'V1PlaytestScene' }); }

  init(data = {}) {
    this.levels = normalizeV1LabLevels(data.levels ?? { br: 2 });
    this.primary = data.primary ?? 'br';
    this.arenaIndex = Number.isInteger(data.arenaIndex)
      ? Math.max(0, Math.min(12, data.arenaIndex)) : 6;
  }

  preload() { preloadRioBackdrop(this); }

  create() {
    bindSceneMusic(this, 'setup');
    drawRioBackdrop(this);
    this.add.rectangle(W/2,H/2,W,H,0x0b1621,0.93).setDepth(30);
    addCuboBroadcastFrame(this,{
      section:'Laboratório de armamentos',
      headline:'Boletim técnico • Combinações de defesa',
      footer:'Simulador livre • Nenhuma alteração na campanha',
      depth:50,
    });
    addCuboPixelText(this,{x:W/2,y:82,text:'Laboratório de upgrades',
      size:3,color:'#e2a45e',depth:36,maxWidth:720});
    this.add.text(W/2,118,
      'Combine os cinco países • Níveis 0–10 independentes • Clique em PRINCIPAL para escolher o especial',{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',
        color:'#b9e6ed',
      }).setOrigin(0.5).setDepth(38);

    this.rows = [];
    FIRST_UPGRADES.forEach((country,index) => {
      const y=158+index*47;
      const panel=this.add.rectangle(W/2,y,900,41,0x12283c,0.98)
        .setStrokeStyle(1.5,country.color).setDepth(35);
      const flag=this.add.text(76,y,country.flag+' '+(country.shortName??country.name),{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'15px',
        fontStyle:'bold',color:'#f7f9ff',
      }).setOrigin(0,0.5).setDepth(38);
      const upgrade=this.add.text(330,y,'',{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',
        color:'#d6e7f9',wordWrap:{width:248},align:'left',
      }).setOrigin(0.5).setDepth(38);
      this.miniButton(525,y,'−',()=>this.changeLevel(country.id,-1),42);
      const counter=this.add.text(590,y,'',{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'19px',
        fontStyle:'bold',color:'#bbfce4',
      }).setOrigin(0.5).setDepth(38);
      this.miniButton(653,y,'+',()=>this.changeLevel(country.id,1),42);
      const primaryBg=this.add.rectangle(815,y,183,32,0x19364d,1)
        .setStrokeStyle(1.5,0x83b7db).setDepth(37)
        .setInteractive({useHandCursor:true});
      const primaryText=this.add.text(815,y,'',{
        fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',
        fontStyle:'bold',color:'#e1f6ff',
      }).setOrigin(0.5).setDepth(38);
      primaryBg.on('pointerdown',(pointer,_x,_y,event)=>{
        event?.stopPropagation();
        if(pointer.leftButtonDown()){
          this.primary=country.id;
          this.refresh();
        }
      });
      this.rows.push({id:country.id,panel,flag,upgrade,counter,primaryBg,primaryText,
        color:country.color});
    });

    this.buildSummary=this.add.text(W/2,391,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',
      color:'#a8fbe0',align:'center',wordWrap:{width:865},
    }).setOrigin(0.5).setDepth(40);
    this.previewText=this.add.text(W/2,414,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'12px',
      color:'#f1dba5',align:'center',wordWrap:{width:815},
    }).setOrigin(0.5).setDepth(40);

    this.miniButton(330,451,'◀',()=>{
      this.arenaIndex=(this.arenaIndex+12)%13;this.refresh();
    },48);
    this.arenaText=this.add.text(W/2,451,'',{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',
      fontSize:'15px',fontStyle:'bold',color:'#ffe3a0',
    }).setOrigin(0.5).setDepth(40);
    this.miniButton(630,451,'▶',()=>{
      this.arenaIndex=(this.arenaIndex+1)%13;this.refresh();
    },48);
    this.miniButton(817,451,'ZERAR',()=>{
      this.levels=normalizeV1LabLevels();this.refresh();
    },120);

    addMenuButton(this,{x:156,y:500,width:235,height:43,
      text:'⌂ MENU',onClick:()=>this.scene.start('MenuScene'),depth:45});
    addMenuButton(this,{x:465,y:500,width:330,height:43,
      text:'▶ TESTAR COMBINAÇÃO',primary:true,onClick:()=>this.play(),depth:45});
    addMenuButton(this,{x:794,y:500,width:205,height:43,
      text:'WAVE MAKER',fontSize:'14px',
      onClick:()=>this.scene.start('WaveMakerScene',{
        wave:Math.min(this.arenaIndex,11)}),depth:45});

    // Atalhos seguros: não há teclas que reiniciem o combate por acidente.
    this.input.keyboard.on('keydown-ENTER',()=>this.play());
    this.refresh();
  }

  miniButton(x,y,label,onClick,width=44) {
    const bg=this.add.rectangle(x,y,width,32,0x1e4059,0.98)
      .setStrokeStyle(1.5,0x78afc9).setDepth(37)
      .setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'17px',
      color:'#edfcff',fontStyle:'bold',
    }).setOrigin(0.5).setDepth(38);
    bg.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();
      if(pointer.leftButtonDown())onClick();
    });
    return bg;
  }

  changeLevel(country,delta) {
    this.levels=changeV1LabLevel(this.levels,country,delta);
    this.refresh();
  }

  refresh() {
    const build=v1LabBuild(this.levels,this.primary);
    const n=build.labLevels;
    for(const row of this.rows){
      const level=n[row.id];
      const upgrade=level?V1_UPGRADES[row.id][level-1]:null;
      row.counter.setText(''+level+' / 10');
      row.upgrade.setText(upgrade?upgrade.title:'SEM MELHORIAS');
      const selected=row.id===this.primary;
      row.primaryBg.setFillStyle(selected?0x245f4a:0x19364d)
        .setStrokeStyle(selected?2.5:1.5,selected?0x9dffce:0x83b7db);
      row.primaryText.setText(selected?'★ PRINCIPAL':'ESCOLHER PRINCIPAL');
      row.primaryText.setColor(selected?'#b9ffe2':'#d0e7f5');
      row.panel.setStrokeStyle(level?2:1.5,level?row.color:0x375168);
    }
    const active=Object.entries(n).filter(([,level])=>level>0);
    const total=active.reduce((sum,[,level])=>sum+level,0);
    this.buildSummary.setText('PAÍSES ATIVOS: '+active.length+'/5'
      +'    •    UPGRADES: '+total+' (laboratório sem limite global)'
      +'    •    ESPECIAL: '+(build.labPrimary?.toUpperCase()??'NENHUM'));
    const chosen=n[this.primary];
    const item=chosen?V1_UPGRADES[this.primary][chosen-1]:null;
    this.previewText.setText(item
      ?item.description
      :'Selecione o nível de cada país. O especial principal exige nível 2 ou superior.');
    this.arenaText.setText(this.arenaIndex===12?'ARENA LIVRE'
      :'ONDA '+this.arenaIndex);
  }

  play() {
    const build=v1LabBuild(this.levels,this.primary);
    this.scene.start('GameScene',{
      mode:this.arenaIndex===12?'upgradeLab':'wave'+this.arenaIndex,
      v1Playtest:true, v1LabLevels:build.labLevels,
      v1LabPrimary:build.labPrimary,
      campaign:{choices:[]},
    });
  }
}
