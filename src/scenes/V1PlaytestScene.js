import {bindSceneMusic} from '../audio/music.js';
import Phaser from 'phaser';
import {GAME_WIDTH as W,GAME_HEIGHT as H,preloadRioBackdrop,drawRioBackdrop} from '../config/scenery.js';
import {FIRST_UPGRADES} from '../gameplay/upgrades.js';
import {LAB_BALANCE_FIELDS,emptyLabAllocation,normalizeLabAllocation,labLevelCounts,singleCountryAtTen} from '../gameplay/labBalanceProfile.js';
import {readLabBalance,mountLabBalanceEditor} from '../ui/labBalanceEditor.js';
import {addMenuButton} from '../ui/menuButton.js';
import {addCuboBroadcastFrame,addCuboPixelText} from '../ui/cuboNewsTheme.js';

// Laboratório matemático — primeiro as duas identidades, depois os 40
// estágios independentes P1–P4/S1–S4. A campanha não usa este editor.
export class V1PlaytestScene extends Phaser.Scene {
  constructor(){super({key:'V1PlaytestScene'});}
  init(data={}){
    this.principal=data.principal??null;
    this.especial=data.especial??null;
    this.allocation=normalizeLabAllocation(data.allocation??emptyLabAllocation());
    this.arenaIndex=Number.isInteger(data.arenaIndex)
      ?Math.max(0,Math.min(12,data.arenaIndex)):12;
    this.notice='';
  }
  preload(){preloadRioBackdrop(this);}
  create(){
    bindSceneMusic(this,'setup');drawRioBackdrop(this);
    this.add.rectangle(W/2,H/2,W,H,0x0b1621,.94).setDepth(30);
    addCuboBroadcastFrame(this,{section:'Laboratório de armamentos',
      headline:'Boletim técnico • Balanceamento matemático',
      footer:'Perfil experimental • Sem alterações na campanha',depth:50});
    addCuboPixelText(this,{x:W/2,y:79,text:'Laboratório',size:3,
      color:'#e2a45e',depth:36,maxWidth:720});
    this.intro=this.add.text(W/2,113,'',{
      fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:'13px',
      fontStyle:'bold',color:'#b9e6ed',
    }).setOrigin(.5).setDepth(39);
    this.add.text(305,140,'PRINCIPAL • P1–P4',{
      fontFamily:'monospace',fontSize:'12px',color:'#99defc',
    }).setOrigin(.5).setDepth(40);
    this.add.text(530,140,'ESPECIAL • S1–S4',{
      fontFamily:'monospace',fontSize:'12px',color:'#ffe1a4',
    }).setOrigin(.5).setDepth(40);
    this.rows=[];
    for(const [index,country] of FIRST_UPGRADES.entries()){
      const y=169+index*42;
      const panel=this.add.rectangle(W/2,y,910,39,0x12283c,.98)
        .setStrokeStyle(1.5,country.color).setDepth(35);
      const flag=this.add.text(65,y,country.flag+' '+(country.shortName??country.name),{
        fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:'14px',
        fontStyle:'bold',color:'#f7f9ff',
      }).setOrigin(0,.5).setDepth(38);
      this.miniButton(255,y,'−',()=>this.changeStage(country.id,'P',-1),32);
      const pCount=this.add.text(308,y,'',{
        fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#b9f1ff',
      }).setOrigin(.5).setDepth(40);
      this.miniButton(355,y,'+',()=>this.changeStage(country.id,'P',1),32);
      this.miniButton(476,y,'−',()=>this.changeStage(country.id,'S',-1),32);
      const sCount=this.add.text(529,y,'',{
        fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#ffe3ba',
      }).setOrigin(.5).setDepth(40);
      this.miniButton(575,y,'+',()=>this.changeStage(country.id,'S',1),32);
      const pb=this.chooseButton(715,y,'PRINCIPAL',()=>this.selectIdentity('principal',country.id));
      const sb=this.chooseButton(849,y,'ESPECIAL',()=>this.selectIdentity('especial',country.id));
      this.rows.push({id:country.id,panel,flag,pCount,sCount,pb,sb,color:country.color});
    }
    this.buildSummary=this.add.text(W/2,396,'',{
      fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:'12px',
      color:'#a8fbe0',align:'center',wordWrap:{width:870},
    }).setOrigin(.5).setDepth(40);
    this.previewText=this.add.text(W/2,419,'',{
      fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:'12px',
      color:'#f1dba5',align:'center',wordWrap:{width:890},
    }).setOrigin(.5).setDepth(40);
    this.miniButton(315,454,'◀',()=>{
      this.arenaIndex=(this.arenaIndex+12)%13;this.refresh();
    },43);
    this.arenaText=this.add.text(W/2,454,'',{
      fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:'15px',
      color:'#ffe3a0',fontStyle:'bold',
    }).setOrigin(.5).setDepth(40);
    this.miniButton(646,454,'▶',()=>{
      this.arenaIndex=(this.arenaIndex+1)%13;this.refresh();
    },43);
    this.miniButton(822,454,'ZERAR UPGRADES',()=>{
      this.allocation=emptyLabAllocation();
      this.mathEditor.updateAllocation(this.allocation);
      this.notice='Estágios zerados; identidades preservadas.';this.refresh();
    },162);
    addMenuButton(this,{x:147,y:503,width:216,height:43,
      text:'⌂ MENU',onClick:()=>this.scene.start('MenuScene'),depth:45});
    addMenuButton(this,{x:467,y:503,width:375,height:43,
      text:'▶ TESTAR COMBINAÇÃO',primary:true,onClick:()=>this.play(),depth:45});
    addMenuButton(this,{x:808,y:503,width:201,height:43,
      text:'WAVE MAKER',fontSize:'14px',
      onClick:()=>this.scene.start('WaveMakerScene',{wave:Math.min(this.arenaIndex,11)}),depth:45});
    this.mathEditor=mountLabBalanceEditor({allocation:this.allocation});
    this.events.once('shutdown',()=>this.mathEditor.destroy());
    this.input.keyboard.on('keydown-ENTER',event=>{
      if(/INPUT|TEXTAREA/.test(event.target?.tagName??''))return;
      this.play();
    });
    this.refresh();
  }
  miniButton(x,y,label,onClick,width=44){
    const bg=this.add.rectangle(x,y,width,31,0x1e4059,.98)
      .setStrokeStyle(1.5,0x78afc9).setDepth(37).setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{
      fontFamily:'IBM Plex Sans,system-ui,sans-serif',fontSize:label.length>3?'11px':'17px',
      color:'#edfcff',fontStyle:'bold',
    }).setOrigin(.5).setDepth(38);
    bg.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();if(pointer.leftButtonDown())onClick();
    });
    return bg;
  }
  chooseButton(x,y,label,onClick){
    const bg=this.add.rectangle(x,y,120,29,0x19364d,1)
      .setStrokeStyle(1.5,0x83b7db).setDepth(37)
      .setInteractive({useHandCursor:true});
    this.add.text(x,y,label,{
      fontFamily:'monospace',fontSize:'11px',fontStyle:'bold',color:'#e1f6ff',
    }).setOrigin(.5).setDepth(38);
    bg.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();if(pointer.leftButtonDown())onClick();
    });
    return bg;
  }
  selectIdentity(kind,country){
    if(kind==='especial'&&!this.principal){
      this.notice='Escolha primeiro a identidade PRINCIPAL.';this.refresh();return;
    }
    if((kind==='principal'&&this.principal!==country)||
       (kind==='especial'&&this.especial!==country)){
      // Trocar identidade só muda a forma das armas; manter as propriedades
      // editáveis e os níveis distribuídos para comparação A/B.
    }
    this[kind]=country;
    if(kind==='principal'&&this.especial===null)this.notice='Agora defina o tiro ESPECIAL.';
    else this.notice='Identidades confirmadas. Distribua P1–P4 e S1–S4.';
    this.refresh();
  }
  changeStage(country,track,delta){
    if(!this.principal||!this.especial){
      this.notice='Defina PRINCIPAL e ESPECIAL antes de distribuir melhorias.';
      this.refresh();return;
    }
    const prev=this.allocation[country][track];
    const next=Phaser.Math.Clamp(prev+delta,0,4);
    if(next===prev)return;
    this.allocation[country][track]=next;
    // Máximo de um nível 10; só as duas identidades iguais permitem
    // conquistar a transformação no laboratório.
    const counts=labLevelCounts(this.allocation,this.principal,this.especial);
    if(Object.values(counts).some(n=>n>10)||
       (Object.entries(counts).some(([id,n])=>n>=10&&
        (this.principal!==id||this.especial!==id)))){
      this.allocation[country][track]=prev;
      this.notice='Nível 10 exige duas identidades do mesmo país.';this.refresh();return;
    }
    this.mathEditor.updateAllocation(this.allocation);
    this.notice=country.toUpperCase()+' '+track+next+' selecionado.';
    this.refresh();
  }
  refresh(){
    const phase=!this.principal?'1/3: escolha a identidade do tiro PRINCIPAL'
      :!this.especial?'2/3: escolha a identidade do tiro ESPECIAL'
      :'3/3: distribua melhorias e configure os valores matemáticos ⚙';
    this.intro.setText(phase);
    const n=labLevelCounts(this.allocation,this.principal,this.especial);
    for(const r of this.rows){
      r.pCount.setText(this.allocation[r.id].P+'/4');
      r.sCount.setText(this.allocation[r.id].S+'/4');
      for(const [bg,active] of [[r.pb,this.principal===r.id],[r.sb,this.especial===r.id]]){
        bg.setFillStyle(active?0x245f4a:0x19364d)
          .setStrokeStyle(active?2.5:1.5,active?0x9dffce:0x83b7db);
      }
      r.panel.setStrokeStyle(n[r.id]>0?2:1,n[r.id]>0?r.color:0x375168);
    }
    const total=Object.values(n).reduce((a,b)=>a+b,0);
    const winner=singleCountryAtTen(n,this.principal,this.especial);
    this.buildSummary.setText('PRINCIPAL: '+(this.principal?.toUpperCase()??'PENDENTE')
      +'  •  ESPECIAL: '+(this.especial?.toUpperCase()??'PENDENTE')
      +'  •  TOTAL: '+total+'  •  SUPREMO: '+(winner?.toUpperCase()??'BLOQUEADO'));
    this.previewText.setText(this.notice||'Use os botões ⚙ BALANCEAMENTO para editar números, importar e exportar JSON. Os valores ficam salvos neste navegador.');
    this.arenaText.setText(this.arenaIndex===12?'ARENA LIVRE':'ONDA '+this.arenaIndex);
  }
  play(){
    if(!this.principal||!this.especial){
      this.notice='Defina PRINCIPAL e ESPECIAL antes de iniciar o teste.';
      this.refresh();return;
    }
    const levels=labLevelCounts(this.allocation,this.principal,this.especial);
    this.scene.start('GameScene',{
      mode:this.arenaIndex===12?'upgradeLab':'wave'+this.arenaIndex,
      v1Playtest:true,v1LabLevels:levels,v1LabPrimary:this.especial,
      v1LabPrincipal:this.principal,v1LabSpecial:this.especial,
      v1LabAllocation:normalizeLabAllocation(this.allocation),
      v1LabBalance:readLabBalance(),campaign:{choices:[]},
    });
  }
}
