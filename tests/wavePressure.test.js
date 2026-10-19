import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeWavePressure } from '../src/gameplay/wavePressure.js';

test('detecta pico de entradas por segundo e sugere espaçar eventos',()=>{
 const entry={durationMs:5000,events:[{at:2000,type:1,count:6,level:1},{at:2400,type:3,count:2,level:2},{at:4300,type:1,count:1}]};
 const r=analyzeWavePressure(entry);
 assert.equal(r.totalEvents,3);
 assert.equal(r.peak.startMs,2000);
 assert.equal(r.peak.enemyCount,8);
 assert.ok(r.suggestions.some(s=>s.includes('Espaçar')));
});
test('respeita intervalo selecionado e não declara vitória ou dano',()=>{
 const r=analyzeWavePressure({durationMs:6000,events:[{at:500,type:4,count:3},{at:3500,type:1,count:2}]},{fromMs:3000,toMs:5000});
 assert.equal(r.totalEvents,1);
 assert.equal(r.peak.startMs,3000);
 assert.match(r.warning,/NÃO de projéteis/);
});
test('aceita onda sem eventos',()=>{
 const r=analyzeWavePressure({durationMs:1000,events:[]});
 assert.equal(r.totalEvents,0);
 assert.equal(r.peak.pressure,0);
});
