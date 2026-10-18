import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { MusicPlayer, MUSIC, waveMusic } from '../src/audio/music.js';

test('todas as trilhas existem; ondas e adversários escolhem a música correta', () => {
  for (const file of Object.values(MUSIC)) assert.ok(existsSync(new URL('../public/assets/musicas/' + file, import.meta.url)), file);
  assert.deepEqual(Array.from({ length: 11 }, (_, i) => waveMusic('wave' + i)),
    ['early','early','early','early2','early2','middle','middle','middle','middle','middle','boss']);
  for (const id of ['us','ru','cn','jp']) assert.equal(waveMusic('wave11', { choices: [id] }), id);
  assert.equal(waveMusic('wave11', { choices: ['br'] }), 'boss');
});

function fixture() {
  const audios = [];
  const doc = new EventTarget();
  doc.hidden = false;
  const memory = new Map();
  const storage = { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) };
  const player = new MusicPlayer({ document: doc, storage, createAudio: () => {
    const audio = {
      paused: true, ended: false, plays: 0, deny: false,
      addEventListener() {}, removeAttribute() {}, load() {},
      pause() { this.paused = true; },
      play() { this.plays++; if (this.deny) return Promise.reject(new Error('NotAllowedError'));
        this.paused = false; return Promise.resolve(); },
    };
    audios.push(audio); return audio;
  } });
  return { player, audios, doc, storage };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('troca, pausa e aba oculta nunca deixam trilhas sobrepostas', async () => {
  const { player: p, audios, doc } = fixture();
  p.play('menu'); await settle();
  p.play('menu'); assert.equal(audios.length, 1);
  p.play('early'); await settle();
  assert.equal(audios[0].paused, true); assert.equal(audios[1].paused, false);
  p.setPaused(true); doc.dispatchEvent(new Event('pointerdown'));
  assert.equal(audios[1].paused, true);
  p.setPaused(false); await settle(); assert.equal(audios[1].paused, false);
  doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(audios[1].paused, true);
  doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); await settle();
  assert.equal(audios[1].paused, false);
  p.stop(); doc.dispatchEvent(new Event('pointerdown')); assert.equal(audios[1].paused, true);
  p.destroy();
});

test('autoplay bloqueado recupera no gesto; volume e silêncio persistem', async () => {
  const { player: p, audios, doc, storage } = fixture();
  p.setPaused(true); p.play('menu'); audios[0].deny = true;
  p.setPaused(false); await settle(); assert.equal(audios[0].paused, true);
  audios[0].deny = false; doc.dispatchEvent(new Event('keydown')); await settle();
  assert.equal(audios[0].paused, false);
  p.setVolume(0.7); p.toggleMute(); assert.equal(audios[0].paused, true);
  const restored = new MusicPlayer({ storage });
  assert.equal(restored.volume, 0.7); assert.equal(restored.muted, true);
  restored.destroy(); p.destroy();
});

test('vinheta não reinicia depois de terminar', async () => {
  const { player: p, audios, doc } = fixture();
  p.play('news', { loop: false }); await settle();
  assert.equal(audios[0].loop, false);
  audios[0].ended = true; audios[0].paused = true;
  doc.dispatchEvent(new Event('pointerdown')); assert.equal(audios[0].plays, 1);
  p.destroy();
});

test('fade da destruição não sobrescreve volume salvo; próxima faixa volta ao volume escolhido', async () => {
  const { player: p, audios, storage } = fixture();
  p.setVolume(0.7); p.play('early'); await settle();
  p.setGain(0.2); assert.ok(Math.abs(audios[0].volume - 0.14) < 0.0001);
  const saved = new MusicPlayer({ storage }); assert.equal(saved.volume, 0.7);
  p.play('menu'); assert.equal(audios[1].volume, 0.7);
  saved.destroy(); p.destroy();
});
