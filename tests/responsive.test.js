import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shouldShowRotateNotice, installResponsiveViewport } from '../src/config/responsive.js';

test('o jogo usa 16:9 em telas 960×540 e 1920×1080, sem refazer coordenadas', () => {
  const { width, height } = { width: 960, height: 540 };
  assert.equal(width / height, 1920 / 1080);
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /width:\s*960/);
  assert.match(main, /height:\s*540/);
  assert.match(main, /mode:\s*Phaser\.Scale\.FIT/);
  assert.match(main, /autoCenter:\s*Phaser\.Scale\.CENTER_BOTH/);
  assert.match(main, /installResponsiveViewport\(game,/);
});

test('mensagem de rotação só aparece em tela vertical com toque', () => {
  const needs = (width, height, coarsePointer, screenOrientation = '') =>
    shouldShowRotateNotice({ width, height, coarsePointer, screenOrientation });
  assert.equal(needs(390, 844, true), true);
  assert.equal(needs(430, 932, true), true);
  assert.equal(needs(820, 1180, true), true);
  assert.equal(needs(844, 390, true), false);
  assert.equal(needs(1920, 1080, false), false);
  assert.equal(needs(800, 1000, false), false,
    'desktop estreito não deve receber alerta de celular');
  assert.equal(needs(960, 540, true, 'portrait-primary'), true,
    'itch.io pode hospedar um iframe 16:9 dentro de um celular em retrato');
  assert.equal(needs(960, 540, true, 'landscape-primary'), false);
  assert.equal(needs(0, 0, true, 'portrait-primary'), false);
});

function emitter() {
  const events = new Map();
  return {
    addEventListener(event, listener) {
      if (!events.has(event)) events.set(event, new Set());
      events.get(event).add(listener);
    },
    removeEventListener(event, listener) {
      events.get(event)?.delete(listener);
    },
    emit(event) {
      for (const listener of [...(events.get(event) ?? [])]) listener();
    },
  };
}

function makeFixture({ width = 390, height = 844, touch = true } = {}) {
  const viewport = { ...emitter(), width, height };
  const orientation = { ...emitter(), type: width < height
    ? 'portrait-primary' : 'landscape-primary' };
  const coarseMedia = { ...emitter(), matches: touch };
  const win = {
    ...emitter(),
    innerWidth: width,
    innerHeight: height,
    visualViewport: viewport,
    screen: { orientation },
    matchMedia: () => coarseMedia,
    frames: new Map(),
    nextFrame: 1,
    requestAnimationFrame(fn) {
      const id = this.nextFrame++;
      this.frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame(id) { this.frames.delete(id); },
    flush() {
      const frames = [...this.frames.values()];
      this.frames.clear();
      for (const fn of frames) fn();
    },
  };
  const eventListeners = new Map();
  const game = {
    events: {
      once(name, handler) { eventListeners.set(name, handler); },
      off(name) { eventListeners.delete(name); },
      emit(name) {
        const handler = eventListeners.get(name);
        eventListeners.delete(name);
        handler?.();
      },
    },
    isPaused: false,
    pauseCalls: 0,
    resumeCalls: 0,
    refreshCalls: 0,
    pause() { this.isPaused = true; this.pauseCalls += 1; },
    resume() { this.isPaused = false; this.resumeCalls += 1; },
    scale: { refresh() { game.refreshCalls += 1; } },
  };
  const classes = new Set();
  const root = {
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
      contains(name) { return classes.has(name); },
    },
  };
  const notice = { hidden: true };
  return { game, root, notice, win, viewport, orientation, coarseMedia };
}

test('celular vertical recebe aviso imediatamente e pausa só após primeiro frame', () => {
  const fixture = makeFixture();
  const { game, win, root, notice, viewport, orientation } = fixture;
  const responsive = installResponsiveViewport(game, {
    root, notice, environment: win,
  });
  assert.equal(notice.hidden, false);
  assert.equal(root.classList.contains('portrait-mode'), true);
  assert.equal(game.pauseCalls, 0, 'não pausar Phaser antes do primeiro render');

  game.events.emit('postrender');
  assert.equal(game.isPaused, true);
  assert.equal(game.pauseCalls, 1);
  assert.ok(game.refreshCalls >= 1);

  viewport.width = 844;
  viewport.height = 390;
  orientation.type = 'landscape-primary';
  win.emit('resize');
  win.flush();
  assert.equal(notice.hidden, true);
  assert.equal(root.classList.contains('portrait-mode'), false);
  assert.equal(game.isPaused, false);
  assert.equal(game.resumeCalls, 1);

  viewport.width = 390;
  viewport.height = 844;
  orientation.type = 'portrait-primary';
  orientation.emit('change');
  win.flush();
  assert.equal(notice.hidden, false);
  assert.equal(game.pauseCalls, 2);
  responsive.destroy();
  assert.equal(game.resumeCalls, 2, 'desmontar aviso não deixa jogo travado');
});

test('responsividade não despausa um jogo já pausado por outro motivo', () => {
  const { game, root, notice, win, viewport, orientation } = makeFixture();
  game.isPaused = true;
  const responsive = installResponsiveViewport(game, {
    root, notice, environment: win,
  });
  game.events.emit('postrender');
  assert.equal(game.pauseCalls, 0);
  viewport.width = 844;
  viewport.height = 390;
  orientation.type = 'landscape-primary';
  win.emit('orientationchange');
  win.flush();
  assert.equal(game.resumeCalls, 0);
  assert.equal(game.isPaused, true);
  responsive.destroy();
});

test('resize da viewport força recálculo da escala mesmo sem mudar a orientação', () => {
  const { game, root, notice, win, viewport } =
    makeFixture({ width: 1280, height: 720, touch: false });
  const responsive = installResponsiveViewport(game, {
    root, notice, environment: win,
  });
  game.events.emit('postrender');
  const before = game.refreshCalls;
  viewport.width = 1920;
  viewport.height = 1080;
  viewport.emit('resize');
  win.flush();
  assert.ok(game.refreshCalls > before);
  assert.equal(game.pauseCalls, 0);
  assert.equal(notice.hidden, true);
  responsive.destroy();
  const last = game.refreshCalls;
  win.emit('resize');
  win.flush();
  assert.equal(game.refreshCalls, last, 'sem eventos pendentes após cleanup');
});

test('HTML respeita safe areas, barras móveis, pixel art e orientação', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /100dvh/);
  for (const inset of ['top', 'right', 'bottom', 'left']) {
    assert.ok(html.includes(`env(safe-area-inset-${inset}`));
  }
  assert.match(html, /id="viewport"/);
  assert.match(html, /id="game"/);
  assert.match(html, /id="rotate-notice"/);
  assert.match(html, /image-rendering:\s*pixelated/);
  assert.match(html, /#rotate-notice\[hidden\]/);
  assert.match(html, /role="status"/);
});
