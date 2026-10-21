import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enemyStats,enemyContactRadius} from '../src/gameplay/enemies.js';
import {VOYAGE_STAR_COLORS,voyageRocketPose,voyageStarfield,
  voyageStarAt,VOYAGE_TOTAL_MS,VOYAGE_SPACE_MS} from '../src/gameplay/voyageTravel.js';
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const stats=(type,level)=>enemyStats(type,level);

test('v0.884: tipo 4 e 5 têm blindagem maior nas ondas iniciais e avançadas',()=>{
  assert.equal(stats(4,1).hp,6);
  assert.equal(stats(4,2).hp,8);
  assert.equal(stats(4,5).hp,13);
  assert.equal(stats(4,10).hp,20);
  assert.equal(stats(5,1).hp,32);
  assert.equal(stats(5,2).hp,42);
  assert.equal(stats(5,5).hp,57);
  assert.equal(stats(5,10).hp,82);
  assert.ok(stats(4,10).hp>13);
  assert.ok(stats(5,10).hp>64);
  for(const type of [4,5])
    for(let level=1;level<10;level++){
      assert.ok(stats(type,level+1).hp>=stats(type,level).hp);
      assert.ok(Number.isInteger(stats(type,level).hp));
    }
});
test('aumento de HP não altera os tipos 1–3, Tipo 6, velocidade ou tamanho',()=>{
  assert.deepEqual([1,2,3,6].map(x=>stats(x,1).hp),[1,2,6,600]);
  assert.deepEqual([1,2,3,6].map(x=>stats(x,10).hp),[4,11,24,600]);
  assert.equal(stats(4,1).speed,300);
  assert.equal(stats(5,1).speed,28);
  assert.equal(stats(4,10).speed,351);
  assert.equal(stats(5,10).speed,33);
  assert.equal(stats(4,10).width,36);
  assert.equal(stats(5,10).width,126);
  assert.equal(enemyContactRadius(4),36*.34);
  assert.equal(enemyContactRadius(5),126*.34);
});
test('foguete/canhão conservam posição X, escala e altitude de origem após 6s',()=>{
  const times=[0,449,450,500,750,999,1000,2000,3500,4999,5000,5200,5700,5999,VOYAGE_TOTAL_MS];
  const poses=times.map(t=>voyageRocketPose(t,{x:480,startY:454,groundY:454}));
  assert.ok(poses.every(p=>p.x===480));
  assert.ok(poses.every(p=>p.scale===1));
  assert.equal(poses[0].y,454);
  assert.equal(poses.at(-1).y,454);
  assert.equal(poses[6].y,poses[7].y);
  assert.equal(poses[7].y,poses[8].y);
  assert.equal(poses[8].y,poses[9].y);
  assert.equal(poses[9].y,poses[10].y);
  assert.ok(poses[5].y>175&&poses[5].y<225);
  assert.ok(poses[11].y>poses[10].y);
  assert.ok(poses[12].y>poses[11].y);
  assert.ok(poses[13].y>poses[12].y);
  assert.equal(VOYAGE_SPACE_MS,4000);
  assert.match(game,/startY:CANNON\.y-40,groundY:CANNON\.y-40/);
  assert.match(game,/for\(const \{item,x,y\} of originals\)item\.setPosition\(x,y\+deltaY\)/);
  assert.match(game,/for\(const \{item,x,y\} of originals\)item\.setPosition\(x,y\);/);
});
test('estrelas variam tamanhos, cores frias/quentes, luminosidade e rapidez',()=>{
  const stars=voyageStarfield(108,960,540);
  const sizes=new Set(stars.map(s=>s.size));
  const colors=new Set(stars.map(s=>s.color));
  const brightness=new Set(stars.map(s=>s.alpha));
  assert.equal(stars.length,108);
  assert.ok(sizes.size>=4);
  assert.ok(sizes.has(1));
  assert.ok(sizes.has(5));
  assert.ok(colors.size>=6);
  assert.ok(VOYAGE_STAR_COLORS.length>=6);
  assert.ok(brightness.size>=4);
  assert.ok(new Set(stars.map(s=>s.speed)).size>=10);
  assert.ok(stars.every(s=>s.alpha>=0.45&&s.alpha<=1));
  assert.ok(stars.every(s=>s.color>=0&&s.color<=0xffffff));
  for(const s of stars.slice(0,20)){
    const moved=voyageStarAt(s,1170);
    assert.equal(moved.x,s.x);
    assert.equal(moved.color,s.color);
    assert.equal(moved.size,s.size);
    assert.ok(moved.y>=0&&moved.y<540);
  }
  assert.match(game,/starGraphics\.lineStyle\(Math\.max\(1,star\.size\*\.58\),star\.color/);
  assert.match(game,/starGraphics\.fillStyle\(star\.color,alpha\)/);
  assert.match(game,/\.fillCircle\(pos\.x,pos\.y,star\.size\*2\.2\)/);
  assert.match(game,/voyageStarfield\(108,W,H\)/);
});
