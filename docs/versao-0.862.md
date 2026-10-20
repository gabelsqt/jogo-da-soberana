# Soberania v0.862 — balanceamento dos reflexos coreanos

## Problema
A bola de discoteca gerava 3/6/12/24 raios por disparo, com 1,8/2,6/3,5/4,5 de dano em CADA raio. No nível máximo eram até 108 pontos por disparo, repetidos durante os 4 segundos do globo.

## Ajustes
- Preservados os **3 / 6 / 12 / 24 raios** e seus arcos visuais (máximo 8 desenhados por salva).
- **Teto total de dano por salva:** **3 / 5 / 7,5 / 10**, respectivamente. Cada raio aplica o orçamento dividido pelo total de raios.
- **Recarga entre salvas de um mesmo globo: 180 ms**. Vários disparos num único frame não criam salvas ilimitadas.
- Se não houver inimigos, nenhuma salva é consumida. Alvos destruídos deixam de ser selecionados.
- A bola continua durando 4 segundos; música, som, visual e demais especiais permanecem inalterados.
- Testes de dano agregado, recarga, remoção de alvos e progressão em `tests/discoGlobe.test.js` e `tests/v1Specials.test.js`, ambos na publicação do GitHub Pages.
