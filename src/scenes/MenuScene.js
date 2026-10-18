import { bindSceneMusic, addMusicControls } from '../audio/music.js';
import Phaser from 'phaser';
import {
  GAME_WIDTH as W,
  GAME_HEIGHT as H,
  preloadRioBackdrop,
  drawRioBackdrop,
} from '../config/scenery.js';
import { addMenuButton } from '../ui/menuButton.js';
import { GAME_VERSION_LABEL } from '../config/version.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    preloadRioBackdrop(this);
  }

  create() {
    bindSceneMusic(this, 'menu');
    drawRioBackdrop(this);
    addMusicControls(this, 385);

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

    this.add.text(W / 2, 185, 'DEFESA ANTIAÉREA  •  PLAYTEST V1', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#d2dff2',
    }).setOrigin(0.5).setDepth(22);

    // A versão 1 não oferece mais os antigos laboratórios de animais no menu.
    const startGame = () => this.scene.start('GameScene', { mode: 'wave0', campaign: {choices: []} });
    const testUpgrades = () => this.scene.start('V1PlaytestScene');
    addMenuButton(this, {
      x: W / 2, y: 235, text: '▶  COMEÇAR CAMPANHA V1',
      onClick: startGame, primary: true, depth: 23, width: 360,
    });
    addMenuButton(this, {
      x: W / 2, y: 305, text: '★  TESTAR UPGRADES V1',
      onClick: testUpgrades, depth: 23, width: 340,
    });
    this.add.text(W / 2, 359, '5 PAÍSES • 50 UPGRADES • SEM TORRES ANIMAIS', {
      fontFamily:'monospace',fontSize:'13px',color:'#a2eddb',
    }).setOrigin(0.5).setDepth(23);

    this.add.text(W / 2, 413,
      'MOUSE: MIRAR    ESQUERDO: TIRO    DIREITO: ESPECIAL', {
        fontFamily: 'monospace', fontSize: '13px', color: '#e0ecfa',
      }).setOrigin(0.5).setDepth(22);

    this.add.text(W / 2, 442, 'ESPAÇO: SUPREMA N9  •  ESC/P: PAUSAR  •  R: REINICIAR', {
      fontFamily: 'monospace', fontSize: '13px', color: '#9fc1dd',
    }).setOrigin(0.5).setDepth(22);

    // Rodapé de versão visível tanto no navegador quanto no HTML do itch.io.
    // Fora do painel central para não competir com os botões ou o título.
    this.add.text(W - 16, H - 12, GAME_VERSION_LABEL + ' • PLAYTEST V1', {
      fontFamily: 'monospace', fontSize: '13px',
      color: '#bfd2e9',
      stroke: '#061124', strokeThickness: 3,
    }).setOrigin(1, 1).setDepth(24);

    this.add.text(W / 2, 497, 'PRESSIONE ENTER PARA COMEÇAR', {
      fontFamily: 'monospace', fontSize: '13px', color: '#f5e69b',
    }).setOrigin(0.5).setDepth(22);

    this.input.keyboard.on('keydown-ENTER', startGame);
    
    this.input.keyboard.on('keydown-U', testUpgrades);
  }
}
