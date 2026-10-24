# Versão 0.47 — Cubo News legível e zoom-out cinematográfico
Data: 19/10/2026 • Branch: `feat/brasil2-arraial-balístico`.

## Motivação
Após o teste da v0.46, a fonte de notícias bitmap 5×7 ficou excessivamente pixelada, difícil de ler; a apresentação do número antes da onda pareceu rápida, pequena e com um deslocamento/sumiço brusco. A solicitação é **dar mais tempo em destaque** e fazer a própria visão do cenário começar ampliada sobre o contador antes de recuar para o enquadramento normal, sincronizando o número com a posição final no relógio.

## O que foi implementado
- **Tipografia:** headlines, ticker, etiqueta CUBO NEWS, números do relógio, título e número central usam fontes retro monoespaçadas e números fortes renderizados normalmente pelo navegador. A arte mantém blocos de cor, geometria quadrada e identidade vermelho/prata/azul; o HTML fica acessível e os acentos ficam nítidos. Nenhuma fonte de terceiros ou conexão externa.
- **Tempo de leitura:** vinheta mostra `TEMPO ATÉ O AMANHECER` e o número (30/60) no centro por **2.200 ms** antes de começar o movimento (antes: 980 ms). O número agora é cerca de duas vezes mais alto na abertura.
- **Movimento de câmera real:** zoom inicial da cena Phaser para **1,48×** durante o destaque. O pullback da câmera até 1× dura **1.750 ms**, sincronizado com a transição do número do centro ao cronômetro de canto.
- **Transições suaves:** cartão e título perdem opacidade ao longo de 750–850 ms; o número central diminui e desliza com interpolação `Cubic.InOut`, trocando gradualmente sua opacidade com a do relógio final nos últimos 33% do trajeto (crossfade).
- **Jogo congelado:** combate/spawns/cronômetro só começam quando os tweens terminam. Os comandos de pausa do Phaser também congelam o tween; um encerramento de cena durante a vinheta restaura a câmera para 1×. O Tipo 6 mantém seu congelamento adicional até ficar alvejável.
- **HUD protegido:** fora da vinheta, o telejornal segue HTML fora do canvas, estático em relação ao zoom/screen shake da câmera. Nenhuma alteração da altura de 44 px, canhão em (480,494), cenário, hitboxes e física.
- **Noticiário:** sem mudanças na linha editorial de amanhecer e patrocínio, no intervalo de cinco segundos ou na fila máxima de três notícias.

## Como testar
1. Abra o playtest Pages e inicie uma onda comum: verifique `TEMPO ATÉ O AMANHECER`, o número grande parado, o cenário próximo atrás do cartão e o movimento de câmera para trás.
2. Confirme que o número não some subitamente, mas fica progressivamente transparente ao chegar à direita; só então surgem os primeiros inimigos.
3. Verifique a legibilidade da manchete prateada e do ticker vermelho, mantendo aparência retrô.
4. Experimente as ondas 10–11 e confira que o cronômetro não começa a correr antes do chefão estar alvejável.

## Validação
Testes automáticos da branch GitHub Actions, compilação Vite e exportação single-file itch.io; resultados devem ser conferidos no workflow desta versão. A validação visual real continua necessária para acertar ritmo, zoom e tamanho final.
