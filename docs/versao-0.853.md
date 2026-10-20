# Soberania v0.853 — Sprites dos módulos do Tipo 6 alienígena

## Arte
- Adicionado **modulos-alien.png** em `public/assets/inimigos/tipo6/`: atlas RGBA de **1484×1040 px** (4 linhas de 7 quadros, 212×260 por quadro).
- A arte foi aproveitada integralmente do PNG `tipo6_modulos_alinhados.png` enviado pelo criador, movendo a referência do mesmo blob no Git sem recompressão.
- Quatro funções com suas linhas independentes: bombardeiro, hangar, emissor laser e gerador de barreira.
- Sete estados de cada módulo: parado, carregando, ativo, avaria leve, moderada, crítica e destroços.

## Integração
- Os sprites substituem **apenas** a arte procedural dos quatro módulos no **Tipo 6 alienígena**.
- Carregamento e disparos acompanham a ação do módulo; dano e destroços acompanham HP e escudo.
- A barreira inicial pode acender o sprite ativo do gerador; os escudos individuais, núcleo, absorção e efeito do domo continuam procedurais, à frente dos PNGs.
- A âncora normalizada e o microtremor são **apenas visuais**. Hitboxes, vida, posições, cronômetro, ataques e variantes nacionais continuam inalterados.
- Ausência do PNG ou erro de carregamento: fallback para módulos desenhados anteriormente.

## Verificação
- `tests/type6ModuleSprite.test.js` verifica geometria, dimensões e formato RGBA do PNG, os 28 quadros, transições de dano e preservação das hitboxes.
- A publicação ocorre pelo workflow de playtest da branch `feat/brasil2-arraial-balístico`.
- É necessária inspeção visual em jogo para validar encaixe e sobreposições dos módulos diante do casco e núcleo.
