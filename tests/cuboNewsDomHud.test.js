import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCuboNewsHud,formatCuboTime,
  DAWN_HOLD_MS,DAWN_TRAVEL_MS,DAWN_WORLD_ZOOM,
} from '../src/ui/cuboNewsHud.js';

function mockEl(rect={left:0,top:0,width:140,height:94}){
  const classes=new Set(),attrs={};
  return {
    hidden:false,style:{},dataset:{},title:'',textContent:'',offsetWidth:240,
    getBoundingClientRect(){return rect;},
    setAttribute(k,v){attrs[k]=v;},
    getAttribute(k){return attrs[k];},
    classList:{
      add(...vs){for(const v of vs)classes.add(v);},
      remove(...vs){for(const v of vs)classes.delete(v);},
      toggle(v,enabled){if(enabled)classes.add(v);else classes.delete(v);},
      contains(v){return classes.has(v);},
    },
  };
}
test('Cubo News legível, relógio DOM fixo, abertura com pullback cinematográfico',()=>{
  const oldDoc=globalThis.document;
  const root=mockEl(),broadcast=mockEl(),version=mockEl();
  root.hidden=true;version.hidden=false;
  const headline=mockEl(),crawl=mockEl(),crawlOne=mockEl(),crawlTwo=mockEl();
  const crawlTrack=mockEl(),timer=mockEl(),timerReader=mockEl({
    left:820,top:500,width:120,height:88,
  });
  const intro=mockEl(),introNumber=mockEl({left:305,top:190,width:350,height:240});
  intro.hidden=true;
  const elements=new Map([
    ['cubo-news-overlay',root],['broadcast',broadcast],['build-version',version],
    ['#cubo-headline',headline],['.cubo-crawl',crawl],
    ['#cubo-crawl-one',crawlOne],['#cubo-crawl-two',crawlTwo],
    ['#cubo-crawl-track',crawlTrack],['#cubo-time',timer],
    ['#cubo-time-reader',timerReader],
    ['#cubo-dawn-intro',intro],['#cubo-dawn-number',introNumber],
  ]);
  root.querySelector=key=>elements.get(key);
  broadcast.querySelector=key=>elements.get(key);
  globalThis.document={getElementById:key=>elements.get(key)};
  const emitted=[],handlers={},later=[],tweens=[],camera={zoom:1,setZoom(n){this.zoom=n;}};
  const scene={
    game:{events:{emit(event){emitted.push(event);}}},
    events:{once(event,fn){handlers[event]=fn;}},
    time:{now:10000,delayedCall(delay,fn){later.push({delay,fn});}},
    cameras:{main:camera},
    tweens:{add(options){tweens.push(options);
      if(options.targets===camera){camera.zoom=options.zoom;return;}
      const motion=options.targets;
      motion.x=options.x;motion.y=options.y;motion.scale=options.scale;
      motion.progress=0.85;options.onUpdate?.();
      motion.progress=1;options.onUpdate?.();
      options.onComplete?.();
    }},
    sound:{context:{state:'suspended'}},
    add:{rectangle(){throw Error('HUD DOM não pode criar GameObjects');}},
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
    assert.match(crawlOne.textContent,/Cristo continua/);
    assert.equal(crawlOne.textContent,crawlTwo.textContent);
    assert.match(crawlTrack.style.animation,/cubo-scroll/);
    assert.equal(root.classList.contains('cubo-warning'),false);

    let started=0;
    hud.beginDawnIntro(30000,()=>started++);
    assert.equal(intro.hidden,false);
    assert.equal(introNumber.textContent,'30');
    assert.equal(root.classList.contains('cubo-intro-running'),true);
    assert.equal(camera.zoom,DAWN_WORLD_ZOOM);
    assert.equal(timer.style.opacity,'0');
    assert.equal(later.length,1);
    assert.ok(DAWN_HOLD_MS>980);
    assert.equal(later[0].delay,DAWN_HOLD_MS);
    assert.equal(started,0,'o tempo não começa durante a apresentação');
    later[0].fn();
    assert.equal(tweens.length,2,'câmera recua em paralelo ao número');
    assert.equal(tweens[0].targets,camera);
    assert.equal(tweens[0].duration,DAWN_TRAVEL_MS);
    assert.equal(tweens[1].duration,DAWN_TRAVEL_MS);
    assert.equal(started,1);
    assert.equal(camera.zoom,1);
    assert.equal(intro.hidden,true);
    assert.equal(root.classList.contains('cubo-intro-running'),false);
    assert.equal(introNumber.style.transform,'');
    assert.equal(timer.style.opacity,'');

    hud.update(26000,30000,{headline:'AMANHECER!',subtitle:'Acordo com ETs continua.'});
    assert.equal(timerReader.textContent,'4');
    assert.equal(root.classList.contains('cubo-warning'),true);
    hud.update(0,30000,null,{frozen:true});
    assert.equal(root.classList.contains('cubo-warning'),false);

    hud.beginDawnIntro(60000,()=>started++);
    assert.equal(camera.zoom,DAWN_WORLD_ZOOM);
    handlers.shutdown();
    assert.equal(camera.zoom,1,'zoom volta ao normal se a cena encerrar na abertura');
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
