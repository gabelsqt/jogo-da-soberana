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
}

export function createMechSprites(scene, countryId, x, y, depth = 26, mirrored = false) {
  const country = visualCountryId(countryId);
  const cfg = MECH_VISUALS[country];
  if (!cfg) throw new Error(`Torre visual desconhecida: ${countryId}`);

  const sprite = scene.add.container(x, y).setDepth(depth);
  if (mirrored) sprite.setScale(-1, 1);
  const body = scene.add.image(0, 0, `mech_${country}_body`)
    .setOrigin(0.5, 1)
    .setDisplaySize(cfg.bodySize[0] * cfg.scale, cfg.bodySize[1] * cfg.scale);
  sprite.add(body);

  const mount = mechMountOffset(country);
  const weapon = scene.add.image(mount.x, mount.y, `mech_${country}_weapon`)
    .setOrigin(
      cfg.weaponPivot[0] / cfg.weaponSize[0],
      cfg.weaponPivot[1] / cfg.weaponSize[1],
    ).setDisplaySize(cfg.weaponSize[0] * cfg.scale, cfg.weaponSize[1] * cfg.scale)
    .setRotation(-Math.PI / 3);
  sprite.add(weapon);

  return {
    sprite, body, weapon, mount,
    aimAt(targetX, targetY, dt = 1) {
      const mountWorldX = x + (mirrored ? -mount.x : mount.x);
      const worldAngle = mechAimAngle(mountWorldX, y + mount.y, targetX, targetY);
      const angle = mirrored ? Math.PI - worldAngle : worldAngle;
      weapon.rotation = rotateMechWeapon(weapon.rotation, angle, 6 * dt);
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
