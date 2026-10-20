import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {v1CombatStats,V1_UPGRADES} from '../src/gameplay/v1Upgrades.js';
import {v1SpecialConfig} from '../src/gameplay/v1Specials.js';
import {
  americanJulyConfig,registerAmericanJulyHit,americanJulyReady,
  consumeAmericanJulyShot,
} from '../src/gameplay/usJuly.js';

const stats=level=>v1CombatStats({choices:Array(level).fill('us')});
test('Quatro de Julho só carrega após o terceiro upgrade americano',()=>{
  assert.deepEqual(americanJulyConfig(0),{
    hitsRequired:0,blastRadius:0,blastDamage:0,shards:false,
  });
  assert.equal(stats(1).fragmentation,true);
  assert.equal(stats(1).usJulyHitsRequired,0);
  assert.equal(stats(2).usJulyHitsRequired,0);
  assert.equal(stats(3).usJulyHitsRequired,5);
  assert.equal(stats(5).usJulyBlastRadius>stats(3).usJulyBlastRadius,true);
  assert.equal(stats(7).usJulyShards,true);
  assert.equal(stats(10).usJulyHitsRequired,3);
  assert.equal(stats(10).usJulyBlastRadius>stats(7).usJulyBlastRadius,true);
  for(const level of [1,3,5,7,10]){
    assert.equal(stats(level).usGrowthMax,1);
    assert.equal(stats(level).usHoming,0);
  }
});
test('cinco acertos diretos carregam próxima salva, que consome carga ao sair',()=>{
  const n=5;
  let charge=0;
  for(let i=0;i<n;i++){
    charge=registerAmericanJulyHit(charge,n,{special:false,generation:0,patriotic:false});
    assert.equal(charge,i+1);
  }
  assert.equal(americanJulyReady(charge,n),true);
  assert.equal(registerAmericanJulyHit(charge,n),n,'nunca exceder a capacidade');
  assert.deepEqual(consumeAmericanJulyShot(charge,n),{patriotic:true,hits:0});
  assert.deepEqual(consumeAmericanJulyShot(n-1,n),{patriotic:false,hits:n-1});
  assert.equal(americanJulyReady(0,n),false);
});
test('nível 10 dispara automaticamente após apenas três acertos',()=>{
  const n=stats(10).usJulyHitsRequired;
  let charge=0;
  for(let i=0;i<n;i++)charge=registerAmericanJulyHit(charge,n);
  assert.equal(charge,3);
  assert.equal(consumeAmericanJulyShot(charge,n).patriotic,true);
});
test('bomba, tiros derivados e Quatro de Julho não geram carga infinita',()=>{
  for(const bullet of [
    {special:true,generation:0,patriotic:false},
    {special:false,generation:1,patriotic:false},
    {special:false,generation:0,patriotic:true},
  ])assert.equal(registerAmericanJulyHit(2,5,bullet),2);
  assert.equal(registerAmericanJulyHit(0,0,{}),0);
  assert.equal(registerAmericanJulyHit(5,5,{}),5);
});
test('secundário Choque e Pavor preserva escalas 1×/2×/4×/8×, raio e choque',()=>{
  for(const [level,scale] of [[2,1],[4,2],[6,4],[8,8]]){
    const cfg=v1SpecialConfig({choices:Array(level).fill('us')});
    assert.equal(cfg.usMissileScale,scale);
    assert.ok(cfg.usBlastRadius>0);
    assert.ok(cfg.usShockRadius>cfg.usBlastRadius);
  }
});
test('catálogo de upgrades americanos descreve a nova mecânica',()=>{
  const levels=V1_UPGRADES.us;
  for(const index of [0,2,4,6,9]){
    const text=levels[index].description;
    assert.doesNotMatch(text,/(?:balas|projéteis).*(?:crescem|perseguem|teleguiados)/i);
  }
  assert.match(levels[2].title,/Quatro de Julho/);
  assert.match(levels[9].title,/Independence Day/);
  assert.match(levels[8].title,/Liberdade Duradoura/);
  assert.match(levels[7].description,/míssil 8×/);
});
test('cena: salvo único, alvos diretos, efeito visual sem crescimento nem homing',()=>{
  const src=readFileSync(new URL('../src/scenes/GameScene.js',import.meta.url),'utf8');
  assert.match(src,/consumeAmericanJulyShot\(this\.usJulyHits/);
  assert.match(src,/july\.patriotic&&index===julyIndex/);
  assert.match(src,/registerAmericanJulyHit\(this\.usJulyHits/);
  assert.match(src,/if\(bullet\.patriotic\)/);
  assert.match(src,/this\.detonateAmericanJuly\(/);
  assert.match(src,/this\.combat\.usJulyShards/);
  assert.match(src,/4 JULHO:/);
  assert.doesNotMatch(src,/bullet\.usGrowthMax>1/);
  assert.doesNotMatch(src,/this\.combat\.usHoming\*dt/);
  // Disparos especiais continuam com correção angular e escala gigante.
  assert.match(src,/bullet\.hybridConfig\?\.primary==='us'/);
  assert.match(src,/build\.primary==='us'\?1\.6\*build\.usMissileScale/);
  // Divisão chinesa não destrói prematuramente o projétil patriótico.
  assert.match(src,/chinaSplit:!special && !julyShot/);
});
