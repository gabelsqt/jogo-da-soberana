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

export function installResponsiveViewport(game, {
  root, notice, environment,
}) {
  const win = environment;
  const coarseQuery = win.matchMedia?.('(pointer: coarse)');
  let gameReady = false;
  let pausedForRotation = false;
  let pendingFrame = null;
  let destroyed = false;

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
      win.removeEventListener('orientationchange', scheduleSync);
      win.visualViewport?.removeEventListener('resize', scheduleSync);
      win.screen?.orientation?.removeEventListener?.('change', scheduleSync);
      coarseQuery?.removeEventListener?.('change', scheduleSync);
      game.events.off('postrender', onFirstRender);
    },
  };
}
