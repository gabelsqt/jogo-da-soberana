// Sprites modulares de torres de nível 3: o corpo nunca gira, só a arma lateral.
// Dimensões/pivôs são da arte original aprovada; PNGs de jogo são reduzidos,
// mas .setDisplaySize preserva a proporção e o alinhamento dos encaixes.
import { assetUrl } from '../config/assetUrl.js';

// 'jp' é mantido apenas como identificador legado de gameplay/saves.
export const MECH_VISUALS = {
  br: { body: 'br_caramelo_corpo.png', weapon: 'br_caramelo_arma.png',
    bodySize: [313, 314], weaponSize: [305, 187],
    bodySocket: [144, 155], weaponPivot: [55, 97], scale: 0.2452 },
  us: { body: 'us_aguia_corpo.png', weapon: 'us_aguia_arma.png',
    bodySize: [303, 417], weaponSize: [240, 195],
    bodySocket: [158, 198], weaponPivot: [51, 106], scale: 0.2278 },
  kr: { body: 'kr_kkachi_corpo.png', weapon: 'kr_kkachi_arma.png',
    bodySize: [328, 317], weaponSize: [257, 182],
    bodySocket: [151, 150], weaponPivot: [59, 115], scale: 0.2492 },
  ru: { body: 'ru_urso_corpo.png', weapon: 'ru_urso_arma.png',
    bodySize: [333, 294], weaponSize: [298, 198],
    bodySocket: [128, 176], weaponPivot: [62, 122], scale: 0.2721 },
  cn: { body: 'cn_pandaprime_corpo.png', weapon: 'cn_pandaprime_arma.png',
    bodySize: [262, 248], weaponSize: [221, 196],
    bodySocket: [95, 118], weaponPivot: [61, 122], scale: 0.3065 },
};

export const visualCountryId = (countryId) => countryId === 'jp' ? 'kr' : countryId;

// Sprite sheet v0.32: capivara, bisão, haechi, lobo e dragão.
// Ordem e frames idênticos no navegador e na exportação itch.io.
// Urso de Ferro continua com a arte russa original.
export const SECONDARY_MECH_ATLAS = 'mech_animais_secundarios_v032.png';
export const SECONDARY_MECH_FRAME_SIZE = 112;
export const SECONDARY_MECH_FRAMES = Object.freeze({
  br: 0, us: 1, kr: 2, ru: 3, cn: 4,
});
// Encaixes calibrados à silhueta real de cada frame (112 × 112).
// O Lobo ocupa somente a parte inferior do quadro: seu ombro fica
// 32 px acima do solo, NÃO 63 px como no posicionamento genérico antigo.
export const SECONDARY_MECH_MOUNTS = Object.freeze({
  br: { x: -23, y: -53, weaponFactor: 0.54 },
  us: { x: -23, y: -55, weaponFactor: 0.54 },
  kr: { x: -27, y: -52, weaponFactor: 0.54 },
  ru: { x: -19, y: -31, weaponFactor: 0.48 },
  cn: { x: -25, y: -60, weaponFactor: 0.54 },
});

export function secondaryMechMount(countryId) {
  return SECONDARY_MECH_MOUNTS[visualCountryId(countryId)] ?? null;
}

export function usesSecondaryMechArt(countryId, role) {
  const country = visualCountryId(countryId);
  return role === 'destroyer'
    ? country !== 'ru' && Object.hasOwn(SECONDARY_MECH_FRAMES, country)
    : role === 'swarm' && country === 'ru';
}


// Âncora local no contêiner do animal, cuja posição (0,0) é o chão.
export function mechMountOffset(countryId) {
  const cfg = MECH_VISUALS[visualCountryId(countryId)];
  if (!cfg) return null;
  return {
    x: (cfg.bodySocket[0] - cfg.bodySize[0] / 2) * cfg.scale,
    y: (cfg.bodySocket[1] - cfg.bodySize[1]) * cfg.scale,
  };
}

// A arma só aponta para o hemisfério superior da tela (mira aérea).
export function mechAimAngle(mountX, mountY, targetX, targetY) {
  return Math.atan2(Math.min(-0.01, targetY - mountY), targetX - mountX);
}

// Reflexão horizontal conserva a direção MUNDIAL da mira. A câmera
// não deve fazer o canhão da direita acompanhar o alvo ao contrário.
export function mechLocalAimAngle(mountX, mountY, targetX, targetY, mirrored = false) {
  const worldAngle = mechAimAngle(mountX, mountY, targetX, targetY);
  return mirrored ? Math.PI - worldAngle : worldAngle;
}

export function rotateMechWeapon(currentAngle, targetAngle, radiansPerFrame) {
  const delta = Math.atan2(
    Math.sin(targetAngle - currentAngle), Math.cos(targetAngle - currentAngle),
  );
  const change = Math.min(Math.abs(delta), Math.max(0, radiansPerFrame));
  return currentAngle + Math.sign(delta) * change;
}

export function mechAimAligned(currentAngle, targetAngle, tolerance = 0.18) {
  return Math.abs(Math.atan2(
    Math.sin(targetAngle - currentAngle),
    Math.cos(targetAngle - currentAngle),
  )) <= tolerance;
}

export function preloadMechSprites(scene) {
  for (const [country, cfg] of Object.entries(MECH_VISUALS)) {
    scene.load.image(`mech_${country}_body`, assetUrl(`assets/torres/${cfg.body}`));
    scene.load.image(`mech_${country}_weapon`, assetUrl(`assets/torres/${cfg.weapon}`));
  }
  scene.load.spritesheet('mech_secondary_body',
    assetUrl(`assets/torres/${SECONDARY_MECH_ATLAS}`),
    { frameWidth: SECONDARY_MECH_FRAME_SIZE, frameHeight: SECONDARY_MECH_FRAME_SIZE },
  );
}

export function createMechSprites(scene, countryId, x, y, depth = 26,
  mirrored = false, role = 'swarm') {
  const country = visualCountryId(countryId);
  const cfg = MECH_VISUALS[country];
  if (!cfg) throw new Error(`Torre visual desconhecida: ${countryId}`);
  const secondary = usesSecondaryMechArt(country, role);

  const sprite = scene.add.container(x, y).setDepth(depth);
  if (mirrored) sprite.setScale(-1, 1);
  const body = secondary
    ? scene.add.image(0, 0, 'mech_secondary_body', SECONDARY_MECH_FRAMES[country])
      .setOrigin(0.5, 1).setDisplaySize(93, 93)
    : scene.add.image(0, 0, `mech_${country}_body`)
      .setOrigin(0.5, 1)
      .setDisplaySize(cfg.bodySize[0] * cfg.scale, cfg.bodySize[1] * cfg.scale);
  sprite.add(body);

  // O corpo aprovado fica imóvel e o canhão modular continua girando.
  // Escala reduzida sobre o animal secundário para não encobrir sua arte.
  const secondaryMount = secondary ? secondaryMechMount(country) : null;
  const mount = secondary
    ? { x: secondaryMount.x, y: secondaryMount.y }
    : mechMountOffset(country);
  const weaponScale = cfg.scale * (secondary ? secondaryMount.weaponFactor : 1);
  const weapon = scene.add.image(mount.x, mount.y, `mech_${country}_weapon`)
    .setOrigin(
      cfg.weaponPivot[0] / cfg.weaponSize[0],
      cfg.weaponPivot[1] / cfg.weaponSize[1],
    ).setDisplaySize(cfg.weaponSize[0] * weaponScale, cfg.weaponSize[1] * weaponScale)
    .setRotation(-Math.PI / 3);
  sprite.add(weapon);

  // As novas artes têm um canhão pintado no corpo. Acrescentamos uma
  // extremidade luminosa ao canhão independente para que o jogador veja
  // claramente qual peça gira para acompanhar a nave.
  const barrelLength = (cfg.weaponSize[0] - cfg.weaponPivot[0]) *
    weaponScale * (secondary ? 0.8 : 0.72);
  const muzzleGlow = secondary ? scene.add.circle(0, 0, 3.2, 0xffefac, 0.92)
    .setStrokeStyle(1.3, 0xff754d, 0.9) : null;
  if (muzzleGlow) sprite.add(muzzleGlow);
  const syncMuzzle = () => {
    const localX = mount.x + Math.cos(weapon.rotation) * barrelLength;
    const localY = mount.y + Math.sin(weapon.rotation) * barrelLength;
    muzzleGlow?.setPosition(localX, localY);
    return {
      x: x + (mirrored ? -localX : localX),
      y: y + localY,
    };
  };
  syncMuzzle();

  return {
    sprite, body, weapon, mount, secondary,
    // Posição de encaixe para o indicador circular de recarga.
    // Espelha apenas o X: preserva a altura real de cada animal.
    mountWorldPosition: () => ({
      x: x + (mirrored ? -mount.x : mount.x),
      y: y + mount.y,
    }),
    muzzlePosition: syncMuzzle,
    aimAt(targetX, targetY, dt = 1) {
      const mountWorldX = x + (mirrored ? -mount.x : mount.x);
      const angle = mechLocalAimAngle(
        mountWorldX, y + mount.y, targetX, targetY, mirrored,
      );
      weapon.rotation = rotateMechWeapon(weapon.rotation, angle, 6 * dt);
      syncMuzzle();
      // Só libera o disparo quando o canhão visual está alinhado;
      // o medidor de carga continua completo durante o giro.
      return mechAimAligned(weapon.rotation, angle);
    },
    recoil() {
      scene.tweens.killTweensOf(weapon);
      weapon.setPosition(mount.x, mount.y);
      scene.tweens.add({
        targets: weapon,
        x: mount.x - Math.cos(weapon.rotation) * 6,
        y: mount.y - Math.sin(weapon.rotation) * 6,
        duration: 75,
        yoyo: true,
        ease: 'Sine.easeOut',
        onComplete: () => {
          if (weapon.active) weapon.setPosition(mount.x, mount.y);
        },
      });
    },
    destroy() {
      scene.tweens.killTweensOf(weapon);
      sprite.destroy();
    },
  };
}
