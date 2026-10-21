import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  americanWallConfig,americanWallBreaksFromBeam,
  americanWallAnimation,AMERICAN_WALL_ARC,
  AMERICAN_WALL_DURATION_MS,AMERICAN_WALL_COOLDOWN_MS,
} from '../src/gameplay/americanArsenal.js';

const wall=()=>({x:200,y:220,angle:-Math.PI/2,radius:60,
  arc:AMERICAN_WALL_ARC,currentArc:AMERICAN_WALL_ARC});

test('Grande Muro tem duração, mas não HP: upgrades melhoram apenas o raio',()=>{
  const levels=[2,4,6,8].map(americanWallConfig);
  for(const cfg of levels){
    assert.equal('maxHp' in cfg,false);
    assert.equal(cfg.durationMs,AMERICAN_WALL_DURATION_MS);
    assert.equal(cfg.cooldownMs,AMERICAN_WALL_COOLDOWN_MS);
  }
  assert.ok(levels.every((c,i)=>!i||c.radius>levels[i-1].radius));
});

test('somente laser de cerco Tipo 6 e núcleo destroem o muro se atravessarem o arco',()=>{
  const w=wall();
  for(const source of ['bullet','colossalBomb','type4Laser','enemyCollision',
    'laserCharge','siegeLaserCharge','coreWarning',undefined]){
    assert.equal(americanWallBreaksFromBeam(w,source,200,80,200,490,58),false,source);
  }
  assert.equal(americanWallBreaksFromBeam(w,'siegeLaser',200,80,200,490,7),true);
  assert.equal(americanWallBreaksFromBeam(w,'coreDoom',200,80,200,490,58),true);
  assert.equal(americanWallBreaksFromBeam(w,'siegeLaser',500,80,500,490,7),false);
  assert.equal(americanWallBreaksFromBeam(w,'coreDoom',500,80,500,490,58),false);
  w.currentArc=0;
  assert.equal(americanWallBreaksFromBeam(w,'siegeLaser',200,80,200,490,7),false);
  assert.equal(americanWallBreaksFromBeam(w,'coreDoom',200,80,200,490,58),false);
  w.currentArc=Math.PI/8;
  assert.equal(americanWallBreaksFromBeam(w,'siegeLaser',200,80,200,490,7),true);
});

test('o muro intacto termina naturalmente 6 s depois de abrir',()=>{
  const w={...wall(),startedAt:0,travelMs:180,
    muzzleX:480,muzzleY:480,targetX:200,targetY:160};
  assert.equal(americanWallAnimation(w,50).phase,'travel');
  assert.equal(americanWallAnimation(w,180).phase,'deploy');
  assert.equal(americanWallAnimation(w,480).phase,'active');
  assert.equal(AMERICAN_WALL_DURATION_MS,6000);
});

test('a cena intercepta tiros e choques sem dano e só estilhaça ao receber feixe excepcional',()=>{
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  const boss=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
  const upgrade=readFileSync(new URL('../src/gameplay/v1Upgrades.js',import.meta.url),'utf8');
  assert.doesNotMatch(scene,/wall\.hp|wall\.maxHp/);
  assert.match(scene,/hitAmericanWallWithBullet\(shot,x1,y1\)/);
  assert.match(scene,/wall\.flashUntil=this\.time\.now\+130/);
  assert.match(scene,/destroyAmericanWall\(wall\);continue;/);
  assert.match(scene,/destroyAmericanWall\(wall,true\)/);
  assert.match(scene,/americanWallBreaksFromBeam\(wall,source,x1,y1,x2,y2,halfWidth\)/);
  assert.match(boss,/scene\.breakAmericanWallsWithType6Beam\?\.\([\s\S]*?'siegeLaser',7\)/);
  assert.match(boss,/scene\.breakAmericanWallsWithType6Beam\?\.\(x,y,CANNON\.x,CANNON\.y,'coreDoom',58\)/);
  assert.match(boss,/if\(!wallBroken\)scene\.damageCannon\(45\*dt\)/);
  assert.match(upgrade,/invulnerável a tiros comuns/);
});
