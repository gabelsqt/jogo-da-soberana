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

## Decisões 70–71 — Brasil nível 1: Gambiarra Balística (design aprovado, parâmetros sujeitos a playtest)

- **Decisão 70: B — Gambiarra Superaquecida.** A arma esquenta enquanto dispara continuamente; esse calor aumenta gradualmente a cadência. Ao parar, esfria gradualmente, sem travamento nem penalidade.
- **Decisão 71: B — Cadência + projéteis incandescentes.** A cor e os rastros dos tiros evoluem de forma legível junto com calor (laranja/amarelo), mas **não** adicionam dano, combustão nem outras propriedades ofensivas. O canhão ganha brilho progressivo no núcleo/tubos, vibração e vapor/faíscas moderadas.
- **Parâmetros propostos para baseline de balanceamento:** cadência fria 2,5 tiros/s (intervalo 400 ms), quente 5 tiros/s (intervalo 200 ms), aquecimento de 0 a 100% após 5 s de disparo contínuo e resfriamento completo após 3 s sem disparar; interpolação contínua; dano por projétil inalterado. Parâmetros de partida, não números imutáveis; testar no navegador.
- **Estados visuais propostos:** 0–30% frio/discreto; 30–70% quente com tubos alaranjados e vapor; 70–100% núcleo incandescente e rastros luminosos intensos. Sem excesso de partículas.
- **Sinergias:** cadência maior ativa com mais frequência gatilhos por disparo de outras nações. Efeitos se acumulam segundo as regras híbridas e respeitam os limites visuais/de geração existentes.
- **Brasil 3 — Motor Esquentando:** precisa ser redesenhado para **recompensar estar em temperatura alta com uma nova propriedade ofensiva**, em vez de simplesmente repetir o aumento de cadência. Nenhuma variante mecânica do nível 3 está aprovada ainda; discussão posterior.
- **Escopo:** documentação de design apenas. Não alterar implementação atual até finalizar e autorizar o pacote.

## Decisão 72 — Brasil 3: Pressão Máxima (direção escolhida, detalhamento pendente)

**Opção B escolhida:** ao atingir 100% de calor, o tiro principal do canhão passa a perfurar o primeiro inimigo, podendo acertar um segundo. A propriedade depende do calor gerado por Brasil 1; não deve repetir aumento de cadência. Os parâmetros exatos de perfuração, dano, leitura visual e combinação entre países serão decididos posteriormente. Brasil 5 permanece dedicado ao aumento de porte e força dos projéteis. Próxima revisão na ordem normal: Brasil 2. **Apenas planejamento; nenhuma implementação autorizada.**

## Decisão 73 — Brasil 2: alternativas adicionais solicitadas (sem escolha definitiva)

O usuário escolheu **D — explorar outras ideias** em vez de aprovar as três opções iniciais. Preservar o papel do nível 2 (especial + escudo) e reservar a estreia da eletricidade ofensiva para Brasil 4, as correntes para Brasil 6 e a defesa elétrica avançada para Brasil 8. Alternativas para deliberação: E Escudo de Retalhos (impactos bloqueados carregam especial ampliado); F Protocolo de Última Hora (reset emergencial do especial, uma vez por onda); G Reciclagem de Guerra (abates do especial restauram escudo); H Escudo Sanfona (especial expande escudo e empurra ameaças). **Nenhuma opção de Brasil 2 aprovada. Não implementar código.**

## Decisão 74 — Brasil 2: J, explorar outra direção (17/10/2026)

As propostas E–H para Brasil 2 não foram escolhidas. Continuar exploração de conceito sem aprovar uma mecânica ainda. Brasil 2 deve criar interação significativa entre tiro especial e escudo, sem introduzir a temática elétrica reservada a Brasil 4 (eletricidade ativa), Brasil 6 (descargas em cadeia) e Brasil 8 (defesa elétrica avançada). A revisão permanece estritamente documental; nenhuma alteração no código.

## Decisão 75 — P: reconsiderar a abordagem de Brasil 2

Não selecionar as alternativas K–N. Voltar à definição da experiência de jogo antes de especificar mecânicas. Três direções para discussão: controle direto do tiro especial; risco e recompensa com recursos do escudo/canhão; transformação perceptível do especial com benefício defensivo complementar. Brasil 2 permanece **em aberto**, preservando por ora a posição de upgrade especial/escudo nos níveis pares e reservando eletricidade para Brasil 4/6/8. Nenhuma implementação autorizada.

## Decisão 76 — C (opção 3): transformação marcante do arsenal para Brasil 2

**Direção selecionada:** Brasil 2 deve transformar substancialmente o **tiro especial**, com mecânica e identidade visual próprias, enquanto o **escudo** recebe um benefício complementar e facilmente perceptível, não necessariamente acoplado ao especial. Evitar meros bônus numéricos, escudos automáticos genéricos e antecipação da eletricidade reservada a Brasil 4/6/8. Esta é uma direção criativa, **não** uma escolha definitiva da mecânica. Próxima etapa: comparar conceitos concretos de transformação do especial antes de fixar parâmetros. Não implementar código.

## Decisões 77–78 — Brasil 2 Arraial Balístico (direção)

- **Decisão 77 C:** o especial cria um núcleo suspenso na posição-alvo; fogos de artifício detonam ao redor dele enquanto permanece ativo. Conceito de Brasil 2: Arraial Balístico/Festa Junina. Escudo recebe melhoria complementar ainda a especificar.
- **Decisão 78 C:** ritmo dos fogos em **crescendo junino**: explosões inicialmente espaçadas, acelerando ao longo da duração do núcleo, culminando em uma explosão final maior. Valores de duração, dano, raio e balanceamento não foram definidos. Futuras evoluções Brasil 4/6/8 ficam reservadas para eletricidade, cadeias e defesa avançada.
- **Status:** direção de design aprovada; detalhamento ainda pendente. Não implementar código.

## Decisão 79 — Brasil 2: duração do núcleo

**Opção B aprovada:** o núcleo suspenso do Arraial Balístico permanece ativo por **4 segundos**. Durante esse período, solta fogos em ritmo crescente e termina com uma explosão maior (Decisão 78 C). Dano, frequência, raio e efeito complementar do escudo seguem pendentes de decisão. Apenas GDD; nenhuma mudança no código.

## Decisão 80 — Brasil 2: padrão circular dos fogos

**Opção C aprovada:** as explosões dos fogos percorrem o entorno do núcleo suspenso em uma **sequência circular coreografada e previsível**, em vez de serem aleatórias ou buscarem automaticamente inimigos. A cadência cresce durante os 4 segundos e culmina em uma explosão final maior (Decisões 78–79). Direção/raio/distribuição e dano permanecem sujeitos às próximas decisões. **Somente GDD, sem alteração de código.**

## Decisão 81 — Brasil 2: alcance dos fogos

**Opção B aprovada:** alcance médio de **100 px de raio a partir do núcleo suspenso** (resolução interna 960 × 540). Explosões seguem o padrão circular coreografado da Decisão 80 durante quatro segundos e terminam com uma explosão maior. Este valor representa a extensão do padrão em torno do centro; o raio individual de dano de cada explosão, sua frequência e o dano seguem pendentes de especificação. **Apenas GDD; nenhuma implementação.**

## Decisão 82 — Brasil 2: dano baixo por fogo

**Opção A aprovada:** cada explosão periférica do Arraial Balístico causa **dano baixo**, favorecendo controle de enxames e eliminação de inimigos frágeis, com eficácia limitada contra naves resistentes. Mantêm-se núcleo suspenso, duração de 4 segundos, fogos em círculo de alcance 100 px com ritmo crescente e grande explosão final. Valores numéricos do dano e o dano da explosão final ainda não definidos. **Somente GDD, sem implementar código.**

## Decisão 83 — Brasil 2: explosão final concentrada

**Opção B aprovada:** após os 4 segundos de fogos periféricos de dano baixo, o núcleo termina com **grande explosão concentrada de dano elevado nas proximidades do centro**, recompensando posicionamento preciso. Raio e dano numérico ainda sujeitos a ajuste. A decisão não transforma a explosão final em dano uniforme por toda a região de 100 px. Próxima decisão: benefício complementar do escudo. Apenas documentação; sem código.

## Decisão 84 — Brasil 2: Fogueira de São João (APROVADA)

O escudo do canhão **fica em chamas** e inflige **dano leve por proximidade** a inimigos que chegam perto dele, com efeito visual de fogo junino. É a melhoria defensiva associada ao nível 2, **Arraial Balístico**. Preservar a distinção entre fogo no escudo (nível 2) e eletricidade nos níveis 4, 6 e 8. Raio, frequência do dano, duração/permanência e possibilidade de afetar projéteis inimigos permanecem para detalhamento; não presumir parâmetros não votados. Decisão apenas de design: **não modificar código**.

## Decisão 85 — Brasil 2: chamas permanentes do escudo (APROVADA)

**Opção A:** após adquirir **Arraial Balístico**, o escudo manifesta continuamente a **Fogueira de São João** enquanto estiver ativo. As chamas causam dano leve aos inimigos próximos de forma contínua (com aplicação periódica a ser balanceada), sem depender da ativação do especial e sem necessidade de receber impacto para acender. Ao ficar inativo/destruído, o escudo não causa dano de proximidade até voltar a ficar ativo. Alcance e cadência do dano ainda não definidos. Apenas atualização do GDD; nenhum código alterado.

## Decisão 86 — Brasil 2: alcance da Fogueira de São João (APROVADA)

**Opção A:** as chamas permanentes do escudo ativo causam dano leve em inimigos a até **15 px da borda do escudo**, não do centro do canhão. É uma defesa de contato próximo, não uma aura ampla. Frequência e valor numérico do dano ainda pendentes de balanceamento. Apenas GDD, nenhuma modificação no código.

## Decisão 87 — Brasil 2: periodicidade do dano da Fogueira (APROVADA)

**Opção B:** a Fogueira de São João aplica um pulso de dano leve a cada **0,5 segundo** a inimigos dentro de **15 px da borda do escudo ativo**. Fora desse alcance ou com escudo inativo, não aplica pulsos. Intensidade numérica por pulso e se o dano deixa efeito residual permanecem pendentes. Somente atualização de design, sem implementação.

## Decisão 88 — Brasil 2: sem queimadura residual (APROVADA)

**Opção A:** a Fogueira de São João **não aplica queimadura residual**. Os pulsos de dano leve ocorrem a cada 0,5 segundo apenas enquanto inimigos estiverem dentro dos 15 px medidos a partir da borda do escudo ativo; ao sair da área ou ao desativar o escudo, não há dano adicional pelo fogo. Valor de dano por pulso ainda pendente de balanceamento. Apenas registro no GDD, sem implementação.

## Decisão 89 — Brasil 2: dano da Fogueira de São João (APROVADA)

**Opção B:** cada pulso da Fogueira causa **0,5 HP de dano por inimigo** a cada **0,5 segundo**, equivalente a **1 HP/s** durante exposição contínua. O alcance continua sendo 15 px além da borda do escudo ativo, com dano interrompido imediatamente ao sair da área ou quando o escudo fica inativo; não existe queimadura residual (Decisões 85–88). Dano fracionário deve ser contabilizado sem arredondamento indevido. Apenas planejamento; não implementar código.

## Decisão 90 — Brasil 2: recarga do Arraial Balístico (APROVADA)

**Opção B:** o tiro especial Arraial Balístico mantém **8 segundos de recarga**. Núcleo permanece por 4 segundos, com fogos circulares acelerando e uma explosão final concentrada; a Fogueira de São João do escudo é passiva e não depende da recarga do especial. Na proposta-base, o tempo de recarga é o intervalo entre ativações (não confundir com duração do núcleo); como a interação exata entre contagem de cooldown e permanência ainda não havia sido explicitada, fica para decisão de implementação/balanceamento. **Apenas GDD; nenhum código alterado.**

## Decisão 91 — Brasil 2: início da recarga (APROVADA)

**Opção A:** a recarga de **8 segundos começa no instante do disparo** do Arraial Balístico. O núcleo permanece ativo por **4 segundos**, e o próximo especial pode ser usado **8 segundos após o disparo anterior** — portanto, em condições normais, há 4 segundos entre o desaparecimento do núcleo e a próxima ativação. A recarga não começa depois da explosão final. Reduções futuras de cooldown devem respeitar as regras de equilíbrio e sobreposição que venham a ser definidas. **Somente atualização do GDD; nenhuma implementação.**

## Decisão 92 — Brasil 2: quantidade de fogos (APROVADA)

**Opção B:** o núcleo do Arraial Balístico libera **12 fogos ao longo dos 4 segundos** de duração, seguindo a sequência circular coreografada de alcance 100 px e frequência crescente (Decisões 78–81). A explosão final concentrada ocorre ao término da duração e **não conta** entre os 12 fogos. Intensidade de dano por fogo permanece qualitativamente baixa; valores numéricos e área individual de cada estouro ainda serão balanceados. **Apenas documentação, sem código.**

## Decisão 93 — Brasil 2: dano dos fogos (APROVADA)

**Opção A:** cada um dos **12 fogos** liberados pelo núcleo do Arraial Balístico causa **1 HP de dano por acerto** aos inimigos alcançados por sua pequena explosão. Os fogos seguem em ritmo crescente, em sequência circular ao redor do núcleo de alcance 100 px, durante 4 segundos. A explosão final concentrada é separada dos 12 fogos e seu dano continua pendente. Raio de dano individual e regras de múltiplos acertos ainda serão decididos. **Apenas GDD; nenhum código alterado.**

## Decisão 94 — Brasil 2: dano da explosão final (APROVADA)

**Opção B:** a explosão final concentrada do Arraial Balístico causa **5 HP de dano por inimigo atingido**, depois de 4 segundos de núcleo ativo e 12 fogos de 1 HP cada. O alcance exato da explosão final e a possibilidade de acertos repetidos por fogos diferentes continuam pendentes de decisão. **Somente GDD; não alterar código.**

## Decisão 95 — Brasil 2: raio da explosão final (APROVADA)

**Opção B:** a explosão final do Arraial Balístico causa **5 HP** em cada inimigo dentro de **50 px de raio a partir do núcleo**, após os 4 segundos de duração. O círculo coreografado de 12 fogos permanece com extensão de 100 px do núcleo, 1 HP por fogo. O raio de 50 px é exclusivo da detonação final. Ficam pendentes o raio individual de cada fogo, regras de acerto repetido e eventuais detalhes de VFX. **Somente GDD; nenhuma modificação no código.**
