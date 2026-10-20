// Soberania — efeitos de especiais nacionais em estética 16/32-bit.
// Síntese determinística PCM mono a 22.050 Hz; nenhum asset externo.
import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const RATE=22050,TAU=Math.PI*2;
const clamp=(v,lo=-1,hi=1)=>Math.max(lo,Math.min(hi,v));
const fract=v=>v-Math.floor(v);
const tri=x=>1-4*Math.abs(fract(x)-.5);
const saw=x=>2*fract(x)-1;
const sq=x=>fract(x)<.5?1:-1;
const sweep=(hi,lo,t,d)=>hi*Math.pow(lo/hi,clamp(t/d,0,1));
const ease=(t,d,attack=.004,release=.06)=>Math.min(1,t/attack,Math.max(0,(d-t)/release));
function randomizer(seed){let state=seed>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2147483648-1;};}
function wave(freq,t,kind='triangle'){
 const ph=freq*t;
 return kind==='square'?sq(ph):kind==='saw'?saw(ph):
   kind==='sine'?Math.sin(TAU*ph):tri(ph);
}
function sweepWave(high,low,t,d,kind='triangle'){
 const tt=clamp(t,0,d),ratio=Math.log(low/high),cycles=
   Math.abs(ratio)>1e-8 ? high*d*(Math.exp(ratio*tt/d)-1)/ratio:high*tt;
 return wave(1,cycles,kind);
}
function render(id,d,recipe,{seed=31,bit=12,loop=false,echo=0}={}){
 const n=Math.ceil(d*RATE),pcm=new Float64Array(n),rand=randomizer(seed);
 let lp=0,lp2=0;
 for(let i=0;i<n;i++){
   const t=i/RATE,noise=rand();
   lp=.75*lp+.25*noise;lp2=.95*lp2+.05*noise;
   const decay=loop?1:ease(t,d,.003,Math.min(.14,d*.25));
   pcm[i]=clamp(recipe({t,d,noise,lp,lp2})*decay);
 }
 if(echo){
   const delay=Math.floor(.071*RATE);
   for(let i=delay;i<n;i++)pcm[i]=clamp(pcm[i]+echo*pcm[i-delay]);
 }
 if(loop){
   // Suaviza a junção fim/início sem mudo periódico ou som de clique.
   const window=Math.min(Math.floor(.04*RATE),Math.floor(n/6));
   for(let i=0;i<window;i++){
     const fade=i/window,a=pcm[i],b=pcm[n-window+i];
     pcm[i]=b*(1-fade)+a*fade;
   }
 }
 let peak=0;
 for(const x of pcm)peak=Math.max(peak,Math.abs(x));
 const gain=peak>0?.83/peak:1;
 const q=2**(bit-1)-1,wav=Buffer.alloc(44+n*2);
 wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
 wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
 wav.writeUInt32LE(RATE,24);wav.writeUInt32LE(RATE*2,28);
 wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);
 wav.writeUInt32LE(2*n,40);
 for(let i=0;i<n;i++){
   const val=Math.round(clamp(pcm[i]*gain)*q)/q;
   wav.writeInt16LE(Math.round(clamp(val)*32767),44+i*2);
 }
 return {id,buffer:wav,duration:n/RATE};
}
export const NATIONAL_SPECIAL_FILES=Object.freeze({
 brBonfire:'20_br_fogueira_loop.wav',
 brFireworkLaunch:'21_br_fogos_subida.wav',
 brFireworkBurst:'22_br_fogos_estouro.wav',
 usMissileLaunch:'23_us_missil_propulsao.wav',
 usShockwave:'24_us_onda_choque.wav',
 cnCargoDeploy:'25_cn_drones_carga.wav',
 cnContainerImpact:'26_cn_container_impacto.wav',
 krDiscoDeploy:'27_kr_bola_discoteca_ativar.wav',
 krDiscoSpin:'28_kr_discoteca_giro_loop.wav',
 krLaserRicochet:'29_kr_ricochete_laser.wav',
 krBasicShot:'30_kr_tiro_laser_v2.wav',
});
export function generateNationalSpecialSfx(outDir){
 mkdirSync(outDir,{recursive:true});
 const results=[],put=(id,d,recipe,options)=>{
   const {buffer,duration}=render(id,d,recipe,options);
   writeFileSync(join(outDir,NATIONAL_SPECIAL_FILES[id]),buffer);
   results.push({id,file:NATIONAL_SPECIAL_FILES[id],duration,bytes:buffer.length});
 };
 // Brasil — fogueira: crepitar cremoso, brasa grave e lenha estalando;
 // usa padrão cíclico simples para remeter a cartuchos sem infantilizar.
 put('brBonfire',1.3,({t,d,noise,lp,lp2})=>{
   const fuel=.17*wave(63,t,'triangle')+.08*wave(126,t,'sine');
   const crackle=(Math.sin(TAU*13*t)**18)*(.38*lp+.17*noise);
   const air=.19*lp2+.12*lp;
   return (fuel+air+crackle)*(.88+.07*Math.sin(TAU*t/d));
 },{seed:200,bit:11,loop:true});
 // Brasil — pavio sobe e assovia moderadamente, com ruído e não "nota".
 put('brFireworkLaunch',.32,({t,d,noise,lp})=>{
   const ascending=.21*sweepWave(250,720,t,d,'saw')*Math.exp(-t*4);
   const hiss=(noise*.15+lp*.28)*(1-t/d);
   const impulse=.28*wave(140,t,'triangle')*Math.exp(-t*16);
   return ascending+hiss+impulse;
 },{seed:201,bit:11,echo:.06});
 // Brasil — estouro festivo, reverberação curta + fagulhas;
 put('brFireworkBurst',.49,({t,d,noise,lp})=>{
   const crack=(noise*.30+lp*.41)*Math.exp(-t*16);
   const bass=.30*sweepWave(230,57,t,d,'triangle')*Math.exp(-t*12);
   let sparks=0;
   for(let i=0;i<5;i++){
     const age=t-(.028+i*.046);
     if(age>0)sparks+=.08*Math.sin(TAU*(930+i*137)*age)*Math.exp(-age*23);
   }
   return crack+bass+sparks;
 },{seed:202,bit:11,echo:.09});
 // EUA — partida maciça do foguete, compressor + corpo grave.
 put('usMissileLaunch',.62,({t,d,noise,lp,lp2})=>{
   const ignition=(lp*.45+noise*.13)*Math.exp(-t*4);
   const thrust=.39*sweepWave(235,84,t,d,'saw')*(1-.28*t/d);
   const compressor=.20*wave(71,t,'square')*(.78+.16*Math.sin(TAU*17*t));
   return ignition+thrust+compressor+lp2*.15;
 },{seed:301,bit:12,echo:.07});
 // EUA — pancada de pressão, duas ondas graves sobrepostas.
 put('usShockwave',.72,({t,d,noise,lp,lp2})=>{
   const pressure=.47*sweepWave(160,32,t,d,'sine')*Math.exp(-t*4);
   const shell=(lp*.42+noise*.13)*Math.exp(-t*17);
   const second=t>.087?.24*sweepWave(104,29,t-.087,d-.087,'triangle')*Math.exp(-(t-.087)*7):0;
   return pressure+shell+second+lp2*.15*Math.exp(-t*4);
 },{seed:302,bit:12,echo:.13});
 // China — telecomando e servo dos drones (blips curtos NÃO melódicos).
 put('cnCargoDeploy',.39,({t,d,noise,lp})=>{
   const clicks=[0,.07,.15,.24].reduce((acc,at)=>{
     const age=t-at;return acc+(age>=0?.19*wave(760-at*600,t,'square')*Math.exp(-age*48):0);
   },0);
   const servo=.25*sweepWave(420,137,t,d,'saw')*Math.exp(-t*3);
   const gearbox=lp*.25*Math.exp(-t*9)+noise*.055*Math.exp(-t*28);
   return clicks+servo+gearbox;
 },{seed:401,bit:11,echo:.045});
 // China — contêiner metálico liberando carga e explodindo.
 put('cnContainerImpact',.62,({t,d,noise,lp,lp2})=>{
   const slam=(noise*.19+lp*.40)*Math.exp(-t*22);
   const tin=.21*wave(317,t,'square')*Math.exp(-t*13);
   const boom=.40*sweepWave(184,42,t,d,'triangle')*Math.exp(-t*5);
   const debris=lp2*.24*Math.exp(-t*3);
   return slam+tin+boom+debris;
 },{seed:402,bit:12,echo:.10});
 // Coreia — disco ganha energia: synth polido e ritmo de club de 32 bits.
 put('krDiscoDeploy',.50,({t,d,noise,lp})=>{
   const rising=.23*sweepWave(160,660,t,d,'triangle')*.8;
   const start=.19*wave(180,t,'square')*Math.exp(-t*9);
   const prism=.21*Math.sin(TAU*519*t)*Math.exp(-t*6);
   const shine=lp*.12*Math.exp(-t*4);
   return rising+start+prism+shine;
 },{seed:501,bit:12,echo:.095});
 // Coreia — rotação contínua; usa ciclos exatos, amplitude discreta.
 put('krDiscoSpin',1.2,({t,d,noise,lp})=>{
   const phase=TAU*t/d;
   const motor=.15*wave(80,t,'triangle')+.12*wave(160,t,'sine');
   const shimmer=.10*Math.sin(TAU*480*t+.16*Math.sin(phase));
   const pulse=.13*wave(120,t,'square')*(.52+.18*Math.sin(phase*4));
   return (motor+shimmer+pulse+lp*.05)*(.80+.10*Math.sin(phase));
 },{seed:502,bit:12,loop:true});
 // Coreia — ricochete violeta prismático, flicks curtos e "laser" elegantes.
 put('krLaserRicochet',.25,({t,d,noise,lp})=>{
   const ray=.35*sweepWave(1080,385,t,d,'triangle')*Math.exp(-t*11);
   const snap=.22*Math.sin(TAU*1720*t)*Math.exp(-t*24);
   const refract=.13*wave(615,t,'square')*Math.exp(-t*14);
   return ray+snap+refract+lp*.09*Math.exp(-t*22);
 },{seed:503,bit:12,echo:.047});
 // Coreia — disparo laser V2: mais grave, encorpado e um pouco mais longo.
 // Troca o brilho áspero das ondas square/saw agudas por triangle/sine.
 // Uma pequena borda serrilhada mantém a identidade 16/32-bit sem apitar.
 put('krBasicShot',.25,({t,d,noise,lp})=>{
   const laser=.39*sweepWave(540,155,t,d,'triangle')*Math.exp(-t*5.8);
   const body=.31*sweepWave(300,112,t,d,'sine')*Math.exp(-t*7.2);
   const edge=.09*sweepWave(430,165,t,d,'saw')*Math.exp(-t*15);
   const attack=(lp*.105+noise*.018)*Math.exp(-t*34);
   const tail=.13*Math.sin(TAU*143*t)*Math.exp(-t*10);
   return laser+body+edge+attack+tail;
 },{seed:504,bit:12,echo:.04});
 return results;
}
const script=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===script){
 const out=process.argv[2]??resolve(dirname(script),'../public/assets/sons');
 const generated=generateNationalSpecialSfx(out);
 console.log('Soberania especiais nacionais:',generated.map(g=>g.id+' '+g.duration.toFixed(2)+'s').join(', '));
}
