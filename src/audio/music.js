import { assetUrl } from '../config/assetUrl.js';
import { resolveFinalOpponent } from '../gameplay/campaignFinale.js';

export const MUSIC = Object.freeze({
  menu: 'Menu inicial - Soberania.mp3',
  setup: 'Menu 2.mp3',
  upgrades: 'Menu do bar - upgrades.mp3',
  early: 'Ondas Iniciais.mp3',
  early2: 'Ondas Iniciais 2.mp3',
  early3: 'Ondas Iniciais 3.mp3',
  middle: 'Ondas Intermediárias.mp3',
  boss: 'Chefão Alien - onda 10.mp3',
  news: 'plantão cubo news Brasil.mp3',
  ru: 'traição Russa.mp3',
  us: 'traição americana.mp3',
  cn: 'traição china.mp3',
  jp: 'traição coreana.mp3',
  gameOver: 'Game Over.mp3',
  colonUs: 'Colonização Americana.mp3',
  colonRu: 'Colonização Russa- frozen expedition.mp3',
  colonCn: 'Colonização Chinesa - 快遞旋律.mp3',
});

export function waveMusic(mode, campaign = {}) {
  const wave = /^wave(\d+)$/.exec(mode)?.[1];
  if (wave === undefined) return 'early';
  if (+wave === 11) {
    const { country } = resolveFinalOpponent(campaign);
    return country === 'br' ? 'boss' : country;
  }
  if (+wave >= 10) return 'boss';
  if (+wave >= 5) return 'middle';
  if (+wave === 4) return 'early3';
  return +wave === 3 ? 'early2' : 'early';
}

// O epílogo distingue TRAIÇÃO (trilha de combate) de COLONIZAÇÃO
// (resultado narrativo após perder). Coreia ainda aguarda trilha de
// colonização e reutiliza a faixa de traição sem silenciar o final.
export function endingMusic(ending = {}) {
  if (ending.won) return null;
  switch (ending.country) {
    case 'us': return 'colonUs';
    case 'ru': return 'colonRu';
    case 'cn': return 'colonCn';
    case 'jp': return 'jp';
    default: return 'gameOver'; // derrota alienígena Full Brazil
  }
}

const STORAGE_KEY = 'soberania-music-v1';

// Um único elemento de streaming: não decodifica todos os MP3 na memória
// e nunca deixa duas trilhas tocando ao trocar/reiniciar cenas.
export class MusicPlayer {
  constructor({ createAudio = () => new Audio(), storage, document: doc } = {}) {
    this.createAudio = createAudio;
    this.storage = storage;
    this.doc = doc;
    this.volume = 0.4;
    this.gain = 1;
    this.muted = false;
    this.paused = false;
    try {
      const saved = JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null');
      if (Number.isFinite(saved?.volume)) this.volume = Math.max(0, Math.min(1, saved.volume));
      this.muted = saved?.muted === true;
    } catch { /* Armazenamento bloqueado não impede a partida. */ }
    this.unlock = () => this.tryPlay();
    this.visibility = () => this.sync();
    doc?.addEventListener('pointerdown', this.unlock, true);
    doc?.addEventListener('keydown', this.unlock, true);
    doc?.addEventListener('visibilitychange', this.visibility);
  }

  play(key, { loop = true } = {}) {
    if (!MUSIC[key]) { this.stop(); return; }
    if (this.key === key && this.audio?.loop === loop) { this.sync(); return; }
    this.stop();
    this.key = key;
    this.gain = 1;
    const audio = this.audio = this.createAudio();
    audio.preload = 'none';
    audio.src = assetUrl('assets/musicas/' + MUSIC[key]);
    audio.loop = loop;
    audio.volume = this.volume * this.gain;
    audio.addEventListener('error', () => {
      if (this.audio === audio) console.warn('Não foi possível carregar a música:', MUSIC[key]);
    });
    this.sync();
  }

  tryPlay() {
    const audio = this.audio;
    if (!audio || this.pending === audio || !audio.paused || audio.ended ||
        this.paused || this.doc?.hidden || this.muted || this.volume === 0) return;
    this.pending = audio;
    // Autoplay pode ser negado. O próximo clique/tecla tenta novamente.
    try {
      Promise.resolve(audio.play()).catch(() => {}).finally(() => {
        if (this.pending === audio) this.pending = null;
      });
    } catch { this.pending = null; }
  }

  sync() {
    if (!this.audio) return;
    this.audio.volume = this.volume * this.gain;
    this.audio.muted = this.muted;
    if (this.paused || this.doc?.hidden || this.muted || this.volume === 0) this.audio.pause();
    else this.tryPlay();
  }

  setGain(value) {
    this.gain = Math.max(0, Math.min(1, value));
    if (this.audio) this.audio.volume = this.volume * this.gain;
  }
  setPaused(value) { this.paused = value; this.sync(); }
  setVolume(value) {
    if (!Number.isFinite(value)) return;
    this.volume = Math.max(0, Math.min(1, value));
    this.save(); this.sync();
  }
  toggleMute() { this.muted = !this.muted; this.save(); this.sync(); }
  save() {
    try { this.storage?.setItem(STORAGE_KEY, JSON.stringify({ volume: this.volume, muted: this.muted })); }
    catch { /* Preferências continuam válidas nesta sessão. */ }
  }
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.audio = null;
    this.pending = null;
    this.key = null;
  }
  destroy() {
    this.stop();
    this.doc?.removeEventListener('pointerdown', this.unlock, true);
    this.doc?.removeEventListener('keydown', this.unlock, true);
    this.doc?.removeEventListener('visibilitychange', this.visibility);
  }
}

let player;
export function musicPlayer() {
  if (!player) {
    let storage;
    try { storage = globalThis.localStorage; } catch { /* Modo privado. */ }
    player = new MusicPlayer({ storage, document: globalThis.document });
  }
  return player;
}

export function bindSceneMusic(scene, key, options) {
  const music = musicPlayer();
  const owner = {};
  music.owner = owner;
  music.setPaused(false);
  music.play(key, options);
  const pause = () => { if (music.owner === owner) music.setPaused(true); };
  const resume = () => { if (music.owner === owner) music.setPaused(false); };
  scene.events.on('pause', pause);
  scene.events.on('resume', resume);
  scene.events.once('shutdown', () => {
    scene.events.off('pause', pause);
    scene.events.off('resume', resume);
    if (music.owner === owner) { music.stop(); music.owner = null; }
  });
  return music;
}

export function addMusicControls(scene, y, depth = 50) {
  const music = musicPlayer();
  const label = scene.add.text(480, y, '', {
    fontFamily: 'monospace', fontSize: '13px', color: '#b6e8df',
    backgroundColor: '#102838', padding: { x: 10, y: 6 },
  }).setOrigin(0.5).setDepth(depth).setInteractive({ useHandCursor: true });
  const refresh = () => label.setText(music.muted ? 'MÚSICA: DESLIGADA' : `MÚSICA: ${Math.round(music.volume * 100)}%`);
  label.on('pointerdown', (_p, _x, _y, event) => {
    event?.stopPropagation(); music.toggleMute(); refresh();
  });
  for (const [x, symbol, delta] of [[350, '−', -0.1], [610, '+', 0.1]]) {
    const button = scene.add.text(x, y, symbol, {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#18364c', padding: { x: 12, y: 3 },
    }).setOrigin(0.5).setDepth(depth).setInteractive({ useHandCursor: true });
    button.on('pointerdown', (_p, _x, _y, event) => {
      event?.stopPropagation(); music.setVolume(Math.round((music.volume + delta) * 10) / 10); refresh();
    });
  }
  refresh();
}


// Controle compacto da tela inicial. Fica recolhido no canto inferior esquerdo;
// clicar em MÚSICA abre o volume, sem poluir a arte do Rio.
// Os controles completos das outras telas continuam usando addMusicControls.
export function addMenuMusicControl(scene,{x=91,y=518,depth=40}={}){
  const music=musicPlayer();
  const font="'IBM Plex Sans',system-ui,sans-serif";
  const dock=scene.add.rectangle(x,y,143,32,0x0b1621,0.86)
    .setStrokeStyle(1,0x67869b,0.65).setDepth(depth)
    .setInteractive({useHandCursor:true});
  const dockLabel=scene.add.text(x,y,'♫  MÚSICA',{
    fontFamily:font,fontSize:'13px',fontStyle:'bold',color:'#e9eff1',
  }).setOrigin(0.5).setDepth(depth+1);

  const py=y-76,px=x+82,objects=[];
  const add=(obj)=>{objects.push(obj);return obj;};
  add(scene.add.rectangle(px,py,330,65,0x0b1621,0.96)
    .setStrokeStyle(1,0x67869b,0.82).setDepth(depth+2));
  add(scene.add.text(px-148,py-20,'VOLUME',{
    fontFamily:font,fontSize:'12px',fontStyle:'bold',color:'#dce8ee',
  }).setDepth(depth+3));
  const percent=add(scene.add.text(px+82,py-20,'',{
    fontFamily:font,fontSize:'12px',color:'#ffcd8c',
  }).setDepth(depth+3));
  const left=px-112,right=px+58,trackY=py+11;
  const track=add(scene.add.rectangle((left+right)/2,trackY,right-left,7,0x547c92)
    .setDepth(depth+3).setInteractive({useHandCursor:true}));
  const fill=add(scene.add.rectangle(left,trackY,1,7,0xe2a45e).setOrigin(0,0.5).setDepth(depth+4));
  const thumb=add(scene.add.circle(left,trackY,9,0xffdda5)
    .setStrokeStyle(2,0x142536).setDepth(depth+5).setInteractive({useHandCursor:true}));
  const mute=add(scene.add.rectangle(px+115,py+11,69,28,0x244358)
    .setStrokeStyle(1,0x86a6bd).setDepth(depth+4).setInteractive({useHandCursor:true}));
  const muteLabel=add(scene.add.text(px+115,py+11,'',{
    fontFamily:font,fontSize:'11px',fontStyle:'bold',color:'#f2f5f7',
  }).setOrigin(0.5).setDepth(depth+5));
  let expanded=false,dragging=false;
  const refresh=()=>{
    const vol=Math.max(0,Math.min(1,music.volume));
    thumb.setPosition(left+(right-left)*vol,trackY);
    // Rectangle é um Shape; escalar o traço de 1px evita depender de setDisplaySize.
    fill.setScale(Math.max(1,(right-left)*vol),1);
    percent.setText(Math.round(vol*100)+'%');
    muteLabel.setText(music.muted?'LIGAR':'MUDO');
  };
  const show=value=>{
    expanded=value;
    for(const object of objects)object.setVisible(value);
    if(!value)dragging=false;
    refresh();
  };
  const setFromPointer=pointer=>{
    const vol=Math.round(Math.max(0,Math.min(1,(pointer.x-left)/(right-left)))*100)/100;
    music.setVolume(vol);refresh();
  };
  dock.on('pointerdown',(pointer,_x,_y,event)=>{
    if(!pointer.leftButtonDown())return;
    event?.stopPropagation();show(!expanded);
  });
  for(const control of [track,thumb]){
    control.on('pointerdown',(pointer,_x,_y,event)=>{
      if(!pointer.leftButtonDown())return;
      event?.stopPropagation();dragging=true;setFromPointer(pointer);
    });
  }
  const move=pointer=>{if(expanded&&dragging&&pointer.leftButtonDown())setFromPointer(pointer);};
  const up=()=>{dragging=false;};
  scene.input.on('pointermove',move);
  scene.input.on('pointerup',up);
  mute.on('pointerdown',(pointer,_x,_y,event)=>{
    if(!pointer.leftButtonDown())return;
    event?.stopPropagation();music.toggleMute();refresh();
  });
  scene.events.once('shutdown',()=>{
    scene.input.off('pointermove',move);
    scene.input.off('pointerup',up);
  });
  show(false);
  return {dock,show,refresh};
}
