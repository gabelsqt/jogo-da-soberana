import Phaser from 'phaser';
import { SKY_LAYERS } from '../config/scenery.js';
import {
  restrictedAimAngle,
  availableDefenseTargets,
  positionOnRoute,
  routeLength,
  applyShieldedHit,
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
import { MODES, getWaveEvents, waveIsFinished } from '../gameplay/waves.js';
import { addMenuButton } from '../ui/menuButton.js';

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
    this.upgradeId = this.mode === 'wave1' && getFirstUpgrade(data.upgradeId)
      ? data.upgradeId : null;
    this.upgradeIds = this.mode === 'upgradeLab'
      ? normalizeLabUpgrades(data.upgradeIds) : [];
    this.combat = this.mode === 'upgradeLab'
      ? combatStatsForLoadout(this.upgradeIds)
      : combatStatsFor(this.upgradeId);
  }

  getRunOptions() {
    if (this.mode === 'upgradeLab') {
      return { mode: this.mode, upgradeIds: [...this.upgradeIds] };
    }
    return { mode: this.mode, upgradeId: this.upgradeId };
  }

  setUpgradesForLab(ids) {
    if (this.mode !== 'upgradeLab') return;
    this.upgradeIds = normalizeLabUpgrades(ids);
    this.combat = combatStatsForLoadout(this.upgradeIds);
    // Não exige espera para experimentar a nova cadência ao retornar ao campo.
    this.lastBasicFire = this.time.now - this.combat.basicInterval;
  }

  toggleUpgradeForLab(id) {
    this.setUpgradesForLab(toggleLabUpgrade(this.upgradeIds, id));
  }

  openUpgradeLab() {
    if (this.mode !== 'upgradeLab' || this.scene.isActive('UpgradeLabScene')) return;
    this.scene.pause();
    this.scene.launch('UpgradeLabScene', { selectedIds: [...this.upgradeIds] });
  }

  clearTestEnemies() {
    if (this.mode !== 'upgradeLab') return;
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) this.removeEnemy(i);
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) this.removeEnemyBullet(i);
    for (const bullet of this.projectiles) bullet.sprite.destroy();
    this.projectiles.length = 0;
    for (const blast of this.specialBlasts) blast.graphics.destroy();
    this.specialBlasts.length = 0;
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
    this.supportTowers = []; // Futuras torres dos animais, inicialmente vazias.
    this.nextEnemyId = 1;
    this.nextBlastId = 1;
    this.elapsed = 0;
    this.eventsSpawned = 0;
    this.waveEvents = getWaveEvents(this.mode);
    this.lastBasicFire = -this.combat.basicInterval;
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
    this.createHud();
    this.drawShield();

    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) this.shootSpecial(pointer);
    });
    this.input.keyboard.on('keydown-R', () => this.scene.restart(this.getRunOptions()));
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    this.waveEvents.forEach((event) => {
      this.time.delayedCall(event.at, () => {
        if (this.tutorialComplete) return;
        this.eventsSpawned += 1;
        this.spawnWaveEvent(event);
      });
    });

    if (this.mode === 'upgradeLab') {
      // Alvos de treino regulares e geração manual dos cinco tipos.
      this.time.addEvent({
        delay: 2700,
        loop: true,
        callback: () => {
          if (!this.tutorialComplete && this.enemies.length < 10) this.spawnEnemy(1);
        },
      });
      for (let type = 1; type <= 5; type += 1) {
        this.input.keyboard.on('keydown-' + type, () => {
          if (!this.scene.isActive('GameScene') || this.tutorialComplete) return;
          this.spawnWaveEvent({ type, group: type === 2 });
        });
      }
      this.input.keyboard.on('keydown-U', () => {
        if (this.scene.isActive('GameScene')) this.openUpgradeLab();
      });
      this.input.keyboard.on('keydown-C', () => {
        if (this.scene.isActive('GameScene')) this.clearTestEnemies();
      });
      // Exibe a seleção logo ao entrar; ela pode ser reaberta com U.
      this.time.delayedCall(1, () => this.openUpgradeLab());
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
      type === 2 ? -45 - Math.abs(index - (orbiting ? (groupCount - 1) / 2 : 1)) * 7 : -65;
    const visual = this.makeEnemyVisual(type, startX, startY, level);
    const enemy = {
      uid: this.nextEnemyId++,
      type, level, definition,
      sprite: visual.sprite,
      box: visual.box,
      hp: definition.hp,
      maxHp: definition.hp,
      speed: definition.speed,
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
    enemy.progress = Math.min(1, enemy.progress + enemy.speed * dt / enemy.pathLength);
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

      if (enemy.phase === 'formation') {
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
        if (enemy.shotTimer >= 2.4) {
          enemy.shotTimer = 0;
          this.fireEnemyProjectile(enemy);
        }
        if (enemy.phaseAge >= 11) {
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
        if (enemy.phaseAge >= 1.4) {
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
          enemy.phaseAge = 0;
          enemy.shotTimer = 0;
          enemy.spawnTimer = 0;
        }
      } else if (enemy.phase === 'boss') {
        enemy.sprite.x = W / 2 + Math.sin(enemy.age * 0.7) * 130;
        enemy.shotTimer += dt;
        enemy.spawnTimer += dt;
        if (enemy.shotTimer >= 2.8) {
          enemy.shotTimer = 0;
          this.fireEnemyProjectile(enemy);
        }
        if (enemy.spawnTimer >= 4.2) {
          enemy.spawnTimer = 0;
          this.spawnEnemy(1, { x: Phaser.Math.Clamp(enemy.sprite.x, 100, W - 100) });
        }
      } else if (enemy.phase === 'dive') {
        if (this.moveAlongRoute(enemy, dt)) {
          this.removeEnemy(i);
          this.damageTarget(enemy.target, ENEMY_IMPACT_DAMAGE);
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
    const dx = target.x - enemy.sprite.x;
    const dy = target.y - enemy.sprite.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const projectile = this.add.rectangle(
      enemy.sprite.x, enemy.sprite.y + enemy.definition.height / 2, 11, 11,
      ENEMY_SHOT_COLOR,
    ).setStrokeStyle(1, 0xfff5bc).setDepth(28);
    this.enemyBullets.push({
      sprite: projectile,
      hp: enemy.definition.shotHp ?? 1,
      target,
      vx: dx / distance * 160,
      vy: dy / distance * 160,
    });
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

  impactInvader(index, damage = 1, knockback = 0) {
    const enemy = this.enemies[index];
    if (!enemy) return;
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
      this.removeEnemy(index);
    } else {
      if (enemy.box) enemy.box.setFillStyle(0xffffff);
      else enemy.sprite.setTint(0xffa8a8);
      if (enemy.phase === 'dive') {
        enemy.progress = Math.max(0, enemy.progress - knockback);
      }
    }
  }

  shootBasic(pointer) {
    if (this.tutorialComplete) return;
    if (this.time.now - this.lastBasicFire < this.combat.basicInterval) return;
    this.lastBasicFire = this.time.now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    for (const firingAngle of shotAngles(angle, this.combat.bulletsPerShot)) {
      this.createProjectile(firingAngle, false);
    }
  }

  shootSpecial(pointer) {
    if (this.tutorialComplete) return;
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
    const dot = this.add.circle(
      CANNON.x + vx * 29, CANNON.y + vy * 29,
      special ? 8 : 4, special ? 0x72eaf8 : 0xffe29b,
    ).setDepth(35);
    this.projectiles.push({
      sprite: dot,
      vx: vx * (special ? 300 : 480),
      vy: vy * (special ? 300 : 480),
      special,
      tx: special ? CANNON.x + vx * distance : null,
      ty: special ? CANNON.y + vy * distance : null,
      damage: special ? 0 : this.combat.basicDamage,
      pierceLeft: special ? 0 : this.combat.pierce,
      knockback: special ? 0 : this.combat.knockback,
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
      this.impactInvader(index, enemy.type === 5 ? 4 : 3);
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
            bullet.hitEnemyIds.add(enemy.uid);
            this.impactInvader(j, bullet.damage, bullet.knockback);
            bullet.pierceLeft -= 1;
            remove = bullet.pierceLeft <= 0;
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
    if (this.mode === 'upgradeLab') {
      // Laboratório: escudo ainda pode sofrer dano, mas o teste não termina.
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
    if (target.kind === 'tower' && target.tower?.health > 0) {
      const tower = target.tower;
      const result = applyShieldedHit(tower.shield ?? 0, tower.health, amount);
      tower.shield = result.shield;
      tower.health = result.health;
      if (tower.health === 0 && tower.sprite) tower.sprite.setTint(0x545966);
      return;
    }
    this.damageCannon(amount);
  }

  drawShield() {
    const graphics = this.shieldGraphics;
    graphics.clear();
    if (this.shield <= 0) return;
    const fraction = this.shield / this.shieldMax;
    const color = fraction > 0.6 ? 0x70e6ec : fraction > 0.3 ? 0xf4c15e : 0xf06c77;
    graphics.lineStyle(3, color, Math.max(0.35, fraction));
    graphics.beginPath();
    graphics.arc(CANNON.x, CANNON.y + 10, 62, Math.PI, Math.PI * 2, false);
    graphics.strokePath();
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

    if (this.mode === 'wave0') {
      this.scene.start('UpgradeScene');
      return;
    }
    this.statusText.setText('DEFESA BEM-SUCEDIDA');
    this.tutorialText.setText('');
    this.add.rectangle(W / 2, H / 2, W, H, 0x061022, 0.78)
      .setDepth(120).setInteractive();
    this.add.rectangle(W / 2, H / 2, 530, 332, 0x0b1c33, 0.98)
      .setStrokeStyle(2, 0x71e2b9).setDepth(121);
    this.add.text(W / 2, 166, this.mode === 'lab' ? 'TESTE CONCLUÍDO' : 'ONDA 1 CONCLUÍDA!', {
      fontFamily: 'monospace', fontSize: '32px',
      color: '#f4e3a3', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(122);
    this.add.text(W / 2, 218, this.mode === 'lab'
      ? 'Os cinco tipos já têm comportamento provisório.'
      : 'Você experimentou sua primeira melhoria!',
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
    } else if (this.mode === 'wave1') {
      const upgrade = getFirstUpgrade(this.upgradeId);
      this.tutorialText.setText(
        'UPGRADE: ' + (upgrade?.title ?? 'NENHUM') + '  |  DEFENDA A CIDADE',
      );
    } else if (this.mode === 'upgradeLab') {
      this.tutorialText.setText('1–5: GERAR INIMIGOS   C: LIMPAR   U: MELHORIAS');
      const names = this.upgradeIds.map((id) => getFirstUpgrade(id)?.flag).filter(Boolean);
      this.labUpgradeLabel.setText('MELHORIAS ATIVAS: ' + (names.length ? names.join(' + ') : 'NENHUMA'));
    } else {
      this.tutorialText.setText('TESTE: 2 FORMAÇÃO · 3 BOMBAS · 4 LASER · 5 NAVE-MÃE');
    }
  }

  update(_time, delta) {
    if (this.tutorialComplete) {
      if (!this.gameOver) this.updateBlasts();
      return;
    }
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
    this.updateBlasts();

    if (this.time.now - this.lastDamageAt > SHIELD_REGEN_DELAY && this.shield < this.shieldMax) {
      this.shield = Math.min(this.shieldMax, this.shield + SHIELD_REGEN_RATE * dt);
    }
    this.drawShield();
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
