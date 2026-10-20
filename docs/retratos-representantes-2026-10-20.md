# Retratos dos representantes — 20/10/2026

Cinco retratos de base/oferta implantados na cena de escolha de melhorias (boteco).

| País | Representante | Asset |
| --- | --- | --- |
| Brasil | Zeca Carrara (mecânico sorridente) | `public/assets/lideres/br_retrato.png` |
| EUA | Victor McDollar (sorriso confiante) | `public/assets/lideres/us_retrato.png` |
| Coreia do Sul | Kim Lin Du (sorriso de idol e coração com os dedos) | `public/assets/lideres/jp_retrato.png` |
| Rússia | Kátia Strófika (séria) | `public/assets/lideres/ru_retrato.png` |
| China | Mingda Mai (sorriso de vendedora) | `public/assets/lideres/cn_retrato.png` |

Os PNGs têm 128×128 pixels, fundo transparente, paleta reduzida e resolução otimizada para uso no jogo. O identificador `jp` é legado do código da Coreia do Sul; os nomes exibidos continuam os do GDD.

A `UpgradeScene` carrega os arquivos `*_retrato.png` existentes: a mudança troca o retrato no cartão e nas falas sem alterar as regras de progressão. A função de preparação visual ignora o redimensionamento de texturas já nativas em 128×128, usando filtro NEAREST.

Não houve mudança de gameplay, diálogos ou assets `*_personagem.png`. Os demais três retratos/expressões por líder continuam pendentes de criação. Teste visual no navegador recomendado após subir a branch utilizada pelo jogo.
