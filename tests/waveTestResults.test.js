import test from 'node:test';
import assert from 'node:assert/strict';
import {appendWaveResult,readWaveResults,recentWaveResults,compareWaveResults,exportWaveResults} from '../src/gameplay/waveTestResults.js';
function memory(){let value=null;return{getItem:()=>value,setItem:(_,v)=>{value=v;}};}
test('persiste e compara resultados de mesma onda',()=>{
 const storage=memory();appendWaveResult(storage,{wave:1,outcome:'derrota',health:0});
 appendWaveResult(storage,{wave:1,outcome:'survived',health:37});
 appendWaveResult(storage,{wave:2,outcome:'cleared',health:99});
 const a=recentWaveResults(storage,1);
 assert.equal(a.length,2);
 assert.equal(compareWaveResults(a[0],a[1]).values.find(v=>v.key==='health').delta,37);
 assert.equal(JSON.parse(exportWaveResults(storage)).results.length,3);
});
test('mantem no maximo 30 registros',()=>{
 const storage=memory();for(let i=0;i<35;i++)appendWaveResult(storage,{wave:0,health:i});
 assert.equal(readWaveResults(storage).length,30);
 assert.equal(readWaveResults(storage)[0].health,5);
});
test('dados invalidos e métricas não medidas',()=>{
 const storage={getItem:()=>'{broken'};
 assert.deepEqual(readWaveResults(storage),[]);
 assert.equal(compareWaveResults({outcome:'derrota'},{outcome:'cleared'}).values[0].delta,null);
});
