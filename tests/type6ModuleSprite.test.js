import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createType6State} from '../src/gameplay/type6Boss.js';
import {TYPE6_MODULE_SHEET,type6ModuleFrame,type6ModuleUsesSheet,type6ModuleDamageFrame}
  from '../src/gameplay/type6ModuleSprite.js';
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const encounter=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
const visual=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');
test('tipo 6: atlas possui quatro linhas por sete quadros, com âncora estável',()=>{
 assert.equal(TYPE6_MODULE_SHEET.frameWidth*7,1484);
 assert.equal(TYPE6_MODULE_SHEET.frameHeight*4,1040);
 assert.ok(TYPE6_MODULE_SHEET.bodyOriginY>0.5);
 assert.deepEqual(TYPE6_MODULE_SHEET.stages,[
  'parado','carregando','ativo','avaria_1','avaria_2','avaria_3','destruido',
 ]);
});
test('sprites são exclusivos do alienígena e não mudam hitboxes',()=>{
 for(const c of ['us','ru','cn','jp'])
  assert.equal(type6ModuleUsesSheet(createType6State(c),true),false);
 const s=createType6State('alien');
 assert.equal(type6ModuleUsesSheet(s,true),true);
 assert.equal(type6ModuleUsesSheet(s,false),false);
 assert.deepEqual(s.modules.map(m=>m.offsetX),[-255,-87,87,255]);
 assert.ok(s.modules.every(m=>m.halfWidth===57&&m.halfHeight===42));
 assert.match(scene,/this\.load\.spritesheet\(TYPE6_MODULE_SHEET\.key/);
 assert.match(encounter,/if\(moduleSprites\.length\)sprite\.add\(moduleSprites\)/);
 assert.match(visual,/if\(!useModuleSprites\)/);
});
test('todos os quatro módulos usam seus próprios grupos de frames',()=>{
 const s=createType6State('alien');
 assert.deepEqual(s.modules.map(m=>type6ModuleFrame(s,m)),[0,14,7,21]);
 for(const m of s.modules){
  m.shield=0;m.hp=m.maxHp*0.60;
  assert.equal(type6ModuleDamageFrame(m),3);
  assert.equal(type6ModuleFrame(s,m),TYPE6_MODULE_SHEET.roleRows[m.role]*7+3);
  m.hp=m.maxHp*.25;
  assert.equal(type6ModuleDamageFrame(m),4);
  m.hp=m.maxHp*.10;
  assert.equal(type6ModuleDamageFrame(m),5);
  m.broken=true;
  assert.equal(type6ModuleFrame(s,m),TYPE6_MODULE_SHEET.roleRows[m.role]*7+6);
 }
});
test('carregamento, atividade e barreira selecionam os estados correspondentes',()=>{
 const s=createType6State('alien');
 const laser=s.modules[1];
 s.action={kind:'laserCharge',moduleId:laser.id,elapsed:0};
 assert.equal(type6ModuleFrame(s,laser),15);
 s.action.kind='laserFire';
 assert.equal(type6ModuleFrame(s,laser),16);
 s.action=null;
 s.modules[0].activeUntil=500;
 assert.equal(type6ModuleFrame(s,s.modules[0],250),2);
 assert.equal(type6ModuleFrame(s,s.modules[0],600),0);
 s.barrier.active=true;
 assert.equal(type6ModuleFrame(s,s.modules[3]),23);
});
