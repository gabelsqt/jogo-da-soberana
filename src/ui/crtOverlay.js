// Filtro CRT leve para o campo de batalha (v0.35).
// Usa formas nativas do Phaser: sem shaders, assets extras ou render textures.
// Desenha uma vez e só movimenta um feixe discreto, preservando a pixel art.

export const CRT_SCANLINE_SPACING = 4;
export const CRT_FILTER_DEPTH = 90; // acima do combate, abaixo do HUD (100+)
export const CRT_SWEEP_PERIOD_MS = 8500;

export function crtScanlineRows(height, spacing = CRT_SCANLINE_SPACING) {
  const rows = [];
  for (let y = 1; y < height; y += spacing) rows.push(y);
  return rows;
}

export function crtVignetteBands(width, height, thickness = 8, steps = 12) {
  const bands = [];
  for (let i = 0; i < steps; i += 1) {
    // Máximo de 16% na borda, rapidamente desaparecendo no centro.
    const strength = 0.16 * (1 - i / steps) ** 2;
    const x = i * thickness;
    const y = i * thickness;
    bands.push(
      { x, y: 0, width: thickness, height, alpha: strength },
      { x: width - x - thickness, y: 0, width: thickness, height, alpha: strength },
      { x: 0, y, width, height: thickness, alpha: strength },
      { x: 0, y: height - y - thickness, width, height: thickness, alpha: strength },
    );
  }
  return bands;
}

export function crtSweepY(timeMs, height) {
  const t = ((Math.max(0, timeMs) % CRT_SWEEP_PERIOD_MS) / CRT_SWEEP_PERIOD_MS);
  return Math.round(t * (height + 36) - 18);
}

export function crtScanlinePulse(timeMs) {
  // Variação suave sem flashes estroboscópicos.
  return 0.91 + 0.045 * Math.sin(Math.max(0, timeMs) * 0.0017);
}

export function createCombatCrtOverlay(scene, width = 960, height = 540) {
  const scanlines = scene.add.graphics().setDepth(CRT_FILTER_DEPTH);
  scanlines.lineStyle(1, 0x040915, 0.18);
  for (const y of crtScanlineRows(height)) {
    scanlines.lineBetween(0, y + 0.5, width, y + 0.5);
  }

  const vignette = scene.add.graphics().setDepth(CRT_FILTER_DEPTH + 1);
  for (const band of crtVignetteBands(width, height)) {
    vignette.fillStyle(0x020710, band.alpha);
    vignette.fillRect(band.x, band.y, band.width, band.height);
  }
  vignette.lineStyle(1, 0x9dcad9, 0.075);
  vignette.strokeRect(0, 0, width, height);

  // A varredura é quase imperceptível: não interfere nos tiros, nos inimigos,
  // nas zonas de colisão nem captura cliques (sem setInteractive).
  const sweep = scene.add.rectangle(width / 2, -18, width, 18, 0x7faab5, 0.035)
    .setDepth(CRT_FILTER_DEPTH + 2);

  return {
    scanlines, vignette, sweep,
    update(timeMs) {
      scanlines.setAlpha(crtScanlinePulse(timeMs));
      sweep.y = crtSweepY(timeMs, height);
    },
  };
}
