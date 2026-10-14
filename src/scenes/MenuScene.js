import Phaser from 'phaser';
import {
  GAME_WIDTH as W,
  GAME_HEIGHT as H,
  preloadRioBackdrop,
  drawRioBackdrop,
} from '../config/scenery.js';
import { addMenuButton } from '../ui/menuButton.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    preloadRioBackdrop(this);
  }

  create() {
    drawRioBackdrop(this);

    // Mantém o céu e a cidade visíveis, com contraste para o título.
    this.add.rectangle(W / 2, H / 2, W, H, 0x020712, 0.45).setDepth(20);
    this.add.rectangle(W / 2, 258, 650, 440, 0x071327, 0.88)
      .setStrokeStyle(2, 0x4279a1).setDepth(21);

    this.add.text(W / 2, 97, 'SOBERANIA', {
      fontFamily: 'monospace',
      fontSize: '54px',
      color: '#f3de8c',
      fontStyle: 'bold',
      stroke: '#12223c',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W / 2, 149, 'O RIO NÃO VAI CAIR', {
      fontFamily: 'monospace',
      fontSize: '17px',
      color: '#96e0e2',
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W / 2, 185, 'DEFESA ANTIAÉREA  •  PROTÓTIPO', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#d2dff2',
    }).setOrigin(0.5).setDepth(22);

    const startGame = () => this.scene.start('GameScene', { mode: 'wave0' });
    const testEnemies = () => this.scene.start('GameScene', { mode: 'lab' });
    addMenuButton(this, {
      x: W / 2, y: 250, text: '▶  COMEÇAR', onClick: startGame, primary: true,
      depth: 23,
    });

    addMenuButton(this, {
      x: W / 2, y: 318, width: 300,
      text: 'TESTAR INIMIGOS [T]', onClick: testEnemies, depth: 23,
    });

    this.add.text(W / 2, 385,
      'MOUSE: MIRAR    ESQUERDO: ATIRAR    DIREITO: ESPECIAL', {
        fontFamily: 'monospace', fontSize: '13px', color: '#e0ecfa',
      }).setOrigin(0.5).setDepth(22);

    this.add.text(W / 2, 412, 'ESC OU P: PAUSAR     R: REINICIAR', {
      fontFamily: 'monospace', fontSize: '13px', color: '#9fc1dd',
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W / 2, 460, 'PRESSIONE ENTER PARA COMEÇAR', {
      fontFamily: 'monospace', fontSize: '13px', color: '#f5e69b',
    }).setOrigin(0.5).setDepth(22);

    this.input.keyboard.on('keydown-ENTER', startGame);
    this.input.keyboard.on('keydown-T', testEnemies);
  }
}
