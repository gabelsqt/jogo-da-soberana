import test from 'node:test';
import assert from 'node:assert/strict';
import {CHINA_TRANSITION_MS,chinaLineFocus,chinaLineDuration,
  chinaLineShotInterval,chinaLineShotAngle} from '../src/gameplay/chinaLineVolley.js';
import {koreanSalvoAngles,nextKoreanRicochet,koreanRicochetDamage,
  koreanSalvoStats} from '../src/gameplay/koreanLaserSalvo.js';

test('China forms a straight line over 1.5s and separates over 1.5s',()=>{
  assert.equal(CHINA_TRANSITION_MS,1500);
  assert.equal(chinaLineDuration(3500),6500);
  assert.equal(chinaLineFocus(0,3500),0);
  assert.equal(chinaLineFocus(750,3500),.5);
  assert.equal(chinaLineFocus(1500,3500),1);
  assert.equal(chinaLineFocus(5000,3500),1);
  assert.equal(chinaLineFocus(5750,3500),.5);
  assert.equal(chinaLineFocus(6500,3500),0);
  for(let n=0;n<10;n++)
    assert.equal(chinaLineShotAngle(-Math.PI/2,1,n),-Math.PI/2);
  assert.notEqual(chinaLineShotAngle(-Math.PI/2,0,0),
    chinaLineShotAngle(-Math.PI/2,0,4));
});
test('China releases individual physical bullets at a capped interval',()=>{
  assert.equal(chinaLineShotInterval(300,2,false,.5,1),150);
  assert.equal(chinaLineShotInterval(300,2,false,.5,.8),120);
  assert.equal(chinaLineShotInterval(240,10,true,.5,1),30);
  assert.equal(chinaLineShotInterval(300,2,true,.5,1),100);
});
test('Korean salvos are physical individual angles, with finite rebounds',()=>{
  assert.equal(koreanSalvoAngles(-Math.PI/2,3).length,3);
  assert.equal(koreanSalvoAngles(-Math.PI/2,9).length,9);
  assert.equal(koreanSalvoAngles(0,1)[0],0);
  assert.deepEqual(koreanSalvoStats(4,true),{
    count:9,bounces:4,bounceRange:320,retention:.7,
  });
  assert.equal(koreanRicochetDamage(4,.7),2.8);
  assert.equal(koreanRicochetDamage(4,.7)*.7,1.9599999999999997);
});
test('Korean ricochet never selects same enemy twice, boss or an out-of-range enemy',()=>{
  const enemy=(uid,x,y,type=1)=>({uid,type,sprite:{x,y,active:true}});
  const enemies=[enemy('hit',0,0),enemy('far',900,0),enemy('boss',8,0,6),enemy('next',110,0)];
  assert.equal(nextKoreanRicochet(0,0,enemies,new Set(['hit']),200).uid,'next');
  assert.equal(nextKoreanRicochet(0,0,enemies,new Set(['hit','next']),200),null);
});
