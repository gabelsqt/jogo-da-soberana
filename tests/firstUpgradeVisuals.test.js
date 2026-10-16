import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BRAZIL_ALTERNATING_SPREAD, brazilAlternatingAngle,
  shotVfxFor, shotVisualFor, shotAngles, combatStatsFor, combatStatsForLoadout,
} from '../src/gameplay/upgrades.js';

test('Brasil nível 1 tem +50% de cadência e mantém as outras estatísticas', () => {
  const base = combatStatsFor(null);
  const brazil = combatStatsFor('br');
  const combined = combatStatsForLoadout(['br']);
  assert.equal(base.basicInterval, 500);
  assert.equal(brazil.basicInterval, 333);
  assert.equal(combined.basicInterval, 333);
  assert.ok(Math.abs(base.basicInterval / combined.basicInterval - 1.5) < 0.003);
  assert.equal(brazil.brazilZigzag, true);
  assert.equal(combined.brazilZigzag, true);
  assert.equal(base.brazilZigzag, false);
  assert.equal(combined.basicDamage, base.basicDamage);
  assert.equal(combined.bulletsPerShot, 1);
  assert.equal(combatStatsForLoadout(['br', 'br']).basicInterval, 333,
    'não multiplica um país repetido duas vezes');
});

test('gambiarra alterna ângulo esquerda/direita, sem aleatoriedade', () => {
  const center = -Math.PI / 2;
  const actual = Array.from({ length: 6 }, (_, index) =>
    brazilAlternatingAngle(center, index + 1, true));
  assert.deepEqual(actual.map(a => Math.sign(a - center)), [-1, 1, -1, 1, -1, 1]);
  for (const angle of actual) {
    assert.ok(Math.abs(angle - center) <= BRAZIL_ALTERNATING_SPREAD + 0.000001);
    assert.ok(Math.abs(angle - center) > 0.04);
  }
  assert.equal(brazilAlternatingAngle(center, 1, false), center);
  assert.equal(brazilAlternatingAngle(center, 0, true), center);
  assert.equal(brazilAlternatingAngle(center, -1, true), center);
  assert.equal(brazilAlternatingAngle(center, 0.5, true), center);
  const leftLimit = -Math.PI + Math.PI / 12;
  const rightLimit = -Math.PI / 12;
  assert.equal(brazilAlternatingAngle(leftLimit, 1, true), leftLimit);
  assert.equal(brazilAlternatingAngle(rightLimit, 2, true), rightLimit);
});

test('spread chinês permanece simétrico em torno da alternância brasileira', () => {
  const center = -Math.PI / 2;
  for (let shots = 1; shots <= 6; shots++) {
    const alternated = brazilAlternatingAngle(center, shots, true);
    const pair = shotAngles(alternated, 2);
    assert.equal(pair.length, 2);
    assert.ok(Math.abs((pair[0] + pair[1]) / 2 - alternated) < 0.0000001);
    assert.ok(pair[0] < pair[1]);
    const triple = shotAngles(alternated, 3);
    assert.ok(Math.abs(triple[1] - alternated) < 0.0000001);
  }
});

test('os efeitos visuais RU e CN coexistem em builds multinacionais', () => {
  const base = shotVfxFor([]);
  assert.deepEqual(base, {
    heavy: false, multiple: false, improvised: false, fragments: false, recoil: 2,
  });
  const ru = shotVfxFor(['ru']);
  assert.equal(ru.heavy, true);
  assert.equal(ru.multiple, false);
  assert.equal(ru.recoil, 8);

  const cn = shotVfxFor(['cn']);
  assert.equal(cn.multiple, true);
  assert.equal(cn.heavy, false);
  assert.equal(cn.recoil, 3);

  const all = shotVfxFor(['br', 'us', 'jp', 'ru', 'cn']);
  assert.deepEqual(all, {
    heavy: true, multiple: true, improvised: true, fragments: true, recoil: 8,
  });

  const stats = combatStatsForLoadout(['br', 'us', 'jp', 'ru', 'cn']);
  assert.equal(stats.basicInterval, 333);
  assert.equal(stats.basicDamage, 1.75);
  assert.equal(stats.knockback, 0.12);
  assert.equal(stats.bulletsPerShot, 2);
  assert.equal(stats.fragmentation, true);
  assert.equal(stats.plasmaEvery, 3);
});

test('projéteis russos ficam um pouco maiores, sem afetar o calibre dos outros países', () => {
  const base = shotVisualFor([]);
  const previous = { width: 9, length: 14 };
  const ru = shotVisualFor(['ru']);
  assert.deepEqual({ width: ru.width, length: ru.length }, { width: 11, length: 17 });
  assert.ok(ru.width > previous.width && ru.length > previous.length);
  assert.ok(ru.width / previous.width < 1.3);
  assert.ok(ru.length / previous.length < 1.3);
  assert.deepEqual(shotVisualFor(['ru', 'cn']), ru);
  assert.deepEqual(shotVisualFor(['br', 'ru', 'cn']), ru);

  // A combinação com laser coreano preserva sua aparência violeta
  // e sua proporção longa, mas não perde a largura de munição russa.
  const korean = shotVisualFor(['jp']);
  const mix = shotVisualFor(['jp', 'ru']);
  assert.equal(mix.color, korean.color);
  assert.equal(mix.length, korean.length);
  assert.equal(mix.width, 11);

  for (const id of ['br', 'us', 'cn', 'jp']) {
    assert.deepEqual(shotVisualFor([id]), shotVisualFor([id]));
  }
  assert.equal(base.width, 5);
  assert.equal(base.length, 11);
  assert.equal(shotVisualFor(['us']).width, 8);
  assert.equal(shotVisualFor(['cn']).width, 6);
});

test('o aumento russo não modifica velocidade, dano ou alcance físico', () => {
  const before = combatStatsFor('ru');
  const combined = combatStatsForLoadout(['ru', 'cn']);
  assert.equal(before.basicDamage, 1.75);
  assert.equal(before.basicSpeed, 480);
  assert.equal(before.knockback, 0.12);
  assert.equal(combined.basicDamage, before.basicDamage);
  assert.equal(combined.basicSpeed, before.basicSpeed);
  assert.equal(combined.knockback, before.knockback);
  const scene = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(scene, /this\.add\.rectangle\(x, y, style\.width, style\.length, style\.color\)/);
  assert.match(scene, /enemyContactRadius\(enemy\.type\) \+ 7/,
    'colisão continua fixa, independente da largura do sprite');
});

test('rastro visual e recuo são puramente gráficos, com limpeza por bala', () => {
  const src = readFileSync(new URL('../src/scenes/GameScene.js', import.meta.url), 'utf8');
  assert.match(src, /brazilAlternatingAngle\(angle, nextShot, this\.combat\.brazilZigzag\)/);
  assert.match(src, /shotAngles\(aimed, this\.combat\.bulletsPerShot\)/);
  assert.match(src, /this\.firePlasmaKatana\(angle\)/,
    'laser coreano mantém a direção da mira original');
  assert.match(src, /drawProjectileTrail\(bullet\)/);
  assert.match(src, /bullet\.trail\?\.destroy\(\)/);
  assert.match(src, /showHeavyImpact\(x, y\)/);
  assert.match(src, /cannonRecoil \*= Math\.exp\(-19 \* dt\)/);
  assert.match(src, /this\.cameras\.main\.shake\(60, 0\.0011\)/);
  assert.match(src, /const shards = this\.add\.graphics\(\)/);
});
