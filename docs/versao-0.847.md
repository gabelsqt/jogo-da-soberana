# v0.847 — Sopro gelado equilibrado contra o Tipo 6

## Causa do dano excessivo
Na v0.846, o sopro russo de nível 10 aplicava o dano **inteiro** a cada módulo do Tipo 6 dentro do cone, a cada 110 ms. Como a fortaleza ocupa quase toda a largura da tela, mirar no meio podia atingir diversos módulos simultaneamente, multiplicando o DPS total.

## Correção
- O cone de gelo ainda permite detectar os quatro módulos nas extremidades e o núcleo quando exposto.
- **A fortaleza inteira recebe um único golpe direto por tick de 110 ms**, direcionado ao alvo cujo centro está mais próximo do eixo da mira.
- Se houver uma barreira principal ativa, continua absorvendo o golpe; ela não deixa dano atravessar.
- O núcleo só recebe dano após ser exposto e se o jogador apontar para ele.
- O valor de dano por tick ao Tipo 6 permanece `28 + danoBásico × 0,45` (na Rússia pura nível 10, 33,616). O nerf vem de não repetir esse dano simultaneamente em vários módulos.
- O sopro segue atingindo **vários inimigos comuns** ao mesmo tempo. O dano normal, congelamento, estilhaços e os gráficos de fumaça não foram alterados.

## Testes
- Testes de seleção por direção da mira, dano em somente um módulo por tick quando o cone cobre múltiplos módulos, e simulações de combate com HP escalado para ondas 10 e 11.
- Nos testes simulados de mira ideal, o Tipo 6 não cai em menos de 20 segundos e pode ser eliminado dentro dos 30 segundos permitidos.
- A validação de dificuldade real ainda depende de jogar no navegador (os chefes se movem e atacam).
- A suíte geral continua bloqueada por testes anteriores não relacionados à mudança; testes específicos da v0.847 passaram no GitHub Actions.
