import test from 'node:test';
import assert from 'node:assert/strict';
import {createCuboNewsHud,formatCuboTime} from '../src/ui/cuboNewsHud.js';

function mockEl(rect={left:0,top:0,width:140,height:94}){
  const classes=new Set(),attrs={};
  const context={
    fillStyle:'',imageSmoothingEnabled:true,painted:[],
    fillRect(x,y,w,h){this.painted.push({x,y,w,h});},
  };
  return {
    hidden:false,style:{},dataset:{},title:'',textContent:'',offsetWidth:240,
    width:300,height:150,getContext(){return context;},
    getBoundingClientRect(){return rect;},
    setAttribute(k,v){attrs[k]=v;},getAttribute(k){return attrs[k];},
    classList:{
      add(...vs){for(const v of vs)classes.add(v);},
      remove(...vs){for(const v of vs)classes.delete(v);},
      toggle(v,enabled){if(enabled)classes.add(v);else classes.delete(v);},
      contains(v){return classes.has(v);},
    },
  };
}
test('HUD bitmap não cria Phaser sprites, timer fica fora da câmera e não usa 00:xx',()=>{
  const oldDoc=globalThis.document;
  const root=mockEl(),broadcast=mockEl(),version=mockEl();
  root.hidden=true;version.hidden=false;
  const headline=mockEl(),headlinePixels=mockEl(),labelPixels=mockEl();
  const crawl=mockEl(),crawlOne=mockEl(),crawlTwo=mockEl(),crawlTrack=mockEl();
  const crawlOnePixels=mockEl(),crawlTwoPixels=mockEl();
  const timer=mockEl(),timerReader=mockEl(),timerPixels=mockEl({left:800,top:490,width:155,height:93});
  const intro=mockEl(),introLabel=mockEl(),introNumber=mockEl({left:390,top:220,width:180,height:118});
  intro.hidden=true;
  const elements=new Map([
    ['cubo-news-overlay',root],['broadcast',broadcast],['build-version',version],
    ['#cubo-headline',headline],['#cubo-headline-pixels',headlinePixels],
    ['#cubo-label-pixels',labelPixels],['.cubo-crawl',crawl],
    ['#cubo-crawl-one',crawlOne],['#cubo-crawl-two',crawlTwo],
    ['#cubo-crawl-one-pixels',crawlOnePixels],['#cubo-crawl-two-pixels',crawlTwoPixels],
    ['#cubo-crawl-track',crawlTrack],['#cubo-time',timer],
    ['#cubo-time-reader',timerReader],['#cubo-time-pixels',timerPixels],
    ['#cubo-dawn-intro',intro],['#cubo-dawn-label',introLabel],
    ['#cubo-dawn-number',introNumber],
  ]);
  root.querySelector=key=>elements.get(key);
  broadcast.querySelector=key=>elements.get(key);
  globalThis.document={getElementById:key=>elements.get(key)};
  const emitted=[],handlers={},later=[];
  const scene={
    game:{events:{emit(event){emitted.push(event);}}},
    events:{once(event,fn){handlers[event]=fn;}},
    time:{now:10000,delayedCall(delay,fn){later.push({delay,fn});}},
    tweens:{add(options){
      const target=options.targets;
      target.x=options.x;target.y=options.y;target.scale=options.scale;
      options.onUpdate?.();options.onComplete?.();
    }},
    sound:{context:{state:'suspended'}},
    add:{rectangle(){throw new Error('HUD externo não deve criar GameObjects');}},
  };
  try{
    const hud=createCuboNewsHud(scene);
    assert.equal(root.hidden,false);
    assert.equal(version.hidden,true);
    assert.equal(broadcast.dataset.cuboNews,'visible');
    assert.deepEqual(emitted,['cubo-layout-change']);
    hud.update(8900,30000,{
      headline:'CUBO NEWS PERGUNTA SOBRE FLAMENGO',
      subtitle:'Cristo continua de braços abertos.',
    });
    assert.equal(timerReader.textContent,'22');
    assert.equal(timer.getAttribute('aria-label'),'Tempo restante: 22 segundos');
    assert.equal(headline.textContent,'CUBO NEWS PERGUNTA SOBRE FLAMENGO');
    assert.ok(headlinePixels.width>100);
    assert.ok(headlinePixels.getContext().painted.length>30);
    assert.match(crawlOne.textContent,/Cristo continua/);
    assert.equal(crawlOne.textContent,crawlTwo.textContent);
    assert.ok(crawlOnePixels.getContext().painted.length>10);
    assert.match(crawlTrack.style.animation,/cubo-scroll/);
    assert.equal(root.classList.contains('cubo-warning'),false);

    let started=0;
    hud.beginDawnIntro(30000,()=>started++);
    assert.equal(intro.hidden,false);
    assert.equal(root.classList.contains('cubo-intro-running'),true);
    assert.equal(introNumber.width>150,true);
    assert.equal(later.length,1);
    assert.equal(later[0].delay,980);
    assert.equal(started,0,'tempo da onda ainda congelado durante apresentação');
    later[0].fn(); // Tween desloca o número até o cronômetro à direita.
    assert.equal(started,1);
    assert.equal(intro.hidden,true);
    assert.equal(root.classList.contains('cubo-intro-running'),false);
    assert.match(introNumber.style.transform,/^$/);

    hud.update(26000,30000,{headline:'AMANHECER!',subtitle:'Acordo com ETs continua.'});
    assert.equal(timerReader.textContent,'4');
    assert.equal(root.classList.contains('cubo-warning'),true);
    hud.update(0,30000,null,{frozen:true});
    assert.equal(root.classList.contains('cubo-warning'),false);
    handlers.shutdown();
    assert.equal(root.hidden,true);
    assert.equal(version.hidden,false);
    assert.equal(broadcast.dataset.cuboNews,'hidden');
    assert.equal(emitted.length,2);
    hud.destroy();
    assert.equal(emitted.length,2);
    assert.equal(formatCuboTime(0),'0');
  }finally{
    if(oldDoc===undefined)delete globalThis.document;
    else globalThis.document=oldDoc;
  }
});
