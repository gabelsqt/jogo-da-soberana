# Versão 1 — Implementação incremental (Decisões 53–68)

Branch separada de `feat/enxames-esquadrilhas-v035`, preservando o jogo antigo.

## Incluído
- Catálogo dos **50 níveis aprovados** (5 países × 10), seleção automática do próximo upgrade de cada país e boteco mostrando apenas o upgrade imediato.
- Na campanha, **nenhuma torre de animal** é instanciada; arquivos antigos permanecem para a expansão. Laboratório permanece em funcionamento.
- Cálculo híbrido acumulativo e parâmetros ofensivos/defensivos por nível: cadência/aquece, fragmentação, perfuração, knockback, múltiplos projéteis, bônus de escudo e recarga.
- Projéteis derivados limitados a **uma geração**, retendo efeitos compatíveis. Orçamento de elementos gráficos; projéteis sem sprite continuam calculando colisões/dano.
- Suprema de **Espaço**, uso único por onda; Brasil/China afetam o céu, EUA/Rússia miram área, Coreia lança feixe direcional. Não pausa o combate.
- Indicador de suprema próximo ao canhão. Décima escolha após Onda 9, seguida de confronto **provisório** com Fortaleza-Mãe na Onda 10.
- Metralhadora brasileira do nível 10 desloca horizontalmente a origem das balas, mantendo ângulo de tiro; efeitos de outros países podem coexistir.

## Trabalho ainda necessário antes do lançamento
- A **Onda 10** reutiliza provisoriamente o inimigo Tipo 5 para testar a progressão e o chefe; arte exclusiva, fuga, falsa vitória, traição, **Onda 11** e finais ainda não estão implementados nesta branch.
- Alguns efeitos específicos dos cinquenta níveis ainda usam parâmetros genéricos; precisam de VFX próprios e playtest para cumprir integralmente o GDD.
- Testes de desempenho e balanceamento em navegador (especialmente rajadas múltiplas, reações explosivas e misturas extremas).
- Fluxo cinematográfico, Cubo News e alterações posteriores da tela CRT permanecem pendentes conforme outras decisões do GDD.

**Não mesclar esta branch sem playtest e revisão.**

## Decisão 69 — Redesign significativo dos upgrades (APROVADA, 17/10/2026)

**Opção B — Evolução marcante.** Manter a arquitetura de 5 países × 10 níveis e o tema central de cada tecnologia, mas reprojetar cada upgrade individual para ter mudanças perceptíveis **mecânicas, visuais e estratégicas**. Preservar o canhão brasileiro como plataforma central; efeitos e cores de diferentes países devem coexistir. Cada escolha deve ter função própria, boa leitura visual e sinergias com escolhas de outros países; evitar melhorias que consistam apenas em bônus numéricos invisíveis. Manter níveis ímpares 1/3/5/7 centrados no tiro principal, pares 2/4/6/8 no especial/escudo, nível 9 suprema e nível 10 transformação final. Preservar geração adicional de projéteis limitada a uma etapa e salvaguardas de desempenho.

**Estado:** somente diretriz de planejamento aprovada. As propostas detalhadas de cada nível, começando por Brasil 1 — *Gambiarra Balística*, exigem decisão separada. **Não implementar nem alterar código de gameplay durante esta revisão.**
