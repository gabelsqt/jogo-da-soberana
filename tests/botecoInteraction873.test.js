import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const scene=readFileSync(new URL('../src/scenes/UpgradeScene.js',import.meta.url),'utf8');

test('painel nasce antes de seu handler, sem exception antes de exibir o boteco',()=>{
  const assigned=scene.indexOf('this.focusPanel=this.add.rectangle(');
  const handler=scene.indexOf("this.focusPanel.on('pointerdown'");
  assert.ok(assigned>=0 && handler>assigned,
    'referenciar o foco antes de sua criação trava a tela inteira');
  assert.doesNotMatch(scene,/this.focusPanel.setInteractive\(\).on/);
});

test('áreas invisíveis não bloqueiam retratos nem botões das propostas',()=>{
  assert.match(scene,/this.focusDim=this.add.rectangle[\s\S]*?\.setDepth\(33\)\.setVisible\(false\);/);
  assert.match(scene,/this\.acceptButton\.disableInteractive\(\);\s*this\.backButton\.disableInteractive\(\);/);
  assert.match(scene,/this\.focusDim\.setVisible\(true\)\.setInteractive\(\);/);
  assert.match(scene,/this\.focused=null;this\.focusDim\.disableInteractive\(\)\.setVisible\(false\);/);
  assert.match(scene,/this\.botecoOverlay\?\.destroy\(true\);this\.botecoOverlay=null;/);
  assert.match(scene,/this\.acceptButton\.setInteractive\(\{useHandCursor:true\}\)/);
});
