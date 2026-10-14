import { assetUrl, isSingleFileBuild, hasEmbeddedAsset } from './assetUrl.js';

// Cenário fixo do Rio, compartilhado por menu, jogo e escolhas de upgrades.
// Arte fornecida: public/assets/cenario/rio_fundo_fixo.png
export const RIO_BACKGROUND_KEY = 'rio_fundo_fixo';
export const RIO_BACKGROUND_FILE = 'rio_fundo_fixo.png';
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

// Fallback temporário: o GitHub só aceita uploads de imagem binária via Git
// local; sem o PNG, o protótipo deve continuar funcionando normalmente.
// Quando o PNG estiver no repositório, SOMENTE a imagem fixa será desenhada.
const LEGACY_SKY_LAYERS = [
  '01_ceu_noturno_estrelado',
  '02_lua_e_nuvens',
  '03_montanhas_distantes',
  '04_baia_e_reflexos',
  '05_pao_de_acucar_e_ilhas',
  '06_cristo_redentor_e_morro',
  '07_horizonte_urbano',
  '08_primeiro_plano_telhados',
];

export function preloadRioBackdrop(scene) {
  // Usar paths completos com setPath('') também suporta imagens data:,
  // sem pedidos HTTP adicionais na exportação single-file para itch.io.
  scene.load.setPath('');
  const fixedPath = `assets/cenario/${RIO_BACKGROUND_FILE}`;
  if (!isSingleFileBuild() || hasEmbeddedAsset(fixedPath)) {
    scene.load.image(RIO_BACKGROUND_KEY, assetUrl(fixedPath));
  }

  // No HTML único, se a imagem nova estiver embutida, as antigas camadas
  // não precisam ser carregadas. O build web normal conserva o fallback.
  if (!isSingleFileBuild() || !hasEmbeddedAsset(fixedPath)) {
    LEGACY_SKY_LAYERS.forEach((name) =>
      scene.load.image(name, assetUrl(`assets/cenario/${name}.png`)));
  }
}

export function drawRioBackdrop(scene) {
  if (scene.textures.exists(RIO_BACKGROUND_KEY)) {
    return scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, RIO_BACKGROUND_KEY)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(0);
  }

  // Só em instalações que ainda não receberam rio_fundo_fixo.png.
  return LEGACY_SKY_LAYERS.map((name, depth) =>
    scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, name)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(depth));
}
