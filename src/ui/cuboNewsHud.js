// Cubo News v0.46: interface HTML externa à câmera Phaser, fonte bitmap real.
// HUD 960x44 sob o canvas 960x540. Timer apenas em segundos, sem dois-pontos.
import {drawPixelText} from './pixelFont.js';

export function formatCuboTime(milliseconds){
  return String(Math.ceil(Math.max(0,milliseconds)/1000));
}

const headlineOptions={pixel:2,color:'#101726',maxWidth:740,paddingX:2};
const tickerOptions={pixel:2,color:'#fff5f3',minWidth:760,paddingX:15};
const timerOptions={pixel:13,color:'#dfedff'};

export function createCuboNewsHud(scene){
  if(typeof document==='undefined')return {update(){},beginDawnIntro(_ms,done){done?.();},destroy(){}};
  const root=document.getElementById('cubo-news-overlay');
  const broadcast=document.getElementById('broadcast');
  if(!root||!broadcast){
    return {update(){},beginDawnIntro(_ms,done){done?.();},destroy(){}};
  }
  const headline=root.querySelector('#cubo-headline');
  const headlinePixels=root.querySelector('#cubo-headline-pixels');
  const labelPixels=root.querySelector('#cubo-label-pixels');
  const crawlOne=root.querySelector('#cubo-crawl-one');
  const crawlTwo=root.querySelector('#cubo-crawl-two');
  const crawlOnePixels=root.querySelector('#cubo-crawl-one-pixels');
  const crawlTwoPixels=root.querySelector('#cubo-crawl-two-pixels');
  const crawlTrack=root.querySelector('#cubo-crawl-track');
  const timer=root.querySelector('#cubo-time');
  const timerReader=root.querySelector('#cubo-time-reader');
  const timerPixels=root.querySelector('#cubo-time-pixels');
  const intro=broadcast.querySelector('#cubo-dawn-intro');
  const introLabel=broadcast.querySelector('#cubo-dawn-label');
  const introNumber=broadcast.querySelector('#cubo-dawn-number');
  const versionBadge=document.getElementById('build-version');
  const wasVersionHidden=versionBadge?.hidden??false;
  if(versionBadge)versionBadge.hidden=true;
  root.hidden=false;
  broadcast.dataset.cuboNews='visible';
  scene.game.events.emit('cubo-layout-change');

  drawPixelText(labelPixels,'CUBO NEWS',{pixel:2,color:'#ffffff'});
  drawPixelText(introLabel,'TEMPO ATÉ O AMANHECER',{
    pixel:3,color:'#94f0ff',paddingX:3,
  });

  let destroyed=false,introActive=false;
  let lastHeadline='',lastSubtitle='',lastSiren=-Infinity,lastSecond=null,lastCritical=null;

  function finishIntro(done){
    if(destroyed)return;
    introActive=false;
    if(intro){intro.hidden=true;intro.classList.remove('cubo-dawn-traveling');}
    if(introNumber)introNumber.style.transform='';
    root.classList.remove('cubo-intro-running');
    done?.();
  }
  function destroy(){
    if(destroyed)return;
    destroyed=true;introActive=false;
    if(intro){intro.hidden=true;intro.classList.remove('cubo-dawn-traveling');}
    root.hidden=true;
    if(versionBadge)versionBadge.hidden=wasVersionHidden;
    root.classList.remove('cubo-warning','cubo-intro-running');
    broadcast.dataset.cuboNews='hidden';
    scene.game.events.emit('cubo-layout-change');
  }
  scene.events.once('shutdown',destroy);

  function siren(){
    if(scene.time.now-lastSiren<=700)return;
    lastSiren=scene.time.now;
    try{
      const ctx=scene.sound?.context;
      if(ctx?.state!=='running')return;
      const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;
      osc.type='sawtooth';
      osc.frequency.setValueAtTime(640,now);
      osc.frequency.linearRampToValueAtTime(400,now+0.25);
      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.linearRampToValueAtTime(0.018,now+0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.32);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(now);osc.stop(now+0.33);
    }catch{/* O alerta visual permanece se o áudio não estiver liberado. */}
  }

  return {
    // A tela abre com o tempo total da onda ao centro e anima O MESMO número
    // até o destino real do relógio. Nada de 3–2–1 separado; combate liberado
    // apenas quando esta animação chegar ao fim.
    beginDawnIntro(totalMs,onComplete){
      if(destroyed||introActive)return;
      if(!intro||!introNumber||!timerPixels){
        onComplete?.();return;
      }
      introActive=true;
      const value=formatCuboTime(totalMs);
      root.classList.add('cubo-intro-running');
      intro.classList.remove('cubo-dawn-traveling');
      intro.hidden=false;
      introNumber.style.transform='translate(-50%, -50%)';
      drawPixelText(introNumber,value,{pixel:17,color:'#ffffff'});
      // Exibir 30/60 imóveis para leitura antes do deslocamento.
      scene.time.delayedCall(980,()=>{
        if(destroyed||!introActive)return;
        const from=introNumber.getBoundingClientRect();
        const to=timerPixels.getBoundingClientRect();
        const dx=to.left+to.width/2-(from.left+from.width/2);
        const dy=to.top+to.height/2-(from.top+from.height/2);
        const scale=from.width>0?Math.max(0.25,to.width/from.width):0.8;
        intro.classList.add('cubo-dawn-traveling');
        const motion={x:0,y:0,scale:1};
        scene.tweens.add({
          targets:motion,x:dx,y:dy,scale,duration:970,ease:'Cubic.InOut',
          onUpdate:()=>{
            introNumber.style.transform=
              `translate(-50%, -50%) translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`;
          },
          onComplete:()=>finishIntro(onComplete),
        });
      });
    },
    update(elapsed,total,story,{frozen=false,active=true}={}){
      if(destroyed||!active)return;
      const remaining=Math.max(0,total-elapsed);
      const value=formatCuboTime(remaining);
      const critical=!frozen&&remaining<=5000;
      if(lastSecond!==value||lastCritical!==critical){
        timerReader.textContent=value;
        timer.setAttribute('aria-label',`Tempo restante: ${value} segundos`);
        drawPixelText(timerPixels,value,{
          ...timerOptions,color:critical?'#ff4a5f':timerOptions.color,
        });
        lastSecond=value;lastCritical=critical;
      }
      root.classList.toggle('cubo-warning',critical);
      if(story){
        const newHeadline=String(story.headline||'');
        const newSubtitle=String(story.subtitle||'');
        if(newHeadline!==lastHeadline){
          headline.textContent=newHeadline;
          headline.title=newHeadline;
          drawPixelText(headlinePixels,newHeadline,headlineOptions);
          lastHeadline=newHeadline;
        }
        if(newSubtitle!==lastSubtitle){
          const text=newSubtitle+'       +       ';
          crawlOne.textContent=text;
          crawlTwo.textContent=text;
          root.querySelector('.cubo-crawl')?.setAttribute('aria-label',newSubtitle);
          for(const canvas of [crawlOnePixels,crawlTwoPixels]){
            drawPixelText(canvas,text,tickerOptions);
            canvas.style.width=(canvas.width/960*100)+'cqw';
            canvas.style.height=(canvas.height/960*100)+'cqw';
          }
          const seconds=Math.max(8,Math.min(25,newSubtitle.length*0.16));
          crawlTrack.style.animation='none';
          // Uma única recomposição a cada manchete, não em cada frame.
          void crawlTrack.offsetWidth;
          crawlTrack.style.animation=`cubo-scroll ${seconds}s linear infinite`;
          lastSubtitle=newSubtitle;
        }
      }
      if(critical)siren();
    },
    destroy,
  };
}
