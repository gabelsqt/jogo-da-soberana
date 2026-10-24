# v0.76 — Correção de retratos

- Corrige deformação geométrica dos PNGs quadrados 384×384: cartões exibem 106×106 (em vez de 106×125); diálogo usa 136×136 (em vez de 136×150).
- Aplica filtro linear exclusivamente às dez texturas de retratos, reduzindo moiré/aliasing causado pela redução 384→106; o jogo mantém pixelArt global.
- Mantém layout, interação e código de combate existentes.
- Validar visualmente no boteco, incluindo seleção ampliada e diálogo; execução de testes/build e inspeção em navegador ainda pendentes.
