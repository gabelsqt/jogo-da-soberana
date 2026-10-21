# Operação Soberania v0.884 — reforço de casco e retorno do foguete à origem

## Inimigos
- Tipo 4 Caça Relâmpago: HP base 4 → **6** (+50%); HP nível 5 8 → **13**; HP nível 10 13 → **20**. Mantidas velocidade, tamanho de colisão e ataques.
- Tipo 5 Cruzador-Colmeia: HP base 24 → **32** (+33%); HP nível 5 44 → **57**; HP nível 10 64 → **82**. Mantidos ataques, intervalos de invocação e tamanho.
- Tipos 1, 2, 3 e 6 inalterados; atributos especiais de chefes Tipo 6 não afetados.
- Vida em níveis intermediários arredondada para valores inteiros.

## Onda 11 Full Brazil
- O canhão e o corpo do prédio-foguete partem sempre de CANNON.x e preservam esse eixo X até o fim.
- Preparação/ignição e subida extremamente rápida permanecem. A subida agora termina em altitude visível (~184 px), sem teletransportar o foguete para outra posição ao começar o campo estelar.
- Cruzeiro em 4 segundos à mesma altitude, sem oscilação lateral ou mudança de escala.
- Pouso estritamente descendente, desacelerando para **a mesma coordenada vertical de partida** (CANNON.y - 40), com tamanho 100% preservado.
- Camada estelar ampliada para 108 estrelas; tamanhos entre 1 e 5 px, sete cores (branco, azul, ciano, dourado, violeta, rosa) e níveis variados de brilho e velocidade. Rastro e halo se adaptam a tamanho e cor.
- Animação ainda usa corpo-foguete temporário até os sprites definitivos fornecidos pelo usuário.
- duração total segue 6 s, incluindo 4 s de espaço.

## Testes
- Testes de regressão da vida/atributos e das coordenadas do foguete, diversidade de estrelas e alinhamento na entrada/saída de cena.
