import Phaser from 'phaser';
import {
  GAME_WIDTH as W, GAME_HEIGHT as H,
  preloadRioBackdrop, drawRioBackdrop,
} from '../config/scenery.js';
import { getFirstUpgrade } from '../gameplay/upgrades.js';
import {
  normalizeCampaignState, nextUpgradeOptions,
  chooseCampaignUpgrade, nextWaveAfterChoice,
} from '../gameplay/progression.js';
import { REPRESENTATIVES, representativeLine } from '../gameplay/representatives.js';
import { upgradeRepresentativeLine } from '../gameplay/upgradeDialogue.js';

const FONT = 'monospace';
const SLOTS = [130, 305, 480, 655, 830];

function text(scene, x, y, value, size = 14, color = '#f9f2e6', width) {
  return scene.add.text(x, y, value, {
    fontFamily: FONT, fontSize: size + 'px', color,
    align: 'center', fontStyle: 'bold', lineSpacing: 3,
    ...(width ? { wordWrap: { width, useAdvancedWrap: true } } : {}),
  }).setOrigin(0.5).setDepth(42);
}

// Cenário provisório em pixels para viabilizar a UX enquanto a arte aprovada
// da mesa de boteco e os 20 retratos finais não forem exportados em PNG.
function drawMeetingRoom(scene) {
  const g = scene.add.graphics().setDepth(6);
  g.fillStyle(0x19192a).fillRect(0, 0, W, H);
  g.fillStyle(0x2b2b3e).fillRect(0, 0, W, 290);
  g.fillStyle(0x34303a).fillRect(0, 290, W, 250);
  for (let y = 302; y < H; y += 26) {
    g.lineStyle(2, 0x4b4042, 0.8).lineBetween(0, y, W, y);
  }
  // Cinco cadeiras, todas de frente para o jogador.
  for (const x of SLOTS) {
    g.fillStyle(0x871e2b).fillRoundedRect(x - 45, 135, 90, 150, 12);
    g.fillStyle(0xc34b4d).fillRoundedRect(x - 36, 143, 72, 121, 10);
    g.lineStyle(4, 0x611423).strokeRoundedRect(x - 45, 135, 90, 150, 12);
    g.fillStyle(0x6a1726).fillRect(x - 50, 273, 12, 78).fillRect(x + 38, 273, 12, 78);
  }
  // Tampo de plástico vermelho brasileiro, sem logotipos de marcas.
  g.fillStyle(0x330d18).fillEllipse(W / 2, 411, 890, 196);
  g.fillStyle(0xa92834).fillEllipse(W / 2, 390, 880, 180);
  g.lineStyle(8, 0xd45154).strokeEllipse(W / 2, 390, 862, 167);
  g.lineStyle(3, 0x6b1629).strokeEllipse(W / 2, 390, 804, 133);
  g.fillStyle(0xdf5961).fillRect(277, 329, 406, 5);
  return g;
}

export class UpgradeScene extends Phaser.Scene {
  constructor() { super({ key: 'UpgradeScene' }); }

  init(data = {}) {
    this.campaign = normalizeCampaignState(data.campaign);
    this.completedWave = Number.isInteger(data.completedWave)
      ? data.completedWave : this.campaign.choices.length === 0 ? 0 : 1;
    this.chosen = false;
    this.focused = null;
  }

  preload() { preloadRioBackdrop(this); }

  create() {
    // O cenário do Rio permanece carregado para o jogo; a cena de reunião
    // usa um ambiente próprio sem reutilizar o campo de batalha.
    drawMeetingRoom(this);
    this.add.rectangle(W / 2, 49, W, 98, 0x090e1b, 0.94).setDepth(38);
    text(this, W / 2, 27, 'MESA DE NEGOCIAÇÕES', 29, '#ffde93');
    text(this, W / 2, 73,
      'ONDA ' + this.completedWave + ' CONCLUÍDA  •  ESCOLHA UMA MELHORIA',
      13, '#b6dcee');

    this.options = nextUpgradeOptions(this.campaign);
    this.tiles = [];
    this.options.forEach((option, index) => {
      const x = SLOTS[index];
      const inactive = option.locked;
      const tile = this.add.rectangle(x, 222, 126, 140, inactive ? 0x17202a : 0x202a3b, 1)
        .setStrokeStyle(4, inactive ? 0x64717b : option.color).setDepth(29);
      const symbol = text(this, x, 193, REPRESENTATIVES[option.id].emblem, 33,
        inactive ? '#7d8596' : '#fff6da');
      const name = text(this, x, 236, option.shortName ?? option.name, 12,
        inactive ? '#7d8596' : '#ffffff', 120);
      const level = text(this, x, 264, 'NÍVEL ' + option.level, 12,
        inactive ? '#9d7b82' : '#f6d795');
      this.tiles.push({ tile, symbol, name, level, option, x });
      if (!inactive) {
        tile.setInteractive({ useHandCursor: true });
        tile.on('pointerdown', (pointer, _x, _y, event) => {
          event?.stopPropagation();
          if (pointer.leftButtonDown()) this.focusCountry(option.id);
        });
      }
    });

    this.dialoguePanel = this.add.rectangle(W / 2, 408, 790, 155, 0x0b1729, 0.96)
      .setStrokeStyle(3, 0xe6b45b).setDepth(39);
    this.dialogueTitle = text(this, W / 2, 351, 'ESCOLHA UM REPRESENTANTE', 17, '#ffe0a0');
    this.dialogueBody = text(this, W / 2, 395,
      'Clique em um dos cinco retratos para ouvir a proposta.', 15, '#f2f6ff', 740);
    this.dialogueUpgrade = text(this, W / 2, 441, '', 12, '#a3eaca', 720);

    this.confirmSurface = this.add.rectangle(W / 2, 496, 350, 37, 0x344451)
      .setStrokeStyle(2, 0x7f929f).setDepth(43).setInteractive({ useHandCursor: true });
    this.confirmLabel = text(this, W / 2, 496, 'SELECIONE UM REPRESENTANTE', 14, '#f1f1f1');
    this.confirmSurface.on('pointerdown', (pointer, _x, _y, event) => {
      event?.stopPropagation();
      if (pointer.leftButtonDown() && this.focused) this.selectUpgrade(this.focused);
    });
    this.input.keyboard.on('keydown', (event) => {
      const match = /^[1-5]$/.exec(event.key);
      if (!match) return;
      const option = this.options[Number(match[0]) - 1];
      if (option && !option.locked) this.focusCountry(option.id);
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.focused) this.selectUpgrade(this.focused);
    });
  }

  focusCountry(id) {
    if (this.chosen) return;
    const selected = this.tiles.find((tile) => tile.option.id === id);
    if (!selected || selected.option.locked) return;
    this.focused = id;
    for (const tile of this.tiles) {
      const active = tile.option.id === id;
      tile.tile.setScale(active ? 1.16 : 1).setDepth(active ? 35 : 29)
        .setStrokeStyle(active ? 5 : 3, tile.option.locked ? 0x64717b : tile.option.color);
      tile.symbol.setScale(active ? 1.24 : 1).setDepth(active ? 48 : 42);
      tile.name.setDepth(active ? 48 : 42);
      tile.level.setDepth(active ? 48 : 42);
    }
    const option = selected.option;
    this.dialogueTitle.setText(REPRESENTATIVES[id].label + ' — REPRESENTANTE');
    this.dialogueBody.setText('“' + (upgradeRepresentativeLine(id, option.level) || representativeLine(id)) + '”');
    this.dialogueUpgrade.setText(
      option.title.toUpperCase() + ' — ' + option.description,
    );
    this.confirmSurface.setFillStyle(0x22644e).setStrokeStyle(3, 0xb1f1c9);
    this.confirmLabel.setText('ACEITAR ' + REPRESENTATIVES[id].label + ' [ENTER]');
  }

  selectUpgrade(id) {
    if (this.chosen) return;
    const next = chooseCampaignUpgrade(this.campaign, id);
    if (!next) return;
    const mode = nextWaveAfterChoice(next);
    if (!mode) return;
    this.chosen = true;
    this.dialogueBody.setText('“' + representativeLine(id, 'accepted') + '”');
    this.confirmSurface.disableInteractive();
    this.confirmLabel.setText('PARCERIA CONFIRMADA!');
    this.time.delayedCall(1200, () => {
      this.scene.start('GameScene', { mode, campaign: next });
    });
  }
}
