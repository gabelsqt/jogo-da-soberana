import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeV1LabLevels, changeV1LabLevel, v1LabBuild }
  from '../src/gameplay/v1LabLoadout.js';
import { v1CountryLevels, v1CombatStats } from '../src/gameplay/v1Upgrades.js';
import { v1SpecialConfig } from '../src/gameplay/v1Specials.js';

const sceneSource=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const menuSource=readFileSync(new URL('../src/scenes/V1PlaytestScene.js',import.meta.url),'utf8');

test('laboratório combina níveis independentes por país, inclusive nível 10',()=>{
  let levels=normalizeV1LabLevels({jp:10,br:4,cn:6,ru:3,us:2});
  assert.deepEqual(levels,{br:4,us:2,ru:3,cn:6,jp:10});
  levels=changeV1LabLevel(levels,'br',1);
  assert.equal(levels.br,5);
  assert.equal(levels.jp,10);
  levels=changeV1LabLevel(levels,'jp',10);
  assert.equal(levels.jp,10,'cada país tem teto de dez');
  levels=changeV1LabLevel(levels,'ru',-20);
  assert.equal(levels.ru,0);
  const state=v1LabBuild(levels,'jp');
  assert.deepEqual(v1CountryLevels(state),{br:5,us:2,ru:0,cn:6,jp:10});
  assert.equal(v1CombatStats(state).koreaContinuous,true);
  assert.ok(v1CombatStats(state).brazilFireworkCount>0);
  assert.ok(v1CombatStats(state).chinaSplitCount>1);
  const special=v1SpecialConfig(state);
  assert.equal(special.primary,'jp');
  assert.ok(special.active.includes('br'));
  assert.ok(special.active.includes('us'));
  assert.ok(special.active.includes('cn'));
});

test('o principal controla qual especial híbrido é lançado, sem apagar níveis',()=>{
  const levels={br:4,us:4,ru:4,cn:4,jp:10};
  const america=v1LabBuild(levels,'us');
  const korea=v1LabBuild(levels,'jp');
  assert.deepEqual(v1CountryLevels(america),v1CountryLevels(korea));
  assert.equal(v1SpecialConfig(america).primary,'us');
  assert.equal(v1SpecialConfig(korea).primary,'jp');
  assert.equal(v1LabBuild({br:1,jp:2},'br').labPrimary,'jp',
    'sem nível 2, seleção principal não impede testar outro especial');
});

test('campanha preserva dez escolhas globais, sem benefício indevido de laboratório',()=>{
  const campaign={choices:[...Array(10).fill('br'),...Array(10).fill('jp')]};
  assert.equal(v1CountryLevels(campaign).br,10);
  assert.equal(v1CountryLevels(campaign).jp,0);
  assert.equal(v1SpecialConfig(campaign).primary,'br');
  assert.equal(v1CombatStats(campaign).koreaContinuous,false);
});

test('menu de testes realmente envia toda a combinação ao combate e reinício',()=>{
  assert.match(menuSource,/changeV1LabLevel\(this\.levels,country,delta\)/);
  assert.match(menuSource,/this\.rows\.push/);
  assert.match(menuSource,/v1LabLevels:build\.labLevels/);
  assert.match(menuSource,/v1LabPrimary:build\.labPrimary/);
  assert.match(sceneSource,/if\(v1Lab\)this\.combatCampaign=v1Lab/);
  assert.match(sceneSource,/v1LabLevels:\{\.\.\.this\.v1LabLevels\}/);
});

test('laser contínuo coreano tolera bombas removidas durante o mesmo quadro',()=>{
  const start=sceneSource.indexOf('  fireLightstickBeam(angle, drawFlash = true) {');
  const end=sceneSource.indexOf('  drawEncoreContinuousBeam(',start);
  assert.ok(start>=0 && end>start);
  const method=sceneSource.slice(start,end);
  assert.match(method,/if \(!bullet\?\.sprite\?\.active\) continue/);
  // Executa o método real com Phaser e geometria substituídos por stubs.
  // Ao destruir uma bomba colossal, ela pode esvaziar a lista inteira.
  const factory=new Function('CANNON','PLASMA_RANGE','PLASMA_HALF_WIDTH',
    'hitDiscoGlobe','laserHitsTarget','detonateType6Bomb',
    'return ({'+method+'});');
  let detonations=0;
  const obj=factory({x:480,y:494},700,7,()=>null,()=>true,(scene)=>{
    detonations++;
    scene.enemyBullets.splice(0);
  });
  obj.discoGlobes=[];
  obj.elapsed=12000;
  obj.enemies=[];
  obj.enemyBullets=[{sprite:{active:true,x:400,y:300},radius:7},
    {sprite:{active:true,x:460,y:250},radius:20,colossal:true}];
  obj.combat={residualSlash:false,laserDamage:6,koreaContinuous:true};
  obj.isV1Campaign=true;
  assert.doesNotThrow(()=>obj.fireLightstickBeam(Math.PI*1.5,false));
  assert.equal(detonations,1);
  assert.equal(obj.enemyBullets.length,0);
});
