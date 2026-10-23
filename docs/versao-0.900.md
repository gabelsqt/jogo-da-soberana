# Operação Soberania v0.900 — Sem botão de pausa na tela

O comando de pausa permanece acessível via teclado, mas o elemento visual
PAUSAR [P] não aparece mais durante o combate.

## Implementação
- Em `src/scenes/GameScene.js`, removida a chamada
  `mountPauseHudButton`, assim como o botão alternativo de Phaser que
  aparecia quando o DOM da interface estava indisponível.
- Mantidos os atalhos `KeyP` e `Escape`, além de `pauseGame()` e da
  cena `PauseScene`, incluindo a retomada pela interface da pausa.
- O arquivo `src/ui/pauseHudButton.js` continua disponível como
  utilitário legado, porém deixou de ser invocado pela cena jogável.
- `tests/pauseHudResponsive.test.js` garante que `GameScene` não
  monta nenhum botão e conserva os atalhos.

Nenhuma alteração em HUD de notícias, efeitos ou gameplay.
