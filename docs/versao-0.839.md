# v0.839 — Cano longo e articulação

- Carrega base, nove canos `barrel_*` e nove cabeçotes `head_*`.
- Em tempo de execução, recorta apenas a parte inferior do `head` (de 43% da altura em diante) como pivô da torre, evitando sobrepor o cano curto sobre o longo.
- Renderiza base fixa na profundidade 21, cano longo na 22, articulação circular na 24.
- Os dois sprites móveis acompanham o mesmo quadro de mira; recuo visual do cano também é preservado.
- Fallback vetorial permanece quando faltar algum asset.
- Não altera dano, mira ou hitboxes. Testes de navegador e tamanho/posição ainda pendentes.
