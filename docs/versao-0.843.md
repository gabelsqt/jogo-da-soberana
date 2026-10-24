# v0.843 — Contagem de abertura, cristais de gelo e Inverno Eterno

## Cronômetro da Cubo News
- A faixa do relógio inicia invisível antes de exibir o HUD.
- Removida a regra CSS que escondia separadamente o texto do contador durante a transição de abertura; o código controla a opacidade do contêiner e conclui a animação com opacidade 1, sem o salto visual.
- Mantida animação do número central até o relógio no topo e os tempos existentes.

## Cristais russos
- Estilhaços de inimigos mortos congelados agora são cristais facetados (face escura, face azulada, brilho branco e bordas).
- A partir do nível 1 da Rússia, largura e comprimento aumentam gradativamente até o nível 10; os fragmentos giram durante o voo.
- Permanece o limite global de 64 fragmentos visuais, sem redução de dano quando o limite é atingido.
- Mantidos os raios/danos de estilhaçamento e o congelamento padrão.

## Rússia nível 10 — Inverno Eterno
- Segurando o disparo normal, o canhão emite um cone contínuo de névoa azul-esbranquiçada e cristais flutuantes, acompanhando a mira.
- O cone substitui os projéteis convencionais nessa transformação, com alcance de 530 px, abertura de 0,32 radianos para cada lado e aplicação de dano/congelamento a cada 110 ms.
- O dano é calculado por inimigo (aproximadamente 45% do dano básico russo por tick), independente de quantas partículas desenhamos.
- O congelamento dura 3 s, sendo renovado durante a exposição; inimigos que morrem congelados continuam provocando explosão de estilhaços.
- O Tipo 6 pode receber dano do cone sem ser congelado; disparo especial russo e Supremo não mudam.
- O cone desaparece ao soltar o disparo, na conclusão da onda ou ao interromper o combate.

## Validação
- Testes de funções puras adicionados para alcance, evolução dos cristais e geada contínua.
- Testes locais completos e inspeção em navegador ainda pendentes.
