import Phaser from 'phaser';
import { SKY_LAYERS } from '../config/scenery.js';
import {
  restrictedAimAngle,
  availableDefenseTargets,
  positionOnRoute,
  routeLength,
  applyShieldedHit,
} from '../gameplay/combat.js';
import { addMenuButton } from '../ui/menuButton.js';
import {
  SPECIAL_BLAST_DURATION,
  SPECIAL_BLAST_MAX_RADIUS,
  specialBlastRadius,
  blastCatchesTarget,
} from '../gameplay/specialBlast.js';

const W = 960;
const H = 540;
const CANNON = { x: 480, y: 494 };
const ENEMY_IMPACT_DAMAGE = 46;
const SHIELD_REGEN_RATE = 3.5;
const SHIELD_REGEN_DELAY = 4000;
const BASE_FIRE_INTERVAL = 500; // GDD: 2 disparos por segundo
const SPECIAL_COOLDOWN = 8000;
const TUTORIAL_MIN_DURATION = 30000;
// Invasores chegam gradualmente para dar tempo de praticar os controles.
const TUTORIAL_SPAWN_TIMES = [600, 2400, 4400, 6300, 9500, 12200, 15300, 18600, 22000, 25000];
const INVADER_COUNT = TUTORIAL_SPAWN_TIMES.length;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.setPath('assets/cenario');
    SKY_LAYERS.forEach((name) => this.load.image(name, `${name}.png`));
    this.load.setPath('assets/inimigos/tipo1');
    for (let frame = 1; frame <= 4; frame += 1) {
      this.load.image(`tipo1_${frame}`, `frame_${String(frame).padStart(2, '0')}.png`);
    }
  }

  create() {
    this.input.mouse?.disableContextMenu();

    SKY_LAYERS.forEach((name, depth) => {
      this.add.image(W / 2, H / 2, name)
        .setDisplaySize(W, H)
        .setDepth(depth);
    });

    if (!this.anims.exists('tipo1_voo')) {
      this.anims.create({
        key: 'tipo1_voo',
        frames: [1, 2, 3, 4].map((i) => ({ key: `tipo1_${i}` })),
        frameRate: 4.5,
        repeat: -1,
      });
    }

    this.enemies = [];
    this.projectiles = [];
    this.specialBlasts = [];
    this.elapsed = 0;
    this.enemiesSpawned = 0;
    this.lastBasicFire = -BASE_FIRE_INTERVAL;
    this.lastSpecialFire = -SPECIAL_COOLDOWN;
    this.tutorialComplete = false;
    this.cannonHealth = 100;
    this.shield = 80;
    this.shieldMax = 80;
    this.lastDamageAt = -10000;
    this.aimAngle = -Math.PI / 2;
    this.gameOver = false;
    // As torres animais serão registradas aqui quando os upgrades forem implementados.
    // Cada torre: { id, x, y, health, shield, shieldRadius }.
    this.supportTowers = [];

    // Os animais e respectivos escudos surgirão conforme os upgrades.
    this.createTurret();
    this.shieldGraphics = this.add.graphics().setDepth(23);
    this.createHud();
    this.drawShield();

    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) this.shootSpecial(pointer);
    });
    this.input.keyboard.on('keydown-R', () => this.scene.restart());
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    TUTORIAL_SPAWN_TIMES.forEach((delay) => {
      this.time.delayedCall(delay, () => this.spawnInvader());
    });
  }

  createTurret() {
    const x = CANNON.x;
    const y = CANNON.y;

    this.add.rectangle(x, y + 10, 65, 22, 0x354958).setStrokeStyle(2, 0xa9d0df).setDepth(21);
    this.add.rectangle(x, y + 1, 42, 25, 0x637b88).setStrokeStyle(2, 0xc1d4db).setDepth(22);
    this.barrel = this.add.rectangle(x, y - 20, 11, 47, 0x9daeb6)
      .setStrokeStyle(2, 0xe0edec)
      .setOrigin(0.5, 0.85)
      .setDepth(21);
    this.add.circle(x, y - 1, 12, 0x314f62).setStrokeStyle(2, 0xc4d7dc).setDepth(23);
  }

  createHud() {
    const font = { fontFamily: 'monospace', fontSize: '18px', color: '#f0f7ff' };
    this.add.rectangle(W / 2, 20, W, 40, 0x081528, 0.93).setDepth(100);
    this.add.text(14, 9, 'SOBERANIA | ONDA 0', font).setDepth(101);
    this.statusText = this.add.text(W - 14, 9, '', font).setOrigin(1, 0).setDepth(101);
    this.tutorialText = this.add.text(W / 2, 55, '', {
      ...font, fontSize: '17px', backgroundColor: '#0b1a2bcc', padding: { x: 9, y: 6 },
    }).setOrigin(0.5, 0).setDepth(101);
    this.healthText = this.add.text(14, H - 28, '', {
      ...font, fontSize: '13px', color: '#e2ebfa',
    }).setDepth(101);

    const pauseButton = this.add.rectangle(W / 2, 20, 156, 32, 0x18364c, 0.95)
      .setStrokeStyle(2, 0x74bace)
      .setDepth(102)
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
    if (this.tutorialComplete || this.scene.isActive('PauseScene')) return;
    // Ao pausar a cena, os timers de spawn, o jogo e os cooldowns param juntos.
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  // Mesmo sem animais, todo invasor recebe um alvo: o escudo do canhão.
  // Quando existirem torres vivas, elas também entrarão na seleção.
  chooseDefenseTarget() {
    const targets = availableDefenseTargets(CANNON, this.supportTowers);
    return targets[Phaser.Math.Between(0, targets.length - 1)];
  }

  makeInvaderRoute(x, y, target) {
    // Ponto intermediário variável dá uma curva visível em vez de descida reta.
    const controlX = Phaser.Math.Clamp(
      Phaser.Math.Linear(x, target.x, 0.5) + Phaser.Math.Between(-160, 160),
      90, W - 90,
    );
    const controlY = Phaser.Math.Linear(y, target.y, 0.42);
    return {
      x0: x, y0: y,
      x1: controlX, y1: controlY,
      x2: target.x, y2: target.y,
    };
  }

  assignInvaderTarget(enemy, target) {
    enemy.target = target;
    enemy.route = this.makeInvaderRoute(enemy.sprite.x, enemy.sprite.y, target);
    enemy.pathLength = routeLength(enemy.route);
    enemy.progress = 0;
  }

  spawnInvader() {
    if (this.tutorialComplete) return;
    const x = Phaser.Math.Between(130, W - 130);
    const enemySprite = this.add.sprite(x, -45, 'tipo1_1')
      .setDisplaySize(62, 72)
      .setDepth(18)
      .play('tipo1_voo');
    const enemy = {
      sprite: enemySprite,
      hp: 1,
      speed: Phaser.Math.Between(70, 90),
    };
    this.assignInvaderTarget(enemy, this.chooseDefenseTarget());
    this.enemies.push(enemy);
    this.enemiesSpawned += 1;
  }

  shootBasic(pointer) {
    const now = this.time.now;
    if (now - this.lastBasicFire < BASE_FIRE_INTERVAL || this.tutorialComplete) return;
    this.lastBasicFire = now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.createProjectile(angle, false);
  }

  shootSpecial(pointer) {
    const now = this.time.now;
    if (now - this.lastSpecialFire < SPECIAL_COOLDOWN || this.tutorialComplete) return;
    this.lastSpecialFire = now;
    const angle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    // A bomba detona em um ponto do mesmo arco para onde o canhão realmente aponta.
    const distance = Phaser.Math.Clamp(
      Math.hypot(pointer.x - CANNON.x, pointer.y - CANNON.y), 140, 580,
    );
    this.createProjectile(angle, true, distance);
  }

  createProjectile(angle, special, distance = 0) {
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const dot = this.add.circle(CANNON.x + vx * 29, CANNON.y + vy * 29,
      special ? 8 : 4, special ? 0x72eaf8 : 0xffe29b)
      .setDepth(35);
    this.projectiles.push({
      sprite: dot,
      vx: vx * (special ? 300 : 480),
      vy: vy * (special ? 300 : 480),
      special,
      tx: special ? CANNON.x + vx * distance : null,
      ty: special ? CANNON.y + vy * distance : null,
    });
  }

  impactInvader(index) {
    const enemy = this.enemies[index];
    if (!enemy) return;
    enemy.hp -= 1;
    if (enemy.hp <= 0) {
      enemy.sprite.destroy();
      this.enemies.splice(index, 1);
    } else {
      enemy.sprite.setTint(0xff6f7a);
    }
  }

  explode(x, y) {
    // O campo permanece por 3 segundos. Não é só uma animação:
    // inimigos que entrarem depois também são eliminados.
    this.specialBlasts.push({
      x, y,
      bornAt: this.time.now,
      graphics: this.add.graphics().setDepth(39),
    });
  }

  isEnemyInsideBlast(enemy) {
    return this.specialBlasts.some((blast) => blastCatchesTarget(
      blast.x, blast.y, this.time.now - blast.bornAt,
      enemy.sprite.x, enemy.sprite.y,
      18, // raio aproximado de colisão do OVNI
    ));
  }

  updateBlasts() {
    // Desenha usando o mesmo raio usado na colisão: o círculo visível protege
    // exatamente a região de combate, inclusive contra futuras aproximações.
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

      // Núcleo translucido, contorno brilhante e anel interno pulsante.
      // O fundo permanece visível durante a proteção.
      gfx.fillStyle(0x4deaff, 0.16 * fade);
      gfx.fillCircle(blast.x, blast.y, radius);
      gfx.lineStyle(3, 0xa8ffff, (0.82 + pulse * 0.18) * fade);
      gfx.strokeCircle(blast.x, blast.y, radius);
      gfx.lineStyle(1, 0x5bbfe9, (0.38 + pulse * 0.28) * fade);
      gfx.strokeCircle(blast.x, blast.y, radius * 0.76);
      gfx.fillStyle(0xd4ffff, (0.45 + pulse * 0.4) * fade);
      gfx.fillCircle(blast.x, blast.y, Math.max(3, radius * 0.07));
    }

    // Também elimina os OVNIs que já estavam dentro quando a bomba detonou.
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      if (this.isEnemyInsideBlast(this.enemies[i])) this.impactInvader(i);
    }
  }

  damageCannon(amount) {
    this.lastDamageAt = this.time.now;
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
      onClick: () => this.scene.restart(), primary: true, depth: 124,
    });
    addMenuButton(this, {
      x: W / 2, y: 362, text: '⌂  MENU PRINCIPAL',
      onClick: () => this.scene.start('MenuScene'), depth: 124,
    });
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

  finishTutorial(message) {
    if (this.tutorialComplete) return;
    this.tutorialComplete = true;
    this.tutorialText.setText(message);
    this.statusText.setText('ONDA 0 CONCLUÍDA');
  }

  update(_time, delta) {
    if (this.tutorialComplete) return;
    const dt = Math.min(delta / 1000, 0.05);
    this.elapsed += delta;
    const pointer = this.input.activePointer;
    this.aimAngle = restrictedAimAngle(CANNON.x, CANNON.y, pointer.x, pointer.y);
    this.barrel.rotation = this.aimAngle + Math.PI / 2;
    if (pointer.leftButtonDown()) this.shootBasic(pointer);

    if (this.elapsed < 6500) {
      this.tutorialText.setText('Mova o mouse e segure o botão esquerdo para atirar');
    } else if (this.elapsed < 15000) {
      this.tutorialText.setText('Botão direito: tiro especial (recarga de 8 segundos)');
    } else {
      this.tutorialText.setText('Proteja o canhão central! Escudos regeneram sem dano.');
    }

    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (enemy.target.kind === 'tower' && enemy.target.tower?.health <= 0) {
        // Se a torre foi destruída durante o voo, redireciona para o canhão.
        const cannonTarget = availableDefenseTargets(CANNON, this.supportTowers)[0];
        this.assignInvaderTarget(enemy, cannonTarget);
      }

      enemy.progress = Math.min(1, enemy.progress + enemy.speed * dt / enemy.pathLength);
      const position = positionOnRoute(enemy.route, enemy.progress);
      enemy.sprite.setPosition(position.x, position.y);

      // Verifica a barreira antes do impacto com o escudo ou canhão.
      if (this.isEnemyInsideBlast(enemy)) {
        this.impactInvader(i);
        continue;
      }

      if (enemy.progress >= 1) {
        enemy.sprite.destroy();
        this.enemies.splice(i, 1);
        this.damageTarget(enemy.target, ENEMY_IMPACT_DAMAGE);
        if (this.gameOver) return;
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const bullet = this.projectiles[i];
      bullet.sprite.x += bullet.vx * dt;
      bullet.sprite.y += bullet.vy * dt;
      let remove = false;
      if (bullet.special && Phaser.Math.Distance.Between(
        bullet.sprite.x, bullet.sprite.y, bullet.tx, bullet.ty,
      ) <= 300 * dt + 6) {
        // Não ultrapassa o ponto da explosão entre dois frames.
        bullet.sprite.setPosition(bullet.tx, bullet.ty);
        this.explode(bullet.tx, bullet.ty);
        remove = true;
      }
      if (!remove) {
        for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
          const enemy = this.enemies[j];
          if (Phaser.Math.Distance.Between(bullet.sprite.x, bullet.sprite.y, enemy.sprite.x, enemy.sprite.y) < 24) {
            if (bullet.special) this.explode(bullet.sprite.x, bullet.sprite.y);
            else this.impactInvader(j);
            remove = true;
            break;
          }
        }
      }
      if (!remove && (bullet.sprite.x < -20 || bullet.sprite.x > W + 20 || bullet.sprite.y < -20 || bullet.sprite.y > H + 20)) {
        remove = true;
      }
      if (remove) {
        bullet.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }

    this.updateBlasts();

    if (this.time.now - this.lastDamageAt > SHIELD_REGEN_DELAY && this.shield < this.shieldMax) {
      this.shield = Math.min(this.shieldMax, this.shield + SHIELD_REGEN_RATE * dt);
    }
    this.drawShield();
    const remainingCooldown = Math.max(0, (this.lastSpecialFire + SPECIAL_COOLDOWN - this.time.now) / 1000);
    this.statusText.setText(remainingCooldown ? `ESPECIAL ${remainingCooldown.toFixed(1)}s` : 'ESPECIAL PRONTO');
    this.healthText.setText(`CANHÃO ${Math.ceil(this.cannonHealth)} | ESCUDO ${Math.ceil(this.shield)} | OVNIS ${this.enemies.length}`);

    if (this.elapsed >= TUTORIAL_MIN_DURATION && this.enemiesSpawned === INVADER_COUNT && this.enemies.length === 0) {
      this.finishTutorial('Onda 0 concluída! Próximo: seleção de upgrades. [R] reiniciar');
    }
  }
}
