import Phaser from 'phaser';
import { SKY_LAYERS } from '../config/scenery.js';
import {
  restrictedAimAngle,
  availableDefenseTargets,
  positionOnRoute,
  routeLength,
  applyShieldedHit,
  applyRecoilImpulse,
  advanceRouteWithRecoil,
} from '../gameplay/combat.js';
import {
  specialBlastRadius,
  blastCatchesTarget,
  SPECIAL_BLAST_DURATION,
} from '../gameplay/specialBlast.js';
import {
  ENEMY_SHOT_COLOR, enemyStats, enemyContactRadius,
  lineFormationX, orbitalFormationPosition, bossCruiseX,
} from '../gameplay/enemies.js';
import {
  getFirstUpgrade, combatStatsFor, shotAngles, shotVisualFor,
  combatStatsForLoadout, normalizeLabUpgrades, toggleLabUpgrade,
} from '../gameplay/upgrades.js';
import {
  MODES, getWaveEvents, waveIsFinished, WAVE_COUNTDOWN_SECONDS,
} from '../gameplay/waves.js';
import { addMenuButton } from '../ui/menuButton.js';
import {
  normalizeCampaignState, unlockedFirstUpgrades,
  activeTowerCountries,
} from '../gameplay/progression.js';
import {
  TOWER_DEFINITIONS, SUPPORT_TOWER_POSITIONS,
  towerDefinition, chooseTowerAttackTarget, canInstallTower,
} from '../gameplay/towers.js';
import {
  PLASMA_EVERY_SHOTS,
  PLASMA_DAMAGE,
  PLASMA_HALF_WIDTH,
  PLASMA_RANGE,
  FRAGMENT_RADIUS,
  FRAGMENT_DAMAGE,
  isPlasmaShot,
  laserHitsTarget,
  fragmentHitsTarget,
} from '../gameplay/weaponEffects.js';

const W = 960;
const H = 540;
const CANNON = { x: 480, y: 494 };
const SHIELD_REGEN_RATE = 3.5;
const SHIELD_REGEN_DELAY = 4000;
const ENEMY_IMPACT_DAMAGE = 46;
const ENEMY_BULLET_DAMAGE = 24;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data = {}) {
    this.mode = MODES[data.mode] ? data.mode : 'wave0';
    // Compatibilidade com saves antigos que tinham apenas "upgradeId".
    const legacy = getFirstUpgrade(data.upgradeId) && this.mode === 'wave1'
      ? { choices: [data.upgradeId] } : {};
    this.campaign = normalizeCampaignState(data.campaign ?? legacy);
    this.upgradeId = this.campaign.choices.at(-1) ?? null;
    this.upgradeIds = this.mode === 'upgradeLab'
      ? normalizeLabUpgrades(data.upgradeIds) : [];
    this.labTowerIds = this.mode === 'upgradeLab'
      ? [...new Set(Array.isArray(data.labTowerIds) ? data.labTowerIds : [])]
        .filter((id) => towerDefinition(id)).slice(0, 2)
      : [];
    const firstUpgrades = unlockedFirstUpgrades(this.campaign);
    this.combat = this.mode === 'upgradeLab'
      ? combatStatsForLoadout(this.upgradeIds)
      : combatStatsForLoadout(firstUpgrades);
  }

  getRunOptions() {
    if (this.mode === 'upgradeLab') {
      return {
        mode: this.mode, upgradeIds: [...this.upgradeIds],
        labTowerIds: [...this.labTowerIds],
      };
    }
    return { mode: this.mode, campaign: normalizeCampaignState(this.campaign) };
  }

  setUpgradesForLab(ids) {
    if (this.mode !== 'upgradeLab') return;
    this.upgradeIds = normalizeLabUpgrades(ids);
    this.combat = combatStatsForLoadout(this.upgradeIds);
    // Não exige espera para experimentar a nova cadência ao retornar ao campo.
    this.lastBasicFire = this.time.now - this.combat.basicInterval;
    // Testes recomeçam com uma carga previsível após trocar de país.
    this.basicShotCount = 0;
  }

  toggleUpgradeForLab(id) {
    this.setUpgradesForLab(toggleLabUpgrade(this.upgradeIds, id));
  }

  openUpgradeLab() {
    if (this.mode !== 'upgradeLab' || this.scene.isActive('UpgradeLabScene')) return;
    this.scene.pause();
    this.scene.launch('UpgradeLabScene', {
      selectedIds: [...this.upgradeIds], selectedTowerIds: [...this.labTowerIds],
    });
  }

  clearTestEnemies() {
    if (this.mode !== 'upgradeLab' && this.mode !== 'lab') return;
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) this.removeEnemy(i);
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) this.removeEnemyBullet(i);
    for (const bullet of this.projectiles) bullet.sprite.destroy();
    this.projectiles.length = 0;
    for (const blast of this.specialBlasts) blast.graphics.destroy();
    this.specialBlasts.length = 0;
    for (const bullet of this.supportProjectiles) bullet.sprite.destroy();
    this.supportProjectiles.length = 0;
  }

  preload() {
    this.load.setPath('assets/cenario');
    SKY_LAYERS.forEach((name) => this.load.image(name, name + '.png'));
    this.load.setPath('assets/inimigos/tipo1');
    for (let frame = 1; frame <= 4; frame += 1) {
      this.load.image('tipo1_' + frame, 'frame_' + String(frame).padStart(2, '0') + '.png');
    }
  }

  create() {
    this.input.mouse?.disableContextMenu();

    SKY_LAYERS.forEach((name, depth) => {
      this.add.image(W / 2, H / 2, name).setDisplaySize(W, H).setDepth(depth);
    });

    if (!this.anims.exists('tipo1_voo')) {
      this.anims.create({
        key: 'tipo1_voo',
        frames: [1, 2, 3, 4].map((i) => ({ key: 'tipo1_' + i })),
        frameRate: 4.5,
        repeat: -1,
      });
    }

    this.enemies = [];
    this.projectiles = [];
    this.enemyBullets = [];
    this.specialBlasts = [];
    this.supportTowers = [];
    this.supportProjectiles = [];
    this.nextEnemyId = 1;
    this.nextBlastId = 1;
    this.elapsed = 0;
    this.countdownActive = false;
    this.eventsSpawned = 0;
    this.waveEvents = getWaveEvents(this.mode);
    this.lastBasicFire = -this.combat.basicInterval;
    this.basicShotCount = 0;
    this.lastSpecialFire = -this.combat.specialCooldown;
    this.tutorialComplete = false;
    this.gameOver = false;
    this.cannonHealth = 100;
    this.shield = 80;
    this.shieldMax = 80;
    this.lastDamageAt = -10000;
    this.aimAngle = -Math.PI / 2;

    this.createTurret();
    this.shieldGraphics = this.add.graphics().setDepth(23);
    this.enemyHealthGraphics = this.add.graphics().setDepth(27);
    this.towerStatusGraphics = this.add.graphics().setDepth(35);
    this.createSupportTowers();
    this.createHud();
    this.drawShield();

    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) this.shootSpecial(pointer);
    });
    this.input.keyboard.on('keydown-R', () => this.scene.restart(this.getRunOptions()));
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    if (this.mode === 'wave0' || this.mode === 'wave1' || this.mode === 'wave2') {
      this.startWaveCountdown();
    } else {
      this.scheduleWaveEvents();
    }

    if (this.mode === 'upgradeLab') {
      // Alvos de treino misturam resistentes e frágeis: dano, perfuração e
      // cadência passam a ter comparações perceptíveis no mesmo cenário.
      this.time.addEvent({
        delay: 2700,
        loop: true,
        callback: () => {
          if (!this.tutorialComplete && this.enemies.length < 10) this.spawnEnemy(1);
        },
      });
      this.time.addEvent({
        delay: 6700,
        loop: true,
        callback: () => {
          if (!this.tutorialComplete && this.enemies.length < 12) this.spawnEnemy(2);
        },
      });
      this.time.addEvent({
        delay: 12500,
        loop: true,
        callback: () => {
          if (!this.tutorialComplete && this.enemies.length < 12) this.spawnEnemy(3);
        },
      });
      this.input.keyboard.on('keydown-U', () => {
        if (this.scene.isActive('GameScene')) this.openUpgradeLab();
      });
      // Exibe a seleção logo ao entrar; ela pode ser reaberta com U.
      this.time.delayedCall(1, () => this.openUpgradeLab());
    }
    if (this.mode === 'upgradeLab' || this.mode === 'lab') {
      this.input.keyboard.on('keydown', (event) => {
        if (!this.scene.isActive('GameScene') || this.tutorialComplete) return;
        // Event.code identifica a tecla física mesmo com Shift pressionado,
        // quando event.key vira !, @, #, etc.
        const match = /^(?:Digit|Numpad)([1-5])$/.exec(event.code || '');
        if (!match) return;
        const type = Number(match[1]);
        const level = event.shiftKey ? 2 : 1;
        this.spawnWaveEvent({
          type, level,
          group: type === 2 && level === 1,
          pattern: level === 2 && type === 1 ? 'line'
            : level === 2 && type === 2 ? 'orbit' : undefined,
          count: 10,
        });
        if (level === 2 && type >= 3) {
          this.showAttackWarning('TIPO ' + type + ' • NÍVEL 2');
        }
      });
      this.input.keyboard.on('keydown-C', () => {
        if (this.scene.isActive('GameScene')) this.clearTestEnemies();
      });
    }
  }

  scheduleWaveEvents() {
    this.waveEvents.forEach((event) => {
      this.time.delayedCall(event.at, () => {
        if (this.tutorialComplete) return;
        this.eventsSpawned += 1;
        this.spawnWaveEvent(event);
      });
    });
  }

  startWaveCountdown() {
    // Os timers e a dificuldade da onda só começam depois do 3, 2, 1.
    // São relógios do próprio Phaser: pausar congela também a contagem.
    this.countdownActive = true;
    this.statusText.setText('PREPARE-SE');
    const shade = this.add.rectangle(W / 2, H / 2, W, H, 0x030b1e, 0.62)
      .setDepth(115);
    const title = this.add.text(W / 2, 170, MODES[this.mode].title, {
      fontFamily: 'monospace', fontSize: '32px', fontStyle: 'bold',
      color: '#f6dfa2', stroke: '#06152d', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(116);
    const number = this.add.text(W / 2, 272, String(WAVE_COUNTDOWN_SECONDS), {
      fontFamily: 'monospace', fontSize: '100px', fontStyle: 'bold',
      color: '#a9f6e2', stroke: '#062b41', strokeThickness: 8,
    }).setOrigin(0.5).setDepth(117);
    const tip = this.add.text(W / 2, 356, 'PREPARE A DEFESA!', {
      fontFamily: 'monospace', fontSize: '19px', color: '#f1f7ff',
    }).setOrigin(0.5).setDepth(116);
    const countdownItems = [shade, title, number, tip];

    for (let n = WAVE_COUNTDOWN_SECONDS - 1; n >= 1; n -= 1) {
      this.time.delayedCall((WAVE_COUNTDOWN_SECONDS - n) * 1000, () => {
        number.setText(String(n));
      });
    }
    this.time.delayedCall(WAVE_COUNTDOWN_SECONDS * 1000, () => {
      countdownItems.forEach((object) => object.destroy());
      this.countdownActive = false;
      this.elapsed = 0;
      this.scheduleWaveEvents();
    });
  }

  createSupportTowers() {
    const selected = this.mode === 'upgradeLab'
      ? this.labTowerIds : activeTowerCountries(this.campaign);
    this.installSupportTowerSet(selected);
  }

  installSupportTowerSet(countryIds) {
    for (const tower of this.supportTowers) tower.sprite.destroy();
    for (const bullet of this.supportProjectiles) bullet.sprite.destroy();
    this.supportProjectiles.length = 0;
    this.supportTowers.length = 0;

    countryIds.slice(0, SUPPORT_TOWER_POSITIONS.length).forEach((id, index) => {
      const definition = towerDefinition(id);
      if (!definition) return;
      const position = SUPPORT_TOWER_POSITIONS[index];
      const { x, y } = position;

      // Placeholders de arte, separados do cenário: silhueta metálica e sigla.
      const sprite = this.add.container(x, y - 12).setDepth(26);
      const base = this.add.rectangle(0, 22, 64, 17, 0x263e52)
        .setStrokeStyle(2, 0x94b5c4);
      const hull = this.add.rectangle(0, 0, 39, 32, definition.color)
        .setStrokeStyle(2, 0xf4faff);
      const visor = this.add.rectangle(0, -7, 23, 6, 0x1a2e42);
      const glyph = this.add.text(0, 6, definition.glyph, {
        fontFamily: 'monospace', fontSize: '19px',
        color: '#091c32', fontStyle: 'bold',
      }).setOrigin(0.5);
      const name = this.add.text(0, 36, definition.label, {
        fontFamily: 'monospace', fontSize: '9px',
        color: '#f4faff', fontStyle: 'bold',
        backgroundColor: '#142438dd', padding: { x: 3, y: 2 },
      }).setOrigin(0.5);
      sprite.add([base, hull, visor, glyph, name]);

      this.supportTowers.push({
        id: 'tower-' + id, countryId: id,
        definition, x, y, shieldRadius: 46,
        sprite,
        health: definition.healthMax,
        healthMax: definition.healthMax,
        shield: definition.shieldMax,
        shieldMax: definition.shieldMax,
        lastDamageAt: -10000,
        lastAttackAt: -definition.interval,
      });
    });
    this.drawShield();
  }

  setLabTowers(ids) {
    if (this.mode !== 'upgradeLab') return false;
    const chosen = [...new Set(ids)].filter((id) => towerDefinition(id));
    if (chosen.length > SUPPORT_TOWER_POSITIONS.length) return false;
    this.labTowerIds = chosen;
    this.installSupportTowerSet(this.labTowerIds);
    return true;
  }

  toggleLabTower(id) {
    if (this.mode !== 'upgradeLab' || !towerDefinition(id)) return false;
    const chosen = this.labTowerIds.includes(id)
      ? this.labTowerIds.filter((item) => item !== id)
      : [...this.labTowerIds, id];
    if (!canInstallTower(this.labTowerIds, id)) return false;
    return this.setLabTowers(chosen);
  }

  updateSupportTowers(dt) {
    for (const tower of this.supportTowers) {
      if (tower.health <= 0) continue;
      if (this.time.now - tower.lastAttackAt < tower.definition.interval) continue;
      const enemy = chooseTowerAttackTarget(
        tower.x, tower.y - 22, this.enemies, tower.definition.range,
      );
      if (!enemy) continue;
      tower.lastAttackAt = this.time.now;
      this.fireTowerWeapon(tower, enemy);
    }
  }

  fireTowerWeapon(tower, enemy) {
    const weapon = tower.definition;
    const fromX = tower.x;
    const fromY = tower.y - 35;

    if (weapon.type === 'laser') {
      const beam = this.add.graphics().setDepth(41);
      beam.lineStyle(11, 0x996af1, 0.22);
      beam.lineBetween(fromX, fromY, enemy.sprite.x, enemy.sprite.y);
      beam.lineStyle(3, 0xedc4ff, 1);
      beam.lineBetween(fromX, fromY, enemy.sprite.x, enemy.sprite.y);
      this.tweens.add({
        targets: beam, alpha: 0, duration: 260,
        onComplete: () => beam.destroy(),
      });
      const index = this.enemies.findIndex((item) => item.uid === enemy.uid);
      if (index >= 0) this.impactInvader(index, weapon.damage, 0, '#e6b1ff');
      return;
    }

    const count = weapon.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const x = fromX + (i - (count - 1) / 2) * 18;
      const y = fromY;
      const dx = enemy.sprite.x - x;
      const dy = enemy.sprite.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const guided = weapon.type === 'missile' || weapon.type === 'drone';
      const bullet = weapon.type === 'shell'
        ? this.add.rectangle(x, y, 12, 14, weapon.color).setStrokeStyle(2, 0xffffff)
        : this.add.circle(x, y, weapon.type === 'bullet' ? 4 : 6, weapon.color)
          .setStrokeStyle(1, 0xffffff, 0.85);
      bullet.setDepth(40);
      this.supportProjectiles.push({
        sprite: bullet,
        targetId: enemy.uid,
        guided, age: 0, speed: weapon.speed, weapon,
        vx: dx / distance * weapon.speed,
        vy: dy / distance * weapon.speed,
      });
    }
  }

  updateSupportProjectiles(dt) {
    for (let i = this.supportProjectiles.length - 1; i >= 0; i -= 1) {
      const shot = this.supportProjectiles[i];
      shot.age += dt;
      if (shot.guided) {
        let target = this.enemies.find((enemy) => enemy.uid === shot.targetId);
        if (!target) {
          target = chooseTowerAttackTarget(
            shot.sprite.x, shot.sprite.y, this.enemies, 850,
          );
          if (target) shot.targetId = target.uid;
        }
        if (target) {
          const dx = target.sprite.x - shot.sprite.x;
          const dy = target.sprite.y - shot.sprite.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          // Acompanhamento suave, sem teleportar mísseis ao mudar de alvo.
          const smooth = Math.min(1, 8 * dt);
          shot.vx = Phaser.Math.Linear(shot.vx, dx / distance * shot.speed, smooth);
          shot.vy = Phaser.Math.Linear(shot.vy, dy / distance * shot.speed, smooth);
        }
      }
      shot.sprite.x += shot.vx * dt;
      shot.sprite.y += shot.vy * dt;

      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
        const enemy = this.enemies[j];
        if (Phaser.Math.Distance.Between(
          shot.sprite.x, shot.sprite.y, enemy.sprite.x, enemy.sprite.y,
        ) > enemyContactRadius(enemy.type) + 7) continue;
        this.impactInvader(
          j, shot.weapon.damage, shot.weapon.knockback ?? 0, '#fff3b9',
        );
        const flash = this.add.circle(
          shot.sprite.x, shot.sprite.y, shot.weapon.type === 'shell' ? 20 : 12,
          shot.weapon.color, 0.45,
        ).setDepth(44);
        this.tweens.add({
          targets: flash, alpha: 0, scale: 1.8, duration: 180,
          onComplete: () => flash.destroy(),
        });
        hit = true;
        break;
      }
      if (hit || shot.age > 5 ||
          shot.sprite.x < -40 || shot.sprite.x > W + 40 ||
          shot.sprite.y < -40 || shot.sprite.y > H + 40) {
        shot.sprite.destroy();
        this.supportProjectiles.splice(i, 1);
      }
    }
  }

  createTurret() {
    const x = CANNON.x;
    const y = CANNON.y;
    this.add.rectangle(x, y + 10, 65, 22, 0x354958).setStrokeStyle(2, 0xa9d0df).setDepth(21);
    this.add.rectangle(x, y + 1, 42, 25, 0x637b88).setStrokeStyle(2, 0xc1d4db).setDepth(22);
    this.barrel = this.add.rectangle(x, y - 20, 11, 47, 0x9daeb6)
      .setStrokeStyle(2, 0xe0edec).setOrigin(0.5, 0.85).setDepth(21);
    this.add.circle(x, y - 1, 12, 0x314f62).setStrokeStyle(2, 0xc4d7dc).setDepth(23);
  }

  createHud() {
    const font = { fontFamily: 'monospace', fontSize: '18px', color: '#f0f7ff' };
    this.add.rectangle(W / 2, 20, W, 40, 0x081528, 0.93).setDepth(100);
    this.add.text(14, 9, 'SOBERANIA | ' + MODES[this.mode].title, font).setDepth(101);
    this.statusText = this.add.text(W - 14, 9, '', font).setOrigin(1, 0).setDepth(101);
    this.tutorialText = this.add.text(W / 2, 55, '', {
      ...font, fontSize: '15px', backgroundColor: '#0b1a2bcc', padding: { x: 9, y: 6 },
    }).setOrigin(0.5, 0).setDepth(101);
    this.healthText = this.add.text(14, H - 28, '', {
      ...font, fontSize: '13px', color: '#e2ebfa',
    }).setDepth(101);

    if (this.mode === 'upgradeLab') {
      this.labUpgradeLabel = this.add.text(14, 98, '', {
        ...font, fontSize: '13px', color: '#a5ffe7',
        backgroundColor: '#0b1a2bcc', padding: { x: 7, y: 3 },
      }).setDepth(102);
      this.labStatsLabel = this.add.text(14, 124, '', {
        ...font, fontSize: '12px', color: '#f9dcab',
        backgroundColor: '#0b1a2bcc', padding: { x: 7, y: 3 },
      }).setDepth(102);
      const labButton = this.add.rectangle(859, 69, 174, 33, 0x174c55, 0.98)
        .setStrokeStyle(2, 0x87ead5)
        .setDepth(104).setInteractive({ useHandCursor: true });
      this.add.text(859, 69, 'UPGRADES [U]', {
        ...font, fontSize: '14px', color: '#e4ffef', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(105);
      labButton.on('pointerover', () => labButton.setFillStyle(0x256976, 1));
      labButton.on('pointerout', () => labButton.setFillStyle(0x174c55, 0.98));
      labButton.on('pointerdown', (pointer, _x, _y, event) => {
        if (!pointer.leftButtonDown()) return;
        event?.stopPropagation();
        this.openUpgradeLab();
      });
    }

    const pauseButton = this.add.rectangle(W / 2, 20, 156, 32, 0x18364c, 0.95)
      .setStrokeStyle(2, 0x74bace).setDepth(102)
      .setInteractive({ useHandCursor: true });
    this.add.text(W / 2, 20, 'Ⅱ  PAUSAR [P]', {
      ...font, fontSize: '13px', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(103);
    pauseButton.on('pointerover', () => pauseButton.setFillStyle(0x27667a, 1));
    pauseButton.on('pointerout', () => pauseButton.setFillStyle(0x18364c, 0.95));
    pauseButton.on('pointerdown', (pointer, _localX, _localY, event) => {
      if (!pointer.leftButtonDown()) return;
      event?.stopPropagation();
      this.pauseGame();
    });
  }

  pauseGame() {
    if (this.tutorialComplete || this.scene.isActive('PauseScene') ||
        this.scene.isActive('UpgradeLabScene')) return;
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  chooseDefenseTarget() {
    const targets = availableDefenseTargets(CANNON, this.supportTowers);
    return targets[Phaser.Math.Between(0, targets.length - 1)];
  }

  makeInvaderRoute(x, y, target) {
    const controlX = Phaser.Math.Clamp(
      Phaser.Math.Linear(x, target.x, 0.5) + Phaser.Math.Between(-160, 160), 90, W - 90,
    );
    return {
      x0: x, y0: y,
      x1: controlX, y1: Phaser.Math.Linear(y, target.y, 0.42),
      x2: target.x, y2: target.y,
    };
  }

  setRoute(enemy, targetX, targetY) {
    enemy.route = this.makeInvaderRoute(enemy.sprite.x, enemy.sprite.y, { x: targetX, y: targetY });
    enemy.pathLength = routeLength(enemy.route);
    enemy.progress = 0;
  }

  assignInvaderTarget(enemy, target = this.chooseDefenseTarget()) {
    enemy.target = target;
    this.setRoute(enemy, target.x, target.y);
  }

  makeEnemyVisual(type, x, y, level = 1) {
    if (type === 1) {
      const sprite = this.add.sprite(x, y, 'tipo1_1')
        .setDisplaySize(62, 72).setDepth(18).play('tipo1_voo');
      if (level > 1) sprite.setTint(0xffd5a0);
      return { sprite, box: null };
    }
    const definition = enemyStats(type, level);
    const sprite = this.add.container(x, y).setDepth(19);
    const box = this.add.rectangle(0, 0, definition.width, definition.height, definition.color)
      .setStrokeStyle(level > 1 ? 3 : 2, level > 1 ? 0xffd26e : 0xf7efff);
    const label = this.add.text(0, 0, String(type) + (level > 1 ? ' II' : ''), {
      fontFamily: 'monospace', fontSize: type === 5 ? '24px' : (level > 1 ? '12px' : '17px'),
      fontStyle: 'bold', color: '#091323',
    }).setOrigin(0.5);
    sprite.add([box, label]);
    return { sprite, box };
  }

  showAttackWarning(message) {
    const label = this.add.text(W / 2, 143, message, {
      fontFamily: 'monospace', fontSize: '19px',
      fontStyle: 'bold', color: '#ffcf83',
      backgroundColor: '#2c1420dd', padding: { x: 10, y: 7 },
    }).setOrigin(0.5).setDepth(110);
    this.tweens.add({
      targets: label, alpha: 0, y: 120,
      delay: 1200, duration: 650,
      onComplete: () => label.destroy(),
    });
  }

  spawnWaveEvent(event) {
    const level = event.level ?? 1;
    if (event.pattern === 'spread' && event.type === 1) {
      // Rajada simultânea, distribuída pelo céu para forçar múltiplas decisões.
      const count = event.count ?? 3;
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(1, { level, x: lineFormationX(i, count, W, 130) });
      }
      return;
    }
    if (event.pattern === 'line' && event.type === 1) {
      const count = event.count ?? 10;
      this.showAttackWarning('ALERTA! UMA FRENTE DE OVNIS!');
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(1, { level, x: lineFormationX(i, count, W, 48) });
      }
      return;
    }
    if (event.pattern === 'orbit' && event.type === 2) {
      const count = event.count ?? 10;
      const center = W / 2;
      this.showAttackWarning('ESQUADRÃO EM ÓRBITA • NÍVEL 2');
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(2, {
          level: 2, pattern: 'orbit',
          center, formationIndex: i, formationCount: count,
        });
      }
      return;
    }
    if (event.type === 2 && event.group) {
      const center = Phaser.Math.Between(300, 650);
      for (let i = 0; i < 3; i += 1) {
        this.spawnEnemy(2, { level, center, formationIndex: i });
      }
      return;
    }
    this.spawnEnemy(event.type, { level });
  }

  spawnEnemy(type, options = {}) {
    const level = options.level ?? 1;
    const definition = enemyStats(type, level);
    const index = options.formationIndex ?? 1;
    const orbiting = type === 2 && options.pattern === 'orbit';
    const groupCount = options.formationCount ?? 3;
    const center = options.center ?? W / 2;
    const startX = type === 5 ? W / 2 :
      type === 4 ? (Phaser.Math.Between(0, 1) ? -64 : W + 64) :
      type === 2 ? center + (orbiting ? (index - (groupCount - 1) / 2) * 60 : (index - 1) * 83) :
      options.x ?? Phaser.Math.Between(120, W - 120);
    const startY = type === 4 ? Phaser.Math.Between(120, 180) :
      type === 2 ? -45 - Math.abs(index - (orbiting ? (groupCount - 1) / 2 : 1)) * 7 :
      type === 1 ? -28 : -65;
    const visual = this.makeEnemyVisual(type, startX, startY, level);
    const enemy = {
      uid: this.nextEnemyId++,
      type, level, definition,
      sprite: visual.sprite,
      box: visual.box,
      hp: definition.hp,
      maxHp: definition.hp,
      speed: definition.speed,
      recoilSpeed: 0,
      phase: 'dive',
      age: 0,
      phaseAge: 0,
      shotTimer: 0,
      spawnTimer: 0,
      laserGraphics: null,
      target: this.chooseDefenseTarget(),
    };

    if (type === 1) {
      this.assignInvaderTarget(enemy, enemy.target);
    } else if (type === 2 && orbiting) {
      enemy.phase = 'orbit';
      enemy.orbitIndex = index;
      enemy.orbitCount = groupCount;
      enemy.orbitCenterX = center;
      enemy.orbitCenterY = 162;
      enemy.orbitEntryX = startX;
      enemy.orbitEntryY = startY;
    } else if (type === 2) {
      enemy.phase = 'formation';
      enemy.formationX = center + (index - 1) * 38;
      enemy.formationY = 143 + Math.abs(index - 1) * 21;
      enemy.formationWait = 2.6 + index * 0.65;
    } else if (type === 3) {
      enemy.phase = 'approach';
      this.setRoute(enemy, Phaser.Math.Between(235, 725), Phaser.Math.Between(170, 220));
    } else if (type === 4) {
      enemy.phase = 'flyby';
      enemy.direction = startX < 0 ? 1 : -1;
    } else if (type === 5) {
      enemy.phase = 'arrival';
    }
    this.enemies.push(enemy);
    return enemy;
  }

  moveAlongRoute(enemy, dt) {
    const result = advanceRouteWithRecoil(
      enemy.progress, enemy.speed, enemy.recoilSpeed, enemy.pathLength, dt,
    );
    enemy.progress = result.progress;
    enemy.recoilSpeed = result.recoilSpeed;
    const position = positionOnRoute(enemy.route, enemy.progress);
    enemy.sprite.setPosition(position.x, position.y);
    return enemy.progress >= 1;
  }

  updateEnemies(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      enemy.age += dt;
      enemy.phaseAge += dt;

      if (enemy.target.kind === 'tower' && enemy.target.tower?.health <= 0) {
        enemy.target = availableDefenseTargets(CANNON, this.supportTowers)[0];
        if (enemy.phase === 'dive') this.assignInvaderTarget(enemy, enemy.target);
      }

      if (enemy.phase === 'orbit') {
        // Nível 2: dez naves se organizam num círculo, giram juntas e depois
        // param em uma linha para avisar o jogador antes do mergulho.
        const orbitAge = Math.max(0, enemy.phaseAge - 1.35);
        const position = orbitalFormationPosition(
          enemy.orbitCenterX, enemy.orbitCenterY,
          enemy.orbitIndex, enemy.orbitCount, orbitAge,
        );
        const t = Math.min(1, enemy.phaseAge / 1.35);
        const ease = t * t * (3 - 2 * t);
        enemy.sprite.setPosition(
          Phaser.Math.Linear(enemy.orbitEntryX, position.x, ease),
          Phaser.Math.Linear(enemy.orbitEntryY, position.y, ease),
        );
        if (enemy.phaseAge >= 7.2) {
          enemy.phase = 'stage';
          enemy.phaseAge = 0;
          enemy.stageEntryX = enemy.sprite.x;
          enemy.stageEntryY = enemy.sprite.y;
        }
      } else if (enemy.phase === 'stage') {
        const settle = Math.min(1, enemy.phaseAge / 1.4);
        const smooth = settle * settle * (3 - 2 * settle);
        const goalX = lineFormationX(enemy.orbitIndex, enemy.orbitCount, W, 115);
        const goalY = 218 + Math.abs(enemy.orbitIndex - (enemy.orbitCount - 1) / 2) * 3;
        enemy.sprite.setPosition(
          Phaser.Math.Linear(enemy.stageEntryX, goalX, smooth),
          Phaser.Math.Linear(enemy.stageEntryY, goalY, smooth),
        );
        // Piscar em amarelo no último segundo da formação.
        if (enemy.box) {
          const blink = enemy.phaseAge > 1.4 && Math.sin(enemy.phaseAge * 25) > 0;
          enemy.box.setStrokeStyle(3, blink ? 0xff6f75 : 0xffd26e);
        }
        if (enemy.phaseAge >= 2.65) {
          enemy.phase = 'dive';
          this.assignInvaderTarget(enemy, enemy.target);
        }
      } else if (enemy.phase === 'formation') {
        const blend = Math.min(1, dt * 1.5);
        enemy.sprite.x = Phaser.Math.Linear(enemy.sprite.x, enemy.formationX, blend);
        enemy.sprite.y = Phaser.Math.Linear(enemy.sprite.y, enemy.formationY, blend);
        if (enemy.phaseAge >= enemy.formationWait) {
          enemy.phase = 'dive';
          this.assignInvaderTarget(enemy, enemy.target);
        }
      } else if (enemy.phase === 'approach') {
        if (this.moveAlongRoute(enemy, dt)) {
          enemy.phase = 'hover';
          enemy.phaseAge = 0;
          enemy.shotTimer = 0;
        }
      } else if (enemy.phase === 'hover') {
        // Bombardeiro mantém posição, dispara projéteis interceptáveis e depois avança.
        enemy.sprite.x += Math.sin(enemy.age * 1.2) * 15 * dt;
        enemy.shotTimer += dt;
        if (enemy.shotTimer >= enemy.definition.shotInterval) {
          enemy.shotTimer = 0;
          this.fireEnemyProjectile(enemy);
        }
        if (enemy.phaseAge >= (enemy.level > 1 ? 9 : 11)) {
          enemy.phase = 'dive';
          this.assignInvaderTarget(enemy, enemy.target);
        }
      } else if (enemy.phase === 'flyby') {
        enemy.sprite.x += enemy.direction * enemy.speed * dt;
        if ((enemy.direction > 0 && enemy.sprite.x >= W + 55) ||
            (enemy.direction < 0 && enemy.sprite.x <= -55)) {
          enemy.phase = 'swoop1';
          enemy.phaseAge = 0;
          this.setRoute(enemy, enemy.direction > 0 ? -30 : W + 30, 245);
        }
      } else if (enemy.phase === 'swoop1') {
        if (this.moveAlongRoute(enemy, dt)) {
          enemy.phase = 'swoop2';
          enemy.phaseAge = 0;
          this.setRoute(enemy, CANNON.x + (enemy.direction > 0 ? 130 : -130), 260);
        }
      } else if (enemy.phase === 'swoop2') {
        if (this.moveAlongRoute(enemy, dt)) {
          enemy.phase = 'telegraph';
          enemy.phaseAge = 0;
          enemy.laserGraphics = this.add.graphics().setDepth(30);
        }
      } else if (enemy.phase === 'telegraph') {
        enemy.laserGraphics.clear();
        const pulse = 0.45 + 0.5 * Math.abs(Math.sin(enemy.phaseAge * 13));
        enemy.laserGraphics.lineStyle(2, 0xff5270, pulse);
        enemy.laserGraphics.lineBetween(
          enemy.sprite.x, enemy.sprite.y, enemy.target.x, enemy.target.y,
        );
        if (enemy.phaseAge >= enemy.definition.warningDuration) {
          enemy.phase = 'laser';
          enemy.phaseAge = 0;
          this.damageTarget(enemy.target, 40);
          if (this.gameOver) return;
        }
      } else if (enemy.phase === 'laser') {
        enemy.laserGraphics.clear();
        enemy.laserGraphics.lineStyle(7, 0xff4056, 0.95);
        enemy.laserGraphics.lineBetween(
          enemy.sprite.x, enemy.sprite.y, enemy.target.x, enemy.target.y,
        );
        if (enemy.phaseAge >= 0.35) {
          this.removeEnemy(i);
          continue;
        }
      } else if (enemy.phase === 'arrival') {
        enemy.sprite.y = Math.min(140, enemy.sprite.y + enemy.speed * dt);
        if (enemy.sprite.y >= 140) {
          enemy.phase = 'boss';
          enemy.bossAnchorX = enemy.sprite.x;
          enemy.bossAnchorY = enemy.sprite.y;
          enemy.phaseAge = 0;
          enemy.shotTimer = 0;
          enemy.spawnTimer = 0;
        }
      } else if (enemy.phase === 'boss') {
        // Nunca usa a idade anterior à chegada: o primeiro frame do boss
        // começa exatamente na última posição da fase de entrada.
        enemy.sprite.x = bossCruiseX(enemy.bossAnchorX, enemy.phaseAge);
        enemy.sprite.y = enemy.bossAnchorY + Math.sin(enemy.phaseAge * 1.05) * 10;
        enemy.shotTimer += dt;
        enemy.spawnTimer += dt;
        if (enemy.shotTimer >= enemy.definition.shotInterval) {
          enemy.shotTimer = 0;
          this.fireEnemyProjectile(enemy);
        }
        if (enemy.spawnTimer >= enemy.definition.spawnInterval) {
          enemy.spawnTimer = 0;
          const count = enemy.definition.spawnCount;
          for (let j = 0; j < count; j += 1) {
            const spread = (j - (count - 1) / 2) * 84;
            this.spawnEnemy(1, {
              level: enemy.level > 1 ? 2 : 1,
              x: Phaser.Math.Clamp(enemy.sprite.x + spread, 100, W - 100),
            });
          }
        }
      } else if (enemy.phase === 'dive') {
        if (this.moveAlongRoute(enemy, dt)) {
          this.removeEnemy(i);
          this.damageTarget(enemy.target, ENEMY_IMPACT_DAMAGE * (enemy.level > 1 ? 1.12 : 1));
          if (this.gameOver) return;
          continue;
        }
      }

      // Bombas de pulso são barreiras: inimigos entram nelas durante o movimento.
      this.hitEnemyWithBlast(i);
    }
  }

  fireEnemyProjectile(enemy) {
    const target = this.chooseDefenseTarget();
    const count = enemy.definition.volleyCount;
    for (let i = 0; i < count; i += 1) {
      // A versão II do bombardeiro dispara duas bombas das laterais,
      // que convergem para o mesmo escudo e podem ser abatidas separadamente.
      const x = enemy.sprite.x + (i - (count - 1) / 2) * 48;
      const y = enemy.sprite.y + enemy.definition.height / 2;
      const dx = target.x - x;
      const dy = target.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const projectile = this.add.rectangle(x, y, 11, 11, ENEMY_SHOT_COLOR)
        .setStrokeStyle(1, 0xfff5bc).setDepth(28);
      this.enemyBullets.push({
        sprite: projectile,
        hp: enemy.definition.shotHp ?? 1,
        target,
        vx: dx / distance * 160,
        vy: dy / distance * 160,
      });
    }
  }

  updateEnemyBullets(dt) {
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const shot = this.enemyBullets[i];
      shot.sprite.x += shot.vx * dt;
      shot.sprite.y += shot.vy * dt;
      if (this.specialBlasts.some((blast) => blastCatchesTarget(
        blast.x, blast.y, this.time.now - blast.bornAt,
        shot.sprite.x, shot.sprite.y, 8,
      ))) {
        this.removeEnemyBullet(i);
        continue;
      }
      if (Phaser.Math.Distance.Between(
        shot.sprite.x, shot.sprite.y, shot.target.x, shot.target.y,
      ) < 14) {
        this.removeEnemyBullet(i);
        this.damageTarget(shot.target, ENEMY_BULLET_DAMAGE);
        if (this.gameOver) return;
      } else if (shot.sprite.y > H + 30 || shot.sprite.x < -30 || shot.sprite.x > W + 30) {
        this.removeEnemyBullet(i);
      }
    }
  }

  removeEnemyBullet(index) {
    const shot = this.enemyBullets[index];
    if (!shot) return;
    shot.sprite.destroy();
    this.enemyBullets.splice(index, 1);
  }

  removeEnemy(index) {
    const enemy = this.enemies[index];
    if (!enemy) return;
    enemy.laserGraphics?.destroy();
    enemy.sprite.destroy();
    this.enemies.splice(index, 1);
  }

  drawEnemyHealthBars() {
    const graphics = this.enemyHealthGraphics;
    graphics.clear();
    for (const enemy of this.enemies) {
      if (enemy.maxHp <= 1) continue;
      const width = Phaser.Math.Clamp(enemy.definition.width + 2, 33, 110);
      const x = enemy.sprite.x - width / 2;
      const y = enemy.sprite.y - enemy.definition.height / 2 - 15;
      graphics.fillStyle(0x061426, 0.95);
      graphics.fillRect(x - 2, y - 2, width + 4, 8);
      graphics.fillStyle(enemy.level > 1 ? 0xffc977 : 0x6df3ba, 0.95);
      graphics.fillRect(x, y, width * Math.max(0, enemy.hp / enemy.maxHp), 4);
    }
  }

  popHitNumber(x, y, damage, color = '#ffe09f') {
    const amount = Number(damage.toFixed(2));
    const number = this.add.text(x, y - 23, '-' + amount, {
      fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold',
      color, stroke: '#071222', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(55);
    this.tweens.add({
      targets: number, y: number.y - 24, alpha: 0,
      duration: 570,
      onComplete: () => number.destroy(),
    });
  }

  impactInvader(index, damage = 1, knockback = 0, hitColor = '#ffe09f') {
    const enemy = this.enemies[index];
    if (!enemy) return;
    this.popHitNumber(enemy.sprite.x, enemy.sprite.y, damage, hitColor);
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
      this.removeEnemy(index);
    } else {
      if (enemy.box) enemy.box.setFillStyle(0xffffff);
      else enemy.sprite.setTint(0xffa8a8);
      this.time.delayedCall(100, () => {
        if (!enemy.sprite.active) return;
        if (enemy.box?.active) enemy.box.setFillStyle(enemy.definition.color);
        else enemy.sprite.setTint(enemy.level > 1 ? 0xffd5a0 : 0xffffff);
      });
      if (enemy.phase === 'dive' && knockback > 0) {
        enemy.recoilSpeed = applyRecoilImpulse(enemy.recoilSpeed, knockback);
      }
    }
  }

  activeUpgradeIds() {
    return this.mode === 'upgradeLab'
      ? this.upgradeIds
      : unlockedFirstUpgrades(this.campaign);
  }

  showMuzzleFlash(angle) {
    const style = shotVisualFor(this.activeUpgradeIds());
    const x = CANNON.x + Math.cos(angle) * 34;
    const y = CANNON.y + Math.sin(angle) * 34;
    const flash = this.add.circle(x, y, 7, style.color, 0.9).setDepth(38);
    this.tweens.add({
      targets: flash, scale: 2.5, alpha: 0, duration: 145,
      onComplete: () => flash.destroy(),
    });
  }

  shootBasic(pointer) {
    if (this.tutorialComplete || this.countdownActive) return;
    if (this.time.now - this.lastBasicFire < this.combat.basicInterval) return;
    this.lastBasicFire = this.time.now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    for (const firingAngle of shotAngles(angle, this.combat.bulletsPerShot)) {
      this.createProjectile(firingAngle, false);
    }
    this.basicShotCount += 1;
    if (isPlasmaShot(this.basicShotCount, this.combat.plasmaEvery > 0)) {
      this.firePlasmaKatana(angle);
    }
    this.showMuzzleFlash(angle);
  }

  firePlasmaKatana(angle) {
    const startX = CANNON.x + Math.cos(angle) * 32;
    const startY = CANNON.y + Math.sin(angle) * 32;
    const endX = startX + Math.cos(angle) * PLASMA_RANGE;
    const endY = startY + Math.sin(angle) * PLASMA_RANGE;

    // A lâmina atravessa toda a linha do tiro, independentemente do HP.
    // Cada nave sofre dano uma única vez por pulso.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (laserHitsTarget(
        startX, startY, endX, endY,
        enemy.sprite.x, enemy.sprite.y,
        PLASMA_HALF_WIDTH, enemyContactRadius(enemy.type),
      )) {
        this.impactInvader(i, PLASMA_DAMAGE, 0, '#e9aaff');
      }
    }
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.enemyBullets[i];
      if (laserHitsTarget(
        startX, startY, endX, endY, bullet.sprite.x, bullet.sprite.y, PLASMA_HALF_WIDTH, 7,
      )) this.removeEnemyBullet(i);
    }

    // Três traços luminosos sobrepostos criam uma espada de plasma bem visível.
    const beam = this.add.graphics().setDepth(48);
    beam.lineStyle(26, 0x7f43c7, 0.18);
    beam.lineBetween(startX, startY, endX, endY);
    beam.lineStyle(11, 0xdb81ff, 0.84);
    beam.lineBetween(startX, startY, endX, endY);
    beam.lineStyle(3, 0xffffff, 1);
    beam.lineBetween(startX, startY, endX, endY);
    this.tweens.add({
      targets: beam, alpha: 0, duration: 280,
      onComplete: () => beam.destroy(),
    });
  }

  explodeFragments(x, y, directTargetId) {
    // Fragmentação só é disparada ao acertar um alvo, nunca ao expirar no céu.
    // O inimigo atingido já sofreu o impacto direto; o raio pega os vizinhos.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (enemy.uid === directTargetId) continue;
      if (fragmentHitsTarget(
        x, y, enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type),
      )) this.impactInvader(i, FRAGMENT_DAMAGE, 0, '#90cfff');
    }
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const shot = this.enemyBullets[i];
      if (fragmentHitsTarget(x, y, shot.sprite.x, shot.sprite.y, 8)) {
        this.removeEnemyBullet(i);
      }
    }
    const blast = this.add.circle(x, y, FRAGMENT_RADIUS, 0x75aeff, 0.22)
      .setStrokeStyle(4, 0xe2f2ff, 0.92).setScale(0.20).setDepth(43);
    const spark = this.add.circle(x, y, 10, 0xffffff, 0.90).setDepth(44);
    this.tweens.add({
      targets: blast, scale: 1, alpha: 0, duration: 340,
      onComplete: () => blast.destroy(),
    });
    this.tweens.add({
      targets: spark, scale: 2.6, alpha: 0, duration: 160,
      onComplete: () => spark.destroy(),
    });
  }

  shootSpecial(pointer) {
    if (this.tutorialComplete || this.countdownActive) return;
    if (this.time.now - this.lastSpecialFire < this.combat.specialCooldown) return;
    this.lastSpecialFire = this.time.now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    const distance = Phaser.Math.Clamp(
      Math.hypot(pointer.x - CANNON.x, pointer.y - CANNON.y), 140, 580,
    );
    this.createProjectile(angle, true, distance);
  }

  createProjectile(angle, special, distance = 0) {
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const x = CANNON.x + vx * 29;
    const y = CANNON.y + vy * 29;
    const style = shotVisualFor(this.activeUpgradeIds());
    const dot = special
      ? this.add.circle(x, y, 8, 0x72eaf8).setDepth(35)
      : this.add.rectangle(x, y, style.width, style.length, style.color)
        .setStrokeStyle(1, 0xffffff, 0.65)
        .setRotation(angle + Math.PI / 2)
        .setDepth(35);
    const speed = special ? 300 : this.combat.basicSpeed;
    this.projectiles.push({
      sprite: dot,
      vx: vx * speed,
      vy: vy * speed,
      special,
      tx: special ? CANNON.x + vx * distance : null,
      ty: special ? CANNON.y + vy * distance : null,
      damage: special ? 0 : this.combat.basicDamage,
      pierceLeft: special ? 0 : this.combat.pierce,
      knockback: special ? 0 : this.combat.knockback,
      fragmentation: !special && this.combat.fragmentation,
      impactColor: style.impactColor,
      hitEnemyIds: new Set(),
    });
  }

  explode(x, y) {
    this.specialBlasts.push({
      id: this.nextBlastId++,
      x, y, bornAt: this.time.now,
      hits: new Set(),
      graphics: this.add.graphics().setDepth(39),
    });
  }

  hitEnemyWithBlast(index) {
    const enemy = this.enemies[index];
    if (!enemy) return;
    for (const blast of this.specialBlasts) {
      if (blast.hits.has(enemy.uid)) continue;
      if (!blastCatchesTarget(
        blast.x, blast.y, this.time.now - blast.bornAt,
        enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type),
      )) continue;
      blast.hits.add(enemy.uid);
      // Cada explosão pode atingir o mesmo alvo uma única vez.
      // Naves grandes recebem dano, não morrem instantaneamente.
      this.impactInvader(index, enemy.type === 5 ? 4 : 3, 0, '#a8faff');
      break;
    }
  }

  updateBlasts() {
    for (let i = this.specialBlasts.length - 1; i >= 0; i -= 1) {
      const blast = this.specialBlasts[i];
      const age = this.time.now - blast.bornAt;
      if (age >= SPECIAL_BLAST_DURATION) {
        blast.graphics.destroy();
        this.specialBlasts.splice(i, 1);
        continue;
      }
      const radius = specialBlastRadius(age);
      const pulse = 0.5 + 0.5 * Math.sin(age / 105);
      const fade = Math.min(1, (SPECIAL_BLAST_DURATION - age) / 500);
      const gfx = blast.graphics;
      gfx.clear();
      gfx.fillStyle(0x4deaff, 0.16 * fade);
      gfx.fillCircle(blast.x, blast.y, radius);
      gfx.lineStyle(3, 0xa8ffff, (0.82 + pulse * 0.18) * fade);
      gfx.strokeCircle(blast.x, blast.y, radius);
      gfx.lineStyle(1, 0x5bbfe9, (0.38 + pulse * 0.28) * fade);
      gfx.strokeCircle(blast.x, blast.y, radius * 0.76);
      gfx.fillStyle(0xd4ffff, (0.45 + pulse * 0.4) * fade);
      gfx.fillCircle(blast.x, blast.y, Math.max(3, radius * 0.07));
    }
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      this.hitEnemyWithBlast(i);
    }
  }

  updatePlayerProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const bullet = this.projectiles[i];
      bullet.sprite.x += bullet.vx * dt;
      bullet.sprite.y += bullet.vy * dt;
      let remove = false;

      if (bullet.special && Phaser.Math.Distance.Between(
        bullet.sprite.x, bullet.sprite.y, bullet.tx, bullet.ty,
      ) <= 300 * dt + 6) {
        bullet.sprite.setPosition(bullet.tx, bullet.ty);
        this.explode(bullet.tx, bullet.ty);
        remove = true;
      }

      if (!remove) {
        for (let j = this.enemyBullets.length - 1; j >= 0; j -= 1) {
          const hostile = this.enemyBullets[j];
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, hostile.sprite.x, hostile.sprite.y,
          ) >= 16) continue;
          if (bullet.special) {
            this.explode(bullet.sprite.x, bullet.sprite.y);
          } else {
            hostile.hp -= bullet.damage;
            if (hostile.hp <= 0) this.removeEnemyBullet(j);
            else hostile.sprite.setFillStyle(0xfff5d0);
          }
          remove = true;
          break;
        }
      }

      if (!remove) {
        for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
          const enemy = this.enemies[j];
          if (bullet.hitEnemyIds.has(enemy.uid)) continue;
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, enemy.sprite.x, enemy.sprite.y,
          ) >= enemyContactRadius(enemy.type) + 7) continue;

          if (bullet.special) {
            this.explode(bullet.sprite.x, bullet.sprite.y);
            remove = true;
          } else {
            const directTargetId = enemy.uid;
            bullet.hitEnemyIds.add(directTargetId);
            this.impactInvader(j, bullet.damage, bullet.knockback, bullet.impactColor);
            if (bullet.fragmentation) {
              this.explodeFragments(bullet.sprite.x, bullet.sprite.y, directTargetId);
              remove = true;
            } else {
              bullet.pierceLeft -= 1;
              remove = bullet.pierceLeft <= 0;
            }
          }
          if (remove) break;
        }
      }
      if (!remove && (
        bullet.sprite.x < -30 || bullet.sprite.x > W + 30 ||
        bullet.sprite.y < -30 || bullet.sprite.y > H + 30
      )) remove = true;
      if (remove) {
        bullet.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }
  }

  damageCannon(amount) {
    this.lastDamageAt = this.time.now;
    if (this.mode === 'upgradeLab' || this.mode === 'lab') {
      // Laboratórios: escudo ainda pode sofrer dano, mas o teste não termina.
      this.shield = Math.max(0, this.shield - amount);
      this.cannonHealth = 100;
      return;
    }
    const result = applyShieldedHit(this.shield, this.cannonHealth, amount);
    this.shield = result.shield;
    this.cannonHealth = result.health;
    if (this.cannonHealth === 0) this.showDefeat();
  }

  damageTarget(target, amount) {
    if (target.kind === 'tower') {
      const tower = target.tower;
      if (!tower || tower.health <= 0) return;
      const result = applyShieldedHit(tower.shield ?? 0, tower.health, amount);
      tower.shield = result.shield;
      tower.health = result.health;
      tower.lastDamageAt = this.time.now;
      if (tower.health === 0 && tower.sprite) tower.sprite.setAlpha(0.32);
      return;
    }
    this.damageCannon(amount);
  }

  drawTowerStatus() {
    const graphics = this.towerStatusGraphics;
    graphics.clear();
    for (const tower of this.supportTowers) {
      const width = 52;
      const x = tower.x - width / 2;
      const y = tower.y - 74;
      graphics.fillStyle(0x101b2c, 0.90);
      graphics.fillRect(x - 1, y - 1, width + 2, 10);
      graphics.fillStyle(tower.health > 0 ? 0x76e5b5 : 0xff716f, 1);
      graphics.fillRect(x, y, width * (tower.health / tower.healthMax), 4);
      graphics.fillStyle(0x70d7f4, 0.90);
      graphics.fillRect(x, y + 5, width * (tower.shield / tower.shieldMax), 3);
    }
  }

  drawShield() {
    const graphics = this.shieldGraphics;
    graphics.clear();
    const dome = (x, y, radius, shield, max) => {
      if (shield <= 0) return;
      const fraction = shield / max;
      const color = fraction > 0.6 ? 0x70e6ec : fraction > 0.3 ? 0xf4c15e : 0xf06c77;
      graphics.lineStyle(3, color, Math.max(0.35, fraction));
      graphics.beginPath();
      graphics.arc(x, y + 10, radius, Math.PI, Math.PI * 2, false);
      graphics.strokePath();
    };
    dome(CANNON.x, CANNON.y, 62, this.shield, this.shieldMax);
    for (const tower of this.supportTowers) {
      if (tower.health > 0) {
        dome(tower.x, tower.y, tower.shieldRadius, tower.shield, tower.shieldMax);
      }
    }
  }

  showDefeat() {
    if (this.tutorialComplete) return;
    this.tutorialComplete = true;
    this.gameOver = true;
    this.statusText.setText('CANHÃO DESTRUÍDO');
    this.healthText.setText('CANHÃO 0 | ESCUDO 0 | DEFESA PERDIDA');
    this.tutorialText.setText('');

    this.add.rectangle(W / 2, H / 2, W, H, 0x030714, 0.78)
      .setDepth(120).setInteractive();
    this.add.rectangle(W / 2, H / 2, 470, 320, 0x0a1930, 0.98)
      .setStrokeStyle(2, 0xe16c66).setDepth(121);
    this.add.text(W / 2, 174, 'DERROTA', {
      fontFamily: 'monospace', fontSize: '42px',
      color: '#ff9c8f', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(122);
    this.add.text(W / 2, 221, 'O CANHÃO FOI DESTRUÍDO!', {
      fontFamily: 'monospace', fontSize: '17px', color: '#ecf3ff',
    }).setOrigin(0.5).setDepth(122);
    addMenuButton(this, {
      x: W / 2, y: 293, text: '↻  TENTAR NOVAMENTE',
      onClick: () => this.scene.restart(this.getRunOptions()), primary: true, depth: 124,
    });
    addMenuButton(this, {
      x: W / 2, y: 362, text: '⌂  MENU PRINCIPAL',
      onClick: () => this.scene.start('MenuScene'), depth: 124,
    });
  }

  showWaveComplete() {
    if (this.tutorialComplete) return;
    this.tutorialComplete = true;

    if (this.mode === 'wave0' || this.mode === 'wave1') {
      this.scene.start('UpgradeScene', {
        campaign: this.campaign,
        completedWave: this.mode === 'wave0' ? 0 : 1,
      });
      return;
    }
    this.statusText.setText('DEFESA BEM-SUCEDIDA');
    this.tutorialText.setText('');
    this.add.rectangle(W / 2, H / 2, W, H, 0x061022, 0.78)
      .setDepth(120).setInteractive();
    this.add.rectangle(W / 2, H / 2, 530, 332, 0x0b1c33, 0.98)
      .setStrokeStyle(2, 0x71e2b9).setDepth(121);
    this.add.text(W / 2, 166, this.mode === 'lab' ? 'TESTE CONCLUÍDO' : 'ONDA 2 CONCLUÍDA!', {
      fontFamily: 'monospace', fontSize: '32px',
      color: '#f4e3a3', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(122);
    this.add.text(W / 2, 218, this.mode === 'lab'
      ? 'Os cinco tipos já têm comportamento provisório.'
      : 'Protótipo concluído! Próximas ondas em desenvolvimento.',
    {
      fontFamily: 'monospace', fontSize: '14px', color: '#e0f3ff',
    }).setOrigin(0.5).setDepth(122);
    if (this.mode !== 'lab') {
      addMenuButton(this, {
        x: W / 2, y: 287, width: 300,
        text: 'TESTAR INIMIGOS 2–5',
        onClick: () => this.scene.start('GameScene', { mode: 'lab' }),
        primary: true, depth: 124,
      });
    } else {
      addMenuButton(this, {
        x: W / 2, y: 287, text: '↻  REPETIR TESTE',
        onClick: () => this.scene.restart(this.getRunOptions()),
        primary: true, depth: 124,
      });
    }
    addMenuButton(this, {
      x: W / 2, y: 361, text: '⌂  MENU PRINCIPAL',
      onClick: () => this.scene.start('MenuScene'), depth: 124,
    });
  }

  updateHud() {
    const remaining = Math.max(
      0, (this.lastSpecialFire + this.combat.specialCooldown - this.time.now) / 1000,
    );
    this.statusText.setText(remaining
      ? 'ESPECIAL ' + remaining.toFixed(1) + 's' : 'ESPECIAL PRONTO');
    this.healthText.setText(
      'CANHÃO ' + Math.ceil(this.cannonHealth) +
      ' | ESCUDO ' + Math.ceil(this.shield) +
      ' | OVNIS ' + this.enemies.length,
    );
    if (this.mode === 'wave0') {
      if (this.elapsed < 6500) {
        this.tutorialText.setText('Mova o mouse e segure o botão esquerdo para atirar');
      } else if (this.elapsed < 15000) {
        this.tutorialText.setText('Botão direito: tiro especial protege uma área durante 3s');
      } else {
        this.tutorialText.setText('Proteja o canhão! Escudos regeneram sem dano.');
      }
    } else if (this.mode === 'wave1' || this.mode === 'wave2') {
      const history = this.campaign.choices.map((id) => id.toUpperCase()).join(' + ');
      const special = this.combat.plasmaEvery ? ' | KATANA: ' +
        (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/3'
        : this.combat.fragmentation ? ' | FRAGMENTAÇÃO' : '';
      const towerLabel = this.supportTowers.map((tower) => tower.definition.label).join(' + ');
      this.tutorialText.setText(
        'ALIADOS: ' + (history || 'NENHUM') +
        (towerLabel ? ' | TORRE: ' + towerLabel : '') + special,
      );
    } else if (this.mode === 'upgradeLab') {
      this.tutorialText.setText('1–5: GERAR   SHIFT+1–5: NÍVEL 2   C: LIMPAR   U: UPGRADES');
      const names = this.upgradeIds.map((id) => getFirstUpgrade(id)?.flag).filter(Boolean);
      this.labUpgradeLabel.setText('MELHORIAS: ' + (names.length ? names.join(' + ') : 'NENHUMA'));
      const stats = this.combat;
      this.labStatsLabel.setText(
        'TIROS ' + (1000 / stats.basicInterval).toFixed(1) + '/s' +
        '  |  DANO ' + stats.basicDamage.toFixed(2) +
        '  |  FRAG ' + (stats.fragmentation ? FRAGMENT_RADIUS + 'px' : 'NÃO') +
        '  |  KATANA ' + (stats.plasmaEvery
          ? (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/' + PLASMA_EVERY_SHOTS : 'NÃO') +
        '  |  PROJ ' + stats.bulletsPerShot,
      );
    } else {
      this.tutorialText.setText('TESTE: 1–5 TIPOS   SHIFT+1–5: NÍVEL 2   C: LIMPAR');
    }
  }

  update(_time, delta) {
    if (this.tutorialComplete) {
      if (!this.gameOver) this.updateBlasts();
      return;
    }
    // Sem disparos, movimentação ou cronômetro de onda antes do "1".
    if (this.countdownActive) return;
    const dt = Math.min(delta / 1000, 0.05);
    this.elapsed += delta;
    const pointer = this.input.activePointer;
    this.aimAngle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.barrel.rotation = this.aimAngle + Math.PI / 2;
    if (pointer.leftButtonDown()) this.shootBasic(pointer);

    this.updateEnemies(dt);
    if (this.gameOver) return;
    this.updateEnemyBullets(dt);
    if (this.gameOver) return;
    this.updatePlayerProjectiles(dt);
    this.updateSupportTowers(dt);
    this.updateSupportProjectiles(dt);
    this.updateBlasts();
    this.drawEnemyHealthBars();

    if (this.time.now - this.lastDamageAt > SHIELD_REGEN_DELAY && this.shield < this.shieldMax) {
      this.shield = Math.min(this.shieldMax, this.shield + SHIELD_REGEN_RATE * dt);
    }
    for (const tower of this.supportTowers) {
      if (tower.health > 0 && tower.shield < tower.shieldMax &&
          this.time.now - tower.lastDamageAt > SHIELD_REGEN_DELAY) {
        tower.shield = Math.min(tower.shieldMax, tower.shield + SHIELD_REGEN_RATE * dt);
      }
    }
    this.drawShield();
    this.drawTowerStatus();
    this.updateHud();

    if (waveIsFinished({
      mode: this.mode,
      elapsed: this.elapsed,
      spawned: this.eventsSpawned,
      scheduled: this.waveEvents.length,
      enemies: this.enemies.length,
      hostileShots: this.enemyBullets.length,
    })) {
      this.showWaveComplete();
    }
  }
}
