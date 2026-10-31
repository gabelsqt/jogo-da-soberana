// Perfil experimental v0.901. Estes números não alteram a campanha.
// Campos declarativos servem ao editor, à exportação JSON e aos cálculos.
export const LAB_COUNTRIES = Object.freeze([
  {id:'br',name:'Brasil'},{id:'us',name:'Estados Unidos'},
  {id:'ru',name:'Rússia'},{id:'cn',name:'China'},{id:'jp',name:'Coreia do Sul'},
]);
// [país, árvore, estágio, descrição mecânica, [chave, título, valor, mín, máx, passo, unidade]]
const rows = [
 ['br','P',1,'Aquecimento',[['heat', 'Bônus de cadência no pico',95,0,250,5,'%']]],
 ['br','P',2,'Calibre',[['damage','Dano por projétil',1.35,0.1,10,.05,'dano'],['radius','Multiplicador de raio',1.25,1,4,.05,'×']]],
 ['br','P',3,'Distribuição horizontal',[['spread','Deslocamento lateral',14,0,70,1,'px']]],
 ['br','P',4,'Aquecimento máximo',[['heat','Bônus máximo de cadência',150,0,300,5,'%'],['plateau','Permanência no pico',2100,300,4000,100,'ms']]],
 ['br','S',1,'Quantidade de rojões',[['fireworks','Rojões por acerto',2,1,12,1,'un']]],
 ['br','S',2,'Área e intensidade',[['radius','Raio do balão',120,40,260,5,'px'],['blastRadius','Raio de cada rojão',33,10,70,1,'px'],['fireworks','Rojões por acerto',3,1,12,1,'un'],['damage','Dano de cada rojão',2,.25,8,.25,'dano']]],
 ['br','S',3,'Descargas e fogos',[['fireworks','Rojões por acerto',5,1,15,1,'un'],['electricDamage','Dano elétrico',.5,0,4,.1,'dano'],['electricRange','Alcance elétrico',45,0,120,5,'px'],['electricRate','Descargas por segundo',3,0,10,1,'/s']]],
 ['br','S',4,'Turbo e explosão final',[['turbo','Multiplicador de cadência',2,1,4,.1,'×'],['finalDamage','Dano da explosão final',7,0,20,.5,'dano']]],
 ['us','P',1,'Colisão ampliada',[['radius','Raio físico do foguete',13,3,45,1,'px']]],
 ['us','P',2,'Explosão ampliada',[['blastRadius','Raio explosivo',40,10,160,2,'px']]],
 ['us','P',3,'Onda de choque',[['push','Distância do empurrão',70,0,220,5,'px'],['pushTime','Duração do empurrão',450,100,1500,50,'ms']]],
 ['us','P',4,'Potência',[['damage','Dano direto',1.6,.2,12,.1,'dano'],['blastDamage','Dano explosivo',2.1,0,12,.1,'dano']]],
 ['us','S',1,'Alcance do muro',[['radius','Raio do arco de 120°',80,30,230,5,'px']]],
 ['us','S',2,'Repulsão do muro',[['pushSpeed','Velocidade do empurrão',1200,100,2200,50,'px/s'],['pushMax','Distância máxima do recuo',200,40,350,10,'px']]],
 ['us','S',3,'Ricochetes',[['reflectionDamage','Dano por tiro refletido',4,.5,15,.5,'dano']]],
 ['us','S',4,'Formação e duração',[['openMs','Tempo de formação',180,50,800,10,'ms'],['durationMs','Duração do escudo',7500,1000,16000,250,'ms']]],
 ['ru','P',1,'Congelamento inicial',[['damage','Dano direto',2,.1,10,.1,'dano'],['freezeMs','Duração do gelo',1400,200,5000,100,'ms']]],
 ['ru','P',2,'Estilhaçamento',[['shatterDamage','Dano de estilhaço',3,0,15,.5,'dano'],['shatterRadius','Raio de estilhaçamento',60,0,200,5,'px']]],
 ['ru','P',3,'Persistência',[['freezeMs','Duração do gelo',2200,200,6000,100,'ms'],['speed','Velocidade do projétil',600,150,1200,25,'px/s']]],
 ['ru','P',4,'Dano concentrado',[['damage','Dano direto',2.6,.1,15,.1,'dano'],['bossMultiplier','Dano em módulo vulnerável',1.2,1,3,.05,'×']]],
 ['ru','S',1,'Campo criogênico',[['radius','Raio do Sputnik',55,15,160,5,'px']]],
 ['ru','S',2,'Permanência orbital',[['durationMs','Duração do Sputnik',5000,1000,12000,250,'ms']]],
 ['ru','S',3,'Cristalização',[['bonus','Multiplicador de dano em cristalizados',1.45,1,4,.05,'×'],['freezeMs','Duração do congelamento',2400,300,6000,100,'ms']]],
 ['ru','S',4,'Reação em cadeia',[['targets','Alvos adicionais',4,0,12,1,'un'],['radius','Raio das reações',60,0,200,5,'px'],['damageFactor','Dano dos estilhaços derivados',.5,0,1,.05,'×']]],
 ['cn','P',1,'Quantidade inicial',[['count','Tiros por salva',3,1,15,1,'un']]],
 ['cn','P',2,'Divisão única',[['copyDamage','Fração de dano das cópias',.5,0,1,.05,'×']]],
 ['cn','P',3,'Produção em escala',[['count','Tiros por salva',5,1,20,1,'un']]],
 ['cn','P',4,'Produção acelerada',[['intervalMs','Intervalo entre salvas',240,40,700,10,'ms']]],
 ['cn','S',1,'Fila antiga — não altera o Panda',[['rateFactor','Multiplicador do intervalo da fila',.8,.25,1.5,.05,'×']]],
 ['cn','S',2,'Fila antiga — não altera o Panda',[['focusMs','Duração com tiros alinhados',3500,500,9000,100,'ms']]],
 ['cn','S',3,'Fila antiga — não altera o Panda',[['armorMultiplier','Dano de cada projétil contra módulos/escudos',1.35,1,3,.05,'×']]],
 ['cn','S',4,'Fila antiga — não altera o Panda',[['shotMultiplier','Multiplicador de dano de cada projétil',1.2,1,3,.05,'×']]],
 ['jp','P',1,'Ricochete inicial',[['bounces','Máximo de ricochetes por laser',1,0,8,1,'un'],['range','Alcance de cada ricochete',180,50,500,10,'px'],['retention','Dano preservado após ricochete',.7,.1,1,.05,'×']]],
 ['jp','P',2,'Ricochetes duplos',[['bounces','Máximo de ricochetes por laser',2,0,8,1,'un'],['range','Alcance de cada ricochete',215,50,500,5,'px'],['count','Lasers por salva',4,1,16,1,'un']]],
 ['jp','P',3,'Ricochetes triplos',[['bounces','Máximo de ricochetes por laser',3,0,8,1,'un'],['range','Alcance de cada ricochete',260,50,500,5,'px'],['count','Lasers por salva',5,1,16,1,'un']]],
 ['jp','P',4,'Propagação avançada',[['bounces','Máximo de ricochetes por laser',4,0,8,1,'un'],['range','Alcance de cada ricochete',320,50,600,10,'px'],['count','Lasers por salva',6,1,16,1,'un']]],
 ['jp','S',1,'Primeiros reflexos',[['count','Reflexos por tiro',6,1,48,1,'un'],['budget','Dano total da salva',10.8,0,80,.6,'dano']]],
 ['jp','S',2,'Mais reflexos',[['count','Reflexos por tiro',12,1,48,1,'un'],['budget','Dano total da salva',14.4,0,80,.6,'dano']]],
 ['jp','S',3,'Reflexos máximos',[['count','Reflexos por tiro',24,1,64,1,'un'],['budget','Dano total da salva',19.2,0,80,.6,'dano']]],
 ['jp','S',4,'Distribuição inteligente',[['budget','Dano total da salva',24,0,80,.5,'dano'],['targetCap','Fração máxima por alvo',.4,.05,1,.05,'×']]],
];
export const LAB_BALANCE_FIELDS = Object.freeze(rows.flatMap(([country,track,stage,description,fields])=>
  fields.map(([suffix,label,value,min,max,step,unit])=>Object.freeze({
    key:country+'.'+track+stage+'.'+suffix,country,track,stage,description,
    label,value,min,max,step,unit,
  }))));
const FIELD_BY_KEY = new Map(LAB_BALANCE_FIELDS.map(field=>[field.key,field]));
export const LAB_BALANCE_DEFAULTS = Object.freeze(Object.fromEntries(
  LAB_BALANCE_FIELDS.map(field=>[field.key,field.value])));
export function normalizeLabBalance(input={}){
  const values={...LAB_BALANCE_DEFAULTS};
  if(!input || typeof input!=='object')return values;
  for(const [key,value] of Object.entries(input)){
    const field=FIELD_BY_KEY.get(key);
    if(!field)continue;
    const num=Number(value);
    if(Number.isFinite(num))values[key]=Math.max(field.min,Math.min(field.max,num));
  }
  return values;
}
export function labValue(profile,country,track,stage,suffix,fallback){
  return profile?.[country+'.'+track+stage+'.'+suffix]??fallback;
}
export function emptyLabAllocation(){
  return Object.fromEntries(LAB_COUNTRIES.map(({id})=>[id,{P:0,S:0}]));
}
export function normalizeLabAllocation(input={}){
  const out=emptyLabAllocation();
  for(const {id} of LAB_COUNTRIES){
    for(const track of ['P','S']){
      const n=Number(input?.[id]?.[track]);
      out[id][track]=Number.isFinite(n)?Math.max(0,Math.min(4,Math.floor(n))):0;
    }
  }
  return out;
}
export function labLevelCounts(allocation,principal,especial){
  const counts=Object.fromEntries(LAB_COUNTRIES.map(({id})=>[id,0]));
  if(Object.hasOwn(counts,principal))counts[principal]++;
  if(Object.hasOwn(counts,especial))counts[especial]++;
  for(const {id} of LAB_COUNTRIES)
    counts[id]+=allocation?.[id]?.P??0,counts[id]+=allocation?.[id]?.S??0;
  return counts;
}
export function singleCountryAtTen(counts,principal,especial){
  const winners=Object.entries(counts).filter(([,n])=>n>=10);
  return winners.length===1 && principal===especial && principal===winners[0][0]
    ?principal:null;
}

