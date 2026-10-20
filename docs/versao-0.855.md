# Soberania v0.855 — Trilhas dos finais e Game Over

## Faixas recebidas na branch `feat/brasil2-arraial-balístico`
- `Game Over.mp3`: vinheta sem loop ao abrir uma tela de derrota comum ou de chefe final.
- `Colonização Americana.mp3`: epílogo de derrota aos EUA.
- `Colonização Russa- frozen expedition.mp3`: epílogo de derrota à Rússia.
- `Colonização Chinesa - 快遞旋律.mp3`: epílogo de derrota à China.
- `Ondas Iniciais 3.mp3`: onda 4 (ondas 0–2 com primeira trilha, onda 3 com segunda).
- Não há ainda arquivo novo de colonização da Coreia: manter `traição coreana.mp3` como trilha provisória do epílogo coreano derrotado.

## Integração
- Os quatro temas de traição continuam tocando apenas durante as respectivas batalhas da onda 11; nenhum remapeamento dos chefões.
- A derrota inicia Game Over apenas depois de terminada a cinemática de destruição do canhão, ou imediatamente ao exibir derrota por timeout.
- Ao entrar em `EndingScene`, a trilha anterior é desligada: epílogos de colonização passam a tocar sua própria música; epílogo Full Brazil derrotado usa Game Over (sem loop).
- Vitória mantém comportamento anterior: epílogos continuam sem música de vitória até haver faixas aprovadas.
- Os controles de volume e mute e as regras de autoplay são preservados.

## Verificação
- `tests/music.test.js` valida a existência de todos os MP3 referenciados, ondas, trajetórias de derrota, seleção por país, não repetição do Game Over e encerramento das trilhas.
- O teste entra também no workflow de publicação da branch de playtest.
