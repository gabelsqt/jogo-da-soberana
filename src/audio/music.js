import { assetUrl } from '../config/assetUrl.js';
import { resolveFinalOpponent } from '../gameplay/campaignFinale.js';

export const MUSIC = Object.freeze({
  menu: 'Menu inicial - Soberania.mp3',
  setup: 'Menu 2.mp3',
  upgrades: 'Menu do bar - upgrades.mp3',
  early: 'Ondas Iniciais.mp3',
  early2: 'Ondas Iniciais 2.mp3',
  middle: 'Ondas Intermediárias.mp3',
  boss: 'Chefão Alien - onda 10.mp3',
  news: 'plantão cubo news Brasil.mp3',
  ru: 'traição Russa.mp3',
  us: 'traição americana.mp3',
  cn: 'traição china.mp3',
  jp: 'traição coreana.mp3',
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
  return +wave >= 3 ? 'early2' : 'early';
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
    const audio = this.audio = this.createAudio();
    audio.preload = 'none';
    audio.src = assetUrl('assets/musicas/' + MUSIC[key]);
    audio.loop = loop;
    audio.volume = this.volume;
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
    this.audio.volume = this.volume;
    this.audio.muted = this.muted;
    if (this.paused || this.doc?.hidden || this.muted || this.volume === 0) this.audio.pause();
    else this.tryPlay();
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
