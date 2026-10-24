// Relatórios jogáveis salvos localmente. Valores ausentes nas versões antigas = não medidos.
export const WAVE_RESULTS_KEY='soberana-wave-maker-results-v1';
export function readWaveResults(storage){
 try{const data=JSON.parse(storage?.getItem(WAVE_RESULTS_KEY)||'[]');
  return Array.isArray(data)?data.filter(row=>row&&Number.isInteger(row.wave)&&row.wave>=0&&row.wave<=11).slice(-30):[];
 }catch{return [];}
}
export function appendWaveResult(storage,row){
 const history=[...readWaveResults(storage),row].slice(-30);
 try{storage?.setItem(WAVE_RESULTS_KEY,JSON.stringify(history));return true;}catch{return false;}
}
export function recentWaveResults(storage,wave,max=5){
 return readWaveResults(storage).filter(r=>r.wave===wave).slice(-max);
}
export function compareWaveResults(a,b){
 const numeric=['health','shield','playerShots','enemyShots','enemyKills','intercepted','damageReceived'];
 return {outcome:[a.outcome,b.outcome],
  values:numeric.map(key=>({key,old:Number.isFinite(a[key])?a[key]:null,
    current:Number.isFinite(b[key])?b[key]:null,
    delta:Number.isFinite(a[key])&&Number.isFinite(b[key])?b[key]-a[key]:null}))};
}
export function exportWaveResults(storage){
 return JSON.stringify({schemaVersion:1,kind:'soberana-wave-test-results',
  exportedAt:new Date().toISOString(),results:readWaveResults(storage)},null,2);
}
