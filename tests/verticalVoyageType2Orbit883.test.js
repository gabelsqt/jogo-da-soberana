import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VOYAGE_PREPARE_MS,VOYAGE_LAUNCH_MS,VOYAGE_SPACE_MS,VOYAGE_LANDING_MS,
 VOYAGE_TOTAL_MS,voyageTravelPhase,voyageRocketPose,voyageStarfield,voyageStarAt
} from '../src/gameplay/voyageTravel.js';
import {tacticalManeuverPosition} from '../src/gameplay/formation035.js';
import {orbitalFormationPosition} from '../src/gameplay/enemies.js';
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');

test('cinema vertical: preparação de 450ms, arrancada de 550ms e cruzeiro de 4s',()=>{
 assert.equal(VOYAGE_PREPARE_MS,450);
 assert.equal(VOYAGE_LAUNCH_MS-VOYAGE_PREPARE_MS,550);
 assert.equal(VOYAGE_SPACE_MS,4000);
 assert.equal(VOYAGE_LANDING_MS,1000);
 assert.equal(VOYAGE_TOTAL_MS,6000);
 assert.equal(voyageTravelPhase(0),'prepare');
 assert.equal(voyageTravelPhase(449),'prepare');
 assert.equal(voyageTravelPhase(450),'launch');
 assert.equal(voyageTravelPhase(999),'launch');
 assert.equal(voyageTravelPhase(1000),'space');
 assert.equal(voyageTravelPhase(4999),'space');
 assert.equal(voyageTravelPhase(5000),'landing');
 assert.equal(voyageTravelPhase(5999),'landing');
 assert.equal(voyageTravelPhase(6000),'done');
});

test('foguete não desloca na horizontal, prepara motor e acelera fortemente para cima',()=>{
 const ts=[0,120,449,450,550,650,750,850,950,999,1000,2000,4999,5000,5300,5700,5999,6000];
 const poses=ts.map(t=>voyageRocketPose(t));
 assert.ok(poses.every(p=>p.x===480));
 assert.ok(poses.every(p=>p.scale>0 && p.scale<=1));
 assert.equal(poses[0].phase,'prepare');
 assert.equal(poses[3].phase,'launch');
 assert.equal(poses[10].phase,'space');
 assert.equal(poses[13].phase,'landing');
 assert.equal(poses[17].phase,'done');
 assert.ok(poses[2].thrust>poses[0].thrust);
 assert.ok(Math.abs(poses[2].y-454)<3);
 assert.ok(poses[5].y<poses[4].y);
 assert.ok(poses[6].y<poses[5].y);
 assert.ok(poses[8].y<poses[7].y);
 assert.ok(poses[9].y<-150,'foguete precisa sair da tela pelo topo');
 const firstJump=voyageRocketPose(550).y-voyageRocketPose(500).y;
 const fastJump=voyageRocketPose(950).y-voyageRocketPose(900).y;
 assert.ok(Math.abs(fastJump)>Math.abs(firstJump)*7,'a arrancada tem aceleração cúbica');
 assert.equal(voyageRocketPose(1000).x,voyageRocketPose(4999).x);
 assert.ok(poses[13].y<0,'a aterrissagem começa acima da tela');
 assert.ok(poses[14].y<poses[15].y&&poses[15].y<poses[16].y);
 assert.equal(poses[17].y,390);
 assert.ok(poses[16].thrust<poses[13].thrust);
});

test('as estrelas atravessam verticalmente a tela, nunca da esquerda para a direita',()=>{
 const stars=voyageStarfield(92);
 assert.equal(stars.length,92);
 assert.ok(new Set(stars.map(s=>s.speed)).size>12);
 const sample=stars[7];
 for(const t of [0,130,600,1200,3500,4000]){
   const position=voyageStarAt(sample,t);
   assert.equal(position.x,sample.x);
   assert.ok(position.y>=0&&position.y<540);
 }
 assert.notEqual(voyageStarAt(sample,900).y,sample.y);
 assert.match(scene,/const pose=voyageRocketPose\(elapsed/);
 assert.match(scene,/ship\.x=pose\.x/);
 assert.match(scene,/ship\.y=pose\.y/);
 assert.match(scene,/starGraphics\.lineBetween\(pos\.x,pos\.y-tail,pos\.x,pos\.y\)/);
 assert.doesNotMatch(scene,/ship\.x=W\/2\+Math\.sin\(/);
 assert.doesNotMatch(scene,/ship\.y=245\+Math\.sin\(/);
});

test('Tipo 2 tático forma círculo mais amplo, duas voltas e mantém naves visíveis',()=>{
 const normal={duration:6.2,holdDuration:1.3,centerX:480,count:8,
   portalY:125,lowFlight:false,boundToScreen:true,
   direction:1,finalFormation:'triangle'};
 const low={...normal,portalY:192,lowFlight:true};
 for(const group of [normal,low]){
   const pts=Array.from({length:101},(_,i)=>tacticalManeuverPosition(group,3,
     i*(group.duration-group.holdDuration)/100));
   const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
   assert.ok(Math.max(...xs)-Math.min(...xs)>220,'diâmetro horizontal maior que 220 px');
   assert.ok(Math.max(...ys)-Math.min(...ys)>155,'arco vertical bem mais amplo');
   assert.ok(pts.every(p=>p.x>=38&&p.x<=922),'mantém-se na área útil na horizontal');
   assert.ok(pts.every(p=>p.y>=42&&p.y<=435),'mantém-se na área útil na vertical');
   const end=tacticalManeuverPosition(group,3,group.duration);
   assert.deepEqual(end,tacticalManeuverPosition(group,3,group.duration+5));
 }
 assert.match(readFileSync(new URL('../src/gameplay/formation035.js',import.meta.url),'utf8'),
   /const orbitRadiusX = 140/);
});

test('Tipo 2 de formação orbital também faz círculo alto e amplo',()=>{
 const pts=Array.from({length:10},(_,i)=>orbitalFormationPosition(480,215,i,10,0));
 const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
 assert.ok(Math.max(...xs)-Math.min(...xs)>365);
 assert.ok(Math.max(...ys)-Math.min(...ys)>215);
 assert.ok(pts.every(p=>p.x>=240&&p.x<=720&&p.y>=95&&p.y<=335));
 assert.match(scene,/enemy\.orbitCenterY = 215/);
});
