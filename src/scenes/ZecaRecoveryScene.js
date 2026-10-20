import Phaser from 'phaser';
import { addMenuButton } from '../ui/menuButton.js';
import { addCuboBroadcastFrame } from '../ui/cuboNewsTheme.js';
import { zecaOperationCopy } from '../gameplay/zecaRecovery.js';

const W=960,H=540;

// Cena substituível: até o usuário criar a pixel art dos motoristas brasileiros,
// mostramos uma van em pixel art geométrica, SEM atribuir identidade ao contato.
export class ZecaRecoveryScene extends Phaser.Scene {
  constructor(){super({key:'ZecaRecoveryScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.selectedBetrayer=data.selectedBetrayer;
    this.copy=zecaOperationCopy(this.selectedBetrayer);
  }

  create(){
    if(!this.copy){
      this.scene.start('MenuScene');
      return;
    }
    const {color}=this.copy;
    this.add.rectangle(W/2,H/2,W,H,0x0a1420).setDepth(1);
    addCuboBroadcastFrame(this,{
      section:'PLANTÃO • OPERAÇÃO DESVIO DE CARGA',
      headline:'Contato brasileiro de Zeca resolve logística de última hora',
      footer:'Cubo News • Última tentativa de defesa nacional',
      depth:35,
    });
    this.add.text(W/2,94,'OPERAÇÃO DESVIO DE CARGA',{
      fontFamily:'monospace',fontSize:'27px',fontStyle:'bold',color:'#f8e7c2',
    }).setOrigin(0.5).setDepth(15);

    const frame=this.add.rectangle(W/2,248,764,234,0x192b3a)
      .setStrokeStyle(3,color).setDepth(9);
    const art=this.add.graphics().setDepth(10);
    // Granulação em blocos e silhueta de van: substituição simples por
    // imagens definitivas específicas de cada traidor quando existirem.
    art.fillStyle(0x0d1927,1).fillRect(105,137,750,224);
    for(let row=0;row<17;row++){
      art.fillStyle(row%3===0?0x29374c:0x1c3044,0.52);
      art.fillRect(105,138+row*13,750,3);
    }
    art.fillStyle(0x364a54,1).fillRect(105,333,750,13);
    art.fillStyle(color,1).fillRect(268,230,364,75);
    art.fillStyle(0x101d28,1).fillRect(428,213,144,53);
    art.fillStyle(0x84b8c5,1).fillRect(435,219,58,34);
    art.fillStyle(0x84b8c5,1).fillRect(503,219,59,34);
    art.fillStyle(0x172433,1).fillRect(282,242,120,46);
    art.fillStyle(0x13202c,1).fillRect(295,252,90,20);
    art.fillStyle(0x111920,1).fillRect(322,297,52,52);
    art.fillStyle(0x111920,1).fillRect(527,297,52,52);
    art.fillStyle(0xb6c5c8,1).fillRect(334,309,28,28);
    art.fillStyle(0xb6c5c8,1).fillRect(539,309,28,28);
    art.fillStyle(0xffe2a2,1).fillRect(620,263,13,21);
    art.fillStyle(0xffffff,0.8).fillRect(266,283,18,8);
    this.add.text(W/2,150,'CARGA RECUPERADA • MOTORISTA BRASILEIRO',{
      fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#e0e9ee',
    }).setOrigin(0.5).setDepth(16);
    this.add.text(W/2,343,'CENA PROVISÓRIA • ARTE DOS MOTORISTAS A SER INSERIDA',{
      fontFamily:'monospace',fontSize:'11px',color:'#e9d6ba',
    }).setOrigin(0.5).setDepth(17);

    const text=`ZECA: "${this.copy.line}"\n\n"O Supremo ficou. Não dava pra levar aquilo num carro.\nAgora é a última corrida, chefe."`;
    this.add.text(W/2,403,text,{
      fontFamily:'monospace',fontSize:'15px',color:'#eaf3ff',
      align:'center',wordWrap:{width:850},lineSpacing:5,
    }).setOrigin(0.5).setDepth(17);

    let used=false;
    const advance=()=>{
      if(used)return;
      used=true;
      this.scene.start('GameScene',{
        mode:'wave11',campaign:this.campaign,
        selectedBetrayer:this.selectedBetrayer,zecaRevenge:true,
      });
    };
    addMenuButton(this,{x:W/2,y:492,width:400,height:44,
      text:'▶  ÚLTIMA CHANCE — ENFRENTAR O TRAIDOR',
      primary:true,depth:48,onClick:advance});
  }
}
