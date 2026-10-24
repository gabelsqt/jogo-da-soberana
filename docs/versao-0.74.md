# Game Soberana v0.74 — Protocolo Supremo sem conflito de teclas

## Problema identificado
O sistema do Supremo exigia digitar uma palavra, mas `GameScene` também registrava ações globais em letras dessas palavras. O atalho **R reiniciava a partida**, e **P pausava** mesmo durante a digitação. O Supremo só abre nos cinco segundos finais de uma onda; anteriormente o combate ainda consumia tempo durante a entrada do código. Além disso, controles HTML podiam manter o foco após a introdução ou pausa.

## Alterações implementadas
- Removido **reinício por R** durante a partida. **F também não tem ação de reinício** no controlador do jogo. Reiniciar continua disponível apenas por escolha deliberada em interfaces apropriadas.
- Controles de teclado concentrados em um único despachante: enquanto `supremeTyping` está ativo, **todas as letras**, inclusive **R, F e P**, são encaminhadas exclusivamente ao protocolo. Fora dele, **P/Esc pausam** e **Espaço** tenta abrir o Supremo.
- Criado `src/gameplay/supremeCodeInput.js`, com códigos oficiais: Brasil **REVEILLON**, EUA **FREEDOM**, Rússia **SPUTNIK**, China **ENTREGA** e Coreia **ENCORE**. Backspace corrige, Esc cancela; caracteres errados dão feedback visível, sem reinícios ou pausas.
- No intervalo em que o Supremo estiver aberto, `GameScene.update` não avança a simulação, e o relógio e as tweens do Phaser ficam com velocidade zero. Ao concluir ou cancelar, a velocidade anterior é restaurada. Assim não é preciso digitar em menos de cinco segundos.
- Regra preservada: o código do Supremo só pode ser aberto nos **últimos cinco segundos**. Se o jogador apertar Espaço cedo demais, o jogo explica a restrição. Quando o código está disponível, exibe **★ SUPREMO PRONTO — ESPAÇO** (o indicador anterior estava oculto nas ondas).
- Corrigidas as quebras de linha do painel de digitação.
- Ao entrar em GameScene ou abrir o Supremo, o foco de controles HTML da introdução é liberado. Clicar em **PAUSAR** também retira o foco do botão HTML para que a tecla Espaço seja usada pelo jogo, e não pelo navegador para clicar no botão.
- Os saltos de ondas em builds de desenvolvimento continuam disponíveis, mas exigem **Ctrl+Alt+Shift+número**, evitando mudanças acidentais por Shift+número.
- Não foi alterada a lógica de dano, escolha de país, Supremo ou final da campanha.

## Arquivos modificados
- `src/scenes/GameScene.js` — despachante de teclado, feedback, congelamento de tempo, correção de foco.
- `src/gameplay/supremeCodeInput.js` — entrada do Supremo sem ações colaterais.
- `src/ui/pauseHudButton.js` — liberar foco do botão Pausar.
- `tests/supremeCodeInput.test.js` — cinco países, cancelamento, correção e atalhos R/F/P.
- `src/config/version.js`, `package.json`, GDD e checklist — versão 0.74.

## Como validar
```bash
git pull
npm test
npm run build
npm run dev
```

Testar builds Brasil, EUA, Rússia, China e Coreia com o Supremo desbloqueado. Nos cinco segundos finais, pressionar **Espaço**; digitar o código; conferir que **R, F e P** não interferem. Repetir com erro + Backspace, Esc para cancelar e clique em pausa seguido de retomada.

**Verificado isoladamente:** os códigos dos seis IDs técnicos (cinco países e alias `kr`) foram digitados com êxito usando os métodos reais de `GameScene` em simulação JS; o relógio congela durante entrada e restaura ao concluir. Os testes completos via `npm test`, build Vite e inspeção visual no navegador ainda não foram executados no ambiente de edição.
