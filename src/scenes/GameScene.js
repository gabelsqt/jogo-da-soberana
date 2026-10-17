import Phaser from 'phaser';
import {
  normalizeLabConfig, configuredTowerCountries, configuredTowerLoadout,
  LAB_ENEMY_NAMES, LAB_MAX_ENEMY_LEVEL, labEnemyEvent,
} from '../gameplay/labConfig.js';
import { preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { assetUrl } from '../config/assetUrl.js';
import { preloadMechSprites, createMechSprites } from '../gameplay/mechSpriteMounts.js';
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
  advanceBomberHover,
} from '../gameplay/enemies.js';
import {
  hitProfileFor, hitReactionAt, deathProfileFor,
  MAX_SIMULTANEOUS_DEATH_EFFECTS,
} from '../gameplay/enemyFeedback.js';
import {
  getFirstUpgrade, combatStatsFor, shotAngles, shotVisualFor,
  shotVfxFor, brazilAlternatingAngle, combatStatsForLoadout, normalizeLabUpgrades, toggleLabUpgrade,
} from '../gameplay/upgrades.js';
import {
  MODES, getWaveEvents, waveOutcome, WAVE_COUNTDOWN_SECONDS, WAVE_DURATION_MS,
} from '../gameplay/waves.js';
import { unlockedFourthUpgradeCountries } from '../gameplay/fourthUpgrades.js';
import { addMenuButton } from '../ui/menuButton.js';
import {
  normalizeCampaignState, unlockedFirstUpgrades, unlockedSecondUpgrades,
  activeTowerCountries, activeTowerLoadout, unlockedThirdUpgradeCountries,
  automaticWaveAfterVictory,
} from '../gameplay/progression.js';
import {
  TOWER_DEFINITIONS, SUPPORT_TOWER_POSITIONS,
  towerDefinition, upgradedTowerWeapon, canInstallTower, chooseTowerAttackTarget,
  towerBlindZoneY, towerSeesEnemy, towerChargeProgress, chooseSuitableTowerTarget,
  chooseTowerTrackingTarget, advanceGuidedTowerShot, chooseTowerHomingTarget,
} from '../gameplay/towers.js';
import {
  SHOCK_BLAST_RADIUS, SHOCK_KNOCKBACK,
  segmentHitsCircle, shockBlastDamage, advanceShockOffset,
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
  COLLATERAL_VISUAL_DELAY_MS, fenceGlowAt, encoreRimGlowAt,
  isChinaCenterProjectile, strategicDistortionOpacity,
} from '../gameplay/secondUpgradeVisuals.js';
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
const TOWER_BLIND_ZONE_Y = towerBlindZoneY(H);
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
    this.unifiedLab = Boolean(data.labConfig);
    this.labConfig = this.unifiedLab ? normalizeLabConfig(data.labConfig) : null;
    // Compatibilidade com saves antigos que tinham apenas "upgradeId".
    const legacy = getFirstUpgrade(data.upgradeId) && this.mode === 'wave1'
      ? { choices: [data.upgradeId] } : {};
    this.campaign = normalizeCampaignState(data.campaign ?? legacy);
    this.upgradeId = this.campaign.choices.at(-1) ?? null;
    this.thirdIds = this.unifiedLab
      ? Object.keys(this.labConfig.levels).filter(id => this.labConfig.levels[id] >= 3)
      : this.mode === 'upgradeLab' ? [] : unlockedThirdUpgradeCountries(this.campaign);
    this.fourthIds = this.unifiedLab
      ? Object.keys(this.labConfig.levels).filter(id => this.labConfig.levels[id] >= 4)
      : this.mode === 'upgradeLab' ? [] : unlockedFourthUpgradeCountries(this.campaign);
    this.upgradeIds = this.mode === 'upgradeLab'
      ? normalizeLabUpgrades(data.upgradeIds) : [];
    this.labSecondIds = this.mode === 'upgradeLab'
      ? normalizeSecondUpgradeIds(data.labSecondIds)
        .filter((id) => this.upgradeIds.includes(id)) : [];
    this.labTowerIds = this.mode === 'upgradeLab'
      ? [...new Set(Array.isArray(data.labTowerIds) ? data.labTowerIds : [])]
        .filter((id) => towerDefinition(id)).slice(0, 2)
      : [];
    const firstUpgrades = this.unifiedLab
      ? Object.keys(this.labConfig.levels).filter(id => this.labConfig.levels[id] >= 1)
      : unlockedFirstUpgrades(this.campaign);
    const firstStats = this.mode === 'upgradeLab'
      ? combatStatsForLoadout(this.upgradeIds)
      : combatStatsForLoadout(firstUpgrades);
    const seconds = this.unifiedLab
      ? Object.keys(this.labConfig.levels).filter(id => this.labConfig.levels[id] >= 2)
      : this.mode === 'upgradeLab' ? this.labSecondIds : unlockedSecondUpgrades(this.campaign);
    this.combat = applySecondUpgradeStats(firstStats, seconds);
    // Primeira evolução conjunta: fortalecimento de escudo e recarga do especial.
    // Valores provisórios para o playtest da árvore reorganizada.
    const jointStages = this.thirdIds.length + this.fourthIds.length;
    this.combat.specialCooldown = Math.round(this.combat.specialCooldown * Math.pow(0.93, jointStages));
  }

  getRunOptions() {
    if (this.unifiedLab) return { mode: this.mode, labConfig: this.labConfig };
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
    if (!this.unifiedLab && this.mode !== 'upgradeLab' && this.mode !== 'lab') return;
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
    // Limpa os VFX de mortes sem afetar o combate nem o treinamento.
    for (const effect of this.deathEffects) effect.destroy();
    this.deathEffects.length = 0;
  }

  preload() {
    preloadRioBackdrop(this);
    preloadMechSprites(this);
    this.load.setPath('');
    for (let frame = 1; frame <= 4; frame += 1) {
      const name = 'frame_' + String(frame).padStart(2, '0') + '.png';
      this.load.image('tipo1_' + frame, assetUrl('assets/inimigos/tipo1/' + name));
    }
  }

  create() {
    this.input.mouse?.disableContextMenu();

    drawRioBackdrop(this);
    // Iluminação de amanhecer nos últimos 5 segundos das noites.
    // Camada atrás dos alvos/defesas e acima do cenário.
    this.sunriseOverlay = this.mode.startsWith('wave')
      ? this.add.rectangle(W / 2, H / 2, W, H, 0xffc285, 0).setDepth(18)
      : null;

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
    this.deathEffects = [];
    this.lastVictoryShake = -Infinity;
    this.electricLastFire = -Infinity;
    this.nextEnemyId = 1;
    this.nextBlastId = 1;
    this.elapsed = 0;
    this.countdownActive = false;
    this.labEnemyLevel = 1;
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
    this.shieldMax = 80 + (this.thirdIds.length + this.fourthIds.length) * 8;
    this.shield = this.shieldMax;
    this.lastDamageAt = -10000;
    this.aimAngle = -Math.PI / 2;

    this.createTurret();
    this.shieldGraphics = this.add.graphics().setDepth(23);
    this.enemyHealthGraphics = this.add.graphics().setDepth(27);
    this.towerStatusGraphics = this.add.graphics().setDepth(35);
    this.towerChargeGraphics = this.add.graphics().setDepth(36);
    this.createSupportTowers();
    this.createHud();
    if (this.unifiedLab) this.createEnemyLabPanel();
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

    if (this.unifiedLab && this.mode === 'lab') {
      // Arena livre: nenhum spawn agendado e nenhuma duração limite.
      this.waveEvents = [];
    } else if (this.mode.startsWith('wave')) {
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
    if (this.unifiedLab || this.mode === 'upgradeLab' || this.mode === 'lab') {
      this.input.keyboard.on('keydown', (event) => {
        if (!this.scene.isActive('GameScene') || this.tutorialComplete) return;
        // Teclas físicas 1–5, inclusive Shift+1–5 no layout brasileiro.
        const match = /^(?:Digit|Numpad)([1-5])$/.exec(event.code || '');
        if (!match) return;
        this.spawnLabEnemy(Number(match[1]), event.shiftKey ? 2 : this.labEnemyLevel);
      });
      this.input.keyboard.on('keydown-C', () => {
        if (this.scene.isActive('GameScene')) this.clearTestEnemies();
      });
    }
    if (this.unifiedLab) {
      this.input.keyboard.on('keydown-I', () => {
        if (this.scene.isActive('GameScene')) {
          this.setEnemyLabPanelOpen(!this.enemyLabPanelOpen);
        }
      });
      this.input.keyboard.on('keydown-L', () => {
        if (this.scene.isActive('GameScene')) {
          this.scene.start('LabSetupScene', { config: this.labConfig });
        }
      });
    }
  }

  spawnLabEnemy(type, level = 1) {
    if (this.tutorialComplete || this.countdownActive) return false;
    const event = labEnemyEvent(type, level);
    if (!event) return false;
    this.spawnWaveEvent(event);
    return true;
  }

  // Painel retrátil no campo do laboratório, sem bloquear a mira quando
  // fechado. Funciona tanto na Arena Livre quanto no teste de uma onda.
  createEnemyLabPanel() {
    this.enemyLabPanelOpen = this.mode === 'lab';
    const toggleBg = this.add.rectangle(825, 69, 260, 33, 0x173d50, 0.98)
      .setStrokeStyle(2, 0x87ddeb).setDepth(108)
      .setInteractive({ useHandCursor: true });
    this.enemyLabToggle = this.add.text(825, 69, '', {
      fontFamily: 'monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#f3f9ff',
    }).setOrigin(0.5).setDepth(109);
    toggleBg.on('pointerover', () => toggleBg.setFillStyle(0x286476));
    toggleBg.on('pointerout', () => toggleBg.setFillStyle(0x173d50));
    toggleBg.on('pointerdown', (pointer, _x, _y, event) => {
      event?.stopPropagation();
      if (pointer.leftButtonDown()) this.setEnemyLabPanelOpen(!this.enemyLabPanelOpen);
    });

    const panel = this.add.container(0, 0).setDepth(108);
    this.enemyLabPanel = panel;
    this.enemyLabInputs = [];
    const background = this.add.rectangle(825, 284, 268, 388, 0x071527, 0.96)
      .setStrokeStyle(2, 0x63a8bc);
    background.setInteractive().on('pointerdown', (_pointer, _x, _y, event) => {
      event?.stopPropagation();
    });
    panel.add(background);
    // Ao recolher o painel, nem o fundo invisível intercepta a mira.
    this.enemyLabInputs.push(background);
    panel.add(this.add.text(825, 112, 'GERAR INIMIGOS • TIPO 1–5', {
      fontFamily: 'monospace', fontSize: '13px', fontStyle: 'bold', color: '#9ef0db',
    }).setOrigin(0.5));

    const addButton = (x, y, width, height, label, onClick, primary = false) => {
      const baseColor = primary ? 0x205661 : 0x142a3f;
      const hoverColor = primary ? 0x307985 : 0x23506c;
      const button = this.add.rectangle(x, y, width, height, baseColor, 0.98)
        .setStrokeStyle(1.5, primary ? 0x8de8cf : 0x759db9)
        .setInteractive({ useHandCursor: true });
      const text = this.add.text(x, y, label, {
        fontFamily: 'monospace', fontSize: '13px',
        color: '#f2faff', fontStyle: 'bold',
      }).setOrigin(0.5);
      button.on('pointerover', () => button.setFillStyle(hoverColor));
      button.on('pointerout', () => button.setFillStyle(baseColor));
      button.on('pointerdown', (pointer, _lx, _ly, event) => {
        event?.stopPropagation();
        if (pointer.leftButtonDown()) onClick();
      });
      panel.add([button, text]);
      this.enemyLabInputs.push(button);
      return { button, text };
    };

    LAB_ENEMY_NAMES.forEach((name, index) => {
      addButton(825, 152 + index * 41, 232, 34,
        (index + 1) + '  ' + name,
        () => this.spawnLabEnemy(index + 1, this.labEnemyLevel));
    });
    panel.add(this.add.text(825, 366, 'NÍVEL DOS INIMIGOS', {
      fontFamily: 'monospace', fontSize: '12px', color: '#a8bed8',
    }).setOrigin(0.5));
    addButton(745, 389, 42, 29, '−', () => this.setLabEnemyLevel(this.labEnemyLevel - 1));
    this.enemyLabLevelLabel = this.add.text(825, 389, '', {
      fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold',
      color: '#f9e6ae',
    }).setOrigin(0.5);
    panel.add(this.enemyLabLevelLabel);
    addButton(905, 389, 42, 29, '+', () => this.setLabEnemyLevel(this.labEnemyLevel + 1));
    addButton(825, 425, 232, 31, 'C  LIMPAR INIMIGOS', () => this.clearTestEnemies());
    addButton(825, 462, 232, 28, 'L  CONFIGURAR LAB', () =>
      this.scene.start('LabSetupScene', { config: this.labConfig }));
    this.setLabEnemyLevel(1);
    this.setEnemyLabPanelOpen(this.enemyLabPanelOpen);
  }

  setLabEnemyLevel(level) {
    this.labEnemyLevel = Math.max(1, Math.min(
      LAB_MAX_ENEMY_LEVEL, Math.trunc(Number(level) || 1),
    ));
    this.enemyLabLevelLabel?.setText('NÍVEL ' + this.labEnemyLevel);
  }

  setEnemyLabPanelOpen(open) {
    this.enemyLabPanelOpen = Boolean(open);
    this.enemyLabPanel.setVisible(this.enemyLabPanelOpen);
    for (const button of this.enemyLabInputs) {
      if (this.enemyLabPanelOpen) button.setInteractive({ useHandCursor: true });
      else button.disableInteractive();
    }
    this.enemyLabToggle.setText(this.enemyLabPanelOpen
      ? 'INIMIGOS [I] ▲' : 'INIMIGOS [I] ▼');
  }

  pointerOverEnemyLabControls(pointer) {
    return this.unifiedLab && pointer.x >= 691 && pointer.x <= 960 &&
      pointer.y >= 52 && pointer.y <= (this.enemyLabPanelOpen ? 488 : 87);
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
      // A carga só começa quando a defesa fica liberada para lutar.
      for (const tower of this.supportTowers) tower.lastAttackAt = this.time.now;
      this.scheduleWaveEvents();
    });
  }

  createSupportTowers() {
    const selected = this.unifiedLab ? configuredTowerLoadout(this.labConfig)
      : this.mode === 'upgradeLab' ? this.labTowerIds.map(id => ({ id, role: 'swarm', level: 5 })) : activeTowerLoadout(this.campaign);
    this.installSupportTowerSet(selected);
  }

  installSupportTowerSet(countryIds) {
    for (const tower of this.supportTowers) tower.visual.destroy();
    for (const bullet of this.supportProjectiles) bullet.sprite.destroy();
    this.supportProjectiles.length = 0;
    this.supportTowers.length = 0;
    this.towerChargeGraphics?.clear();

    countryIds.slice(0, SUPPORT_TOWER_POSITIONS.length).forEach((entry, index) => {
      const id = typeof entry === 'string' ? entry : entry.id;
      const role = typeof entry === 'string' ? 'swarm' : entry.role;
      const level = typeof entry === 'string' ? 5 : entry.level;
      const definition = upgradedTowerWeapon(id, role, level);
      if (!definition) return;
      const position = SUPPORT_TOWER_POSITIONS[index];
      const { x, y } = position;

      // Corpo correto para cada papel: lobo/antienxame e animais destruidoras,
      // com arma modular giratória independente do sprite do corpo.
      const visual = createMechSprites(this, id, x, y, 26, position.side === 'right', role);
      const sprite = visual.sprite;

      this.supportTowers.push({
        id: 'tower-' + id + '-' + role, countryId: id, role, level,
        definition, x, y, shieldRadius: 46,
        sprite, visual,
        health: definition.healthMax,
        healthMax: definition.healthMax,
        shield: definition.shieldMax,
        shieldMax: definition.shieldMax,
        lastDamageAt: -10000,
        lastAttackAt: this.time.now,
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
      // A arma acompanha QUALQUER inimigo ao alcance, mas a carga
      // só é gasta se ele atender à prioridade da classe.
      // Ambos respeitam a zona cega de 10% e as bordas do cenário.
      const firingTarget = chooseSuitableTowerTarget(
        tower, this.enemies, TOWER_BLIND_ZONE_Y, 390, W, H,
      );
      const trackingTarget = firingTarget ?? chooseTowerTrackingTarget(
        tower, this.enemies, TOWER_BLIND_ZONE_Y, W, H,
      );
      const aimed = trackingTarget
        ? tower.visual.aimAt(trackingTarget.sprite.x, trackingTarget.sprite.y, dt)
        : false;
      // Sem alvo adequado, conserva carga completa mesmo enquanto gira.
      // Ao disparar, exige que a arma visual esteja alinhada com esse alvo.
      if (!firingTarget || !aimed || towerChargeProgress(
        tower.lastAttackAt, this.time.now, tower.definition.interval,
      ) < 1) continue;
      tower.lastAttackAt = this.time.now;
      this.fireTowerWeapon(tower, firingTarget);
    }
    this.drawTowerCharges();
  }

  drawTowerCharges() {
    const graphics = this.towerChargeGraphics;
    graphics.clear();
    for (const tower of this.supportTowers) {
      if (tower.health <= 0) continue;
      const progress = towerChargeProgress(
        tower.lastAttackAt, this.time.now, tower.definition.interval,
      );
      const ready = progress >= 1;
      const evolved = tower.role === 'swarm' ? tower.level >= 6 : tower.level >= 8;
      // O corpo e o canhão clareiam durante a carga, mantendo o sprite original.
      const brightness = Math.round(105 + 150 * progress);
      const tint = Phaser.Display.Color.GetColor(brightness, brightness, brightness);
      tower.visual.body.setTint(tint);
      tower.visual.weapon.setTint(tint);
      const glow = ready ? 0.78 + Math.sin(this.time.now * 0.012) * 0.18 : 0.20 + progress * 0.38;
      const x = tower.x, y = tower.y - 89, color = tower.definition.color;
      graphics.fillStyle(color, glow * 0.14);
      graphics.fillCircle(x, y, 16 + progress * 9);
      graphics.lineStyle(3, 0x23374a, 0.75);
      graphics.strokeCircle(x, y, 21);
      if (progress > 0) {
        graphics.lineStyle(3.5, ready ? 0xffffff : color, glow);
        graphics.beginPath();
        graphics.arc(x, y, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        graphics.strokePath();
      }
      if (evolved) {
        // Evolução visível: segundo circuito luminoso, distinto do aumento numérico.
        graphics.lineStyle(2, color, 0.25 + 0.55 * progress);
        graphics.strokeCircle(x, y, 27);
        if (ready) {
          graphics.fillStyle(0xffffff, glow * 0.85);
          graphics.fillCircle(x + Math.cos(this.time.now * 0.006) * 27,
            y + Math.sin(this.time.now * 0.006) * 27, 2.8);
        }
      }
      graphics.fillStyle(ready ? 0xffffff : color, ready ? glow : glow * 0.65);
      graphics.fillCircle(x, y, ready ? 5.5 : 2.5 + 2.5 * progress);
    }
  }

  fireShockArtillery(tower, enemy) {
    const weapon = tower.definition;
    const fromX = tower.x;
    const fromY = tower.y - 35;

    const shell = this.add.circle(fromX, fromY, 9, 0xff9b49)
      .setStrokeStyle(3, 0xffe6a7).setDepth(42);
    const muzzle = this.add.circle(fromX, fromY, 20, 0xffbe71, 0.7).setDepth(44);
    this.tweens.add({
      targets: muzzle, scale: 2, alpha: 0, duration: 150,
      onComplete: () => muzzle.destroy(),
    });

    // Diferente da antiga artilharia preditiva, o Urso acompanha a nave
    // durante todo o trajeto e não detona em uma coordenada vazia.
    this.supportProjectiles.push({
      kind: 'shock-shell',
      sprite: shell,
      weapon,
      targetId: enemy.uid,
      role: tower.role,
      speed: weapon.speed,
      vx: 0, vy: 0,
      age: 0, smokeTimer: 0,
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
      if (!towerSeesEnemy(enemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
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

  // A transferência de alvo é compartilhada por balas, drones,
  // mísseis e projéteis pesados: nenhum prossegue rumo ao vazio.
  acquireGuidedTowerTarget(shot) {
    const original = this.enemies.find(enemy =>
      enemy.uid === shot.targetId &&
      towerSeesEnemy(enemy, TOWER_BLIND_ZONE_Y, W, H));
    if (original) return original;
    const next = chooseTowerHomingTarget(
      shot.sprite.x, shot.sprite.y, this.enemies,
      TOWER_BLIND_ZONE_Y, W, shot.role, H,
    );
    if (next) shot.targetId = next.uid;
    return next;
  }

  updateShockShell(shot, dt) {
    const target = this.acquireGuidedTowerTarget(shot);
    // Se não restar nenhuma nave detectável, a munição desaparece
    // silenciosamente — não explode no canto ou na zona morta.
    if (!target || shot.age > 5) return true;

    const oldX = shot.sprite.x, oldY = shot.sprite.y;
    const next = advanceGuidedTowerShot(oldX, oldY,
      target.sprite.x, target.sprite.y, shot.speed, dt);
    shot.sprite.setPosition(next.x, next.y);
    shot.vx = next.vx;
    shot.vy = next.vy;

    shot.smokeTimer += dt;
    if (shot.smokeTimer >= 0.065) {
      shot.smokeTimer = 0;
      this.makeShockSmoke(next.x, next.y);
    }

    // A bomba só explode se interceptar uma nave real, nunca ao
    // atingir um ponto de previsão ou quando esgota seu tempo.
    for (const enemy of this.enemies) {
      if (!towerSeesEnemy(enemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
      if (segmentHitsCircle(oldX, oldY, next.x, next.y,
        enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type) + 9)) {
        this.detonateShockArtillery(enemy.sprite.x, enemy.sprite.y, shot.weapon);
        return true;
      }
    }
    return false;
  }

  fireTowerWeapon(tower, enemy) {
    const weapon = tower.definition;
    const fromX = tower.x;
    const fromY = tower.y - 35;

    // Descarga visível da energia acumulada, sem screenshake ao atirar.
    const discharge = this.add.circle(fromX, fromY, tower.role === 'destroyer' ? 19 : 13,
      weapon.color, 0.78).setStrokeStyle(2, 0xffffff, 0.85).setDepth(40);
    this.tweens.add({
      targets: discharge, scale: tower.role === 'destroyer' ? 2.6 : 2,
      alpha: 0, duration: tower.role === 'destroyer' ? 280 : 190,
      onComplete: () => discharge.destroy(),
    });
    // Recuo visual aplicado apenas ao canhão lateral, jamais ao corpo.
    tower.visual.recoil();
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
      const hits = weapon.pierce ? this.enemies.filter(e => {
        if (!towerSeesEnemy(e, TOWER_BLIND_ZONE_Y, W, H)) return false;
        const ax = fromX, ay = fromY, bx = enemy.sprite.x, by = enemy.sprite.y;
        const dx = bx-ax, dy = by-ay, len = Math.max(1, dx*dx+dy*dy);
        const t = Phaser.Math.Clamp(((e.sprite.x-ax)*dx+(e.sprite.y-ay)*dy)/len, 0, 1);
        return Math.hypot(e.sprite.x-(ax+t*dx),e.sprite.y-(ay+t*dy)) < 24;
      }) : [enemy];
      for (const hitEnemy of hits) {
        if (!towerSeesEnemy(hitEnemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
        const index = this.enemies.findIndex(item => item.uid === hitEnemy.uid);
        if (index >= 0) this.impactInvader(index, weapon.damage, 0, '#e6b1ff');
      }
      return;
    }

    const count = weapon.count ?? 1;
    const swarmTargets = tower.role === 'swarm'
      ? this.enemies.filter(e => towerSeesEnemy(e, TOWER_BLIND_ZONE_Y, W, H) &&
        Math.hypot(e.sprite.x - fromX, e.sprite.y - fromY) <= weapon.range)
        .sort((a,b) => b.sprite.y - a.sprite.y) : [];
    for (let i = 0; i < count; i += 1) {
      const shotTarget = swarmTargets[i % swarmTargets.length] ?? enemy;
      const x = fromX + (i - (count - 1) / 2) * 18;
      const y = fromY;
      const dx = shotTarget.sprite.x - x;
      const dy = shotTarget.sprite.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      // Todos os projéteis das torres têm guia ativo, inclusive balas comuns.
      const guided = true;
      const bullet = weapon.type === 'shell'
        ? this.add.rectangle(x, y, 12, 14, weapon.color).setStrokeStyle(2, 0xffffff)
        : this.add.circle(x, y, weapon.type === 'bullet' ? 4 : 6, weapon.color)
          .setStrokeStyle(1, 0xffffff, 0.85);
      bullet.setDepth(40);
      this.supportProjectiles.push({
        sprite: bullet,
        targetId: shotTarget.uid, role: tower.role,
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

      // A orientação de TODOS os tiros é recalculada a cada quadro.
      // Se o alvo morrer ou sair do radar, outro é adquirido. Sem
      // alvo na tela, a bala some sem voar rumo ao canto.
      const target = this.acquireGuidedTowerTarget(shot);
      if (!target || shot.age > 5) {
        shot.sprite.destroy();
        this.supportProjectiles.splice(i, 1);
        continue;
      }
      const oldX = shot.sprite.x, oldY = shot.sprite.y;
      const next = advanceGuidedTowerShot(
        oldX, oldY, target.sprite.x, target.sprite.y, shot.speed, dt,
      );
      shot.sprite.setPosition(next.x, next.y);
      shot.vx = next.vx;
      shot.vy = next.vy;

      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
        const enemy = this.enemies[j];
        if (!towerSeesEnemy(enemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
        if (!segmentHitsCircle(oldX, oldY, next.x, next.y,
          enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type) + 7)) continue;

        this.impactInvader(
          j, shot.weapon.damage, shot.weapon.knockback ?? 0, '#fff3b9',
        );
        const flash = this.add.circle(
          next.x, next.y, 12, shot.weapon.color, 0.45,
        ).setDepth(44);
        this.tweens.add({
          targets: flash, alpha: 0, scale: 1.8, duration: 180,
          onComplete: () => flash.destroy(),
        });
        if (shot.weapon.splashRadius) {
          const radius = shot.weapon.splashRadius;
          const nearby = this.enemies.filter(e =>
            towerSeesEnemy(e, TOWER_BLIND_ZONE_Y, W, H) &&
            Math.hypot(e.sprite.x - next.x, e.sprite.y - next.y) <= radius);
          for (const extra of nearby) {
            const idx = this.enemies.findIndex(e => e.uid === extra.uid);
            if (idx >= 0) this.impactInvader(idx, shot.weapon.damage * 0.75, 0, '#a6d5ff');
          }
        }
        hit = true;
        break;
      }
      if (hit) {
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
      baseScaleX: visual.sprite.scaleX,
      baseScaleY: visual.sprite.scaleY,
      hp: definition.hp,
      maxHp: definition.hp,
      speed: definition.speed,
      recoilSpeed: 0,
      electricSlowUntil: -1,
      velocityX: 0,
      velocityY: 0,
      shockOffset: { x: 0, y: 0, vx: 0, vy: 0 },
      // Reação visual não acrescenta recuo físico nem altera o percurso.
      lastHitAt: -Infinity,
      hitVisualOffsetX: 0,
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
      // Bombardeiro escolhe uma defesa na entrada; as formações com escolta
      // preservam a sua coluna e os demais voam até a coluna da defesa.
      const hoverX = options.pattern === 'escort' || options.pattern === 'bomberFan'
        ? options.center : Phaser.Math.Clamp(enemy.target.x, 235, 725);
      this.setRoute(enemy, hoverX, Phaser.Math.Between(170, 220));
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
      // Remove o deslocamento do frame anterior ANTES de calcular a rota.
      // Hit shake e artilharia de choque permanecem efeitos independentes.
      enemy.sprite.x -= previousShock.x + enemy.hitVisualOffsetX;
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
        // Tipo 3: ataca a MESMA defesa durante doze segundos.
        // Quatro salvas aos 3, 6, 9 e 12 s antes de se retirar pelo topo.
        enemy.sprite.x += Math.sin(enemy.age * 1.2) * 15 * dt;
        const hover = advanceBomberHover(
          enemy.shotTimer, enemy.phaseAge, dt,
          enemy.definition.shotInterval, enemy.definition.bomberHoverDuration,
        );
        enemy.shotTimer = hover.shotTimer;
        for (let salvo = 0; salvo < hover.shots; salvo += 1) {
          this.fireEnemyProjectile(enemy, enemy.target);
        }
        if (hover.retreat) {
          enemy.phase = 'retreat';
          enemy.phaseAge = 0;
          this.setRoute(enemy, enemy.sprite.x, -78);
        }
      } else if (enemy.phase === 'retreat') {
        // Sai pela parte de cima e retorna à mesma noite para outra passada.
        if (this.moveAlongRoute(enemy, dt)) {
          enemy.target = this.chooseDefenseTarget();
          enemy.phase = 'approach';
          enemy.phaseAge = 0;
          this.setRoute(enemy,
            Phaser.Math.Clamp(enemy.target.x, 235, 725),
            Phaser.Math.Between(170, 220));
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
      this.updateEnemyHitVisual(enemy);

      // Bombas de pulso são barreiras: inimigos entram nelas durante o movimento.
      this.hitEnemyWithBlast(i);
    }
  }

  fireEnemyProjectile(enemy, target = this.chooseDefenseTarget()) {
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

  updateEnemyHitVisual(enemy) {
    const age = this.time.now - enemy.lastHitAt;
    const reaction = hitReactionAt(enemy.type, age);
    enemy.hitVisualOffsetX = reaction.dx;
    // O cálculo de rota/velocidade acima permanece inalterado; o deslocamento
    // é adicionado após o movimento e subtraído no frame seguinte.
    enemy.sprite.x += reaction.dx;
    enemy.sprite.setRotation(reaction.rotation);
    // Preserva o tamanho inicial do PNG Tipo 1 (setDisplaySize(62, 72)).
    // Os outros tipos são Containers com escala-base 1.
    enemy.sprite.setScale(enemy.baseScaleX * reaction.scale,
      enemy.baseScaleY * reaction.scale);

    if (enemy.box) {
      enemy.box.setFillStyle(reaction.flash ? 0xffffff : enemy.definition.color);
    } else if (reaction.flash) {
      // O modo fill torna o PIXEL ART inteiramente branco por poucos frames.
      enemy.sprite.setTintFill(0xffffff);
    } else if (enemy.level > 1) {
      enemy.sprite.setTint(enemy.definition.tintColor);
    } else {
      enemy.sprite.clearTint();
    }
  }

  showEnemyDeath(enemy) {
    // Executado APENAS quando HP chega a zero, nunca em colisão com a base,
    // fim de laser Tipo 4 nem quando o laboratório limpa os alvos.
    const { x, y } = enemy.sprite;
    const profile = deathProfileFor(enemy.type);
    const createBurst = (stage = 0) => {
      if (!this.scene.isActive('GameScene')) return;
      const radius = profile.radius * (stage > 0 ? 0.70 : 1);
      const color = stage > 0
        ? (enemy.type === 4 ? 0xffd49c : 0xfff0bf)
        : profile.color;
      const graphic = this.add.graphics().setPosition(
        x + (stage > 0 ? 9 : 0), y + (stage > 0 ? -6 : 0),
      ).setDepth(54);
      const fragments = Math.min(30, profile.fragments);
      // Primeiro clarão branco, seguido de anel de energia e fragmentos.
      graphic.fillStyle(color, stage > 0 ? 0.2 : 0.23);
      graphic.fillCircle(0, 0, radius * 0.55);
      graphic.fillStyle(0xffffff, stage > 0 ? 0.84 : 0.96);
      graphic.fillCircle(0, 0, Math.max(5, radius * 0.21));
      graphic.lineStyle(enemy.type >= 4 ? 4 : 2.5, color, 0.93);
      graphic.strokeCircle(0, 0, radius * 0.58);
      if (profile.ring) {
        graphic.lineStyle(enemy.type >= 4 ? 3 : 2, 0xffffff, 0.78);
        graphic.strokeCircle(0, 0, radius * 0.84);
      }
      for (let i = 0; i < fragments; i += 1) {
        const angle = i * Math.PI * 2 / fragments + stage * 0.43;
        const inner = radius * (0.52 + (i % 3) * 0.075);
        const outer = radius * (0.90 + (i % 4) * 0.085);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        graphic.lineStyle(enemy.type >= 4 ? 3 : 2,
          i % 3 === 0 ? 0xffffff : color, i % 3 === 0 ? 1 : 0.90);
        graphic.lineBetween(dx * inner, dy * inner, dx * outer, dy * outer);
      }
      if (enemy.type >= 4 && stage === 0) {
        // Uma cicatriz luminosa curta recompensa especialmente o caça veloz.
        graphic.lineStyle(3.5, 0xe9ffff, 0.84);
        graphic.lineBetween(-radius * 1.2, -radius * 0.16,
          radius * 1.2, radius * 0.16);
      }
      if (this.deathEffects.length >= MAX_SIMULTANEOUS_DEATH_EFFECTS) {
        const oldest = this.deathEffects.shift();
        oldest?.destroy();
      }
      this.deathEffects.push(graphic);
      this.tweens.add({
        targets: graphic,
        alpha: 0, scale: enemy.type >= 4 ? 1.55 : 1.34,
        duration: Math.round(profile.duration * (stage > 0 ? 0.60 : 1)),
        ease: 'Cubic.easeOut',
        onComplete: () => {
          const position = this.deathEffects.indexOf(graphic);
          if (position >= 0) this.deathEffects.splice(position, 1);
          graphic.destroy();
        },
      });
    };
    createBurst(0);
    if (profile.stages >= 2) {
      this.time.delayedCall(enemy.type === 4 ? 95 : 150, () => createBurst(1));
    }
    // Reservado ao futuro chefe Tipo 6, ainda fora das ondas atuais.
    if (profile.stages >= 3) {
      this.time.delayedCall(300, () => createBurst(2));
    }
    // Recompensa no Tipo 4/5 sem tremor intenso em kills simultâneos.
    if (enemy.type >= 4 && this.time.now - this.lastVictoryShake >= 220) {
      this.cameras.main.shake(enemy.type === 4 ? 75 : 130,
        enemy.type === 4 ? 0.0012 : 0.0019);
      this.lastVictoryShake = this.time.now;
    }
  }

  impactInvader(index, damage = 1, knockback = 0, hitColor = '#ffe09f',
    showNumber = true, maxRecoil = 400) {
    const enemy = this.enemies[index];
    if (!enemy) return false;
    if (showNumber) this.popHitNumber(enemy.sprite.x, enemy.sprite.y, damage, hitColor);
    enemy.hp -= damage;
    const killed = enemy.hp <= 0;
    if (killed) {
      this.showEnemyDeath(enemy);
      this.removeEnemy(index);
    } else {
      enemy.lastHitAt = this.time.now;
      if (enemy.box) enemy.box.setFillStyle(0xffffff);
      else enemy.sprite.setTintFill(0xffffff);
      if (enemy.phase === 'dive' && knockback > 0) {
        enemy.recoilSpeed = applyRecoilImpulse(enemy.recoilSpeed, knockback, maxRecoil);
      }
    }
    return killed;
  }

  activeUpgradeIds() {
    if (this.unifiedLab) return Object.keys(this.labConfig.levels).filter(id => this.labConfig.levels[id] >= 1);
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
      // O canhão principal russo mantém o clarão e o recuo visual,
      // mas não sacode a câmera ao disparar.
    }

    if (effects.multiple) {
      // China I tem flash duplo. China II passa a ter três clarões,
      // com o central mais brilhante, sem criar disparos adicionais.
      const volleySize = this.combat.bulletsPerShot;
      const muzzlePositions = volleySize >= 3 ? [-1, 0, 1] : [-1, 1];
      const px = -Math.sin(angle) * 8;
      const py = Math.cos(angle) * 8;
      for (const sign of muzzlePositions) {
        const center = sign === 0;
        const glow = this.add.circle(
          x + px * sign, y + py * sign, center ? 7 : 5.5,
          center ? 0xfff7d6 : sign < 0 ? 0xffb34f : 0xff6757,
          center ? 1 : 0.92,
        ).setDepth(39);
        this.tweens.add({
          targets: glow, scale: center ? 2.4 : 2.15,
          alpha: 0, duration: center ? 155 : 120,
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
    const volleyAngles = shotAngles(aimed, this.combat.bulletsPerShot);
    volleyAngles.forEach((firingAngle, index) => {
      const centerGlow = isChinaCenterProjectile(
        index, volleyAngles.length, effects.multiple,
      );
      this.createProjectile(firingAngle, false, 0, effects, centerGlow);
    });
    this.basicShotCount = nextShot;
    // O laser coreano mantém a direção da mira original (a oscilação da
    // Gambiarra altera apenas as balas básicas, não a arma laser).
    if (isPlasmaShot(this.basicShotCount, this.combat.plasmaEvery > 0)) {
      this.fireLightstickBeam(angle);
    }
    this.showMuzzleFlash(aimed, effects);
  }

  fireLightstickBeam(angle) {
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

    // Três traços luminosos sobrepostos criam um feixe de plasma bem visível.
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
    // O Lightstick roxo abre uma FENDA turquesa com centro escuro. A fenda
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
    // Encore! (nível 2) acentua suavemente as bordas, sem alargar
    // a área física da fenda nem alterar o tempo de dano residual.
    const edgePulse = encoreRimGlowAt(age);
    graphics.lineStyle(width * 2 + 18, 0x18d7d8, 0.12 + edgePulse * 0.06);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);
    graphics.lineStyle(width * 2 + 7, 0x298cbd, 0.33);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);
    graphics.lineStyle(Math.max(2, width * 2), 0x020a19, 0.95);
    graphics.lineBetween(slash.x1, slash.y1, slash.x2, slash.y2);

    for (const direction of [-1, 1]) {
      const edgeX = nx * width * direction;
      const edgeY = ny * width * direction;
      graphics.lineStyle(2.4 + edgePulse * 0.55, 0x8bfff2,
        Math.min(1, 0.65 + edgePulse * 0.33));
      graphics.lineBetween(
        slash.x1 + edgeX, slash.y1 + edgeY,
        slash.x2 + edgeX, slash.y2 + edgeY,
      );
    }

    // Pequenos reflexos nas extremidades tornam o pulso perceptível
    // mesmo quando não há naves atravessando a fenda.
    for (const t of [0.2, 0.8]) {
      const mx = slash.x1 + dx * t;
      const my = slash.y1 + dy * t;
      graphics.lineStyle(1.3, 0xecfffb, Math.max(0.25, edgePulse * 0.63));
      graphics.lineBetween(mx - nx * (width + 4), my - ny * (width + 4),
        mx - nx * (width - 1), my - ny * (width - 1));
      graphics.lineBetween(mx + nx * (width - 1), my + ny * (width - 1),
        mx + nx * (width + 4), my + ny * (width + 4));
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
    // IMPORTANTE: o dano continua imediato, com a mesma área e sem
    // explosões recursivas. O atraso abaixo é SOMENTE para o visual.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (fragmentHitsTarget(
        x, y, enemy.sprite.x, enemy.sprite.y,
        enemyContactRadius(enemy.type), COLLATERAL_RADIUS,
      )) this.impactInvader(i, COLLATERAL_DAMAGE, 0, '#ffd59b', false);
    }
    this.time.delayedCall(COLLATERAL_VISUAL_DELAY_MS, () => {
      // Primeira detonação azul (nível 1) seguida de segunda onda laranja.
      const ring = this.add.circle(x, y, COLLATERAL_RADIUS, 0xffa052, 0.24)
        .setStrokeStyle(3.5, 0xffedac, 0.96).setScale(0.12).setDepth(46);
      const flash = this.add.circle(x, y, 12, 0xffe3b0, 0.86).setDepth(47);
      const sparks = this.add.graphics().setPosition(x, y).setDepth(47);
      for (let i = 0; i < 8; i += 1) {
        const angle = (i * Math.PI * 2) / 8;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        sparks.lineStyle(2, i % 2 === 0 ? 0xffedb4 : 0xff934c, 0.88);
        sparks.lineBetween(dx * 16, dy * 16, dx * 39, dy * 39);
      }
      this.tweens.add({
        targets: ring, scale: 1, alpha: 0, duration: 285,
        onComplete: () => ring.destroy(),
      });
      this.tweens.add({
        targets: flash, scale: 2.4, alpha: 0, duration: 180,
        onComplete: () => flash.destroy(),
      });
      this.tweens.add({
        targets: sparks, scale: 1.5, alpha: 0, duration: 230,
        onComplete: () => sparks.destroy(),
      });
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
    // Coreia 4: raio no trajeto, mantendo a detonação no ponto marcado.
    if (this.fourthIds.includes('jp')) this.fireSpecialLaser(target);
  }

  fireSpecialLaser(target) {
    const originX = CANNON.x;
    const originY = CANNON.y;
    const beam = this.add.graphics().setDepth(48);
    beam.lineStyle(16, 0x55ddff, 0.28);
    beam.lineBetween(originX, originY, target.x, target.y);
    beam.lineStyle(4, 0xf3ffff, 1);
    beam.lineBetween(originX, originY, target.x, target.y);
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (laserHitsTarget(originX, originY, target.x, target.y,
        enemy.sprite.x, enemy.sprite.y, 9, enemyContactRadius(enemy.type))) {
        this.impactInvader(i, 2, 0, '#bcfaff');
      }
    }
    this.tweens.add({ targets: beam, alpha: 0, duration: 240,
      onComplete: () => beam.destroy() });
  }

  launchSpecialDrone(x, y, country) {
    const target = chooseTowerAttackTarget(x, y, this.enemies, 1050);
    if (!target) return;
    const color = country === 'br' ? 0x45ebae : 0xffc65d;
    const bullet = this.add.circle(x, y, country === 'br' ? 7 : 5, color)
      .setStrokeStyle(2, 0xffffff, 0.85).setDepth(44);
    const dx = target.sprite.x - x;
    const dy = target.sprite.y - y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const speed = country === 'br' ? 340 : 390;
    this.supportProjectiles.push({
      sprite: bullet, targetId: target.uid, guided: true,
      age: 0, speed, weapon: {
        type: 'drone', damage: country === 'br' ? 2 : 1.25,
        color, knockback: 0,
      },
      vx: dx / distance * speed, vy: dy / distance * speed,
    });
  }

  createProjectile(angle, special, distance = 0, effects = null, centerGlow = false) {
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const x = CANNON.x + vx * 29;
    const y = CANNON.y + vy * 29;
    const style = shotVisualFor(this.activeUpgradeIds());
    const vfx = special ? null : (effects ?? shotVfxFor(this.activeUpgradeIds()));
    const dot = special
      ? this.add.circle(x, y, 8, 0x72eaf8).setDepth(35)
      : this.add.rectangle(x, y, style.width, style.length, style.color)
        .setStrokeStyle(centerGlow ? 2 : 1, 0xffffff, centerGlow ? 0.95 : 0.65)
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
      centerGlow,
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
      gfx.lineStyle(bullet.centerGlow ? 11 : 8, 0xffa52c,
        bullet.centerGlow ? 0.32 : 0.26);
      gfx.lineBetween(x - dx * 29, y - dy * 29, x, y);
      gfx.lineStyle(bullet.centerGlow ? 3 : 2,
        bullet.centerGlow ? 0xfff9d5 : 0xffef87, 0.95);
      gfx.lineBetween(x - dx * (bullet.centerGlow ? 26 : 20),
        y - dy * (bullet.centerGlow ? 26 : 20), x, y);
    }
  }

  explode(x, y) {
    this.specialBlasts.push({
      id: this.nextBlastId++,
      x, y, bornAt: this.time.now,
      hits: new Set(),
      graphics: this.add.graphics().setDepth(39),
    });
    // EUA 4: explosão adicional ampla, sem reações em cadeia.
    if (this.fourthIds.includes('us')) {
      for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
        const enemy = this.enemies[i];
        if (Math.hypot(enemy.sprite.x - x, enemy.sprite.y - y)
          <= 170 + enemyContactRadius(enemy.type)) {
          this.impactInvader(i, 1.5, 0, '#ffbb81');
        }
      }
      const shockwave = this.add.circle(x, y, 170, 0xffa057, 0.13)
        .setStrokeStyle(4, 0xffd5aa).setDepth(38);
      this.tweens.add({ targets: shockwave, alpha: 0, scale: 1.15,
        duration: 450, onComplete: () => shockwave.destroy() });
    }
    // Rússia 4: três bombas derivadas. Não reativam os efeitos de outros países.
    if (this.fourthIds.includes('ru')) {
      for (const [dx, dy] of [[-85, -30], [0, -90], [85, -30]]) {
        const blast = this.add.circle(x + dx, y + dy, 38, 0xff7050, 0.25)
          .setStrokeStyle(2, 0xffc69b).setDepth(39);
        this.tweens.add({ targets: blast, alpha: 0, scale: 1.3, duration: 360,
          onComplete: () => blast.destroy() });
        for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
          const enemy = this.enemies[i];
          if (Math.hypot(enemy.sprite.x - (x + dx), enemy.sprite.y - (y + dy))
            <= 38 + enemyContactRadius(enemy.type)) {
            this.impactInvader(i, 1.25, 0, '#ffbd93');
          }
        }
      }
    }
    if (this.fourthIds.includes('br')) this.launchSpecialDrone(x, y, 'br');
    if (this.fourthIds.includes('cn')) {
      for (let i = 0; i < 3; i += 1) {
        this.time.delayedCall(i * 125, () => {
          if (!this.tutorialComplete) this.launchSpecialDrone(x + (i - 1) * 18, y, 'cn');
        });
      }
    }
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
    // Reflexos concêntricos evocam uma breve distorção luminosa.
    // A intensidade da distorção cresce apenas com o fator já usado
    // pelo knockback estratégico; não existe alteração de física.
    const distortion = strategicDistortionOpacity(intensity);
    graphic.lineStyle(1 + intensity * 1.5, 0xfff9de, distortion);
    graphic.beginPath();
    graphic.arc(0, 0, radius * 1.15, -0.9, 0.68, false);
    graphic.strokePath();
    graphic.beginPath();
    graphic.arc(0, 0, radius * 1.27, 2.35, 3.75, false);
    graphic.strokePath();
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
    arc.lineStyle(4, 0xcaffd0, 0.95);
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
    arc.lineStyle(1.5, 0xffffff, 0.9);
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
        const electricGlow = fenceGlowAt(this.time.now, fraction);
        graphics.lineStyle(5, 0x60ffb9, electricGlow * 0.16);
        graphics.beginPath();
        graphics.arc(x, cy, drawRadius + 3, Math.PI, Math.PI * 2, false);
        graphics.strokePath();
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
        // Reflexos correm ao longo dos cacos mesmo quando não há OVNIs.
        // Reutiliza o Graphics da cúpula em vez de emitir partículas.
        for (let i = 0; i < 3; i += 1) {
          const position = ((this.time.now * 0.00016 + i / 3) % 1);
          const angle = Math.PI + position * Math.PI;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const gx = x + (drawRadius + 4) * cos;
          const gy = cy + (drawRadius + 4) * sin;
          graphics.lineStyle(1.4, 0xf3fff4, electricGlow * 0.75);
          graphics.lineBetween(gx - 3, gy, gx + 3, gy);
          graphics.lineBetween(gx, gy - 3, gx, gy + 3);
        }
        // Pequenos arcos da cerca: brilho somente decorativo.
        for (let i = 0; i < 3; i += 1) {
          const angle = Math.PI + (i + 0.5) * Math.PI / 3;
          const cx = x + (drawRadius + 3) * Math.cos(angle);
          const sy = cy + (drawRadius + 3) * Math.sin(angle);
          const flicker = Math.sin(this.time.now * 0.017 + i * 2.7);
          if (flicker < 0) continue;
          graphics.lineStyle(1.2, 0xc9ffd5, flicker * electricGlow * 0.7);
          graphics.lineBetween(cx - 5, sy, cx, sy - 4);
          graphics.lineBetween(cx, sy - 4, cx + 4, sy + 1);
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
    if (this.unifiedLab) addMenuButton(this, {
      x: W / 2, y: 410, text: 'CONFIGURAR LAB',
      onClick: () => this.scene.start('LabSetupScene', { config: this.labConfig }), depth: 124,
    });
    addMenuButton(this, {
      x: W / 2, y: 362, text: '⌂  MENU PRINCIPAL',
      onClick: () => this.scene.start('MenuScene'), depth: 124,
    });
  }

  showWaveComplete(outcome = 'cleared') {
    if (this.tutorialComplete) return;
    this.tutorialComplete = true;

    if (this.mode.startsWith('wave')) {
      const survived = outcome === 'survived';
      const message = survived
        ? 'AMANHECEU! O RIO RESISTIU!'
        : 'CÉU LIMPO! VITÓRIA ANTECIPADA!';
      this.statusText.setText('NOITE CONCLUÍDA');
      this.tutorialText.setText('');
      this.sunriseOverlay?.setAlpha(survived ? 0.32 : 0);
      const banner = this.add.rectangle(W / 2, H / 2, W, 110,
        survived ? 0x39271f : 0x0a2731, 0.86).setDepth(110);
      const title = this.add.text(W / 2, H / 2, message, {
        fontFamily: 'monospace', fontSize: survived ? '34px' : '29px',
        fontStyle: 'bold', color: survived ? '#ffddab' : '#bafff0',
        stroke: '#071225', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(111);

      if (survived && this.enemies.length) {
        // As naves que sobreviveram fogem pelo portal vermelho.
        const portal = this.add.circle(W / 2, 95, 35, 0x7c1632, 0.55)
          .setStrokeStyle(6, 0xff425d, 0.92).setDepth(80);
        const core = this.add.circle(W / 2, 95, 21, 0xff8093, 0.68).setDepth(81);
        this.tweens.add({ targets: [portal, core], scale: 1.6, alpha: 0,
          delay: 700, duration: 850 });
        for (const enemy of this.enemies) {
          this.tweens.add({ targets: enemy.sprite, x: W / 2, y: 95,
            alpha: 0, scale: 0.05, duration: 1250, ease: 'Sine.easeIn' });
        }
      } else if (!survived) {
        // Fogos para comunicar claramente a vitória antes dos 30 segundos.
        for (const [x, y] of [[235, 130], [480, 110], [720, 145]]) {
          const firework = this.add.circle(x, y, 7, 0xffd789, 0.95)
            .setStrokeStyle(3, 0x9dffda, 0.85).setDepth(82);
          this.tweens.add({ targets: firework, scale: 8, alpha: 0,
            duration: 1100, onComplete: () => firework.destroy() });
        }
      }
      // A mesa só aparece depois de o resultado da noite ser legível.
      this.time.delayedCall(1700, () => {
        title.destroy();
        banner.destroy();
        this.advanceAfterWave();
      });
      return;
    }
    this.advanceAfterWave();
  }

  advanceAfterWave() {
    if (!this.unifiedLab && /^wave[0-8]$/.test(this.mode)) {
      this.scene.start('UpgradeScene', {
        campaign: this.campaign,
        completedWave: Number(this.mode.at(-1)),
      });
      return;
    }
    if (this.unifiedLab) {
      this.scene.start('LabSetupScene', { config: this.labConfig });
      return;
    }
    const automaticNext = automaticWaveAfterVictory(this.mode);
    if (automaticNext) {
      // Avanço automático de compatibilidade; ondas 0–8 agora usam mesa.
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
    const clock = this.mode.startsWith('wave')
      ? 'NOITE ' + String(Math.ceil(Math.max(0, WAVE_DURATION_MS - this.elapsed) / 1000))
        .padStart(2, '0') + 's | ' : '';
    this.statusText.setText(clock + (remaining
      ? 'ESPECIAL ' + remaining.toFixed(1) + 's' : 'ESPECIAL PRONTO'));
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
      const history = this.campaign.choices.map((id) => getFirstUpgrade(id)?.flag ?? id.toUpperCase()).join(' + ');
      const special = this.combat.plasmaEvery ? ' | LIGHTSTICK: ' +
        (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/' + PLASMA_EVERY_SHOTS
        : this.combat.fragmentation ? ' | FRAGMENTAÇÃO' : '';
      const towerLabel = this.supportTowers.map((tower) => tower.definition.label).join(' + ');
      const levelTwo = unlockedSecondUpgrades(this.campaign)
        .map((id) => getFirstUpgrade(id)?.flag ?? id.toUpperCase()).join(' + ');
      this.tutorialText.setText(
        'ALIADOS: ' + (history || 'NENHUM') +
        (levelTwo ? ' | N2: ' + levelTwo : '') +
        (towerLabel ? ' | TORRE: ' + towerLabel : '') + special,
      );
    } else if (this.mode === 'upgradeLab') {
      this.tutorialText.setText('1–5: GERAR   SHIFT+1–5: NÍVEL 2   C: LIMPAR   U: UPGRADES');
      const names = this.upgradeIds.map((id) => getFirstUpgrade(id)?.flag).filter(Boolean);
      const secondNames = this.labSecondIds.map((id) => getFirstUpgrade(id)?.flag ?? id.toUpperCase()).join('+');
      this.labUpgradeLabel.setText(
        'MELHORIAS: ' + (names.length ? names.join(' + ') : 'NENHUMA') +
        (secondNames ? '  |  NÍVEL 2: ' + secondNames : ''),
      );
      const stats = this.combat;
      this.labStatsLabel.setText(
        'TIROS ' + (1000 / stats.basicInterval).toFixed(1) + '/s' +
        '  |  DANO ' + stats.basicDamage.toFixed(2) +
        '  |  FRAG ' + (stats.fragmentation ? FRAGMENT_RADIUS + 'px' : 'NÃO') +
        '  |  LIGHTSTICK ' + (stats.plasmaEvery
          ? (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/' + PLASMA_EVERY_SHOTS : 'NÃO') +
        '  |  PROJ ' + stats.bulletsPerShot,
      );
    } else {
      this.tutorialText.setText(this.unifiedLab
        ? 'ARENA LIVRE: 1–5 OU PAINEL [I]  •  C LIMPAR  •  L CONFIGURAR LAB'
        : 'TESTE: 1–5 TIPOS   SHIFT+1–5: NÍVEL 2   C: LIMPAR');
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
    if (this.sunriseOverlay) {
      const sunrise = Math.max(0, 1 - (WAVE_DURATION_MS - this.elapsed) / 5000);
      this.sunriseOverlay.setAlpha(sunrise * 0.28);
    }
    // À meia-noite de 30 segundos, sobreviver basta — mesmo com inimigos vivos.
    // A verificação vem ANTES das atualizações hostis do quadro final.
    if (this.mode.startsWith('wave') && this.elapsed >= WAVE_DURATION_MS) {
      this.showWaveComplete('survived');
      return;
    }
    this.aimAngle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.barrel.rotation = this.aimAngle + Math.PI / 2;
    if (pointer.leftButtonDown() && !this.pointerOverEnemyLabControls(pointer)) this.shootBasic(pointer);
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

    // A Arena Livre deve continuar indefinidamente, inclusive quando o
    // jogador eliminar todas as naves de treino.
    if (!(this.unifiedLab && this.mode === 'lab')) {
      const outcome = waveOutcome({
        mode: this.mode,
        elapsed: this.elapsed,
        spawned: this.eventsSpawned,
        scheduled: this.waveEvents.length,
        enemies: this.enemies.length,
        hostileShots: this.enemyBullets.length,
      });
      if (outcome) this.showWaveComplete(outcome);
    }
  }
}
