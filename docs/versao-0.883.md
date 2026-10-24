# Operação Soberania v0.883 — viagem vertical e órbitas amplas

## Foguete Full Brazil — exclusivamente vertical
- **Preparação:** 450 ms, foguete no solo, vibração apenas no eixo Y, brilho dos propulsores aumenta progressivamente.
- **Arrancada:** 550 ms, deslocamento vertical para cima em curva cúbica (aceleração violenta); o conjunto prédio + canhão ultrapassa o topo da tela. Eixo X imutável.
- **Cruzeiro espacial:** 4.000 ms, foguete centralizado e imóvel horizontalmente; estrelas caem de cima para baixo em várias velocidades, com rastros verticais para transmitir a ascensão.
- **Pouso:** 1.000 ms, foguete entra pelo topo, desce estritamente na vertical, desacelera cubic-out ao aproximar-se da cidade e pousa. Shake discreto ao fim da animação.
- Duração total: 6.000 ms. Mantém o container que integra a estrutura do prédio e os PNGs já existentes do canhão.
- A lista de cidades e o corpo-foguete definitivo seguem com placeholders, prontos para receber os sprites do usuário.

## Inimigo Tipo 2 — círculos maiores
- Formação tática: raio horizontal **78 → 140 px**; raio vertical até **125 px** (100 px na Onda 1). Dois giros completos antes de assumir formação e atacar.
- Orbital: raio horizontal **185 → 205 px**, vertical **62 → 120 px**; centro movido para y=215 para evitar que o arco saia pelo topo.
- Movimento preserva formação, alvos, mecânicas de disparo e limites visuais da tela. Atualizados os testes de geometria e da Onda 1.

## Validação
- Novos testes de posições e aceleração vertical, tempos exatos, fluxo de estrelas, amplitude da órbita e limites da tela.
- Atualizado contrato de testes v0.882 para o novo ritmo da viagem.
