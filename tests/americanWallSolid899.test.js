import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {solidAmericanWallCollision,US_WALL_SOLID_MARGIN}
 from '../src/gameplay/americanWallDefense.js';
import {AMERICAN_WALL_ARC,americanWallAnimation}
 from '../src/gameplay/americanArsenal.js';

const wall={x:480,y:340,radius:120,angle:-Math.PI/2,
  arc:AMERICAN_WALL_ARC,currentArc:AMERICAN_WALL_ARC};
const radius=11;
const safe=wall.radius+radius+12+US_WALL_SOLID_MARGIN;

test('parede curva é sólida em velocidades normais e em saltos de 400 pixels',()=>{
 for(const endY of [185,240,310,460]){
   const hit=solidAmericanWallCollision(wall,480,80,480,endY,radius);
   if(endY===185){assert.equal(hit,null);continue;}
   assert.ok(hit,'não pode atravessar o arco a qualquer velocidade');
   assert.ok(Math.abs(hit.x-480)<1e-7);
   assert.ok(Math.abs(hit.y-(wall.y-safe))<.001,
     'para ANTES da face externa do muro, sem atravessar');
   assert.equal(hit.kind,'swept');
 }
});

test('arco de 120 graus: bloqueia as duas diagonais e as pontas',()=>{
 for(const angle of [-Math.PI/2-.73,-Math.PI/2+.73]){
   const dirX=Math.cos(angle),dirY=Math.sin(angle);
   const fromX=wall.x+dirX*245,fromY=wall.y+dirY*245;
   const toX=wall.x+dirX*40,toY=wall.y+dirY*40;
   const hit=solidAmericanWallCollision(wall,fromX,fromY,toX,toY,7);
   assert.ok(hit,'bloqueia incursões próximas às extremidades');
   assert.ok(Math.hypot(hit.x-wall.x,hit.y-wall.y)>wall.radius);
 }
 // A ponta arredondada deve impedir que se passe pelo cantinho.
 const endAngle=wall.angle+wall.arc/2;
 const tipX=wall.x+Math.cos(endAngle)*wall.radius;
 const tipY=wall.y+Math.sin(endAngle)*wall.radius;
 const cap=solidAmericanWallCollision(wall,tipX+40,tipY,tipX-25,tipY,9);
 assert.ok(cap,'a ponta arredondada também bloqueia atravessamento');
});

test('fora do arco permanece navegável: não transformar 120° em círculo inteiro',()=>{
 assert.equal(solidAmericanWallCollision(wall,480,470,480,300,radius),null,
   'parte de baixo não é coberta pelo arco voltado para cima');
 assert.equal(solidAmericanWallCollision({...wall,currentArc:0},
   480,80,480,490,radius),null,'antes de materializar não há colisão');
 assert.equal(solidAmericanWallCollision(wall,480,300,480,100,radius),null,
   'naves já no interior podem escapar para o exterior');
});

test('barreira nasce sobre uma nave: sobreposição próxima é expulsa da curva',()=>{
 const hit=solidAmericanWallCollision(wall,480,220,480,240,12);
 assert.ok(hit&&hit.kind==='overlap');
 assert.ok(hit.y<220,'retorna para fora e não empurra através da parede');
});

test('somente feixes Tipo 6 continuam ignorando quebra normal; proteção não causa dano',()=>{
 const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 const handle=scene.slice(scene.indexOf('  blockEnemyWithAmericanWall('),
   scene.indexOf('  updateAmericanWalls(){'));
 assert.match(handle,/solidAmericanWallCollision\(wall,fromX,fromY,/);
 assert.match(handle,/enemy\.sprite\.setPosition\(hit\.x,hit\.y\)/);
 assert.doesNotMatch(handle,/damageTarget|impactInvader/);
 const diveStart=scene.indexOf("      } else if (enemy.phase === 'wallRepelled')");
 const dive=scene.slice(diveStart,scene.indexOf('      // Estima velocidade real',diveStart));
 assert.ok(dive.indexOf('this.blockEnemyWithAmericanWall(')<
   dive.indexOf('this.removeEnemy(i);'),
   'o muro deve corrigir a trajetória ANTES de remover e danificar');
 assert.match(dive,/enemy\.phase='wallRepelled'/);
 assert.match(scene,/this\.blockEnemyWithAmericanWall\(enemy,worldFromX,worldFromY\)/);
 const deployed=americanWallAnimation({...wall,startedAt:0,travelMs:0,
   muzzleX:480,muzzleY:480,targetX:480,targetY:220},600);
 assert.equal(deployed.arc,wall.arc);
});
