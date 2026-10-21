# Operação Soberania v0.879 — Ajustes de potência e Tipo 6

## Tiro secundário do canhão base
- Raio do projétil neutro: 8 → 5 px.
- Explosão neutra: raio reduzido a 58% do anterior (110 → 63,8 px), e dano reduzido a 40%.
- Colisões e visual da explosão usam a mesma escala; especiais nacionais são independentes.

## Coreia, Encore Infinito (nível 10)
- Intervalo dos pulsos de laser: 90 → 160 ms; dano do laser puro coreano: 10,8 → 5,52.
- Contra o Tipo 6: multiplicador adicional de 65% por pulso. Estimativa de HP do boss reflete o DPS real do laser, sem contar balas físicas inexistentes.
- Feixe violeta permanente liga a boca do canhão ao alvo. Filetes brancos, azuis e lilases movem-se continuamente do canhão para o alto; uma única Graphics é redesenhada por frame.

## Rússia, Inverno Eterno (nível 10)
- Dano normal: base 4→3 e fator escalável 0,45→0,35; bônus ao Tipo 6 reduzido de 24→9.
- A estimativa de HP do chefe conserva a duração do combate após essa redução.
- Bombas colossais dentro do cone são desaceleradas a 28% de sua velocidade, recebem 12 de dano por tick e piscam em gelo. Ao perder o HP, explodem no ar.

## Tipo 6, bombardeio e hangar
- O módulo de bombas agora lança **três bombas simultâneas**, separadas lateralmente e convergindo no canhão.
- Cada bomba tem HP reduzido para compensar três alvos em vez de um; dano comum por bomba reduzido para 32. Variantes nacionais continuam identificáveis.
- O hangar libera um grupo de **oito inimigos, um após o outro**, em intervalos de 220 ms, depois de um preparo de 2 segundos.
- Destruir o módulo durante a sequência encerra os lançamentos. Há limite de inimigos ativos por chefe para evitar acúmulo ilimitado.
- Testes adicionados ao workflow do playtest.
