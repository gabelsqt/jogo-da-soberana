# v0.77 — Retratos tratados para exibição

- Antes de desenhar, cada retrato 384×384 passa por redução em duas etapas usando Canvas 2D (192×192 e 128×128) com image smoothing high.
- A tela usa novas texturas `leader-<id>-full-screen`, mantendo originais intactos e fallback para texturas existentes.
- Redução elimina parte da granulação/aliasing provocada pelo detalhe fino; não redesenha a pixel art original.
- Preserva proporção quadrada, cards, escolhas e combate.
- Pendente: teste visual no navegador e npm test/build.
