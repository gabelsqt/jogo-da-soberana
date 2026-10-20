import test from 'node:test';
import assert from 'node:assert/strict';
import {cannonSpritePose,CANNON_BARREL_DISPLAY_SIZE} from '../src/gameplay/cannonSpriteAim.js';

test('o cano tem posição estável de pivô para todas as direções',()=>{
  for(const degrees of [-178,-160,-140,-112,-90,-68,-40,-20,-2]){
    const angle=degrees*Math.PI/180;
    const pose=cannonSpritePose(angle,480,479);
    assert.ok(pose.frame>=0&&pose.frame<=8);
    assert.equal(pose.pivotX,480);
    assert.equal(pose.pivotY,479);
    assert.ok(pose.originX>0&&pose.originX<1);
    assert.ok(pose.originY>0&&pose.originY<1);
    const dx=pose.muzzleX-pose.pivotX,dy=pose.muzzleY-pose.pivotY;
    assert.ok(Math.hypot(dx,dy)>48&&Math.hypot(dx,dy)<75);
    // A boca acompanha precisamente o mesmo ângulo do tiro.
    const cross=dx*Math.sin(angle)-dy*Math.cos(angle);
    assert.ok(Math.abs(cross)<1e-7, 'desalinhamento em '+degrees+' graus');
    assert.ok(dx*Math.cos(angle)+dy*Math.sin(angle)>0);
  }
  assert.deepEqual(CANNON_BARREL_DISPLAY_SIZE,{width:82,height:87});
});

test('quadro central olha para cima e quadros externos alcançam as laterais',()=>{
  assert.equal(cannonSpritePose(-Math.PI/2,0,0).frame,4);
  assert.equal(cannonSpritePose(-178*Math.PI/180,0,0).frame,0);
  assert.equal(cannonSpritePose(-2*Math.PI/180,0,0).frame,8);
});

test('recuo visual move pivô e boca sem alterar a distância entre ambos',()=>{
  const angle=-Math.PI/3;
  const normal=cannonSpritePose(angle,480,479,0);
  const recoil=cannonSpritePose(angle,480,479,7);
  assert.equal(recoil.frame,normal.frame);
  assert.ok(Math.abs(recoil.pivotX-normal.pivotX+Math.cos(angle)*7)<1e-9);
  assert.ok(Math.abs(recoil.muzzleX-normal.muzzleX+Math.cos(angle)*7)<1e-9);
  assert.ok(Math.abs(recoil.muzzleY-normal.muzzleY+Math.sin(angle)*7)<1e-9);
});
