import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_SUPPORT_TOWERS,
  normalizeCampaignState,
  countryLevel,
  unlockedFirstUpgrades,
  unlockedSecondUpgrades,
  activeTowerCountries,
  nextUpgradeOptions,
  chooseCampaignUpgrade,
  nextWaveAfterChoice,
} from '../src/gameplay/progression.js';
import {
  TOWER_DEFINITIONS,
  SUPPORT_TOWER_POSITIONS,
  towerDefinition,
  chooseTowerAttackTarget,
  canInstallTower,
} from '../src/gameplay/towers.js';
import { getWaveEvents, MODES, scheduledEnemyCount } from '../src/gameplay/waves.js';

test('campanha registra escolhas independentes por país e mantém progressão global', () => {
  const initial = normalizeCampaignState();
  assert.deepEqual(initial, { choices: [] });
  assert.deepEqual(unlockedFirstUpgrades(initial), []);
  assert.deepEqual(unlockedSecondUpgrades(initial), []);
  assert.deepEqual(activeTowerCountries(initial), []);
  assert.ok(nextUpgradeOptions(initial).every((option) => option.level === 1 && !option.locked));
  const first = chooseCampaignUpgrade(initial, 'br');
  assert.deepEqual(first, { choices: ['br'] });
  assert.equal(nextWaveAfterChoice(first), 'wave1');
  assert.deepEqual(unlockedFirstUpgrades(first), ['br']);
  assert.deepEqual(unlockedSecondUpgrades(first), []);
  assert.equal(countryLevel(first, 'br'), 1);
  assert.equal(countryLevel(first, 'us'), 0);
  assert.equal(nextUpgradeOptions(first).find((option) => option.id === 'br').level, 2);
  assert.equal(nextUpgradeOptions(first).find((option) => option.id === 'us').level, 1);
  assert.deepEqual(initial.choices, [], 'as escolhas anteriores não podem ser mutadas');
});

test('segunda escolha repetida libera melhoria de nível 2 e Onda 2, SEM instalar animal', () => {
  const titles = {
    br: 'Gambiarra Balística II',
    us: 'Dano Colateral',
    jp: 'Encore!',
    ru: 'Recuo Estratégico',
    cn: 'Compre 2, Leve 3',
  };
  for (const country of ['br', 'us', 'jp', 'ru', 'cn']) {
    const first = chooseCampaignUpgrade({}, country);
    const option = nextUpgradeOptions(first).find((item) => item.id === country);
    assert.equal(option.level, 2);
    assert.equal(option.title, titles[country]);
    assert.equal(option.locked, false);
    assert.equal(option.tower, false);
    const second = chooseCampaignUpgrade(first, country);
    assert.deepEqual(second.choices, [country, country]);
    assert.equal(nextWaveAfterChoice(second), 'wave2');
    assert.deepEqual(unlockedFirstUpgrades(second), [country]);
    assert.deepEqual(unlockedSecondUpgrades(second), [country]);
    assert.deepEqual(activeTowerCountries(second), []);
    assert.equal(countryLevel(second, country), 2);
  }
});

test('primeira torre aparece apenas na QUINTA escolha do país', () => {
  for (const country of ['br', 'us', 'jp', 'ru', 'cn']) {
    const choices = [country, country, country, country];
    assert.equal(nextUpgradeOptions({choices:[country,country]}).find(x=>x.id===country).tower, false);
    assert.equal(nextUpgradeOptions({choices:[country,country,country]}).find(x=>x.id===country).tower, false);
    const option = nextUpgradeOptions({choices}).find(item => item.id === country);
    assert.equal(option.level, 5);
    assert.equal(option.tower, true);
    assert.equal(option.locked, false);
    assert.deepEqual(activeTowerCountries({choices}), []);
    assert.deepEqual(activeTowerCountries({choices:[...choices,country]}), [country]);
  }
});

test('trocar de aliado acumula primeiras melhorias sem pular o nível 2 de cada país', () => {
  const first = chooseCampaignUpgrade({}, 'jp');
  const second = chooseCampaignUpgrade(first, 'cn');
  assert.deepEqual(unlockedFirstUpgrades(second), ['jp', 'cn']);
  assert.deepEqual(unlockedSecondUpgrades(second), []);
  assert.deepEqual(activeTowerCountries(second), []);
  assert.equal(nextWaveAfterChoice(second), 'wave2');
  assert.equal(countryLevel(second, 'jp'), 1);
  assert.equal(countryLevel(second, 'cn'), 1);
});

test('bloqueia a terceira torre no nível 5, mantendo outros upgrades', () => {
  const two = { choices: [...Array(5).fill('br'), ...Array(5).fill('us')] };
  assert.equal(MAX_SUPPORT_TOWERS, 2);
  assert.deepEqual(activeTowerCountries(two), ['br','us']);
  assert.equal(chooseCampaignUpgrade(two, 'jp'), null, 'a campanha tem dez escolhas');
  assert.equal(nextUpgradeOptions(two).find(item => item.id === 'jp').level, 1);
  assert.equal(nextUpgradeOptions(two).find(item => item.id === 'br').level, 6);
  assert.equal(canInstallTower(['br','us'],'jp'), false);
  assert.equal(canInstallTower(['br','us'],'br'), true);
});

test('cada torre tem arma própria, defesa independente e alvos dentro do alcance', () => {
  assert.equal(SUPPORT_TOWER_POSITIONS.length, 2);
  assert.deepEqual(Object.keys(TOWER_DEFINITIONS), ['br', 'us', 'jp', 'ru', 'cn']);
  assert.deepEqual(new Set(Object.values(TOWER_DEFINITIONS).map((t) => t.type)),
    new Set(['bullet', 'missile', 'laser', 'shell', 'drone']));
  for (const tower of Object.values(TOWER_DEFINITIONS)) {
    assert.ok(tower.healthMax > 0);
    assert.ok(tower.shieldMax > 0);
    assert.ok(tower.interval > 0);
    assert.ok(tower.range > 100);
    assert.ok(tower.damage > 0);
  }
  const enemies = [
    { sprite: { x: 400, y: 160 } },
    { sprite: { x: 420, y: 390 } },
    { sprite: { x: 900, y: 495 } },
  ];
  assert.equal(chooseTowerAttackTarget(300, 450, enemies, 300), enemies[1]);
  assert.equal(chooseTowerAttackTarget(50, 450, enemies, 100), null);
  assert.equal(towerDefinition('desconhecido'), null);
});

test('Onda 2 mistura bombardeiros e caças com ataques de saturação', () => {
  const wave = getWaveEvents('wave2');
  assert.equal(MODES.wave2.title, 'ONDA 2');
  assert.ok(wave[0].at > 0 && wave[0].at < 500);
  assert.ok(wave.some((event) => event.type === 3));
  assert.ok(wave.some((event) => event.type === 4));
  assert.ok(wave.some((event) => event.type === 2 && event.pattern === 'orbit'));
  assert.ok(wave.some((event) => event.type === 1 && event.pattern === 'line'));
  assert.equal(scheduledEnemyCount(wave), 80);
  assert.equal(wave.at(-1).at, 19500);
});
