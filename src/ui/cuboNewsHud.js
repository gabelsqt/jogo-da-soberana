// Lower third da Cubo News: a única interface persistente de campanha.
// 960x540: faixa inferior translúcida, manchete/subtítulo e relógio à direita.
export function formatCuboTime(milliseconds){
  const seconds=Math.ceil(Math.max(0,milliseconds)/1000);
  return String(Math.floor(seconds/60)).padStart(2,'0')+':'+
    String(seconds%60).padStart(2,'0');
}
function short(text,max){
  const str=String(text||'');
  return str.length>max?str.slice(0,max-1).trimEnd()+'…':str;
}
export function createCuboNewsHud(scene){
  const font='monospace';
  const base=scene.add.rectangle(480,507,958,65,0x0c1930,0.94)
    .setStrokeStyle(2,0x526985).setDepth(100);
  const strip=scene.add.rectangle(382,482,760,8,0xb11e2e).setDepth(101);
  const brand=scene.add.text(11,482,'CUBO NEWS  ● AO VIVO',{
    fontFamily:font,fontSize:'10px',fontStyle:'bold',color:'#ffd5d8',
  }).setDepth(103);
  const headline=scene.add.text(11,496,'COBERTURA ESPECIAL — INVASÃO ALIENÍGENA',{
    fontFamily:font,fontSize:'13px',fontStyle:'bold',color:'#ffffff',
  }).setDepth(103);
  const subtitle=scene.add.text(11,517,'Transmissão de emergência em todo o território nacional.',{
    fontFamily:font,fontSize:'10px',color:'#c4d0e0',
  }).setDepth(103);
  const clockPanel=scene.add.rectangle(848,507,222,65,0x142d4d,0.98)
    .setStrokeStyle(2,0x718aab).setDepth(102);
  const timeLabel=scene.add.text(851,484,'TEMPO RESTANTE',{
    fontFamily:font,fontSize:'10px',fontStyle:'bold',color:'#c6d4e8',
  }).setOrigin(0.5,0).setDepth(104);
  const timer=scene.add.text(851,496,'00:30',{
    fontFamily:font,fontSize:'32px',fontStyle:'bold',color:'#ffffff',
  }).setOrigin(0.5,0).setDepth(104);
  let lastHeadline='',lastSubtitle='',lastSiren=-Infinity;
  return {
    update(elapsed,total,story,{frozen=false,active=true}={}){
      if(!active)return;
      const remaining=Math.max(0,total-elapsed);
      timer.setText(formatCuboTime(remaining));
      const critical=!frozen&&remaining<=5000;
      const pulse=critical&&Math.floor(scene.time.now/180)%2===0;
      clockPanel.setFillStyle(critical?(pulse?0xbf2636:0x481222):0x142d4d,0.98);
      clockPanel.setStrokeStyle(2,critical?0xff5565:0x718aab);
      strip.setFillStyle(critical?(pulse?0xff4355:0x7f0f23):0xb11e2e);
      if(story){
        const h=short(story.headline,86),s=short(story.subtitle,116);
        if(h!==lastHeadline){headline.setText(h);lastHeadline=h;}
        if(s!==lastSubtitle){subtitle.setText(s);lastSubtitle=s;}
      }
      if(critical&&scene.time.now-lastSiren>700){
        lastSiren=scene.time.now;
        try {
          const ctx=scene.sound?.context;
          if(ctx&&ctx.state==='running'){
            const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;
            osc.type='sawtooth';osc.frequency.setValueAtTime(640,now);
            osc.frequency.linearRampToValueAtTime(400,now+0.25);
            gain.gain.setValueAtTime(0.0001,now);
            gain.gain.linearRampToValueAtTime(0.018,now+0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001,now+0.32);
            osc.connect(gain);gain.connect(ctx.destination);
            osc.start(now);osc.stop(now+0.33);
          }
        }catch{/* Silent fallback: visual alert remains. */}
      }
    },
    destroy(){[base,strip,brand,headline,subtitle,clockPanel,timeLabel,timer].forEach(o=>o.destroy());},
  };
}
