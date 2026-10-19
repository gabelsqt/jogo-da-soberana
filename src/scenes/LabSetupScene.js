import { bindSceneMusic } from '../audio/music.js';
import Phaser from 'phaser';
import { GAME_WIDTH as W, GAME_HEIGHT as H, preloadRioBackdrop, drawRioBackdrop } from '../config/scenery.js';
import { FIRST_UPGRADES } from '../gameplay/upgrades.js';
import { normalizeLabConfig, changeLabWave, changeLabLevel, configuredTowerCountries, configuredTowerLoadout } from '../gameplay/labConfig.js';
import { addMenuButton } from '../ui/menuButton.js';
import {addCuboBroadcastFrame,addCuboPixelText} from '../ui/cuboNewsTheme.js';

export class LabSetupScene extends Phaser.Scene {
  constructor() { super({ key: 'LabSetupScene' }); }
  init(data = {}) { this.config = normalizeLabConfig(data.config); }
  preload() { preloadRioBackdrop(this); }
  create() {
    bindSceneMusic(this, 'setup');
    drawRioBackdrop(this);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0b1621, 0.92).setDepth(30);
    addCuboBroadcastFrame(this,{
      section:'Laboratório de defesa',
      headline:'Arquivo técnico • Simulador experimental',
      footer:'Operação de teste independente da campanha',
      depth:50,
    });
    addCuboPixelText(this,{x:W/2,y:80,text:'Laboratório Soberana',
      size:3,color:'#e2a45e',depth:34,maxWidth:700});
    this.add.text(W / 2, 107, 'Escolha a onda e os níveis • Não altera a campanha', {
      fontFamily:'IBM Plex Sans, system-ui, sans-serif',fontSize:'13px',color:'#b8e9f8',
    }).setOrigin(0.5).setDepth(34);
    this.drawButton(325, 125, '◀', () => this.setConfig(changeLabWave(this.config, -1)), 64);
    this.waveText = this.add.text(W / 2, 125, '', {
      fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '23px', color: '#f8e4a9', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(35);
    this.drawButton(635, 125, '▶', () => this.setConfig(changeLabWave(this.config, 1)), 64);

    this.add.text(W / 2, 174, 'NÍVEIS DE CADA PAÍS (0–8)', {
      fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '16px', color: '#ecf5fa',
    }).setOrigin(0.5).setDepth(35);
    this.levelTexts = {};
    FIRST_UPGRADES.forEach((country, index) => {
      const y = 209 + index * 45;
      this.add.text(215, y, (country.flag + '  ' + (country.shortName ?? country.name)), {
        fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '17px', color: '#ffffff',
      }).setOrigin(0, 0.5).setDepth(35);
      this.drawButton(538, y, '−', () => this.setConfig(changeLabLevel(this.config, country.id, -1)), 49);
      this.levelTexts[country.id] = this.add.text(610, y, '', {
        fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '20px', color: '#9bffe1', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(35);
      this.drawButton(682, y, '+', () => {
        const updated = changeLabLevel(this.config, country.id, 1);
        if (updated.levels[country.id] === this.config.levels[country.id] &&
          [4, 6].includes(this.config.levels[country.id])) {
          this.infoText.setText('LIMITE DE DUAS TORRES. REDUZA OUTRO PAÍS ABAIXO DO NÍVEL 5.');
        } else this.setConfig(updated);
      }, 49);
    });
    this.infoText = this.add.text(W / 2, 452, '', {
      fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '12px', color: '#ffe9b0',
      wordWrap: { width: 890 }, align: 'center',
    }).setOrigin(0.5).setDepth(35);
    addMenuButton(this, { x: 167, y: 492, width: 250, height: 43,
      text: '⌂ MENU', fontSize: '16px',
      onClick: () => this.scene.start('MenuScene'), depth: 40 });
    // Arena sem cronômetro nem spawns automáticos para testar os cinco tipos
    // de inimigos contra qualquer combinação de upgrades selecionada acima.
    addMenuButton(this, { x: 480, y: 492, width: 250, height: 43,
      text: '◎ ARENA LIVRE', fontSize: '16px',
      primary: true, onClick: () => this.scene.start('GameScene', {
        mode: 'lab', labConfig: this.config,
      }), depth: 40 });
    addMenuButton(this, { x: 793, y: 492, width: 250, height: 43,
      text: '▶ TESTAR ONDA', fontSize: '16px',
      onClick: () => this.scene.start('GameScene', {
        mode: 'wave' + this.config.wave, labConfig: this.config,
      }), depth: 40 });
    this.refresh();
  }
  drawButton(x, y, label, action, width) {
    const r = this.add.rectangle(x, y, width, 34, 0x17384d)
      .setStrokeStyle(2, 0x80bdd3).setDepth(33).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, { fontFamily:'IBM Plex Sans, system-ui, sans-serif', fontSize: '21px',
      color: '#e8fcff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(34);
    r.on('pointerdown', (pointer, _lx, _ly, event) => {
      event?.stopPropagation();
      if (pointer.leftButtonDown()) action();
    });
  }
  setConfig(next) { this.config = next; this.refresh(); }
  refresh() {
    this.waveText.setText('ONDA ' + this.config.wave);
    for (const country of FIRST_UPGRADES) {
      this.levelTexts[country.id].setText('' + this.config.levels[country.id]);
    }
    const towers = configuredTowerLoadout(this.config);
    this.infoText.setText('TORRES: ' + towers.length + '/2  •  ESPECIAIS NÍVEL 4 ATIVOS AUTOMATICAMENTE' +
      '  •  ARENA LIVRE: GERAR INIMIGOS MANUALMENTE  •  NÍVEIS 9–10 EM BREVE');
  }
}
