import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H } from '../config/scenery.js';
import { addMenuButton } from '../ui/menuButton.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    // O jogo permanece desenhado abaixo, mas sua Scene está pausada.
    this.add.rectangle(W / 2, H / 2, W, H, 0x030916, 0.78)
      .setInteractive();
    this.add.rectangle(W / 2, H / 2, 480, 365, 0x0a1930, 0.98)
      .setStrokeStyle(2, 0x6098bc);

    this.add.text(W / 2, 142, 'JOGO PAUSADO', {
      fontFamily: 'monospace', fontSize: '37px',
      fontStyle: 'bold', color: '#ffe098',
    }).setOrigin(0.5);

    this.add.text(W / 2, 187, 'A INVASÃO PODE ESPERAR.', {
      fontFamily: 'monospace', fontSize: '15px', color: '#a5d9eb',
    }).setOrigin(0.5);

    const resumeGame = () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    };
    const restartGame = () => {
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
    };
    const returnToMenu = () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    };

    addMenuButton(this, {
      x: W / 2, y: 251, text: '▶  CONTINUAR', onClick: resumeGame, primary: true,
    });
    addMenuButton(this, {
      x: W / 2, y: 317, text: '↻  REINICIAR ONDA', onClick: restartGame,
    });
    addMenuButton(this, {
      x: W / 2, y: 383, text: '⌂  MENU PRINCIPAL', onClick: returnToMenu,
    });

    this.add.text(W / 2, 461, 'ESC OU P: VOLTAR AO JOGO', {
      fontFamily: 'monospace', fontSize: '13px', color: '#9dbdd2',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ESC', resumeGame);
    this.input.keyboard.on('keydown-P', resumeGame);
  }
}
