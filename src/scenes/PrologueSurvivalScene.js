import Phaser from 'phaser';
import {bindSceneMusic} from '../audio/music.js';
import {assetUrl} from '../config/assetUrl.js';
import {GAME_WIDTH as W,GAME_HEIGHT as H,
  preloadRioBackdrop,drawRioBackdrop} from '../config/scenery.js';
import {PROLOGUE_SURVIVAL_MS,PROLOGUE_SWARM_COUNT,
  PROLOGUE_CANNON} from '../gameplay/prologueStory.js';

// Onda 0.5 — cena roteirizada de sobrevivência, não contabiliza upgrade.
// Mantém o mesmo sprite de Obuseiro do campo de combate. Invasores não
// disparam, não colidem com o canhão, e a retirada ocorre invariavelmente.
export class PrologueSurvivalScene extends Phaser.Scene{
  constructor(){super({key:'PrologueSurvivalScene'});}
  init(data={}){
    this.campaign=data.campaign??{choices:[]};
    this.elapsed=0;this.finished=false;this.withdrawal=false;
    this.shots=[];this.invaders=[];this.lastShot=-Infinity;
    this.lastSpawn=0;this.created=0;this.destroyed=0;
  }
  preload(){
    preloadRioBackdrop(this);
    this.load.image('prologue-cannon-base',assetUrl('assets/canhao/base.png'));
    this.load.image('prologue-cannon-head',assetUrl('assets/canhao/head_4.png'));
    this.load.image('prologue-cannon-barrel',assetUrl('assets/canhao/barrel_4.png'));
    this.load.image('prologue-invader-type1',assetUrl('assets/inimigos/tipo1/frame_01.png'));
  }
  create(){
    bindSceneMusic(this,'early');drawRioBackdrop(this);
    const title=this.add.rectangle(W/2,39,W,78,0x071526,.91).setDepth(100);
    this.add.text(W/2,22,'ONDA 0.5 — O CÉU TOMADO',{
      fontFamily:'monospace',fontSize:'20px',fontStyle:'bold',color:'#ffe0af',
    }).setOrigin(.5).setDepth(101);
    this.timerLabel=this.add.text(W/2,53,'00:15',{
      fontFamily:'monospace',fontSize:'22px',fontStyle:'bold',color:'#ffffff',
    }).setOrigin(.5).setDepth(101);
    this.add.text(W/2,H-28,'OBUSEIRO AVARIADO • SOBREVIVA ATÉ O AMANHECER',{
      fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',color:'#ffd7b1',
      backgroundColor:'#111a31dd',padding:{x:12,y:5},
    }).setOrigin(.5).setDepth(101);
    const x=W/2,y=H-77;
    this.cannonBase=this.add.image(x,y+17,'prologue-cannon-base')
      .setDisplaySize(104,48).setDepth(20);
    this.cannonBarrel=this.add.image(x,y-31,'prologue-cannon-barrel')
      .setDisplaySize(35,83).setDepth(21);
    this.cannonHead=this.add.image(x,y-8,'prologue-cannon-head')
      .setDisplaySize(65,66).setDepth(22);
    this.damageGraphics=this.add.graphics().setDepth(25);
    this.damageGraphics.fillStyle(0xffa94c,.85).fillCircle(x+26,y-10,6);
    this.damageGraphics.fillStyle(0x253545,.7).fillCircle(x+35,y-32,14);
    this.damageGraphics.lineStyle(2,0xeb743e,.65);
    this.damageGraphics.lineBetween(x-30,y-24,x-18,y-5);
    this.portalGraphics=this.add.graphics().setDepth(16);
    this.input.keyboard?.on('keydown-ESC',()=>this.finish(),this);
    this.events.once('shutdown',()=>{this.invaders=[];this.shots=[];});
  }
  update(_time,delta){
    if(this.finished)return;
    const dt=Math.min(50,delta);
    this.elapsed+=dt;
    if(!this.withdrawal&&this.elapsed>=PROLOGUE_SURVIVAL_MS){
      this.startWithdrawal();return;
    }
    const pointer=this.input.activePointer;
    const dx=pointer.worldX-W/2,dy=pointer.worldY-(H-103);
    const angle=Phaser.Math.Clamp(Math.atan2(dy,dx),
      -Math.PI+Math.PI/12,-Math.PI/12);
    this.cannonBarrel.setRotation(angle+Math.PI/2);
    // Disparo básico muito fraco: não se consegue eliminar o enxame.
    if(!this.withdrawal&&pointer.leftButtonDown()&&
       this.elapsed-this.lastShot>=PROLOGUE_CANNON.damaged.intervalMs){
      this.lastShot=this.elapsed;
      const shot=this.add.circle(W/2,H-128,3,0xcbdbe9).setDepth(40);
      this.shots.push({sprite:shot,x:W/2,y:H-128,
        vx:Math.cos(angle)*180,vy:Math.sin(angle)*180});
    }
    if(!this.withdrawal){
      const expected=Math.floor(this.elapsed/PROLOGUE_SURVIVAL_MS*PROLOGUE_SWARM_COUNT);
      while(this.created<expected){
        const i=this.created++;
        // Ondas visualmente densas e constantes. Não há colisão hostil.
        const x=45+((i*137)%870),y=-35-((i*29)%90);
        const image=this.add.image(x,y,'prologue-invader-type1')
          .setDisplaySize(26+(i%3)*4,22+(i%3)*3).setDepth(19);
        this.invaders.push({sprite:image,x,y,seed:i,alive:true});
      }
    }
    for(const invader of this.invaders){
      if(!invader.alive)continue;
      if(this.withdrawal){
        const p=this.withdrawElapsed/1000;
        const targetX=invader.x<W/2?210:750;
        invader.x+=(targetX-invader.x)*Math.min(.10,dt/180);
        invader.y-=(170+invader.seed%70)*dt/1000;
        invader.sprite.setAlpha(Math.max(0,1-p*.75));
      }else{
        invader.y+=((8+invader.seed%14)*dt/1000);
        invader.x+=Math.sin(this.elapsed*.0017+invader.seed)*dt*.009;
      }
      invader.sprite.setPosition(invader.x,invader.y);
    }
    for(let i=this.shots.length-1;i>=0;i--){
      const shot=this.shots[i];shot.x+=shot.vx*dt/1000;shot.y+=shot.vy*dt/1000;
      shot.sprite.setPosition(shot.x,shot.y);
      if(!this.withdrawal&&this.destroyed<6)for(const e of this.invaders){
        if(!e.alive||Math.hypot(e.x-shot.x,e.y-shot.y)>15)continue;
        // A arma avariada tem munição insuficiente para abater mais de seis.
        e.alive=false;e.sprite.destroy();this.destroyed++;break;
      }
      if(shot.x<0||shot.x>W||shot.y<0||shot.y>H||this.destroyed>=6){
        shot.sprite.destroy();this.shots.splice(i,1);
      }
    }
    if(this.withdrawal){
      this.withdrawElapsed+=dt;
      const g=this.portalGraphics;g.clear();
      for(const x of [210,750]){
        g.lineStyle(5,0xbd4269,.65);g.strokeEllipse(x,85,104,57);
        g.fillStyle(0x741b50,.24);g.fillEllipse(x,85,95,49);
      }
      if(this.withdrawElapsed>=2600)this.finish();
    }else this.timerLabel.setText('00:'+String(Math.ceil(
      (PROLOGUE_SURVIVAL_MS-this.elapsed)/1000)).padStart(2,'0'));
  }
  startWithdrawal(){
    if(this.withdrawal)return;
    this.withdrawal=true;this.withdrawElapsed=0;
    this.timerLabel.setText('AMANHECE');
    this.add.rectangle(W/2,H/2,W,H,0xffd5a3,.14).setDepth(90);
    this.add.text(W/2,156,'OS INVASORES RECUAM SEM EXPLICAÇÃO',{
      fontFamily:'monospace',fontSize:'21px',fontStyle:'bold',color:'#ffedc4',
      stroke:'#081420',strokeThickness:5,
    }).setOrigin(.5).setDepth(105);
    for(const shot of this.shots)shot.sprite.destroy();
    this.shots.length=0;
  }
  finish(){
    if(this.finished)return;this.finished=true;
    this.scene.start('PrologueRepairScene',{
      stage:'arrival',campaign:this.campaign,
    });
  }
}
