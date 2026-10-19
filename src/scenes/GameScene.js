import { hitDiscoGlobe, DISCO_DURATION_MS, DISCO_RADIUS } from '../gameplay/discoGlobe.js';
import { createCannonDestruction } from '../ui/cannonDestruction.js';
import { bindSceneMusic, waveMusic } from '../audio/music.js';
import Phaser from 'phaser';
import { ARRAIAL, fireworkSchedule, withinBlast, withinFlame, firePulseRadius } from '../gameplay/arraialBrasil2.js';
import {
  normalizeLabConfig, configuredTowerCountries, configuredTowerLoadout,
  LAB_ENEMY_NAMES, LAB_MAX_ENEMY_LEVEL, labEnemyEvent,
} from '../gameplay/labConfig.js';
import { preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { assetUrl } from '../config/assetUrl.js';
import { preloadMechSprites, createMechSprites } from '../gameplay/mechSpriteMounts.js';
import {
  SWARM_DANCES, SWARM_ENTRIES, WAVE0_EASY_PACING,
  getV035WaveEvents, swarmDanceCenter, swarmDancePosition,
  tacticalFormationOffset, tacticalManeuverPosition, tacticalAttackPosition,
  chooseGroupDefenseTarget,
} from '../gameplay/formation035.js';
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
import {addCuboBroadcastFrame} from '../ui/cuboNewsTheme.js';
import {CANNON_DOME_RADIUS,cannonShieldColor,cannonDomeIntercept} from '../gameplay/shieldDome049.js';
import { v1CombatStats, v1SupremeFor, V1_SUPREMES, v1CountryLevels, mayDuplicateProjectile, MAX_VISUAL_PROJECTILES, MAX_COSMETIC_PARTICLES, horizontalOffsets } from '../gameplay/v1Upgrades.js';
import { createCombatCrtOverlay } from '../ui/crtOverlay.js';
import { resolveFinalOpponent, finalePrelude, FINALE_COUNTRIES } from '../gameplay/campaignFinale.js';
import { hostileBosses, pickBetrayer, continueResistanceAfterDefeat } from '../gameplay/wave11Rules.js';
import {
  spawnType6Encounter, updateType6Encounter, hitType6At, hitType6Segment,
  hitType6Bullet, defeatType6, type6NextDeadline, type6AimPosition,
  detonateType6Bomb,
} from '../gameplay/type6Encounter.js';
import {
  type6AliveModules, type6PointTarget, type6AreaTargets, type6TargetRects,
} from '../gameplay/type6Boss.js';
import { finaleBossHp, finaleBossFirePattern, finaleCounterattack } from '../gameplay/finaleBalance.js';
import {createCuboNewsState,tickCuboNews,queueCuboNews} from '../gameplay/cuboNews.js';
import {createCuboNewsHud} from '../ui/cuboNewsHud.js';
import { v1SpecialConfig, specialPalette } from '../gameplay/v1Specials.js';
import { applyRussianFreeze, spreadRussianFrost } from '../gameplay/russianFrost.js';
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
    this.v1Playtest = Boolean(data.v1Playtest);
    this.previewDestruction = Boolean(data.previewDestruction);
    this.deathSequence = null;
    this.unifiedLab = Boolean(data.labConfig);
    this.labConfig = this.unifiedLab ? normalizeLabConfig(data.labConfig) : null;
    // Compatibilidade com saves antigos que tinham apenas "upgradeId".
    const legacy = getFirstUpgrade(data.upgradeId) && this.mode === 'wave1'
      ? { choices: [data.upgradeId] } : {};
    this.campaign = normalizeCampaignState(data.campaign ?? legacy);
    this.brazilResistanceLevels=Array.isArray(data.brazilResistanceLevels)
      ? [...new Set(data.brazilResistanceLevels.filter(level=>
        Number.isInteger(level)&&level>=1&&level<=10))].sort((a,b)=>a-b):[];
    this.selectedBetrayer=this.mode==='wave11'
      ? (data.selectedBetrayer || pickBetrayer(this.campaign.choices)) : null;
    this.finaleCampaign={...this.campaign,selectedBetrayer:this.selectedBetrayer};
    this.finale=this.mode==='wave11'?resolveFinalOpponent(this.finaleCampaign):null;
    this.finaleBossesNeeded=this.mode==='wave11'?1:0;
    this.finaleBossesKilled=0;
    this.supremeFinishing=false;
    const survivors=this.mode==='wave11'
      ? this.campaign.choices.filter(id=>!this.finale.coalition.includes(id))
      : this.campaign.choices;
    this.combatCampaign=this.mode==='wave11'
      ? {choices:[...survivors,
          ...(this.brazilResistanceLevels.length&&!survivors.includes('br')?['br']:[])],
        resistanceLevels:this.brazilResistanceLevels} : this.campaign;
    this.waveDurationMs=this.mode.startsWith('wave')
      ? MODES[this.mode].minDuration:WAVE_DURATION_MS;
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
      : unlockedFirstUpgrades(this.combatCampaign);
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
    this.isV1Campaign = !this.unifiedLab && (/^wave(?:[0-9]|10|11)$/.test(this.mode) || (this.v1Playtest && this.mode === 'upgradeLab'));
    if (this.isV1Campaign) {
      this.combat = v1CombatStats(this.combatCampaign);
      this.specialBuild = v1SpecialConfig(this.combatCampaign);
      // Legado de torres e especiais das árvores antigas fica disponível somente no laboratório.
      this.thirdIds = [];
      this.fourthIds = [];
    }
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
    return { mode: this.mode, campaign: normalizeCampaignState(this.campaign),
      brazilResistanceLevels:[...this.brazilResistanceLevels],
      selectedBetrayer:this.selectedBetrayer };
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

  clearDiscoGlobes() {
    for (const globe of this.discoGlobes ?? []) { globe.graphics.destroy(); globe.label.destroy(); }
    this.discoGlobes = [];
  }

  clearTestEnemies() {
    if (!this.unifiedLab && this.mode !== 'upgradeLab' && this.mode !== 'lab') return;
    this.clearDiscoGlobes();
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) this.removeEnemy(i);
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) this.removeEnemyBullet(i);
    for (const bullet of this.projectiles) {
      bullet.trail?.destroy();
      bullet.specialMarker?.destroy();
      bullet.sprite.destroy();
    }
    this.projectiles.length = 0;
    this.visibleProjectileCount = 0;
    this.clearResidualSlashes();
    for (const blast of this.specialBlasts) blast.graphics.destroy();
    this.specialBlasts.length = 0;
    for (const nucleus of this.arraialNuclei) nucleus.graphics.destroy();
    this.arraialNuclei.length = 0;
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
    // Tipo 3: spritesheet 16-bit 4 x 3 (12 quadros de 128 px).
    // O PNG será colocado pelo desenvolvedor em public/assets/inimigos/tipo3/.
    // Enquanto estiver ausente, o visual vetorial antigo serve de fallback.
    this.load.spritesheet('tipo3_sheet', assetUrl('assets/inimigos/tipo3/spritesheet.png'), {
      frameWidth: 128, frameHeight: 128,
    });
    // Caça Relâmpago Tipo 4: opção C aprovada, 12 quadros em grade 4x3.
    // A imagem fica em public/assets/inimigos/tipo4/spritesheet.png.
    // Sem o arquivo, o inimigo mantém o visual vetorial anterior.
    this.load.spritesheet('tipo4_sheet', assetUrl('assets/inimigos/tipo4/spritesheet.png'), {
      frameWidth: 128, frameHeight: 128,
    });
  }

  create() {
    this.music = bindSceneMusic(this, waveMusic(this.mode, this.campaign));
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
    if (this.textures.exists('tipo3_sheet')) {
      if (!this.anims.exists('tipo3_voo')) this.anims.create({
        key: 'tipo3_voo',
        frames: this.anims.generateFrameNumbers('tipo3_sheet', { frames: [0,1,2,3] }),
        frameRate: 4, repeat: -1,
      });
      if (!this.anims.exists('tipo3_bombardeio')) this.anims.create({
        key: 'tipo3_bombardeio',
        frames: this.anims.generateFrameNumbers('tipo3_sheet', { frames: [8,9] }),
        frameRate: 9, repeat: 0,
      });
    }
    if (this.textures.exists('tipo4_sheet')) {
      const actions=[
        ['tipo4_voo',[0,1],4],
        // Os quadros 2 e 3 já apontam para DIREITA e ESQUERDA.
        // Segurar um único quadro lateral evita o 'balanço' em cada passada.
        ['tipo4_banco_esquerda',[3],1],
        ['tipo4_banco_direita',[2],1],
        ['tipo4_dash',[6,7],10],
        ['tipo4_propulsao',[8,9],8],
      ];
      for (const [key,frames,frameRate] of actions) {
        if (this.anims.exists(key)) continue;
        this.anims.create({
          key, frames:this.anims.generateFrameNumbers('tipo4_sheet',{frames}),
          frameRate, repeat:frames.length===1?0:-1,
        });
      }
    }

    this.discoGlobes = [];
    this.enemies = [];
    this.projectiles = [];
    this.visibleProjectileCount = 0;
    this.enemyBullets = [];
    this.specialBlasts = [];
    this.arraialNuclei = [];
    this.lastFlameTick = -Infinity;
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
    // v0.35: a campanha usa grupos reais, com progressão dentro de cada noite.
    // Laboratórios e a agenda legada continuam acessíveis independentemente.
    this.waveEvents = getV035WaveEvents(this.mode,
      getWaveEvents(this.mode,this.finaleCampaign));
    this.lastBasicFire = -this.combat.basicInterval;
    this.heatStartedAt = null;
    this.ultimateUsed = false;
    this.supremeTyping = false;
    this.supremeCode = '';
    this.supremeCinematic = false;
    this.cannonFrozenUntil=0;
    this.lastFinaleWarningAt=-Infinity;
    this.finaleCounterattackCount=0;
    this.basicShotCount = 0;
    this.cannonRecoil = 0;
    this.lastHeavyShake = -Infinity;
    this.lastSpecialFire = -this.combat.specialCooldown;
    this.lastV1ShieldPulse = -Infinity;
    this.shieldReflectCount = 0;
    this.tutorialComplete = false;
    this.gameOver = false;
    this.boss6Victory=false;
    // A onda do Tipo 6 nunca consome tempo antes de o chefão ficar alvejável,
    // inclusive no intervalo entre abrir o combate e criar o sprite do boss.
    this.boss6IntroPaused=this.mode==='wave10'||this.mode==='wave11';
    this.boss6DoomFired=false;
    this.boss6WarningText=null;
    this.cannonHealth = 100;
    this.shieldMax = 80; // v0.49: escudo padrão, nenhuma melhoria de país altera HP.
    this.shield = this.shieldMax;
    this.lastDamageAt = -10000;
    this.aimAngle = -Math.PI / 2;

    this.createTurret();
    this.shieldGraphics = this.add.graphics().setDepth(23);
    this.enemyHealthGraphics = this.add.graphics().setDepth(27);
    this.frostGraphics = this.add.graphics().setDepth(46);
    this.towerStatusGraphics = this.add.graphics().setDepth(35);
    this.towerChargeGraphics = this.add.graphics().setDepth(36);
    this.createSupportTowers();
    this.createHud();
    if(this.mode.startsWith('wave')){
      this.cuboNewsState=createCuboNewsState(this.combatCampaign?.choices||this.campaign?.choices||[],
        this.mode,this.mode==='wave11'?this.selectedBetrayer:null);
      this.cuboNewsHud=createCuboNewsHud(this);
      this.cuboNewsHud.update(0,this.waveDurationMs,null,{frozen:true});
    }
    if (this.isV1Campaign && this.specialBuild?.primary) {
      this.specialLabel=this.add.text(CANNON.x-170,CANNON.y-63,'',{
        fontFamily:'monospace',fontSize:'11px',fontStyle:'bold',
        color:'#e9f6ff',backgroundColor:'#142030dd',padding:{x:5,y:4},
      }).setDepth(105);
    }
    if (this.isV1Campaign && this.combat.ultimate) {
      this.ultimateLabel = this.add.text(CANNON.x + 75, CANNON.y - 61, '', {
        fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold',
        color: '#fff2b8', backgroundColor: '#132b39da', padding: {x:6,y:4},
      }).setDepth(105);
    }
    // Não existem indicadores persistentes fora do lower third da Cubo News.
    if(this.mode.startsWith('wave')){
      this.specialLabel?.setVisible(false);
      this.ultimateLabel?.setVisible(false);
    }
    // A batalha é vista como transmissão de TV. O filtro é somente visual:
    // fica acima das naves, mas abaixo dos textos e controles do HUD.
    this.crtOverlay = createCombatCrtOverlay(this, W, H);
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
    this.input.keyboard.addCapture('SPACE');
    this.input.keyboard.on('keydown-SPACE', (event) => {
      event.preventDefault();
      if (this.scene.isActive('GameScene') && !this.scene.isPaused('GameScene')) this.openSupremeCode();
    });
    this.input.keyboard.on('keydown', (event) => {
      if (!this.supremeTyping) return;
      if (event.key === 'Escape') { this.closeSupremeCode(); return; }
      if (event.key === 'Backspace') this.supremeCode = this.supremeCode.slice(0,-1);
      else if (/^[a-z]$/i.test(event.key)) this.supremeCode += event.key.toUpperCase();
      const expected = this.supremeExpectedCode();
      if (this.supremeCode === expected) { this.closeSupremeCode(); this.activateUltimate(); return; }
      if (this.supremeCode.length > expected.length) this.supremeCode = this.supremeCode.slice(-expected.length);
      if (this.supremePrompt) this.supremePrompt.setText(`PROTOCOLO SUPREMO: ${expected}\nDIGITE: ${this.supremeCode}_\nBACKSPACE corrige • ESC cancela`);
    });

    if (import.meta.env.DEV && this.mode.startsWith('wave')) {
      // Playtest local: Shift+5–9 abre ondas intermediárias;
      // Shift+0 e Shift+1 abrem os novos chefões 10 e 11.

      // Se entrar antes da terceira escolha, usa Brasil III como equipamento
      // padrão apenas no salto de testes, sem sobrescrever a campanha.
      this.input.keyboard.on('keydown', (event) => {
        if (!event.shiftKey) return;
        const choice = /^Digit([0-9])$/.exec(event.code ?? '');
        if (!choice || Number(choice[1])<5&&choice[1]!=='0'&&choice[1]!=='1') return;
        event.preventDefault();
        const mode=choice[1]==='0'?'wave10':choice[1]==='1'?'wave11':`wave${choice[1]}`;
        const campaign=this.campaign.choices.length>=3
          ? this.campaign : {choices:['br','br','br','br','br','br','br','br','br','br']};
        this.scene.start('GameScene',{mode,campaign});
        
      });
    }

    if (this.unifiedLab && this.mode === 'lab') {
      // Arena livre: nenhum spawn agendado e nenhuma duração limite.
      this.waveEvents = [];
    } else if (this.mode === 'wave11' && !this.v1Playtest) {
      this.showFinalePrelude();
    } else if (this.mode.startsWith('wave')) {
      this.startWaveCountdown();
    } else {
      this.scheduleWaveEvents();
    }

    if (this.previewDestruction) {
      this.time.delayedCall(4300, () => {
        if (this.tutorialComplete) return;
        this.shield = 0;
        this.cannonHealth = 0;
        this.showDefeat();
      });
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
      if (!this.v1Playtest) {
        this.input.keyboard.on('keydown-U', () => {
          if (this.scene.isActive('GameScene')) this.openUpgradeLab();
        });
        // Apenas laboratório legado abre o seletor de upgrades antigo.
        this.time.delayedCall(1, () => this.openUpgradeLab());
      }
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
        if (this.tutorialComplete || this.boss6Victory || this.boss6DoomFired) return;
        // Nos 15 segundos finais das ondas comuns não entram novos inimigos.
        if(/^wave[0-9]$/.test(this.mode)&&this.elapsed>=15000)return;
        this.eventsSpawned += 1;
        this.spawnWaveEvent(event);
      });
    });
  }

  showFinalePrelude() {
    this.music.play('news', { loop: false });
    this.countdownActive=true;
    const info=finalePrelude(this.finaleCampaign);
    const panel=this.add.rectangle(W/2,H/2,W,H,0x071021,0.96)
      .setInteractive().setDepth(210);
    addCuboBroadcastFrame(this,{
      section:'Plantão • Momento decisivo',
      headline:'Boletim extraordinário: destino do Brasil em jogo',
      footer:'A cobertura segue após o início da próxima onda',
      depth:228,
    });
    const title=this.add.text(W/2,87,info.title,{
      fontFamily:'monospace',fontSize:'30px',fontStyle:'bold',
      color:'#ffe0a6',align:'center',
    }).setOrigin(0.5).setDepth(212);
    const lines=this.add.text(W/2,239,info.lines.join(String.fromCharCode(10,10)),{
      fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',
      color:'#e3f1ff',align:'center',wordWrap:{width:810},lineSpacing:8,
    }).setOrigin(0.5).setDepth(212);
    let button;
    button=addMenuButton(this,{x:W/2,y:420,width:370,height:52,
      text:'▶  ENFRENTAR ONDA 11',primary:true,depth:215,onClick:()=>{
        [panel,title,lines,button,button.label].forEach(item=>item?.destroy());
        this.startWaveCountdown();
      }});
  }

  startWaveCountdown() {
    if (this.mode === 'wave0' && !this.v1Playtest) this.music.play('news', { loop: false });
    else this.music.play(waveMusic(this.mode, this.campaign));
    // O tempo de combate e os spawns só começam APÓS o número total (30/60)
    // sair do centro da tela e alcançar o relógio externo à câmera.
    // A entrada cinematográfica do Tipo 6 pode pausar esse relógio novamente
    // até a fortaleza ficar alvejável, independentemente desta abertura.
    this.countdownActive = true;
    this.elapsed = 0;
    this.statusText.setText('TEMPO ATÉ O AMANHECER');
    const startCombat = () => {
      if (!this.scene.isActive('GameScene') || this.tutorialComplete) return;
      this.countdownActive = false;
      this.music.play(waveMusic(this.mode, this.campaign));
      this.elapsed = 0;
      for (const tower of this.supportTowers) tower.lastAttackAt = this.time.now;
      this.scheduleWaveEvents();
    };
    if (this.cuboNewsHud?.beginDawnIntro) {
      this.cuboNewsHud.beginDawnIntro(this.waveDurationMs, startCombat);
    } else {
      // Fallback para integrações antigas sem DOM: não bloquear a onda.
      this.time.delayedCall(1900, startCombat);
    }
  }

  createSupportTowers() {
    const selected = this.unifiedLab ? configuredTowerLoadout(this.labConfig)
      : this.mode === 'upgradeLab' ? this.labTowerIds.map(id => ({ id, role: 'swarm', level: 5 }))
        : this.isV1Campaign ? [] : activeTowerLoadout(this.campaign);
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
      // O indicador do Lobo não pode flutuar acima do sprite.
      // Em cada animal secundário, ele acompanha o ombro/encaixe
      // do canhão; o anel compacto deixa a silhueta e a arma legíveis.
      const mount = tower.visual.secondary
        ? tower.visual.mountWorldPosition() : null;
      const x = mount?.x ?? tower.x;
      const y = mount?.y ?? (tower.y - 89);
      const ring = mount ? 12 : 21;
      const color = tower.definition.color;
      graphics.fillStyle(color, glow * 0.14);
      graphics.fillCircle(x, y, ring * (0.75 + progress * 0.42));
      graphics.lineStyle(2.5, 0x23374a, 0.75);
      graphics.strokeCircle(x, y, ring);
      if (progress > 0) {
        graphics.lineStyle(mount ? 2.2 : 3.5, ready ? 0xffffff : color, glow);
        graphics.beginPath();
        graphics.arc(x, y, ring, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        graphics.strokePath();
      }
      if (evolved) {
        // Circuito de evolução proporcional ao tamanho da torre.
        graphics.lineStyle(1.8, color, 0.25 + 0.55 * progress);
        graphics.strokeCircle(x, y, ring + 6);
        if (ready) {
          graphics.fillStyle(0xffffff, glow * 0.85);
          graphics.fillCircle(x + Math.cos(this.time.now * 0.006) * (ring + 6),
            y + Math.sin(this.time.now * 0.006) * (ring + 6), 2.4);
        }
      }
      graphics.fillStyle(ready ? 0xffffff : color, ready ? glow : glow * 0.65);
      graphics.fillCircle(x, y,
        mount ? (ready ? 3.2 : 1.8 + 1.5 * progress) : (ready ? 5.5 : 2.5 + 2.5 * progress));
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
      if(enemy.type===6){
        const targets=type6AreaTargets(enemy.type6,enemy.sprite.x,enemy.sprite.y,
          x,y,SHOCK_BLAST_RADIUS);
        const rects=type6TargetRects(enemy.type6,enemy.sprite.x,enemy.sprite.y);
        for(const id of targets){
          const rect=rects.find(rect=>rect.id===id);
          if(!rect)continue;
          const distance=Math.hypot(rect.x-x,rect.y-y);
          const damage=shockBlastDamage(distance,Math.max(rect.halfWidth,rect.halfHeight),
            weapon.damage,SHOCK_BLAST_RADIUS);
          if(damage>0)hitType6At(this,enemy,rect.x,rect.y,damage,0,true);
        }
        continue;
      }
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
        if(hostile.colossal)detonateType6Bomb(this,hostile);
        else this.removeEnemyBullet(i);
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
    const aim=type6AimPosition(target);
    const next = advanceGuidedTowerShot(oldX, oldY,
      aim.x, aim.y, shot.speed, dt);
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
      if(enemy.type===6){
        const targets=type6AreaTargets(enemy.type6,enemy.sprite.x,enemy.sprite.y,
          next.x,next.y,9);
        if(targets.length){
          this.detonateShockArtillery(next.x,next.y,shot.weapon);
          return true;
        }
        continue;
      }
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
    // Nos novos corpos, o disparo começa no canhão que realmente girou,
    // não em um ponto fixo que faria parecer que atirou pelo corpo.
    const muzzle = tower.visual.secondary ? tower.visual.muzzlePosition() : null;
    const fromX = muzzle?.x ?? tower.x;
    const fromY = muzzle?.y ?? tower.y - 35;

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
      const aim=type6AimPosition(enemy);
      const beam = this.add.graphics().setDepth(41);
      beam.lineStyle(11, 0x996af1, 0.22);
      beam.lineBetween(fromX, fromY, aim.x, aim.y);
      beam.lineStyle(3, 0xedc4ff, 1);
      beam.lineBetween(fromX, fromY, aim.x, aim.y);
      this.tweens.add({
        targets: beam, alpha: 0, duration: 260,
        onComplete: () => beam.destroy(),
      });
      const hits = weapon.pierce ? this.enemies.filter(e => {
        if (!towerSeesEnemy(e, TOWER_BLIND_ZONE_Y, W, H)) return false;
        const ax = fromX, ay = fromY, bx = aim.x, by = aim.y;
        const dx = bx-ax, dy = by-ay, len = Math.max(1, dx*dx+dy*dy);
        const t = Phaser.Math.Clamp(((e.sprite.x-ax)*dx+(e.sprite.y-ay)*dy)/len, 0, 1);
        return Math.hypot(e.sprite.x-(ax+t*dx),e.sprite.y-(ay+t*dy)) < 24;
      }) : [enemy];
      for (const hitEnemy of hits) {
        if (!towerSeesEnemy(hitEnemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
        const index = this.enemies.findIndex(item => item.uid === hitEnemy.uid);
        if (index >= 0) {
          if(hitEnemy.type===6)hitType6Segment(this,hitEnemy,fromX,fromY,aim.x,aim.y,weapon.damage,6);
          else this.impactInvader(index,weapon.damage,0,'#e6b1ff');
        }
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
      const aim=type6AimPosition(shotTarget);
      const dx = aim.x - x;
      const dy = aim.y - y;
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
      const aim=type6AimPosition(target);
      const next = advanceGuidedTowerShot(
        oldX, oldY, aim.x, aim.y, shot.speed, dt,
      );
      shot.sprite.setPosition(next.x, next.y);
      shot.vx = next.vx;
      shot.vy = next.vy;

      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
        const enemy = this.enemies[j];
        if (!towerSeesEnemy(enemy, TOWER_BLIND_ZONE_Y, W, H)) continue;
        if(enemy.type===6){
          hit=hitType6Segment(this,enemy,oldX,oldY,next.x,next.y,
            shot.weapon.damage,7);
          if(hit)break;
          continue;
        }
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

  queueCuboNews(headline,subtitle){
    if(this.cuboNewsState)queueCuboNews(this.cuboNewsState,headline,subtitle);
  }

  createHud() {
    const font = { fontFamily: 'monospace', fontSize: '18px', color: '#f0f7ff' };
    const topPanel=this.add.rectangle(W / 2, 20, W, 40, 0x081528, 0.93).setDepth(100);
    if(this.mode.startsWith('wave'))topPanel.setVisible(false);
    const oldTitle=this.add.text(14, 9, 'SOBERANIA | ' + MODES[this.mode].title, font).setDepth(101);
    if(this.mode.startsWith('wave'))oldTitle.setVisible(false);
    this.statusText = this.add.text(W - 14, 9, '', font).setOrigin(1, 0).setDepth(101);
    this.tutorialText = this.add.text(W / 2, 55, '', {
      ...font, fontSize: '15px', backgroundColor: '#0b1a2bcc', padding: { x: 9, y: 6 },
    }).setOrigin(0.5, 0).setDepth(101);
    this.healthText = this.add.text(14, H - 28, '', {
      ...font, fontSize: '13px', color: '#e2ebfa',
    }).setDepth(101);
    if(this.mode.startsWith('wave')){
      this.statusText.setVisible(false);
      this.tutorialText.setVisible(false);
      this.healthText.setVisible(false);
    }

    if (this.mode === 'upgradeLab' && !this.v1Playtest) {
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
    if (type === 2) {
      // Protótipo vetorial Phaser: nave triangular industrial, núcleo vermelho.
      // Partes separadas permitem validar rotação e propulsão antes da sprite sheet.
      const sprite=this.add.container(x,y).setDepth(19);
      const hull=this.add.graphics();
      hull.fillStyle(0x171d29).fillTriangle(-23,14,0,-24,23,14);
      hull.fillStyle(0x3e4b5b).fillTriangle(-17,10,0,-17,17,10);
      hull.fillStyle(0x101722).fillTriangle(-26,11,-12,2,-10,19);
      hull.fillTriangle(26,11,12,2,10,19);
      hull.lineStyle(2,0x82909c).strokeTriangle(-23,14,0,-24,23,14);
      hull.fillStyle(0xf0343e).fillCircle(0,-2,6);
      hull.fillStyle(0xff8790,0.9).fillCircle(0,-3,2);
      const thruster=this.add.graphics();
      thruster.fillStyle(0xff4b31,0.8).fillTriangle(-8,14,0,25,8,14);
      thruster.fillStyle(0xffbb5e,0.9).fillTriangle(-4,14,0,20,4,14);
      sprite.add([thruster,hull]);
      sprite.setData('thruster',thruster);
      // Níveis reforçados serão diferenciados na futura sprite sheet.
      return {sprite,box:null};
    }
    if (type === 3 && this.textures.exists('tipo3_sheet')) {
      const sprite = this.add.sprite(x, y, 'tipo3_sheet', 0)
        .setDisplaySize(76, 76).setDepth(19).play('tipo3_voo');
      if (level > 1) sprite.setTint(definition.tintColor);
      sprite.on('animationcomplete-tipo3_bombardeio', () => {
        if (sprite.active) sprite.play('tipo3_voo');
      });
      return { sprite, box: null };
    }
    if (type === 4 && this.textures.exists('tipo4_sheet')) {
      const sprite = this.add.sprite(x, y, 'tipo4_sheet', 0)
        .setDisplaySize(70,70).setDepth(19).play('tipo4_voo');
      if (level > 1) sprite.setTint(definition.tintColor);
      return { sprite, box:null };
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

  spawnV035Group(type, level, count, centerX = null) {
    const kind = type === 1 ? 'swarm' : 'tactical';
    const early=/^wave[012]$/.test(this.mode);
    const wave0=this.mode==='wave0';
    const center = this.portalLane(type,centerX);
    const group = {
      kind, count, centerX: center, target: null, boundToScreen:true,
      duration:wave0?WAVE0_EASY_PACING.danceDuration:
        early ? (kind==='swarm'?3.5:4.0) : (kind==='swarm'?5.0:5.3),
      holdDuration:wave0?WAVE0_EASY_PACING.holdDuration:early?1.15:1.35,
      portalY: type===1?68:125,
      finalFormation: kind==='tactical'?'triangle':'square',
      pattern: kind === 'swarm'
        ? SWARM_DANCES[(this.eventsSpawned||0)%SWARM_DANCES.length] : 'tactical',
      entry: 'together', // formação coesa, jamais naves dispersas
      direction: Phaser.Math.Between(0, 1) ? 1 : -1,
      attackStartAge: null,
      attackOrigin: null,
      attackDuration: null,
      shotWarning:false,
    };
    // Uma abertura para a esquadrilha inteira; cada nave sai em sequência.
    // Tipo 1 usa portal mais alto, próximo ao topo do céu.
    const portalY=group.portalY;
    this.showSpawnPortal(center,portalY,type===1?37:42,count,(i)=>{
      const initial={x:center,y:portalY};
      this.spawnEnemy(type,{
        level,x:initial.x,y:initial.y,center,
        formationIndex:i,formationCount:count,formationGroup:group,
        portalReleased:true,
      });
    });
  }

  chooseV035GroupTarget(group, center) {
    return chooseGroupDefenseTarget(
      availableDefenseTargets(CANNON, this.supportTowers),
      center.x, center.y, group.kind,
      this.cannonHealth, this.shield, this.shieldMax,
    );
  }

  spawnWaveEvent(event) {
    if (event.warning) this.showAttackWarning(event.warning);
    const level = event.level ?? 1;
    if (event.pattern === 'swarm' && event.type === 1) {
      this.spawnV035Group(1, level, event.count ?? 3);
      return;
    }
    if (event.pattern === 'tactical' && event.type === 2) {
      this.spawnV035Group(2, level, event.count ?? 3);
      return;
    }
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
      this.spawnV035Group(2, level, count, center);
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
    this.spawnEnemy(event.type, { level, side: event.side, x: event.x,
      finalBoss:event.finalBoss,bossCountry:event.bossCountry,
      bossLevel:event.bossLevel,coalitionSize:event.coalitionSize });
  }

  portalLane(type, requestedX=null) {
    // Três corredores fixos por tipo: grupos de eventos diferentes reutilizam
    // os mesmos pontos de origem em vez de abrir portais dispersos.
    const lanes=[250,480,710];
    const x=requestedX??lanes[Phaser.Math.Between(0,2)];
    return lanes.reduce((best,lane)=>Math.abs(lane-x)<Math.abs(best-x)?lane:best,lanes[0]);
  }

  showSpawnPortal(x,y,radius=34,count=1,onRelease=()=>{}) {
    this.activeSpawnPortals??=new Map();
    const key=`${Math.round(x)}:${Math.round(y)}`;
    let entry=this.activeSpawnPortals.get(key);
    if(!entry || !entry.graphics.active) {
      entry={graphics:this.add.graphics().setDepth(17).setPosition(x,y),
        born:this.time.now,lastRelease:this.time.now+420,queueEnd:this.time.now+420,
        radius,closing:false};
      this.activeSpawnPortals.set(key,entry);
      const render=()=>{
        if(!entry.graphics.active)return;
        const now=this.time.now,age=now-entry.born;
        const opening=Math.min(1,age/500);
        const remaining=entry.lastRelease+2600-now;
        const closing=Math.min(1,Math.max(0,remaining/600));
        const scale=Math.max(0.001,Math.min(opening,closing));
        const r=entry.radius*scale;
        const g=entry.graphics;
        g.clear();
        g.fillStyle(0x53269a,0.28*scale);
        g.fillEllipse(0,0,r*2.2,r*1.6);
        g.lineStyle(5,0xa85aff,scale);
        g.strokeEllipse(0,0,r*2,r*1.4);
        g.lineStyle(2,0x6beaff,scale);
        g.strokeEllipse(0,0,r*1.6,r*1.1);
        for(let k=0;k<8;k++){
          const angle=k*Math.PI/4+age*0.005;
          g.fillStyle(k%2?0xe0a0ff:0x70f6ff,scale);
          g.fillCircle(Math.cos(angle)*r,Math.sin(angle)*r*0.7,2.5*scale);
        }
        if(remaining<=0){
          entry.ticker.remove();
          g.destroy();
          if(this.activeSpawnPortals.get(key)===entry)this.activeSpawnPortals.delete(key);
        }
      };
      entry.ticker=this.time.addEvent({delay:30,loop:true,callback:render});
    }
    entry.radius=Math.max(entry.radius,radius);
    const first=Math.max(this.time.now+120,entry.queueEnd,entry.born+500);
    for(let i=0;i<count;i++){
      const releaseAt=first+i*320;
      this.time.delayedCall(releaseAt-this.time.now,()=>{
        if(this.tutorialComplete||this.boss6Victory)return;
        if(/^wave[0-9]$/.test(this.mode)&&this.elapsed>=15000)return;
        onRelease(i);
      });
    }
    entry.lastRelease=first+(count-1)*320;
    entry.queueEnd=entry.lastRelease+320;
  }

  spawnEnemy(type, options = {}) {
    if(type===6){
      if(this.enemies.some(e=>e.type===6&&!e.type6?.defeated))return null;
      let hp;
      if(this.mode==='wave10')hp=finaleBossHp('wave10',this.combat);
      else {
        const originalStats=v1CombatStats({choices:this.campaign.choices.filter(id=>
          id!==this.selectedBetrayer)});
        hp=finaleBossHp('wave11',originalStats,1);
      }
      return spawnType6Encounter(this,{...options,hp});
    }
    if(!options.portalReleased && !options.skipPortal) {
      const portalX=this.portalLane(type,options.x ?? options.center);
      const portalY=type===1?68:type===2?125:type===3?100:type===5?110:145;
      this.showSpawnPortal(portalX,portalY,type===5?70:38,1,()=>{
        this.spawnEnemy(type,{...options,portalReleased:true,
          x:options.x ?? portalX,
          y:options.y ?? (type===1?portalY:undefined)});
      });
      return null;
    }
    const level = options.level ?? 1;
    const definition = enemyStats(type, level);
    const index = options.formationIndex ?? 1;
    const orbiting = type === 2 && options.pattern === 'orbit';
    const formationGroup = options.formationGroup ?? null;
    const groupCount = options.formationCount ?? 3;
    const center = options.center ?? W / 2;
    const formationOffset = index - (groupCount - 1) / 2;
    const startX = type === 5 ? (options.x ?? W / 2) :
      type === 4 ? (options.side === 'left' ? -64
        : options.side === 'right' ? W + 64
          : Phaser.Math.Between(0, 1) ? -64 : W + 64) :
      type === 2 ? (options.x ?? center + formationOffset * (orbiting ? 60 : 83)) :
      options.x ?? Phaser.Math.Between(120, W - 120);
    const startY = type === 4 ? Phaser.Math.Between(120, 180) :
      type === 2 ? (options.y ?? -45 - Math.abs(formationOffset) * 7) :
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
      // Na onda de apresentação, o mergulho é deliberadamente mais lento.
      speed:definition.speed*(this.mode==='wave0'&&type===1
        ?WAVE0_EASY_PACING.diveSpeedMultiplier:1),
      recoilSpeed: 0,
      electricSlowUntil: -1,
      frozenUntil: -1,
      russianPullOffset: {x:0,y:0},
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
      finalBoss:Boolean(options.finalBoss), bossCountry:options.bossCountry??null,
      bossLevel:options.bossLevel??0,bossLabel:null,
      finalAbilityAge:0,finalAbilityCount:0,finalAssaultPhase:1,
      laserGraphics: null,
      formationGroup,
      formationIndex: index,
      entryDelay: formationGroup?.kind === 'swarm' &&
        formationGroup.entry === 'staggered' ? index * 0.052 : 0,
      target: formationGroup ? null : this.chooseDefenseTarget(),
    };

    if(type===5&&options.finalBoss&&this.mode==='wave10'){
      // Chefe alienígena tipo 6 ainda sem sprite/IA final: casco tipo 5 como placeholder.
      enemy.bossLabel=this.add.text(startX,startY-58,
        'FORTALEZA-MÃE — CHEFE FINAL ALIENÍGENA',{
          fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',
          color:'#f6faff',backgroundColor:'#233747df',padding:{x:6,y:4},
        }).setOrigin(0.5).setDepth(25);
      // Nível 10 pode provocar centenas de pontos de dano por segundo.
      enemy.maxHp=finaleBossHp('wave10',this.combat);
      enemy.hp=enemy.maxHp;
      enemy.box?.setStrokeStyle(5,0xf4ffff);
    }

    if (type===5 && options.finalBoss && this.mode==='wave11') {
      const color=FINALE_COUNTRIES[options.bossCountry]?.color??0x6ee9ed;
      enemy.definition={...enemy.definition,color};
      enemy.box?.setFillStyle(color).setStrokeStyle(4,0xffffff);
      const name=options.bossCountry==='alien'?'FROTA ALIENÍGENA':
        (FINALE_COUNTRIES[options.bossCountry]?.name??'ALIADO');
      enemy.bossLabel=this.add.text(startX,startY-52,
        name+(options.bossCountry==='alien'?'':` — NÍVEL ${options.bossLevel}`),{
        fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',
        color:'#ffffff',backgroundColor:'#1d2232dc',padding:{x:5,y:3}
      }).setOrigin(0.5).setDepth(25);
      // O HP considera os aliados que não traíram, ANTES de qualquer
      // upgrade brasileiro recebido por repetir a Onda 11.
      const survivingChoices=this.campaign.choices.filter(id=>
        !this.finale.coalition.includes(id));
      const originalStats=v1CombatStats({choices:survivingChoices});
      const hp=finaleBossHp('wave11',originalStats,
        options.coalitionSize||1);
      enemy.maxHp=hp;
      enemy.hp=hp;
    }

    if (type === 1 && formationGroup?.kind === 'swarm') {
      enemy.phase = 'swarmDance';
      enemy.sprite.setVisible(false);
    } else if (type === 2 && formationGroup?.kind === 'tactical') {
      enemy.phase = 'tacticalManeuver';
    } else if (type === 1) {
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
    // Só teletransportes que aparecem já dentro da área de jogo precisam
    // de portal. Entradas pelas bordas continuam voando normalmente.

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

  // Duas transições de escudo por chefe; em grandes coalizões compartilhamos
  // um teto de três contra-ataques para não sobrecarregar a tela de 16 bits.
  queueFinaleCounterattack(enemy,phase) {
    if(!enemy.finalBoss || !['wave10','wave11'].includes(this.mode))return;
    const coalitionSize=this.finale?.coalition.length||1;
    const config=finaleCounterattack(this.mode,phase,coalitionSize);
    if(this.finaleCounterattackCount>=config.maxTriggers)return;
    const trigger=++this.finaleCounterattackCount;
    this.showAttackWarning(config.warning);
    this.time.delayedCall(660,()=>{
      if(this.tutorialComplete || !this.scene.isActive('GameScene') ||
        !this.enemies.some(unit=>unit.uid===enemy.uid))return;
      for(let i=0;i<config.fighters;i++){
        const side=config.fighters===1
          ? (trigger%2===0?'right':'left') : (i===0?'left':'right');
        this.spawnEnemy(4,{level:9,side});
      }
      if(config.bombers && this.enemies.length<44)
        this.spawnEnemy(3,{level:9});
    });
  }

  updateFinalCountryBoss(enemy,dt) {
    if(this.mode!=='wave11' || !enemy.finalBoss ||
      !enemy.bossCountry)return;
    enemy.finalAbilityAge+=dt;
    if(enemy.bossCountry==='alien'){
      // Full Brazil enfrenta uma frota alienígena própria, não um chefe
      // estrangeiro desprovido de poderes. Salva telegrafada e interceptável.
      if(enemy.finalAbilityAge>=8.5){
        enemy.finalAbilityAge-=8.5;
        this.showAttackWarning('FROTA ALIENÍGENA: SALVA ORBITAL!');
        this.time.delayedCall(580,()=>{
          if(this.tutorialComplete || !this.scene.isActive('GameScene') ||
            !this.enemies.some(unit=>unit.uid===enemy.uid))return;
          this.fireEnemyProjectile(enemy);
        });
      }
      return;
    }
    const interval=Math.max(5,9.0-Math.min(10,enemy.bossLevel)*0.48);
    if(enemy.finalAbilityAge<interval)return;
    enemy.finalAbilityAge-=interval;
    enemy.finalAbilityCount++;
    const country=enemy.bossCountry,level=enemy.bossLevel;
    if(this.time.now-this.lastFinaleWarningAt>1750){
      const warning={us:'ATAQUE EXTRA: CHOQUE E PAVOR!',
        ru:'GEADA SIBERIANA NO CANHÃO!',
        cn:'PACOTES EXPLOSIVOS A CAMINHO!',
        jp:'HOLOFOTES HOSTIS — ATENÇÃO!'};
      this.showAttackWarning(warning[country]);
      this.lastFinaleWarningAt=this.time.now;
    }
    if(country==='us') {
      // Maior nível de ajuda recebido = maior salva extra de mísseis.
      for(let i=0;i<1+Math.floor(level/3);i++)
        this.fireEnemyProjectile(enemy);
    } else if(country==='ru'){
      // O frio atrapalha as armas brasileiras por uma janela curta.
      this.cannonFrozenUntil=Math.max(this.cannonFrozenUntil,
        this.elapsed+750+level*80);
      const fog=this.add.circle(CANNON.x,CANNON.y-18,72,0x8ee7ff,0.27)
        .setStrokeStyle(2,0xffffff,0.64).setDepth(62);
      this.tweens.add({targets:fog,alpha:0,scale:1.35,duration:700,
        onComplete:()=>fog.destroy()});
    } else if(country==='cn'){
      const spawned=enemy.finalAbilityCount*2;
      if(spawned<=8){
        const count=Math.min(3,1+Math.ceil(level/4));
        for(let i=0;i<count;i++)this.spawnEnemy(1,{
          level:9,x:enemy.sprite.x+(i-(count-1)/2)*48,
          y:enemy.sprite.y+40,sourceBossId:enemy.uid,
        });
      }
    } else if(country==='jp'){
      // Raio rosa telegráfico: só causa dano depois do aviso visual.
      const laser=this.add.graphics().setDepth(65);
      laser.lineStyle(3,0xf0a7ff,0.8);
      laser.lineBetween(enemy.sprite.x,enemy.sprite.y,CANNON.x,CANNON.y);
      this.time.delayedCall(620,()=>{
        laser.destroy();
        if(this.tutorialComplete || !enemy.sprite.active)return;
        const flash=this.add.graphics().setDepth(65);
        flash.lineStyle(9,0xffa6ed,0.85);
        flash.lineBetween(enemy.sprite.x,enemy.sprite.y,CANNON.x,CANNON.y);
        this.damageCannon(5+level*0.8);
        this.tweens.add({targets:flash,alpha:0,duration:180,
          onComplete:()=>flash.destroy()});
      });
    }
  }

  // Exibição do caça, separada de sua rota/hitbox. Não altera a IA Tipo 4.
  updateType4Appearance(enemy,previousX,previousY,dt) {
    const sprite=enemy.sprite;
    if (enemy.type!==4 || sprite.texture?.key!=='tipo4_sheet')return;

    const now=this.time.now;
    // Preserva o quadro 10 pelo tempo inteiro do flash de dano.
    if(now-enemy.lastHitAt<160)return;

    const dx=(sprite.x-previousX)/Math.max(dt,0.001);
    const prior=enemy.type4Pose??'tipo4_voo';
    let next=prior;

    switch(enemy.phase){
      case 'flyby':
        // O caça cruza a tela de LADO. Os frames de dash têm grandes
        // rastros laranja, então não devem se repetir durante o voo lateral.
        next=enemy.direction<0?'tipo4_banco_esquerda':'tipo4_banco_direita';
        break;
      case 'swoop1':
      case 'swoop2':
        // Histerese: só vira quando a curva tem velocidade lateral clara.
        // Entre 45 e 105 px/s mantém a pose anterior, sem ficar oscilando.
        if(dx>105)next='tipo4_banco_direita';
        else if(dx < -105)next='tipo4_banco_esquerda';
        else if(Math.abs(dx)<45)next='tipo4_propulsao';
        // Dash curto apenas no começo da investida rápida, não no flyby.
        if(enemy.phase==='swoop2' && enemy.phaseAge<0.24 &&
          Math.abs(dx)>150)next='tipo4_dash';
        break;
      case 'laser':
        next='tipo4_propulsao';
        break;
      case 'telegraph':
      default:
        next='tipo4_voo';
        break;
    }

    // Trocas de pose ficam travadas por 140 ms, mesmo com curvas rápidas.
    // A recuperação do hit pode reimpor o quadro correto após o flash.
    const recovering=Boolean(enemy.type4NeedsRestore);
    if(next!==prior && !recovering && now<(enemy.type4PoseLockUntil??0))
      return;
    if(next===prior && !recovering)return;

    enemy.type4Pose=next;
    enemy.type4PoseLockUntil=now+140;
    enemy.type4NeedsRestore=false;
    if(next==='tipo4_banco_esquerda' || next==='tipo4_banco_direita'){
      sprite.anims.stop();
      sprite.setFrame(next==='tipo4_banco_esquerda'?3:2);
    }else{
      // Não reinicia a animação de loop todo frame.
      sprite.play(next,true);
    }
    // As poses laterais têm arte nativa. Só o dash, desenhado para a
    // direita, precisa de espelhamento ao avançar para a esquerda.
    sprite.setFlipX(next==='tipo4_dash' && dx<0);
  }

  updateEnemies(dt) {
    this.frostGraphics.clear();
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if(enemy.type===6){
        updateType6Encounter(this,enemy,dt);
        continue;
      }
      // Desfaz o deslocamento visual anterior para não interferir no percurso
      // calculado pela nave (incluindo curvas, voos rasantes e órbitas).
      const previousShock = enemy.shockOffset;
      // Remove o deslocamento do frame anterior ANTES de calcular a rota.
      // Hit shake e artilharia de choque permanecem efeitos independentes.
      const previousPull = enemy.russianPullOffset || {x:0,y:0};
      enemy.sprite.x -= previousShock.x + enemy.hitVisualOffsetX + previousPull.x;
      enemy.sprite.y -= previousShock.y + previousPull.y;
      if (enemy.frozenUntil > this.elapsed) {
        // A nave fica totalmente parada, inclusive contadores de ataques e rotas.
        enemy.hitVisualOffsetX = 0;
        enemy.shockOffset = {x:0,y:0,vx:0,vy:0};
        enemy.russianPullOffset = {x:0,y:0};
        this.frostGraphics.lineStyle(3,0x93ebff,0.85);
        this.frostGraphics.strokeCircle(enemy.sprite.x,enemy.sprite.y,enemyContactRadius(enemy.type)+8);
        this.frostGraphics.lineStyle(1,0xe2ffff,0.72);
        this.frostGraphics.strokeCircle(enemy.sprite.x,enemy.sprite.y,enemyContactRadius(enemy.type)+13);
        // Congelar não dá imunidade às explosões que já estejam ativas.
        this.hitEnemyWithBlast(i);
        continue;
      }
      const previousX = enemy.sprite.x;
      const previousY = enemy.sprite.y;
      enemy.age += dt;
      enemy.phaseAge += dt;
      // Últimos 10 s: cancelar toda coreografia, escolher defesa e atacar.
      if(/^wave[0-9]$/.test(this.mode)&&this.elapsed>=20000&&
        ['swarmDance','swarmHold','tacticalManeuver','tacticalHold','orbit','stage','formation'].includes(enemy.phase)){
        enemy.sprite.setVisible(true);
        enemy.sprite.y=Math.max(48,enemy.sprite.y);
        enemy.sprite.setRotation(0);
        const target=this.chooseDefenseTarget();
        enemy.target=target;
        enemy.phase='dive';enemy.phaseAge=0;
        this.assignInvaderTarget(enemy,target);
      }

      // O grupo conserva um alvo coletivo: se uma torre cai, TODO o
      // enxame/esquadrilha escolhe outra defesa ativa e recalcula sua rota.
      const group = enemy.formationGroup;
      if (group?.target?.kind === 'tower' && group.target.tower?.health <= 0) {
        const survivors = this.enemies.filter(unit => unit.formationGroup === group);
        const center = {
          x: survivors.reduce((sum, unit) => sum + unit.sprite.x, 0) / survivors.length,
          y: survivors.reduce((sum, unit) => sum + unit.sprite.y, 0) / survivors.length,
        };
        // Para o Tipo 2, mantém a continuidade do centro da formação
        // ao mudar a defesa, sem teletransportar a esquadrilha.
        if (group.kind === 'tactical' && group.attackStartAge !== null) {
          const first = survivors[0];
          const offset = tacticalFormationOffset(group.finalFormation, first.formationIndex, group.count);
          const current = tacticalAttackPosition(group, first.formationIndex,
            first.age - group.attackStartAge);
          group.attackOrigin = { x: current.x - offset.x, y: current.y - offset.y };
          group.attackStartAge = enemy.age;
        }
        group.target = this.chooseV035GroupTarget(group, center);
        if (group.kind === 'tactical' && group.attackOrigin && group.target) {
          group.attackDuration = Math.max(1.4, Math.hypot(
            group.target.x - group.attackOrigin.x,
            group.target.y - group.attackOrigin.y,
          ) / Math.max(90, enemy.speed));
        }
        for (const member of survivors) {
          member.target = group.target;
          if (member.phase === 'dive' && group.target)
            this.assignInvaderTarget(member, group.target);
        }
      } else if (enemy.target?.kind === 'tower' &&
                 enemy.target.tower?.health <= 0) {
        enemy.target = availableDefenseTargets(CANNON, this.supportTowers)[0];
        if (enemy.phase === 'dive') this.assignInvaderTarget(enemy, enemy.target);
      }

      if (enemy.phase === 'swarmDance') {
        if (enemy.age >= enemy.entryDelay) {
          enemy.sprite.setVisible(true);
          const danceAge = enemy.age - enemy.entryDelay;
          const pos = swarmDancePosition(group, enemy.formationIndex, danceAge);
          const emergence=Math.min(1,danceAge/0.75);
          enemy.sprite.setPosition(
            Phaser.Math.Linear(group.centerX,pos.x,emergence),
            Phaser.Math.Linear(group.portalY,pos.y,emergence));
          if (danceAge >= group.duration) {
            enemy.phase='swarmHold';
            enemy.phaseAge=0;
            enemy.sprite.setPosition(pos.x,pos.y);
          }
        }
      } else if (enemy.phase === 'swarmHold') {
        // Naves Tipo 1 pairam antes do mergulho e disparam um tiro visível.
        const pos=swarmDancePosition(group,enemy.formationIndex,group.duration);
        enemy.sprite.setPosition(pos.x,pos.y);
        // Onda 0: demora antes do primeiro disparo e tiros defasados por nave.
        // Outras ondas preservam integralmente a cadência original.
        const shotDelay=this.mode==='wave0'
          ? WAVE0_EASY_PACING.firstShotDelay+
            enemy.formationIndex*WAVE0_EASY_PACING.shotStagger
          : 0.40;
        if(!enemy.formationShotFired&&enemy.phaseAge>=shotDelay){
          enemy.formationShotFired=true;
          this.fireEnemyProjectile(enemy,{kind:'cannon',x:CANNON.x,y:CANNON.y});
        }
        if(enemy.phaseAge>=group.holdDuration){
            if (!group.target) {
              group.target = this.chooseV035GroupTarget(group,
                swarmDanceCenter(group, group.duration));
            }
            enemy.phase = 'dive';
            enemy.phaseAge = 0;
            this.assignInvaderTarget(enemy, group.target);
        }
      } else if (enemy.phase === 'tacticalManeuver') {
        // Inclinação da nave acompanha o giro; ao parar volta à vertical.
        const movingAge=Math.min(enemy.age,Math.max(0.5,group.duration-group.holdDuration));
        const angle=4*Math.PI*(movingAge/Math.max(0.5,group.duration-group.holdDuration));
        enemy.sprite.setRotation(enemy.age<group.duration-group.holdDuration
          ? Math.sin(angle)*0.30*group.direction : 0);
        const thruster=enemy.sprite.getData('thruster');
        if(thruster)thruster.setAlpha(0.6+0.4*Math.sin(this.time.now*0.018+enemy.formationIndex));
        const position = tacticalManeuverPosition(group, enemy.formationIndex, enemy.age);
        enemy.sprite.setPosition(position.x, position.y);
        if (enemy.age >= group.duration) {
          if (!group.target) {
            // Separação entre a manobra e a investida: todos atacam
            // a defesa com menor porcentagem de vida e escudo.
            const slot = tacticalFormationOffset(group.finalFormation, enemy.formationIndex, group.count);
            group.attackOrigin = { x: position.x - slot.x, y: position.y - slot.y };
            group.target = this.chooseV035GroupTarget(group, group.attackOrigin);
            group.attackStartAge = enemy.age;
            group.attackDuration = Math.max(1.4, Math.hypot(
              group.target.x - group.attackOrigin.x,
              group.target.y - group.attackOrigin.y,
            ) / Math.max(90, enemy.speed));
          }
          enemy.target = group.target;
          enemy.phase = 'tacticalHold';
          enemy.phaseAge = 0;
        }
      } else if(enemy.phase==='tacticalHold'){
        // Salva anunciada: esquadrilha Tipo 2 para no ar antes de atacar.
        enemy.sprite.setRotation(0);
        if(!group.shotWarning){
          group.shotWarning=true;
          this.showAttackWarning('SALVA TÁTICA! INTERCEPTE OS DISPAROS!');
        }
        if(!enemy.formationShotFired&&enemy.phaseAge>=0.65){
          enemy.formationShotFired=true;
          this.fireEnemyProjectile(enemy,{kind:'cannon',x:CANNON.x,y:CANNON.y});
          // Segunda ogiva da salva, em pequena defasagem.
          this.fireEnemyProjectile(enemy,{kind:'cannon',x:CANNON.x,y:CANNON.y});
        }
        if(enemy.phaseAge>=1.25){
          enemy.phase='tacticalAttack';enemy.phaseAge=0;
          group.attackStartAge=enemy.age;
        }
      } else if (enemy.phase === 'tacticalAttack') {
        enemy.sprite.setRotation(0);
        const thruster=enemy.sprite.getData('thruster');
        if(thruster)thruster.setAlpha(0.95);
        const attackAge = Math.max(0, enemy.age - group.attackStartAge);
        const position = tacticalAttackPosition(group, enemy.formationIndex, attackAge);
        enemy.sprite.setPosition(position.x, position.y);
        if (attackAge >= group.attackDuration) {
          this.removeEnemy(i);
          this.damageTarget(enemy.target, ENEMY_IMPACT_DAMAGE * (enemy.level > 1 ? 1.12 : 1));
          if (this.gameOver) return;
          continue;
        }
      } else if (enemy.phase === 'orbit') {
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
        if(enemy.type===2 && !enemy.formationShotFired&&enemy.phaseAge>=1.1){
          enemy.formationShotFired=true;
          this.fireEnemyProjectile(enemy,{kind:'cannon',x:CANNON.x,y:CANNON.y});
        }
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
          this.setRoute(enemy, enemy.sprite.x, 95);
        }
      } else if (enemy.phase === 'retreat') {
        // Retorno limitado ao céu visível: não foge por cima durante a onda.
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
        this.updateFinalCountryBoss(enemy,dt);
        // Nunca usa a idade anterior à chegada: o primeiro frame do boss
        // começa exatamente na última posição da fase de entrada.
        enemy.sprite.x = bossCruiseX(enemy.bossAnchorX, enemy.phaseAge);
        enemy.sprite.y = enemy.bossAnchorY + Math.sin(enemy.phaseAge * 1.05) * 10;
        enemy.shotTimer += dt;
        enemy.spawnTimer += dt;
        // Duas fases de fúria: mais salvas e escoltas abaixo de 70% e 35% HP.
        const phaseProfile=enemy.finalBoss
          ? finaleBossFirePattern(this.mode,this.finale?.coalition.length||1,
            enemy.finalAssaultPhase) : null;
        const interval=enemy.definition.shotInterval*
          (phaseProfile?.intervalMultiplier??1);
        if (enemy.shotTimer >= interval) {
          enemy.shotTimer = 0;
          this.fireEnemyProjectile(enemy);
        }
        if (enemy.spawnTimer >= enemy.definition.spawnInterval*
          (phaseProfile?.intervalMultiplier??1)) {
          enemy.spawnTimer = 0;
          const campaignMiniboss = ['wave8','wave9','wave10','wave11'].includes(this.mode);
          const liveMinions = campaignMiniboss
            ? this.enemies.filter((unit) => unit.sourceBossId === enemy.uid).length : 0;
          let count = campaignMiniboss
            ? minibossSummonCount(enemy.spawnedMinions, liveMinions,
              enemy.definition.spawnCount) : enemy.definition.spawnCount;
          if(enemy.finalBoss && this.mode==='wave11') {
            // A coalizão pode ter quatro chefes, mas nunca 24 escoltas simultâneas.
            const allMinions=this.enemies.filter(unit=>unit.sourceBossId!==null).length;
            count=Math.min(count,Math.max(0,10-allMinions));
          }
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
      // Vórtices congelados somam atração, com limite de velocidade e alcance.
      const radius = this.combat.russianAttractRadius || 0;
      let ax=0, ay=0;
      if (radius > 0) for (const frozen of this.enemies) {
        if (frozen === enemy || frozen.frozenUntil <= this.elapsed) continue;
        const dx=frozen.sprite.x-enemy.sprite.x;
        const dy=frozen.sprite.y-enemy.sprite.y;
        const d=Math.hypot(dx,dy);
        if(d>12 && d<radius) {
          const force=120*(1-d/radius);
          ax+=dx/d*force; ay+=dy/d*force;
        }
      }
      const pullSpeed=Math.hypot(ax,ay);
      const limit=pullSpeed>140?140/pullSpeed:1;
      const fade=pullSpeed?1:Math.exp(-dt*3);
      enemy.russianPullOffset={
        x:Phaser.Math.Clamp((previousPull.x+ax*limit*dt)*fade,-radius*0.8,radius*0.8),
        y:Phaser.Math.Clamp((previousPull.y+ay*limit*dt)*fade,-radius*0.8,radius*0.8),
      };
      enemy.sprite.x += enemy.russianPullOffset.x;
      enemy.sprite.y += enemy.russianPullOffset.y;
      // Tipo 3 usa os quadros 4–7 para fazer curvas e 0–3 para voar reto.
      if (enemy.type === 3 && enemy.sprite.texture?.key === 'tipo3_sheet') {
        const anim = enemy.sprite.anims;
        const bombing = anim.currentAnim?.key === 'tipo3_bombardeio' && anim.isPlaying;
        const hit = this.time.now - enemy.lastHitAt < 160;
        if (!bombing && !hit) {
          const dx = (enemy.sprite.x - previousX) / Math.max(dt,0.001);
          const frame = dx < -35 ? (dx < -90 ? 4 : 5)
            : dx > 35 ? (dx > 90 ? 7 : 6) : -1;
          if (frame >= 0) {
            if (enemy.type3BankFrame !== frame || anim.isPlaying) {
              anim.stop();
              enemy.sprite.setFrame(frame);
              enemy.type3BankFrame = frame;
            }
          } else if (enemy.type3BankFrame !== -1 || !anim.isPlaying) {
            enemy.type3BankFrame = -1;
            enemy.sprite.play('tipo3_voo');
          }
        }
      }
      this.updateType4Appearance(enemy,previousX,previousY,dt);
      this.updateEnemyHitVisual(enemy);
      enemy.bossLabel?.setPosition(enemy.sprite.x,enemy.sprite.y-52);

      // Bombas de pulso são barreiras: inimigos entram nelas durante o movimento.
      this.hitEnemyWithBlast(i);
    }
    // O gelo se espalha uma única vez por origem primária; alvos secundários
    // continuam congelados e atraindo, mas não infectam novas gerações.
    if(this.combat.russianSpreadRadius>0)
      for(const enemy of [...this.enemies])this.spreadRussianCold(enemy);
  }

  freezeRussianEnemy(enemy,durationMs,secondary=false) {
    return applyRussianFreeze(enemy,this.elapsed,durationMs,secondary);
  }

  spreadRussianCold(enemy,multiplier=1) {
    if(!this.combat.russianSpreadRadius || !enemy?.russianFrostPrimary)return;
    const radius=this.combat.russianSpreadRadius*multiplier;
    const targets=spreadRussianFrost(enemy,this.enemies,this.elapsed,
      enemy.russianFrostDurationMs||this.combat.russianFreezeMs,
      this.combat.russianSpreadRadius,multiplier);
    if(!targets.length)return;
    // Pulso de cristalização local e ligações rápidas aos contagiados.
    const g=this.add.graphics().setDepth(47);
    g.fillStyle(0x90ddf4,0.10).fillCircle(enemy.sprite.x,enemy.sprite.y,radius);
    g.lineStyle(2,0xbaf5ff,0.78).strokeCircle(enemy.sprite.x,enemy.sprite.y,radius);
    for(const target of targets){
      g.lineStyle(2,0xe9ffff,0.80).lineBetween(enemy.sprite.x,enemy.sprite.y,
        target.sprite.x,target.sprite.y);
      g.fillStyle(0xc4f5ff,0.35).fillCircle(target.sprite.x,target.sprite.y,12);
    }
    this.tweens.add({targets:g,alpha:0,duration:310,onComplete:()=>g.destroy()});
  }

  fireEnemyProjectile(enemy, target = this.chooseDefenseTarget()) {
    // Proteção de desempenho para o enxame Tipo 6 chinês e salvas de formação.
    // Preserva até 140 projéteis interceptáveis ao mesmo tempo na tela.
    if(this.enemyBullets.length>=140||this.tutorialComplete||!enemy.sprite.active)return;
    // A nave abre o compartimento de bombas ao disparar.
    if (enemy.type === 3 && enemy.sprite.texture?.key === 'tipo3_sheet') {
      enemy.sprite.play('tipo3_bombardeio', true);
    }
    const profile=enemy.finalBoss
      ? finaleBossFirePattern(this.mode,
        this.finale?.coalition.length||1,enemy.finalAssaultPhase) : null;
    const count=profile?.volleyCount??enemy.definition.volleyCount;
    for (let i = 0; i < count; i += 1) {
      // A versão II do bombardeiro dispara duas bombas das laterais,
      // que convergem para o mesmo escudo e podem ser abatidas separadamente.
      const x = enemy.sprite.x + (i - (count - 1) / 2) * 48;
      const y = enemy.sprite.y + enemy.definition.height / 2;
      const dx = target.x - x;
      const dy = target.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const projectile = this.add.rectangle(x,y,16.5,16.5,ENEMY_SHOT_COLOR)
        .setStrokeStyle(2,0xfff5bc).setDepth(28);
      const projectilePace=this.mode==='wave0'&&enemy.type===1
        ?WAVE0_EASY_PACING.bulletSpeedMultiplier:1;
      this.enemyBullets.push({
        sprite: projectile,
        hp: enemy.definition.shotHp ?? 1,
        target,
        damage:profile?.damage??(enemy.type<=2?14:ENEMY_BULLET_DAMAGE),
        radius:8.25,
        vx: dx / distance * 160*(profile?.speedMultiplier??1)*projectilePace,
        vy: dy / distance * 160*(profile?.speedMultiplier??1)*projectilePace,
      });
    }
  }

  updateEnemyBullets(dt) {
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const shot = this.enemyBullets[i];
      const previousX=shot.sprite.x,previousY=shot.sprite.y;
      shot.sprite.x += shot.vx * dt;
      shot.sprite.y += shot.vy * dt;
      if (this.specialBlasts.some((blast) => blastCatchesTarget(
        blast.x, blast.y, this.time.now - blast.bornAt,
        shot.sprite.x, shot.sprite.y, shot.radius??8,
      ))) {
        if(shot.colossal)detonateType6Bomb(this,shot);
        else this.removeEnemyBullet(i);
        continue;
      }
      const domeHit=shot.target?.kind==='cannon'&&this.shield>0&&
        cannonDomeIntercept(previousX,previousY,shot.sprite.x,shot.sprite.y);
      if(domeHit || Phaser.Math.Distance.Between(
        shot.sprite.x,shot.sprite.y,shot.target.x,shot.target.y,
      ) < Math.max(14,(shot.radius??8)+6)) {
        const reflected=this.reflectV1ShieldProjectile(shot);
        this.removeEnemyBullet(i);
        if(!reflected){
          if(shot.cryoImpact){
            this.shield=0; // Gelo russo rompe o escudo e impede disparos.
            this.cannonFrozenUntil=Math.max(this.cannonFrozenUntil,this.elapsed+2000);
          }else if(shot.frostMs){
            this.cannonFrozenUntil=Math.max(this.cannonFrozenUntil,this.elapsed+shot.frostMs);
          }
          if(shot.instantUnshielded){
            // Ogiva americana destrói imediatamente um canhão sem escudo.
            if(this.shield<=0)this.damageTarget(shot.target,1000);
            else {this.shield=0;this.damageTarget(shot.target,75);}
          }else this.damageTarget(shot.target,shot.damage??ENEMY_BULLET_DAMAGE);
        }
        if (this.gameOver) return;
      } else if (shot.sprite.y > H + 30 || shot.sprite.x < -30 || shot.sprite.x > W + 30) {
        this.removeEnemyBullet(i);
      }
    }
  }

  // v0.49: upgrades de escudo foram removidos. Projéteis causam dano
  // à cúpula universal, sem reflexos nem pulsos defensivos por país.
  reflectV1ShieldProjectile(_shot) { return false; }
  reactV1ShieldImpact() {}

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
    enemy.bossLabel?.destroy();
    enemy.sprite.destroy();
    this.enemies.splice(index, 1);
  }

  drawEnemyHealthBars() {
    const graphics = this.enemyHealthGraphics;
    graphics.clear();
    for (const enemy of this.enemies) {
      if(enemy.type===6){
        // Vida da fortaleza é comunicada por danos visuais, não barras.
        continue;
        if(!enemy.type6.coreExposed)continue;
        const width=234,x=enemy.sprite.x-width/2,y=enemy.sprite.y+72;
        const fraction=Math.max(0,enemy.type6.coreHp/enemy.type6.coreMaxHp);
        graphics.fillStyle(0x091019,0.95).fillRect(x-3,y-3,width+6,16);
        graphics.fillStyle(0xf66c75,0.96).fillRect(x,y,width*fraction,10);
        graphics.lineStyle(2,0xffffff,0.9).strokeRect(x-3,y-3,width+6,16);
        continue;
      }
      if (enemy.maxHp <= 1) continue;
      const width=enemy.finalBoss?175:
        Phaser.Math.Clamp(enemy.definition.width + 2,33,110);
      const x=Phaser.Math.Clamp(enemy.sprite.x-width/2,8,W-width-8);
      const y=enemy.sprite.y-enemy.definition.height/2-
        (enemy.finalBoss?41:15);
      graphics.fillStyle(0x061426, 0.95);
      graphics.fillRect(x - 2, y - 2, width + 4, enemy.finalBoss?12:8);
      const fraction=Math.max(0,Math.min(1,enemy.hp/enemy.maxHp));
      graphics.fillStyle(enemy.finalBoss?
        (fraction<=0.35?0xff6264:fraction<=0.70?0xffc96a:0x78e9dc)
        : enemy.level >= 3 ? enemy.definition.color
          : enemy.level > 1 ? 0xffc977 : 0x6df3ba,0.95);
      graphics.fillRect(x,y,width*fraction,enemy.finalBoss?8:4);
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
    } else if (enemy.type === 2) {
      // Phaser Container não implementa setTintFill/setTint/clearTint.
      enemy.sprite.setAlpha(reaction.flash ? 0.65 : 1);
    } else if (reaction.flash) {
      enemy.sprite.setTintFill(0xffffff);
    } else if (enemy.level > 1) {
      enemy.sprite.setTint(enemy.definition.tintColor);
    } else {
      enemy.sprite.clearTint();
    }
  }

  showEnemyDeath(enemy) {
    if (enemy.type === 4 && enemy.sprite.texture?.key === 'tipo4_sheet') {
      // O último quadro mostra a fragmentação antes da explosão padrão.
      const debris=this.add.sprite(enemy.sprite.x,enemy.sprite.y,'tipo4_sheet',11)
        .setDisplaySize(enemy.sprite.displayWidth,enemy.sprite.displayHeight)
        .setDepth(53).setRotation(enemy.sprite.rotation)
        .setFlipX(enemy.sprite.flipX);
      this.tweens.add({
        targets:debris,alpha:0,
        scaleX:debris.scaleX*1.22,scaleY:debris.scaleY*1.22,
        duration:230,onComplete:()=>debris.destroy(),
      });
    }
    if (enemy.type === 3 && enemy.sprite.texture?.key === 'tipo3_sheet') {
      // Último quadro da spritesheet sobre a explosão comum.
      const debris = this.add.sprite(enemy.sprite.x, enemy.sprite.y, 'tipo3_sheet', 11)
        .setDisplaySize(enemy.sprite.displayWidth, enemy.sprite.displayHeight)
        .setDepth(53).setRotation(enemy.sprite.rotation);
      this.tweens.add({
        targets: debris, alpha: 0, scaleX: debris.scaleX * 1.18,
        scaleY: debris.scaleY * 1.18, duration: 240,
        onComplete: () => debris.destroy(),
      });
    }
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
    if(enemy.type===6){
      if(damage>=100000){defeatType6(this,enemy);return true;}
      const first=type6AliveModules(enemy.type6)[0];
      const hitX=enemy.sprite.x+(first?.offsetX??0);
      const hitY=enemy.sprite.y;
      return hitType6At(this,enemy,hitX,hitY,damage,0,true).defeated;
    }
    if (showNumber) this.popHitNumber(enemy.sprite.x, enemy.sprite.y, damage, hitColor);
    enemy.hp -= damage;
    if(enemy.finalBoss && enemy.hp>0){
      const fraction=enemy.hp/enemy.maxHp;
      const phase=fraction<=0.35?3:fraction<=0.70?2:1;
      if(phase>enemy.finalAssaultPhase){
        enemy.finalAssaultPhase=phase;
        // Inimigos de assalto entram depois do aviso, nunca diretamente
        // sobre a defesa. Um único gatilho mesmo se o tiro cruzar 2 fases.
        this.queueFinaleCounterattack(enemy,phase);
      }
    }
    const killed = enemy.hp <= 0;
    if (killed) {
      // O gelo primário também estoura ao morrer, antes de remover a nave.
      if(enemy.russianFrostPrimary)this.spreadRussianCold(enemy,1.35);
      this.showEnemyDeath(enemy);
      this.removeEnemy(index);
      if (enemy.finalBoss && this.mode==='wave11')this.finaleBossesKilled++;
      if (!this.supremeFinishing && (
        (this.mode === 'wave10' && enemy.finalBoss) ||
        (this.mode === 'wave11' && enemy.finalBoss &&
          this.finaleBossesKilled>=this.finaleBossesNeeded)
      )) this.showWaveComplete('cleared');
    } else {
      enemy.lastHitAt = this.time.now;
      if (enemy.box) enemy.box.setFillStyle(0xffffff);
      else if (enemy.type === 2) enemy.sprite.setAlpha(0.65);
      else if (enemy.type === 3 && enemy.sprite.texture?.key === 'tipo3_sheet') {
        enemy.sprite.anims.stop();
        enemy.sprite.setFrame(10);
        enemy.sprite.setFlipX(false);
        this.time.delayedCall(160, () => {
          if (enemy.sprite.active && this.enemies.includes(enemy))
            enemy.sprite.play('tipo3_voo');
        });
      }
      else if (enemy.type === 4 && enemy.sprite.texture?.key === 'tipo4_sheet') {
        enemy.sprite.anims.stop();
        enemy.sprite.setFrame(10);
        enemy.sprite.setFlipX(false);
        enemy.type4NeedsRestore=true; // recupera a pose ao sair do flash
        enemy.type4PoseLockUntil=this.time.now+160;
      }
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
      : unlockedFirstUpgrades(this.combatCampaign);
  }

  showMuzzleFlash(angle, effects = shotVfxFor(this.activeUpgradeIds())) {
    const style = shotVisualFor(this.activeUpgradeIds());
    const x = CANNON.x + Math.cos(angle) * 34;
    const y = CANNON.y + Math.sin(angle) * 34;
    const flash = this.add.circle(
      x, y, effects.heavy ? 12 : effects.multiple ? 8 : 7,
      effects.cryogenic ? 0xb5f1ff : style.color,
      effects.cryogenic ? 0.58 : 0.92,
    ).setDepth(38);
    this.tweens.add({
      targets: flash, scale: effects.heavy ? 3.2 : 2.5, alpha: 0,
      duration: effects.heavy ? 180 : 145,
      onComplete: () => flash.destroy(),
    });

    if (effects.cryogenic) {
      // Exalação inicial do sopro: névoa fria, sem o clarão vermelho legado.
      const mist = this.add.graphics().setPosition(x, y).setDepth(39);
      const fx=Math.cos(angle), fy=Math.sin(angle);
      const sideX=-fy,sideY=fx;
      for(let i=0;i<4;i++){
        const d=9+i*8,side=(i%2?1:-1)*(3+i);
        mist.fillStyle(i%2?0xe5fbff:0x8bdcf0,0.34-i*0.055);
        mist.fillCircle(fx*d+sideX*side,fy*d+sideY*side,8+i*1.8);
      }
      this.tweens.add({targets:mist,alpha:0,scale:1.25,duration:190,
        onComplete:()=>mist.destroy()});
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
    if (this.tutorialComplete || this.countdownActive ||
      this.elapsed<this.cannonFrozenUntil)return;
    // Aceleração automática em ondas: aquece, sustenta o pico e desacelera.
    const heatCycle = 5200;
    const phase = (this.time.now % heatCycle) / heatCycle;
    const wave = phase < 0.36 ? phase / 0.36 : phase < 0.64 ? 1 : (1 - phase) / 0.36;
    const heat = this.combat.heat ? Math.max(0, wave) * (this.combat.brazilHeatPeak || 0.65) : 0;
    const turbo = this.time.now < (this.brazilTurboUntil || 0) ? this.combat.brazilTurboMultiplier : 1;
    if (this.time.now - this.lastBasicFire < this.combat.basicInterval / ((1 + heat) * turbo)) return;
    this.lastBasicFire = this.time.now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    const nextShot = this.basicShotCount + 1;
    if (this.isV1Campaign && this.combat.koreaContinuous) {
      this.basicShotCount=nextShot;
      // Não cria balas físicas: o Lightstick torna-se o disparo principal.
      this.fireLightstickBeam(angle,false);
      return;
    }
    // A alternância brasileira é aplicada à rajada INTEIRA; todos os
    // projéteis chineses continuam com seu spread simétrico em torno dela.
    const aimed = this.isV1Campaign ? angle
      : brazilAlternatingAngle(angle, nextShot, this.combat.brazilZigzag);
    const effects = shotVfxFor(this.activeUpgradeIds());
    // Dez tiros chineses permanecem numa abertura útil, não num leque de 100°.
    const count=this.combat.bulletsPerShot;
    const volleyAngles = this.isV1Campaign && count>3
      ? horizontalOffsets(count,0.065).map(offset=>Phaser.Math.Clamp(aimed+offset,-Math.PI+Math.PI/12,-Math.PI/12))
      : shotAngles(aimed,count);
    volleyAngles.forEach((firingAngle, index) => {
      const centerGlow = isChinaCenterProjectile(
        index, volleyAngles.length, effects.multiple,
      );
      const offset = this.isV1Campaign && this.combat.horizontalSpread
        ? (nextShot % 2 ? -1 : 1) * this.combat.horizontalSpread : 0;
      if (this.isV1Campaign) this.createProjectile(firingAngle, false, 0, effects, centerGlow, offset);
      else this.createProjectile(firingAngle, false, 0, effects, centerGlow);
      if (this.isV1Campaign && this.combat.extraBurstEvery && nextShot % this.combat.extraBurstEvery === 0) {
        this.createProjectile(firingAngle, false, 0, effects, false, offset + 7);
      }
    });
    this.basicShotCount = nextShot;
    // O laser coreano mantém a direção da mira original (a oscilação da
    // Gambiarra altera apenas as balas básicas, não a arma laser).
    if (this.combat.plasmaEvery > 0 && this.basicShotCount % (this.isV1Campaign ? this.combat.plasmaEvery * 2 : this.combat.plasmaEvery) === 0) {
      this.fireLightstickBeam(angle);
    }
    if (this.isV1Campaign && this.combat.missileEvery && nextShot % this.combat.missileEvery === 0) {
      const target = chooseTowerAttackTarget(CANNON.x, CANNON.y, this.enemies, 900);
      if (target) this.launchSpecialDrone(CANNON.x, CANNON.y - 36, 'cn');
    }
    this.showMuzzleFlash(aimed, effects);
  }

  fireLightstickBeam(angle, drawFlash = true) {
    const startX = CANNON.x + Math.cos(angle) * 32;
    const startY = CANNON.y + Math.sin(angle) * 32;
    let endX = startX + Math.cos(angle) * PLASMA_RANGE;
    let endY = startY + Math.sin(angle) * PLASMA_RANGE;
    const hit=hitDiscoGlobe(this.discoGlobes,startX,startY,endX,endY,this.elapsed,PLASMA_HALF_WIDTH);
    if(hit){
      endX=hit.x;endY=hit.y;
      this.fireV1DiscoReflections(hit.globe.x,hit.globe.y,hit.globe.build,hit.globe);
    }

    // A lâmina atravessa toda a linha do tiro, independentemente do HP.
    // Cada nave sofre dano uma única vez por pulso.
    const initialHitIds = new Set();
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if(enemy.type===6){
        hitType6Segment(this,enemy,startX,startY,endX,endY,
          this.isV1Campaign ? this.combat.laserDamage : PLASMA_DAMAGE,PLASMA_HALF_WIDTH);
        continue;
      }
      if (laserHitsTarget(
        startX, startY, endX, endY,
        enemy.sprite.x, enemy.sprite.y,
        PLASMA_HALF_WIDTH, enemyContactRadius(enemy.type),
      )) {
        initialHitIds.add(enemy.uid);
        this.impactInvader(i, this.isV1Campaign ? this.combat.laserDamage : PLASMA_DAMAGE, 0, '#e9aaff');
      }
    }
    for (let i = this.enemyBullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.enemyBullets[i];
      if (laserHitsTarget(
        startX, startY, endX, endY, bullet.sprite.x, bullet.sprite.y, PLASMA_HALF_WIDTH, bullet.radius??7,
      )) {
        if(bullet.colossal)detonateType6Bomb(this,bullet);
        else this.removeEnemyBullet(i);
      }
    }
    if (this.combat.residualSlash && drawFlash) {
      this.createResidualSlash(startX, startY, endX, endY, initialHitIds);
    }

    // O nível 10 desenha um único feixe persistente no update, sem centenas de tweens.
    if (!drawFlash) return;
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

  drawEncoreContinuousBeam(angle, active) {
    if(!this.koreanContinuousGraphics && active)
      this.koreanContinuousGraphics=this.add.graphics().setDepth(48);
    const beam=this.koreanContinuousGraphics;
    if(!beam)return;
    beam.clear();
    if(!active)return;
    const x=CANNON.x+Math.cos(angle)*32, y=CANNON.y+Math.sin(angle)*32;
    let tx=x+Math.cos(angle)*PLASMA_RANGE,ty=y+Math.sin(angle)*PLASMA_RANGE;
    const hit=hitDiscoGlobe(this.discoGlobes,x,y,tx,ty,this.elapsed,PLASMA_HALF_WIDTH);
    if(hit){tx=hit.x;ty=hit.y;}
    beam.lineStyle(24,0xa851ee,0.22);
    beam.lineBetween(x,y,tx,ty);
    beam.lineStyle(9,0xdc90ff,0.85);
    beam.lineBetween(x,y,tx,ty);
    beam.lineStyle(3,0xffffff,1);
    beam.lineBetween(x,y,tx,ty);
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
      if(enemy.type===6){
        hitType6At(this,enemy,x,y,COLLATERAL_DAMAGE,COLLATERAL_RADIUS);
        continue;
      }
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
      if(enemy.type===6){
        hitType6At(this,enemy,x,y,FRAGMENT_DAMAGE,FRAGMENT_RADIUS);
        continue;
      }
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


  // Explosões cinematográficas calculam dano de forma independente da quantidade de partículas.
  pulseV1Area(x, y, radius, damage, color, slow = false) {
    if (this.tutorialComplete) return;
    const ring = this.add.circle(x, y, radius, color, 0.23)
      .setStrokeStyle(4, 0xffffff, 0.78).setDepth(65).setScale(0.15);
    this.tweens.add({targets:ring, scale:1.15, alpha:0, duration:440,
      onComplete:()=>ring.destroy()});
    for (let i = this.enemies.length-1; i>=0; i--) {
      const e = this.enemies[i];
      if(e.type===6){
        hitType6At(this,e,x,y,damage,radius);
        continue;
      }
      if (Math.hypot(e.sprite.x-x,e.sprite.y-y) <= radius+enemyContactRadius(e.type)) {
        if (slow) e.electricSlowUntil=this.time.now+2400;
        this.impactInvader(i,damage,slow?0.25:0,'#'+color.toString(16).padStart(6,'0'));
      }
    }
  }

  supremeExpectedCode() {
    return {br:'REVEILLON',us:'FREEDOM',ru:'SPUTNIK',cn:'ENTREGA',kr:'ENCORE',jp:'ENCORE'}[this.combat.ultimate] || 'REVEILLON';
  }

  closeSupremeCode() {
    this.supremeTyping = false;
    this.supremePrompt?.destroy();
    this.supremePrompt = null;
  }

  openSupremeCode() {
    if (!this.isV1Campaign || !this.combat.ultimate || this.ultimateUsed || this.tutorialComplete || this.countdownActive || this.supremeCinematic || this.elapsed < this.waveDurationMs - 5000) return;
    this.supremeTyping = true;
    this.supremeCode = '';
    this.supremePrompt?.destroy();
    this.supremePrompt = this.add.text(W/2, H/2, `PROTOCOLO SUPREMO: ${this.supremeExpectedCode()}\\nDIGITE: _\\nBACKSPACE corrige • ESC cancela`, {
      fontFamily:'monospace',fontSize:'22px',fontStyle:'bold',color:'#ffeded',backgroundColor:'#690b19',align:'center',padding:{x:22,y:18}
    }).setOrigin(0.5).setDepth(300);
  }

  // Storyboards temporários: painéis estáticos, substituíveis por arte final.
  supremeStoryboard(country) {
    return {
      br:[['CORCOVADO','O CRISTO REDENTOR DESPERTA'],['DECOLAGEM','BRAÇOS ABERTOS. PROPULSORES ACESOS.'],['CÉU DO RIO','O CRISTO ATRAVESSA A FROTA'],['COPACABANA','FOGOS DE ARTIFÍCIO POR TODA PARTE'],['CORCOVADO','FELIZ ANO NOVO!']],
      us:[['ESQUADRÃO','FREEDOM IS COMING'],['BOMBARDEIRO LÍDER','O COMPARTIMENTO SE ABRE'],['CARGA ESPECIAL','UM MÍSSIL MAIOR QUE O AVIÃO'],['IMPACTO','ORÇAMENTO: CLASSIFICADO'],['MISSÃO CUMPRIDA','DEMOCRACIA ENTREGUE COM SUCESSO™']],
      ru:[['RIO DE JANEIRO','CANHÃO RECOLHIDO'],['CORTINA DE FERRO','CÚPULA PROTEGE TODA A CIDADE'],['ÓRBITA','SATÉLITE SOVIÉTICO EM POSIÇÃO'],['DISPARO ORBITAL','LASER VERMELHO VARRE O CÉU'],['RIO DE JANEIRO','CÚPULA RECOLHIDA. CIDADE SEGURA.']],
      cn:[['ENCOMENDA','UM PEQUENO DRONE NO ESPAÇO'],['ZOOM OUT','O DRONE É MAIOR QUE A TERRA'],['ENTREGA EXPRESSA','CONTÊINER SOBRE O RIO'],['ABERTURA','MILHARES DE DRONES SAEM DA CAIXA'],['CONFIRMAÇÃO','PEDIDO ENTREGUE COM SUCESSO!']],
      kr:[['RIO DE JANEIRO','PALCO SURGE NO CAMPO DE BATALHA'],['CLOSE','KIM LIN DOO — AO VIVO NO RIO'],['REFRÃO','LASERS SEGUEM A COREOGRAFIA'],['ENCORE','A FROTA ALIENÍGENA DESAPARECE'],['FINGER HEART','TURNÊ INTERGALÁCTICA CANCELADA']],
      jp:[['RIO DE JANEIRO','PALCO SURGE NO CAMPO DE BATALHA'],['CLOSE','KIM LIN DOO — AO VIVO NO RIO'],['REFRÃO','LASERS SEGUEM A COREOGRAFIA'],['ENCORE','A FROTA ALIENÍGENA DESAPARECE'],['FINGER HEART','TURNÊ INTERGALÁCTICA CANCELADA']],
    }[country] || [];
  }

  activateUltimate() {
    if (!this.isV1Campaign || this.tutorialComplete || this.countdownActive ||
      this.ultimateUsed || !this.combat.ultimate) return false;
    const country=this.combat.ultimate;
    const frames=this.supremeStoryboard(country);
    if (!frames.length) return false;
    this.ultimateUsed=true;
    this.supremeCinematic=true;
    this.supremeSlideIndex=0;
    const color=V1_SUPREMES[country]?.color || 0xffffff;
    const backdrop=this.add.rectangle(W/2,H/2,W,H,0x080e1c,1).setDepth(500);
    const border=this.add.rectangle(W/2,H/2,W-90,H-90,color,0.13)
      .setStrokeStyle(5,color).setDepth(501);
    const heading=this.add.text(W/2,H*0.27,'',{
      fontFamily:'monospace',fontSize:'36px',fontStyle:'bold',color:'#ffffff',align:'center'
    }).setOrigin(0.5).setDepth(502);
    const symbol=this.add.text(W/2,H*0.48,'★',{
      fontFamily:'monospace',fontSize:'92px',color:'#ffffff'
    }).setOrigin(0.5).setDepth(502);
    const caption=this.add.text(W/2,H*0.69,'',{
      fontFamily:'monospace',fontSize:'21px',fontStyle:'bold',color:'#ffe5a0',
      align:'center',wordWrap:{width:W-150}
    }).setOrigin(0.5).setDepth(502);
    const counter=this.add.text(W/2,H*0.83,'',{
      fontFamily:'monospace',fontSize:'13px',color:'#c4cbd7'
    }).setOrigin(0.5).setDepth(502);
    const objects=[backdrop,border,heading,symbol,caption,counter];
    const show=(index)=>{
      if(!this.scene.isActive('GameScene') || !this.supremeCinematic)return;
      const [title,description]=frames[index];
      heading.setText(title);
      caption.setText(description);
      symbol.setText(['★','◆','✦','✷','★'][index%5]);
      counter.setText(`SUPREMO — QUADRO ${index+1}/${frames.length} — PLACEHOLDER`);
      border.setFillStyle(color,index%2===0?0.13:0.24);
    };
    show(0);
    frames.slice(1).forEach((_,i)=>this.time.delayedCall((i+1)*1350,()=>show(i+1)));
    this.time.delayedCall(frames.length*1350,()=>{
      objects.forEach(object=>object.destroy());
      if(!this.scene.isActive('GameScene'))return;
      // Garante que os quadros acabem antes de encerrar a onda por morte do chefe.
      this.supremeFinishing=true;
      for(let i=this.enemies.length-1;i>=0;i--){
        this.impactInvader(i,1000000,0,'#ffffff',false);
      }
      this.supremeFinishing=false;
      this.supremeCinematic=false;
      if((this.mode==='wave10'||this.mode==='wave11')&&!this.tutorialComplete)
        this.showWaveComplete('cleared');
    });
    return true;
  }

  shootSpecial(pointer) {
    if (this.tutorialComplete || this.countdownActive || this.supremeTyping ||
      this.supremeCinematic || this.elapsed<this.cannonFrozenUntil)return;
    if (this.time.now - this.lastSpecialFire < this.combat.specialCooldown) return;
    const target=specialTargetPoint(CANNON.x,CANNON.y,pointer.x,pointer.y);
    this.lastSpecialFire=this.time.now;
    if (this.isV1Campaign && this.combat.brazilTurboMultiplier>1)
      this.brazilTurboUntil=this.time.now+5000;
    const shot=this.createProjectile(target.angle,true,target.distance);
    const build=this.isV1Campaign ? this.specialBuild : null;
    if(build?.primary && shot) {
      shot.hybridConfig=build;
      shot.hybridDestination={x:target.x,y:target.y};
      const color=specialPalette(build.primary);
      if(shot.visual) {
        // Silhuetas simplificadas enquanto as sprites finais não existem.
        const markers={br:'🎈',us:'🚀',ru:'❄',cn:'▣',jp:'✦'};
        shot.specialMarker=this.add.text(shot.sprite.x,shot.sprite.y,
          markers[build.primary]||'✦',{
          fontFamily:'monospace',fontSize:'22px',fontStyle:'bold',
          color:'#ffffff',stroke:'#0d1830',strokeThickness:3,
        }).setOrigin(0.5).setDepth(36);
        shot.sprite.setFillStyle(color);
        shot.sprite.setStrokeStyle(3,0xffffff,0.95);
        // Formato principal depende do PRIMEIRO país com especial desbloqueado.
        // EUA: a escala é literalmente 1×/2×/4×/8× do mesmo míssil enorme.
        // Como só existe um projétil especial, não precisamos limitar seu tamanho.
        const scale=build.primary==='us'?1.6*build.usMissileScale:
          build.primary==='cn'?1.7*build.cnDropScale:
          build.primary==='ru'?1.8:build.primary==='jp'?2:1.5;
        shot.sprite.setScale(build.primary==='us'?scale:Math.min(6,scale));
        if(build.primary==='us')shot.specialMarker.setScale(
          Math.min(5,Math.max(1,build.usMissileScale*0.7)));
      }
    }
    // Caminho do laboratório legado: não interferir nas árvores antigas.
    if(!this.isV1Campaign && this.fourthIds.includes('jp'))this.fireSpecialLaser(target);
  }

  // Cada ativação resolve um único projétil híbrido, em fases finitas.
  detonateV1HybridSpecial(x,y,build) {
    const {br,us,ru,cn,jp}=build.stages;
    // 1. Rússia congela primeiro e cria centros de atração para a detonação.
    if(ru) {
      const radius=Math.max(build.ruBurstRadius,build.cnDropRadius,build.usBlastRadius,65);
      for(const enemy of this.enemies) {
        if(Math.hypot(enemy.sprite.x-x,enemy.sprite.y-y)<=radius+enemyContactRadius(enemy.type))
          this.freezeRussianEnemy(enemy,build.ruFreezeMs);
      }
    }
    // 2. China distribui a CARGA do mesmo projétil, sem lançar drones auxiliares.
    if(cn) {
      const count=build.cnPayloads;
      for(let i=0;i<count;i++){
        const angle=-Math.PI/2+(i-1)*Math.PI*2/Math.max(3,count-1);
        const offset=i===0?0:Math.min(95,build.cnDropRadius*0.8);
        const cx=x+Math.cos(angle)*offset,cy=y+Math.sin(angle)*offset;
        this.pulseV1Area(cx,cy,build.cnDropRadius,build.cnDamage,0xffd562);
      }
    }
    // 3. Explosão-base, fogos e estilhaços — cada país mantém seu dano próprio.
    if(br)this.createArraial(x,y);
    if(ru)this.detonateRussianMatryoshka(x,y,build);
    if(us) {
      const blastRadius=build.usBlastRadius,shockRadius=build.usShockRadius;
      for(let i=this.enemies.length-1;i>=0;i--){
        const enemy=this.enemies[i];
        const d=Math.max(0,Math.hypot(enemy.sprite.x-x,enemy.sprite.y-y)-enemyContactRadius(enemy.type));
        // O anel de choque só causa 50% do dano FORA da explosão principal.
        if(d<=blastRadius)this.impactInvader(i,build.usDamage,0,'#ffcc88');
        else if(d<=shockRadius)this.impactInvader(i,build.usDamage*0.5,0,'#ffca83');
      }
      this.drawV1SpecialPulse(x,y,blastRadius,0xffa54d);
    }
    // Sem componentes estrangeiros nem Arraial, preserva dano-base do especial.
    if(!br&&!us&&!ru&&!cn&&!jp)this.pulseV1Area(x,y,70,3,0x80e8ff);
    // 4. Coreia deixa um globo estacionário: cada tiro recebido gera uma salva.
    if(jp)this.createDiscoGlobe(x,y,build);
    // 5. Empurrão americano acontece por último e nunca causa dano adicional.
    if(us)this.pushV1EnemiesUp(x,y,build.usShockRadius,build.usPush);
  }

  drawV1SpecialPulse(x,y,radius,color) {
    const ring=this.add.circle(x,y,radius,color,0.14)
      .setStrokeStyle(3,color,0.85).setDepth(55).setScale(0.25);
    this.tweens.add({targets:ring,scale:1.15,alpha:0,duration:360,
      onComplete:()=>ring.destroy()});
  }

  // Matryoshka: estilhaços atingem outros congelados e iniciam uma nova detonação,
  // mas cada inimigo congelado pode explodir uma única vez por ativação.
  detonateRussianMatryoshka(x,y,build) {
    const alreadyBurst=new Set();
    const queue=this.enemies.filter(enemy=>enemy.frozenUntil>this.elapsed &&
      Math.hypot(enemy.sprite.x-x,enemy.sprite.y-y)<build.ruBurstRadius+enemyContactRadius(enemy.type))
      .map(enemy=>({uid:enemy.uid,x:enemy.sprite.x,y:enemy.sprite.y}));
    if(!queue.length)this.pulseV1Area(x,y,build.ruBurstRadius,build.ruDamage,0x8ce6ff);
    const visuals=this.add.graphics().setDepth(57);
    let drawn=0;
    while(queue.length) {
      const pending=queue.shift(),uid=pending.uid;
      if(alreadyBurst.has(uid))continue;
      // Preserva a detonação mesmo se um estilhaço já matou o alvo congelado.
      const frozen=this.enemies.find(enemy=>enemy.uid===uid);
      alreadyBurst.add(uid);
      const bx=frozen?.sprite.x ?? pending.x,by=frozen?.sprite.y ?? pending.y;
      if(drawn++<16) {
        visuals.lineStyle(2,0x9eeeff,0.8);
        visuals.strokeCircle(bx,by,Math.min(28,build.ruBurstRadius*0.5));
      }
      const damaged=new Set();
      for(let ray=0;ray<build.ruShards;ray++) {
        const angle=Math.PI*2*ray/build.ruShards;
        const length=build.ruBurstRadius*1.4;
        const tx=bx+Math.cos(angle)*length,ty=by+Math.sin(angle)*length;
        if(drawn<=16) {
          visuals.lineStyle(1.5,0xd7faff,0.68);
          visuals.lineBetween(bx,by,tx,ty);
        }
        for(const enemy of [...this.enemies]){
          if(enemy.uid===uid||damaged.has(enemy.uid))continue;
          if(!segmentHitsCircle(bx,by,tx,ty,enemy.sprite.x,enemy.sprite.y,
            enemyContactRadius(enemy.type)+5))continue;
          damaged.add(enemy.uid);
          const stillFrozen=enemy.frozenUntil>this.elapsed;
          const index=this.enemies.findIndex(e=>e.uid===enemy.uid);
          if(index>=0)this.impactInvader(index,build.ruDamage,0,'#b4f1ff',false);
          if(stillFrozen&&!alreadyBurst.has(enemy.uid))
            queue.push({uid:enemy.uid,x:enemy.sprite.x,y:enemy.sprite.y});
        }
      }
      const selfIndex=this.enemies.findIndex(enemy=>enemy.uid===uid);
      if(selfIndex>=0)this.impactInvader(selfIndex,build.ruDamage,0,'#b4f1ff',false);
    }
    this.tweens.add({targets:visuals,alpha:0,duration:380,
      onComplete:()=>visuals.destroy()});
  }

  createDiscoGlobe(x,y,build) {
    const graphics=this.add.graphics().setDepth(56);
    const label=this.add.text(x,y+40,'4.0s',{
      fontFamily:'monospace',fontSize:'11px',color:'#f5caff',
      stroke:'#160d28',strokeThickness:3,
    }).setOrigin(0.5).setDepth(57);
    this.discoGlobes.push({x,y,build,graphics,label,
      expiresAt:this.elapsed+DISCO_DURATION_MS,lastVisualAt:-Infinity});
    this.updateDiscoGlobes();
  }

  updateDiscoGlobes() {
    for(let i=this.discoGlobes.length-1;i>=0;i--){
      const globe=this.discoGlobes[i];
      if(this.elapsed>=globe.expiresAt){
        globe.graphics.destroy();globe.label.destroy();this.discoGlobes.splice(i,1);continue;
      }
      const g=globe.graphics,r=DISCO_RADIUS;
      g.clear();
      g.fillStyle(0xc452ef,0.16);g.fillCircle(globe.x,globe.y,r+7);
      g.fillStyle(0x563778,0.95);g.fillCircle(globe.x,globe.y,r);
      g.lineStyle(2,0xf8d9ff,0.95);g.strokeCircle(globe.x,globe.y,r);
      // Facetas retangulares com brilho móvel: silhueta de bola de discoteca.
      for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){
        if(row*row+col*col>5)continue;
        const lit=(row+col+Math.floor(this.elapsed/130))%4===0;
        g.fillStyle(lit?0xffffff:0xc58ce8,lit?0.95:0.5);
        g.fillRect(globe.x+col*9-3,globe.y+row*9-3,6,6);
      }
      globe.label.setText(((globe.expiresAt-this.elapsed)/1000).toFixed(1)+'s');
    }
  }

  fireV1DiscoReflections(x,y,build,globe) {
    // Agrega apenas o desenho em cadência alta, preservando cada raio/dano.
    const show=!globe||this.elapsed-globe.lastVisualAt>=80;
    const g=show?this.add.graphics().setDepth(58):null;
    if(globe&&show)globe.lastVisualAt=this.elapsed;
    const targets=[...this.enemies].sort((a,b)=>
      Math.hypot(a.sprite.x-x,a.sprite.y-y)-Math.hypot(b.sprite.x-x,b.sprite.y-y));
    let cursor=0;
    for(let ray=0;ray<build.krReflections;ray++){
      const liveIds=new Set(this.enemies.map(e=>e.uid));
      const alive=targets.filter(t=>liveIds.has(t.uid));
      if(!alive.length)break;
      const target=alive[cursor++%alive.length];
      if(g && ray<8){
        // No limite de 24 reflexos, desenha até oito linhas por pulso.
        // Os demais reflexos mantêm seu dano; evita congelar a onda 11.
        g.lineStyle(ray%2?2:3,ray%3===0?0xffffff:0xe69aff,0.72);
        g.lineBetween(x,y,target.sprite.x,target.sprite.y);
      }
      const index=this.enemies.findIndex(enemy=>enemy.uid===target.uid);
      if(index>=0){
        if(build.stages.ru)this.freezeRussianEnemy(target,build.ruFreezeMs);
        this.impactInvader(index,build.krReflectDamage,0,'#f1baff',false);
      }
    }
    if(g)this.tweens.add({targets:g,alpha:0,duration:180,onComplete:()=>g.destroy()});
  }

  pushV1EnemiesUp(x,y,radius,strength) {
    for(const enemy of this.enemies){
      const d=Math.hypot(enemy.sprite.x-x,enemy.sprite.y-y);
      if(d>radius+enemyContactRadius(enemy.type))continue;
      // Offset físico-visual vertical em direção à origem alienígena (topo).
      enemy.shockOffset.vy=Math.min(enemy.shockOffset.vy||0,-strength);
      if(enemy.phase==='dive')
        enemy.recoilSpeed=applyRecoilImpulse(enemy.recoilSpeed,strength,420);
    }
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
      if(enemy.type===6){
        hitType6Segment(this,enemy,originX,originY,target.x,target.y,2,9);
        continue;
      }
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
    const aim=type6AimPosition(target);
    const dx = aim.x - x;
    const dy = aim.y - y;
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

  createProjectile(angle, special, distance = 0, effects = null, centerGlow = false, offsetX = 0, generation = 0, origin = null) {
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const x = (origin?.x ?? CANNON.x + vx * 29) + offsetX;
    const y = origin?.y ?? CANNON.y + vy * 29;
    const style = shotVisualFor(this.activeUpgradeIds());
    if (this.isV1Campaign && this.combat.transformed === 'br') style.color = 0x55e99e;
    if (this.isV1Campaign && this.combat.transformed === 'cn') style.color = centerGlow ? 0xffe56a : 0xff5651;
    if (this.isV1Campaign && this.combat.transformed === 'ru') style.color = 0x8beaff;
    const vfx = special ? null : (effects ?? shotVfxFor(this.activeUpgradeIds()));
    // Somente a representação gráfica é limitada. Balas invisíveis continuam com física e dano.
    const visible = special || this.visibleProjectileCount < MAX_VISUAL_PROJECTILES;
    if (visible) this.visibleProjectileCount += 1;
    const dot = !visible ? {x, y, destroy(){}} : special
      ? this.add.circle(x, y, 8, 0x72eaf8).setDepth(35)
      : vfx?.cryogenic
        ? this.add.circle(x, y, style.width * 0.6, style.color, 0.30)
          .setStrokeStyle(1,0xf0ffff,0.34).setDepth(35)
        : this.add.rectangle(x, y, style.width, style.length, style.color)
          .setStrokeStyle(centerGlow ? 2 : 1, 0xffffff, centerGlow ? 0.95 : 0.65)
          .setRotation(angle + Math.PI / 2)
          .setDepth(35);
    const speed = special ? 300 : this.combat.basicSpeed;
    // Uma única Graphics por bala, redesenhada enquanto ela se move.
    // Sem gerar partículas novas a cada frame (essencial com 3+ tiros).
    const trail = visible && vfx && (vfx.heavy || vfx.multiple)
      ? this.add.graphics().setDepth(34) : null;
    const bullet = {
      sprite: dot,
      visual: visible,
      generation,
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
      distanceTravelled:0,
      usGrowthMax:!special ? (this.combat.usGrowthMax || 1) : 1,
      usRadius:7,
      chinaSplit:!special && generation===0 && this.combat.chinaSplitCount>1,
    };
    this.projectiles.push(bullet);
    this.drawProjectileTrail(bullet);
    return bullet;
  }

  drawProjectileTrail(bullet) {
    const gfx = bullet.trail;
    if (!gfx) return;
    const { x, y } = bullet.sprite;
    const length = Math.hypot(bullet.vx, bullet.vy) || 1;
    const dx = bullet.vx / length;
    const dy = bullet.vy / length;
    gfx.clear();
    if (bullet.vfx.cryogenic) {
      // 5 volutas por projétil; nenhuma partícula nova por frame.
      const sidewaysX=-dy,sidewaysY=dx;
      for(let i=0;i<5;i++){
        const d=8+i*10;
        const sway=Math.sin(bullet.distanceTravelled*0.033+i*2.35)*(3+i*1.2);
        const px=x-dx*d+sidewaysX*sway;
        const py=y-dy*d+sidewaysY*sway;
        gfx.fillStyle(i%2?0xd9f8ff:0x80cce9,0.40-i*0.055);
        gfx.fillCircle(px,py,7+i*1.7);
        if(i%2===0){
          gfx.fillStyle(0xf1fdff,0.70-i*0.10);
          gfx.fillRect(px-1.5,py-1.5,3,3);
        }
      }
      gfx.fillStyle(0xffffff,0.58).fillCircle(x,y,3.3);
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
    if (this.isV1Campaign && v1CountryLevels(this.combatCampaign).br >= 2) {
      this.createArraial(x, y);
      return;
    }
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


  createArraial(x, y) {
    const graphics = this.add.graphics().setDepth(39);
    const nucleus = {x, y, graphics, bornAt:this.time.now,
      events:fireworkSchedule(this.combat.brazilFireworkCount || ARRAIAL.fireworkCount), next:0, finished:false};
    this.arraialNuclei.push(nucleus);
    this.firePulse={bornAt:this.time.now,hits:new Set()};
  }

  arraialDamage(x, y, radius, amount, color) {
    // Iteração reversa preserva índices quando inimigos morrem.
    for(let i=this.enemies.length-1;i>=0;i--){
      const enemy=this.enemies[i];
      if(enemy.type===6){hitType6At(this,enemy,x,y,amount,radius);continue;}
      if(withinBlast(x,y,enemy.sprite.x,enemy.sprite.y,enemyContactRadius(enemy.type),radius))
        this.impactInvader(i,amount,0,color);
    }
  }

  arraialFirework(x, y, hue, damaging = true) {
    if(damaging) this.arraialDamage(x,y,ARRAIAL.fireworkRadius,ARRAIAL.fireworkDamage,'#ffe8b7');
    // Uma única Graphics em posição fixa; desenhamos o crescimento local a cada frame.
    // Não usar scale/tweens nem coordenadas mundiais dentro da Graphics:
    // isso causava deslocamento visual em direção ao canto inferior direito.
    const gfx=this.add.graphics().setPosition(x,y).setDepth(46);
    const palette=[0xffe36b,0xff576a,0x60ffaf,0x69d4ff,0xf5a0f9];
    const color=palette[hue%palette.length];
    const started=this.time.now;
    const duration=570;
    const paint=()=>{
      if(!gfx.active)return;
      const t=Math.min(1,(this.time.now-started)/duration);
      const radius=3+25*Math.sin(Math.PI*Math.min(1,t*0.92));
      const fade=1-t*t;
      gfx.clear();
      gfx.fillStyle(color,0.25*fade);gfx.fillCircle(0,0,radius+9);
      gfx.fillStyle(0xfff8d6,0.78*fade);gfx.fillCircle(0,0,Math.max(1,7*(1-t)));
      for(let k=0;k<12;k++){
        const angle=k*Math.PI/6;
        const outer=radius*(k%2===0?1:0.82);
        gfx.lineStyle(k%2===0?3:2,k%3===0?0xffffff:color,fade);
        gfx.lineBetween(Math.cos(angle)*Math.max(2,outer*0.28),
          Math.sin(angle)*Math.max(2,outer*0.28),
          Math.cos(angle)*outer,Math.sin(angle)*outer);
        gfx.fillStyle(k%2===0?0xfff4bc:color,fade);
        gfx.fillCircle(Math.cos(angle)*outer,Math.sin(angle)*outer,2.6);
      }
    };
    paint();
    this.time.addEvent({delay:32,repeat:Math.ceil(duration/32),callback:()=>{
      if(!gfx.active)return;
      if(this.time.now-started>=duration){gfx.destroy();return;}
      paint();
    }});
  }

  updateArraial() {
    for(let i=this.arraialNuclei.length-1;i>=0;i--){
      const n=this.arraialNuclei[i], age=this.time.now-n.bornAt;
      while(n.next<n.events.length && age>=n.events[n.next].at){
        const f=n.events[n.next];
        this.arraialFirework(n.x+f.x,n.y+f.y,n.next,f.damaging);
        n.next++;
      }
      if(age>=ARRAIAL.duration){
        this.arraialDamage(n.x,n.y,ARRAIAL.finaleRadius,ARRAIAL.finaleDamage,'#fff2aa');
        // Clarão final mais expressivo, também ancorado no balão sem escala.
        const finale=this.add.graphics().setPosition(n.x,n.y).setDepth(48);
        const startFinal=this.time.now;
        const shades=[0xffe46b,0xff6b72,0x6df5af,0x9bcbff,0xf2a4ff];
        const paintFinal=()=>{
          if(!finale.active)return;
          const t=Math.min(1,(this.time.now-startFinal)/680);
          const fade=1-t*t;
          const radius=8+(ARRAIAL.finaleRadius-8)*t;
          finale.clear();
          finale.fillStyle(0xffefaf,0.22*fade);finale.fillCircle(0,0,radius);
          for(let ring=0;ring<3;ring++){
            finale.lineStyle(4,shades[ring],fade);
            finale.strokeCircle(0,0,radius*(0.5+ring*0.24));
          }
          for(let k=0;k<20;k++){
            const angle=k*Math.PI/10;
            finale.lineStyle(3,shades[k%shades.length],fade);
            finale.lineBetween(Math.cos(angle)*radius*0.35,Math.sin(angle)*radius*0.35,
              Math.cos(angle)*radius,Math.sin(angle)*radius);
          }
        };
        paintFinal();
        this.time.addEvent({delay:32,repeat:22,callback:()=>{
          if(!finale.active)return;
          if(this.time.now-startFinal>=680){finale.destroy();return;}
          paintFinal();
        }});
        n.graphics.destroy(); this.arraialNuclei.splice(i,1);
        continue;
      }
      const g=n.graphics;g.clear();
      // Balão junino em pixel-art geométrica, núcleo luminoso, cordão e boca.
      const pulse=0.6+0.4*Math.sin(age*0.008);
      g.fillStyle(0xffdf69,0.19*pulse);g.fillCircle(n.x,n.y,22);
      g.fillStyle(0xdb544b,1);g.fillTriangle(n.x,n.y-18,n.x-12,n.y-7,n.x+12,n.y-7);
      g.fillStyle(0xf6b948,1);g.fillTriangle(n.x-12,n.y-7,n.x+12,n.y-7,n.x,n.y+12);
      g.lineStyle(2,0xffeb98,0.95);g.lineBetween(n.x,n.y-17,n.x,n.y+12);
      g.fillStyle(0xffedb2,pulse);g.fillCircle(n.x,n.y-1,4);
      g.lineStyle(1,0xeeb979,0.9);g.lineBetween(n.x,n.y+12,n.x,n.y+20);
    }
  }

  updateArraialFlames() {
    if(!this.isV1Campaign || v1CountryLevels(this.combatCampaign).br<2 || this.shield<=0) return;
    if(this.firePulse){
      const elapsed=this.time.now-this.firePulse.bornAt;
      if(elapsed>=ARRAIAL.firePulseDuration) this.firePulse=null;
      else {
        const radius=firePulseRadius(elapsed);
        for(let i=this.enemies.length-1;i>=0;i--){
          const enemy=this.enemies[i];
          if(this.firePulse.hits.has(enemy.uid))continue;
          if(withinBlast(CANNON.x,CANNON.y+7,
            enemy.sprite.x,enemy.sprite.y,enemyContactRadius(enemy.type),radius)){
            this.firePulse.hits.add(enemy.uid);
            this.impactInvader(i,ARRAIAL.firePulseDamage,0,'#ffac50',false);
          }
        }
      }
    }
    if(this.time.now-this.lastFlameTick<ARRAIAL.flameInterval) return;
    this.lastFlameTick=this.time.now;
    for(let i=this.enemies.length-1;i>=0;i--){
      const enemy=this.enemies[i];
      if(withinFlame(CANNON.x,CANNON.y+7,
        ARRAIAL.fireRingRadius,enemy.sprite.x,enemy.sprite.y,
        enemyContactRadius(enemy.type),true))
        this.impactInvader(i,ARRAIAL.flameDamage,0,'#ffb85b',false);
    }
  }

  hitEnemyWithBlast(index) {
    const enemy = this.enemies[index];
    if (!enemy) return;
    if(enemy.type===6){
      for(const blast of this.specialBlasts){
        const radius=specialBlastRadius(this.time.now-blast.bornAt);
        const rects=type6TargetRects(enemy.type6,enemy.sprite.x,enemy.sprite.y);
        const targets=type6AreaTargets(enemy.type6,enemy.sprite.x,enemy.sprite.y,
          blast.x,blast.y,radius);
        for(const id of targets){
          const key=enemy.uid+':'+id;
          if(blast.hits.has(key))continue;
          const rect=rects.find(r=>r.id===id);
          if(!rect)continue;
          blast.hits.add(key);
          hitType6At(this,enemy,rect.x,rect.y,
            4*(this.isV1Campaign?this.combat.specialAmplifier:1),0,true);
        }
      }
      return;
    }
    for (const blast of this.specialBlasts) {
      if (blast.hits.has(enemy.uid)) continue;
      if (!blastCatchesTarget(
        blast.x, blast.y, this.time.now - blast.bornAt,
        enemy.sprite.x, enemy.sprite.y, enemyContactRadius(enemy.type),
      )) continue;
      blast.hits.add(enemy.uid);
      // Cada explosão pode atingir o mesmo alvo uma única vez.
      // Naves grandes recebem dano, não morrem instantaneamente.
      this.impactInvader(index, (enemy.type === 5 ? 4 : 3) * (this.isV1Campaign ? this.combat.specialAmplifier : 1), 0, '#a8faff');
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

  explodeAmericanPrimary(x,y,primaryId,damage,radius) {
    // O alvo direto já recebeu o dano: onda secundária atinge apenas outros.
    const flash=this.add.circle(x,y,radius,0xffca65,0.27)
      .setStrokeStyle(3,0xffffff,0.7).setDepth(52);
    this.tweens.add({targets:flash,scale:1.35,alpha:0,duration:210,
      onComplete:()=>flash.destroy()});
    for(let k=this.enemies.length-1;k>=0;k--){
      const other=this.enemies[k];
      if(other.type===6){
        // A onda do projétil americano alcança outros módulos, além do alvo
        // direto; o componente atingido pela bala não recebe o mesmo dano 2x.
        const direct=type6PointTarget(other.type6,other.sprite.x,other.sprite.y,x,y,0);
        const targets=type6AreaTargets(other.type6,other.sprite.x,other.sprite.y,x,y,radius);
        const rects=type6TargetRects(other.type6,other.sprite.x,other.sprite.y);
        for(const id of targets){
          if(id===direct&&other.uid===primaryId)continue;
          const rect=rects.find(rect=>rect.id===id);
          if(rect)hitType6At(this,other,rect.x,rect.y,damage*0.5,0,true);
        }
        continue;
      }
      if(other.uid===primaryId)continue;
      if(Math.hypot(other.sprite.x-x,other.sprite.y-y)<=radius+enemyContactRadius(other.type))
        this.impactInvader(k,damage*0.5,0,'#ffce87',false);
    }
  }

  updatePlayerProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const bullet = this.projectiles[i];
      if(bullet.special && bullet.hybridConfig?.primary==='us' && this.enemies.length) {
        // Choque e Pavor: míssil guiado procura uma nave perto do ponto visado.
        const candidates=this.enemies.filter(e=>
          Math.hypot(e.sprite.x-bullet.hybridDestination.x,
            e.sprite.y-bullet.hybridDestination.y)<230);
        const tracked=candidates.reduce((best,e)=>{
          const d=Math.hypot(e.sprite.x-bullet.sprite.x,e.sprite.y-bullet.sprite.y);
          return !best||d<best.d?{enemy:e,d}:best;
        },null);
        if(tracked){
          const target=tracked.enemy;
          bullet.tx=target.sprite.x;
          bullet.ty=target.sprite.y;
          const angle=Math.atan2(bullet.ty-bullet.sprite.y,bullet.tx-bullet.sprite.x);
          const current=Math.atan2(bullet.vy,bullet.vx);
          const turn=Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(angle-current),-4*dt,4*dt);
          const speed=Math.hypot(bullet.vx,bullet.vy);
          bullet.vx=Math.cos(current+turn)*speed;
          bullet.vy=Math.sin(current+turn)*speed;
        }
      }
      if (!bullet.special && bullet.usGrowthMax>1 && this.combat.usHoming>0 && this.enemies.length) {
        // Curva angular limitada: o míssil americano persegue sem teletransportar.
        let nearest=null, nearestDist=Infinity;
        for(const target of this.enemies) {
          const d=Math.hypot(target.sprite.x-bullet.sprite.x,target.sprite.y-bullet.sprite.y);
          if(d<460 && d<nearestDist){nearest=target;nearestDist=d;}
        }
        if(nearest) {
          const desired=Math.atan2(nearest.sprite.y-bullet.sprite.y,nearest.sprite.x-bullet.sprite.x);
          const current=Math.atan2(bullet.vy,bullet.vx);
          const change=Phaser.Math.Angle.Wrap(desired-current);
          const turn=Phaser.Math.Clamp(change,-this.combat.usHoming*dt,this.combat.usHoming*dt);
          const speed=Math.hypot(bullet.vx,bullet.vy);
          bullet.vx=Math.cos(current+turn)*speed;
          bullet.vy=Math.sin(current+turn)*speed;
          if(bullet.visual)bullet.sprite.setRotation(current+turn+Math.PI/2);
        }
      }
      bullet.distanceTravelled+=Math.hypot(bullet.vx,bullet.vy)*dt;
      if(!bullet.special && bullet.usGrowthMax>1) {
        const scale=1+(bullet.usGrowthMax-1)*Math.min(1,bullet.distanceTravelled/300);
        bullet.usRadius=5.5*scale;
        if(bullet.visual)bullet.sprite.setScale(scale);
      }
      const previousX=bullet.sprite.x,previousY=bullet.sprite.y;
      bullet.sprite.x += bullet.vx * dt;
      bullet.sprite.y += bullet.vy * dt;
      if(bullet.specialMarker)bullet.specialMarker.setPosition(bullet.sprite.x,bullet.sprite.y);
      this.drawProjectileTrail(bullet);
      let remove = false;
      if(!bullet.special){
        const hit=hitDiscoGlobe(this.discoGlobes,previousX,previousY,
          bullet.sprite.x,bullet.sprite.y,this.elapsed,Math.max(7,bullet.usRadius||0));
        if(hit){
          this.fireV1DiscoReflections(hit.globe.x,hit.globe.y,hit.globe.build,hit.globe);
          remove=true;
        }
      }
      if(!remove && bullet.chinaSplit && bullet.distanceTravelled>=100){
        // Dez balas se dividem em vinte; filhos de geração 1 não se dividem.
        const originalAngle=Math.atan2(bullet.vy,bullet.vx);
        for(const offset of [-0.075,0.075]){
          const child=this.createProjectile(originalAngle+offset,false,0,bullet.vfx,
            bullet.centerGlow,0,bullet.generation+1,{x:bullet.sprite.x,y:bullet.sprite.y});
          child.damage=bullet.damage;
        }
        remove=true;
      }

      if (bullet.special && Phaser.Math.Distance.Between(
        bullet.sprite.x, bullet.sprite.y, bullet.tx, bullet.ty,
      ) <= 300 * dt + 6) {
        bullet.sprite.setPosition(bullet.tx, bullet.ty);
        if(bullet.hybridConfig)this.detonateV1HybridSpecial(bullet.tx,bullet.ty,bullet.hybridConfig);
        else this.explode(bullet.tx,bullet.ty);
        remove = true;
      }

      // O especial só detona na mira (tx,ty), não ao tocar projéteis no caminho.
      // Dessa forma a marca semitransparente indica um ponto garantido.
      if (!remove && !bullet.special) {
        for (let j = this.enemyBullets.length - 1; j >= 0; j -= 1) {
          const hostile = this.enemyBullets[j];
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, hostile.sprite.x, hostile.sprite.y,
          ) >= (hostile.radius??8.25)+Math.max(7,bullet.usRadius)+3) continue;
          hostile.hp -= bullet.damage;
          if (hostile.hp <= 0){
            if(hostile.colossal)detonateType6Bomb(this,hostile);
            else this.removeEnemyBullet(j);
          }
          else hostile.sprite.setFillStyle(0xfff5d0);
          remove = true;
          break;
        }
      }

      // OVNIs cruzando a trajetória do especial não alteram o local de explosão.
      if (!remove && !bullet.special) {
        for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
          const enemy = this.enemies[j];
          if(enemy.type===6){
            const target=type6PointTarget(enemy.type6,enemy.sprite.x,enemy.sprite.y,
              bullet.sprite.x,bullet.sprite.y,Math.max(7,bullet.usRadius));
            const key=enemy.uid+':'+target;
            if(target!==null&&bullet.hitEnemyIds.has(key))continue;
            const hit=hitType6Bullet(this,enemy,bullet.sprite.x,bullet.sprite.y,
              bullet.damage,Math.max(7,bullet.usRadius),previousX,previousY);
            if(!hit.blocked)continue;
            if(hit.target!==null)bullet.hitEnemyIds.add(enemy.uid+':'+hit.target);
            if(bullet.fragmentation)this.explodeFragments(bullet.sprite.x,bullet.sprite.y,
              enemy.uid);
            if(bullet.usGrowthMax>1)this.explodeAmericanPrimary(bullet.sprite.x,
              bullet.sprite.y,enemy.uid,bullet.damage,20+bullet.usRadius);
            if(bullet.knockback>0)this.showHeavyImpact(bullet.sprite.x,bullet.sprite.y);
            if(bullet.fragmentation){remove=true;break;}
            bullet.pierceLeft-=1;
            remove=hit.target===null||bullet.pierceLeft<=0;
            if(remove)break;
            continue;
          }
          if (bullet.hitEnemyIds.has(enemy.uid)) continue;
          if (Phaser.Math.Distance.Between(
            bullet.sprite.x, bullet.sprite.y, enemy.sprite.x, enemy.sprite.y,
          ) >= enemyContactRadius(enemy.type) + Math.max(7,bullet.usRadius)) continue;

          const directTargetId = enemy.uid;
          bullet.hitEnemyIds.add(directTargetId);
          const deathPosition = { x: enemy.sprite.x, y: enemy.sprite.y };
          const knockback = this.combat.strategicRecoil && bullet.knockback > 0
            ? strategicKnockback(bullet.knockback, enemy.sprite.y)
            : bullet.knockback;
          if(this.combat.russianFreezeMs && bullet.damage<1000000){
            this.freezeRussianEnemy(enemy,this.combat.russianFreezeMs);
            // Acertos repetidos espalham um pouco além do raio passivo.
            if(enemy.russianFrostHits>=2)this.spreadRussianCold(enemy,1.18);
          }
          const destroyed = this.impactInvader(
            j, bullet.damage, knockback, bullet.impactColor,
            true, this.combat.strategicRecoil ? 720 : 400,
          );
          if(bullet.usGrowthMax>1)
            this.explodeAmericanPrimary(deathPosition.x,deathPosition.y,directTargetId,
              bullet.damage,20+bullet.usRadius);
          if (bullet.knockback > 0) {
            if (this.combat.strategicRecoil) {
              this.showStrategicRecoilImpact(deathPosition.x, deathPosition.y);
            } else {
              this.showHeavyImpact(deathPosition.x, deathPosition.y);
            }
          }
          if (this.isV1Campaign && mayDuplicateProjectile(bullet.generation, this.combat.duplicateChance, Math.random())) {
            const direction = Math.atan2(bullet.vy, bullet.vx);
            const replica = this.createProjectile(direction, false, 0, bullet.vfx, false, 0,
              bullet.generation + 1, {x:deathPosition.x+8,y:deathPosition.y-8});
            replica?.hitEnemyIds.add(directTargetId);
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
        bullet.specialMarker?.destroy();
        bullet.sprite.destroy();
        if (bullet.visual) this.visibleProjectileCount = Math.max(0, this.visibleProjectileCount - 1);
        this.projectiles.splice(i, 1);
      }
    }
  }

  damageCannon(amount) {
    if (this.tutorialComplete) return;
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
    // Escudo universal — cúpula 180% maior e com colisão idêntica.
    // Não aplicar quaisquer acessórios ou mecânicas de defesa por upgrade.
    if(this.shield>0){
      const fraction=this.shield/this.shieldMax;
      const color=cannonShieldColor(this.shield,this.shieldMax);
      graphics.lineStyle(5,color,0.47+0.43*fraction);
      graphics.beginPath();
      graphics.arc(CANNON.x,CANNON.y+10,CANNON_DOME_RADIUS,Math.PI,Math.PI*2,false);
      graphics.strokePath();
      graphics.lineStyle(2,color,0.14+0.20*fraction);
      graphics.beginPath();
      graphics.arc(CANNON.x,CANNON.y+10,CANNON_DOME_RADIUS+6,Math.PI,Math.PI*2,false);
      graphics.strokePath();
    }
    const dome=(x,y,radius,shield,max)=>{
      if(shield<=0)return;
      graphics.lineStyle(3,cannonShieldColor(shield,max),0.8);
      graphics.beginPath();graphics.arc(x,y,radius,Math.PI,Math.PI*2,false);
      graphics.strokePath();
    };
    for (const tower of this.supportTowers) {
      if (tower.health > 0) {
        dome(tower.x, tower.y, tower.shieldRadius, tower.shield, tower.shieldMax);
      }
    }
    // Congelamento russo: cristal gigante envolve o canhão por 2 segundos.
    if(this.elapsed<this.cannonFrozenUntil){
      const x=CANNON.x,y=CANNON.y-14;
      graphics.fillStyle(0x9bdcff,0.40);
      graphics.fillPoints([{x:x-66,y:y+27},{x:x-48,y:y-50},{x:x-6,y:y-98},
        {x:x+38,y:y-68},{x:x+67,y:y+26},{x:x+22,y:y+46},{x:x-42,y:y+41}],true);
      graphics.lineStyle(4,0xe5ffff,0.90);
      graphics.strokePoints([{x:x-66,y:y+27},{x:x-48,y:y-50},{x:x-6,y:y-98},
        {x:x+38,y:y-68},{x:x+67,y:y+26},{x:x+22,y:y+46},{x:x-42,y:y+41}],true);
      graphics.lineStyle(2,0xffffff,0.7).lineBetween(x-45,y-45,x+22,y+36);
    }
  }

  showFinaleDefeat(reason='cannon') {
    this.music.stop();
    this.tutorialComplete=true;
    this.gameOver=true;
    const next=continueResistanceAfterDefeat(
      this.campaign.choices,this.brazilResistanceLevels,this.selectedBetrayer);
    const canRetry=!this.finale.fullBrazil&&next.outcome==='retry';
    this.add.rectangle(W/2,H/2,W,H,0x070c1c,0.90)
      .setInteractive().setDepth(220);
    addCuboBroadcastFrame(this,{
      section:'Plantão da resistência',
      headline:canRetry?'Brasil mantém defesa ativa':'Soberania em risco',
      footer:'Cubo News • Cobertura ao vivo do confronto final',
      depth:232,
    });
    this.add.text(W/2,118,
      canRetry?'O BRASIL AINDA RESISTE':'SOBERANIA PERDIDA',{
        fontFamily:'monospace',fontSize:'34px',fontStyle:'bold',
        color:canRetry?'#ffe3a0':'#ff9ca1',align:'center',
      }).setOrigin(0.5).setDepth(222);
    const caption=(this.finale.fullBrazil
      ? [reason==='timeout'?'O TEMPO ACABOU E A ÚLTIMA FROTA CONTINUOU ATIVA.':'A ÚLTIMA FROTA ALIENÍGENA ROMPEU AS DEFESAS.',
        'O BRASIL LUTOU SOZINHO.']
      : canRetry
        ? [reason==='timeout'?'O PRAZO ESGOTOU ANTES DE DERRUBAR A COALIZÃO.':'A COALIZÃO QUEBROU AS DEFESAS.',
          `RESISTÊNCIA BRASILEIRA: MELHORIA NÍVEL ${next.awardedLevel} DISPONÍVEL.`,
          'REINICIAR TODA A BATALHA CONTRA OS MESMOS CHEFES?']
        : ['OS RECURSOS DA RESISTÊNCIA SE ESGOTARAM.',
          'A COALIZÃO TOMOU O BRASIL.']).join(String.fromCharCode(10));
    this.add.text(W/2,235,caption,{
      fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',
      color:'#e9f0ff',align:'center',wordWrap:{width:825},lineSpacing:8,
    }).setOrigin(0.5).setDepth(223);
    if(canRetry)addMenuButton(this,{
      x:W/2,y:355,width:460,height:49,
      text:`▶ RESISTIR — BRASIL NÍVEL ${next.awardedLevel}`,
      primary:true,depth:225,onClick:()=>this.scene.start('GameScene',{
        mode:'wave11',campaign:this.campaign,
        brazilResistanceLevels:next.awardedLevels,selectedBetrayer:this.selectedBetrayer,
      }),
    });
    addMenuButton(this,{
      x:W/2,y:canRetry?431:371,width:390,height:46,
      text:canRetry?'ACEITAR DERROTA / VER FINAL':'VER FINAL DA DERROTA',
      depth:225,onClick:()=>this.scene.start('EndingScene',{
        campaign:this.finaleCampaign,won:false,
      }),
    });
  }

  showDefeat(reason='cannon') {
    if (this.tutorialComplete) return;
    if (reason === 'cannon') { this.beginCannonDestruction(); return; }
    this.finishDefeat(reason);
  }

  beginCannonDestruction() {
    if (this.deathSequence || this.tutorialComplete) return;
    this.tutorialComplete = true;
    this.gameOver = true;
    this.closeSupremeCode();
    this.clearDiscoGlobes();
    this.specialAimGraphics.clear();
    this.shieldGraphics.clear();
    this.time.removeAllEvents();
    this.tweens.killAll();
    this.statusText.setText('SINAL PERDIDO');
    this.healthText.setText('CANHÃO 0 | DEFESA PERDIDA');
    this.deathSequence = createCannonDestruction(this, {
      x: CANNON.x, y: CANNON.y, width: W, height: H,
      onComplete: () => {
        this.deathSequence = null;
        this.finishDefeat('cannon');
      },
    });
  }

  finishDefeat(reason='cannon') {
    this.clearDiscoGlobes();
    this.music.stop();
    if (this.mode==='wave11') {this.showFinaleDefeat(reason);return;}
    this.tutorialComplete = true;
    this.gameOver = true;
    this.statusText.setText(reason==='timeout'?'TEMPO ESGOTADO':'CANHÃO DESTRUÍDO');
    this.healthText.setText(reason==='timeout'
      ? `CANHÃO ${Math.ceil(this.cannonHealth)} | FORTALEZA AINDA ATIVA`
      : 'CANHÃO 0 | ESCUDO 0 | DEFESA PERDIDA');
    this.tutorialText.setText('');

    this.add.rectangle(W / 2, H / 2, W, H, 0x030714, 0.78)
      .setDepth(120).setInteractive();
    this.add.rectangle(W / 2, H / 2, 470, 320, 0x0a1930, 0.98)
      .setStrokeStyle(2, 0xe16c66).setDepth(121);
    addCuboBroadcastFrame(this,{
      section:'Sinal de emergência',
      headline:'Defesa nacional interrompida • Aguarde novo boletim',
      footer:'Plantão Cubo News • A transmissão será retomada',
      depth:132,
    });
    this.add.text(W / 2, 174, 'DERROTA', {
      fontFamily: 'monospace', fontSize: '42px',
      color: '#ff9c8f', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(122);
    this.add.text(W / 2, 221,
      reason==='timeout'?'A FORTALEZA-MÃE NÃO FOI DESTRUÍDA!':'O CANHÃO FOI DESTRUÍDO!', {
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

  beginDawnWithdrawal(){
    if(this.sunrisePlaying||this.tutorialComplete)return;
    this.sunrisePlaying=true;
    this.countdownActive=true;
    // A etiqueta alienígena proíbe combater sob a luz do sol.
    // Nenhum projétil novo, dano ou animação de onda ocorre até a saída.
    for(let i=this.enemyBullets.length-1;i>=0;i--)this.removeEnemyBullet(i);
    this.sunriseOverlay?.setAlpha(0);
    if(this.sunriseOverlay)this.tweens.add({
      targets:this.sunriseOverlay,alpha:0.48,duration:1100,ease:'Sine.Out',
    });
    const label=this.add.text(W/2,153,'AMANHECEU! ETs RECUAM POR EDUCAÇÃO',{
      fontFamily:'IBM Plex Sans, sans-serif',fontSize:'29px',fontStyle:'bold',
      color:'#fff4d3',stroke:'#19372d',strokeThickness:5,
      align:'center',
    }).setOrigin(0.5).setDepth(140);
    for(const enemy of this.enemies){
      if(!enemy.sprite?.active)continue;
      this.tweens.add({targets:enemy.sprite,y:-130,x:enemy.sprite.x+
        (enemy.sprite.x<W/2?-40:40),alpha:0,duration:1450,ease:'Sine.In'});
    }
    this.time.delayedCall(1750,()=>{
      label.destroy();
      if(!this.scene.isActive('GameScene'))return;
      this.countdownActive=false;
      this.showWaveComplete('survived');
    });
  }

  showWaveComplete(outcome = 'cleared') {
    if (this.tutorialComplete) return;
    this.clearDiscoGlobes();
    this.music.stop();
    this.tutorialComplete = true;

    if (this.mode === 'wave11') {
      this.statusText.setText('CONFRONTO FINAL VENCIDO — BRASIL SOBERANO!');
      this.tutorialText.setText('');
      this.time.delayedCall(1250,()=>this.scene.start('EndingScene',{
        campaign:this.finaleCampaign,won:true,
      }));
      return;
    }
    if (this.mode === 'wave10') {
      this.statusText.setText('FORTALEZA-MÃE DESTRUÍDA');
      this.time.delayedCall(1200, () => this.advanceAfterWave());
      return;
    }
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
    if(this.mode==='wave10') {
      this.scene.start('GameScene',{
        mode:'wave11',campaign:this.campaign,brazilResistanceLevels:[],
        v1Playtest:this.v1Playtest,
      });
      return;
    }
    if (!this.unifiedLab && /^wave[0-9]$/.test(this.mode)) {
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
    addCuboBroadcastFrame(this,{
      section:'Plantão de vitória',
      headline:'Rio de Janeiro resiste a mais uma noite',
      footer:'Transmissão especial • Edição da manhã',
      depth:132,
    });
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
    if(this.cuboNewsState){
      const story=tickCuboNews(this.cuboNewsState,this.elapsed,this.waveDurationMs);
      this.cuboNewsHud?.update(this.elapsed,this.waveDurationMs,story,{frozen:this.boss6IntroPaused});
    }
    const remaining = Math.max(
      0, (this.lastSpecialFire + this.combat.specialCooldown - this.time.now) / 1000,
    );
    const clock = this.mode.startsWith('wave')
      ? 'NOITE ' + String(Math.ceil(Math.max(0, this.waveDurationMs - this.elapsed) / 1000))
        .padStart(2, '0') + 's | ' : '';
    this.statusText.setText(clock + (remaining
      ? 'ESPECIAL ' + remaining.toFixed(1) + 's' : 'ESPECIAL PRONTO'));
    if(this.specialLabel) {
      const titles={br:'ARRAIAL',us:'CHOQUE E PAVOR',ru:'MATRYOSHKA',
        cn:'ENTREGA',jp:'DISCOTECA'};
      const base=titles[this.specialBuild.primary] || 'ESPECIAL';
      this.specialLabel.setText(`DIR. ${base} — ${remaining?remaining.toFixed(1)+'s':'PRONTO'}`);
    }
    if (this.ultimateLabel) {
      const title = V1_SUPREMES[this.combat.ultimate]?.title ?? 'SUPREMA';
      this.ultimateLabel.setText(`${this.ultimateUsed ? 'SUPREMO USADO' : this.elapsed >= this.waveDurationMs-5000 ? '🔴 ESPAÇO — '+title : 'SUPREMO — AGUARDE'}`);
    }
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
      const history = this.combatCampaign.choices.map((id) =>
        getFirstUpgrade(id)?.flag ?? id.toUpperCase()).join(' + ');
      const special = this.combat.plasmaEvery ? ' | LIGHTSTICK: ' +
        (this.basicShotCount % PLASMA_EVERY_SHOTS) + '/' + PLASMA_EVERY_SHOTS
        : this.combat.fragmentation ? ' | FRAGMENTAÇÃO' : '';
      const towerLabel = this.supportTowers.map((tower) => tower.definition.label).join(' + ');
      const levelTwo = unlockedSecondUpgrades(this.combatCampaign)
        .map((id) => getFirstUpgrade(id)?.flag ?? id.toUpperCase()).join(' + ');
      const enemies=this.mode==='wave11'&&this.finale?.coalition.length
        ? ' | TRAIDORES: '+this.finale.coalition
          .map(id=>FINALE_COUNTRIES[id].name).join('+') : '';
      const resistance=this.brazilResistanceLevels.length
        ? ' | RESISTÊNCIA BR N'+Math.max(...this.brazilResistanceLevels) : '';
      this.tutorialText.setText(
        'ALIADOS: ' + (history || 'NENHUM') +
        (levelTwo ? ' | N2: ' + levelTwo : '') +
        (towerLabel ? ' | TORRE: ' + towerLabel : '') +
        enemies + resistance + special,
      );
    } else if (this.mode === 'upgradeLab' && !this.v1Playtest) {
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
    if (this.deathSequence) {
      this.deathSequence.update(delta, this.input.activePointer);
      return;
    }
    // Também anima durante a contagem 3–2–1 e as telas de resultado,
    // sem consumir eventos de mouse e sem alterar o ritmo do combate.
    this.crtOverlay?.update(this.time.now);
    const pointer = this.input.activePointer;
    this.drawSpecialAim(pointer);
    if(this.boss6Victory)return;
    if (this.tutorialComplete) {
      if (!this.gameOver) this.updateBlasts();
      return;
    }
    // Sem disparos, movimentação ou cronômetro de onda antes do "1".
    if (this.countdownActive) return;
    if (this.supremeCinematic) return;
    if (this.supremeTyping) delta *= 0.1;
    const dt = Math.min(delta / 1000, 0.05);
    this.elapsed += this.boss6IntroPaused?0:delta;
    this.updateDiscoGlobes();
    // Nunca clarear o Rio antes de o cronômetro chegar a ZERO.
    if(this.sunriseOverlay)this.sunriseOverlay.setAlpha(0);
    // À meia-noite de 30 segundos, sobreviver basta — mesmo com inimigos vivos.
    // A verificação vem ANTES das atualizações hostis do quadro final.
    if(this.mode==='wave10'||this.mode==='wave11'){
      type6NextDeadline(this);
      if(this.boss6DoomFired)return;
      if(this.elapsed>=this.waveDurationMs){
        this.showDefeat('timeout');
        return;
      }
    }
    if (/^wave[0-9]$/.test(this.mode) && this.elapsed >= WAVE_DURATION_MS) {
      this.beginDawnWithdrawal();
      return;
    }
    this.aimAngle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.barrel.rotation = this.aimAngle + Math.PI / 2;
    if(this.isV1Campaign && this.combat.koreaContinuous)
      this.drawEncoreContinuousBeam(this.aimAngle,
        pointer.leftButtonDown() && !this.pointerOverEnemyLabControls(pointer));
    if (pointer.leftButtonDown() && !this.pointerOverEnemyLabControls(pointer)) this.shootBasic(pointer);
    // O ciclo de calor continua mesmo quando o jogador solta o disparo.
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
    this.updateArraial();
    this.updateArraialFlames();
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
    if (!(this.unifiedLab && this.mode === 'lab') && !(this.v1Playtest && this.mode === 'upgradeLab')) {
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
