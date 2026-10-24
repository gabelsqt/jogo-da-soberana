# Versão 0.46 — Cubo News pixel art e tempo até o amanhecer
Data: 19/10/2026 | Branch: `feat/brasil2-arraial-balístico`.

## Contexto da mudança
A versão 0.45 separou a faixa inferior do canvas, mas ela ainda tinha aparência de telejornal moderno, fonte suave e um cronômetro `00:30`. A abertura de cada onda continuava com a contagem 3–2–1, sem apresentar explicitamente o tempo limite.

## Novidades implementadas
1. **Tipografia totalmente pixelada:** glifos bitmap próprios de 5×7 pixels para título da notícia, selo Cubo News, subtítulo que percorre a tela e números do relógio. Os pixels são realmente desenhados em pequenos blocos, em vez de simular uma fonte pixelada com CSS. Sem font CDN/asset externo; funciona no HTML único exportado para itch.io.
2. **Cronômetro maior e mais simples:** somente segundos `30, 29, ... 1, 0` nas ondas normais; `60, 59, ...` nas ondas finais. Sem prefixo `00:`, sem zeros à esquerda ou caixa. Mantém transparência e tom vermelho nos últimos 5 s.
3. **“Tempo até o amanhecer”:** todas as ondas apresentam um cartão central com o texto `TEMPO ATÉ O AMANHECER` e o valor inicial completo. Depois da pausa de leitura, o mesmo número desliza até a posição do relógio à direita; apenas **ao terminar esse movimento** entram em operação o cronômetro, as armas e os spawns. A abertura substitui 3–2–1 e é pausável junto à cena. 
4. **Regra de alvo do Tipo 6 preservada:** mesmo após a apresentação do tempo, a contagem das ondas 10/11 não avança durante a entrada do chefão nem durante o intervalo anterior ao spawn; só começa quando a fortaleza está alvejável.
5. **Premissa ficcional que explica a invasão noturna:** os ETs garantiram sair ao amanhecer quando o **Líder Supremo** cruzar os braços. A expressão se refere ao **Cristo Redentor**, que permanece de braços abertos e não pode satisfazer a condição; os ETs continuam o ataque noturno. Até a onda 9, a Cubo News se sente aliviada, anuncia boas perspectivas e insiste que a promessa está prestes a ser cumprida.
6. **Cobertura por fase:** novos bancos `dawnPromise`, `dawnRoutine` e `dawnEmergency` apresentam ironias otimistas das ondas 0–9. O pânico real, com sirene e alerta “catástrofe”, é reservado aos chefões das ondas 10/11. A mecânica de publicidade e revisão hipócrita de manchetes permanece.
7. **Faixa sem invadir o cenário:** o selo vermelho fica dentro da faixa externa, e nenhuma borda invade os prédios ou o canhão. HUD/abertura são DOM externo independente do zoom e do screenshake.

## Arquivos relevantes
- `src/ui/pixelFont.js` — atlas lógico 5×7 e desenhista de glifos.
- `src/ui/cuboNewsHud.js` — clock em segundos, desenho de headline/ticker em canvas DOM e animação de relógio central para o canto.
- `index.html` — marca, textos e relógio em canvases bitmap, cartão de tempo no começo da onda.
- `src/gameplay/cuboNews.js` — tom editorial por fase e histórias de amanhecer.
- `src/scenes/GameScene.js` — bloqueia combate enquanto o número se desloca, preserva tempo congelado do chefe.
- `tests/cuboNews.test.js`, `tests/cuboNewsDomHud.test.js` e `tests/pixelHudDawnIntro.test.js` — testes de regressão e lógica visual.

## QA
- `npm test` e `npm run build:itch` na branch pelo workflow do GitHub Actions.
- A validação em navegador real é o passo seguinte para polimento de tamanhos, ritmo e leitura em telas pequenas; testes de unidade não substituem checagem visual.
