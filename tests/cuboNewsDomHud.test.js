import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCuboNewsHud,formatCuboTime,formatCuboHeadline,
  DAWN_HOLD_MS,DAWN_TRAVEL_MS,DAWN_WORLD_ZOOM,
} from '../src/ui/cuboNewsHud.js';

function mockEl(rect={left:0,top:0,width:140,height:94}){
  const classes=new Set(),attrs={};const paint=[];
  return {
    hidden:false,style:{},dataset:{},title:'',textContent:'',offsetWidth:240,
    width:1,height:1,getContext(){return {fillStyle:'',imageSmoothingEnabled:true,
      fillRect(x,y,w,h){paint.push([x,y,w,h]);}};},
    paint,
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
test('Cubo News: manchetes aparecem em caixa mista e termos brasileiros preservados',()=>{
  assert.equal(formatCuboHeadline('CUBO NEWS CELEBRA O BRASIL'),'Cubo News celebra o Brasil');
  assert.equal(formatCuboHeadline('CBF EXIGE RESPOSTA DOS ETs'),'CBF exige resposta dos ETs');
  assert.equal(formatCuboHeadline('O Brasil segue confiante'),'O Brasil segue confiante');
  assert.equal(formatCuboTime(30000),'30');
});
test('HUD de televisão IBM Plex Sans e zoom não criam GameObjects de interface',()=>{
  const previousDocument=globalThis.document;
  const root=mockEl(),broadcast=mockEl(),version=mockEl();
  root.hidden=true;
  const headline=mockEl(),headlinePixels=mockEl(),labelPixels=mockEl();
  const crawl=mockEl(),crawlOne=mockEl(),crawlTwo=mockEl(),crawlOnePixels=mockEl();
  const crawlTwoPixels=mockEl(),crawlTrack=mockEl(),timer=mockEl();
  const timerReader=mockEl(),timerPixels=mockEl({left:820,top:500,width:164,height:96});
  const intro=mockEl(),introNumber=mockEl({left:305,top:190,width:350,height:240});
  const introLabel=mockEl();intro.hidden=true;
  const elements=new Map([
    ['cubo-news-overlay',root],['broadcast',broadcast],['build-version',version],
    ['#cubo-headline',headline],['#cubo-headline-pixels',headlinePixels],
    ['#cubo-label-pixels',labelPixels],['.cubo-crawl',crawl],
    ['#cubo-crawl-one',crawlOne],['#cubo-crawl-two',crawlTwo],
    ['#cubo-crawl-one-pixels',crawlOnePixels],['#cubo-crawl-two-pixels',crawlTwoPixels],
    ['#cubo-crawl-track',crawlTrack],['#cubo-time',timer],
    ['#cubo-time-reader',timerReader],['#cubo-time-pixels',timerPixels],
    ['#cubo-dawn-intro',intro],['#cubo-dawn-number',introNumber],
    ['#cubo-dawn-label',introLabel],
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
    tweens:{add(options){
      tweens.push(options);
      if(options.targets===camera){camera.zoom=options.zoom;return;}
      const t=options.targets;t.x=options.x;t.y=options.y;t.scale=options.scale;
      t.progress=0.85;options.onUpdate?.();
      t.progress=1;options.onUpdate?.();options.onComplete?.();
    }},
    sound:{context:{state:'suspended'}},
    add:{rectangle(){throw Error('HUD externo não cria sprites');}},
  };
  try{
    const hud=createCuboNewsHud(scene);
    assert.equal(root.hidden,false);
    assert.equal(timer.style.opacity,'0','relógio começa oculto até a transição');
    assert.equal(timer.style.visibility,'hidden');
    assert.equal(version.hidden,true);
    assert.equal(broadcast.dataset.cuboNews,'visible');
    assert.equal(introLabel.textContent,'Tempo até o amanhecer');
    assert.equal(root.hidden,false);
    hud.update(8900,30000,{
      headline:'CUBO NEWS PERGUNTA SOBRE FLAMENGO',
      subtitle:'Cristo continua de braços abertos.',
    });
    assert.equal(timerReader.textContent,'22');
    assert.equal(timer.getAttribute('aria-label'),'Tempo restante: 22 segundos');
    assert.equal(headline.textContent,'Cubo News pergunta sobre Flamengo');
    assert.equal(headline.title,'Cubo News pergunta sobre Flamengo');
    assert.equal(timer.style.color,'');
    assert.match(crawlOne.textContent,/Cristo continua/);
    assert.equal(crawlOne.textContent,crawlTwo.textContent);
    assert.equal(crawl.getAttribute('aria-label'),'Cristo continua de braços abertos.');
    assert.match(crawlTrack.style.animation,/cubo-scroll/);
    let started=0;
    hud.beginDawnIntro(30000,()=>started++);
    assert.equal(intro.hidden,false);
    assert.equal(introNumber.textContent,'30');
    assert.equal(camera.zoom,DAWN_WORLD_ZOOM);
    assert.equal(timer.style.opacity,'0');
    assert.equal(later.length,1);
    assert.equal(later[0].delay,DAWN_HOLD_MS);
    assert.equal(started,0);
    later[0].fn();
    assert.equal(tweens.length,2);
    assert.equal(tweens[0].targets,camera);
    assert.equal(tweens[0].duration,DAWN_TRAVEL_MS);
    assert.equal(started,1);
    assert.equal(camera.zoom,1);
    assert.equal(intro.hidden,true);
    assert.equal(timer.style.opacity,'1','relógio não pisca na chegada');
    assert.equal(timer.style.visibility,'visible');
    hud.update(26000,30000,{headline:'AMANHECER!',subtitle:'O acordo segue válido.'});
    assert.equal(timerReader.textContent,'4');
    assert.equal(root.classList.contains('cubo-warning'),true);
    hud.update(0,30000,null,{frozen:true});
    assert.equal(root.classList.contains('cubo-warning'),false);
    hud.beginDawnIntro(60000,()=>started++);
    assert.equal(camera.zoom,DAWN_WORLD_ZOOM);
    handlers.shutdown();
    assert.equal(camera.zoom,1);
    assert.equal(root.hidden,true);
    assert.equal(version.hidden,false);
    assert.equal(broadcast.dataset.cuboNews,'hidden');
    assert.equal(emitted.length,2);
    hud.destroy();
    assert.equal(emitted.length,2);
  }finally{
    if(previousDocument===undefined)delete globalThis.document;
    else globalThis.document=previousDocument;
  }
});
