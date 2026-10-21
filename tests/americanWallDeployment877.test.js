import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  americanWallPlacement,americanWallArcCenter,americanWallTravelDuration,
  americanWallAnimation,americanWallTouches,americanWallIntersects,
  AMERICAN_WALL_ARC,AMERICAN_WALL_OPEN_MS,AMERICAN_WALL_DURATION_MS,
} from '../src/gameplay/americanArsenal.js';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('a mira marca o meio do escudo, não o centro da curvatura',()=>{
  for(const target of [[480,160],[150,260],[810,380],[480,500]]){
    const p=americanWallPlacement(...target,480,480,960,540);
    for(const radius of [60,79,101,125]){
      const center=americanWallArcCenter(p.x,p.y,p.angle,radius);
      near(center.x+Math.cos(p.angle)*radius,p.x);
      near(center.y+Math.sin(p.angle)*radius,p.y);
    }
  }
});

test('energia sai da boca do canhão, chega à mira e abre 120 graus',()=>{
  const wall={x:200,y:220,angle:-Math.PI/2,radius:60,arc:AMERICAN_WALL_ARC,
    muzzleX:480,muzzleY:465,targetX:200,targetY:160,startedAt:1000};
  wall.travelMs=americanWallTravelDuration(wall.muzzleX,wall.muzzleY,wall.targetX,wall.targetY);
  assert.ok(wall.travelMs>=130&&wall.travelMs<=480);
  const start=americanWallAnimation(wall,1000);
  assert.equal(start.phase,'travel');
  near(start.x,wall.muzzleX);near(start.y,wall.muzzleY);near(start.arc,0);
  const midway=americanWallAnimation(wall,1000+wall.travelMs/2);
  assert.equal(midway.phase,'travel');
  assert.ok(midway.x<wall.muzzleX&&midway.x>wall.targetX);
  const arrived=americanWallAnimation(wall,1000+wall.travelMs);
  assert.equal(arrived.phase,'deploy');
  near(arrived.x,wall.targetX);near(arrived.y,wall.targetY);
  const spreading=americanWallAnimation(wall,1000+wall.travelMs+AMERICAN_WALL_OPEN_MS/2);
  assert.equal(spreading.phase,'deploy');
  assert.ok(spreading.arc>0&&spreading.arc<AMERICAN_WALL_ARC);
  const active=americanWallAnimation(wall,1000+wall.travelMs+AMERICAN_WALL_OPEN_MS);
  assert.equal(active.phase,'active');
  near(active.arc,2*Math.PI/3);
  const expiration=1000+wall.travelMs+AMERICAN_WALL_OPEN_MS+AMERICAN_WALL_DURATION_MS;
  near(expiration-(1000+wall.travelMs+AMERICAN_WALL_OPEN_MS),AMERICAN_WALL_DURATION_MS);
});

test('o projétil não intercepta: colisões só no arco que já abriu',()=>{
  const wall={x:200,y:220,angle:-Math.PI/2,radius:60,arc:AMERICAN_WALL_ARC,currentArc:0};
  assert.equal(americanWallTouches(wall,200,160),false);
  assert.equal(americanWallIntersects(wall,200,140,200,200,4),false);
  wall.currentArc=Math.PI/6;
  assert.ok(americanWallTouches(wall,200,160));
  assert.equal(americanWallTouches(wall,251,188),false);
  wall.currentArc=AMERICAN_WALL_ARC;
  assert.ok(americanWallTouches(wall,251,188));
});

test('prévia, viagem, abertura, defesa e temporizador conectados à cena',()=>{
  const s=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  for(const text of ['americanWallArcCenter(x,y,angle,radius)',
    'americanWallArcCenter(point.x,point.y,point.angle,cfg.radius)',
    'cannonSpritePose(point.angle','americanWallTravelDuration(muzzleX,muzzleY',
    "animation.phase==='travel'","animation.phase==='deploy'",
    'wall.currentArc=animation.arc','AMERICAN_WALL_OPEN_MS+cfg.durationMs',
    'playSfx(\'shieldOn\''])
    assert.ok(s.includes(text),text);
});
