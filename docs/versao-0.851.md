# v0.851 — Correção do Tipo 5 branco

## Falha corrigida

O sprite Tipo 5 ficava completamente branco após receber dano. Causa confirmada no código: `impactInvader()` aplicava `enemy.sprite.setTintFill(0xffffff)` a todos os inimigos com sprite, e a ramificação de `updateEnemyHitVisual()` do Tipo 5 não removia o tint sólido. Este estado persistia após o flash.

## Alterações
- Em `impactInvader()`, o Tipo 5 com spritesheet usa **apenas variação temporária de opacidade** e nunca recebe `setTintFill`.
- Em `updateEnemyHitVisual()`, `enemy.sprite.clearTint()` garante que o sprite preserve as cores e restaura sua transparência após o impacto.
- A animação de morte também limpa o tint.
- Substituído `public/assets/inimigos/tipo5/spritesheet.png` por um **PNG RGBA 8-bit por canal (color type 6)**, sem paleta/indexação; 896×512, 16 frames transparentes (4×4, 224×128 px). Preservados todos os detalhes da nave.
- `tests/type5SpriteSheet.test.js` verifica dimensões e formato RGBA verdadeiro, além de não permitir tint branco persistente.
- Vida, colisões, padrões de ataque, abertura das baias, estados de dano e morte continuam iguais à v0.850.

## Validação
- Testes focados e deploy automático pelo GitHub Actions.
- Verificação final da aparência no navegador ainda depende de playtest real.
