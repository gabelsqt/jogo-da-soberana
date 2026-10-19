# Soberana v0.49.2 — Mais inimigos, mas menos pressa
19/10/2026 • Branch `feat/brasil2-arraial-balístico`

## Motivo
O playtest da v0.49 mostrou excesso de inimigos na onda 0. A v0.49.1 reduziu a densidade para 16, mantendo as coreografias. Novo feedback: há espaço para mais inimigos, desde que **se movam mais devagar e demorem mais para atirar e investir**.

## Mudanças exclusivas da onda 0
| Propriedade | v0.49.1 | v0.49.2 |
| --- | --- | --- |
| Total de naves | 16 | 22 |
| Quatro formações | 3, 4, 4, 5 | 5, 5, 6, 6 |
| Inícios programados | 1,1 s; 4,6 s; 8,1 s; 11,6 s | 0,9 s; 4,2 s; 7,8 s; 11,4 s |
| Duração da coreografia | 3,5 s | 6,5 s |
| Duração da pausa antes do mergulho | 1,15 s | 3,1 s |
| Primeiro tiro durante a pausa | depois de 0,4 s | depois de 1,5 s |
| Tiros por formação | simultâneos | espaçados em 0,2 s por nave |
| Velocidade das investidas | 100% | 70% |
| Velocidade dos projéteis | 100% | 85% |

As naves continuam disponíveis para serem abatidas desde a entrada, e os tiros inimigos mantêm tamanho/hitbox da v0.49. Ainda não surgem novos grupos depois dos 15 primeiros segundos. Os últimos dez segundos são exclusivos de ataque, conforme decisão 164. **Nenhum ajuste em ondas 1–11, nos upgrades ou na defesa.**

## Arquivos
- `src/gameplay/formation035.js`: configuração pura `WAVE0_EASY_PACING`, usada para formação e testável.
- `src/scenes/GameScene.js`: duração da dança, pausa, atraso de disparos, defasagem, velocidade de investida e de projéteis restritas à onda 0.
- `tests/formation035.test.js`, testes de balanceamento, versão e GDD.

## Critério de avaliação
Confirmar visualmente que as quatro coreografias seguem sincronizadas, existe tempo para identificar e mirar as naves antes do primeiro projétil e a pressão cresce de forma progressiva. Ajustar novos valores somente depois de experimentar o playtest.
