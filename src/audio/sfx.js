// Efeitos sintetizados em Python (pacote Soberania Sound FX v1).
// Falhas de download não impedem o jogo de funcionar.
import {assetUrl} from '../config/assetUrl.js';
const FILES=Object.freeze({
  cannon:'01_canhao_metralhadora_v3.wav',
  laser:'02_laser_alienigena.wav',
  shieldOn:'03_escudo_ativar.wav',
  shieldReady:'34_escudo_hexagonal_uom.wav',
  shieldBreak:'04_escudo_estilhacar.wav',
  explosion:'05_explosao_nave.wav',
  boss:'06_explosao_chefe.wav',
  upgrade:'07_upgrade_adquirido.wav',
  betrayal:'08_alerta_traicao.wav',
  supreme:'09_supremo_carregamento.wav',
  shieldHit:'10_impacto_escudo.wav',
  specialShot:'11_tiro_especial.wav',
  ruSputnikLaunch:'12_ru_sputnik_lancamento_v2.wav',
  ruSputnikHum:'13_ru_sputnik_zumbido_loop_v2.wav',
  ruSputnikFreeze:'14_ru_sputnik_contato_v2.wav',
  ruCrystalDeep:'15_ru_cristalizacao_profunda_v2.wav',
  ruFrozenShatter:'16_ru_estilhacamento_congelado_v2.wav',
  ruSputnikCollapse:'17_ru_pulso_colapso_v2.wav',
  ruIceBreath:'18_ru_sopro_congelante_loop_v2.wav',
  ruBasicShot:'19_ru_tiro_criogenico_v2.wav',
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
  introKey:'31_intro_tecla_retro.wav',
  introAlert:'32_intro_plantao.wav',
  introNotice:'33_intro_confirmacao.wav',
});
// Configuração reutilizável: novos efeitos podem definir suas faixas aqui.
// [mínimo,máximo] em multiplicadores; 1 representa o áudio original.
export const SFX_VARIATIONS=Object.freeze({
  cannon:Object.freeze({pitch:Object.freeze([0.78,1.22]),volume:Object.freeze([0.90,1.10])}),
  ruBasicShot:Object.freeze({pitch:Object.freeze([0.96,1.04]),volume:Object.freeze([0.95,1.05])}),
  // Laser coreano: variação audível de tom, com viés grave e volume controlado.
  krBasicShot:Object.freeze({pitch:Object.freeze([0.84,1.16]),volume:Object.freeze([0.94,1.06])}),
  usMissileLaunch:Object.freeze({pitch:Object.freeze([0.92,1.08]),volume:Object.freeze([0.94,1.06])}),
  introKey:Object.freeze({pitch:Object.freeze([0.88,1.14]),volume:Object.freeze([0.89,1.05])}),
  explosion:Object.freeze({pitch:Object.freeze([0.75,1.25]),volume:Object.freeze([0.94,1.06])}),
  boss:Object.freeze({pitch:Object.freeze([0.85,1.15]),volume:Object.freeze([0.97,1.03])}),
});
export const SFX_PITCH_RANGES=Object.freeze(Object.fromEntries(
  Object.entries(SFX_VARIATIONS).filter(([,v])=>v.pitch).map(([id,v])=>[id,v.pitch])
));
export function randomSfxRange(range,random=Math.random){
  if(!range)return 1;
  const [min,max]=range;
  if(!Number.isFinite(min)||!Number.isFinite(max)||min<0||max<min)
    throw new RangeError('Invalid SFX variation range');
  return min+Math.max(0,Math.min(1,random()))*(max-min);
}
export function randomSfxPlaybackRate(id,random=Math.random){
  return randomSfxRange(SFX_VARIATIONS[id]?.pitch,random);
}
export function randomSfxVolumeScale(id,random=Math.random){
  return randomSfxRange(SFX_VARIATIONS[id]?.volume,random);
}
const clips=new Map(), lastPlayed=new Map();
const activeCannonVoices=[];
const activeTypingVoices=[];
const MAX_TYPING_VOICES=3;
const MAX_CANNON_VOICES=5;
const activeLoops=new Map();
let enabled=true,volume=0.24;
export function prepareSfx(){
  if(typeof Audio==='undefined')return;
  for(const [id,file] of Object.entries(FILES)){
    if(clips.has(id))continue;
    const audio=new Audio(assetUrl('assets/sons/'+file));
    audio.preload='auto';
    clips.set(id,audio);
  }
}
export function playSfx(id,{throttle=0,volumeScale=1}={}){
  if(!enabled||volume<=0||typeof Audio==='undefined')return;
  prepareSfx();
  const source=clips.get(id);
  if(!source)return;
  const now=performance.now();
  if(throttle&&now-(lastPlayed.get(id)??-Infinity)<throttle)return;
  lastPlayed.set(id,now);
  const sound=source.cloneNode();
  if(id==='cannon'||id==='ruBasicShot'||id==='krBasicShot'||id==='usMissileLaunch'){
    // Limita vozes simultâneas em builds de cadência extrema.
    for(let i=activeCannonVoices.length-1;i>=0;i--){
      if(activeCannonVoices[i].ended||activeCannonVoices[i].paused)activeCannonVoices.splice(i,1);
    }
    if(activeCannonVoices.length>=MAX_CANNON_VOICES){
      const oldest=activeCannonVoices.shift();
      oldest.pause();oldest.currentTime=0;
    }
    activeCannonVoices.push(sound);
    sound.addEventListener('ended',()=>{
      const i=activeCannonVoices.indexOf(sound);
      if(i>=0)activeCannonVoices.splice(i,1);
    },{once:true});
  }
  if(id==='introKey'){
    // Digitador curto e musicalmente neutro: evita pilha de cliques.
    for(let i=activeTypingVoices.length-1;i>=0;i--)
      if(activeTypingVoices[i].ended||activeTypingVoices[i].paused)
        activeTypingVoices.splice(i,1);
    if(activeTypingVoices.length>=MAX_TYPING_VOICES){
      const oldest=activeTypingVoices.shift();oldest.pause();oldest.currentTime=0;
    }
    activeTypingVoices.push(sound);
    sound.addEventListener('ended',()=>{
      const i=activeTypingVoices.indexOf(sound);
      if(i>=0)activeTypingVoices.splice(i,1);
    },{once:true});
  }
  sound.volume=Math.max(0,Math.min(1,volume*volumeScale*randomSfxVolumeScale(id)));
  sound.playbackRate=randomSfxPlaybackRate(id);
  sound.play()?.catch?.(()=>{});
}
// Uma única voz por loop, reutilizada entre frames sem reiniciar áudio.
export function setSfxLoopActive(id,active,{volumeScale=1}={}){
  if(!FILES[id])return;
  const previous=activeLoops.get(id);
  if(!active||!enabled||volume<=0||typeof Audio==='undefined'){
    if(previous){previous.sound.pause();previous.sound.currentTime=0;activeLoops.delete(id);}
    return;
  }
  if(previous){
    previous.sound.volume=Math.max(0,Math.min(1,volume*volumeScale));
    return;
  }
  prepareSfx();
  const source=clips.get(id);
  if(!source)return;
  const sound=source.cloneNode();
  sound.loop=true;
  sound.volume=Math.max(0,Math.min(1,volume*volumeScale));
  activeLoops.set(id,{sound});
  sound.play()?.catch?.(()=>{});
}
export function stopRussianSfxLoops(){
  setSfxLoopActive('ruSputnikHum',false);
  setSfxLoopActive('ruIceBreath',false);
}
export function stopNationalSpecialSfxLoops(){
  setSfxLoopActive('brBonfire',false);
  setSfxLoopActive('krDiscoSpin',false);
}
export function setSfxVolume(value){
  volume=Math.max(0,Math.min(1,Number(value)||0));
  if(volume===0)for(const id of activeLoops.keys())setSfxLoopActive(id,false);
}
export function getSfxVolume(){return volume;}
export function setSfxEnabled(value){
  enabled=Boolean(value);
  if(!enabled)for(const id of activeLoops.keys())setSfxLoopActive(id,false);
}
export {FILES as SFX_FILES};
