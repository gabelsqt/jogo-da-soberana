# Soberania v0.850 — Cruzador-Colmeia Tipo 5 animado

- Importado spritesheet de nave-mãe alienígena enviado pelo usuário e normalizado em atlas transparente `public/assets/inimigos/tipo5/spritesheet.png` (896×512, grade 4×4 de 224×128). Extraídas as 16 poses sem o fundo preto e sem as margens irregulares da imagem original; PNG paletizado com transparência para reduzir o download.
- Tipo 5 é desenhado com sprite **128×74 px**, conservando os mesmos valores de HP, hitbox, velocidade, rotas, padrões de tiro e invocação.
- **Frames 0–3:** animação de voo em loop (4 fps).
- **Frames 4–7:** abertura das baias (8 fps, uma execução) sempre que minions são realmente gerados; o spawn acontece na mesma hora de sempre e não depende da conclusão da animação.
- **Frames 8–11:** dano visual estático progressivo quando a vida cai a 72%, 50%, 30% e 14%. Evita oscilar visualmente entre casco intacto e casco danificado.
- **Frames 12–15:** animação de destruição em 8 fps como sprite visual independente, coexistindo com o burst de morte original; inimigo é removido imediatamente do combate.
- Escala consistente entre quadros, sem cintilação ou saltos do casco ao mudar de linha. O fallback vetorial original permanece caso o asset não carregue.
- Novo módulo puro `src/gameplay/type5Sprite.js` centraliza os frames e limites de dano.
- Testes `tests/type5SpriteSheet.test.js` adicionados ao playtest de GitHub Pages. Validação visual real ainda necessária.
