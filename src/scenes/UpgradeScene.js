import Phaser from 'phaser';
import {
  GAME_WIDTH as W,
  GAME_HEIGHT as H,
  preloadRioBackdrop,
  drawRioBackdrop,
} from '../config/scenery.js';
import { FIRST_UPGRADES } from '../gameplay/upgrades.js';

// Cada cartão representa apenas a PRIMEIRA melhoria daquele país.
// O nível seguinte de cada país será incorporado em futuras versões.
export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UpgradeScene' });
  }

  preload() {
    preloadRioBackdrop(this);
  }

  create() {
    drawRioBackdrop(this);
    this.add.rectangle(W / 2, H / 2, W, H, 0x030c20, 0.77).setDepth(20);
    this.add.text(W / 2, 44, 'ESCOLHA SEU ALIADO', {
      fontFamily: 'monospace', fontSize: '35px', fontStyle: 'bold',
      color: '#fce9a1',
    }).setOrigin(0.5).setDepth(22);
    this.add.text(W / 2, 88, 'ONDA 0 CONCLUÍDA  •  UM UPGRADE PARA A ONDA 1', {
      fontFamily: 'monospace', fontSize: '15px', color: '#b4dbef',
    }).setOrigin(0.5).setDepth(22);

    FIRST_UPGRADES.forEach((upgrade, index) => {
      const x = 100 + index * 190;
      const card = this.add.rectangle(x, 285, 175, 294, 0x0d203c, 0.97)
        .setStrokeStyle(2, upgrade.color)
        .setDepth(23)
        .setInteractive({ useHandCursor: true });

      const texts = [
        this.add.text(x, 160, upgrade.flag, {
          fontFamily: 'monospace', fontSize: '29px',
          color: '#e3f7ff', fontStyle: 'bold',
        }).setOrigin(0.5),
        this.add.text(x, 199, upgrade.name.toUpperCase(), {
          fontFamily: 'monospace', fontSize: '17px',
          color: '#e3f7ff', fontStyle: 'bold',
        }).setOrigin(0.5),
        this.add.text(x, 247, upgrade.title.toUpperCase(), {
          fontFamily: 'monospace', fontSize: '15px',
          color: '#ffe7a4', fontStyle: 'bold',
          align: 'center', wordWrap: { width: 152, useAdvancedWrap: true },
        }).setOrigin(0.5),
        this.add.text(x, 339, upgrade.description, {
          fontFamily: 'monospace', fontSize: '12px',
          color: '#d6e5f5', align: 'center',
          wordWrap: { width: 154, useAdvancedWrap: true },
          lineSpacing: 3,
        }).setOrigin(0.5),
        this.add.text(x, 408, '[ ' + (index + 1) + ' ]  ESCOLHER', {
          fontFamily: 'monospace', fontSize: '13px',
          color: '#98f0d2', fontStyle: 'bold',
        }).setOrigin(0.5),
      ];
      texts.forEach((text) => text.setDepth(24));
      card.on('pointerover', () => card.setFillStyle(0x1d3e5d, 1));
      card.on('pointerout', () => card.setFillStyle(0x0d203c, 0.97));
      card.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown()) this.selectUpgrade(upgrade.id);
      });

      this.input.keyboard.on('keydown-' + (index + 1), () => this.selectUpgrade(upgrade.id));
    });

    this.add.text(W / 2, 485, 'AS ESCOLHAS ESTRANGEIRAS COBRAM SEU PREÇO. OU NÃO.', {
      fontFamily: 'monospace', fontSize: '14px',
      color: '#aec5df',
    }).setOrigin(0.5).setDepth(22);
    this.add.text(W / 2, 513, 'TECLAS 1–5 OU CLIQUE NO CARTÃO', {
      fontFamily: 'monospace', fontSize: '12px', color: '#eaf6ff',
    }).setOrigin(0.5).setDepth(22);
  }

  selectUpgrade(id) {
    if (this.chosen) return;
    this.chosen = true;
    this.scene.start('GameScene', { mode: 'wave1', upgradeId: id });
  }
}
