# Soberana v0.49.3 — Cinco portais, 48 naves, voos mais lentos

Data: 19/10/2026. Branch: `feat/brasil2-arraial-balístico`. A `main` permanece intacta.

## Feedback
A v0.49.2 trouxe quatro grupos de 22 naves com dança lenta e tiros atrasados. O novo pedido foi voltar a ter **48 inimigos na onda 0**, distribuídos em **cinco portais**: primeiro um sozinho, depois dois simultâneos e depois mais dois simultâneos. O ritmo mais lento das naves passa a ser característica geral do inimigo, e não exclusiva da primeira onda.

## Cronograma da onda 0

| Entrada | Tempo programado | Portal X | Naves |
| --- | --- | --- | --- |
| 1 — isolado | 0,8 s | 480 (central) | 8 |
| 2 — par simultâneo | 4,6 s | 235 (esquerda) | 10 |
| 3 — par simultâneo | 4,6 s | 725 (direita) | 10 |
| 4 — par simultâneo | 9,6 s | 125 (extremo esquerdo) | 10 |
| 5 — par simultâneo | 9,6 s | 835 (extremo direito) | 10 |
| **Total** | | **5 portais únicos** | **48** |

Ao contrário da lógica histórica, os cinco portais da onda 0 usam suas coordenadas X exatas, em vez de encaixar artificialmente em três corredores. As naves saem de cada portal em sequência de 320 ms depois da abertura; a última entrada fica antes de 15 segundos decorridos, como exigem as decisões anteriores.

## Ritmo
- Velocidade-base global para inimigos comuns (Tipos 1–5): `STANDARD_INVADER_FLIGHT_FACTOR=0.78` multiplicado por `definition.speed` em todas as ondas.
- Durações das coreografias dos enxames e esquadrilhas nas ondas 1–11 são divididas por `0.78`; elas ocupam a mesma trajetória, mas levam mais tempo para concluí-la.
- Na onda 0 mantém-se `WAVE0_EASY_PACING`: dança de 6,5 s, pausa de 3,1 s, primeiros disparos após 1,5 s + 0,2 s por membro, mergulhos com multiplicador 0,70 e projéteis com velocidade 0,85.
- Chefões Tipo 6 preservam mecânicas e velocidades próprias para que o balanceamento especial das ondas 10/11 não seja modificado.

## Arquivos
- `src/gameplay/formation035.js`: sequência imutável `WAVE0_PORTAL_SEQUENCE` e fator de velocidade global `STANDARD_INVADER_FLIGHT_FACTOR`.
- `src/scenes/GameScene.js`: preserva as coordenadas explícitas dos cinco portais, aplica o fator aos inimigos comuns e à duração das formações.
- `tests/formation035.test.js`: confirma número exato de naves, portal único seguido dos pares simultâneos, posições distintas, prazo final e multiplicador.
- `docs/GDD.md`: registro do novo balanceamento.

## Atenção no teste manual
Avaliar se 48 naves deixam o cenário legível quando os dois pares chegam; verificar se os disparos permanecem interceptáveis e as coreografias lentas continuam bonitas. A velocidade dos voos comuns foi alterada também nas outras ondas, portanto vale observar a dificuldade nas ondas 1–9 além da abertura.
