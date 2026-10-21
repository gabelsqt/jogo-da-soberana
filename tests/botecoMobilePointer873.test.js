import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {botecoPrimaryPress} from '../src/ui/pointerPrimary.js';

test('mouse esquerdo, toque mobile e caneta/touch aceitam interação',()=>{
  assert.equal(botecoPrimaryPress({leftButtonDown:()=>true}),true);
  assert.equal(botecoPrimaryPress({leftButtonDown:()=>false,wasTouch:true}),true);
  assert.equal(botecoPrimaryPress({event:{pointerType:'touch'}}),true);
  assert.equal(botecoPrimaryPress({leftButtonDown:()=>false}),false);
  assert.equal(botecoPrimaryPress(null),false);
});
test('boteco usa o mesmo teste em retratos, botões e troca de diálogo',()=>{
  const source=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');
  assert.equal(source.split('botecoPrimaryPress(pointer)').length-1,4);
});
