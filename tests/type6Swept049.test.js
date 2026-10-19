import test from 'node:test';
import assert from 'node:assert/strict';
import {createType6State,type6Damage} from '../src/gameplay/type6Boss.js';
import {type6BulletContact} from '../src/gameplay/type6Encounter.js';
import {readFileSync} from 'node:fs';

for(const country of ['alien','us','cn','jp','ru']){
  test('v0.49: tiro básico rápido acerta Tipo 6 '+country+' após atravessar frame',()=>{
    const boss=createType6State(country,600);
    boss.introComplete=true;
    const enemy={type6:boss,sprite:{x:480,y:125}};
    const left=480-255;
    const contact=type6BulletContact(enemy,left,260,left,80,6);
    assert.equal(contact,0,'trajetória atravessa módulo bombardeador');
    const initial=boss.modules[0].shield;
    const result=type6Damage(boss,contact,6);
    assert.equal(result.damage,6);
    assert.ok(boss.modules[0].shield<initial);
    boss.barrier.active=true;boss.barrier.hp=14;
    assert.equal(type6BulletContact(enemy,left,260,left,80,6),'barrier');
    assert.equal(type6BulletContact(enemy,12,260,12,80,6),null,
      'projétil completamente fora do casco não é interceptado');
  });
}
test('v0.49: barreira, quatro módulos e núcleo mantêm sua sequência de proteção',()=>{
  const boss=createType6State('jp',600);
  boss.introComplete=true;
  const enemy={type6:boss,sprite:{x:480,y:125}};
  boss.barrier.active=true;boss.barrier.hp=12;
  const hit=type6BulletContact(enemy,480,280,480,100,6);
  assert.equal(hit,'barrier');
  type6Damage(boss,hit,12);
  assert.equal(boss.barrier.active,false);
  for(const m of boss.modules){
    const moduleX=480+m.offsetX;
    assert.equal(type6BulletContact(enemy,moduleX,260,moduleX,90,6),m.id);
    type6Damage(boss,m.id,m.shield);
    type6Damage(boss,m.id,m.hp);
  }
  assert.equal(boss.coreExposed,true);
  boss.coreReveal=1;
  assert.equal(type6BulletContact(enemy,480,260,480,90,6),'core');
  const res=type6Damage(boss,'core',boss.coreHp);
  assert.equal(res.defeated,true);
});
test('v0.49: proteção anti-travamento mantém ofensiva dos chefões atualizando e desacelera apenas o desenho',()=>{
  const src=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
  assert.match(src,/scene\.time\.now-enemy\.lastType6PaintAt>=33/);
  assert.match(src,/updateModuleAction\(scene,enemy,dt\)/);
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(game,/this\.enemyBullets\.length>=140/);
  assert.match(game,/ray<8/);
  assert.match(game,/this\.enemies\.some\(e=>e\.type===6/);
});
