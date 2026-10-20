// Efeitos sintetizados em Python (pacote Soberania Sound FX v1).
// Falhas de download não impedem o jogo de funcionar.
import {assetUrl} from '../config/assetUrl.js';
const FILES=Object.freeze({
  cannon:'01_canhao_principal.wav',
  laser:'02_laser_alienigena.wav',
  shieldOn:'03_escudo_ativar.wav',
  shieldBreak:'04_escudo_estilhacar.wav',
  explosion:'05_explosao_nave.wav',
  boss:'06_explosao_chefe.wav',
  upgrade:'07_upgrade_adquirido.wav',
  betrayal:'08_alerta_traicao.wav',
  supreme:'09_supremo_carregamento.wav',
  shieldHit:'10_impacto_escudo.wav',
});
const clips=new Map(), lastPlayed=new Map();
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
  sound.volume=Math.max(0,Math.min(1,volume*volumeScale));
  sound.play()?.catch?.(()=>{});
}
export function setSfxVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));}
export function getSfxVolume(){return volume;}
export function setSfxEnabled(value){enabled=Boolean(value);}
export {FILES as SFX_FILES};
