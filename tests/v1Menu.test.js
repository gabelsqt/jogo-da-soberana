import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { V1_UPGRADES } from '../src/gameplay/v1Upgrades.js';

test('menu do playtest v1 não expõe laboratório de animais',()=>{
 const menu=readFileSync(new URL('../src/scenes/MenuScene.js',import.meta.url),'utf8');
 assert.match(menu,/TESTAR UPGRADES/);
 assert.match(menu,/COMEÇAR CAMPANHA/);
 assert.match(menu,/Operação Soberania/);
 assert.doesNotMatch(menu,/this\.scene\.start\('LabSetupScene'/);
 assert.match(menu,/this\.scene\.start\('V1PlaytestScene'\)/);
});
test('menu escolhe próximos níveis da árvore nova, incluindo 9 e 10',()=>{
 const scene=readFileSync(new URL('../src/scenes/V1PlaytestScene.js',import.meta.url),'utf8');
 assert.match(scene,/V1_UPGRADES\[row\.id\]/);
 assert.match(scene,/this\.arenaIndex===12\?'upgradeLab':'wave'\+this\.arenaIndex/);
 assert.match(scene,/ARENA LIVRE/);
 assert.match(scene,/changeV1LabLevel\(this\.levels,country,delta\)/);
 assert.match(scene,/v1LabLevels:build\.labLevels/);
 assert.equal(Object.keys(V1_UPGRADES).length,5);
});
test('boteco V1 não exibe diálogos legados de animais',()=>{
 const scene=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');
 assert.match(scene,/nextV1Options\(this\.campaign,\s*FIRST_UPGRADES\)/);
 assert.match(scene,/representativeStoryFor\(id,option\.level\)/);
 assert.doesNotMatch(scene,/upgradeRepresentativeLine\(/);
});
