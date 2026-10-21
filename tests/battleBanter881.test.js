import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {battleSpeakers,selectBattleBanter,createBattleBanterState,
 enqueueBattleBanter,currentBattleBanter,BANTER_DURATION_MS,BANTER_COOLDOWN_MS,
} from '../src/gameplay/battleBanter.js';
const game=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
test('Zeca aparece sempre e traição exclui representante do país traidor',()=>{
 assert.deepEqual(battleSpeakers(['us','ru'],'us'),['br','ru']);
 assert.deepEqual(battleSpeakers(['jp','us','cn'],'jp'),['br','us','cn']);
 assert.deepEqual(battleSpeakers(Array(10).fill('br')),['br']);
 for(let i=0;i<20;i++){
   const line=selectBattleBanter('danger',{choices:['br','us','ru'],traitor:'us',sequence:i});
   assert.notEqual(line.speaker,'us');
 }
 assert.equal(selectBattleBanter('arrival',{choices:['us','jp'],voyage:true}).speaker,'br');
});
test('falas são curtas, sem spam e desaparecem sozinhas',()=>{
 const state=createBattleBanterState();
 const context={choices:['us','br','ru'],traitor:'ru'};
 const first=enqueueBattleBanter(state,'start',context,1000);
 assert.equal(first.speaker,'br');
 assert.equal(first.name,'Zeca Carrara');
 assert.equal(currentBattleBanter(state,1000).text,first.text);
 assert.equal(currentBattleBanter(state,1000+BANTER_DURATION_MS),null);
 assert.equal(enqueueBattleBanter(state,'danger',context,1000+6500),null);
 const second=enqueueBattleBanter(state,'danger',context,1000+BANTER_COOLDOWN_MS);
 assert.ok(second);
 assert.notEqual(second.speaker,'ru');
});
test('UI de diálogo usa retratos existentes e região esquerda sem bloquear o mouse',()=>{
 assert.match(game,/assetUrl\('assets\/lideres\/'\+id\+'_personagem\.png'\)/);
 assert.match(game,/createBattleBanterPanel\(\)/);
 assert.match(game,/this\.add\.rectangle\(139,421,268,96/);
 assert.match(game,/this\.banterPortrait=this\.add\.image\(39,421/);
 assert.match(game,/updateBattleBanterPanel\(\)/);
 assert.match(game,/createDialogueTypewriter\(this,\{/);
 assert.match(game,/this\.banterWriter\.start\(this\.banterText,line\.text/);
 assert.match(game,/delay:28/);
 assert.match(game,/this\.queueBattleBanter\('danger'\)/);
 assert.match(game,/this\.queueBattleBanter\(this\.voyageActive\?'arrival':'start'\)/);
 assert.doesNotMatch(game,/text:'ZECA • PEDIR AJUDA'/);
 assert.match(game,/this\.add\.rectangle\(px\+13,py\+16,118,132/);
});
