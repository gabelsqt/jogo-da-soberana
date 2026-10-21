// Regressão da substituição do Quatro de Julho automático por foguetes
// americanos de tamanho fixo. O nome continua identificando o nível 3.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {v1CombatStats,V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
import {americanRocketConfig,americanWallConfig} from '../src/gameplay/americanArsenal.js';
test('Quatro de Julho agora é crescimento de foguete, não carga por acerto',()=>{
 for(const n of [1,3,5,7,10]){
  const s=v1CombatStats({choices:Array(n).fill('us')});
  assert.equal(s.usJulyHitsRequired,0);
  assert.equal(s.usRocketRadius,americanRocketConfig(n).radius);
  assert.equal(s.usHoming,0);
  assert.equal(s.usGrowthMax,1);
 }
 assert.match(V1_UPGRADES.us[2].title,/Quatro de Julho/);
 assert.match(V1_UPGRADES.us[9].title,/Independence Day/);
 assert.ok(americanWallConfig(2));
});
test('especial projeta parede, sem mísseis americanos teleguiados',()=>{
 const s=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
 assert.match(s,/if\(country==='us'\)/);
 assert.match(s,/createAmericanWall\(target.x,target.y,this.specialBuild\)/);
 assert.match(s,/const usRocket=!special/);
 assert.match(s,/usRadius:usRocket\?this.combat.usRocketRadius/);
 assert.doesNotMatch(s,/bullet\.usGrowthMax>1/);
});
