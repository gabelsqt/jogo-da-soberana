import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { v1CombatStats } from '../src/gameplay/v1Upgrades.js';
import { finaleBossHp, estimatedBossDps, finaleBossFirePattern, finaleCounterattack } from '../src/gameplay/finaleBalance.js';
import { betrayalCoalition } from '../src/gameplay/wave11Rules.js';

const build = id => v1CombatStats({choices:Array(10).fill(id)});

test('Brasil nível 10 enfrenta chefe mais resistente, sem atingir valores impossíveis',()=>{
  const stats=build('br');
  assert.ok(estimatedBossDps(stats)>70);
  assert.ok(finaleBossHp('wave10',stats)>1000);
  assert.ok(finaleBossHp('wave11',stats)>finaleBossHp('wave10',stats));
  assert.ok(finaleBossHp('wave11',stats)<=3400);
});

test('dificuldade é proporcional ao arsenal; builds sem metralhadora não recebem o mesmo HP',()=>{
  const brazil=finaleBossHp('wave10',build('br'));
  for(const country of ['us','ru','cn','jp']){
    const hp=finaleBossHp('wave10',build(country));
    assert.ok(hp>=180 && hp<=3000,country);
  }
  const weak=finaleBossHp('wave10',v1CombatStats({choices:[]}));
  assert.ok(weak<brazil/4);
});

test('coalizões dividem o HP e nunca precisam lutar com 4 chefes completos',()=>{
  const s=build('ru'),base=finaleBossHp('wave11',s,1);
  assert.ok(finaleBossHp('wave11',s,2)<base);
  assert.ok(finaleBossHp('wave11',s,3)<finaleBossHp('wave11',s,2));
  assert.ok(finaleBossHp('wave11',s,4)<finaleBossHp('wave11',s,3));
  assert.deepEqual(betrayalCoalition(['br','br','br','br']),[]);
});

test('a resistência não recupera HP dos chefes ao melhorar armas',()=>{
  const original=v1CombatStats({choices:[]});
  const retry=v1CombatStats({choices:[],resistanceLevels:[1,2,3,4,5,6,7,8,9,10]});
  const hpBefore=finaleBossHp('wave11',original);
  const hpIfWronglyRecomputed=finaleBossHp('wave11',retry);
  assert.ok(hpIfWronglyRecomputed>hpBefore);
  const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(game,/const survivingChoices=this\.campaign\.choices\.filter/);
  assert.match(game,/const originalStats=v1CombatStats\(\{choices:survivingChoices\}\)/);
  assert.match(game,/finaleBossHp\('wave11',originalStats/);
});

test('novas fases aumentam o ritmo das salvas e limitam os reforços da coalizão',()=>{
  const p1=finaleBossFirePattern('wave10',1,1);
  const p3=finaleBossFirePattern('wave10',1,3);
  assert.equal(p1.volleyCount,2);
  assert.ok(p3.speedMultiplier>p1.speedMultiplier);
  assert.equal(finaleBossFirePattern('wave11',4,1).volleyCount,1);
  assert.equal(finaleBossFirePattern('wave11',4,1).damage,8);
  const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(scene,/enemy\.finalAssaultPhase/);
  assert.match(scene,/10-allMinions/);
});

test('epílogo não lança a onda zero automaticamente e volta ao menu',()=>{
  const scene=readFileSync(new URL('../src/scenes/EndingScene.js',import.meta.url),'utf8');
  assert.match(scene,/this\.scene\.start\('MenuScene'\)/);
  assert.match(scene,/Voltar ao menu/);
  assert.doesNotMatch(scene,/this\.scene\.start\('GameScene'/);
});

test('novas fases criam salvas progressivas sem aumentar o HP do chefe',()=>{
  const combat=build('br');
  const originalHp10=finaleBossHp('wave10',combat);
  const originalHp11=finaleBossHp('wave11',combat);
  for(const mode of ['wave10','wave11']){
    const base=finaleBossFirePattern(mode,1,1);
    const phase2=finaleBossFirePattern(mode,1,2);
    const phase3=finaleBossFirePattern(mode,1,3);
    assert.equal(base.volleyCount,2);
    assert.equal(phase2.volleyCount,3);
    assert.equal(phase3.volleyCount,4);
    assert.ok(phase3.damage>base.damage);
    assert.ok(phase3.intervalMultiplier<phase2.intervalMultiplier);
    assert.ok(phase2.intervalMultiplier<base.intervalMultiplier);
  }
  assert.equal(finaleBossHp('wave10',combat),originalHp10);
  assert.equal(finaleBossHp('wave11',combat),originalHp11);
});

test('coalizão numerosa aumenta volume com limite para não lotar tela',()=>{
  const first=finaleBossFirePattern('wave11',4,1);
  const furious=finaleBossFirePattern('wave11',4,3);
  assert.equal(first.volleyCount,1);
  assert.equal(furious.volleyCount,2);
  assert.ok(furious.intervalMultiplier<first.intervalMultiplier);
  for(const phase of [2,3]){
    const p=finaleCounterattack('wave11',phase,4);
    assert.equal(p.fighters,1);
    assert.equal(p.bombers,0);
    assert.equal(p.maxTriggers,3);
  }
  const solo=finaleCounterattack('wave11',3,1);
  assert.equal(solo.fighters,2);
  assert.equal(solo.bombers,1);
  const fortress=finaleCounterattack('wave10',3);
  assert.equal(fortress.maxTriggers,2);
});

test('salvas orbitais Full Brazil e contra-ataques por fase têm avisos antes de atingir',()=>{
  const source=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(source,/FROTA ALIENÍGENA: SALVA ORBITAL!/);
  assert.match(source,/this\.time\.delayedCall\(580,/);
  assert.match(source,/this\.time\.delayedCall\(660,/);
  assert.match(source,/this\.queueFinaleCounterattack\(enemy,phase\)/);
  assert.match(source,/config\.maxTriggers/);
  assert.match(source,/this\.fireEnemyProjectile\(enemy\)/);
});
