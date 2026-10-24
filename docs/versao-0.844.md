# v0.844 — Progressão de cadência e velocidade do tiro russo

As melhorias primárias da Rússia agora aumentam a **cadência dos disparos** e a **velocidade dos projéteis**. Antes, esses valores praticamente não progrediam até a transformação.

| Nível da Rússia | Intervalo entre disparos | Tiros por segundo | Velocidade do projétil |
| --- | ---: | ---: | ---: |
| Sem Rússia | 400 ms | 2,50 | 480 px/s |
| 1 — Geada Siberiana | 336 ms | 2,98 | 528 px/s |
| 3 — Inverno Russo | 276 ms | 3,62 | 591 px/s |
| 5 — Estilhaço Siberiano | 223 ms | 4,48 | 662 px/s |
| 7 — Zero Absoluto | 183 ms | 5,46 | 742 px/s |

- Os níveis pares (2, 4, 6, 8) permanecem dedicados ao **tiro especial** e não alteram a cadência do disparo primário.
- Os valores acima consideram uma campanha com **apenas** melhorias russas. O sistema aplica multiplicadores que se combinam com upgrades de outros países, inclusive os bônus brasileiros de cadência.
- Dano, congelamento, estilhaços, progressão do especial e Supremo não foram alterados.
- A transformação do nível 10 continua substituindo o tiro normal pelo sopro gelado em cone, com a cadência própria de dano da névoa, como na v0.843.
- Novos testes: `tests/russianFireRate.test.js`.
- Necessário validar o equilíbrio no navegador com as builds híbridas e conferir a execução dos testes automatizados.
