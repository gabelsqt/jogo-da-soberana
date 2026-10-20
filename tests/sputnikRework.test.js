import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
import {V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
import {
 MAX_ACTIVE_SPUTNIKS,sputnikTouchesEnemy,crystallizeSputnikEnemy,
 isSputnikCrystalized,sputnikPrimaryDamage,sputnikShatterStats,
} from '../src/gameplay/russianSputnik.js';
import {COUNTRY_COLORS,countryColor} from '../src/config/countryIdentity.js';

test('Sputnik marca inimigo em contato e não inflige dano automático',()=>{
 const sat={x:240,y:140,radius:43};
 const enemy={type:2,sprite:{x:278,y:140},frozenUntil:-1};
 assert.equal(sputnikTouchesEnemy(sat,enemy),true);
 assert.equal(sputnikTouchesEnemy(sat,{type:2,sprite:{x:345,y:140}}),false);
 assert.equal(sputnikTouchesEnemy(sat,{type:6,sprite:{x:240,y:140}}),false);
 assert.equal(crystallizeSputnikEnemy(enemy,200,1800),true);
 assert.equal(enemy.frozenUntil,2000);
 assert.equal(enemy.russianCrystalizedUntil,2000);
 assert.ok(isSputnikCrystalized(enemy,1000));
 assert.equal(isSputnikCrystalized(enemy,2000),false);
 assert.equal(enemy.hp,undefined,'Sputnik não altera vida diretamente');
 assert.equal(MAX_ACTIVE_SPUTNIKS,3);
});

test('combos ampliam dano do tiro e estilhaços só enquanto cristalizado',()=>{
 const enemy={type:3,sprite:{x:0,y:0}};
 const stage1=v1SpecialConfig({choices:['ru','ru']});
 const stage3=v1SpecialConfig({choices:Array(6).fill('ru')});
 crystallizeSputnikEnemy(enemy,1000,2500);
 assert.equal(sputnikPrimaryDamage(enemy,1100,10,stage1),13);
 assert.equal(sputnikPrimaryDamage(enemy,3500,10,stage1),10);
 const normal=sputnikShatterStats(enemy,3800,60,4,stage3);
 assert.deepEqual(normal,{radius:60,damage:4});
 const boosted=sputnikShatterStats(enemy,2000,60,4,stage3);
 assert.ok(boosted.radius>60&&boosted.damage>4);
 assert.equal(boosted.radius,60*1.55);
 assert.equal(boosted.damage,5);
});

test('Sputnik substitui Matryoshka sem modificar upgrades russos primários',()=>{
 const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 assert.match(scene,/createRussianSputnik\(x,y,build\)/);
 assert.match(scene,/updateRussianSputniks\(\)/);
 assert.doesNotMatch(scene,/detonateRussianMatryoshka/);
 assert.doesNotMatch(scene,/build\.ruShards/);
 assert.deepEqual([1,3,5,7].map(n=>V1_UPGRADES.ru[n-1].kind),
   ['primary','primary','primary','primary']);
 assert.deepEqual([2,4,6,8].map(n=>V1_UPGRADES.ru[n-1].title),
  ['Sputnik Criogênico','Órbita Fria','Reator de Permafrost','Zero Absoluto Orbital']);
});

test('paleta oficial dos cinco países não se mistura',()=>{
 assert.deepEqual(Object.keys(COUNTRY_COLORS).sort(),['br','cn','jp','ru','us']);
 for(const id of Object.keys(COUNTRY_COLORS))assert.equal(countryColor(id),COUNTRY_COLORS[id]);
 assert.equal(countryColor('br'),0x37c878);
 assert.equal(countryColor('ru'),0xe8b84c);
 assert.equal(countryColor('us'),0x4897f5);
 assert.equal(countryColor('cn'),0xe84d51);
 assert.equal(countryColor('jp'),0xa46cf0);
});

test('Tipo 6 tem domo invertido e energia visual sem alterar colisões',()=>{
 const visual=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');
 assert.match(visual,/function drawEnergyIntake\(/);
 assert.match(visual,/drawEnergyIntake\(g,0,0/);
 assert.match(visual,/module\.role==='laser'\?99:58/);
 assert.match(visual,/21\+77\*\(1-nx\*nx\)/);
});
