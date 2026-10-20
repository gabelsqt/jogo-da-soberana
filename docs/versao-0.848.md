# v0.848 — UX, paleta institucional, Sputnik Criogênico e Tipo 6

## Corrigidos
- Contador do Cubo News: sem interpolação simultânea do número central e relógio definitivo. CSS não anima opacidade do relógio; relógio fica invisível até o término da intro. Mantida animação do número central em direção ao destino e só então ocorre a troca atômica.
- Retrato do Zeca: o `setTexture` de `boteco-dia` para a foto 128×128 herdava escala da imagem 960×540; é obrigatório executar `setDisplaySize(174,174)` **depois da troca de textura**. Moldura agora 176×196 e tem pré-tratamento específico do retrato para diálogos.
- Cores oficiais centralizadas em `src/config/countryIdentity.js`: Brasil verde, EUA azul, Rússia dourado, China vermelho e Coreia roxo (id técnico `jp`). Aplicadas aos cards de upgrade, representantes, especiais e principais destaques nacionais de Tipo 6. Gelo continua fisicamente ciano.

## Rússia — especiais remodelados
- Removida detonação imediata Matryoshka e as contagens de 8/12/16/24 projéteis. Os upgrades primários 1/3/5/7 e o sopro nível 10 continuam sem alterações.
- N2 Sputnik Criogênico: esfera metálica com antenas, cristais orbitais e núcleo gelado; estacionária por 4 s, contato congela e cristaliza. Alvo cristalizado toma ×1,30 de dano dos tiros russos; estilhaços têm raio ×1,25.
- N4 Órbita Fria: 5 s, raio de contato maior.
- N6 Reator de Permafrost: estilhaços de cristalizados com dano ×1,25 e raio ×1,55.
- N8 Zero Absoluto Orbital: pulsos de congelamento periódicos, mais área de contato e onda final congelante.
- Cristalizado usa `russianCrystalizedUntil` e só amplifica enquanto o status está ativo. Não aplica dano próprio nem congela Tipo 6. Estilhaços continuam limitados a uma detonação por inimigo morto e orçamento gráfico. Máximo três Sputniks no campo.
- Combos de especiais com Brasil, EUA, China e Coreia mantidos.

## Tipo 6
- Escudo principal desenhado como semicírculo côncavo invertido (∪) voltado para baixo; **a hitbox da barreira não mudou**.
- Núcleo e todos os módulos têm energia convergente puramente visual. Laser de cerco e núcleo atraem partículas de distâncias maiores. Módulos destruídos deixam de emitir o efeito.

## Testes/documentação
- Atualizadas expectativas de `tests/v1Specials.test.js` e `tests/cuboNewsDomHud.test.js`.
- Novo `tests/sputnikRework.test.js` cobre cristalização, amplificação, ausência de dano direto, níveis especiais, paleta e domo.
- GDD principal e GDD específico do Tipo 6 atualizados com decisão que substitui descrições antigas.
- Pendente inspeção final no navegador; a suíte global do projeto já possuía falhas legadas não relacionadas com esta alteração.
