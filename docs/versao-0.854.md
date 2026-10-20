# Soberania v0.854 — Flash dos módulos e sucção de energia do Tipo 6

## Correção visual
- Ao receber dano efetivo no escudo individual ou no módulo, o sprite alienígena atingido pisca em branco por **90 ms** usando `setTintFill(0xffffff)`, retornando ao PNG original automaticamente com `clearTint()`.
- Um intervalo mínimo de **180 ms** entre flashes evita que múltiplos acertos em alta cadência deixem o módulo permanentemente branco.
- Removidos os retângulos e molduras brancos colocados por cima do PNG em impactos. Para Tipo 6 sem sprites próprios (chefes traidores), faíscas discretas substituem as caixas.
- Escudo principal, núcleo e explosões mantêm feedback independente.

## Absorção de energia
- A sucção dos quatro módulos aparece **somente durante o carregamento, o disparo ou a curta janela pós-ativação** de bombardeio, laser, hangar e reconstrução da barreira.
- Em repouso e durante a apresentação inicial, não há partículas de sucção.
- O gerador não suga energia continuamente só porque a barreira está ligada.
- O núcleo central só suga energia quando sua **superarma** está carregando, após a exposição do núcleo.
- Lógica puramente visual: não alterados HP, hitboxes, valores de ataque, cronômetro, comportamento ou variantes nacionais.

## Testes
- Testes de estado de atividade, repouso, transição, superarma e duração do flash em `tests/type6ModuleSprite.test.js`.
- O workflow de publicação de playtest já inclui essa suíte de testes.
- Verificação visual em jogo ainda recomendada, especialmente sobreposições de escudos e disparos.
