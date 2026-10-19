import { getWaveEvents, MODES } from './waves.js';
import { getV035WaveEvents } from './formation035.js';

export const WAVE_MAKER_STORAGE_KEY='soberana-wave-maker-v1';
export const WAVE_MAKER_WAVES=Array.from({length:12},(_,i)=>'wave'+i);
export const WAVE_MAKER_WIDTH=960;
export const WAVE_MAKER_HEIGHT=540;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const copy=value=>JSON.parse(JSON.stringify(value));
export function normalizeWaveMakerEvent(event={},index=0){
  const result={...copy(event)};
  result.id=String(result.id||'event-'+index);
  result.at=clamp(Math.round(Number(result.at)||0),0,120000);
  result.type=clamp(Math.trunc(Number(result.type)||1),1,6);
  result.level=clamp(Math.trunc(Number(result.level)||1),1,10);
  result.count=clamp(Math.trunc(Number(result.count)||1),1,99);
  result.x=clamp(Math.round(Number(result.x??result.portalX??480)),0,960);
  result.y=clamp(Math.round(Number(result.y??0)),-100,540);
  return result;
}
export function officialWaveDraft(wave){
  if(!WAVE_MAKER_WAVES.includes(wave))throw new Error('Onda inválida');
  // Os grupos efetivamente usados no jogo incluem a conversão v0.35.
  const events=getV035WaveEvents(wave,getWaveEvents(wave))
    .map((event,i)=>normalizeWaveMakerEvent(event,i));
  return {wave,durationMs:MODES[wave].minDuration,events};
}
export function newWaveMakerProject(){
  return {schemaVersion:1,waves:Object.fromEntries(WAVE_MAKER_WAVES.map(w=>[w,officialWaveDraft(w)]))};
}
export function readWaveMakerProject(storage){
  try{
    const raw=storage?.getItem(WAVE_MAKER_STORAGE_KEY);
    if(!raw)return newWaveMakerProject();
    const saved=JSON.parse(raw),baseline=newWaveMakerProject();
    if(saved?.schemaVersion!==1||!saved.waves||typeof saved.waves!=='object')return baseline;
    for(const wave of WAVE_MAKER_WAVES){
      const entry=saved.waves[wave];
      if(!entry||!Array.isArray(entry.events))continue;
      baseline.waves[wave]={
        wave,durationMs:clamp(Number(entry.durationMs)||MODES[wave].minDuration,1000,120000),
        events:entry.events.slice(0,300).map(normalizeWaveMakerEvent),
      };
    }
    return baseline;
  }catch{return newWaveMakerProject();}
}
export function saveWaveMakerProject(storage,project){
  try{storage?.setItem(WAVE_MAKER_STORAGE_KEY,JSON.stringify(project));return true;}catch{return false;}
}
export function nextWaveMakerEventId(events){
  let id=1;
  while(events.some(e=>e.id==='event-custom-'+id))id++;
  return 'event-custom-'+id;
}
export function cloneWaveMakerEvent(event,events){
  return {...copy(event),id:nextWaveMakerEventId(events),at:Math.min(120000,event.at+1000),x:clamp(event.x+24,0,960)};
}
export function waveMakerEnemyCount(events){
  return events.reduce((sum,event)=>sum+(event.type===4&&event.pattern==='pincer'?2:event.count||1),0);
}
