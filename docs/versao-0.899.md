# Operação Soberania v0.899 — Grande Muro sólido

## Diagnóstico

A v0.898 aplicava apenas um impulso quando a posição atual do inimigo
intersectava o arco. Em movimentos rápidos, uma nave podia passar de um
lado para outro entre quadros sem ocupar a zona de contato em nenhuma
amostragem. Além disso, a fase de mergulho podia concluir sua rota e causar
dano antes de o sistema do muro aplicar repulsão.

## Colisão contínua e face externa

- `solidAmericanWallCollision` usa interseção matemática entre o segmento
  percorrido pela nave e a face externa do arco circular de 120°.
- Calcula o **primeiro instante de contato**, mesmo se o movimento for tão
  rápido que os pontos inicial e final estejam fora da faixa visual.
- Projeta o inimigo para a **face externa**, com pequena margem de separação.
  Isso impede que o casco apareça do lado de dentro depois de uma investida.
- Ambas as pontas do arco recebem colisão arredondada; sair pelas laterais
  **fora do arco** ainda é permitido. O escudo não vira um círculo de 360°.
- Se o muro se materializar por cima de uma nave perto da borda,
  ela é reposicionada para fora, sem dano.

## Bloqueio das investidas

- O método `blockEnemyWithAmericanWall` funciona dentro de
  `updateEnemies`, depois do movimento e antes da conclusão da investida,
  em vez de depender exclusivamente de `updateAmericanWalls`.
- No estado `dive`, a colisão acontece **antes** de `removeEnemy` e
  `damageTarget`; a nave entra em `wallRepelled` por 0,48 s,
  sofre o impulso e depois recalcula sua rota ofensiva.
- O deslocamento do muro continua acompanhado da hitbox real,
  preservando o impulso forte de 1.000 px/s.
- Naves congeladas também são verificadas contra a barreira ativa.

## Escopo preservado

- Muro de 120°, 6 s, 14 s de recarga, visual de bandeira e projeção pela mira.
- Reflexão de tiros básicos dos Tipos 1 e 2, absorção dos demais projéteis.
- Nenhum dano por contato do muro.
- O casco Tipo 6 não recebe essa colisão física; lasers de cerco do
  Tipo 6 continuam podendo destruir o muro conforme as regras anteriores.

## Cobertura automatizada

`tests/americanWallSolid899.test.js` exercita passagem rápida, colisão
nas extremidades, movimento fora dos 120°, liberação de inimigos já do lado
interno e precedência de colisão antes de dano de mergulho.
