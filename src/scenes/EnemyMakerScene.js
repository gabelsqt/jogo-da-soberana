import Phaser from 'phaser';
import { bindSceneMusic } from '../audio/music.js';
import { ENEMY_TYPES } from '../gameplay/enemies.js';
import { readEnemyDraft,saveEnemyDraft,defaultEnemyDraft } from '../gameplay/enemyMakerDraft.js';
const style=(size=16,color='#e6f5ff')=>({fontFamily:'monospace',fontSize:size+'px',color});
export class EnemyMakerScene extends Phaser.Scene {
 constructor(){super({key:'EnemyMakerScene'});}
 init(){this.type=1;this.level=1;this.draft=null;}
 create(){
  bindSceneMusic(this,'setup');
  this.cameras.main.setBackgroundColor(0x0b1627);
  this.add.text(24,23,'SOBERANA  /  ENEMY MAKER',style(26,'#ffe1a1'));
  this.add.text(24,63,'Editor inicial de atributos • RASCUNHO LOCAL • NÃO ALTERA A CAMPANHA',style(12,'#9fc2cf'));
  this.button(865,37,'VOLTAR',()=>this.scene.start('V1PlaytestScene'),150);
  this.add.text(22,110,'ESCOLHA O INIMIGO',style(16,'#ffe1a1'));
  this.typeButtons=[];
  Object.values(ENEMY_TYPES).forEach((enemy,i)=>{
   const x=91+(i%6)*155;
   this.typeButtons.push(this.button(x,158,'TIPO '+enemy.id,()=>{this.type=enemy.id;this.updateDraft();},137));
  });
  this.add.text(24,209,'NÍVEL',style(16,'#ffe1a1'));
  this.button(155,213,'−',()=>{this.level=Math.max(1,this.level-1);this.updateDraft();},48);
  this.levelLabel=this.add.text(218,213,'',style(18)).setOrigin(0.5);
  this.button(280,213,'+',()=>{this.level=Math.min(10,this.level+1);this.updateDraft();},48);
  this.add.text(24,266,'VALORES EDITÁVEIS (clique para alterar)',style(16,'#ffe1a1'));
  this.values=this.add.container(0,0);
  this.description=this.add.text(26,456,'',style(12,'#9fc2cf'));
  this.button(235,505,'RESTAURAR NÍVEL',()=>{this.draft=defaultEnemyDraft(this.type,this.level);this.save();},235);
  this.button(520,505,'SALVAR RASCUNHO',()=>this.save(),245);
  this.button(787,505,'WAVE MAKER',()=>this.scene.start('WaveMakerScene'),230);
  this.updateDraft();
 }
 button(x,y,label,callback,width=145){
  const bg=this.add.rectangle(x,y,width,38,0x17344a).setStrokeStyle(2,0x7acbc9).setInteractive({useHandCursor:true});
  this.add.text(x,y,label,style(14)).setOrigin(0.5);
  bg.on('pointerdown',callback);return bg;
 }
 updateDraft(){
  this.draft=readEnemyDraft(typeof localStorage==='undefined'?null:localStorage,this.type,this.level);
  this.levelLabel.setText(String(this.level));
  this.renderValues();
 }
 renderValues(){
  this.values.removeAll(true);
  const names={hp:'VIDA (HP)',speed:'VELOCIDADE (px/s)',shotInterval:'INTERVALO ENTRE TIROS (s)',volleyCount:'TIROS POR RAJADA'};
  this.addValue=(k,v,i)=>{
   const y=315+i*39;
   const t=this.add.text(40,y,names[k]+': '+v+'  [EDITAR]',style(15,'#b8ffe9')).setInteractive({useHandCursor:true});
   t.on('pointerdown',()=>{
    const raw=window.prompt('Novo valor para '+names[k],String(this.draft.values[k]));
    if(raw===null)return;
    const num=Number(raw.replace(',','.'));
    if(!Number.isFinite(num)||num<=0||num>10000||(k==='hp'||k==='volleyCount')&&!Number.isInteger(num)){
     window.alert('Digite um número positivo válido. Vida e quantidade de tiros devem ser inteiros.');return;
    }
    this.draft.values[k]=num;this.renderValues();
   });this.values.add(t);
  };
  Object.entries(this.draft.values).forEach(([k,v],i)=>this.addValue(k,v,i));
  const name=ENEMY_TYPES[this.type]?.name??'';
  this.description.setText(name+' • valores do rascunho não afetam os inimigos reais até publicação (ainda não disponível).');
 }
 save(){
  const ok=saveEnemyDraft(typeof localStorage==='undefined'?null:localStorage,this.draft);
  this.description.setText(ok?'Rascunho salvo neste navegador. CAMPANHA INALTERADA.':'Falha ao salvar: armazenamento indisponível.');
 }
}
