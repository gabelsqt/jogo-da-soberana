// Cenário fixo do Rio, compartilhado pelo menu, jogo e seleção de upgrades.
// Coloque a imagem enviada pelo usuário em:
// public/assets/cenario/rio_fundo_fixo.png
export const RIO_BACKGROUND_KEY = 'rio_fundo_fixo';
export const RIO_BACKGROUND_FILE = 'rio_fundo_fixo.png';
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export function preloadRioBackdrop(scene) {
  scene.load.setPath('assets/cenario');
  scene.load.image(RIO_BACKGROUND_KEY, RIO_BACKGROUND_FILE);
}

export function drawRioBackdrop(scene) {
  return scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, RIO_BACKGROUND_KEY)
    .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
    .setDepth(0);
}
