# v0.842 — Geada Siberiana: estilhaçamento visível

- Confirmada a lógica já implementada do **tiro normal russo**: atingiu → congela o alvo; se o alvo morrer enquanto congelado, sofre estilhaçamento que causa dano aos inimigos vizinhos.
- O visual antigo de círculos e linhas foi substituído por cristais de gelo em movimento radial, com rotação e dissipação suave; continua existindo uma breve onda de choque gelada.
- O dano é calculado instantaneamente pelo raio de estilhaçamento, **independentemente dos cristais visíveis**. Não adicionamos novos projéteis físicos nem alteramos dano, raio, duração do gelo ou progressão dos upgrades.
- O efeito visual limita a quantidade global de cristais simultâneos a 64 para manter desempenho em batalhas cheias, sem perder dano.
- Tipo 6 continua imune ao congelamento direto, de acordo com a lógica atual; a onda de estilhaços ainda pode danificar seus módulos.
- Atualizados testes de `russianFrost.test.js` para geometria, limites e independência do dano.
- A execução de testes completos e a validação visual no navegador permanecem pendentes.
