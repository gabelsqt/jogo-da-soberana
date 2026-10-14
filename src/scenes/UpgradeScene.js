import Phaser from 'phaser';
import {
  GAME_WIDTH as W,
  GAME_HEIGHT as H,
  preloadRioBackdrop,
  drawRioBackdrop,
} from '../config/scenery.js';
import {
  normalizeCampaignState,
  nextUpgradeOptions,
  chooseCampaignUpgrade,
  nextWaveAfterChoice,
} from '../gameplay/progression.js';

// A campanha registra quantas vezes o jogador escolheu CADA país.
// Cada cartão oferece somente o próximo upgrade daquela linha.
export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UpgradeScene' });
  }

  init(data = {}) {
    this.campaign = normalizeCampaignState(data.campaign);
    this.completedWave = Number.isInteger(data.completedWave)
      ? data.completedWave : this.campaign.choices.length === 0 ? 0 : 1;
    this.chosen = false;
  }

  preload() {
    preloadRioBackdrop(this);
  }

  create() {
    drawRioBackdrop(this);
    this.add.rectangle(W / 2, H / 2, W, H, 0x030c20, 0.84).setDepth(20);
    this.add.text(W / 2, 41, 'ESCOLHA SEU ALIADO', {
      fontFamily: 'monospace', fontSize: '32px',
      fontStyle: 'bold', color: '#fce9a1',
    }).setOrigin(0.5).setDepth(22);
    this.add.text(W / 2, 83,
      'ONDA ' + this.completedWave + ' CONCLUÍDA • ESCOLHA 1 MELHORIA PARA A ONDA ' +
        (this.completedWave + 1), {
        fontFamily: 'monospace', fontSize: '13px', color: '#b4dbef',
      }).setOrigin(0.5).setDepth(22);

    const options = nextUpgradeOptions(this.campaign);
    options.forEach((upgrade, index) => {
      const x = 100 + index * 190;
      const inactive = upgrade.locked;
      const card = this.add.rectangle(
        x, 285, 175, 299, inactive ? 0x17202d : 0x0d203c, 0.99,
      ).setStrokeStyle(2, inactive ? 0x596574 : upgrade.color)
        .setDepth(23);
      if (!inactive) card.setInteractive({ useHandCursor: true });

      const label = (y, value, size, color, extra = {}) =>
        this.add.text(x, y, value, {
          fontFamily: 'monospace', fontSize: size,
          align: 'center',
          wordWrap: { width: 155, useAdvancedWrap: true },
          color: inactive ? '#8391a0' : color, ...extra,
        }).setOrigin(0.5).setDepth(24);

      label(161, upgrade.flag, '26px', '#e3f7ff', { fontStyle: 'bold' });
      label(193, upgrade.name.toUpperCase() + '  •  NÍVEL ' + upgrade.level,
        '12px', '#ffffff', { fontStyle: 'bold' });
      label(247, upgrade.title.toUpperCase(), '15px', '#ffe7a4',
        { fontStyle: 'bold' });
      label(338, upgrade.description, '12px', '#d6e5f5', { lineSpacing: 3 });
      label(409, inactive ? upgrade.reason : '[ ' + (index + 1) + ' ] ESCOLHER',
        inactive ? '11px' : '13px', inactive ? '#ffaaaa' : '#98f0d2',
        { fontStyle: 'bold' });

      if (!inactive) {
        card.on('pointerover', () => card.setFillStyle(0x214661, 1));
        card.on('pointerout', () => card.setFillStyle(0x0d203c, 0.99));
        card.on('pointerdown', (pointer) => {
          if (pointer.leftButtonDown()) this.selectUpgrade(upgrade.id);
        });
      }
    });

    const history = this.campaign.choices.length
      ? this.campaign.choices.map((id) => id.toUpperCase()).join(' → ')
      : 'NENHUMA';
    this.add.text(W / 2, 484, 'ESCOLHAS ANTERIORES: ' + history, {
      fontFamily: 'monospace', fontSize: '13px', color: '#aec5df',
    }).setOrigin(0.5).setDepth(22);
    this.add.text(W / 2, 515,
      'NÍVEL 2 = TORRE AUTOMÁTICA • MÁXIMO 2 TORRES • TECLAS 1–5', {
        fontFamily: 'monospace', fontSize: '12px', color: '#eaf6ff',
      }).setOrigin(0.5).setDepth(22);

    this.input.keyboard.on('keydown', (event) => {
      const match = /^[1-5]$/.exec(event.key);
      if (match) this.selectUpgrade(options[Number(event.key) - 1].id);
    });
  }

  selectUpgrade(id) {
    if (this.chosen) return;
    const next = chooseCampaignUpgrade(this.campaign, id);
    if (!next) return;
    const mode = nextWaveAfterChoice(next);
    if (!mode) return;
    this.chosen = true;
    this.scene.start('GameScene', { mode, campaign: next });
  }
}
