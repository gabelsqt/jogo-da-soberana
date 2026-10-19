// Responsividade de apresentação; a lógica e as coordenadas do jogo
// permanecem SEMPRE em 960 × 540 (16:9). O Phaser.Scale.FIT cuida da imagem.
// Esta camada lida com orientação, safe area via CSS e resize no navegador.

export function shouldShowRotateNotice({
  width, height, coarsePointer, screenOrientation = '',
}) {
  if (!coarsePointer || !(width > 0) || !(height > 0)) return false;
  // Em iframes (itch.io), a área do jogo pode já ser 16:9 enquanto o aparelho
  // físico ainda está em retrato. Priorizar também a orientação do dispositivo.
  return height > width || String(screenOrientation).startsWith('portrait');
}

// A faixa externa ocupa 44 unidades lógicas abaixo das 540 do Phaser.
// Escalar a composição inteira preserva mira, resolução e pixel art 16:9.
export const CUBO_TICKER_LOGICAL_HEIGHT = 44;
export function fitBroadcastLayout({
  width, height, tickerVisible = false,
}) {
  const gameHeight = 540;
  const totalHeight = gameHeight + (tickerVisible ? CUBO_TICKER_LOGICAL_HEIGHT : 0);
  const scale = Math.max(0, Math.min(
    Math.max(0, width) / 960, Math.max(0, height) / totalHeight,
  ));
  return {
    width: 960 * scale,
    height: totalHeight * scale,
    gameHeight: gameHeight * scale,
    tickerHeight: tickerVisible ? CUBO_TICKER_LOGICAL_HEIGHT * scale : 0,
    scale,
  };
}

export function installResponsiveViewport(game, {
  root, notice, environment,
}) {
  const win = environment;
  const coarseQuery = win.matchMedia?.('(pointer: coarse)');
  let gameReady = false;
  let pausedForRotation = false;
  let pendingFrame = null;
  let destroyed = false;
  const broadcast = root.querySelector?.('#broadcast') ?? null;
  const gameRegion = broadcast?.querySelector?.('#game') ?? null;
  const tickerRegion = broadcast?.querySelector?.('#cubo-news-overlay') ?? null;

  function fitComposition() {
    if (!broadcast || !gameRegion || !tickerRegion) return;
    // root.clientWidth/Height incluem padding de safe area.
    const css = win.getComputedStyle?.(root);
    const left = Number.parseFloat(css?.paddingLeft) || 0;
    const right = Number.parseFloat(css?.paddingRight) || 0;
    const top = Number.parseFloat(css?.paddingTop) || 0;
    const bottom = Number.parseFloat(css?.paddingBottom) || 0;
    const width = Math.max(1, (root.clientWidth || win.innerWidth) - left - right);
    const height = Math.max(1, (root.clientHeight || win.innerHeight) - top - bottom);
    const showNews = broadcast.dataset?.cuboNews === 'visible';
    const layout = fitBroadcastLayout({ width, height, tickerVisible: showNews });
    broadcast.style.width = layout.width + 'px';
    broadcast.style.height = layout.height + 'px';
    gameRegion.style.height = layout.gameHeight + 'px';
    tickerRegion.style.height = layout.tickerHeight + 'px';
  }

  function sync() {
    if (destroyed) return;
    const visual = win.visualViewport;
    const rotate = shouldShowRotateNotice({
      width: visual?.width || win.innerWidth,
      height: visual?.height || win.innerHeight,
      coarsePointer: Boolean(coarseQuery?.matches),
      screenOrientation: win.screen?.orientation?.type ?? '',
    });

    root.classList.toggle('portrait-mode', rotate);
    notice.hidden = !rotate;
    fitComposition();

    if (!gameReady) return;

    if (rotate && !game.isPaused) {
      game.pause();
      pausedForRotation = true;
    } else if (!rotate && pausedForRotation) {
      // Só retomamos a pausa que ESTA camada iniciou, sem substituir
      // indiscriminadamente pausas criadas por outros sistemas.
      game.resume();
      pausedForRotation = false;
    }

    // O iframe do itch.io e as barras móveis do navegador podem mudar
    // de tamanho sem disparar os eventos que o ScaleManager costuma ouvir.
    game.scale.refresh();
  }

  function scheduleSync() {
    if (destroyed || pendingFrame !== null) return;
    pendingFrame = win.requestAnimationFrame(() => {
      pendingFrame = null;
      sync();
    });
  }

  const onFirstRender = () => {
    gameReady = true;
    sync();
  };

  win.addEventListener('resize', scheduleSync);
  // Entrada/saída de GameScene troca entre 960×540 e 960×584.
  game.events.on?.('cubo-layout-change', scheduleSync);
  win.addEventListener('orientationchange', scheduleSync);
  win.visualViewport?.addEventListener('resize', scheduleSync);
  win.screen?.orientation?.addEventListener?.('change', scheduleSync);
  coarseQuery?.addEventListener?.('change', scheduleSync);

  // Não pausar Phaser antes do primeiro frame: sua criação pode ser assíncrona.
  // A mensagem do retrato, porém, já é exibida imediatamente.
  game.events.once('postrender', onFirstRender);
  sync();

  return {
    refresh: sync,
    destroy() {
      if (destroyed) return;
      if (pausedForRotation) {
        game.resume();
        pausedForRotation = false;
      }
      destroyed = true;
      if (pendingFrame !== null) win.cancelAnimationFrame(pendingFrame);
      win.removeEventListener('resize', scheduleSync);
      game.events.off?.('cubo-layout-change', scheduleSync);
      win.removeEventListener('orientationchange', scheduleSync);
      win.visualViewport?.removeEventListener('resize', scheduleSync);
      win.screen?.orientation?.removeEventListener?.('change', scheduleSync);
      coarseQuery?.removeEventListener?.('change', scheduleSync);
      game.events.off('postrender', onFirstRender);
    },
  };
}
