# Operação Soberania v0.898 — Grande Muro poderoso e proteção contra travamentos

## O que foi observado
- Print com contador no último segundo, sem exceção JavaScript no console.
  Os avisos amarelos eram de autoplay de áudio e WebGL.
- A imagem, por si só, não comprova a causa exata da pausa; a mudança
  implementa caminhos redundantes que tornam as transições mais resilientes.

## Proteções de transição
- Ao encerrar uma onda comum pelo amanhecer, o contador é travado de propósito
  durante a fuga (1,75 segundo). A função idempotente
  `finishDawnWithdrawal()` executa a passagem de tela.
- Além do evento atrasado do Phaser, o próprio `update()` faz uma
  verificação redundante após 1,9 s, evitando bloqueio permanente
  quando o callback de saída falha.
- O início de uma nova onda possui proteção equivalente: depois de
  5,8 s, caso a animação DOM do relógio permaneça ativa, libera o combate.
- As regras de pausa deliberada, Supremo e intro do Tipo 6 são preservadas.

## Grande Muro (EUA)
- Mantém 120 graus, posição pela mira, seis segundos de defesa e
  resistência ilimitada contra colisões e tiros comuns.
- Cada contato usa um impulso externo de **1000 px/s** (antes: 260 px/s
  num deslocamento puramente visual). O recuo agora afasta a hitbox
  real durante vários quadros e retorna suavemente ao caminho original.
- Limite de deslocamento de **172 pixels**, amortecimento gradual,
  e 520 ms de espera entre impulsos no mesmo inimigo.
- Continua **sem dano de contato**.
- Tiros padrão dos Tipos 1 e 2 têm `reflectable: true`. Ao tocar o muro,
  viram esferas de energia azul-clara em uma lista separada e são
  removidos do conjunto de disparos hostis.
- O ricochete viaja a 410 px/s rumo ao atirador (ou ao inimigo mais
  próximo, se o original morreu), causa 3 de dano por colisão e é
  destruído depois de um único impacto ou 2,4 s.
- São permitidos, no máximo, 32 ricochetes simultâneos para
  evitar acúmulo em partidas com muitas balas.
- Bombas colossais, ataques de congelamento e mísseis especiais
  continuam interceptados sem devolver energia.
- Laser de cerco e superarma final do Tipo 6 ainda podem quebrar o
  Grande Muro como antes.

## Testes
- `tests/americanWallBounce898.test.js` verifica distância de repulsão,
  reflexão e guardas contra bloqueio de transições.
- Teste de integração antigo atualizado: não exige mais o impulso de 260.
- Sem alterar a curva de população de spawns da v0.894.
