// Cubo News v0.47 — retro legível, fora do canvas Phaser, imune a zoom e shake.
// A abertura faz um pullback cinematográfico do cenário sincronizado ao relógio.
export const DAWN_HOLD_MS=2200;
export const DAWN_TRAVEL_MS=1750;
export const DAWN_WORLD_ZOOM=1.48;

export function formatCuboTime(milliseconds){
  return String(Math.ceil(Math.max(0,milliseconds)/1000));
}
const clamp01=n=>Math.max(0,Math.min(1,n));

export function createCuboNewsHud(scene){
  if(typeof document==='undefined')
    return {update(){},beginDawnIntro(_ms,done){done?.();},destroy(){}};
  const root=document.getElementById('cubo-news-overlay');
  const broadcast=document.getElementById('broadcast');
  if(!root||!broadcast)
    return {update(){},beginDawnIntro(_ms,done){done?.();},destroy(){}};
  const headline=root.querySelector('#cubo-headline');
  const crawlOne=root.querySelector('#cubo-crawl-one');
  const crawlTwo=root.querySelector('#cubo-crawl-two');
  const crawlTrack=root.querySelector('#cubo-crawl-track');
  const crawlBar=root.querySelector('.cubo-crawl');
  const timer=root.querySelector('#cubo-time');
  const timerReader=root.querySelector('#cubo-time-reader');
  const intro=broadcast.querySelector('#cubo-dawn-intro');
  const introNumber=broadcast.querySelector('#cubo-dawn-number');
  const versionBadge=document.getElementById('build-version');
  const wasVersionHidden=versionBadge?.hidden??false;
  if(versionBadge)versionBadge.hidden=true;
  root.hidden=false;
  broadcast.dataset.cuboNews='visible';
  scene.game.events.emit('cubo-layout-change');

  let destroyed=false,introActive=false;
  let lastHeadline='',lastSubtitle='',lastSiren=-Infinity,lastSecond=null,lastCritical=null;
  const camera=scene.cameras?.main;
  const resetCamera=()=>camera?.setZoom?.(1);

  function finishIntro(done){
    if(destroyed)return;
    introActive=false;
    resetCamera();
    if(intro){intro.hidden=true;intro.classList.remove('cubo-dawn-traveling');}
    if(introNumber){introNumber.style.transform='';introNumber.style.opacity='';}
    if(timer)timer.style.opacity='';
    root.classList.remove('cubo-intro-running');
    done?.();
  }
  function destroy(){
    if(destroyed)return;
    destroyed=true;
    if(introActive)resetCamera();
    introActive=false;
    if(intro){intro.hidden=true;intro.classList.remove('cubo-dawn-traveling');}
    root.hidden=true;
    if(versionBadge)versionBadge.hidden=wasVersionHidden;
    if(timer)timer.style.opacity='';
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
    }catch{/* Sem áudio liberado, o alerta visual segue funcionando. */}
  }

  return {
    beginDawnIntro(totalMs,onComplete){
      if(destroyed||introActive)return;
      if(!intro||!introNumber||!timer){
        onComplete?.();return;
      }
      introActive=true;
      const value=formatCuboTime(totalMs);
      root.classList.add('cubo-intro-running');
      intro.classList.remove('cubo-dawn-traveling');
      intro.hidden=false;
      introNumber.textContent=value;
      introNumber.style.transform='translate(-50%, -50%)';
      introNumber.style.opacity='1';
      timer.style.opacity='0';
      // Close-up no cenário já carregado. O relógio pertence ao DOM
      // externo e só se move nesta vinheta; nunca sofre shake posterior.
      camera?.setZoom?.(DAWN_WORLD_ZOOM);
      scene.time.delayedCall(DAWN_HOLD_MS,()=>{
        if(destroyed||!introActive)return;
        const from=introNumber.getBoundingClientRect();
        const to=timerReader.getBoundingClientRect();
        const dx=to.left+to.width/2-(from.left+from.width/2);
        const dy=to.top+to.height/2-(from.top+from.height/2);
        const scale=from.width>0?Math.max(0.18,Math.min(1,to.width/from.width)):0.4;
        intro.classList.add('cubo-dawn-traveling');
        const motion={x:0,y:0,scale:1,progress:0};
        // O palco inteiro "se afasta" em paralelo ao número central.
        if(camera)scene.tweens.add({
          targets:camera,zoom:1,duration:DAWN_TRAVEL_MS,ease:'Cubic.InOut',
        });
        scene.tweens.add({
          targets:motion,x:dx,y:dy,scale,progress:1,
          duration:DAWN_TRAVEL_MS,ease:'Cubic.InOut',
          onUpdate:()=>{
            introNumber.style.transform=
              `translate(-50%, -50%) translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`;
            // Crossfade gradual perto do canto; sem desaparecimento brusco.
            const reveal=clamp01((motion.progress-0.67)/0.33);
            introNumber.style.opacity=String(1-reveal);
            timer.style.opacity=String(reveal);
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
        timer.style.color=critical?'rgba(255, 63, 79, 0.96)':'';
        lastSecond=value;lastCritical=critical;
      }
      root.classList.toggle('cubo-warning',critical);
      if(story){
        const newHeadline=String(story.headline||'');
        const newSubtitle=String(story.subtitle||'');
        if(newHeadline!==lastHeadline){
          headline.textContent=newHeadline;
          headline.title=newHeadline;
          lastHeadline=newHeadline;
        }
        if(newSubtitle!==lastSubtitle){
          const text=newSubtitle+'      ◆      ';
          crawlOne.textContent=text;
          crawlTwo.textContent=text;
          crawlBar?.setAttribute('aria-label',newSubtitle);
          const seconds=Math.max(8,Math.min(25,newSubtitle.length*0.16));
          crawlTrack.style.animation='none';
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
