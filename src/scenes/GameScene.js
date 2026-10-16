import Phaser from 'phaser';
import { preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { assetUrl } from '../config/assetUrl.js';
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
  specialTargetPoint,
  SPECIAL_BLAST_DURATION,
} from '../gameplay/specialBlast.js';
import {
  ENEMY_SHOT_COLOR, enemyStats, enemyContactRadius,
  lineFormationX, orbitalFormationPosition, bossCruiseX, minibossSummonCount,
} from '../gameplay/enemies.js';
import {
  getFirstUpgrade, combatStatsFor, shotAngles, shotVisualFor,
  shotVfxFor, brazilAlternatingAngle, combatStatsForLoadout, normalizeLabUpgrades, toggleLabUpgrade,
} from '../gameplay/upgrades.js';
import {
  MODES, getWaveEvents, waveIsFinished, WAVE_COUNTDOWN_SECONDS,
} from '../gameplay/waves.js';
import { addMenuButton } from '../ui/menuButton.js';
import {
  normalizeCampaignState, unlockedFirstUpgrades, unlockedSecondUpgrades,
  activeTowerCountries,
  automaticWaveAfterVictory,
} from '../gameplay/progression.js';
import {
  TOWER_DEFINITIONS, SUPPORT_TOWER_POSITIONS,
  towerDefinition, chooseTowerAttackTarget, canInstallTower,
} from '../gameplay/towers.js';
import {
  SHOCK_BLAST_RADIUS, SHOCK_KNOCKBACK,
  predictShockImpact, segmentHitsCircle, shockBlastDamage, advanceShockOffset,
} from '../gameplay/shockArtillery.js';
import {
  ELECTRIC_FENCE_DAMAGE, ELECTRIC_FENCE_RADIUS_BONUS,
  ELECTRIC_SLOW_FACTOR, ELECTRIC_SLOW_DURATION,
  COLLATERAL_RADIUS, COLLATERAL_DAMAGE,
  RESIDUAL_DURATION, RESIDUAL_DAMAGE, RESIDUAL_HALF_WIDTH,
  electricFieldReaches, canFireElectricFence,
  applySecondUpgradeStats, normalizeSecondUpgradeIds,
  strategicKnockback, strategicRecoilIntensity, vacuumRiftAppearance,
} from '../gameplay/secondUpgrades.js';
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
    this.labSecondIds = this.mode === 'upgradeLab'
      ? normalizeSecondUpgradeIds(data.labSecondIds)
        .filter((id) => this.upgradeIds.includes(id)) : [];
    this.labTowerIds = this.mode === 'upgradeLab'
      ? [...new Set(Array.isArray(data.labTowerIds) ? data.labTowerIds : [])]
        .filter((id) => towerDefinition(id)).slice(0, 2)
      : [];
    const firstUpgrades = unlockedFirstUpgrades(this.campaign);
    const firstStats = this.mode === 'upgradeLab'
      ? combatStatsForLoadout(this.upgradeIds)
      : combatStatsForLoadout(firstUpgrades);
    this.combat = applySecondUpgradeStats(firstStats,
      this.mode === 'upgradeLab' ? this.labSecondIds : unlockedSecondUpgrades(this.campaign));
  }

  getRunOptions() {
    if (this.mode === 'upgradeLab') {
      return {
        mode: this.mode, upgradeIds: [...this.upgradeIds],
        labSecondIds: [...this.labSecondIds],
        labTowerIds: [...this.labTowerIds],
      };
    }
    return { mode: this.mode, campaign: normalizeCampaignState(this.campaign) };
  }

  refreshLabStats() {
    this.combat = applySecondUpgradeStats(
      combatStatsForLoadout(this.upgradeIds), this.labSecondIds,
    );
    this.lastBasicFire = this.time.now - this.combat.basicInterval;
    this.basicShotCount = 0;
    if (!this.combat.residualSlash) this.clearResidualSlashes();
  }

  setUpgradesForLab(ids) {
    if (this.mode !== 'upgradeLab') return;
    this.upgradeIds = normalizeLabUpgrades(ids);
    this.labSecondIds = this.labSecondIds.filter((id) => this.upgradeIds.includes(id));
    this.refreshLabStats();
  }

  toggleUpgradeForLab(id) {
    this.setUpgradesForLab(toggleLabUpgrade(this.upgradeIds, id));
  }

  setSecondUpgradesForLab(ids) {
    if (this.mode !== 'upgradeLab') return;
    this.labSecondIds = normalizeSecondUpgradeIds(ids);
    // Ativar o nível 2 também ativa o nível 1 exigido para o mesmo país.
    this.upgradeIds = normalizeLabUpgrades([...this.upgradeIds, ...this.labSecondIds]);
    this.refreshLabStats();
  }

  toggleSecondUpgradeForLab(id) {
    if (this.mode !== 'upgradeLab') return;
    this.setSecondUpgradesForLab(this.labSecondIds.includes(id)
      ? this.labSecondIds.filter((selected) => selected !== id)
      : [...this.labSecondIds, id]);
  }

  openUpgradeLab() {
    if (this.mode !== 'upgradeLab' || this.scene.isActive('UpgradeLabScene')) return;
    this.scene.pause();
    this.scene.launch('UpgradeLabScene', {
      selectedIds: [...this.upgradeIds], selectedTowerIds: [...this.labTowerIds],
      selectedSecondIds: [...this.labSecondIds],
    });
  }

  clearTestEnemies() {
    if (this.mode !== 'upgradeLab' && this.mode !== 'lab') return;
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) this.removeEnemy(i);
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) this.removeEnemyBullet(i);
    for (const bullet of this.projectiles) {
      bullet.trail?.destroy();
      bullet.sprite.destroy();
    }
    this.projectiles.length = 0;
    this.clearResidualSlashes();
    for (const blast of this.specialBlasts) blast.graphics.destroy();
    this.specialBlasts.length = 0;
    for (const bullet of this.supportProjectiles) bullet.sprite.destroy();
    this.supportProjectiles.length = 0;
  }

  preload() {
    preloadRioBackdrop(this);
    this.load.setPath('');
    for (let frame = 1; frame <= 4; frame += 1) {
      const name = 'frame_' + String(frame).padStart(2, '0') + '.png';
      this.load.image('tipo1_' + frame, assetUrl('assets/inimigos/tipo1/' + name));
    }
  }

  create() {
    this.input.mouse?.disableContextMenu();

    drawRioBackdrop(this);

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
    this.residualSlashes = [];
    this.electricLastFire = -Infinity;
    this.nextEnemyId = 1;
    this.nextBlastId = 1;
    this.elapsed = 0;
    this.countdownActive = false;
    this.eventsSpawned = 0;
    this.waveEvents = getWaveEvents(this.mode);
    this.lastBasicFire = -this.combat.basicInterval;
    this.basicShotCount = 0;
    this.cannonRecoil = 0;
    this.lastHeavyShake = -Infinity;
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

    // Mira de impacto do tiro especial, sem consumir mouse nem bloquear HUD.
    // Fica acima do combate, mas abaixo dos botões e textos de interface.
    this.specialAimGraphics = this.add.graphics().setDepth(80);
    this.specialAimActive = false;
    this.input.on('pointermove', () => { this.specialAimActive = true; });
    this.input.on('gameover', () => { this.specialAimActive = true; });
    this.input.on('gameout', () => {
      this.specialAimActive = false;
      this.specialAimGraphics.clear();
    });
    this.input.on('pointerdown', (pointer) => {
      this.specialAimActive = true;
      if (pointer.rightButtonDown()) this.shootSpecial(pointer);
    });
    this.input.keyboard.on('keydown-R', () => this.scene.restart(this.getRunOptions()));
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    if (import.meta.env.DEV && this.mode.startsWith('wave')) {
      // Playtest local: Shift+5–9 abre a onda diretamente, sem afetar o itch.io.
      // Se entrar antes da terceira escolha, usa Brasil III como equipamento
      // padrão apenas no salto de testes, sem sobrescrever a campanha.
      this.input.keyboard.on('keydown', (event) => {
        if (!event.shiftKey) return;
        const choice = /^Digit([5-9])$/.exec(event.code ?? '');
        if (!choice) return;
        event.preventDefault();
        this.scene.start('GameScene', {
          mode: `wave${choice[1]}`,
          campaign: this.campaign.choices.length >= 3
            ? this.campaign : { choices: ['br', 'br', 'br'] },
        });
      });
    }

    if (this.mode.startsWith('wave')) {
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
      if (id === 'ru') {
        // O Urso ainda é um placeholder, mas ganha silhueta de artilharia pesada.
        const barrel = this.add.rectangle(0, -26, 17, 48, 0x768390)
          .setStrokeStyle(2, 0xffd7a5);
        const muzzle = this.add.rectangle(0, -53, 27, 11, 0xc2a487)
          .setStrokeStyle(2, 0xffe8c2);
        sprite.add([barrel, muzzle]);
      }
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
        electricLastFire: -Infinity,
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

  fireShockArtillery(tower, enemy) {
    const weapon = tower.definition;
    const fromX = tower.x;
    const fromY = tower.y - 35;
    const lead = predictShockImpact(
      fromX, fromY, enemy.sprite.x, enemy.sprite.y,
      enemy.velocityX, enemy.velocityY, weapon.speed,
    );
    // A artilharia não atira para fora da área visível ou sobre o canhão.
    const aimX = Phaser.Math.Clamp(lead.x, 35, W - 35);
    const aimY = Phaser.Math.Clamp(lead.y, 45, H - 95);
    const dx = aimX - fromX;
    const dy = aimY - fromY;
    const distance = Math.max(1, Math.hypot(dx, dy));

    const shell = this.add.circle(fromX, fromY, 9, 0xff9b49)
      .setStrokeStyle(3, 0xffe6a7).setDepth(42);
    const muzzle = this.add.circle(fromX, fromY, 20, 0xffbe71, 0.7).setDepth(44);
    this.tweens.add({
      targets: muzzle, scale: 2, alpha: 0, duration: 150,
      onComplete: () => muzzle.destroy(),
    });

    // O placeholder da torre sofre um recuo físico curto, com retorno suave.
    const restY = tower.y - 12;
    this.tweens.killTweensOf(tower.sprite);
    tower.sprite.y = restY;
    this.tweens.add({
      targets: tower.sprite,
      y: restY + 11,
      duration: 95,
      yoyo: true,
      ease: 'Sine.easeOut',
    });

    this.supportProjectiles.push({
      kind: 'shock-shell',
      sprite: shell,
      weapon,
      vx: dx / distance * weapon.speed,
      vy: dy / distance * weapon.speed,
      aimX, aimY, age: 0, smokeTimer: 0,
    });
  }

  makeShockSmoke(x, y) {
    const puff = this.add.circle(x, y, Phaser.Math.Between(4, 7), 0x7a7783, 0.65)
      .setDepth(37);
    this.tweens.add({
      targets: puff,
      alpha: 0, scale: 2.2, y: y - 14,
      duration: 490,
      onComplete: () => puff.destroy(),
    });
  }

  detonateShockArtillery(x, y, weapon) {
    // Dano de área instantâneo, sem dano repetido durante a animação.
    // A queda é suave: alvos centrais sofrem dano cheio, bordas dano reduzido.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      const distance = Math.hypot(enemy.sprite.x - x, enemy.sprite.y - y);
      const damage = shockBlastDamage(
        distance, enemyContactRadius(enemy.type), weapon.damage, SHOCK_BLAST_RADIUS,
      );
      if (damage <= 0) continue;
      this.impactInvader(i, damage, SHOCK_KNOCKBACK, '#ffca83');
      // As naves que não estão em mergulho também recebem um deslocamento
      // amortecido; a posição normal é recuperada sem salto no frame seguinte.
      if (enemy.sprite.active && enemy.phase !== 'dive') {
        const dx = enemy.sprite.x - x;
        const dy = enemy.sprite.y - y;
        const norm = Math.max(16, Math.hypot(dx, dy));
        enemy.shockOffset.vx += dx / norm * 260;
        enemy.shockOffset.vy += dy / norm * 260 - 55;
      }
    }

    // Estilhaços de choque também ajudam a limpar bombas dos bombardeiros.
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const hostile = this.enemyBullets[i];
      if (Math.hypot(hostile.sprite.x - x, hostile.sprite.y - y) <= SHOCK_BLAST_RADIUS + 7) {
        this.removeEnemyBullet(i);
      }
    }

    const blast = this.add.circle(x, y, SHOCK_BLAST_RADIUS, 0xff8a43, 0.30)
      .setStrokeStyle(5, 0xffdfa0, 0.95)
      .setScale(0.12)
      .setDepth(45);
    const core = this.add.circle(x, y, 27, 0xffe9a8, 0.87).setDepth(46);
    this.tweens.add({
      targets: blast,
      scale: 1, alpha: 0, duration: 370,
      ease: 'Cubic.easeOut',
      onComplete: () => blast.destroy(),
    });
    this.tweens.add({
      targets: core,
      scale: 1.9, alpha: 0, duration: 220,
      onComplete: () => core.destroy(),
    });
    // Feedback curto, sem sacudir excessivamente a mira do jogador.
    this.cameras.main.shake(100, 0.0021);
  }

  updateShockShell(shot, dt) {
    const oldX = shot.sprite.x;
    const oldY = shot.sprite.y;
    const aimDistance = Math.hypot(shot.aimX - oldX, shot.aimY - oldY);
    const step = shot.weapon.speed * dt;
    const atDestination = aimDistance <= step + 6;
    const nextX = atDestination ? shot.aimX : oldX + shot.vx * dt;
    const nextY = atDestination ? shot.aimY : oldY + shot.vy * dt;
    shot.sprite.setPosition(nextX, nextY);

    shot.smokeTimer += dt;
    if (shot.smokeTimer >= 0.065) {
      shot.smokeTimer = 0;
      this.makeShockSmoke(nextX, nextY);
    }

    let impactX = nextX;
    let impactY = nextY;
    let impact = atDestination;
    if (!impact) {
      for (const enemy of this.enemies) {
        if (segmentHitsCircle(
          oldX, oldY, nextX, nextY, enemy.sprite.x, enemy.sprite.y,
          enemyContactRadius(enemy.type) + 9,
        )) {
          // Se uma nave cruzar o caminho, a bomba explode no impacto real.
          impactX = enemy.sprite.x;
          impactY = enemy.sprite.y;
          impact = true;
          break;
        }
      }
    }
    if (!impact && shot.age >= 4) {
      impact = true;
      impactX = Phaser.Math.Clamp(nextX, 35, W - 35);
      impactY = Phaser.Math.Clamp(nextY, 45, H - 95);
    }
    if (impact) this.detonateShockArtillery(impactX, impactY, shot.weapon);
    return impact;
  }

  fireTowerWeapon(tower, enemy) {
    const weapon = tower.definition;
    const fromX = tower.x;
    const fromY = tower.y - 35;

    if (weapon.type === 'shell') {
      this.fireShockArtillery(tower, enemy);
      return;
    }

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
      if (shot.kind === 'shock-shell') {
        if (this.updateShockShell(shot, dt)) {
          shot.sprite.destroy();
          this.supportProjectiles.splice(i, 1);
        }
        continue;
      }
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
    const selected = targets[Phaser.Math.Between(0, targets.length - 1)];
    if (!this.combat.electricFence) return selected;
    const shieldEnergy = selected.kind === 'cannon' ? this.shield : selected.tower?.shield;
    // Além de maior na tela, a cúpula ampliada recebe as colisões um pouco
    // mais cedo. Não muda o alvo caso a barreira esteja sem energia.
    return shieldEnergy > 0
      ? { ...selected, y: selected.y - ELECTRIC_FENCE_RADIUS_BONUS }
      : selected;
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
    const definition = enemyStats(type, level);
    if (type === 1) {
      const sprite = this.add.sprite(x, y, 'tipo1_1')
        .setDisplaySize(62, 72).setDepth(18).play('tipo1_voo');
      if (level > 1) sprite.setTint(definition.tintColor);
      return { sprite, box: null };
    }
    const sprite = this.add.container(x, y).setDepth(19);
    const box = this.add.rectangle(0, 0, definition.width, definition.height, definition.color)
      .setStrokeStyle(level > 1 ? 3 : 2, level >= 3 ? 0xffffff : level > 1 ? 0xffd26e : 0xf7efff);
    // O nível III+ é comunicado pela cor: manter apenas o número do tipo
    // evita rótulos grandes fora da hitbox das naves de formação.
    const label = this.add.text(0, 0, String(type) + (level === 2 ? ' II' : ''), {
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
    if (event.warning) this.showAttackWarning(event.warning);
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
      this.showAttackWarning(level <= 2
        ? 'ESQUADRÃO EM ÓRBITA • NÍVEL 2' : 'ESQUADRÃO BLINDADO EM ÓRBITA!');
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(2, {
          level, pattern: 'orbit',
          center, formationIndex: i, formationCount: count,
        });
      }
      return;
    }
    if (event.type === 3 && event.pattern === 'escort') {
      // Bombardeiro e escolta Tipo 2 chegam coordenados ao mesmo corredor.
      const center = event.center ?? W / 2;
      const count = event.count ?? 4;
      this.spawnEnemy(3, { level, x: center, center, pattern: 'escort' });
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(2, { level, center, formationIndex: i, formationCount: count });
      }
      return;
    }
    if (event.type === 3 && event.pattern === 'bomberFan') {
      // Leque de bombardeiros alinhados em corredores distintos.
      const count = event.count ?? 3;
      for (let i = 0; i < count; i += 1) {
        const x = lineFormationX(i, count, W, 220);
        this.spawnEnemy(3, { level, x, center: x, pattern: 'bomberFan' });
      }
      return;
    }
    if (event.type === 2 && event.group) {
      const center = Phaser.Math.Between(300, 650);
      const count = event.count ?? 3;
      for (let i = 0; i < count; i += 1) {
        this.spawnEnemy(2, { level, center, formationIndex: i, formationCount: count });
      }
      return;
    }
    if (event.type === 4 && event.pattern === 'pincer') {
      // Entrada realmente simultânea, um caça em cada lateral.
      this.spawnEnemy(4, { level, side: 'left' });
      this.spawnEnemy(4, { level, side: 'right' });
      return;
    }
    this.spawnEnemy(event.type, { level, side: event.side });
  }

  spawnEnemy(type, options = {}) {
    const level = options.level ?? 1;
    const definition = enemyStats(type, level);
    const index = options.formationIndex ?? 1;
    const orbiting = type === 2 && options.pattern === 'orbit';
    const groupCount = options.formationCount ?? 3;
    const center = options.center ?? W / 2;
    const formationOffset = index - (groupCount - 1) / 2;
    const startX = type === 5 ? W / 2 :
      type === 4 ? (options.side === 'left' ? -64
        : options.side === 'right' ? W + 64
          : Phaser.Math.Between(0, 1) ? -64 : W + 64) :
      type === 2 ? center + formationOffset * (orbiting ? 60 : 83) :
      options.x ?? Phaser.Math.Between(120, W - 120);
    const startY = type === 4 ? Phaser.Math.Between(120, 180) :
      type === 2 ? -45 - Math.abs(formationOffset) * 7 :
      type === 1 ? (options.y ?? -28) : -65;
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
      electricSlowUntil: -1,
      velocityX: 0,
      velocityY: 0,
      shockOffset: { x: 0, y: 0, vx: 0, vy: 0 },
      phase: 'dive',
      age: 0,
      phaseAge: 0,
      shotTimer: 0,
      spawnTimer: 0,
      spawnedMinions: 0,
      sourceBossId: options.sourceBossId ?? null,
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
      enemy.formationX = center + formationOffset * 38;
      enemy.formationY = 143 + Math.abs(formationOffset) * 21;
      enemy.formationWait = 2.6 + index * 0.65 + definition.formationWaitBonus;
    } else if (type === 3) {
      enemy.phase = 'approach';
      this.setRoute(enemy,
        options.pattern === 'escort' || options.pattern === 'bomberFan'
          ? options.center : Phaser.Math.Between(235, 725),
        Phaser.Math.Between(170, 220));
    } else if (type === 4) {
      enemy.phase = 'flyby';
      enemy.direction = startX < 0 ? 1 : -1;
      enemy.passesRemaining = definition.fighterExtraPasses;
    } else if (type === 5) {
      enemy.phase = 'arrival';
    }
    this.enemies.push(enemy);
    return enemy;
  }

  moveAlongRoute(enemy, dt) {
    const slow = this.time.now < enemy.electricSlowUntil ? ELECTRIC_SLOW_FACTOR : 1;
    const result = advanceRouteWithRecoil(
      enemy.progress, enemy.speed * slow, enemy.recoilSpeed, enemy.pathLength, dt,
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
      // Desfaz o deslocamento visual anterior para não interferir no percurso
      // calculado pela nave (incluindo curvas, voos rasantes e órbitas).
      const previousShock = enemy.shockOffset;
      enemy.sprite.x -= previousShock.x;
      enemy.sprite.y -= previousShock.y;
      const previousX = enemy.sprite.x;
      const previousY = enemy.sprite.y;
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
        if (enemy.phaseAge >= enemy.definition.bomberHoverDuration) {
          enemy.phase = 'dive';
          this.assignInvaderTarget(enemy, enemy.target);
        }
      } else if (enemy.phase === 'flyby') {
        const slow = this.time.now < enemy.electricSlowUntil ? ELECTRIC_SLOW_FACTOR : 1;
        enemy.sprite.x += enemy.direction * enemy.speed * slow * dt;
        if ((enemy.direction > 0 && enemy.sprite.x >= W + 55) ||
            (enemy.direction < 0 && enemy.sprite.x <= -55)) {
          if (enemy.passesRemaining > 0) {
            // Novas versões blindadas: segunda passagem lateral na tela,
            // ainda com a velocidade de caça, antes do mergulho com laser.
            enemy.passesRemaining -= 1;
            enemy.direction *= -1;
            enemy.sprite.y = Phaser.Math.Clamp(
              enemy.sprite.y + (enemy.direction > 0 ? 30 : -30), 110, 215);
          } else {
            enemy.phase = 'swoop1';
            enemy.phaseAge = 0;
            this.setRoute(enemy, enemy.direction > 0 ? -30 : W + 30, 245);
          }
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
          const campaignMiniboss = this.mode === 'wave8' || this.mode === 'wave9';
          const liveMinions = campaignMiniboss
            ? this.enemies.filter((unit) => unit.sourceBossId === enemy.uid).length : 0;
          const count = campaignMiniboss
            ? minibossSummonCount(enemy.spawnedMinions, liveMinions,
              enemy.definition.spawnCount) : enemy.definition.spawnCount;
          // Na campanha, minions herdam HP/cor do nível atual. O miniboss
          // tem no máximo 12 invocações totais e 6 vivas simultaneamente.
          for (let j = 0; j < count; j += 1) {
            const spread = (j - (count - 1) / 2) * 84;
            this.spawnEnemy(1, {
              level: campaignMiniboss ? enemy.level : enemy.level > 1 ? 2 : 1,
              x: Phaser.Math.Clamp(enemy.sprite.x + spread, 100, W - 100),
              y: campaignMiniboss ? enemy.sprite.y + 38 : undefined,
              sourceBossId: campaignMiniboss ? enemy.uid : null,
            });
          }
          enemy.spawnedMinions += count;
        }
      } else if (enemy.phase === 'dive') {
        if (this.moveAlongRoute(enemy, dt)) {
          this.removeEnemy(i);
          this.damageTarget(enemy.target, ENEMY_IMPACT_DAMAGE * (enemy.level > 1 ? 1.12 : 1));
          if (this.gameOver) return;
          continue;
        }
      }

      // Estima velocidade real para a mira preditiva (sem incluir recuo visual).
      const instantVx = Phaser.Math.Clamp(
        (enemy.sprite.x - previousX) / Math.max(dt, 0.001), -330, 330,
      );
      const instantVy = Phaser.Math.Clamp(
        (enemy.sprite.y - previousY) / Math.max(dt, 0.001), -330, 330,
      );
      const smooth = Math.min(1, dt * 10);
      enemy.velocityX = Phaser.Math.Linear(enemy.velocityX, instantVx, smooth);
      enemy.velocityY = Phaser.Math.Linear(enemy.velocityY, instantVy, smooth);
      enemy.shockOffset = advanceShockOffset(previousShock, dt);
      enemy.sprite.x += enemy.shockOffset.x;
      enemy.sprite.y += enemy.shockOffset.y;

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
      graphics.fillStyle(enemy.level >= 3 ? enemy.definition.color
        : enemy.level > 1 ? 0xffc977 : 0x6df3ba, 0.95);
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

  impactInvader(index, damage = 1, knockback = 0, hitColor = '#ffe09f',
    showNumber = true, maxRecoil = 400) {
    const enemy = this.enemies[index];
    if (!enemy) return false;
    if (showNumber) this.popHitNumber(enemy.sprite.x, enemy.sprite.y, damage, hitColor);
    enemy.hp -= damage;
    const killed = enemy.hp <= 0;
    if (killed) {
      this.removeEnemy(index);
    } else {
      if (enemy.box) enemy.box.setFillStyle(0xffffff);
      else enemy.sprite.setTint(0xffa8a8);
      this.time.delayedCall(100, () => {
        if (!enemy.sprite.active) return;
        if (enemy.box?.active) enemy.box.setFillStyle(enemy.definition.color);
        else enemy.sprite.setTint(enemy.definition.tintColor);
      });
      if (enemy.phase === 'dive' && knockback > 0) {
        enemy.recoilSpeed = applyRecoilImpulse(enemy.recoilSpeed, knockback, maxRecoil);
      }
    }
    return killed;
  }

  activeUpgradeIds() {
    return this.mode === 'upgradeLab'
      ? this.upgradeIds
      : unlockedFirstUpgrades(this.campaign);
  }

  showMuzzleFlash(angle, effects = shotVfxFor(this.activeUpgradeIds())) {
    const style = shotVisualFor(this.activeUpgradeIds());
    const x = CANNON.x + Math.cos(angle) * 34;
    const y = CANNON.y + Math.sin(angle) * 34;
    const flash = this.add.circle(
      x, y, effects.heavy ? 11 : effects.multiple ? 8 : 7,
      effects.heavy ? 0xffe1b5 : style.color, 0.92,
    ).setDepth(38);
    this.tweens.add({
      targets: flash, scale: effects.heavy ? 3.2 : 2.5, alpha: 0,
      duration: effects.heavy ? 180 : 145,
      onComplete: () => flash.destroy(),
    });

    if (effects.heavy) {
      // Peso VISUAL, sem alterar dano/recuo físico. A microtremida é limitada
      // para não acumular nas builds brasileiras de alta cadência.
      const burst = this.add.graphics().setPosition(x, y).setDepth(39);
      burst.lineStyle(3, 0xffe9c8, 0.95);
      for (const offset of [-0.33, 0, 0.33]) {
        const a = angle + offset;
        burst.lineBetween(
          Math.cos(a) * 7, Math.sin(a) * 7,
          Math.cos(a) * 29, Math.sin(a) * 29,
        );
      }
      this.tweens.add({
        targets: burst, scale: 1.45, alpha: 0, duration: 160,
        onComplete: () => burst.destroy(),
      });
      if (this.time.now - this.lastHeavyShake >= 230) {
        this.cameras.main.shake(60, 0.0011);
        this.lastHeavyShake = this.time.now;
      }
    }

    if (effects.multiple) {
      // Um clarão por boca fictícia do canhão: as duas trilhas de tiro são
      // desenhadas independentemente, inclusive em builds RU + CN.
      const px = -Math.sin(angle) * 8;
      const py = Math.cos(angle) * 8;
      for (const sign of [-1, 1]) {
        const glow = this.add.circle(
          x + px * sign, y + py * sign, 5.5,
          sign < 0 ? 0xffb34f : 0xff6757, 0.92,
        ).setDepth(39);
        this.tweens.add({
          targets: glow, scale: 2.15, alpha: 0, duration: 120,
          onComplete: () => glow.destroy(),
        });
      }
      if (!effects.heavy) {
        this.time.delayedCall(45, () => {
          if (this.barrel?.active) this.cannonRecoil = Math.max(this.cannonRecoil, 2.5);
        });
      }
    }

    if (effects.improvised) {
      const side = this.basicShotCount % 2 === 1 ? -1 : 1;
      const accent = this.add.circle(
        x - Math.sin(angle) * side * 7,
        y + Math.cos(angle) * side * 7,
        4.5, 0xbaffb2, 0.9,
      ).setDepth(39);
      this.tweens.add({
        targets: accent, scale: 1.8, alpha: 0, duration: 110,
        onComplete: () => accent.destroy(),
      });
    }

    this.cannonRecoil = Math.max(this.cannonRecoil, effects.recoil);
  }

  shootBasic(pointer) {
    if (this.tutorialComplete || this.countdownActive) return;
    if (this.time.now - this.lastBasicFire < this.combat.basicInterval) return;
    this.lastBasicFire = this.time.now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    const nextShot = this.basicShotCount + 1;
    // A alternância brasileira é aplicada à rajada INTEIRA; todos os
    // projéteis chineses continuam com seu spread simétrico em torno dela.
    const aimed = brazilAlternatingAngle(angle, nextShot, this.combat.brazilZigzag);
    const effects = shotVfxFor(this.activeUpgradeIds());
    for (const firingAngle of shotAngles(aimed, this.combat.bulletsPerShot)) {
      this.createProjectile(firingAngle, false, 0, effects);
    }
    this.basicShotCount = nextShot;
    // O laser coreano mantém a direção da mira original (a oscilação da
    // Gambiarra altera apenas as balas básicas, não a arma laser).
    if (isPlasmaShot(this.basicShotCount, this.combat.plasmaEvery > 0)) {
      this.firePlasmaKatana(angle);
    }
    this.showMuzzleFlash(aimed, effects);
  }

  firePlasmaKatana(angle) {
    const startX = CANNON.x + Math.cos(angle) * 32;
    const startY = CANNON.y + Math.sin(angle) * 32;
    const endX = startX + Math.cos(angle) * PLASMA_RANGE;
    const endY = startY + Math.sin(angle) * PLASMA_RANGE;

    // A lâmina atravessa toda a linha do tiro, independentemente do HP.
    // Cada nave sofre dano uma única vez por pulso.
    const initialHitIds = new Set();
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (laserHitsTarget(
        startX, startY, endX, endY,
        enemy.sprite.x, enemy.sprite.y,
        PLASMA_HALF_WIDTH, enemyContactRadius(enemy.type),
      )) {
        initialHitIds.add(enemy.uid);
        this.impactInvader(i, PLASMA_DAMAGE, 0, '#e9aaff');
      }
    }
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.enemyBullets[i];
      if (laserHitsTarget(
        startX, startY, endX, endY, bullet.sprite.x, bullet.sprite.y, PLASMA_HALF_WIDTH, 7,
      )) this.removeEnemyBullet(i);
    }
    if (this.combat.residualSlash) {
      this.createResidualSlash(startX, startY, endX, endY, initialHitIds);
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

  createResidualSlash(x1, y1, x2, y2, initialHitIds = new Set()) {
    // A Katana roxa abre uma FENDA turquesa com centro escuro. A fenda
    // se alarga progressivamente e depois se fecha, não é só outro laser.
    const trail = this.add.graphics().setDepth(47);
    this.residualSlashes.push({
      graphics: trail, x1, y1, x2, y2,
      bornAt: this.time.now, hitIds: new Set(initialHitIds),
    });
  }

  drawVacuumRift(slash, age) {
    const { width, alpha } = vacuumRiftAppearance(age);
    const graphics = slash.graphics;
    graphics.clear();
    if (alpha <= 0 || width <= 0) return;
    graphics.setAlpha(alpha);

    const dx = slash.x2 - slash.x1;
    const dy = slash.y2 - slash.y1;
    const length = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;

    // Halo de pressão, bordas azul-turquesa e vazio central.
    graphics.lineStyle(width * 2 + 18, 0x18d7d8, 0.12);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);
    graphics.lineStyle(width * 2 + 7, 0x298cbd, 0.33);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);
    graphics.lineStyle(Math.max(2, width * 2), 0x020a19, 0.95);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);

    for (const direction of [-1, 1]) {
      const edgeX = nx * width * direction;
      const edgeY = ny * width * direction;
      graphics.lineStyle(2.7, 0x8bfff2, 0.95);
      graphics.lineBetween(
        slash.x1 + edgeX, slash.y1 + edgeY,
        slash.x2 + edgeX, slash.y2 + edgeY,
      );
    }

    // Fissuras curtas e intermitentes atravessam a abertura.
    for (let i = 1; i <= 8; i += 1) {
      const t = i / 9;
      const flicker = Math.sin(age * 0.018 + i * 2.4);
      if (flicker < -0.35) continue;
      const centerX = slash.x1 + dx * t;
      const centerY = slash.y1 + dy * t;
      const sparkWidth = width * (0.25 + 0.4 * Math.max(0, flicker));
      graphics.lineStyle(1.8, 0xd4fff6, 0.55 + 0.4 * Math.max(0, flicker));
      graphics.lineBetween(
        centerX - nx * sparkWidth, centerY - ny * sparkWidth,
        centerX + nx * sparkWidth, centerY + ny * sparkWidth,
      );
    }
  }

  clearResidualSlashes() {
    for (const slash of this.residualSlashes ?? []) slash.graphics.destroy();
    if (this.residualSlashes) this.residualSlashes.length = 0;
  }

  updateResidualSlashes() {
    for (let i = this.residualSlashes.length - 1; i >= 0; i -= 1) {
      const slash = this.residualSlashes[i];
      const age = this.time.now - slash.bornAt;
      if (age >= RESIDUAL_DURATION) {
        slash.graphics.destroy();
        this.residualSlashes.splice(i, 1);
        continue;
      }
      this.drawVacuumRift(slash, age);
      for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
        const enemy = this.enemies[j];
        if (slash.hitIds.has(enemy.uid)) continue;
        if (!laserHitsTarget(
          slash.x1, slash.y1, slash.x2, slash.y2,
          enemy.sprite.x, enemy.sprite.y,
          RESIDUAL_HALF_WIDTH, enemyContactRadius(enemy.type),
        )) continue;
        slash.hitIds.add(enemy.uid);
        this.impactInvader(j, RESIDUAL_DAMAGE, 0, '#e5a3ff', false);
      }
    }
  }

  explodeCollateral(x, y) {
    // Um único estouro extra por bala de Fragmentação; nunca dispara outra
    // explosão de Dano Colateral ao matar novos inimigos nesta segunda área.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (fragmentHitsTarget(
        x, y, enemy.sprite.x, enemy.sprite.y,
        enemyContactRadius(enemy.type), COLLATERAL_RADIUS,
      )) this.impactInvader(i, COLLATERAL_DAMAGE, 0, '#ffd59b', false);
    }
    const ring = this.add.circle(x, y, COLLATERAL_RADIUS, 0xffa052, 0.22)
      .setStrokeStyle(3, 0xffedac, 0.9).setScale(0.1).setDepth(46);
    this.tweens.add({
      targets: ring, scale: 1, alpha: 0, duration: 280,
      onComplete: () => ring.destroy(),
    });
  }

  explodeFragments(x, y, directTargetId, firstDestroyed = null) {
    // Fragmentação só é disparada ao acertar um alvo, nunca ao expirar no céu.
    // O inimigo atingido já sofreu o impacto direto; o raio pega os vizinhos.
    let casualty = firstDestroyed;
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (enemy.uid === directTargetId) continue;
      if (fragmentHitsTarget(
        x, y, enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type),
      )) {
        const position = { x: enemy.sprite.x, y: enemy.sprite.y };
        const killed = this.impactInvader(i, FRAGMENT_DAMAGE, 0, '#90cfff');
        if (killed && !casualty) casualty = position;
      }
    }
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const shot = this.enemyBullets[i];
      if (fragmentHitsTarget(x, y, shot.sprite.x, shot.sprite.y, 8)) {
        this.removeEnemyBullet(i);
      }
    }
    if (this.combat.collateral && casualty) {
      this.explodeCollateral(casualty.x, casualty.y);
    }
    // Fragmentação americana: estilhaços curtos e claros, apenas decorativos.
    const shards = this.add.graphics().setPosition(x, y).setDepth(45);
    for (let i = 0; i < 7; i += 1) {
      const a = (i * Math.PI * 2) / 7;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      shards.lineStyle(i % 2 === 0 ? 2.4 : 1.5,
        i % 2 === 0 ? 0xe9f8ff : 0x78c9ff, 0.92);
      shards.lineBetween(dx * 13, dy * 13, dx * 36, dy * 36);
    }
    this.tweens.add({
      targets: shards, scale: 1.6, alpha: 0, duration: 240,
      onComplete: () => shards.destroy(),
    });
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

  drawSpecialAim(pointer) {
    const gfx = this.specialAimGraphics;
    gfx.clear();
    if (!this.specialAimActive || this.countdownActive || this.tutorialComplete) return;

    // Exibe o ponto exato do disparo, não só a coordenada crua do cursor.
    // Isto também cobre o ângulo limitado e os alcances mínimo/máximo.
    const { x, y } = specialTargetPoint(CANNON.x, CANNON.y, pointer.x, pointer.y);
    const ready = this.time.now - this.lastSpecialFire >= this.combat.specialCooldown;
    const alpha = ready ? 0.65 : 0.25;
    gfx.fillStyle(0x37ddfb, ready ? 0.10 : 0.04);
    gfx.fillCircle(x, y, 14);
    gfx.lineStyle(1.5, 0x8bf5ff, alpha);
    gfx.strokeCircle(x, y, 14);
    gfx.lineStyle(1.5, 0xcaffff, alpha * 0.95);
    gfx.lineBetween(x - 23, y, x - 17, y);
    gfx.lineBetween(x + 17, y, x + 23, y);
    gfx.lineBetween(x, y - 23, x, y - 17);
    gfx.lineBetween(x, y + 17, x, y + 23);
    gfx.fillStyle(0xbaffff, alpha);
    gfx.fillCircle(x, y, 2.5);
  }

  shootSpecial(pointer) {
    if (this.tutorialComplete || this.countdownActive) return;
    if (this.time.now - this.lastSpecialFire < this.combat.specialCooldown) return;
    const target = specialTargetPoint(
      CANNON.x, CANNON.y, pointer.x, pointer.y,
    );
    this.lastSpecialFire = this.time.now;
    this.createProjectile(target.angle, true, target.distance);
  }

  createProjectile(angle, special, distance = 0, effects = null) {
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const x = CANNON.x + vx * 29;
    const y = CANNON.y + vy * 29;
    const style = shotVisualFor(this.activeUpgradeIds());
    const vfx = special ? null : (effects ?? shotVfxFor(this.activeUpgradeIds()));
    const dot = special
      ? this.add.circle(x, y, 8, 0x72eaf8).setDepth(35)
      : this.add.rectangle(x, y, style.width, style.length, style.color)
        .setStrokeStyle(1, 0xffffff, 0.65)
        .setRotation(angle + Math.PI / 2)
        .setDepth(35);
    const speed = special ? 300 : this.combat.basicSpeed;
    // Uma única Graphics por bala, redesenhada enquanto ela se move.
    // Sem gerar partículas novas a cada frame (essencial com 3+ tiros).
    const trail = vfx && (vfx.heavy || vfx.multiple)
      ? this.add.graphics().setDepth(34) : null;
    const bullet = {
      sprite: dot,
      trail,
      vfx,
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
    };
    this.projectiles.push(bullet);
    this.drawProjectileTrail(bullet);
  }

  drawProjectileTrail(bullet) {
    const gfx = bullet.trail;
    if (!gfx) return;
    const { x, y } = bullet.sprite;
    const length = Math.hypot(bullet.vx, bullet.vy) || 1;
    const dx = bullet.vx / length;
    const dy = bullet.vy / length;
    gfx.clear();
    if (bullet.vfx.heavy) {
      // Rastro quente russo: halo vermelho e núcleo branco-alaranjado.
      gfx.lineStyle(10, 0xff594c, 0.18);
      gfx.lineBetween(x - dx * 30, y - dy * 30, x, y);
      gfx.lineStyle(3, 0xffd6ab, 0.92);
      gfx.lineBetween(x - dx * 23, y - dy * 23, x, y);
    }
    if (bullet.vfx.multiple) {
      // Destaque independente dos dois/três tiros da China. Pode coexistir
      // com o rastro russo sem perder o brilho vermelho/dourado.
      gfx.lineStyle(8, 0xffa52c, 0.26);
      gfx.lineBetween(x - dx * 29, y - dy * 29, x, y);
      gfx.lineStyle(2, 0xffef87, 0.95);
      gfx.lineBetween(x - dx * 20, y - dy * 20, x, y);
    }
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

  showHeavyImpact(x, y) {
    // Impacto russo de nível 1: anel e faíscas sem dano adicional.
    // Se Recuo Estratégico (nível 2) estiver ativo, seu efeito mais forte
    // substitui este anel para evitar sobreposição desnecessária.
    const gfx = this.add.graphics().setPosition(x, y).setDepth(53);
    gfx.lineStyle(3, 0xffb273, 0.9);
    gfx.strokeCircle(0, 0, 10);
    gfx.lineStyle(1.5, 0xffeed0, 0.95);
    gfx.strokeCircle(0, 0, 5);
    for (let i = 0; i < 6; i += 1) {
      const a = i * Math.PI / 3;
      gfx.lineStyle(2, i % 2 ? 0xffa868 : 0xffffff, 0.88);
      gfx.lineBetween(
        Math.cos(a) * 14, Math.sin(a) * 14,
        Math.cos(a) * 26, Math.sin(a) * 26,
      );
    }
    this.tweens.add({
      targets: gfx, alpha: 0, scale: 1.65, duration: 240,
      onComplete: () => gfx.destroy(),
    });
  }

  showStrategicRecoilImpact(x, y) {
    const intensity = strategicRecoilIntensity(y);
    const radius = 12 + intensity * 33;
    const graphic = this.add.graphics().setPosition(x, y).setDepth(53);
    // O anel cresce com a potência de recuo: vermelho suave no alto da tela,
    // explosão branco-laranja e estilhaços nas regiões próximas ao chão.
    graphic.lineStyle(2 + intensity * 3.5, 0xff8a59, 0.73 + intensity * 0.27);
    graphic.strokeCircle(0, 0, radius);
    graphic.lineStyle(1.5 + intensity * 2, 0xfff2d1, 0.65 + intensity * 0.30);
    graphic.strokeCircle(0, 0, radius * 0.54);
    graphic.fillStyle(0xffe3ac, 0.32 + intensity * 0.38);
    graphic.fillCircle(0, 0, 3 + intensity * 6);
    const rays = 4 + Math.round(intensity * 9);
    for (let i = 0; i < rays; i += 1) {
      const angle = (i * Math.PI * 2) / rays + Math.sin(i * 7.3) * 0.17;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      graphic.lineStyle(1.5 + intensity * 1.5,
        i % 3 === 0 ? 0xffffff : 0xffab76, 0.70 + intensity * 0.30);
      graphic.lineBetween(
        dx * (radius + 3), dy * (radius + 3),
        dx * (radius + 7 + intensity * 19),
        dy * (radius + 7 + intensity * 19),
      );
    }
    this.tweens.add({
      targets: graphic, alpha: 0, scale: 1.45 + intensity * 0.65,
      duration: 240 + intensity * 160, ease: 'Cubic.easeOut',
      onComplete: () => graphic.destroy(),
    });
  }

  updatePlayerProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const bullet = this.projectiles[i];
      bullet.sprite.x += bullet.vx * dt;
      bullet.sprite.y += bullet.vy * dt;
      this.drawProjectileTrail(bullet);
      let remove = false;

      if (bullet.special && Phaser.Math.Distance.Between(
        bullet.sprite.x, bullet.sprite.y, bullet.tx, bullet.ty,
      ) <= 300 * dt + 6) {
        bullet.sprite.setPosition(bullet.tx, bullet.ty);
        this.explode(bullet.tx, bullet.ty);
        remove = true;
      }

      // O especial só detona na mira (tx,ty), não ao tocar projéteis no caminho.
      // Dessa forma a marca semitransparente indica um ponto garantido.
      if (!remove && !bullet.special) {
        for (let j = this.enemyBullets.length - 1; j >= 0; j -= 1) {
          const hostile = this.enemyBullets[j];
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, hostile.sprite.x, hostile.sprite.y,
          ) >= 16) continue;
          hostile.hp -= bullet.damage;
          if (hostile.hp <= 0) this.removeEnemyBullet(j);
          else hostile.sprite.setFillStyle(0xfff5d0);
          remove = true;
          break;
        }
      }

      // OVNIs cruzando a trajetória do especial não alteram o local de explosão.
      if (!remove && !bullet.special) {
        for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
          const enemy = this.enemies[j];
          if (bullet.hitEnemyIds.has(enemy.uid)) continue;
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, enemy.sprite.x, enemy.sprite.y,
          ) >= enemyContactRadius(enemy.type) + 7) continue;

          const directTargetId = enemy.uid;
          bullet.hitEnemyIds.add(directTargetId);
          const deathPosition = { x: enemy.sprite.x, y: enemy.sprite.y };
          const knockback = this.combat.strategicRecoil && bullet.knockback > 0
            ? strategicKnockback(bullet.knockback, enemy.sprite.y)
            : bullet.knockback;
          const destroyed = this.impactInvader(
            j, bullet.damage, knockback, bullet.impactColor,
            true, this.combat.strategicRecoil ? 720 : 400,
          );
          if (bullet.knockback > 0) {
            if (this.combat.strategicRecoil) {
              this.showStrategicRecoilImpact(deathPosition.x, deathPosition.y);
            } else {
              this.showHeavyImpact(deathPosition.x, deathPosition.y);
            }
          }
          if (bullet.fragmentation) {
            this.explodeFragments(bullet.sprite.x, bullet.sprite.y, directTargetId,
              destroyed ? deathPosition : null);
            remove = true;
          } else {
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
        bullet.trail?.destroy();
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

  fireElectricFence(x, y, radius, target) {
    // Origem sobre a borda da cúpula: não há laser global nem raio comprido.
    const dx = target.sprite.x - x;
    const dy = target.sprite.y - y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const originX = x + dx / distance * radius;
    const originY = y + dy / distance * radius;
    const endX = target.sprite.x;
    const endY = target.sprite.y;
    const arc = this.add.graphics().setDepth(50);
    arc.lineStyle(3, 0xffeaa2, 0.95);
    arc.beginPath();
    arc.moveTo(originX, originY);
    const perpX = -dy / distance;
    const perpY = dx / distance;
    for (let point = 1; point <= 4; point += 1) {
      const t = point / 5;
      const jitter = Phaser.Math.Between(-5, 5);
      arc.lineTo(originX + (endX - originX) * t + perpX * jitter,
        originY + (endY - originY) * t + perpY * jitter);
    }
    arc.lineTo(endX, endY);
    arc.strokePath();
    arc.lineStyle(1, 0x7bffb0, 0.75);
    arc.lineBetween(originX, originY, endX, endY);
    const pulse = this.add.circle(originX, originY, 5, 0xbaffc4, 0.65)
      .setDepth(49);
    this.tweens.add({
      targets: arc, alpha: 0, duration: 150,
      onComplete: () => arc.destroy(),
    });
    this.tweens.add({
      targets: pulse, alpha: 0, scale: 2.5, duration: 230,
      onComplete: () => pulse.destroy(),
    });
  }

  updateElectricFences() {
    if (!this.combat.electricFence) return;
    const shields = [
      {
        x: CANNON.x, y: CANNON.y + 10,
        radius: 62 + ELECTRIC_FENCE_RADIUS_BONUS,
        shield: this.shield, last: this.electricLastFire, tower: null,
      },
      ...this.supportTowers.filter((tower) => tower.health > 0).map((tower) => ({
        x: tower.x, y: tower.y + 10,
        radius: tower.shieldRadius + ELECTRIC_FENCE_RADIUS_BONUS,
        shield: tower.shield, last: tower.electricLastFire, tower,
      })),
    ];
    for (const dome of shields) {
      if (!canFireElectricFence(dome.last, this.time.now, dome.shield)) continue;
      // A cerca só atua próximo ao escudo, e não como uma torre de longa distância.
      // Cada cúpula atinge no máximo uma nave por pulso, para limitar saturação.
      let target = null;
      for (const enemy of this.enemies) {
        if (electricFieldReaches(
          dome.x, dome.y, dome.radius, enemy.sprite.x, enemy.sprite.y,
        ) && (!target || enemy.sprite.y > target.sprite.y)) target = enemy;
      }
      if (!target) continue;
      if (dome.tower) dome.tower.electricLastFire = this.time.now;
      else this.electricLastFire = this.time.now;
      this.fireElectricFence(dome.x, dome.y, dome.radius, target);
      target.electricSlowUntil = this.time.now + ELECTRIC_SLOW_DURATION;
      const index = this.enemies.findIndex((enemy) => enemy.uid === target.uid);
      if (index >= 0) {
        // Faíscas e flash bastam: não spammar números de 0,5 a cada pulso.
        this.impactInvader(index, ELECTRIC_FENCE_DAMAGE, 0, '#c1ffb7', false);
      }
    }
  }

  drawShield() {
    const graphics = this.shieldGraphics;
    graphics.clear();
    const dome = (x, y, radius, shield, max) => {
      if (shield <= 0) return;
      // A melhoria brasileira AUMENTA visualmente a cúpula e sua faixa
      // de detecção, sem alterar a resistência total (HP) do escudo.
      const drawRadius = radius + (this.combat.electricFence ? ELECTRIC_FENCE_RADIUS_BONUS : 0);
      const fraction = shield / max;
      const color = fraction > 0.6 ? 0x70e6ec : fraction > 0.3 ? 0xf4c15e : 0xf06c77;
      graphics.lineStyle(3, color, Math.max(0.35, fraction));
      graphics.beginPath();
      graphics.arc(x, y + 10, drawRadius, Math.PI, Math.PI * 2, false);
      graphics.strokePath();
      if (this.combat.electricFence) {
        // Verde de cerca elétrica + cacos de vidro acompanhando a borda.
        const cy = y + 10;
        graphics.lineStyle(1, 0xa4faad, Math.max(0.23, fraction * 0.70));
        graphics.beginPath();
        graphics.arc(x, cy, drawRadius + 2, Math.PI, Math.PI * 2, false);
        graphics.strokePath();
        graphics.fillStyle(0xa6f2bf, Math.max(0.3, fraction * 0.78));
        for (let i = 1; i <= 11; i += 1) {
          const angle = Math.PI + (i / 12) * Math.PI;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const gx = x + drawRadius * cos;
          const gy = cy + drawRadius * sin;
          graphics.fillTriangle(
            gx - sin * 3, gy + cos * 3,
            gx + sin * 3, gy - cos * 3,
            gx + cos * 7, gy + sin * 7,
          );
        }
      }
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

    if (this.mode === 'wave0' || this.mode === 'wave1' || this.mode === 'wave2') {
      this.scene.start('UpgradeScene', {
        campaign: this.campaign,
        completedWave: Number(this.mode.at(-1)),
      });
      return;
    }
    const automaticNext = automaticWaveAfterVictory(this.mode);
    if (automaticNext) {
      // Ondas 4–9 mantêm o conjunto de três aliados, sem upgrades fictícios.
      this.scene.start('GameScene', { mode: automaticNext, campaign: this.campaign });
      return;
    }
    this.statusText.setText('DEFESA BEM-SUCEDIDA');
    this.tutorialText.setText('');
    this.add.rectangle(W / 2, H / 2, W, H, 0x061022, 0.78)
      .setDepth(120).setInteractive();
    this.add.rectangle(W / 2, H / 2, 530, 332, 0x0b1c33, 0.98)
      .setStrokeStyle(2, 0x71e2b9).setDepth(121);
    this.add.text(W / 2, 166, this.mode === 'lab' ? 'TESTE CONCLUÍDO' : 'ONDA 9 CONCLUÍDA!', {
      fontFamily: 'monospace', fontSize: '32px',
      color: '#f4e3a3', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(122);
    this.add.text(W / 2, 218, this.mode === 'lab'
      ? 'Os cinco tipos já têm comportamento provisório.'
      : 'O Rio resistiu! Fortaleza-Mãe: Onda 10 em breve.',
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
        this.tutorialText.setText('Mira azul = explosão do especial • Botão direito: dispara');
      } else {
        this.tutorialText.setText('Proteja o canhão! Escudos regeneram sem dano.');
      }
    } else if (this.mode.startsWith('wave')) {
      const history = this.campaign.choices.map((id) => id.toUpperCase()).join(' + ');
      const special = this.combat.plasmaEvery ? ' | KATANA: ' +
        (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/3'
        : this.combat.fragmentation ? ' | FRAGMENTAÇÃO' : '';
      const towerLabel = this.supportTowers.map((tower) => tower.definition.label).join(' + ');
      const levelTwo = unlockedSecondUpgrades(this.campaign)
        .map((id) => id.toUpperCase()).join(' + ');
      this.tutorialText.setText(
        'ALIADOS: ' + (history || 'NENHUM') +
        (levelTwo ? ' | N2: ' + levelTwo : '') +
        (towerLabel ? ' | TORRE: ' + towerLabel : '') + special,
      );
    } else if (this.mode === 'upgradeLab') {
      this.tutorialText.setText('1–5: GERAR   SHIFT+1–5: NÍVEL 2   C: LIMPAR   U: UPGRADES');
      const names = this.upgradeIds.map((id) => getFirstUpgrade(id)?.flag).filter(Boolean);
      const secondNames = this.labSecondIds.map((id) => id.toUpperCase()).join('+');
      this.labUpgradeLabel.setText(
        'MELHORIAS: ' + (names.length ? names.join(' + ') : 'NENHUMA') +
        (secondNames ? '  |  NÍVEL 2: ' + secondNames : ''),
      );
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
    const pointer = this.input.activePointer;
    this.drawSpecialAim(pointer);
    if (this.tutorialComplete) {
      if (!this.gameOver) this.updateBlasts();
      return;
    }
    // Sem disparos, movimentação ou cronômetro de onda antes do "1".
    if (this.countdownActive) return;
    const dt = Math.min(delta / 1000, 0.05);
    this.elapsed += delta;
    this.aimAngle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.barrel.rotation = this.aimAngle + Math.PI / 2;
    if (pointer.leftButtonDown()) this.shootBasic(pointer);
    // Recuo puramente visual. A rotação continua ligada à mira, e o canhão
    // volta ao lugar sem alterar a origem física das balas.
    this.cannonRecoil *= Math.exp(-19 * dt);
    if (this.cannonRecoil < 0.10) this.cannonRecoil = 0;
    this.barrel.setPosition(
      CANNON.x - Math.cos(this.aimAngle) * this.cannonRecoil,
      CANNON.y - 20 - Math.sin(this.aimAngle) * this.cannonRecoil,
    );

    this.updateEnemies(dt);
    if (this.gameOver) return;
    this.updateEnemyBullets(dt);
    if (this.gameOver) return;
    this.updatePlayerProjectiles(dt);
    this.updateResidualSlashes();
    this.updateElectricFences();
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
