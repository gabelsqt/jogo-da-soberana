import Phaser from 'phaser';
import { analyzeWavePressure } from '../gameplay/wavePressure.js';
import { bindSceneMusic } from '../audio/music.js';
import { normalizeLabConfig } from '../gameplay/labConfig.js';
import {
 WAVE_MAKER_WAVES,readWaveMakerProject,saveWaveMakerProject,
 normalizeWaveMakerEvent,nextWaveMakerEventId,cloneWaveMakerEvent,waveMakerEnemyCount,officialWaveDraft
} from '../gameplay/waveMakerModel.js';

const bg=0x0b1627,accent=0x73d4ca,panel=0x17263a;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const textStyle=(size=13,color='#e5f5ff')=>({fontFamily:'monospace',fontSize:size+'px',color});
export class WaveMakerScene extends Phaser.Scene {
 constructor(){super({key:'WaveMakerScene'});}
 init(data={}){
  this.labConfig=normalizeLabConfig(data.labConfig);
  this.current=clamp(Math.round(Number(data.wave??this.labConfig.wave)),0,11);
  this.project=readWaveMakerProject(typeof localStorage==='undefined'?null:localStorage);
  this.selected=null;this.dragging=false;this.status='Rascunho isolado da campanha';
  this.analysisRange=null; this.analysisBaseline=null;
 }
 create(){
  bindSceneMusic(this,'setup');
  this.cameras.main.setBackgroundColor(bg);
  this.add.rectangle(480,30,960,60,0x101e32);
  this.add.text(18,13,'SOBERANIA  /  WAVE MAKER',textStyle(22,'#ffe1a1'));
  this.add.text(18,40,'Etapa 1 • editor de rascunhos • sem publicação na campanha',textStyle(11,'#9fc2cf'));
  this.drawButton(877,30,'VOLTAR',()=>this.scene.start('LabSetupScene',{config:{...this.labConfig,wave:Math.min(this.current,9)}}),130,35);
  this.add.rectangle(62,289,124,448,0x101f31).setStrokeStyle(1,0x39566d);
  this.add.text(10,74,'ONDAS',textStyle(14,'#ffe2a6'));
  WAVE_MAKER_WAVES.forEach((wave,i)=>{
   this.drawButton(62,102+i*29,'ONDA '+i,()=>{this.current=i;this.selected=null;this.analysisRange=null;this.analysisBaseline=null;this.render();},108,25,false,i);
  });
  this.add.text(144,72,'CAMPO DE ENTRADA  •  arraste os marcadores',textStyle(12,'#a9dbe4'));
  this.add.rectangle(510,194,736,226,0x070f1c).setStrokeStyle(2,0x436278);
  this.grid=this.add.graphics();this.grid.lineStyle(1,0x365169,0.5);
  for(let i=1;i<8;i++)this.grid.lineBetween(142+i*92,82,142+i*92,306);
  for(let j=1;j<4;j++)this.grid.lineBetween(142,82+j*56,878,82+j*56);
  this.add.text(148,86,'TOPO / SPAWN',textStyle(10,'#7899b3'));
  this.add.text(148,290,'DEFESA',textStyle(10,'#7899b3'));
  this.add.text(144,321,'LINHA DO TEMPO — arraste blocos ou edite os valores abaixo',textStyle(12,'#a9dbe4'));
  this.drawButton(822,320,'ANALISAR',()=>this.showPressure(),108,28);
  this.drawButton(691,320,'TRECHO',()=>this.setAnalysisRange(),100,28);
  this.drawButton(565,320,'COMPARAR',()=>this.comparePressure(),112,28);
  this.add.rectangle(510,371,736,65,0x101f31).setStrokeStyle(1,0x436278);
  this.add.text(145,418,'EVENTO SELECIONADO',textStyle(12,'#ffe2a6'));
  this.fields=this.add.container(0,0);
  this.markers=this.add.container(0,0);
  this.timeline=this.add.container(0,0);
  this.pressureGraphics=this.add.graphics().setDepth(4);
  this.pressureLegend=this.add.text(150,397,'',textStyle(10,'#fce4ae')).setDepth(5);
  this.statusLabel=this.add.text(145,519,'',textStyle(11,'#a4daca'));
  this.drawButton(206,492,'+ GRUPO',()=>this.addEvent(),125,34);
  this.drawButton(351,492,'DUPLICAR',()=>this.duplicate(),125,34);
  this.drawButton(496,492,'EXCLUIR',()=>this.removeSelected(),125,34);
  this.drawButton(651,492,'SALVAR',()=>this.persist(),125,34);
  this.drawButton(804,492,'COPIAR OFICIAL',()=>this.resetDraft(),145,34);
  this.input.on('drag',(pointer,object,dragX,dragY)=>{
   const e=this.events().find(it=>it.id===object.getData('eventId'));if(!e)return;
   if(object.getData('kind')==='map'){
    e.x=clamp(Math.round((dragX-142)/736*960),0,960);
    e.y=clamp(Math.round((dragY-82)/226*540),-100,540);
   }else{
    e.at=clamp(Math.round((dragX-150)/717*this.entry().durationMs),0,this.entry().durationMs);
   }
   if(object.getData('kind')==='map'&&Object.hasOwn(e,'portalX'))e.portalX=e.x;
   object.setPosition(dragX,dragY);
   this.selected=e.id;this.dragging=true;
  });
  this.input.on('dragend',()=>{if(this.dragging){this.persist();this.dragging=false;this.render();}});
  this.render();
 }
 drawButton(x,y,label,action,width=110,height=30,primary=false,waveIndex=null){
  const rect=this.add.rectangle(x,y,width,height,primary?0x27585a:panel).setStrokeStyle(1,accent,0.65).setInteractive({useHandCursor:true});
  const txt=this.add.text(x,y,label,textStyle(12)).setOrigin(0.5);
  rect.on('pointerdown',()=>action());
  if(waveIndex!==null){rect.setData('waveIndex',waveIndex);this.waveButtons??=[];this.waveButtons.push({rect,txt,waveIndex});}
  return rect;
 }
 entry(){return this.project.waves['wave'+this.current];}
 events(){return this.entry().events;}
 currentEvent(){return this.events().find(e=>e.id===this.selected);}
 persist(){const ok=saveWaveMakerProject(typeof localStorage==='undefined'?null:localStorage,this.project);this.status=ok?'Rascunho salvo neste navegador':'Não foi possível salvar: armazenamento indisponível';this.statusLabel.setText(this.status);}
 select(id){this.selected=id;this.render();}
 numeric(label,key,x,y,min,max,step=1){
  const event=this.currentEvent();if(!event)return;
  const value=event[key];const button=this.add.text(x,y,label+': '+value,textStyle(12,'#f4e3bb')).setInteractive({useHandCursor:true});
  button.on('pointerdown',()=>{
   const response=window.prompt('Editar '+label,value);if(response===null)return;
   const numeric=Number(response.replace(',','.'));
   if(!Number.isFinite(numeric))return;
   event[key]=clamp(Math.round(numeric/step)*step,min,max);
   if(key==='x'&&Object.hasOwn(event,'portalX'))event.portalX=event.x;
   this.persist();this.render();
  });
  this.fields.add(button);
 }
 render(){
  const entry=this.entry();if(!entry)return;
  this.waveButtons?.forEach(({rect,waveIndex})=>rect.setFillStyle(waveIndex===this.current?0x36766e:panel));
  this.markers.removeAll(true);this.timeline.removeAll(true);this.fields.removeAll(true);
  this.renderPressure();
  const events=this.events(),duration=entry.durationMs;
  const maxShown=45;
  const visible=events.slice(0,maxShown);
  visible.forEach((e,i)=>{
   const mx=142+e.x/960*736,my=82+clamp(e.y,0,540)/540*226;
   const chosen=e.id===this.selected;
   const marker=this.add.circle(mx,my,chosen?9:6,chosen?0xffdc8b:0xff7e82).setStrokeStyle(2,0x08111d).setInteractive({draggable:true,useHandCursor:true});
   marker.setData('eventId',e.id);marker.setData('kind','map');
   marker.on('pointerup',()=>{if(!this.dragging)this.select(e.id);});this.markers.add(marker);
   const tx=150+clamp(e.at/duration,0,1)*717;
   const ty=352+(i%3)*15;
   const block=this.add.rectangle(tx,ty,Math.max(14,Math.min(44,10+e.count*2)),12,chosen?0xffdc8b:0x7eb9c8)
     .setInteractive({draggable:true,useHandCursor:true});
   block.setData('eventId',e.id);block.setData('kind','time');
   block.on('pointerup',()=>{if(!this.dragging)this.select(e.id);});this.timeline.add(block);
  });
  for(let t=0;t<=5;t++){
   const x=150+t*717/5;this.timeline.add(this.add.text(x,387,Math.round(t*duration/5000)+'s',textStyle(10,'#a6bfd1')).setOrigin(0.5));
  }
  const selected=this.currentEvent();
  const info=this.add.text(144,436,`Onda ${this.current} • ${events.length} eventos • ${waveMakerEnemyCount(events)} inimigos • duração ${duration/1000}s`,
   textStyle(12,'#b4e6e3'));this.fields.add(info);
  if(selected){
   const typeBtn=this.add.text(144,457,'TIPO '+selected.type+'  (clique)',textStyle(12,'#ffe1a1')).setInteractive({useHandCursor:true});
   typeBtn.on('pointerdown',()=>{selected.type=selected.type%6+1;this.persist();this.render();});this.fields.add(typeBtn);
   this.numeric('MS','at',330,457,0,duration);
   this.numeric('X','x',465,457,0,960);
   this.numeric('Y','y',575,457,-100,540);
   this.numeric('QTD','count',680,457,1,99);
   this.numeric('NÍVEL','level',793,457,1,10);
  }else this.fields.add(this.add.text(144,457,'Selecione um marcador ou um bloco para editar.',textStyle(12,'#b9c7d9')));
  this.statusLabel.setText(this.status+(events.length>maxShown?' • primeiros 45 eventos exibidos':''));
 }
 addEvent(){
  const events=this.events(),id=nextWaveMakerEventId(events);
  events.push(normalizeWaveMakerEvent({id,type:1,level:1,pattern:'swarm',count:3,at:1000,x:480,y:0},events.length));
  this.selected=id;this.persist();this.render();
 }
 duplicate(){
  const e=this.currentEvent();if(!e)return;const clone=cloneWaveMakerEvent(e,this.events());
  this.events().push(clone);this.selected=clone.id;this.persist();this.render();
 }
 removeSelected(){
  if(!this.currentEvent())return;
  this.entry().events=this.events().filter(e=>e.id!==this.selected);
  this.selected=null;this.persist();this.render();
 }
 setAnalysisRange(){
  const duration=this.entry().durationMs;
  const prior=this.analysisRange||{fromMs:0,toMs:duration};
  const rawStart=window.prompt('Início do trecho (segundos)',String(prior.fromMs/1000));
  if(rawStart===null)return;
  const rawEnd=window.prompt('Fim do trecho (segundos)',String(prior.toMs/1000));
  if(rawEnd===null)return;
  const from=Number(rawStart.replace(',','.'))*1000;
  const to=Number(rawEnd.replace(',','.'))*1000;
  if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||to>duration||to<=from){
   window.alert('Intervalo inválido. O início deve ser menor que o fim e estar dentro da duração da onda.');
   return;
  }
  this.analysisRange={fromMs:Math.round(from),toMs:Math.round(to)};
  this.render();
 }
 comparePressure(){
  const report=analyzeWavePressure(this.entry(),this.analysisRange||{});
  if(!this.analysisBaseline||this.analysisBaseline.wave!==this.current){
   this.analysisBaseline={wave:this.current,report};
   this.status='Referência registrada. Modifique a onda e clique COMPARAR.';
   this.render();return;
  }
  const base=this.analysisBaseline.report;
  window.alert([
   'COMPARAÇÃO DE ENTRADAS — ONDA '+this.current,
   'Referência → Atual',
   'Eventos: '+base.totalEvents+' → '+report.totalEvents,
   'Pressão média estimada: '+base.averagePressure+' → '+report.averagePressure,
   'Pico estimado: '+(base.peak?.pressure??0)+' → '+(report.peak?.pressure??0),
   '',
   'Não mede projéteis ativos, dano ou chance de vitória.'
  ].join('\\n'));
  this.analysisBaseline={wave:this.current,report};
 }
 renderPressure(){
  if(!this.pressureGraphics)return;
  const report=analyzeWavePressure(this.entry(),this.analysisRange||{});
  const g=this.pressureGraphics;
  g.clear();
  const values=report.windows;
  const peak=Math.max(1,...values.map(w=>w.pressure));
  for(const w of values){
   const x=150+(w.startMs/this.entry().durationMs)*717;
   const width=Math.max(1,(w.endMs-w.startMs)/this.entry().durationMs*717-1);
   const height=Math.min(40,w.pressure/peak*39);
   g.fillStyle(w.pressure>=peak*0.8?0xffad6e:0x70c8c1,0.74);
   g.fillRect(x,403-height,width,height);
  }
  const scope=this.analysisRange?'trecho '+(report.fromMs/1000)+'–'+(report.toMs/1000)+' s':'onda completa';
  this.pressureLegend?.setText('Entradas estimadas • '+scope+' • pico '+(report.peak?.pressure??0));
 }
 showPressure(){
  const entry=this.entry();
  const report=analyzeWavePressure(entry,this.analysisRange||{});
  const peak=report.peak;
  const message=[
   'ONDA '+this.current+' — análise de entradas (heurística)',
   report.totalEvents+' eventos em '+(entry.durationMs/1000)+' segundos',
   'Média de pressão: '+report.averagePressure,
   peak?'Pico: '+(peak.startMs/1000)+'–'+(peak.endMs/1000)+' s • '+peak.enemyCount+' inimigos • pontuação '+peak.pressure:'Sem eventos na onda',
   ...report.suggestions,
   '',report.warning,
   'Análise estática; não determina resultado da batalha.'
  ].join('\n');
  window.alert(message);
 }
 resetDraft(){
  if(!window.confirm('Descartar o rascunho desta onda e copiar novamente os eventos oficiais?'))return;
  // Importação tardia da base foi evitada: import estático explícito.
  this.project.waves['wave'+this.current]=officialWaveDraft('wave'+this.current);
  this.selected=null;this.persist();this.render();
 }
}
