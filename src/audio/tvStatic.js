// Ruído de TV sintetizado no contexto já usado pelo Phaser. Sem arquivo extra.
export function createTvStaticSound(scene) {
  const context = scene.sound?.context;
  if (!context || context.state === 'closed') return { update() {}, destroy() {} };
  let source, filter, gain;
  const doc = globalThis.document;
  let strength = 0;
  const applyVolume = () => {
    const music = scene.music;
    const volume = music?.muted || doc?.hidden ? 0 : (music?.volume ?? 0.4);
    if (gain) gain.gain.setTargetAtTime(strength * volume * 0.22, context.currentTime, 0.025);
  };
  const destroy = () => {
    doc?.removeEventListener('visibilitychange', applyVolume);
    try { source?.stop(); } catch { /* Já encerrado. */ }
    source?.disconnect(); filter?.disconnect(); gain?.disconnect();
    source = filter = gain = null;
  };
  try {
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.5), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
    filter = context.createBiquadFilter(); filter.type = 'bandpass';
    filter.frequency.value = 1800; filter.Q.value = 0.65;
    gain = context.createGain(); gain.gain.value = 0;
    source.connect(filter); filter.connect(gain); gain.connect(context.destination);
    source.start();
    doc?.addEventListener('visibilitychange', applyVolume);
  } catch { destroy(); }
  return {
    update(value) { strength = Math.max(0, Math.min(1, value)); applyVolume(); },
    destroy,
  };
}
