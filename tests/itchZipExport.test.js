import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inflateRawSync} from 'node:zlib';
import {generateItchZip} from '../scripts/build-itch-zip.mjs';

function withFixture(run){
  const root=mkdtempSync(join(tmpdir(),'soberania-zip-'));
  const dir=join(root,'dist'),out=join(root,'itch-build','operacao-soberania-itch.zip');
  try{
    mkdirSync(join(dir,'assets','sons'),{recursive:true});
    writeFileSync(join(dir,'index.html'),'<html><script src="./assets/index-abc.js"></script></html>');
    writeFileSync(join(dir,'assets','index-abc.js'),'const game = "ready";');
    writeFileSync(join(dir,'assets','sons','efeito.wav'),Buffer.alloc(600,42));
    run({dir,out});
  }finally{rmSync(root,{recursive:true,force:true});}
}
function readEntries(zip){
  // Leitura independente do diretório central, para validar nomes e payloads.
  const end=zip.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));
  assert.ok(end>0);
  const count=zip.readUInt16LE(end+10);
  let offset=zip.readUInt32LE(end+16);
  const entries=new Map();
  for(let i=0;i<count;i++){
    assert.equal(zip.readUInt32LE(offset),0x02014b50);
    const method=zip.readUInt16LE(offset+10);
    const compressed=zip.readUInt32LE(offset+20);
    const length=zip.readUInt16LE(offset+28);
    const extra=zip.readUInt16LE(offset+30),comment=zip.readUInt16LE(offset+32);
    const loc=zip.readUInt32LE(offset+42);
    const name=zip.toString('utf8',offset+46,offset+46+length);
    assert.equal(zip.readUInt32LE(loc),0x04034b50);
    const start=loc+30+zip.readUInt16LE(loc+26)+zip.readUInt16LE(loc+28);
    const payload=zip.subarray(start,start+compressed);
    entries.set(name,method===8?inflateRawSync(payload):payload);
    offset+=46+length+extra+comment;
  }
  return entries;
}
test('ZIP itch inclui index.html na raiz, JS e sons com caminhos preservados',()=>{
  withFixture(({dir,out})=>{
    const result=generateItchZip({buildDir:dir,outputFile:out});
    assert.equal(result.files,3);
    const entries=readEntries(readFileSync(out));
    assert.deepEqual([...entries.keys()].sort(),[
      'assets/index-abc.js','assets/sons/efeito.wav','index.html',
    ]);
    assert.match(entries.get('index.html').toString(),/\.\/assets\/index-abc\.js/);
    assert.match(entries.get('assets/index-abc.js').toString(),/game = "ready"/);
    assert.deepEqual(entries.get('assets/sons/efeito.wav'),Buffer.alloc(600,42));
  });
});
test('ZIP itch rejeita builds sem index.html, evitando pacote inválido',()=>{
  withFixture(({dir,out})=>{
    rmSync(join(dir,'index.html'));
    assert.throws(()=>generateItchZip({buildDir:dir,outputFile:out}),/index\.html/);
  });
});
