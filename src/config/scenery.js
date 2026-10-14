// Camadas originais do cenário do Rio, compartilhadas pelo jogo e menu.
export const SKY_LAYERS = [
  '01_ceu_noturno_estrelado',
  '02_lua_e_nuvens',
  '03_montanhas_distantes',
  '04_baia_e_reflexos',
  '05_pao_de_acucar_e_ilhas',
  '06_cristo_redentor_e_morro',
  '07_horizonte_urbano',
  '08_primeiro_plano_telhados',
];

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export function preloadRioBackdrop(scene) {
  scene.load.setPath('assets/cenario');
  SKY_LAYERS.forEach((name) => scene.load.image(name, `${name}.png`));
}

export function drawRioBackdrop(scene) {
  SKY_LAYERS.forEach((name, depth) => {
    scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, name)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(depth);
  });
}
