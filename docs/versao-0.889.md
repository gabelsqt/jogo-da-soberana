# Operação Soberania v0.889 — estabilidade, música e combate Full Brazil

## Correções visuais
- O clarão de disparo `showMuzzleFlash` usa a posição precisa `cannonSpritePose(...).muzzleX/Y`. Deixa de aparecer sobre o mecanismo inferior, especialmente com mira inclinada.
- Escudo v0.887 mantido sem mudança visual, mas sua malha de hexágonos é calculada uma vez por geometria e reutilizada.
- Pulsação do escudo limitada a até 30 atualizações por segundo, sem mexer na física.
- Texto da viagem e da HUD não recria texturas quando não há alteração: importante em chefes Tipo 6 e na viagem da Onda 11.

## Travamentos em Wave 11
- Otimização dos elementos redesenhados em todo quadro nas builds mais exigentes.
- Proteção e regressão dos dois caminhos críticos: EUA nível 10 → Tipo 6 americano; Full Brazil nível 10 em testes → rota espacial, sem Tipo 6.
- O usuário relatou travamentos, mas não há log de exceções/telemetria do navegador: testes cobrem roteamento e cargas do renderizador; não comprovam sozinhos a solução de todas as causas possíveis.

## Mais alienígenas na rota Full Brazil
- Entrada contínua de grupos aumentada para 24/28/32/36 eventos nas quatro cidades (13/15/17/19 anteriormente).
- Enxames e grupos de formação maiores; atraso entre reforços reduzido com escalonamento por cidade.
- Sem repetição do chefe Tipo 6, sem vitória automática por tempo e sem deixar inimigos extras após sair de uma cidade.

## Recuperação musical
- Player faz preload de MP3 e guarda estado `carregando/tocando/bloqueada/erro`, incluindo erro real de leitura do arquivo.
- No menu, abrir MÚSICA revela a situação; botão `▶ TESTAR` restaura volume para 40% apenas se estava em zero, desativa mudo explicitamente e tenta tocar a faixa.
- Não altera preferências silenciosamente. As 18 músicas mantêm seus nomes e mapeamentos, com publicação em arquivos separados do Pages.
- Se ainda ficar sem som, enviar mensagem de estado exibida e eventual console do navegador.

## Testes
- Regressões de origem do flash, progressão dos eventos, caminhos das builds, otimizações e recuperação de som.
