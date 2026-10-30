import Phaser from 'phaser';
import {TYPE6_HULL_SHEET} from '../gameplay/type6HullSprite.js';
import {DAWN_KEYS,DAWN_FILES,dawnLayerAlphas} from '../gameplay/dawnTransition.js';
import {cannonSpritePose,CANNON_BARREL_DISPLAY_SIZE} from '../gameplay/cannonSpriteAim.js';
import {bindSceneMusic} from '../audio/music.js';
import {assetUrl} from '../config/assetUrl.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H,
  preloadRioBackdrop,drawRioBackdrop} from '../config/scenery.js';
import {PROLOGUE_SURVIVAL_MS,PROLOGUE_SWARM_COUNT,
  PROLOGUE_CANNON,prologueSwarmSlot,PROLOGUE_WITHDRAWAL_MS,prologueWithdrawalPose} from '../gameplay/prologueStory.js';

// Continuação da onda 0 após o impacto do Tipo 6, sem nova onda ou upgrade.
// Mantém o mesmo sprite de Canhão do campo de combate. Invasores não
// disparam, não colidem com o canhão, e a retirada ocorre invariavelmente.
export class PrologueSurvivalScene extends Phaser.Scene{
  constructor(){super({key:'PrologueSurvivalScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.elapsed=0;this.finished=false;this.withdrawal=false;
    this.shots=[];this.invaders=[];this.lastShot=-Infinity;
    this.lastSpawn=0;this.created=0;this.destroyed=0;
    this.mobileFire=false;
  }
  preload(){
    preloadRioBackdrop(this);
    for(let i=0;i<DAWN_KEYS.length;i++){
      if(!this.textures.exists(DAWN_KEYS[i]))
        this.load.image(DAWN_KEYS[i],assetUrl('assets/cenario/amanhecer/'+DAWN_FILES[i]));
    }
    this.load.image('prologue-cannon-base',assetUrl('assets/canhao/base.png'));
    this.load.image('prologue-cannon-head',assetUrl('assets/canhao/head_4.png'));
    this.load.image('prologue-cannon-barrel',assetUrl('assets/canhao/barrel_4.png'));
    this.load.image('prologue-invader-type1',assetUrl('assets/inimigos/tipo1/frame_01.png'));
  }
  create(){
    bindSceneMusic(this,'early');drawRioBackdrop(this);
    // Usar a mesma sequência de quatro cenários do amanhecer das ondas.
    // Camadas acima do fundo noturno e atrás de toda a ação.
    this.dawnLayers=DAWN_KEYS.map(key=>this.textures.exists(key)
      ?this.add.image(W/2,H/2,key).setDisplaySize(W,H).setDepth(0.5).setAlpha(0)
      :null);
    this.add.text(W/2,H-18,'CANHÃO DESTRUÍDO • ESCUDO INOPERANTE',{
      fontFamily:'monospace',fontSize:'14px',color:'#ffd7b1',
      backgroundColor:'#111a31dd',padding:{x:12,y:4},
    }).setOrigin(.5).setDepth(101);
    const x=W/2,y=494;
    this.cannonBase=this.add.image(x,y+7,'prologue-cannon-base')
      .setDisplaySize(104,48).setDepth(20);
    this.cannonBarrel=this.add.image(x,y-31,'prologue-cannon-barrel')
      .setDisplaySize(CANNON_BARREL_DISPLAY_SIZE.width,CANNON_BARREL_DISPLAY_SIZE.height).setDepth(21);
    this.cannonHead=this.add.image(x,y-19,this.textures.exists('cannon-pivot-4')?'cannon-pivot-4':'prologue-cannon-head')
      .setDisplaySize(70,68).setDepth(22);
    // O Tipo 6 permanece no campo após destruir o canhão: só flutua.
    const bossKey=TYPE6_HULL_SHEET.key;
    this.type6Hover=this.textures.exists(bossKey)
      ?this.add.image(W/2,145,bossKey,0).setDisplaySize(340,115).setDepth(29)
      :this.add.ellipse(W/2,145,340,108,0x192331).setStrokeStyle(4,0xdd4f63).setDepth(29);
    this.tweens.add({targets:this.type6Hover,y:154,duration:1500,
      ease:'Sine.InOut',yoyo:true,repeat:-1});
    this.damageGraphics=this.add.graphics().setDepth(25);
    this.dawnOverlay=this.add.rectangle(W/2,H/2,W,H,0xffd89a,0).setDepth(15);
    this.dawnSun=this.add.circle(770,110,42,0xffe9ad,0).setDepth(15);
    this.smokeGraphics=this.add.graphics().setDepth(26);
    this.damageGraphics.fillStyle(0xffa94c,.85).fillCircle(x+26,y-10,6);
    this.damageGraphics.fillStyle(0x253545,.7).fillCircle(x+35,y-32,14);
    this.damageGraphics.lineStyle(2,0xeb743e,.65);
    this.damageGraphics.lineBetween(x-30,y-24,x-18,y-5);
    this.portalGraphics=this.add.graphics().setDepth(16);
    for(let i=0;i<PROLOGUE_SWARM_COUNT;i++){
      const slot=prologueSwarmSlot(i);
      const sprite=this.add.image(slot.entryX,slot.y,'prologue-invader-type1')
        .setDepth(19);
      sprite.setScale(72/sprite.height); // Escala uniforme: nunca esticar largura/altura separadamente.
      this.invaders.push({sprite,x:slot.entryX,y:slot.y,slot,seed:i,alive:true});
    }
    // Toque contínuo ou mouse: o canhão danificado continua respondendo.
    this.input.on('pointerdown',()=>{this.mobileFire=true;});
    this.input.on('pointerup',()=>{this.mobileFire=false;});
    this.input.on('gameout',()=>{this.mobileFire=false;});
    this.events.once('shutdown',()=>{
      this.mobileFire=false;this.invaders=[];this.shots=[];
    });
  }
  update(_time,delta){
    if(this.finished)return;
    const dt=Math.min(50,delta);
    this.elapsed+=dt;
    if(!this.withdrawal&&this.elapsed>=PROLOGUE_SURVIVAL_MS){
      this.startWithdrawal();return;
    }
    const pointer=this.input.activePointer;
    const dx=pointer.worldX-W/2,dy=pointer.worldY-(483);
    const angle=Phaser.Math.Clamp(Math.atan2(dy,dx),
      -Math.PI+Math.PI/12,-Math.PI/12);
    const pose=cannonSpritePose(-Math.PI/2,W/2,483);
    this.cannonBarrel.setPosition(W/2,483).setOrigin(pose.originX,pose.originY)
      .setRotation(angle+Math.PI/2);
    // Disparo básico muito fraco: não se consegue eliminar o enxame.
    if((pointer.isDown||this.mobileFire)&&
       this.elapsed>=1000&&this.elapsed-this.lastShot>=PROLOGUE_CANNON.damaged.intervalMs){
      this.lastShot=this.elapsed;
      const shot=this.add.circle(W/2,420,3,0xcbdbe9).setDepth(40);
      // Motor avariado: munição perde propulsão e apaga antes de alcançar
      // os inimigos, independentemente de mira ou posição deles.
      this.shots.push({sprite:shot,x:W/2,y:420,
        vx:Math.cos(angle)*250,vy:Math.sin(angle)*250,
        travelled:0,maxTravel:95+Math.random()*45});
    }
    const smoke=this.smokeGraphics;smoke.clear();
    for(let i=0;i<9;i++){
      const phase=((this.elapsed+i*220)%2000)/2000;
      smoke.fillStyle(i%2?0x667078:0x303840,(1-phase)*.65);
      smoke.fillCircle(W/2+15+Math.sin(i+phase*3)*12+phase*22,
        466-phase*95,5+phase*17);
    }
    for(const invader of this.invaders){
      if(!invader.alive)continue;
      if(this.withdrawal){
        const pose=prologueWithdrawalPose(invader.seed,invader.withdrawX,
          invader.withdrawY,this.withdrawElapsed);
        invader.x=pose.x;invader.y=pose.y;
        // A nave é ocultada pixel a pixel acima da linha horizontal
        // do portal: a metade superior atravessa primeiro.
        const portalProgress=Phaser.Math.Clamp((this.withdrawElapsed-3100)/1900,0,1);
        const frame=invader.sprite.frame;
        if(frame && portalProgress>0){
          const cut=Math.round(frame.height*portalProgress);
          invader.sprite.setCrop(0,cut,frame.width,
            Math.max(.01,frame.height-cut));
        }
        invader.sprite.setAlpha(1);
      }else{
        const arrival=Phaser.Math.Clamp((this.elapsed-invader.slot.delayMs)/2400,0,1);
        const ease=1-Math.pow(1-arrival,3);
        const approach=Phaser.Math.Clamp((this.elapsed-2000-invader.slot.delayMs*.08)/10500,0,1);
        const advance=approach*approach*(3-2*approach);
        const formationX=invader.slot.entryX+(invader.slot.x-invader.slot.entryX)*ease;
        // A esquadrilha fecha o cerco ao canhão, sem tocar nele.
        // Avanço ameaçador em leque espaçado, evitando sobreposição que
        // fazia os sprites parecerem deformados quando se aglomeravam.
        const ring=invader.seed<12?0:invader.seed<32?1:2;
        const count=[12,20,28][ring];
        const within=invader.seed-[0,12,32][ring];
        const radius=[165,260,370][ring];
        // Três arcos alinhados sobre o canhão (centro da circunferência).
        // Extremidades próximas da base e topo sobre a posição do jogador.
        const theta=.16+(Math.PI-.32)*(within+.5*(ring%2))/Math.max(1,count-1);
        const targetX=W/2-radius*Math.cos(theta);
        const targetY=483-radius*Math.sin(theta);
        invader.x=Phaser.Math.Linear(formationX,targetX,advance);
        invader.y=Phaser.Math.Linear(invader.slot.y,targetY,advance)+Math.sin(this.elapsed*.0017+invader.seed)*2*(1-advance);
      }
      invader.sprite.setPosition(invader.x,invader.y);
    }
    for(let i=this.shots.length-1;i>=0;i--){
      const shot=this.shots[i];
      const travel=Math.hypot(shot.vx,shot.vy)*dt/1000;
      shot.travelled+=travel;
      shot.x+=shot.vx*dt/1000;shot.y+=shot.vy*dt/1000;
      shot.sprite.setPosition(shot.x,shot.y)
        .setAlpha(Math.max(0,1-shot.travelled/shot.maxTravel))
        .setScale(Math.max(.2,1-shot.travelled/shot.maxTravel));
      // Sem colisão ou dano: o projétil falha antes do destino da mira.
      if(shot.travelled>=shot.maxTravel||shot.x<0||shot.x>W||
        shot.y<0||shot.y>H){
        shot.sprite.destroy();this.shots.splice(i,1);
      }
    }
    if(this.withdrawal){
      this.withdrawElapsed+=dt;
      const dawn=Math.min(1,this.withdrawElapsed/PROLOGUE_WITHDRAWAL_MS);
      if(this.dawnLayers.every(Boolean)){
        const alphas=dawnLayerAlphas(PROLOGUE_WITHDRAWAL_MS-this.withdrawElapsed,
          PROLOGUE_WITHDRAWAL_MS);
        this.dawnLayers.forEach((layer,i)=>layer.setAlpha(alphas[i]));
      }
      // Colorização leve, sem esconder os cenários reais da transição.
      this.dawnOverlay.setAlpha(.04+.10*dawn);
      this.dawnSun.setAlpha(.15+.7*dawn).setRadius(42+20*dawn);
      const g=this.portalGraphics;g.clear();
      for(const x of [210,750]){
        g.lineStyle(5,0xbd4269,.65);g.strokeEllipse(x,85,104,57);
        g.fillStyle(0x741b50,.24);g.fillEllipse(x,85,95,49);
      }
      if(this.withdrawElapsed>=PROLOGUE_WITHDRAWAL_MS)this.finish();
    }
  }

  startWithdrawal(){
    if(this.withdrawal)return;
    this.withdrawal=true;this.withdrawElapsed=0;
    for(const invader of this.invaders){invader.withdrawX=invader.x;invader.withdrawY=invader.y;}
    // Clarão de amanhecer: interrompe a aproximação antes da colisão.
    this.dawnFlash=this.add.rectangle(W/2,H/2,W,H,0xffd5a3,0).setDepth(90);
    this.tweens.add({targets:this.dawnFlash,alpha:.38,duration:650,yoyo:true});
    this.add.text(W/2,156,'AMANHECE • OS INVASORES RECUAM',{
      fontFamily:'monospace',fontSize:'21px',fontStyle:'bold',color:'#ffedc4',
      stroke:'#081420',strokeThickness:5,
    }).setOrigin(.5).setDepth(105);
    // O canhão ainda pode atirar inutilmente durante a retirada.
    // Tiros existentes seguem apagando após a curta trajetória.
  }
  finish(){
    if(this.finished)return;this.finished=true;
    this.scene.start('PrologueRepairScene',{
      stage:'arrival',campaign:this.campaign,
    });
  }
}
