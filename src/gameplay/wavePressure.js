// Heurística de pressão para rascunhos. Não substitui combate simulado.
const TYPES = Object.freeze({1:1,2:1.5,3:2,4:1.7,5:2.4,6:4});
const int=(n,min,max)=>Math.max(min,Math.min(max,Math.round(Number(n)||0)));
export function analyzeWavePressure(entry,options={}){
  const duration=int(entry?.durationMs??30000,1000,120000);
  const from=int(options.fromMs??0,0,duration);
  const to=int(options.toMs??duration,from,duration);
  const intervalMs=int(options.intervalMs??1000,250,5000);
  const events=Array.isArray(entry?.events)?entry.events:[];
  const windows=[];
  for(let start=from;start<to;start+=intervalMs){
    const end=Math.min(to,start+intervalMs);
    const active=events.filter(e=>Number(e.at)>=start&&Number(e.at)<end);
    const enemyCount=active.reduce((n,e)=>n+int(e.count??1,1,99),0);
    const score=active.reduce((n,e)=>n+int(e.count??1,1,99)*(TYPES[e.type]??1)*(1+0.08*(int(e.level??1,1,10)-1)),0);
    windows.push({startMs:start,endMs:end,enemyCount,pressure:Math.round(score*10)/10});
  }
  const peak=windows.reduce((best,x)=>!best||x.pressure>best.pressure?x:best,null);
  const average=windows.length?windows.reduce((n,x)=>n+x.pressure,0)/windows.length:0;
  const suggestions=[];
  if(peak&&peak.pressure>average*1.6&&peak.pressure>=5)suggestions.push('Espaçar eventos no trecho de maior concentração.');
  if(peak?.enemyCount>=8)suggestions.push('Reduzir a quantidade de inimigos em eventos próximos.');
  if(!suggestions.length)suggestions.push('Sem concentração extrema de entradas identificada; validar em combate real.');
  return {fromMs:from,toMs:to,windows,peak,averagePressure:Math.round(average*10)/10,
    totalEvents:events.filter(e=>Number(e.at)>=from&&Number(e.at)<to).length,suggestions,
    warning:'Estimativa de entradas de inimigos, NÃO de projéteis ativos, dano ou chance de vitória.'};
}
