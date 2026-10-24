# v0.906 — Retirada, abertura e laboratório

- Tipo 1 do prólogo mantém proporção nativa e altura de 72 px, como no combate.
- Retirada do prólogo dura 6,5 s, escalonada, com desaparecimento somente perto dos portais. Retirada comum dura 4,2 s.
- A abertura bloqueia armas e spawns até encerrar o relógio central; reentradas e callbacks de animações antigas são ignorados, inclusive no fallback.
- Ao concluir uma fase nos laboratórios: seguir as ondas da campanha mantendo o armamento experimental ou voltar ao editor com as seleções preservadas. A onda 11 oferece retorno; não existe onda 12. Não converte alocações experimentais em compras da campanha.
- Escudos com resistência usam uma regra compartilhada: azul >75%; verde >50–75%; amarelo >25–50%; vermelho ≤25%. Aplicada à malha inteira do canhão, apoios, Tipo 5, módulos e barreira do Tipo 6. Flashes brancos transitórios preservados. O Grande Muro não perde HP e mantém o azul e a bandeira.
