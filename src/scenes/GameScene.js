import Phaser from 'phaser';

const W = 960;
const H = 540;
const GROUND_Y = 505;
const CANNON = { x: 480, y: 494 };
const BASE_FIRE_INTERVAL = 500; // GDD: 2 disparos por segundo
const SPECIAL_COOLDOWN = 8000;
const TUTORIAL_MIN_DURATION = 30000;
// Invasores chegam gradualmente para dar tempo de praticar os controles.
const TUTORIAL_SPAWN_TIMES = [600, 2400, 4400, 6300, 9500, 12200, 15300, 18600, 22000, 25000];
const INVADER_COUNT = TUTORIAL_SPAWN_TIMES.length;

const SKY_LAYERS = [
  '01_ceu_noturno_estrelado',
  '02_lua_e_nuvens',
  '03_montanhas_distantes',
  '04_baia_e_reflexos',
  '05_pao_de_acucar_e_ilhas',
  '06_cristo_redentor_e_morro',
  '07_horizonte_urbano',
  '08_primeiro_plano_telhados',
];

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
    this.elapsed = 0;
    this.enemiesSpawned = 0;
    this.lastBasicFire = -BASE_FIRE_INTERVAL;
    this.lastSpecialFire = -SPECIAL_COOLDOWN;
    this.tutorialComplete = false;
    this.cannonHealth = 100;
    this.shield = 80;
    this.shieldMax = 80;
    this.lastDamageAt = -10000;

    // Os animais e respectivos escudos surgirão conforme os upgrades.
    this.createTurret();
    this.shieldGraphics = this.add.graphics().setDepth(23);
    this.createHud();
    this.drawShield();

    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) this.shootSpecial(pointer);
    });
    this.input.keyboard.on('keydown-R', () => this.scene.restart());

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
  }

  spawnInvader() {
    if (this.tutorialComplete) return;
    const x = Phaser.Math.Between(130, W - 130);
    const enemy = this.add.sprite(x, -50, 'tipo1_1')
      .setDisplaySize(62, 72)
      .setDepth(18)
      .play('tipo1_voo');
    this.enemies.push({ sprite: enemy, hp: 1, speed: Phaser.Math.Between(34, 48) });
    this.enemiesSpawned += 1;
  }

  shootBasic(pointer) {
    const now = this.time.now;
    if (now - this.lastBasicFire < BASE_FIRE_INTERVAL || this.tutorialComplete) return;
    this.lastBasicFire = now;
    this.createProjectile(pointer.x, pointer.y, false);
  }

  shootSpecial(pointer) {
    const now = this.time.now;
    if (now - this.lastSpecialFire < SPECIAL_COOLDOWN || this.tutorialComplete) return;
    this.lastSpecialFire = now;
    this.createProjectile(pointer.x, pointer.y, true);
  }

  createProjectile(tx, ty, special) {
    const dx = tx - CANNON.x;
    const dy = ty - CANNON.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const vx = dx / len;
    const vy = dy / len;
    const dot = this.add.circle(CANNON.x + vx * 29, CANNON.y + vy * 29,
      special ? 8 : 4, special ? 0x72eaf8 : 0xffe29b)
      .setDepth(35);
    this.projectiles.push({
      sprite: dot,
      vx: vx * (special ? 300 : 480),
      vy: vy * (special ? 300 : 480),
      special,
      tx,
      ty,
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
    const blastRadius = 72;
    const flash = this.add.circle(x, y, 9, 0x75f3ff, 0.4)
      .setStrokeStyle(3, 0xc7ffff)
      .setDepth(39);
    this.tweens.add({
      targets: flash,
      radius: blastRadius,
      alpha: 0,
      duration: 190,
      onComplete: () => flash.destroy(),
    });
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (Phaser.Math.Distance.Between(enemy.sprite.x, enemy.sprite.y, x, y) < blastRadius) {
        this.impactInvader(i);
      }
    }
  }

  damageCannon(amount) {
    this.lastDamageAt = this.time.now;
    const remaining = Math.max(0, amount - this.shield);
    this.shield = Math.max(0, this.shield - amount);
    if (remaining > 0) this.cannonHealth = Math.max(0, this.cannonHealth - remaining);
    if (this.cannonHealth === 0) this.finishTutorial('Canhão destruído! Pressione R para reiniciar.');
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
    this.statusText.setText('TUTORIAL ENCERRADO');
  }

  update(_time, delta) {
    if (this.tutorialComplete) return;
    const dt = Math.min(delta / 1000, 0.05);
    this.elapsed += delta;
    const pointer = this.input.activePointer;
    this.barrel.rotation = Phaser.Math.Angle.Between(CANNON.x, CANNON.y, pointer.x, pointer.y) + Math.PI / 2;
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
      enemy.sprite.y += enemy.speed * dt;
      if (enemy.sprite.y >= GROUND_Y - 9) {
        enemy.sprite.destroy();
        this.enemies.splice(i, 1);
        this.damageCannon(20);
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const bullet = this.projectiles[i];
      bullet.sprite.x += bullet.vx * dt;
      bullet.sprite.y += bullet.vy * dt;
      let remove = false;
      if (bullet.special && Phaser.Math.Distance.Between(bullet.sprite.x, bullet.sprite.y, bullet.tx, bullet.ty) < 12) {
        this.explode(bullet.sprite.x, bullet.sprite.y);
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

    if (this.time.now - this.lastDamageAt > 2600 && this.shield < this.shieldMax) {
      this.shield = Math.min(this.shieldMax, this.shield + 11 * dt);
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
