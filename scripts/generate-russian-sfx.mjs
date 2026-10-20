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
// V2: design sci-fi militar mais grave e texturizado. Sem arpejos de
// escala musical, bipes de interface ou melodias ascendentes.
export const RUSSIAN_RETRO_FILES=Object.freeze({
  ruSputnikLaunch:'12_ru_sputnik_lancamento_v2.wav',
  ruSputnikHum:'13_ru_sputnik_zumbido_loop_v2.wav',
  ruSputnikFreeze:'14_ru_sputnik_contato_v2.wav',
  ruCrystalDeep:'15_ru_cristalizacao_profunda_v2.wav',
  ruFrozenShatter:'16_ru_estilhacamento_congelado_v2.wav',
  ruSputnikCollapse:'17_ru_pulso_colapso_v2.wav',
  ruIceBreath:'18_ru_sopro_congelante_loop_v2.wav',
  ruBasicShot:'19_ru_tiro_criogenico_v2.wav',
});
export function generateRussianRetroSfx(outputDir){
  mkdirSync(outputDir,{recursive:true});
  const sounds=[],push=(id,d,fn,opt)=>{
    const result=synth(id,d,fn,opt);
    writeFileSync(join(outputDir,RUSSIAN_RETRO_FILES[id]),result.wav);
    sounds.push({id,file:RUSSIAN_RETRO_FILES[id],duration:result.duration,bytes:result.wav.length});
  };
  // Arranque do lançador: pressão hidráulica, propulsor grave e calda metálica.
  push('ruSputnikLaunch',.67,({t,d,n,noiseLp})=>{
    const body=.34*oscillator(254,78,t,d,'saw')*Math.exp(-t*2.5);
    const motor=.34*oscillator(110,52,t,d,'triangle')*Math.exp(-t*3.2);
    const steam=(noiseLp*.30+n*.045)*Math.exp(-t*5.7);
    const clank=.17*Math.sin(PI2*97*t)*Math.exp(-t*12);
    return body+motor+steam+clank;
  },{seed:27,bit:12,echo:.07});
  // Motor inerte e frio; frequências baixas em ciclos inteiros para fechar o loop.
  push('ruSputnikHum',1.5,({t,d,noiseLp})=>{
    const rotation=PI2*t/d;
    const growl=.32*(2*frac(58*t)-1)+.24*tri(74*t);
    const motor=.19*Math.sin(PI2*114*t+.22*Math.sin(rotation));
    const air=noiseLp*.095;
    return (growl+motor+air)*(.80+.09*Math.sin(rotation)+.06*Math.sin(2*rotation));
  },{seed:92,repeat:true,bit:12});
  // Congelamento seco, como metal vitrificando; sem notas musicais.
  push('ruSputnikFreeze',.36,({t,d,n,noiseLp})=>{
    const grit=(noiseLp*.53+n*.14)*Math.exp(-t*18);
    const low=.28*oscillator(325,118,t,d,'triangle')*Math.exp(-t*10);
    const stress=.18*Math.sin(PI2*427*t)*Math.exp(-t*17);
    const brittle=.15*Math.sin(PI2*713*t)*Math.exp(-t*23);
    return grit+low+stress+brittle;
  },{seed:370,bit:11,echo:.04});
  // Cristalização profunda: fratura interna e ressonância irregular descendente.
  push('ruCrystalDeep',.68,({t,d,n,noiseLp})=>{
    const core=.36*oscillator(310,73,t,d,'saw')*Math.exp(-t*3.9);
    const bell=.15*Math.sin(PI2*391*t)*Math.exp(-t*13)
      +.12*Math.sin(PI2*617*t)*Math.exp(-t*15);
    const snap=(noiseLp*.3+n*.06)*Math.exp(-t*21);
    return core+bell+snap+.13*Math.sin(PI2*81*t)*Math.exp(-t*7);
  },{seed:822,bit:12,echo:.06});
  // Estilhaços pesados: granular, pouco brilhante, sem "moedinhas".
  push('ruFrozenShatter',.52,({t,d,n,noiseLp})=>{
    const initial=(n*.17+noiseLp*.47)*Math.exp(-t*23);
    let chips=0;
    for(let j=0;j<5;j++){
      const age=t-(.022+j*.038);
      if(age>=0)chips+=.105*Math.sin(PI2*(480+j*91)*age)
        *Math.exp(-age*(26+j*2));
    }
    const body=.17*oscillator(380,90,t,d,'triangle')*Math.exp(-t*10);
    return initial+chips+body;
  },{seed:54,bit:11,echo:.035});
  // Pulso e colapso: impacto de pressão negativo, não explosão de arcade.
  push('ruSputnikCollapse',.62,({t,d,n,noiseLp})=>{
    const gravity=.44*oscillator(180,39,t,d,'triangle')*Math.exp(-t*4);
    const shell=.23*oscillator(450,98,t,d,'saw')*Math.exp(-t*10);
    const vent=(noiseLp*.31+n*.05)*Math.exp(-t*13);
    return gravity+shell+vent;
  },{seed:1007,bit:12,echo:.045});
  // Sopro em loop: ventania digital rugosa + turbina baixa, sem apito.
  push('ruIceBreath',1.25,({t,d,n,noiseLp})=>{
    const phase=PI2*t/d;
    const fan=.19*(2*frac(72*t)-1)+.12*tri(96*t);
    const air=noiseLp*.37+n*.075;
    return (air+fan)*(.86+.08*Math.sin(phase)+.045*Math.sin(2*phase));
  },{seed:282,repeat:true,bit:11});
  // Tiro principal russo independente do canhão genérico:
  // disparo curto, pesado, por compressão com corpo metálico baixo.
  push('ruBasicShot',.19,({t,d,n,noiseLp})=>{
    const attack=(noiseLp*.48+n*.11)*Math.exp(-t*32);
    const recoil=.35*oscillator(310,105,t,d,'triangle')*Math.exp(-t*17);
    const metal=.14*Math.sin(PI2*583*t)*Math.exp(-t*31);
    const bass=.18*Math.sin(PI2*96*t)*Math.exp(-t*18);
    return attack+recoil+metal+bass;
  },{seed:1987,bit:12});
  return sounds;
}
const script=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===script){
  const dir=process.argv[2]??resolve(dirname(script),'../public/assets/sons');
  const rows=generateRussianRetroSfx(dir);
  console.log('Soberania — FX russos 16/32-bit:',rows.map(x=>x.id+' '+x.duration.toFixed(2)+'s').join(', '));
}
