// Botões retro feitos com objetos Phaser, sem depender de HTML/CSS extra.
export function addMenuButton(scene, {
  x,
  y,
  width = 280,
  height = 52,
  text,
  onClick,
  primary = false,
  fontSize = '19px',
  depth = 10,
}) {
  const defaultColor = primary ? 0x174856 : 0x101e35;
  const hoverColor = primary ? 0x286f78 : 0x1f3554;
  const outlineColor = primary ? 0x7dece3 : 0x7199bc;

  const background = scene.add.rectangle(x, y, width, height, defaultColor, 0.96)
    .setStrokeStyle(2, outlineColor)
    .setDepth(depth)
    .setInteractive({ useHandCursor: true });

  const label = scene.add.text(x, y, text, {
    fontFamily: 'monospace',
    fontSize,
    color: '#f3f9ff',
    fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(depth + 1);

  background.on('pointerover', () => {
    background.setFillStyle(hoverColor, 1);
    label.setColor('#ffffff');
  });
  background.on('pointerout', () => {
    background.setFillStyle(defaultColor, 0.96);
    label.setColor('#f3f9ff');
  });
  background.on('pointerdown', (pointer, _localX, _localY, event) => {
    if (!pointer.leftButtonDown()) return;
    event?.stopPropagation();
    onClick();
  });

  return background;
}
