# v0.82 — Sistema genérico de variação de efeitos

`src/audio/sfx.js` disponibiliza `SFX_VARIATIONS`, um registro por ID de som com campos opcionais `pitch` e `volume`, ambos `[mínimo,máximo]` em multiplicadores. Sem configuração, o som toca original.

Exemplo para futuros sons:

```js
laser: { pitch: [0.96, 1.04], volume: [0.9, 1.0] }
```

Faixas existentes: canhão ±5% de pitch / ±4% de volume; explosão comum ±7% / ±6%; chefe ±4% / ±3%. Volume aleatório é aplicado sobre volume global × volumeScale existente, sem mudar limites de repetição. `playbackRate` também afeta discretamente a duração. Função de amostragem exportada e testes adicionais.

Validação no navegador e execução completa de testes pendentes.
