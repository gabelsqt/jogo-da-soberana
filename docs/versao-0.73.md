# Game Soberana v0.73 — Botão Pausar Responsivo

## Problema corrigido

No Firefox e em alguns layouts do navegador, o botão **Ⅱ PAUSAR [P]** era cortado pelo topo do jogo. Ele estava desenhado em `y=20` dentro da câmera Phaser, portanto era afetado pelo zoom de introdução (`1,48×`) e podia ficar fora da região visível.

## Implementação

- O botão agora é um **elemento HTML sobreposto ao viewport**, não um objeto da câmera Phaser. Mantém-se fixo e visível durante zooms e movimentos de câmera.
- Continua **centralizado horizontalmente**, com tamanho responsivo e **margem segura de pelo menos 16px** em relação ao topo visível e à safe area. Se a composição do canvas está parcialmente cortada, a posição é limitada à área visível do browser.
- Recalcula após resize da janela, resize do `visualViewport`, alteração da faixa Cubo News e redimensionamento do Phaser, usando `requestAnimationFrame` após o layout.
- Clicar/tocar pausa continua abrindo `PauseScene`. O botão é ocultado durante a pausa, reaparece ao retomar e é **removido na saída da cena**, com limpeza de listeners. Teclas **P/ESC** preservadas.
- Existe fallback Phaser em `y=68` para execução sem DOM.
- Arquivos: `src/ui/pauseHudButton.js` (novo), `src/scenes/GameScene.js`, `tests/pauseHudResponsive.test.js`, GDD e checklist.

## Como testar

```bash
git pull
npm test
npm run build
npm run dev
```

Abrir a onda 1 e aguardar a contagem de 30 segundos. O botão deve continuar totalmente visível e centralizado durante e depois do zoom. Conferir em janela pequena, tela cheia, zoom de navegador, modo paisagem e PauseScene.

**Validação realizada:** parser JavaScript dos arquivos alterados e simulação da função de posicionamento, clique, pausa/retomada e limpeza dos eventos. **Não foram executados neste ambiente o build Vite, suíte de testes integral ou inspeção em browser real.**
