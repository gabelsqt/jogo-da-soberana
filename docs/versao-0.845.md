# v0.845 — Dano crescente na Rússia

A progressão russa agora aumenta dano direto e estilhaçamento ao longo dos upgrades primários, além dos ganhos de velocidade/cadência entregues na v0.844.

| Upgrade russo | Dano por tiro normal | Dano por estilhaçamento | Raio de estilhaçamento |
| --- | ---: | ---: | ---: |
| 1 — Geada Siberiana | 1,75 | 2 | 44 px |
| 3 — Inverno Russo | 2,35 | 4 | 60 px |
| 5 — Estilhaço Siberiano | 3,40 | 7 | 76 px |
| 7 — Zero Absoluto | 4,80 | 12 | 96 px |
| 10 — Inverno Eterno | Sopro: 5,616 por tick (110 ms) | 18 | 120 px |

- Níveis pares continuam melhorando apenas o especial e não ampliam o dano direto ou os estilhaços.
- O congelamento do tiro primário e a área atingida pelos estilhaços seguem iguais. O dano dos estilhaços continua independente do número de partículas visuais.
- Um inimigo congelado que morre sob qualquer dano continua estilhaçando: é possível eliminar outros congelados e desencadear novas explosões. Cada inimigo só explode uma vez.
- O sopro da transformação russa usa o dano básico aumentado vezes 0,45 por tick, mantendo o cone e a cadência da v0.843; foi reforçado automaticamente pela progressão.
- Multiplicadores do Brasil e dos outros países continuam combináveis; teste adicional de build híbrida com Brasil incluído.
- Novos testes `tests/russianDamageProgression.test.js`; teste de `russianFrost.test.js` atualizado.
- Pendente validação auditiva e visual no navegador. A suíte de integração possui testes legados com expectativas incompatíveis com mudanças anteriores do projeto.
