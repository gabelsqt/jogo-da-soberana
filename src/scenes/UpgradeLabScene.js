import Phaser from 'phaser';
import {
  GAME_WIDTH as W,
  GAME_HEIGHT as H,
} from '../config/scenery.js';
import { FIRST_UPGRADES } from '../gameplay/upgrades.js';
import { addMenuButton } from '../ui/menuButton.js';

// Painel de laboratório: sobrepõe o combate pausado, permitindo testar
// melhorias isoladas ou várias combinações sem consumi-las na campanha.
export class UpgradeLabScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UpgradeLabScene' });
  }

  init(data = {}) {
    this.selectedIds = Array.isArray(data.selectedIds) ? [...data.selectedIds] : [];
  }

  create() {
    this.input.mouse?.disableContextMenu();
    this.add.rectangle(W / 2, H / 2, W, H, 0x020817, 0.92)
      .setDepth(1)
      .setInteractive();
    this.add.rectangle(W / 2, H / 2, W - 24, H - 24, 0x071a30, 0.98)
      .setStrokeStyle(2, 0x568cba).setDepth(2);

    this.add.text(W / 2, 44, 'LABORATÓRIO DE UPGRADES', {
      fontFamily: 'monospace', fontSize: '29px',
      color: '#f9e69c', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3);

    this.add.text(W / 2, 81, 'ATIVAR / DESATIVAR • COMBINAÇÕES LIVRES • NÃO AFETA A CAMPANHA', {
      fontFamily: 'monospace', fontSize: '12px', color: '#bee0f4',
    }).setOrigin(0.5).setDepth(3);

    this.cards = [];
    FIRST_UPGRADES.forEach((upgrade, index) => {
      const x = 99 + index * 190;
      const card = this.add.rectangle(x, 259, 174, 294, 0x0b1d34, 0.99)
        .setStrokeStyle(2, upgrade.color)
        .setDepth(3)
        .setInteractive({ useHandCursor: true });

      const label = (y, value, size, color, extra = {}) => this.add.text(x, y, value, {
        fontFamily: 'monospace', fontSize: size, color,
        align: 'center',
        wordWrap: { width: 155, useAdvancedWrap: true },
        ...extra,
      }).setOrigin(0.5).setDepth(4);

      label(143, upgrade.flag + ' • ' + upgrade.name.toUpperCase(), '20px', '#f4fbff', { fontStyle: 'bold' });
      label(207, upgrade.title.toUpperCase(), '15px', '#ffe9b5', { fontStyle: 'bold' });
      label(298, upgrade.description, '12px', '#d3e2ef', { lineSpacing: 3 });

      const status = label(375, '', '16px', '#9affd8', { fontStyle: 'bold' });
      const toggle = () => this.toggleUpgrade(upgrade.id);
      card.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown()) toggle();
      });
      card.on('pointerover', () => card.setFillStyle(0x214160, 1));
      card.on('pointerout', () => card.setFillStyle(
        this.selectedIds.includes(upgrade.id) ? 0x23483f : 0x0b1d34, 0.99,
      ));
      this.cards.push({ card, status, upgrade });
    });

    this.statsPreview = this.add.text(W / 2, 433, '', {
      fontFamily: 'monospace', fontSize: '13px',
      color: '#fce4b4', backgroundColor: '#10243dde',
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(4);

    addMenuButton(this, {
      x: 268, y: 469, width: 290, height: 48,
      text: 'ZERAR MELHORIAS [0]', onClick: () => this.clearUpgrades(), depth: 4,
      fontSize: '15px',
    });
    addMenuButton(this, {
      x: 693, y: 469, width: 320, height: 48,
      text: '▶ VOLTAR AO CAMPO [U]', onClick: () => this.closeLab(), primary: true,
      depth: 4, fontSize: '16px',
    });
    this.add.text(W / 2, 516, 'TECLAS 1–5: ATIVAR MELHORIAS | ESC: FECHAR', {
      fontFamily: 'monospace', fontSize: '12px', color: '#9abfd5',
    }).setOrigin(0.5).setDepth(4);

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === '0') this.clearUpgrades();
      if (event.key >= '1' && event.key <= '5') {
        const chosen = FIRST_UPGRADES[Number(event.key) - 1];
        if (chosen) this.toggleUpgrade(chosen.id);
      }
    });
    this.input.keyboard.on('keydown-U', () => this.closeLab());
    this.input.keyboard.on('keydown-ESC', () => this.closeLab());
    this.refreshCards();
  }

  toggleUpgrade(id) {
    const gameScene = this.scene.get('GameScene');
    gameScene.toggleUpgradeForLab(id);
    this.selectedIds = [...gameScene.upgradeIds];
    this.refreshCards();
  }

  clearUpgrades() {
    const gameScene = this.scene.get('GameScene');
    gameScene.setUpgradesForLab([]);
    this.selectedIds = [];
    this.refreshCards();
  }

  refreshCards() {
    for (const { card, status, upgrade } of this.cards) {
      const active = this.selectedIds.includes(upgrade.id);
      card.setFillStyle(active ? 0x23483f : 0x0b1d34, 0.99);
      card.setStrokeStyle(active ? 4 : 2, active ? 0x9affd8 : upgrade.color);
      status.setText(active ? '[ ATIVO ]' : '[ ATIVAR ]');
      status.setColor(active ? '#a4ffe0' : '#9abfd5');
    }
    const stats = this.scene.get('GameScene').combat;
    this.statsPreview.setText(
      'TIROS ' + (1000 / stats.basicInterval).toFixed(1) + '/s' +
      '   DANO ' + stats.basicDamage.toFixed(2) +
      '   VEL ' + stats.basicSpeed +
      '   PERF ' + stats.pierce +
      '   PROJ ' + stats.bulletsPerShot,
    );
  }

  closeLab() {
    this.scene.resume('GameScene');
    this.scene.stop();
  }
}
