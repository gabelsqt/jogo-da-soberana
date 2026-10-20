# Trilhas do jogo

Arquivos originais em `public/assets/musicas/`; mapeamento em `src/audio/music.js`.

| Momento | Arquivo |
| --- | --- |
| Menu principal | Menu inicial - Soberania.mp3 |
| Configuração dos laboratórios / playtest | Menu 2.mp3 |
| Mesa de negociações | Menu do bar - upgrades.mp3 |
| Abertura da campanha e anúncio da onda 11 | plantão cubo news Brasil.mp3 (uma vez, até entrar na batalha) |
| Ondas 0–2 / arena livre | Ondas Iniciais.mp3 |
| Onda 3 | Ondas Iniciais 2.mp3 |
| Onda 4 | Ondas Iniciais 3.mp3 |
| Ondas 5–9 | Ondas Intermediárias.mp3 |
| Onda 10 / última ofensiva Full Brazil | Chefão Alien - onda 10.mp3 |
| Onda 11 contra EUA / Rússia / China / Coreia | traição americana / Russa / china / coreana.mp3 |
| Tela de Game Over (derrotas comuns ou no chefe final) | Game Over.mp3 (uma vez, sem loop) |
| Epílogo: colonização EUA | Colonização Americana.mp3 |
| Epílogo: colonização Rússia | Colonização Russa- frozen expedition.mp3 |
| Epílogo: colonização China | Colonização Chinesa - 快遞旋律.mp3 |
| Epílogo: colonização Coreia | **Pendente**; usa temporariamente traição coreana.mp3 |
| Epílogo: derrota Full Brazil | Game Over.mp3 (uma vez, sem loop) |

Na onda 11 há um único traidor sorteado; usa sua faixa específica. A Coreia mantém o identificador interno legado `jp`.

As trilhas de batalha e menus repetem em loop. A vinheta de notícias e Game Over
não repetem. O Game Over entra quando a tela de derrota surge (após a animação
de destruição do canhão). Os epílogos de colonização usam músicas próprias onde
disponíveis; a Coreia usa temporariamente a faixa de traição. Epílogos de vitória
continuam sem tema próprio até receberem arte musical aprovada.

No menu e na pausa, `−` e `+` ajustam o volume em 10 pontos percentuais; clicar
no texto MÚSICA liga/desliga. Preferências são salvas localmente, quando o
navegador permite. O primeiro clique ou tecla libera o áudio se autoplay estiver
bloqueado. Pausar a cena ou ocultar a aba pausa a música na posição atual.

Só uma faixa é carregada para reprodução por vez. `assetUrl` permite usar os
mesmos nomes no Vite, GitHub Pages e HTML único do itch.io. O exportador já
incorpora MP3; a inclusão das 12 faixas aumenta o tamanho do HTML.

## Teste manual

1. `npm install` e `npm run dev`; clique no menu para liberar áudio.
2. Confira volume/silenciar, recarregue e confira a preferência salva.
3. Comece a campanha: vinheta no preparo e música inicial na onda 0.
4. Pause/continue e troque de aba: a faixa deve retomar na mesma posição.
5. Use TESTAR UPGRADES V1 para abrir ondas 3, 5, 10 e 11 com cada país.
6. Confira a mesa de negociações, derrota, reinício e retorno ao menu.
7. `npm run build:itch` gera o HTML com todas as faixas incorporadas.
