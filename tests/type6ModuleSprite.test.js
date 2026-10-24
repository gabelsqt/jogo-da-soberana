import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createType6State} from '../src/gameplay/type6Boss.js';
import {TYPE6_MODULE_SHEET,type6ModuleFrame,type6ModuleUsesSheet,type6ModuleDamageFrame,
 type6ModuleEnergyActive,type6CoreEnergyActive,type6ModuleWhiteFlash,
 TYPE6_MODULE_WHITE_FLASH_MS,TYPE6_MODULE_FLASH_RETRIGGER_MS}
  from '../src/gameplay/type6ModuleSprite.js';
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const encounter=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
const visual=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');
const atlas=readFileSync(new URL('../public/assets/inimigos/tipo6/modulos-alien.png',import.meta.url));
test('atlas carregado pelo jogo tem PNG RGBA e 28 células de 212×260',()=>{
 assert.equal(atlas.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(atlas.readUInt32BE(16),TYPE6_MODULE_SHEET.frameWidth*TYPE6_MODULE_SHEET.columns);
 assert.equal(atlas.readUInt32BE(20),TYPE6_MODULE_SHEET.frameHeight*TYPE6_MODULE_SHEET.rows);
 assert.equal(atlas[24],8,'atlas usa 8 bits por canal');
 assert.equal(atlas[25],6,'atlas é RGBA, preservando transparência');
 assert.match(scene,/assets\/inimigos\/tipo6\/modulos-alien\.png/);
});
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

// v0.854: sucção apenas na ativação e flash no PNG (não na hitbox).
test('módulos em repouso, com barreira pronta ou durante a entrada não sugam energia',()=>{
 const s=createType6State('alien'),[bomb,laser,hangar,generator]=s.modules;
 assert.ok(s.modules.every(m=>!type6ModuleEnergyActive(s,m,100)));
 s.introComplete=true;
 assert.ok(s.modules.every(m=>!type6ModuleEnergyActive(s,m,100)));
 s.barrier.active=true;s.barrier.hp=s.barrier.maxHp;
 assert.equal(type6ModuleEnergyActive(s,generator,100),false,
   'gerador não suga energia ininterruptamente enquanto barreira estiver ligada');
 assert.equal(type6CoreEnergyActive(s),false);
 s.action={kind:'laserCharge',moduleId:laser.id,elapsed:0};
 assert.equal(type6ModuleEnergyActive(s,laser,100),true);
 for(const m of [bomb,hangar,generator])assert.equal(type6ModuleEnergyActive(s,m,100),false);
 s.action.kind='laserFire';
 assert.equal(type6ModuleEnergyActive(s,laser,100),true);
 s.action=null;
 assert.equal(type6ModuleEnergyActive(s,laser,100),false);
});
test('absorção ativa durante bomba, lançamento, recarga de barreira e breve pós-disparo',()=>{
 const s=createType6State('alien');
 s.introComplete=true;
 for(const [id,kind] of [[0,'bomb'],[2,'hangar'],[3,'barrier']]){
   s.action={kind,moduleId:id,elapsed:0};
   assert.equal(type6ModuleEnergyActive(s,s.modules[id],100),true,kind);
   s.action=null;
 }
 const bomb=s.modules[0];
 bomb.activeUntil=480;
 assert.equal(type6ModuleEnergyActive(s,bomb,400),true);
 assert.equal(type6ModuleEnergyActive(s,bomb,480),false);
 bomb.broken=true;
 assert.equal(type6ModuleEnergyActive(s,bomb,400),false);
 s.coreExposed=true;s.charging=true;
 assert.equal(type6CoreEnergyActive(s),true);
 assert.equal(type6ModuleEnergyActive(s,s.modules[2],400),false);
 s.defeated=true;
 assert.equal(type6CoreEnergyActive(s),false);
});
test('flash branco usa somente o sprite, dura 90 ms e respeita descanso sob tiros rápidos',()=>{
 const s=createType6State('alien'),m=s.modules[0];
 assert.equal(type6ModuleWhiteFlash(m,100),false);
 m.spriteFlashStartedAt=200;
 assert.equal(type6ModuleWhiteFlash(m,199),false);
 assert.equal(type6ModuleWhiteFlash(m,200),true);
 assert.equal(type6ModuleWhiteFlash(m,200+TYPE6_MODULE_WHITE_FLASH_MS-1),true);
 assert.equal(type6ModuleWhiteFlash(m,200+TYPE6_MODULE_WHITE_FLASH_MS),false);
 assert.ok(TYPE6_MODULE_FLASH_RETRIGGER_MS>=TYPE6_MODULE_WHITE_FLASH_MS*2);
 assert.match(encounter,/art\.setTintFill\(0xffffff\)/);
 assert.match(encounter,/else art\.clearTint\(\)/);
 assert.match(encounter,/module\.spriteFlashStartedAt=scene\.time\.now/);
 assert.doesNotMatch(visual,/fillRoundedRect\(x-54,y-39,108,78,5\).*flash/);
 assert.match(visual,/if\(!useModuleSprites\)\{/);
 assert.match(visual,/type6ModuleEnergyActive\(state,module,ageMs\)/);
 assert.match(visual,/if\(type6CoreEnergyActive\(state\)\)/);
});
