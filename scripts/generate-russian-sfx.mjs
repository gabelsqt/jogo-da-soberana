// Soberania: sons russos inspirados em consoles 16/32 bits, PCM mono a 22050 Hz.
// Síntese determinística; nenhum download ou dependência externa.
// A etapa predev/prebuild cria os WAVs em public/assets/sons/.
import {mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const RATE=22050,PI2=Math.PI*2;
const clamp=(x,min=-1,max=1)=>Math.max(min,Math.min(max,x));
const frac=x=>x-Math.floor(x);
const tri=x=>1-4*Math.abs(frac(x)-0.5);
const sq=x=>frac(x)<.5?1:-1;
const env=(t,d,a=.008,r=.08)=>Math.min(1,t/a,Math.max(0,(d-t)/r));
const sweep=(from,to,t,d)=>from*Math.pow(to/from,clamp(t/d,0,1));
function rng(seed=1729){let v=seed>>>0;return()=>{v=(1664525*v+1013904223)>>>0;return v/4294967296*2-1;};}
function tone(freq,t,style='triangle'){
  const phase=freq*t;
  return style==='square'?sq(phase):style==='saw'?2*frac(phase)-1:
    style==='sine'?Math.sin(PI2*phase):tri(phase);
}
function oscillator(from,to,t,d,style='triangle'){
  const ratio=Math.log(to/from),duration=Math.max(.0001,d),tt=Math.min(t,duration);
  const cycles=from*duration*(Math.exp(ratio*tt/duration)-1)/ratio;
  return tone(1,cycles,style);
}
function synth(id,d,recipe,{seed=1471,repeat=false,bit=12,echo=0}={}){
  const random=rng(seed),samples=new Float64Array(Math.ceil(d*RATE));
  let noiseLp=0;
  for(let i=0;i<samples.length;i++){
    const t=i/RATE,n=random();
    noiseLp=noiseLp*.68+n*.32;
    let amp=recipe({t,d,i,n,noiseLp});
    amp*=repeat?Math.min(1,t/.018,(d-t)/.018):
      env(t,d,.005,Math.min(.12,d*.25));
    samples[i]=clamp(amp);
  }
  if(echo){const delay=Math.round(RATE*.075);for(let i=delay;i<samples.length;i++)
    samples[i]=clamp(samples[i]+samples[i-delay]*echo);}
  let max=0;for(const x of samples)max=Math.max(max,Math.abs(x));
  const norm=max?.88/max:1,wav=Buffer.alloc(44+samples.length*2);
  wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(RATE,24);wav.writeUInt32LE(RATE*2,28);
  wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);
  wav.writeUInt32LE(samples.length*2,40);
  const quant=2**(bit-1)-1;
  for(let i=0;i<samples.length;i++){
    const x=Math.round(samples[i]*norm*quant)/quant;
    wav.writeInt16LE(Math.round(clamp(x)*32767),44+i*2);
  }
  return {id,wav,duration:samples.length/RATE,rate:RATE};
}
export const RUSSIAN_RETRO_FILES=Object.freeze({
  ruSputnikLaunch:'12_ru_sputnik_lancamento.wav',
  ruSputnikHum:'13_ru_sputnik_zumbido_loop.wav',
  ruSputnikFreeze:'14_ru_sputnik_contato.wav',
  ruCrystalDeep:'15_ru_cristalizacao_profunda.wav',
  ruFrozenShatter:'16_ru_estilhacamento_congelado.wav',
  ruSputnikCollapse:'17_ru_pulso_colapso.wav',
  ruIceBreath:'18_ru_sopro_congelante_loop.wav',
});
export function generateRussianRetroSfx(outputDir){
  mkdirSync(outputDir,{recursive:true});
  const sounds=[],push=(id,d,fn,opt)=>{
    const result=synth(id,d,fn,opt);
    writeFileSync(join(outputDir,RUSSIAN_RETRO_FILES[id]),result.wav);
    sounds.push({id,file:RUSSIAN_RETRO_FILES[id],duration:result.duration,bytes:result.wav.length});
  };
  push('ruSputnikLaunch',.48,({t,d,n})=>{
    const k=t/d,freq=k<.7?sweep(155,1040,k/.7,1):sweep(1040,660,(k-.7)/.3,1);
    const whistle=oscillator(155,870,t,d*.7,'square');
    const arp=t<.23?oscillator(330,900,t,.23,'triangle'):
      oscillator(1000,470,t-.23,d-.23,'triangle');
    return (whistle*.25+tone(freq,t,'triangle')*.23+arp*.19+n*(1-k)**3*.22)
      *(.85+.15*Math.sin(PI2*28*t));
  },{seed:27,bit:11,echo:.10});
  push('ruSputnikHum',1.2,({t,d,noiseLp})=>{
    const a=PI2*t/d,modulation=.73+.12*Math.sin(a)+.06*Math.sin(2*a);
    const low=tri(96*t)+.40*tri(192*t+.02*Math.sin(a));
    const drone=.24*Math.sin(PI2*144*t+.18*Math.sin(a));
    const shimmer=.07*sq(384*t)*(.5+.5*Math.sin(3*a));
    return (low*.30+drone+shimmer+noiseLp*.05)*modulation;
  },{seed:92,repeat:true,bit:11});
  push('ruSputnikFreeze',.31,({t,d,n})=>{
    const hit=Math.exp(-t*14),bright=oscillator(1640,430,t,d,'triangle')*.35;
    const ping=Math.sin(PI2*920*t)*Math.exp(-t*10);
    const step=[1568,1175,784,587][Math.min(3,Math.floor(t/.064))];
    return (bright+.27*tone(step,t,'square')+.26*ping+n*.22*Math.exp(-t*30))*hit;
  },{seed:370,bit:11,echo:.09});
  push('ruCrystalDeep',.78,({t,d,n})=>{
    const tones=[1760,1320,990,660,495];let bell=0;
    for(let j=0;j<tones.length;j++){
      const at=j*.094,age=t-at;
      if(age>=0)bell+=.22*Math.sin(PI2*tones[j]*age)*Math.exp(-age*10);
    }
    const descending=oscillator(660,220,t,d,'triangle')*.30;
    const chilly=Math.sin(PI2*2100*t)*Math.exp(-t*4)*.11;
    return (bell+descending+chilly+n*.035)*(1-t/d*.3);
  },{seed:822,bit:12,echo:.14});
  push('ruFrozenShatter',.58,({t,d,n,noiseLp})=>{
    const crack=(n*.40+noiseLp*.16)*Math.exp(-t*28);let glass=0;
    for(let j=0;j<8;j++){
      const age=t-(.018+j*.033);
      if(age>=0)glass+=(j%2?1:-1)*.13*Math.sin(PI2*(1840-j*153)*age)*Math.exp(-age*22);
    }
    const down=oscillator(1300,180,t,d,'saw')*.10*Math.exp(-t*12);
    return crack+glass+down;
  },{seed:54,bit:10,echo:.075});
  push('ruSputnikCollapse',.61,({t,d,n,noiseLp})=>{
    const low=oscillator(460,63,t,d,'triangle')*.40;
    const pulse=t<.12?oscillator(590,1320,t,.12,'square')*.21:
      oscillator(980,135,t-.12,d-.12,'square')*.13;
    const tail=Math.sin(PI2*185*t)*Math.exp(-t*7)*.16;
    return (low+pulse+tail+(noiseLp*.22+n*.07)*Math.exp(-t*7))*(1-t/d*.6);
  },{seed:1007,bit:11,echo:.08});
  push('ruIceBreath',1.0,({t,d,n,noiseLp})=>{
    const theta=PI2*t/d,flutter=.76+.14*Math.sin(theta*3)+.09*Math.sin(theta*7);
    const chiptone=.09*tri(220*t+.02*Math.sin(theta))+.055*sq(440*t);
    return (noiseLp*.40+n*.09+chiptone)*flutter*.72;
  },{seed:282,repeat:true,bit:10});
  return sounds;
}
const script=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===script){
  const dir=process.argv[2]??resolve(dirname(script),'../public/assets/sons');
  const rows=generateRussianRetroSfx(dir);
  console.log('Soberania — FX russos 16/32-bit:',rows.map(x=>x.id+' '+x.duration.toFixed(2)+'s').join(', '));
}
