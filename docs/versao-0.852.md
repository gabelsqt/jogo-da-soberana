# Soberania v0.852 — Quatro cascos do Tipo 6 alienígena

## Arte implementada
- As quatro imagens aprovadas foram importadas como um **único atlas RGBA transparente** `public/assets/inimigos/tipo6/casco-alien.png` de 3360×280, contendo quatro quadros de 840×280.
- Cada imagem foi alinhada em torno da mesma origem, preservando a localização dos quatro módulos dentro do sistema de coordenadas atual ([-255,-87,87,255] em X).
- Frame 0: casco íntegro (de início até um módulo destruído).
- Frame 1: casco avariado (a partir de **dois módulos destruídos**).
- Frame 2: casco com o núcleo exposto (depois de destruir os quatro módulos, durante a abertura e ataque ao núcleo).
- Frame 3: casco destruído/explodindo (durante os seis segundos da sequência de vitória).
- Nova função pura `type6HullFrame()` escolhe a imagem pela estrutura real de combate; não depende de HP aleatório nem temporização de animação.

## Integração
- Casco exibido dentro do contêiner da Fortaleza Orbital, **antes** da camada de gráficos dos módulos, do núcleo, do escudo de meio domo invertido e da absorção visual de energia.
- Não desenhar o casco vetorial provisório por cima do sprite aprovado. Os módulos seguem sendo desenhados em layer independente, e o sprite do casco muda de quadro quando avançam os estados de dano.
- Casco e gráficos acompanham juntos o microtremor de impacto, sem mover o contêiner: nenhum deslocamento de hitboxes.
- A imagem final de destruição permanece durante a cinematográfica de vitória e deixa de receber módulos vetoriais por cima.
- As versões nacionais do Tipo 6 (EUA, Rússia, China e Coreia) **mantêm o casco vetorial** até receberem artes próprias, sem herdar visual alienígena.
- Caso a textura falhe, o chefe mantém o visual vetorial anterior, com todos os ataques/HP preservados.

## Verificação
- Teste novo `tests/type6HullSprite.test.js` para atlas RGBA, estados visualmente ordenados, alinhamento dos módulos e ausência de mudanças na geometria.
- Adicionado ao workflow de publicação do GitHub Pages.
- Falta validar visualmente o novo tamanho do casco e o encaixe com cada módulo no navegador.
