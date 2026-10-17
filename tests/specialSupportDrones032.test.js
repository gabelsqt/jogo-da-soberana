import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chooseTowerAttackTarget } from '../src/gameplay/towers.js';
import { unlockedFourthUpgradeCountries } from '../src/gameplay/fourthUpgrades.js';

test('a arara brasileira e os minidrones chineses têm seletor de alvo importado', () => {
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  const towerImports = scene.match(/import \{([^}]+)\} from '\.\.\/gameplay\/towers\.js';/s)?.[1] ?? '';
  assert.match(towerImports, /\bchooseTowerAttackTarget\b/,
    'launchSpecialDrone precisa de chooseTowerAttackTarget importado para não travar');
  assert.match(scene, /launchSpecialDrone\(x, y, country\)\s*\{[\s\S]*?chooseTowerAttackTarget\(/);
  assert.match(scene, /this\.fourthIds\.includes\('br'\)\) this\.launchSpecialDrone\(x, y, 'br'\)/);
  assert.match(scene, /this\.fourthIds\.includes\('cn'\)/);
  assert.match(scene, /this\.launchSpecialDrone\(x \+ \(i - 1\) \* 18, y, 'cn'\)/);
});

test('seleção da arara encontra alvos ou retorna null quando não há naves', () => {
  const enemies = [
    { uid: 1, sprite: { x: 400, y: 170 } },
    { uid: 2, sprite: { x: 475, y: 250 } },
  ];
  assert.equal(chooseTowerAttackTarget(430, 250, enemies, 1050)?.uid, 2);
  assert.equal(chooseTowerAttackTarget(430, 250, [], 1050), null);
});

test('Brasil e China só disparam seus bônus especiais ao alcançar o nível 4', () => {
  for (const country of ['br', 'cn']) {
    assert.deepEqual(unlockedFourthUpgradeCountries({choices: Array(3).fill(country)}), []);
    assert.deepEqual(unlockedFourthUpgradeCountries({choices: Array(4).fill(country)}), [country]);
  }
});
