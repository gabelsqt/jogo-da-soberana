import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getWaveEvents,scheduledEnemyCount} from '../src/gameplay/waves.js';
import {getV035WaveEvents,WAVE2_PACING} from '../src/gameplay/formation035.js';
import {specialTargetPoint,advanceSpecialProjectile} from '../src/gameplay/specialBlast.js';
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
test('Onda 2 reduz pressão em relação ao balanceamento anterior',()=>{
 const events=getV035WaveEvents('wave2',getWaveEvents('wave2'));
 assert.equal(scheduledEnemyCount(events),26);
 assert.deepEqual(events.filter(e=>e.pattern==='swarm').map(e=>e.count),[3,4,4,4]);
 assert.equal(events.filter(e=>e.pattern==='tactical').length,2);
 assert.equal(events.find(e=>e.pattern==='orbit').count,5);
 assert.ok(events.at(-1).at<=13500);
 assert.ok(events.every(e=>e.type<=2));
});
test('especial usa exatamente a coordenada visível do alvo, não posição reconstruída',()=>{
 assert.match(scene,/shot\.tx=target\.x;/);
 assert.match(scene,/shot\.ty=target\.y;/);
 assert.match(scene,/shot\.specialLaunchedAt=this\.time\.now;/);
 assert.match(scene,/this\.time\.now-\(bullet\.specialLaunchedAt\?\?this\.time\.now\)>4200/);
 for(const coords of [[480,-10000],[1200,-140],[5,30],[959,530],[480,260]]){
  const p=specialTargetPoint(480,494,...coords);
  let x=480,y=421,arrived=false;
  for(let i=0;i<360;i++){
   const result=advanceSpecialProjectile(x,y,p.x,p.y,300,1/60);
   x=result.x;y=result.y;
   if(result.arrived){arrived=true;break;}
  }
  assert.ok(arrived);
  assert.ok(x>=0&&x<=960&&y>=0&&y<=540);
 }
});
