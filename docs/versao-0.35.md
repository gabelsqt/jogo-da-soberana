# Game Soberana — v0.35 (decisões 1–16)

Branch: `feat/enxames-esquadrilhas-v035`. Base de comparação: `feat/arvore-upgrades-dialogos-v032`.
Implementação em PR draft, aguardando avaliação visual e de balanceamento.

## Regras aceitas

1. Cada noite de 30 s cresce em intensidade, começando administrável e terminando mais intensa. Todos os inimigos programados entram antes de 20 s. Se o jogador elimina todas as ameaças após o último spawn, ganha imediatamente (sem espera artificial).
2. Tipo 1: cinco padrões sorteados por grupo a cada partida — serpentina, travessia lateral, ataque cruzado, espiral, enxame disperso. São trajetórias coletivas antes do mergulho.
3. Tipo 1: grupos progressivos, 3–5 no começo da campanha, até 15–18 no final. Fracos individualmente, perigosos pela quantidade.
4. Tipo 1: entrada junta **ou** escalonada, sorteada. Não atacam logo após aparecer.
5. Tipo 1: dança sincronizada; posições relativas preservadas.
6. Tipo 1: após dança, cada nave segue sua própria curva para atacar, mas todo o grupo converge ao mesmo alvo.
7. Tipo 1: alvo é a defesa viva mais próxima do centro do enxame ao fim da dança.
8. Tipo 1: se a defesa cair, as sobreviventes escolhem outra defesa viva próxima e redirecionam a investida coletivamente.
9. Tipo 1: dança dura de 3 a 5 segundos, com duração sorteada por grupo.
10. Tipo 1: perder membros não faz o grupo se reorganizar ou antecipar o ataque; ficam espaços vazios.
11. Tipo 2: manobras táticas alternando formações em V, linha e coluna antes da investida.
12. Tipo 2: ataque mantendo a formação, sem a dispersão do Tipo 1.
13. Tipo 2: esquadrilhas progressivas de 3 a 8 naves.
14. Tipo 2: lacunas dos destruídos permanecem vazias na formação.
15. Tipo 2: manobras duram 2 a 4 segundos, sorteados por esquadrilha.
16. Tipo 2: **B — defesa mais vulnerável** (confirmado como interpretação de “aceitamos as mudanças” ao solicitar a implementação). Escolha por fração restante de vida (70%) e escudo (30%), desempate por proximidade.

### Ajustes adicionais aprovados

- Nome exibido da unidade chinesa: **Panda**, sem mudar o ID interno `cn`.
- Versão **0.35** no menu, no lugar da versão 0.33 que estava sendo planejada.
- Nova branch, sem alterar a branch de trabalho v0.32.

## Notas técnicas

- `formation035.js`: roteiros de dança, formação e ataque, escolha de alvos e reagrupamento dos eventos de campanha.
- `GameScene.js`: instancia grupos compartilhados, controla fases, ataque por prioridade, redirecionamento coletivo e agenda v0.35.
- `labConfig.js`: gera grupos Tipo 1 e 2 no Laboratório nos níveis 1–10.
- `getWaveEvents()` mantém agenda legada para testes de regressão, enquanto a campanha roda `getV035WaveEvents(mode, getWaveEvents(mode))`.
- Regra de vitória antecipada não é modificada; os membros com entrada escalonada já existem na lista de ameaças, impedindo um encerramento antes de aparecerem.

## Critérios de aceitação manual

1. Arena Livre: Tipo 1 nível 1 entra como grupo de 3, dança 3–5s, muda de posição sem perder formação; após dança, dispersa contra a defesa mais próxima.
2. Arena Livre: Tipo 1 nível 10 permite 18 invasores em grupo, com entradas simultâneas ou escalonadas e cinco padrões sorteados.
3. Arena Livre: Tipo 2 nível 1 apresenta três unidades; nível 10, oito. Alterna V/linha/coluna durante 2–4s e ataca organizado.
4. Eliminar membros durante formação deve produzir lacunas até o ataque.
5. Torre destruída: sobreviventes do grupo escolhem alvo novo.
6. Tipo 2 prioriza defesa vulnerável; Tipo 1 prioriza a mais próxima. 
7. Ondas 0 e 9: pressão crescente sem travar desempenho. Clímax antes dos 30s; vitória antecipada ao limpar todos os inimigos depois da última entrada.
8. Canhões aliados, bombardeiros e demais mecânicas v0.32 continuam funcionais.

### Ajuste de balanceamento após Teste 14 (PARCIAL)

- Enxames Tipo 1 nas últimas noites: **15–18** unidades (antes 15–20).
- Arena Livre, Tipo 1 nível 10: **18 naves** (antes 20).
- Vida do Tipo 1 por nível 1–10: **1, 2, 2, 3, 3, 3, 4, 4, 4, 4 HP** (antes 1 até 10 HP, aumentando 1 por nível).
- Tipos 2 a 5 não alterados. Dificuldade do Tipo 1 continua vindo principalmente da quantidade e da coreografia, não de um HP alto.
- **Teste 14B — PASSOU** (confirmado pelo usuário): quantidade de 18 naves e resistência de 4 HP no nível 10 aprovadas; manter os novos valores. Teste 14 original permanece como histórico PARCIAL.

**Status:** Tipo 1 validado no Teste 14B. Próxima verificação: **Teste 15 — manobras e ataque em formação dos Tipo 2**, seguido de balanceamento da campanha.


## Filtro CRT no combate (solicitação de entrega, 17/10/2026)

- Campo de batalha e Arena Livre usam um filtro de transmissão CRT leve.
- Scanlines horizontais estáticas a cada 4 px; vinheta escurece só as bordas; um brilho horizontal quase transparente percorre a imagem aproximadamente a cada 8,5 s.
- Usa `src/ui/crtOverlay.js` com objetos Graphics e Rectangle nativos do Phaser, **sem shader, texturas adicionais, imagens remotas ou pós-processamento**. O filtro é criado uma única vez por GameScene; a atualização só move o brilho e ajusta alpha.
- Profundidades 90–92: acima do cenário, naves e tiros; abaixo do HUD, botões e telas de resultado. Não captura input (sem `setInteractive`); não muda mira, colisões, dano ou cronômetro.
- Não altera menu nem tela de negociação do boteco; a transição CRT completa prevista no GDD é um recurso distinto, ainda pendente.
- Testes automatizados: `tests/crtOverlay035.test.js` (geometria, alpha e respeito à interface).
- Teste manual de entrega: iniciar Onda 0, observar scanlines/vinheta sem perder legibilidade dos projéteis vermelhos e texto branco; conferir pausa, onda 9 e Arena Livre, depois exportar itch.io.
