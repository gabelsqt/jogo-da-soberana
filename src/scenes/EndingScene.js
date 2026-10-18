import Phaser from 'phaser';
import { finaleEnding } from '../gameplay/campaignFinale.js';
import { addMenuButton } from '../ui/menuButton.js';

const W=960,H=540;
const FONT='monospace';

// Tela de finais estilo anime: quatro quadros estáticos por resultado.
// Ilustração definitiva poderá substituir o painel central de cada quadro.
export class EndingScene extends Phaser.Scene {
  constructor() { super({key:'EndingScene'}); }

  init(data={}) {
    this.campaign=data.campaign ?? {choices:[]};
    this.ending=finaleEnding(this.campaign,Boolean(data.won));
    this.frame=0;
  }

  create() {
    const {ending}=this;
    this.add.rectangle(W/2,H/2,W,H,0x070e20).setDepth(0);
    const g=this.add.graphics().setDepth(1);
    g.fillStyle(ending.won?0x0d2c31:0x351925).fillRect(0,0,W,H);
    for(let i=0;i<18;i++){
      g.lineStyle(1,ending.color,0.06+i*0.001);
      g.lineBetween(0,i*32,W,i*32);
    }
    this.add.rectangle(W/2,38,W,76,0x0c1427,0.96)
      .setStrokeStyle(2,ending.color).setDepth(10);
    this.add.text(W/2,26,ending.subtitle,{
      fontFamily:FONT,fontSize:'15px',color:'#fff0bf',fontStyle:'bold',
    }).setOrigin(0.5).setDepth(11);
    this.title=this.add.text(W/2,56,ending.title,{
      fontFamily:FONT,fontSize:'23px',color:'#ffffff',fontStyle:'bold',
      align:'center',wordWrap:{width:900},
    }).setOrigin(0.5).setDepth(11);

    const panel=this.add.rectangle(W/2,259,812,313,0x111e32)
      .setStrokeStyle(4,ending.color).setDepth(5);
    this.add.rectangle(W/2,230,752,228,ending.color,0.10)
      .setStrokeStyle(1,0xffffff,0.19).setDepth(6);
    const emblem=this.add.text(W/2,210,ending.won?'✦':'◆',{
      fontFamily:FONT,fontSize:'85px',fontStyle:'bold',
      color:ending.won?'#e7ffe6':'#ffd6d6',
    }).setOrigin(0.5).setDepth(9);
    this.sceneLabel=this.add.text(W/2,321,'',{
      fontFamily:FONT,fontSize:'29px',fontStyle:'bold',
      color:'#ffffff',align:'center',wordWrap:{width:740},
    }).setOrigin(0.5).setDepth(10);
    this.caption=this.add.text(W/2,426,'',{
      fontFamily:FONT,fontSize:'17px',color:'#e3eeff',
      align:'center',wordWrap:{width:790,useAdvancedWrap:true},lineSpacing:6,
    }).setOrigin(0.5).setDepth(15);
    this.number=this.add.text(96,123,'',{
      fontFamily:FONT,fontSize:'12px',color:'#c4d4e6',
    }).setDepth(14);

    this.next=addMenuButton(this,{
      x:680,y:501,width:280,height:40,text:'PRÓXIMO QUADRO ▶',
      primary:true,depth:20,onClick:()=>this.advance(),
    });
    addMenuButton(this,{
      x:232,y:501,width:190,height:40,text:'⌂  MENU',
      depth:20,onClick:()=>this.scene.start('MenuScene'),
    });
    this.input.keyboard.on('keydown-ENTER',()=>this.advance());
    this.input.keyboard.on('keydown-SPACE',(event)=>{
      event.preventDefault();this.advance();
    });
    this.input.keyboard.on('keydown-ESC',()=>this.scene.start('MenuScene'));
    this.paintFrame();
  }

  paintFrame() {
    const [scene,caption]=this.ending.slides[this.frame];
    this.sceneLabel.setText(scene);
    this.caption.setText(caption);
    this.number.setText(`EPÍLOGO ${this.frame+1} / ${this.ending.slides.length} — QUADRO PROVISÓRIO`);
    // Último quadro não fecha sozinho: deixa o jogador ler o final.
    // A área clicável muda de função no último painel.
    if(this.next?.label?.setText)this.next.label.setText(
      this.frame===this.ending.slides.length-1?'↻  JOGAR NOVAMENTE':'PRÓXIMO QUADRO ▶');
  }

  advance() {
    if(this.frame<this.ending.slides.length-1) {
      this.frame++;
      this.paintFrame();
    } else {
      this.scene.start('GameScene',{mode:'wave0',campaign:{choices:[]}});
    }
  }
}
