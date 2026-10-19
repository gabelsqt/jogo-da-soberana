// Cubo News v0.45: HTML real FORA do canvas Phaser.
// O Phaser pode aplicar zoom/screenshake, mas não consegue mover este overlay.
// O palco mantém 960×540; a faixa independente acrescenta 44px abaixo.
// O relógio flutua na direita, sem caixa e com transparência.
export function formatCuboTime(milliseconds){
  const seconds=Math.ceil(Math.max(0,milliseconds)/1000);
  return String(Math.floor(seconds/60)).padStart(2,'0')+':'+
    String(seconds%60).padStart(2,'0');
}

export function createCuboNewsHud(scene){
  const root=document.getElementById('cubo-news-overlay');
  const broadcast=document.getElementById('broadcast');
  if(!root||!broadcast){
    // No contexto sem DOM (testes unitários ou embed antigo), não quebrar o jogo.
    return {update(){},destroy(){}};
  }
  const headline=root.querySelector('#cubo-headline');
  const crawlOne=root.querySelector('#cubo-crawl-one');
  const crawlTwo=root.querySelector('#cubo-crawl-two');
  const crawlTrack=root.querySelector('#cubo-crawl-track');
  const timer=root.querySelector('#cubo-time');
  const versionBadge=document.getElementById('build-version');
  const wasVersionHidden=versionBadge?.hidden??false;
  if(versionBadge)versionBadge.hidden=true;
  root.hidden=false;
  broadcast.dataset.cuboNews='visible';
  scene.game.events.emit('cubo-layout-change');

  let destroyed=false;
  let lastHeadline='',lastSubtitle='',lastSiren=-Infinity;
  function destroy(){
    if(destroyed)return;
    destroyed=true;
    root.hidden=true;
    if(versionBadge)versionBadge.hidden=wasVersionHidden;
    root.classList.remove('cubo-warning');
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
    }catch{/* Sinal visual continua, mesmo sem áudio autorizado. */}
  }

  return {
    update(elapsed,total,story,{frozen=false,active=true}={}){
      if(destroyed||!active)return;
      const remaining=Math.max(0,total-elapsed);
      timer.textContent=formatCuboTime(remaining);
      const critical=!frozen&&remaining<=5000;
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
          const text=newSubtitle+'    ◆    ';
          crawlOne.textContent=text;
          crawlTwo.textContent=text;
          // A velocidade acompanha o comprimento. As duas cópias mantêm
          // fluxo contínuo da DIREITA para a ESQUERDA sem lacunas.
          const seconds=Math.max(8,Math.min(25,newSubtitle.length*0.16));
          crawlTrack.style.animation='none';
          // Reflow somente a cada manchete, não a cada quadro do jogo.
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
