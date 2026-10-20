import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  TYPE6_HULL_SHEET,type6HullFrame,type6HullUsesSheet,
} from '../src/gameplay/type6HullSprite.js';
import {createType6State} from '../src/gameplay/type6Boss.js';

const atlas=readFileSync(new URL('../public/assets/inimigos/tipo6/casco-alien.png',import.meta.url));
const scene=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
const encounter=readFileSync(new URL('../src/gameplay/type6Encounter.js',import.meta.url),'utf8');
const visual=readFileSync(new URL('../src/gameplay/type6Visual.js',import.meta.url),'utf8');

test('atlas Tipo 6 RGBA possui quatro quadros de casco sem mudar ancoragem',()=>{
 assert.equal(atlas.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(atlas.readUInt32BE(16),3360);
 assert.equal(atlas.readUInt32BE(20),280);
 assert.equal(atlas[24],8,'o atlas precisa ser 8 bits por canal');
 assert.equal(atlas[25],6,'o PNG é RGBA, não paleta indexada');
 assert.deepEqual(TYPE6_HULL_SHEET.frames,
  ['integro','avariado','nucleo_exposto','destruido']);
 assert.equal(TYPE6_HULL_SHEET.displayWidth,TYPE6_HULL_SHEET.frameWidth);
 assert.equal(TYPE6_HULL_SHEET.displayHeight,TYPE6_HULL_SHEET.frameHeight);
});

test('fases do casco sincronizadas com módulos, núcleo e derrota',()=>{
 const boss=createType6State('alien',600);
 assert.equal(type6HullFrame(boss),0);
 boss.modules[0].broken=true;
 assert.equal(type6HullFrame(boss),0,'1 módulo destruído mantém casco íntegro');
 boss.modules[1].broken=true;
 assert.equal(type6HullFrame(boss),1,'2 módulos destruídos avariam o casco');
 boss.modules[2].broken=true;
 assert.equal(type6HullFrame(boss),1);
 boss.modules[3].broken=true;
 boss.coreExposed=true;
 assert.equal(type6HullFrame(boss),2,'núcleo exposto mostra a carcaça aberta');
 boss.defeated=true;
 assert.equal(type6HullFrame(boss),3,'morte usa imagem destruída');
});

test('sprite novo é exclusivo do Tipo 6 alienígena e outros países mantêm visual',()=>{
 for(const country of ['us','ru','cn','jp'])
  assert.equal(type6HullUsesSheet(createType6State(country),true),false);
 assert.equal(type6HullUsesSheet(createType6State('alien'),true),true);
 assert.equal(type6HullUsesSheet(createType6State('alien'),false),false);
 assert.match(scene,/this\.load\.spritesheet\(TYPE6_HULL_SHEET\.key/);
 assert.match(encounter,/if\(hullSprite\)sprite\.add\(hullSprite\)/);
 assert.match(encounter,/sprite\.add\(graphics\)/);
 assert.match(encounter,/enemy\.hullSprite\.setFrame\(phase\)/);
 assert.match(encounter,/drawType6Ship\(enemy\.graphics,s,scene\.time\.now,!!enemy\.hullSprite\)/);
 assert.match(visual,/if\(!useHullSprite\)/);
 assert.match(visual,/if\(useHullSprite&&state\.defeated\)return/);
});

test('casco sprite não muda os retângulos colidíveis de módulos e núcleo',()=>{
 const boss=createType6State('alien',600);
 assert.deepEqual(boss.modules.map(m=>m.offsetX),[-255,-87,87,255]);
 assert.ok(boss.modules.every(m=>m.halfWidth===57&&m.halfHeight===42));
 assert.match(encounter,/enemy\.hullSprite\.setPosition\(shakeX,shakeY\)/);
 assert.match(encounter,/não mover o contêiner/);
});
