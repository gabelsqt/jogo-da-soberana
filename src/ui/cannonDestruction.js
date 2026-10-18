import { createTvStaticSound } from '../audio/tvStatic.js';
import { restrictedAimAngle } from '../gameplay/combat.js';

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => { const t = clamp(v); return t * t * (3 - 2 * t); };
export const DESTRUCTION_DURATION = 4800;
export const TV_COLLAPSE_AT = 2700;

export function destructionState(ms) {
  return {
    control: 1 - smooth(ms / 2100),
    gain: 1 - smooth(ms / 1900),
    collapse: smooth((ms - TV_COLLAPSE_AT) / 650),
    line: 1 - smooth((ms - 3400) / 450),
    point: 1 - smooth((ms - 3850) / 300),
    done: ms >= DESTRUCTION_DURATION,
  };
}

// Resposta exponencial mantém a perda de controle consistente em 30/60/120 fps.
export function failingAim(current, target, ms, delta) {
  const { control } = destructionState(ms);
  const fallen = -0.16;
  const desired = target * control + fallen * (1 - control);
  return current + (desired - current) * (1 - Math.exp(-(1.8 + 20 * control) * delta / 1000));
}

// Efeito nativo do Phaser, sem imagens ou shaders adicionais.
// Uma Graphics para as explosões; no máximo uma captura 960x540 para o CRT.
export function createCannonDestruction(scene, { x, y, width = 960, height = 540, onComplete }) {
  const music = scene.music;
  const keyboard = scene.input.keyboard;
  const keyboardEnabled = keyboard?.enabled;
  const canvas = scene.game.canvas;
  const cursor = canvas.style.cursor;
  if (keyboard) keyboard.enabled = false;
  canvas.style.cursor = 'none';
  const block = scene.add.rectangle(width / 2, height / 2, width, height, 0, 0)
    .setDepth(490).setInteractive();
  block.on('pointerdown', (_p, _x, _y, event) => event?.stopPropagation());
  const glow = scene.add.rectangle(x, y - 45, 340, 180, 0xff581b, 0)
    .setDepth(190);
  const fire = scene.add.graphics().setDepth(200);
  const interference = scene.add.graphics().setDepth(480);
  const aim = scene.add.graphics().setDepth(485);
  const objects = [block, glow, fire, interference, aim];
  let elapsed = 0, finished = false, snapshot, black;
  let reticle = { x: scene.input.activePointer.x, y: scene.input.activePointer.y };
  // Detonações concentradas no corpo e na área imediatamente acima do canhão.
  const bursts = Array.from({ length: 30 }, (_, i) => ({
    at: i * 74,
    x: i === 29 ? x : x + Math.sin(i * 2.4) * (i % 4 === 0 ? 125 : 70),
    y: i === 29 ? y - 20 : y - 90 + ((i * 37) % 110),
    radius: i === 29 ? 105 : 22 + (i % 5) * 8,
  }));
  const staticSound = createTvStaticSound(scene);
  scene.cameras.main.shake(2300, 0.0035);

  function cleanup() {
    finished = true;
    staticSound.destroy();
    if (keyboard) keyboard.enabled = keyboardEnabled;
    canvas.style.cursor = cursor;
    for (const object of objects) object.destroy();
    scene.cameras.main.shakeEffect.reset();
    scene.events.off('shutdown', cleanup);
  }
  scene.events.once('shutdown', cleanup);

  return {
    update(delta, pointer) {
      if (finished) return;
      elapsed += Math.min(Math.max(delta, 0), 80);
      const state = destructionState(elapsed);
      music?.setGain(state.gain);
      if (elapsed >= 1900 && music?.audio) music.stop();
      scene.barrel.rotation = scene.aimAngle = failingAim(
        scene.aimAngle, restrictedAimAngle(x, y, pointer.x, pointer.y), elapsed, delta);
      scene.barrel.rotation += Math.PI / 2;
      const response = 1 - Math.exp(-18 * state.control * delta / 1000);
      reticle.x += (pointer.x - reticle.x) * response;
      reticle.y += (pointer.y - reticle.y) * response + (1 - state.control) * delta * 0.025;
      aim.clear();
      if (elapsed < TV_COLLAPSE_AT) {
        aim.lineStyle(2, 0xffb782, 0.8 * (1 - smooth((elapsed - 1400) / 1100)));
        aim.strokeCircle(reticle.x, reticle.y, 12);
        aim.lineBetween(reticle.x - 20, reticle.y, reticle.x + 20, reticle.y);
        aim.lineBetween(reticle.x, reticle.y - 20, reticle.x, reticle.y + 20);
      }
      glow.setAlpha(0.20 * Math.sin(Math.PI * clamp(elapsed / TV_COLLAPSE_AT)));
      fire.clear();
      for (const burst of bursts) {
        const age = elapsed - burst.at;
        if (age < 0 || age > 650) continue;
        const t = age / 650, radius = burst.radius * (0.25 + Math.sin(t * Math.PI / 2));
        fire.fillStyle(0x251d25, (1 - t) * 0.85);
        fire.fillCircle(burst.x, burst.y - t * 35, radius * 1.25);
        fire.fillStyle(0xe54716, (1 - t) * 0.95);
        fire.fillCircle(burst.x, burst.y, radius);
        fire.fillStyle(0xffb837, (1 - t) ** 2);
        fire.fillCircle(burst.x, burst.y, radius * 0.65);
        fire.fillStyle(0xffecc2, (1 - t) ** 3);
        fire.fillCircle(burst.x, burst.y, radius * 0.29);
        for (let j = 0; j < 7; j++) {
          const angle = Math.PI + j * Math.PI / 6;
          const distance = t * burst.radius * 2;
          fire.fillStyle(j % 2 ? 0xffcf70 : 0xe97028, 1 - t);
          fire.fillRect(Math.round(burst.x + Math.cos(angle) * distance),
            Math.round(burst.y + Math.sin(angle) * distance + t * t * 24), 4, 4);
        }
      }
      interference.clear();
      const staticStrength = elapsed < TV_COLLAPSE_AT
        ? smooth((elapsed - 250) / 2200) : 0;
      staticSound.update(staticStrength);
      if (staticStrength > 0) {
        const tick = Math.floor(elapsed / 45);
        // Chuva de ruído em pixels, sem clarões de tela inteira.
        for (let i = 0; i < 280; i++) {
          const seed = (Math.imul(i + tick * 283, 1597334677) >>> 0);
          const xx = seed % width;
          const yy = (seed >>> 12) % height;
          interference.fillStyle(i % 3 === 0 ? 0x061018 : 0xc5dcd5,
            staticStrength * (0.10 + (i % 5) * 0.035));
          interference.fillRect(xx, yy, 2 + seed % 10, 2 + i % 2);
        }
        interference.fillStyle(0xb4d8d1, 0.06 + 0.22 * staticStrength);
        for (let i = 0; i < 22; i++) {
          const yy = (tick * 31 + i * 67) % height;
          interference.fillRect((i * 113 + tick * 17) % 170, yy,
            width - (i * 71) % 260, i % 3 + 1);
        }
        // Faixas de perda de sincronismo atravessam a transmissão.
        for (let i = 0; i < 3; i++) {
          const yy = (elapsed * 0.23 + i * 181) % height;
          interference.fillStyle(0x02080c, 0.22 * staticStrength);
          interference.fillRect(0, yy, width, 9 + i * 4);
          interference.fillStyle(0xc9e7e0, 0.15 * staticStrength);
          interference.fillRect(0, yy + 12, width, 2);
        }
      }
      if (elapsed >= TV_COLLAPSE_AT && !snapshot) {
        scene.cameras.main.shakeEffect.reset();
        // Captura o campo e o HUD antes de adicionar a máscara preta.
        const display = scene.children.list.filter(o => o.visible && o !== block);
        snapshot = scene.add.renderTexture(0, 0, width, height);
        snapshot.draw(display);
        snapshot.setOrigin(0.5).setPosition(width / 2, height / 2).setDepth(501);
        black = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000)
          .setDepth(500);
        objects.push(snapshot, black);
        interference.setDepth(502);
      }
      if (snapshot) {
        snapshot.setScale(1 + state.collapse * 0.03, Math.max(0.002, 1 - state.collapse));
        snapshot.setAlpha(1 - smooth((elapsed - 3250) / 100));
        if (elapsed >= 3200 && elapsed < 3850) {
          interference.fillStyle(0xd8ffff, 0.18);
          interference.fillRect(width / 2 - width * state.line / 2, height / 2 - 5, width * state.line, 10);
          interference.fillStyle(0xf4ffff, 0.95);
          interference.fillRect(width / 2 - width * state.line / 2, height / 2 - 1, width * state.line, 2);
        } else if (elapsed >= 3850 && state.point > 0) {
          interference.fillStyle(0xd8ffff, state.point);
          interference.fillCircle(width / 2, height / 2, 3 * state.point);
        }
      }
      if (state.done) {
        finished = true;
        // Mantém o fundo preto sob o painel de derrota.
        for (const object of scene.children.list) object.setVisible(false);
        const backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000).setDepth(119);
        cleanup();
        music?.stop();
        onComplete(backdrop);
      }
    },
  };
}
