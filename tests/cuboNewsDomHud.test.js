import test from 'node:test';
import assert from 'node:assert/strict';
import {createCuboNewsHud,formatCuboTime} from '../src/ui/cuboNewsHud.js';

function mockEl(){
  const classes=new Set();
  return {
    hidden:false,style:{},dataset:{},title:'',textContent:'',offsetWidth:240,
    classList:{
      add(v){classes.add(v);},remove(v){classes.delete(v);},
      toggle(v,enabled){if(enabled)classes.add(v);else classes.delete(v);},
      contains(v){return classes.has(v);},
    },
  };
}
test('HUD DOM não cria sprites de Phaser, mantém cronômetro e some na saída da cena',()=>{
  const oldDoc=globalThis.document;
  const root=mockEl(),broadcast=mockEl(),version=mockEl();
  root.hidden=true;version.hidden=false;
  const headline=mockEl(),crawlOne=mockEl(),crawlTwo=mockEl(),crawlTrack=mockEl(),timer=mockEl();
  const els=new Map([
    ['cubo-news-overlay',root],['broadcast',broadcast],['build-version',version],
    ['#cubo-headline',headline],['#cubo-crawl-one',crawlOne],
    ['#cubo-crawl-two',crawlTwo],['#cubo-crawl-track',crawlTrack],['#cubo-time',timer],
  ]);
  root.querySelector=key=>els.get(key);
  globalThis.document={getElementById:key=>els.get(key)};
  const emitted=[],handlers={};
  const scene={
    game:{events:{emit(event){emitted.push(event);}}},
    events:{once(event,fn){handlers[event]=fn;}},
    time:{now:10000},
    sound:{context:{state:'suspended'}},
    add:{rectangle(){throw new Error('overlay não pode criar GameObjects');}},
  };
  try{
    const hud=createCuboNewsHud(scene);
    assert.equal(root.hidden,false);
    assert.equal(version.hidden,true);
    assert.equal(broadcast.dataset.cuboNews,'visible');
    assert.deepEqual(emitted,['cubo-layout-change']);
    hud.update(8900,30000,{headline:'CUBO NEWS PERGUNTA SOBRE FLAMENGO',subtitle:'Rio segue em alerta.'});
    assert.equal(timer.textContent,'00:22');
    assert.equal(headline.textContent,'CUBO NEWS PERGUNTA SOBRE FLAMENGO');
    assert.match(crawlOne.textContent,/Rio segue em alerta/);
    assert.equal(crawlOne.textContent,crawlTwo.textContent);
    assert.match(crawlTrack.style.animation,/cubo-scroll/);
    assert.equal(root.classList.contains('cubo-warning'),false);
    hud.update(26000,30000,{headline:'PLANTÃO',subtitle:'Fim iminente.'});
    assert.equal(timer.textContent,'00:04');
    assert.equal(root.classList.contains('cubo-warning'),true);
    hud.update(0,30000,null,{frozen:true});
    assert.equal(root.classList.contains('cubo-warning'),false);
    handlers.shutdown();
    assert.equal(root.hidden,true);
    assert.equal(version.hidden,false);
    assert.equal(broadcast.dataset.cuboNews,'hidden');
    assert.equal(emitted.length,2);
    hud.destroy();
    assert.equal(emitted.length,2,'destruir duas vezes não publica eventos extras');
    assert.equal(formatCuboTime(0),'00:00');
  }finally{
    if(oldDoc===undefined)delete globalThis.document;
    else globalThis.document=oldDoc;
  }
});
