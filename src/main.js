import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { PrologueSurvivalScene } from './scenes/PrologueSurvivalScene.js';
import { PrologueRepairScene } from './scenes/PrologueRepairScene.js';
import { BotecoElevatorScene } from './scenes/BotecoElevatorScene.js';
import { V1PlaytestScene } from './scenes/V1PlaytestScene.js';
import { GameScene } from './scenes/GameScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { ZecaRecoveryScene } from './scenes/ZecaRecoveryScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { UpgradeScene } from './scenes/UpgradeScene.js';
import { LabSetupScene } from './scenes/LabSetupScene.js';
import { WaveMakerScene } from './scenes/WaveMakerScene.js';
import { EnemyMakerScene } from './scenes/EnemyMakerScene.js';
import { UpgradeLabScene } from './scenes/UpgradeLabScene.js';
import { installResponsiveViewport } from './config/responsive.js';

// 960 × 540 já é 16:9. Phaser amplia até 1920 × 1080 sem
// mudar o tamanho lógico de sprites, hitboxes e coordenadas.
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#080f20',
  pixelArt: true,
  render: { antialias: false, roundPixels: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, IntroScene, PrologueSurvivalScene, PrologueRepairScene, BotecoElevatorScene, V1PlaytestScene, GameScene, EndingScene, ZecaRecoveryScene, PauseScene, UpgradeScene, UpgradeLabScene, LabSetupScene, WaveMakerScene, EnemyMakerScene],
});

// O #viewport é a moldura com safe areas; #game continua sem padding,
// para o ScaleManager FIT centralizar o canvas corretamente.
installResponsiveViewport(game, {
  root: document.getElementById('viewport'),
  notice: document.getElementById('rotate-notice'),
  environment: window,
});
