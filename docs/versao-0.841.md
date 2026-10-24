# v0.841 — Canhão mira e dispara a partir da boca

- A direção visual deixa de ser limitada aos nove ângulos originais do spritesheet. O jogo escolhe o quadro mais próximo do ângulo real e gira somente o cano pelo restante do ângulo, inclusive nos extremos quase horizontais.
- Calibrados nove pares (pivô, boca) nos PNGs `barrel_0` a `barrel_8` (180 × 190). Origem de cada sprite é ajustada ao mesmo ponto da articulação; base e cobertura circular permanecem fixas.
- Tiros começam no ponto calculado da boca do cano visível, e não em uma distância arbitrária de 76 px a partir do centro da defesa. Recuo do cano também é considerado. Projéteis mantêm ângulo, velocidade e dano originais.
- Na falta dos assets, canhão vetorial e cálculo antigo de origem continuam disponíveis.
- Testes unitários adicionados em `tests/cannonSpriteAim.test.js` para pivô fixo, boca alinhada, extremos e recuo.
- A animação de fogo/fumaça continua para etapa posterior. Testes de execução completa do Phaser no navegador ainda pendentes.
