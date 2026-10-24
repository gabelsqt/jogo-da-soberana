import {playSfx} from '../audio/sfx.js';
import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H} from '../config/scenery.js';
import {nextV1Options,chooseV1Upgrade,V1_UPGRADES} from '../gameplay/v1Upgrades.js';
import {LAB_BALANCE_FIELDS} from '../gameplay/labBalanceProfile.js';
import {normalizeCampaignState,armamentPhase,armamentOffers,chooseArmamentUpgrade} from '../gameplay/progression.js';
import {FIRST_UPGRADES} from '../gameplay/upgrades.js';
import {
  REPRESENTATIVES,representativeLine,representativeStoryFor,
} from '../gameplay/representatives.js';
import {addCuboBroadcastFrame,CUBO_FONT} from '../ui/cuboNewsTheme.js';
import {assetUrl} from '../config/assetUrl.js';
import {INTRO_CHAR_DELAY_MS} from '../gameplay/introScript.js';
import {createDialogueTypewriter} from '../ui/dialogueTypewriter.js';
import {botecoPrimaryPress} from '../ui/pointerPrimary.js';

export const BOTECO_CHAIR_X=Object.freeze([116,298,480,662,844]);
export const BOTECO_PORTRAIT_Y=263;
export const BOTECO_FOCUS=Object.freeze({x:155,y:163,scale:1.47,duration:320});
const COLOR={ink:0x0b1621,panel:0x193043,outline:0x5b788f,
  cream:0xdce8ee,amber:0xe2a45e,red:0xc45151};
const makeText=(scene,x,y,str,size=16,color='#dce8ee',width=null,opts={})=>
  scene.add.text(x,y,str,{
    fontFamily:CUBO_FONT,fontSize:size+'px',color,wordWrap:width?{width,useAdvancedWrap:true}:undefined,
    lineSpacing:3,...opts,
  });

// Phaser registra cliques e toques de forma ligeiramente diferente em
// navegadores móveis. Ambos devem permitir avançar falas e aceitar propostas.
// Pré-reduz os PNGs densos antes de entregá-los ao Phaser.
// Evita amostragem direta de 384 detalhes em apenas ~106 pixels.
function preparePortraitTextures(scene){
  if(typeof document==='undefined')return;
  for(const id of ['br','us','jp','ru','cn']){
    for(const kind of ['full','cutout']){
      const original='leader-'+id+'-'+kind;
      const optimized=original+'-screen';
      if(!scene.textures.exists(original)||scene.textures.exists(optimized))continue;
      const source=scene.textures.get(original).getSourceImage();
      if(!source?.width||!source?.height)continue;
      // Retratos oficiais 128×128: preservar os pixels já preparados, sem
      // reamostrar via canvas ou suavizar as bordas na tela de negociação.
      if(source.width===128&&source.height===128){
        scene.textures.get(original).setFilter(Phaser.Textures.FilterMode.NEAREST);
        continue;
      }
      const stage=document.createElement('canvas');
      stage.width=192;stage.height=192;
      const a=stage.getContext('2d',{willReadFrequently:false});
      a.imageSmoothingEnabled=true;a.imageSmoothingQuality='high';
      a.drawImage(source,0,0,192,192);
      const result=document.createElement('canvas');
      result.width=128;result.height=128;
      const b=result.getContext('2d',{willReadFrequently:false});
      b.imageSmoothingEnabled=true;b.imageSmoothingQuality='high';
      b.drawImage(stage,0,0,128,128);
      scene.textures.addCanvas(optimized,result);
      // A redução é suave, mas a ampliação final não precisa inventar pixels.
      scene.textures.get(optimized).setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
  }
}

// O PNG original do Zeca tem margens transparentes/lisas amplas.
// Criar uma textura recortada EXCLUSIVA para diálogos: o card na cadeira
// mantém seu enquadramento anterior, enquanto a fala mostra o personagem.
function prepareZecaDialoguePortrait(scene){
  if(typeof document==='undefined'||!scene.textures.exists('leader-br-full')||
    scene.textures.exists('leader-br-dialogue'))return;
  const source=scene.textures.get('leader-br-full').getSourceImage();
  if(!source?.width||!source?.height)return;
  const canvas=document.createElement('canvas');
  canvas.width=source.width;canvas.height=source.height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(source,0,0);
  const {data}=ctx.getImageData(0,0,canvas.width,canvas.height);
  const w=canvas.width,h=canvas.height;
  const sample=(x,y)=>{const i=(y*w+x)*4;return [data[i],data[i+1],data[i+2],data[i+3]];};
  const bg=sample(0,0);
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
    const [r,g,b,a]=sample(x,y);
    const distinct=a>35&&(a<246||Math.abs(r-bg[0])+Math.abs(g-bg[1])+Math.abs(b-bg[2])>95);
    if(!distinct)continue;
    minX=Math.min(minX,x);minY=Math.min(minY,y);
    maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
  }
  if(maxX<minX){minX=0;minY=0;maxX=w-1;maxY=h-1;}
  const pad=Math.max(2,Math.floor(Math.max(maxX-minX,maxY-minY)*0.09));
  const sx=Math.max(0,minX-pad),sy=Math.max(0,minY-pad);
  const sw=Math.min(w-sx,maxX+pad-sx+1),sh=Math.min(h-sy,maxY+pad-sy+1);
  const result=document.createElement('canvas');result.width=192;result.height=192;
  const target=result.getContext('2d');target.imageSmoothingEnabled=false;
  const scale=Math.min(184/sw,184/sh);
  const tw=sw*scale,th=sh*scale;
  target.drawImage(source,sx,sy,sw,sh,(192-tw)/2,(192-th)/2,tw,th);
  scene.textures.addCanvas('leader-br-dialogue',result);
  scene.textures.get('leader-br-dialogue').setFilter(Phaser.Textures.FilterMode.NEAREST);
}

function portrait(scene,option,index){
  const color=option.locked?0x68737d:(option.id==='ru'?0xe3b94e:(option.color??0x668eac));
  const id=option.id;
  const katiaAtlas=id==='ru'&&scene.textures.exists('katia-expressions')&&
    scene.textures.get('katia-expressions').has('neutro');
  const zeAtlas=id==='br'&&scene.textures.exists('ze-maria-expressions')&&
    scene.textures.get('ze-maria-expressions').has('neutro');
  const victorAtlas=id==='us'&&scene.textures.exists('victor-expressions')&&
    scene.textures.get('victor-expressions').has('neutro');
  const mingdaAtlas=id==='cn'&&scene.textures.exists('mingda-expressions')&&scene.textures.get('mingda-expressions').has('neutro');
  const frame=scene.add.graphics();
  frame.fillStyle(0x101d2b,0.98).fillRoundedRect(-56,-67,112,143,6);
  frame.lineStyle(3,color,1).strokeRoundedRect(-56,-67,112,143,6);
  const portraitKey=mingdaAtlas?'mingda-expressions':victorAtlas?'victor-expressions':zeAtlas?'ze-maria-expressions':katiaAtlas?'katia-expressions':scene.textures.exists('leader-'+id+'-full-screen')?
    'leader-'+id+'-full-screen':'leader-'+id+'-full';
  const loaded=scene.textures.exists(portraitKey);
  const image=loaded?scene.add.image(0,-10,portraitKey,(katiaAtlas||zeAtlas||victorAtlas||mingdaAtlas)?'neutro':undefined).setDisplaySize(106,106):null;
  if(!image){
    frame.fillStyle(color,0.72).fillCircle(0,-27,23);
    frame.fillStyle(color,0.72).fillRoundedRect(-39,-3,78,36,14);
  }
  const footer=scene.add.rectangle(0,50,104,46,0x101d2b,0.96);
  const label=makeText(scene,0,41,option.shortName??option.name,12,
    '#dce8ee',100,{fontStyle:'bold',align:'center'}).setOrigin(0.5);
  const lvl=makeText(scene,0,60,'Nível '+option.level,10,
    '#e2a45e',null,{fontStyle:'bold'}).setOrigin(0.5);
  const children=image?[frame,image,footer,label,lvl]:[frame,footer,label,lvl];
  const node=scene.add.container(BOTECO_CHAIR_X[index],BOTECO_PORTRAIT_Y,children).setDepth(26);
  node.setSize(114,147).setInteractive({useHandCursor:true});
  return {node,option,index,originX:BOTECO_CHAIR_X[index],originY:BOTECO_PORTRAIT_Y};
}

function outlinePlaceholder(scene,x,y,w,h){
  const g=scene.add.graphics().setDepth(45);
  g.fillStyle(0x101c29,0.96).fillRoundedRect(x,y,w,h,6);
  g.lineStyle(2,0x587389,0.95).strokeRoundedRect(x,y,w,h,6);
  // Pontilhado discreto indica uma área futura, não um botão quebrado.
  g.lineStyle(1,0x839bb0,0.65);
  for(let xx=x+14;xx<x+w-10;xx+=17){
    g.lineBetween(xx,y+10,Math.min(xx+8,x+w-10),y+10);
    g.lineBetween(xx,y+h-10,Math.min(xx+8,x+w-10),y+h-10);
  }
  return g;
}

export class UpgradeScene extends Phaser.Scene {
  constructor(){super({key:'UpgradeScene'});}
  init(data={}){
    this.campaign=normalizeCampaignState(data.campaign);
    this.completedWave=Number.isInteger(data.completedWave)?data.completedWave:
      this.campaign.choices.length;
    this.chosen=false;this.focused=null;
    this.phase=armamentPhase(this.campaign);
    this.selectedTrack=null;
    this.dialogueTyper=null;
  }
  preload(){
    this.load.image('boteco-dia',assetUrl('assets/cenario/boteco_dia.webp'));
    // Os retratos são arquivos opcionais: a silhueta provisória continua funcionando
    // quando o pacote de PNGs ainda não foi instalado localmente.
    // Atlas opcional da Kátia: volta ao retrato anterior caso o PNG ainda não esteja publicado.
    this.load.atlas('mingda-expressions',
      assetUrl('assets/lideres/mingda_mai_expressoes_4x4.png'),
      assetUrl('assets/lideres/mingda_mai_expressoes_4x4.json'));
    this.load.atlas('nelson-expressions',
      assetUrl('assets/lideres/seu_nelson_expressoes_4x4.png'),
      assetUrl('assets/lideres/seu_nelson_expressoes_4x4.json'));
    this.load.atlas('victor-expressions',
      assetUrl('assets/lideres/victor_mcdollar_expressoes_4x4.png'),
      assetUrl('assets/lideres/victor_mcdollar_expressoes_4x4.json'));
    this.load.atlas('ze-maria-expressions',
      assetUrl('assets/lideres/ze_maria_expressoes_4x4.png'),
      assetUrl('assets/lideres/ze_maria_expressoes_4x4.json'));
    this.load.atlas('katia-expressions',
      assetUrl('assets/lideres/katia_expressoes_4x4.png'),
      assetUrl('assets/lideres/katia_expressoes_4x4.json'));
    for(const id of ['br','us','jp','ru','cn']){
      this.load.image('leader-'+id+'-full',assetUrl('assets/lideres/'+id+'_retrato.png'));
      this.load.image('leader-'+id+'-cutout',assetUrl('assets/lideres/'+id+'_personagem.png'));
    }
  }
  create(){
    preparePortraitTextures(this);
    prepareZecaDialoguePortrait(this);
    bindSceneMusic(this,'upgrades');
    const pause=()=>{if(this.scene.isActive('PauseScene'))return;
      this.scene.pause();this.scene.launch('PauseScene',{source:'UpgradeScene'});};
    this.add.circle(919,42,29,0x15384a,.4).setStrokeStyle(2,0xdaf1ff,.75)
      .setDepth(990).setInteractive().on('pointerdown',(_p,_x,_y,e)=>{e?.stopPropagation();pause();});
    this.add.text(919,42,'Ⅱ',{fontFamily:'sans-serif',fontSize:'24px',color:'#ffffff'})
      .setOrigin(.5).setDepth(991);
    this.input.keyboard?.on('keydown-ESC',pause);
    this.input.keyboard?.on('keydown-P',pause);
    // Um controlador para todas as falas: Zeca, convidados e negociações.
    this.dialogueTyper=createDialogueTypewriter(this,{delay:INTRO_CHAR_DELAY_MS});
    this.events.once('shutdown',()=>this.dialogueTyper?.cancel());
    this.add.image(W/2,H/2,'boteco-dia').setDisplaySize(W,H).setDepth(1);
    // A arte diurna é central: cabeçalho discreto, sem cobrir a janela do Rio.
    addCuboBroadcastFrame(this,{
      section:'Mesa de negociações',
      headline:'Onda '+this.completedWave+' concluída • '+
        (this.phase==='principal'?'Defina o seu TIRO PRINCIPAL':
          this.phase==='special'?'Defina o seu TIRO ESPECIAL':
          'Escolha país e destino do próximo upgrade'),
      footer:'Cinco representantes • Toda decisão será confirmada antes da próxima onda',
      depth:14,
    });
    this.add.rectangle(W/2,81,770,30,COLOR.ink,0.84).setDepth(16)
      .setStrokeStyle(1,COLOR.amber);
    makeText(this,W/2,81,this.phase==='principal'
      ?'1ª ESCOLHA: selecione a identidade permanente do tiro principal'
      :this.phase==='special'
        ?'2ª ESCOLHA: selecione o especial do botão direito, liberado agora'
        :'3ª–10ª ESCOLHA: escolha o país e a arma que receberá P ou S',
      15,'#dce8ee',null,{fontStyle:'bold'}).setOrigin(0.5).setDepth(17);

    this.options=armamentOffers(this.campaign,FIRST_UPGRADES);
    const assigned=this.campaign.armament;
    const nameOf=id=>FIRST_UPGRADES.find(item=>item.id===id)?.shortName??id?.toUpperCase();
    const status=this.phase==='principal'?'1/10 • A ARMA PRINCIPAL SERÁ DEFINIDA AGORA'
      :this.phase==='special'
        ?'2/10 • PRINCIPAL: '+nameOf(assigned?.principal)+' • ESCOLHA O ESPECIAL'
        :'PRINCIPAL: '+nameOf(assigned?.principal)+' • ESPECIAL: '+
          nameOf(assigned?.especial)+' • '+(this.campaign.choices.length+1)+'/10';
    makeText(this,W/2,111,status,12,'#ffe7b6',900,
      {fontStyle:'bold',align:'center'}).setOrigin(.5).setDepth(17);
    this.portraits=this.options.map((option,index)=>portrait(this,option,index));
    // Comentários curtos após a noite; na onda zero há a derrota roteirizada.
    this.introDialogueActive=true;
    // Esta sobreposição escurece TODO o boteco, inclusive os retratos
    // não selecionados. O escolhido sobe acima dela por animação.
    this.focusDim=this.add.rectangle(W/2,H/2,W,H,0x030b15,0.83)
      .setDepth(33).setVisible(false);
    // Toque fora dos botões completa a frase, mas nunca aceita o upgrade.
    this.focusDim.on('pointerdown',pointer=>{
      if(botecoPrimaryPress(pointer))this.dialogueTyper?.complete();
    });
    this.focusPanel=this.add.rectangle(632,164,612,202,COLOR.panel,0.97)
      .setStrokeStyle(2,COLOR.amber).setDepth(43).setVisible(false);
    // O painel precisa existir ANTES de registrar seu handler.
    // Deixá-lo interativo, mas invisível, também bloqueava os retratos.
    this.focusPanel.on('pointerdown',pointer=>{
      if(botecoPrimaryPress(pointer))this.dialogueTyper?.complete();
    });
    this.countryTag=makeText(this,348,74,'',13,'#e2a45e',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.characterName=makeText(this,348,96,'',20,'#ffffff',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.flavorText=makeText(this,348,130,'',15,'#dce8ee',555)
      .setDepth(46).setVisible(false);
    this.upgradeTitle=makeText(this,348,202,'',15,'#e2a45e',555,
      {fontStyle:'bold'}).setDepth(46).setVisible(false);
    this.upgradeDescription=makeText(this,348,224,'',13,'#dce8ee',555)
      .setDepth(46).setVisible(false);
    this.previewBox=outlinePlaceholder(this,290,280,664,113).setVisible(false);
    this.previewLabel=makeText(this,623,301,'Escolha entre as duas melhorias',
      14,'#dce8ee',null,{fontStyle:'bold'}).setOrigin(0.5).setDepth(46).setVisible(false);
    this.previewHint=makeText(this,623,380,'',
      11,'#a9d4cb').setOrigin(0.5).setDepth(46).setVisible(false);
    this.primaryChoiceButton=this.createButton(453,344,310,'MELHORAR PRINCIPAL [P]',false,
      ()=>this.selectTrack('P')).setVisible(false).disableInteractive();
    this.specialChoiceButton=this.createButton(794,344,310,'MELHORAR ESPECIAL [S]',false,
      ()=>this.selectTrack('S')).setVisible(false).disableInteractive();
    this.primaryChoiceHint=makeText(this,453,399,'',11,'#b4d9f2',320,
      {align:'center'}).setOrigin(.5,0).setDepth(46).setVisible(false);
    this.specialChoiceHint=makeText(this,794,399,'',11,'#ffdeb1',320,
      {align:'center'}).setOrigin(.5,0).setDepth(46).setVisible(false);
    this.acceptButton=this.createButton(734,448,320,'Aceitar upgrade [ENTER]',true,
      ()=>this.focused&&this.selectUpgrade(this.focused)).setVisible(false);
    this.backButton=this.createButton(393,448,215,'Voltar [ESC]',false,
      ()=>this.unfocus()).setVisible(false);
    this.acceptButton.disableInteractive();
    this.backButton.disableInteractive();
    this.overlayItems=[
      this.focusPanel,this.countryTag,this.characterName,this.flavorText,
      this.upgradeTitle,this.upgradeDescription,this.previewBox,
      this.previewLabel,this.previewHint,this.primaryChoiceButton,
      this.specialChoiceButton,this.primaryChoiceHint,this.specialChoiceHint,
      this.acceptButton,this.backButton,
    ];
    for(const tile of this.portraits){
      if(tile.option.locked){tile.node.setAlpha(0.5).disableInteractive();continue;}
      tile.node.on('pointerover',()=>{if(!this.focused)tile.node.setScale(1.07);});
      tile.node.on('pointerout',()=>{if(!this.focused)tile.node.setScale(1);});
      tile.node.on('pointerdown',(pointer,_x,_y,event)=>{
        event?.stopPropagation();
        if(botecoPrimaryPress(pointer)&&!this.chosen&&!this.introDialogueActive)this.focusCountry(tile.option.id);
      });
    }
    this.input.keyboard.on('keydown',(event)=>{
      const hit=/^[1-5]$/.exec(event.key);
      if(hit&&!this.introDialogueActive){
        const option=this.options[Number(hit[0])-1];
        if(option&&!option.locked)this.focusCountry(option.id);
      }
    });
    this.input.keyboard.on('keydown-ESC',()=>{if(!this.chosen)this.unfocus();});
    this.input.keyboard.on('keydown-P',()=>{
      if(this.phase==='upgrades'&&this.focused&&!this.introDialogueActive)
        this.selectTrack('P');
    });
    this.input.keyboard.on('keydown-S',()=>{
      if(this.phase==='upgrades'&&this.focused&&!this.introDialogueActive)
        this.selectTrack('S');
    });
    this.input.keyboard.on('keydown-SPACE',event=>{
      if(!this.introDialogueActive&&!this.focused)return;
      event.preventDefault();
      if(this.introDialogueActive)this.advanceBotecoDialogue();
      else if(!this.chosen)this.dialogueTyper?.complete();
    });
    this.input.keyboard.on('keydown-ENTER',()=>{
      if(this.introDialogueActive){this.advanceBotecoDialogue();return;}
      if(this.focused&&!this.chosen)this.selectUpgrade(this.focused);
    });
    this.showBotecoDialogue();
  }
  showBotecoDialogue(){
    const first=this.completedWave===0;
    this.botecoPages=first?[
      ['SEU NELSON','Pode sentar. Esse elevador de carga é velho, mas funciona.'],
      ['ZÉ MARIA','Os representantes estrangeiros já estavam esperando. Mas eu também tenho minhas peças.'],
      ['ZÉ MARIA','Primeiro conserto: escolha o TIRO PRINCIPAL. Depois eu instalo e testo.'],
    ]:this.phase==='special'?[
      ['SEU NELSON','Mais uma noite. A mesa é a mesma, o mundo lá fora nem tanto.'],
      ['ZÉ MARIA','O principal está funcionando. Falta escolher o TIRO ESPECIAL.'],
      ['ZÉ MARIA','Pode ser o mesmo país. O botão direito funciona a partir da onda 2.'],
    ]:this.completedWave>=8?[
      ['SEU NELSON','Uma vez, nos anos oitenta, já vi o céu ficar assim.'],
      ['ZÉ MARIA','Anselmo, você nunca me falou disso.'],
      ['SEU NELSON','Pois é. Melhor pedir mais uma rodada.'],
      ['ZÉ MARIA','Escolha o país e o destino: PRINCIPAL [P] ou ESPECIAL [S].'],
    ]:[
      ['SEU NELSON','O boteco fica embaixo do canhão. De cima para cá, só pelo elevador de carga.'],
      ['ZÉ MARIA','Agora a gente melhora o PRINCIPAL [P] ou o ESPECIAL [S].'],
      ['ZÉ MARIA','Cada país tem quatro etapas para cada arma. Você escolhe a ordem.'],
    ];
    this.botecoPage=0;
    this.botecoOverlay=this.add.container(0,0).setDepth(190);
    const shade=this.add.rectangle(W/2,H/2,W,H,0x07101c,0.90).setInteractive();
    const frame=this.add.rectangle(W/2,260,810,255,0x16283a,0.99).setStrokeStyle(3,COLOR.amber);
    // Moldura generosa para o retrato recortado do Zeca.
    const portraitFrame=this.add.rectangle(197,251,176,196,0x101d2b,1)
      .setStrokeStyle(2,COLOR.amber);
    this.botecoPortrait=this.add.image(197,249,'boteco-dia')
      .setDisplaySize(168,184).setVisible(false);
    this.botecoPortraitFrame=portraitFrame.setVisible(false);
    this.botecoSpeaker=makeText(this,W/2,174,'',22,'#ffe0a6').setOrigin(0.5);
    this.botecoLine=makeText(this,620,256,'',18,'#f4f5ff',530,{align:'center'}).setOrigin(0.5);
    this.botecoHint=makeText(this,W/2,354,'CLIQUE OU TOQUE PARA CONTINUAR  ▶',14,'#9bded9').setOrigin(0.5);
    this.botecoOverlay.add([shade,frame,portraitFrame,this.botecoPortrait,
      this.botecoSpeaker,this.botecoLine,this.botecoHint]);
    shade.on('pointerdown',()=>this.advanceBotecoDialogue());
    frame.setInteractive().on('pointerdown',()=>this.advanceBotecoDialogue());
    this.renderBotecoDialogue();
  }
  renderBotecoDialogue(){
    const [speaker,line]=this.botecoPages[this.botecoPage];
    this.botecoSpeaker.setText(speaker);
    this.botecoLine.setText('');
    const leaders={...Object.fromEntries(Object.entries(REPRESENTATIVES).map(
      ([id,representative])=>[representative.name.toUpperCase(),id]))};
    const id=leaders[speaker.toUpperCase()];
    const nelsonAtlas=speaker.toUpperCase()==='SEU NELSON'&&
      this.textures.exists('nelson-expressions')&&
      this.textures.get('nelson-expressions').has('neutro');
    const katiaAtlas=id==='ru'&&this.textures.exists('katia-expressions')&&
      this.textures.get('katia-expressions').has('neutro');
    const zeAtlas=id==='br'&&this.textures.exists('ze-maria-expressions')&&
      this.textures.get('ze-maria-expressions').has('neutro');
    const victorAtlas=id==='us'&&this.textures.exists('victor-expressions')&&
      this.textures.get('victor-expressions').has('neutro');
    const mingdaAtlas=id==='cn'&&this.textures.exists('mingda-expressions')&&this.textures.get('mingda-expressions').has('neutro');
    const key=mingdaAtlas?'mingda-expressions':nelsonAtlas?'nelson-expressions':victorAtlas?'victor-expressions':zeAtlas?'ze-maria-expressions':katiaAtlas?'katia-expressions':id?(this.textures.exists('leader-'+id+'-full-screen')?
      'leader-'+id+'-full-screen':'leader-'+id+'-full'):null;
    const show=Boolean(key&&this.textures.exists(key));
    this.botecoPortraitFrame.setStrokeStyle(2,id==='ru'?0xe3b94e:id==='br'?0x40d76b:id==='us'?0x329bff:id==='cn'?0xed424e:COLOR.amber);
    this.botecoPortraitFrame.setVisible(show);
    this.botecoPortrait.setVisible(show);
    if(show)this.botecoPortrait
      .setTexture(mingdaAtlas?'mingda-expressions':nelsonAtlas?'nelson-expressions':victorAtlas?'victor-expressions':zeAtlas?'ze-maria-expressions':katiaAtlas?'katia-expressions':id==='br'&&this.textures.exists('leader-br-dialogue')
        ?'leader-br-dialogue':key,(nelsonAtlas||katiaAtlas||zeAtlas||victorAtlas||mingdaAtlas)?'neutro':undefined)
      // setTexture preserva a escala do placeholder (boteco-dia, 960×540):
      // SEM setDisplaySize o retrato 128×128 aparece minúsculo.
      .setDisplaySize(174,174);
    this.botecoLine.setX(show?620:W/2).setWordWrapWidth(show?530:740);
    this.botecoHint.setText('CLIQUE, ESPAÇO OU ENTER PARA COMPLETAR  ▶');
    this.dialogueTyper.start(this.botecoLine,line,{
      onComplete:()=>{
        this.botecoHint?.setText('CLIQUE, ESPAÇO OU ENTER PARA CONTINUAR  ▶');
      },
    });
  }
  advanceBotecoDialogue(){
    if(!this.introDialogueActive)return;
    // Na primeira interação, revelar o restante, sem pular a fala atual.
    if(this.dialogueTyper?.complete())return;
    this.botecoPage++;
    if(this.botecoPage>=this.botecoPages.length){
      this.introDialogueActive=false;
      this.dialogueTyper?.cancel();
      this.botecoOverlay?.destroy(true);this.botecoOverlay=null;
      // Fim da conversa: liberar imediatamente os cinco retratos.
      // Paineis de foco só recebem cliques enquanto o foco está aberto.
      this.focusDim.disableInteractive().setVisible(false);
      this.focusPanel.disableInteractive().setVisible(false);
      return;
    }
    this.renderBotecoDialogue();
  }
  createButton(x,y,width,label,primary,callback){
    const fill=primary?COLOR.amber:COLOR.panel;
    const bg=this.add.rectangle(0,0,width,48,fill)
      .setStrokeStyle(2,primary?0xdce8ee:COLOR.outline);
    const txt=makeText(this,0,0,label,16,primary?'#0b1621':'#dce8ee',
      width-26,{fontStyle:'bold',align:'center'}).setOrigin(0.5);
    const node=this.add.container(x,y,[bg,txt]).setDepth(48).setSize(width,48)
      .setInteractive({useHandCursor:true});
    node.on('pointerover',()=>bg.setFillStyle(primary?0xf1bf7a:0x315470));
    node.on('pointerout',()=>bg.setFillStyle(fill));
    node.on('pointerdown',(pointer,_x,_y,event)=>{
      event?.stopPropagation();if(botecoPrimaryPress(pointer)&&!this.chosen)callback();
    });
    node.label=txt;
    return node;
  }
  focusCountry(id){
    if(this.chosen||this.introDialogueActive)return;
    const current=this.portraits.find(x=>x.option.id===id);
    if(!current||current.option.locked)return;
    this.focused=id;
    this.focusDim.setVisible(true).setInteractive();
    this.overlayItems.forEach(item=>item.setVisible(true));
    this.focusPanel.setInteractive();
    this.acceptButton.setInteractive({useHandCursor:true});
    this.backButton.setInteractive({useHandCursor:true});
    for(const tile of this.portraits){
      const active=tile.option.id===id;
      this.tweens.killTweensOf(tile.node);
      tile.node.setDepth(active?57:27).setAlpha(active?1:0.27);
      this.tweens.add({targets:tile.node,
        x:active?BOTECO_FOCUS.x:tile.originX,
        y:active?BOTECO_FOCUS.y:tile.originY,
        scale:active?BOTECO_FOCUS.scale:1,
        duration:BOTECO_FOCUS.duration,ease:'Cubic.Out'});
    }
    const option=current.option;
    this.selectedTrack=null;
    const representative=REPRESENTATIVES[id];
    this.countryTag.setText(representative.label+
      (this.phase==='principal'?' • IDENTIDADE PRINCIPAL':
        this.phase==='special'?' • IDENTIDADE ESPECIAL':
        ' • PRÓXIMA MELHORIA NACIONAL '+option.level));
    this.characterName.setText(representative.name??'Representante');
    const trackNames={P:'PRINCIPAL',S:'ESPECIAL'};
    if(this.phase==='principal'){
      const ability=V1_UPGRADES[id][0];
      this.upgradeTitle.setText('TIRO PRINCIPAL: '+ability.title);
      this.upgradeDescription.setText(ability.description);
    }else if(this.phase==='special'){
      const ability=V1_UPGRADES[id][1];
      const specialNames={cn:'FILA DE PROJÉTEIS ALINHADOS',
        jp:'BOLA DE DISCOTECA ORBITAL'};
      this.upgradeTitle.setText('TIRO ESPECIAL: '+(specialNames[id]??ability.title));
      this.upgradeDescription.setText(id==='cn'
        ?'Botão direito: projéteis separados convergem em 1,5 s para uma linha reta, seguem alinhados e se separam em 1,5 s.'
        :ability.description);
    }else{
      this.upgradeTitle.setText('ESCOLHA ONDE INSTALAR A MELHORIA');
      this.upgradeDescription.setText('Cada representante oferece uma propriedade para o PRINCIPAL ou para o ESPECIAL. Escolha uma das duas.');
    }
    this.dialogueTyper.start(this.flavorText,
      '“'+representativeStoryFor(id,Math.min(option.level,10))+'”');
    this.primaryChoiceButton.setVisible(this.phase==='upgrades');
    this.specialChoiceButton.setVisible(this.phase==='upgrades');
    this.primaryChoiceHint.setVisible(this.phase==='upgrades');
    this.specialChoiceHint.setVisible(this.phase==='upgrades');
    if(this.phase==='upgrades'){
      for(const track of ['P','S']){
        const proposal=option.proposals[track];
        const button=track==='P'?this.primaryChoiceButton:this.specialChoiceButton;
        const hint=track==='P'?this.primaryChoiceHint:this.specialChoiceHint;
        const fields=LAB_BALANCE_FIELDS.filter(f=>f.country===id&&
          f.track===track&&f.stage===proposal.stage);
        const desc=fields[0]?.description??'Árvore completa';
        button.label.setText(track+proposal.stage+' • '+trackNames[track]+
          (proposal.locked?' [LOTADO]':''));
        button.setAlpha(proposal.locked?.45:1);
        if(proposal.locked)button.disableInteractive();
        else button.setInteractive({useHandCursor:true});
        hint.setText(proposal.locked?proposal.reason:
          desc+'\n'+fields.slice(0,2).map(f=>f.value+' '+f.unit).join(' • '));
      }
      this.previewLabel.setText('SELECIONE P OU S PARA CONFIRMAR O ACORDO');
      this.previewHint.setText('P e S avançam independentemente; cada arma comporta 4 efeitos.');
      this.acceptButton.label.setText('Selecione P ou S acima');
      this.acceptButton.disableInteractive();
    }else{
      this.primaryChoiceButton.disableInteractive();
      this.specialChoiceButton.disableInteractive();
      this.previewLabel.setText(this.phase==='principal'
        ?'Define a aparência e a mecânica permanente do disparo normal.'
        :'Desbloqueia imediatamente o especial do botão direito.');
      this.previewHint.setText('A identidade não poderá ser alterada durante esta campanha.');
      this.acceptButton.label.setText('Confirmar identidade [ENTER]');
      this.acceptButton.setInteractive({useHandCursor:true});
    }
  }
  selectTrack(track){
    if(this.chosen||this.introDialogueActive||this.phase!=='upgrades'||!this.focused)return;
    const proposal=this.options.find(option=>option.id===this.focused)?.proposals?.[track];
    if(!proposal||proposal.locked)return;
    this.selectedTrack=track;
    const id=this.focused;
    const fields=LAB_BALANCE_FIELDS.filter(f=>f.country===id&&
      f.track===track&&f.stage===proposal.stage);
    this.upgradeTitle.setText(track+proposal.stage+' — '+
      (fields[0]?.description??'Melhoria experimental'));
    this.upgradeDescription.setText(fields.map(field=>
      field.label+': '+field.value+' '+field.unit).join('  •  '));
    this.acceptButton.label.setText('ACEITAR '+track+proposal.stage+' [ENTER]');
    this.acceptButton.setInteractive({useHandCursor:true});
    const loyal=this.campaign.choices.length===9&&
      this.campaign.choices.every(id=>id===this.focused);
    this.previewLabel.setText('DESTINO SELECIONADO: '+
      (track==='P'?'TIRO PRINCIPAL':'TIRO ESPECIAL')+
      (loyal?' • NÍVEL 10: SUPREMO + DUAS TRANSFORMAÇÕES':''));
  }
  unfocus(){
    if(this.chosen||!this.focused)return;
    this.dialogueTyper?.cancel();
    this.focused=null;this.selectedTrack=null;this.focusDim.disableInteractive().setVisible(false);
    this.focusPanel.disableInteractive();
    this.acceptButton.disableInteractive();
    this.backButton.disableInteractive();
    this.overlayItems.forEach(item=>item.setVisible(false));
    for(const tile of this.portraits){
      this.tweens.killTweensOf(tile.node);
      tile.node.setDepth(26).setAlpha(tile.option.locked?0.5:1);
      this.tweens.add({targets:tile.node,x:tile.originX,y:tile.originY,
        scale:1,duration:BOTECO_FOCUS.duration,ease:'Cubic.Out'});
    }
  }
  selectUpgrade(id){
    if(this.chosen||this.introDialogueActive||!this.focused)return;
    if(this.phase==='upgrades'&&!this.selectedTrack)return;
    const next=chooseArmamentUpgrade(this.campaign,id,this.selectedTrack);
    if(!next)return;
    this.chosen=true;
    playSfx('upgrade',{throttle:500});
    this.acceptButton.disableInteractive();this.backButton.disableInteractive();
    this.acceptButton.label.setText('Parceria confirmada!');
    // Não mudar de cena antes de o último diálogo estar totalmente legível.
    this.dialogueTyper.start(this.flavorText,'“'+representativeLine(id,'accepted')+'”',{
      delay:22,
      onComplete:()=>{
        this.time.delayedCall(850,()=>{
          if(!this.scene.isActive())return;
          if(this.phase==='principal'||this.phase==='special')
            this.scene.start('PrologueRepairScene',{
              stage:this.phase==='principal'?'principal':'special',
              campaign:next,country:id,
            });
          else this.scene.start('GameScene',{
            mode:`wave${next.choices.length}`,campaign:next,
          });
        });
      },
    });
  }
}
