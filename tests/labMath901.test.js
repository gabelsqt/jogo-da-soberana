import test from 'node:test';
import assert from 'node:assert/strict';
import {LAB_BALANCE_FIELDS,LAB_BALANCE_DEFAULTS,normalizeLabBalance,
  emptyLabAllocation,normalizeLabAllocation,labLevelCounts,singleCountryAtTen} from '../src/gameplay/labBalanceProfile.js';
import {computeLabMath} from '../src/gameplay/labMathRuntime.js';

test('40 sequential P/S upgrades across 5 countries are registered',()=>{
  const combinations=new Set(LAB_BALANCE_FIELDS.map(f=>f.country+f.track+f.stage));
  assert.equal(combinations.size,40);
  assert.equal(Object.keys(LAB_BALANCE_DEFAULTS).length,LAB_BALANCE_FIELDS.length);
  assert.ok(LAB_BALANCE_FIELDS.length>=65);
});

test('balance JSON is clamped and cannot create invalid numbers',()=>{
  const values=normalizeLabBalance({'br.P1.heat':9000,'cn.S1.rateFactor':-20,'us.P4.damage':'2.5','unknown':15});
  assert.equal(values['br.P1.heat'],250);
  assert.equal(values['cn.S1.rateFactor'],.25);
  assert.equal(values['us.P4.damage'],2.5);
  assert.equal(values.unknown,undefined);
});

test('independent sequential allocations yield only one national level 10',()=>{
  const allocation=emptyLabAllocation();
  allocation.br.P=4;allocation.br.S=4;
  assert.equal(labLevelCounts(allocation,'br','br').br,10);
  assert.equal(singleCountryAtTen(labLevelCounts(allocation,'br','br'),'br','br'),'br');
  assert.equal(singleCountryAtTen(labLevelCounts(allocation,'br','cn'),'br','cn'),null);
  assert.equal(normalizeLabAllocation({br:{P:800,S:-2}}).br.P,4);
});

test('Laboratory applies editable math to primary and special independently',()=>{
  const allocation=emptyLabAllocation();
  allocation.cn.P=4;allocation.cn.S=4;
  const p=normalizeLabBalance({'cn.P4.intervalMs':190,'cn.S2.focusMs':5100,'cn.S1.rateFactor':.65});
  const {stats,extra,build,winner}=computeLabMath({
    profile:p,allocation,principal:'cn',especial:'cn',
  });
  assert.equal(stats.bulletsPerShot,10);
  assert.equal(stats.basicInterval,190);
  assert.equal(extra.cnFocusMs,4500); // Final nacional define transformação do tempo central.
  assert.equal(extra.cnRateFactor,.65);
  assert.equal(winner,'cn');
  assert.equal(build.primary,'cn');
  assert.equal(stats.ultimate,'cn');
});

test('mixed configurations have no supreme and preserve principal identity',()=>{
  const allocation=emptyLabAllocation();
  allocation.us.P=2;allocation.ru.S=3;
  const {stats,build,winner,extra}=computeLabMath({
    profile:LAB_BALANCE_DEFAULTS,allocation,principal:'br',especial:'cn',
  });
  assert.equal(winner,null);
  assert.equal(stats.ultimate,null);
  assert.equal(stats.usRocketRadius,0);
  assert.ok(extra.projectileRadiusMultiplier>1);
  assert.equal(build.primary,'cn');
  assert.equal(build.stages.cn,1);
  assert.equal(build.stages.ru,0);
});

test('live math edits change the actual combat values after recomputation',()=>{
  const allocation=emptyLabAllocation();
  allocation.br.P=2;allocation.br.S=2;
  const start=computeLabMath({profile:LAB_BALANCE_DEFAULTS,allocation,principal:'br',especial:'br'});
  const profile=normalizeLabBalance({'br.P2.damage':2.8,'br.S2.radius':200,'br.S2.fireworks':8});
  const changed=computeLabMath({profile,allocation,principal:'br',especial:'br'});
  assert.ok(changed.stats.basicDamage>start.stats.basicDamage);
  assert.equal(changed.extra.brBalloonRadius,200);
  assert.equal(changed.extra.brFireworks,8);
  assert.equal(changed.winner,null);
});

test('Korean P1–P4 turn lasers into finite ricocheting salvos',()=>{
  const allocation=emptyLabAllocation();allocation.jp.P=4;
  const lab=computeLabMath({profile:normalizeLabBalance({
    'jp.P4.bounces':5,'jp.P4.count':8,'jp.P4.range':410,
  }),allocation,principal:'jp',especial:'cn'});
  assert.equal(lab.extra.jpVolleyCount,8);
  assert.equal(lab.extra.jpBounces,5);
  assert.equal(lab.extra.jpBounceRange,410);
  assert.equal(lab.stats.plasmaEvery,0);
  assert.equal(lab.stats.koreaContinuous,false);
  assert.equal(lab.stats.residualSlash,false);
});

test('national Korean level 10 becomes a 9-laser holographic salvo, not continuous Lightstick',()=>{
  const allocation=emptyLabAllocation();allocation.jp.P=4;allocation.jp.S=4;
  const lab=computeLabMath({allocation,principal:'jp',especial:'jp'});
  assert.equal(lab.winner,'jp');
  assert.equal(lab.stats.basicInterval,160);
  assert.equal(lab.stats.koreaContinuous,false);
  assert.equal(lab.extra.jpVolleyCount,9);
  assert.equal(lab.stats.ultimate,'jp');
});
