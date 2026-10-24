# Soberania v0.849 — Sprite animado do Inimigo Tipo 2

- Novo spritesheet real do Tipo 2 em `public/assets/inimigos/tipo2/spritesheet.png`, extraído da imagem original enviada pelo usuário.
- O PNG original já era transparente: não houve remoção de fundo. Foram eliminadas as grandes margens verticais diferentes entre as linhas, que causariam deslocamentos visuais.
- O novo atlas tem **448 × 224**, composto por 8 quadros **112 × 112** em grade de 4 colunas × 2 linhas; centrado e com transparência preservada. Arte foi reduzida a 64 cores indexadas para diminuir download mantendo silhueta metálica e núcleo vermelho.
- **Quadros 0–5:** voo animado (5 fps). **Quadro 6:** nave avariada, também visível durante o acerto. **Quadro 7:** nave em destruição; um rastro visual se dissolve sobre os efeitos habituais da explosão.
- Nave aparece com **58 × 58 px**. Deslocamento, disparos, HP e hitboxes mantidos, bem como fallback vetorial quando asset não carrega.
- Corrigida a perda da rotação: o feedback de acerto agora soma sua pequena oscilação à orientação do Tipo 2, em vez de zerar o rumo todo quadro. Ângulo para a esquerda normalizado em −π…π.
- Incluídos `tests/type2SpriteSheet.test.js` e os testes existentes de movimento angular no workflow do GitHub Pages; CI completo permanece com falhas históricas, mas o playtest verifica os casos novos e gera publicação separada.
- Conferência visual no navegador pendente (tamanho em 1×, giros em formação e quadro de morte).
