// Pacote multi-arquivos para itch.io, sem dependências externas.
// Diferente do HTML único (~97 MB com tudo em base64), o ZIP mantém
// imagens/músicas em arquivos separados e permite carregamento progressivo.
// npm run build:itch -> itch-build/operacao-soberania-itch.zip
import {
  existsSync,readdirSync,statSync,readFileSync,mkdirSync,openSync,writeSync,closeSync,
} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {deflateRawSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

const MAX_ZIP_ENTRIES=1000;
const MAX_NAME_BYTES=240;
const MAX_FILE_SIZE=200*1024*1024;
const MAX_TOTAL_SIZE=500*1024*1024;
const CRC_TABLE=new Uint32Array(256);
for(let i=0;i<256;i++){
  let v=i;
  for(let bit=0;bit<8;bit++)v=v&1?(v>>>1)^0xedb88320:v>>>1;
  CRC_TABLE[i]=v>>>0;
}
function crc32(buffer){
  let value=0xffffffff;
  for(const byte of buffer)value=(value>>>8)^CRC_TABLE[(value^byte)&255];
  return (value^0xffffffff)>>>0;
}
function walk(folder){
  return readdirSync(folder,{withFileTypes:true}).flatMap(entry=>{
    const path=join(folder,entry.name);
    return entry.isDirectory()?walk(path):entry.isFile()?[path]:[];
  });
}
export function generateItchZip({buildDir,outputFile}){
  if(!existsSync(join(buildDir,'index.html')))
    throw new Error('O dist/index.html está ausente. Faça npm run build.');
  const files=walk(buildDir).sort();
  if(files.length>MAX_ZIP_ENTRIES)
    throw new Error('itch.io aceita no máximo 1000 arquivos extraídos.');
  if(!files.some(path=>relative(buildDir,path)==='index.html'))
    throw new Error('O ZIP deve conter index.html na raiz.');
  mkdirSync(dirname(outputFile),{recursive:true});
  let total=0,offset=0;
  const directory=[];
  const fd=openSync(outputFile,'w');
  const write=buffer=>{writeSync(fd,buffer);offset+=buffer.length;};
  try {
    for(const file of files){
      const name=relative(buildDir,file).replaceAll('\\','/');
      const filename=Buffer.from(name,'utf8');
      if(filename.length>MAX_NAME_BYTES)
        throw new Error('Nome de arquivo longo demais para itch.io: '+name);
      const size=statSync(file).size;
      if(size>MAX_FILE_SIZE)
        throw new Error('Arquivo maior que 200 MB: '+name);
      total+=size;
      if(total>MAX_TOTAL_SIZE)
        throw new Error('Exportação excede 500 MB descompactada.');
      const bytes=readFileSync(file),deflated=deflateRawSync(bytes,{level:6});
      const method=deflated.length<bytes.length?8:0;
      const payload=method===8?deflated:bytes;
      if(offset>0xffffffff)throw new Error('ZIP maior que 4 GB (ZIP64 não suportado).');
      const location=offset,crc=crc32(bytes);
      const common=Buffer.alloc(30);
      common.writeUInt32LE(0x04034b50,0);
      common.writeUInt16LE(20,4);
      common.writeUInt16LE(0x0800,6); // nomes UTF-8
      common.writeUInt16LE(method,8);
      common.writeUInt16LE(0,10); // 00:00
      common.writeUInt16LE(33,12); // 1980-01-01
      common.writeUInt32LE(crc,14);
      common.writeUInt32LE(payload.length,18);
      common.writeUInt32LE(bytes.length,22);
      common.writeUInt16LE(filename.length,26);
      write(common);write(filename);write(payload);
      const central=Buffer.alloc(46);
      central.writeUInt32LE(0x02014b50,0);
      central.writeUInt16LE(20,4);
      central.writeUInt16LE(20,6);
      central.writeUInt16LE(0x0800,8);
      central.writeUInt16LE(method,10);
      central.writeUInt16LE(0,12);
      central.writeUInt16LE(33,14);
      central.writeUInt32LE(crc,16);
      central.writeUInt32LE(payload.length,20);
      central.writeUInt32LE(bytes.length,24);
      central.writeUInt16LE(filename.length,28);
      central.writeUInt32LE(location,42);
      directory.push([central,filename]);
    }
    const directoryOffset=offset;
    for(const entry of directory)for(const part of entry)write(part);
    const eocd=Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50,0);
    eocd.writeUInt16LE(directory.length,8);
    eocd.writeUInt16LE(directory.length,10);
    eocd.writeUInt32LE(offset-directoryOffset,12);
    eocd.writeUInt32LE(directoryOffset,16);
    write(eocd);
  }finally{closeSync(fd);}
  return {file:outputFile,files:files.length,
    uncompressedBytes:total,zipBytes:statSync(outputFile).size};
}
const script=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===script){
  const root=resolve(dirname(script),'..');
  const result=generateItchZip({
    buildDir:join(root,'dist'),
    outputFile:join(root,'itch-build','operacao-soberania-itch.zip'),
  });
  console.log('ZIP itch.io pronto:',result.file);
  console.log('Arquivos:',result.files);
  console.log('Tamanho:',(result.zipBytes/1024/1024).toFixed(2),'MB');
  console.log('Envie o ZIP ao itch.io como HTML Game: o index.html está na raiz.');
}
