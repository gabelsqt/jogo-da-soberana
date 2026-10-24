# Operação Soberania v0.894 — Escalada gradual das ondas 0–9

## Problema corrigido
A onda 2 tinha sido limitada a 26 naves agendadas, mas a versão jogável
ainda expandia as formações das ondas 3 e 4 para, respectivamente, 99 e 97
naves. As ondas 5–9 também herdavam o expansor antigo de enxames.
Isso criava saltos abruptos e excesso de inimigos em tela.

## Quantidades oficiais de inimigos agendados
| Onda | Total | Tipo 1 | Tipo 2 | Tipo 3 | Tipo 4 | Tipo 5 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 20 | 20 | 0 | 0 | 0 | 0 |
| 1 | 23 | 15 | 8 | 0 | 0 | 0 |
| 2 | 26 | 15 | 11 | 0 | 0 | 0 |
| 3 | 33 | 18 | 9 | 3 | 3 | 0 |
| 4 | 40 | 21 | 11 | 4 | 4 | 0 |
| 5 | 47 | 24 | 14 | 5 | 4 | 0 |
| 6 | 53 | 26 | 15 | 6 | 6 | 0 |
| 7 | 59 | 29 | 20 | 4 | 6 | 0 |
| 8 | 65 | 32 | 21 | 4 | 7 | 1 |
| 9 | 71 | 34 | 24 | 5 | 7 | 1 |

As naves efetivamente **vivas** simultaneamente dependem dos abates,
da movimentação e do tempo de abertura de portais. Os números acima são
totais programados, não um máximo de unidades simultâneas. Na onda 8 e
na onda 9, o Tipo 5 ainda pode invocar até 12 unidades adicionais
conforme a mecânica existente, fora da contagem agendada.

## Identidades preservadas
- **Onda 0:** os cinco portais e sua ordem original (centro, dois pares).
- **Onda 1:** voos mais baixos, pequenos enxames e atiradores limitados.
- **Onda 2:** permanece com 26 naves e só Tipos 1 e 2.
- **Onda 3:** primeiras pinças com bombardeiros e caças; pressão controlada.
- **Onda 4:** inimigos reforçados de nível 3 e duas pinças completas.
- **Onda 5:** escoltas de bombardeiros.
- **Onda 6:** leques de bombas e ataques cruzados.
- **Onda 7:** duas órbitas de formação.
- **Onda 8:** primeiro cruzador Tipo 5 da campanha.
- **Onda 9:** cerco final com cruzador e formações combinadas.

## Implementação
- `src/gameplay/campaignWavePacing.js` fornece as agendas explícitas
  das ondas 3–9 e a tabela de quantidade esperada para 0–9.
- `src/gameplay/formation035.js` aplica essas agendas e reduz os portais
  introdutórios das ondas 0 e 1. Os valores legados de `waves.js` permanecem
  acessíveis a ferramentas que os utilizavam, mas não são mais a agenda jogável
  das ondas 3–9.
- `tests/progressiveWaveSpawns.test.js` verifica os totais, a composição,
  o aumento estrito de população, as pinças, os chefes e o teto de 15 s
  de entrada por portal. Testes antigos de formação foram atualizados.
- Tempo de onda, vida dos inimigos, resistência dos módulos e dano de projéteis
  não foram alterados neste patch.
