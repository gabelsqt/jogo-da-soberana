# Game Soberana — GDD (decisões de identidade e Supremos)

> Atualizado em 18/10/2026 — versão jogável **0.43**. Documento de design com decisões já implementadas e outras ainda em planejamento. A revisão russa (névoa criogênica, contágio e cooldown -25%) está implementada na v0.43; a tabela de upgrades atual fica em `src/gameplay/v1Upgrades.js`. Balanceamento e efeitos visuais dependem de playtest.

## Princípios de identidade

- Canhão central **brasileiro** permanece como modelo base; países aliados modificam tiros, efeitos, especial e defesa sem substituí-lo por um canhão estrangeiro.
- Os upgrades de diferentes países devem combinar visualmente, preservando suas cores e efeitos. Projéteis derivados podem herdar efeitos, mas só geram uma geração adicional, evitando multiplicação infinita.
- Limitar partículas e agregar impactos visuais sob carga para manter desempenho, **sem alterar o dano calculado**.
- Interface mostra o efeito **somente do upgrade imediato** ao escolher; indicador do especial perto do canhão mostra ícone, nome abreviado, tecla ESPAÇO e estado pronto/usado.
- Identidades: **Brasil** = gambiarra, festas populares, eletricidade e resistência; **EUA** = gigantismo militar, mísseis teleguiados e espetáculo; **Rússia** = gelo, congelamento, atração e estilhaçamento, retrofuturismo espacial soviético. Coreia do Sul = K-pop/luzes/laser; China = multiplicação e produção em massa. As últimas duas continuam sujeitas a revisão temática posterior.

## Regra global — ativação de Supremos (decisão mais recente prevalece)

1. Cada Supremo fica disponível **somente nos últimos cinco segundos da onda**, no máximo **uma vez por onda**, sem acumular.
2. Surge um **grande botão vermelho pulsante**, acompanhado de aviso sonoro. O combate segue em velocidade normal até o botão ser pressionado.
3. Ao pressionar o botão, o jogo entra em **10% da velocidade normal**; cronômetro, inimigos, projéteis e ataques seguem avançando em câmera lenta. As defesas ainda podem receber dano. O jogador digita o código temático do país; erros podem ser corrigidos, sem falha instantânea.
4. A câmera lenta **não congela o relógio**: cinco segundos de tempo de jogo equivalem a até cerca de 50 segundos reais se o botão for pressionado assim que aparece. O prazo efetivo depende de quanto restava da onda.
5. Código completo e correto dentro do prazo: **congelar completamente mundo e relógio**, escurecer a tela e iniciar a cinemática do país (grandiosidade de um *Fatality*). A proteção das defesas durante a cinemática não recupera HP perdido.
6. A cinemática elimina **todos os inimigos restantes** e a onda **termina imediatamente depois dela**, não antes. Caso o prazo acabe sem código correto, perde-se a oportunidade daquela onda.
7. **Não** exigir limite de HP crítico para liberar o Supremo.

### Brasil — Supremo nível 9: Réveillon de Copacabana

- **Código:** `REVEILLON`.
- Quando o código é completado, o mundo congela, a tela escurece e começa uma contagem **3, 2, 1**.
- O **Cristo Redentor do próprio cenário** treme, recebe uma explosão de propulsão e **decola do Corcovado como um foguete**.
- Durante **todo o voo**, mantém os **braços abertos e a pose original**, sem pose de Superman: visual propositalmente absurdo, reconhecível e provocativo para os invasores.
- Executa rasantes e curvas impossíveis atravessando a frota alienígena; deixa rastro monumental de **fogos de artifício multicoloridos** de Réveillon (verde, amarelo, azul, branco, dourado e outras cores).
- Volta ao Corcovado, reassume a posição original; fogos iluminam Copacabana e aparece **“FELIZ ANO NOVO!”**. Os inimigos restantes são destruídos e a onda termina.
- O Cristo deve desaparecer da posição estática do fundo durante a decolagem e voltar corretamente no final. Os fogos podem persistir brevemente como efeito visual, sem prejudicar a onda seguinte.
- **Substitui o antigo nome e conceito “Operação Soberania”** no design do Supremo brasileiro. Atualização do catálogo de upgrades e implementação ainda pendentes.

### Brasil — tiros e especial

- **Tiro normal:** gambiarra balística, cadência progressiva, motor esquentando, tiros mais fortes e rajadas paralelas; transformação final: **Metralhadora da Soberania**.
- **Especial/escudo:** **Arraial Balístico** reúne **balão junino que explode em fogos** e **Fogueira de São João como escudo ao redor do canhão**, com chapéu de palha e bandeirolas na identidade visual aprovada. Evoluções combinam fogos, brasas, descargas elétricas, cerca elétrica, choques em cadeia e escudo pulsante.
- Nome alternativo **“Curto-Circuito Nacional”** para nível 4 foi apenas sugerido, **não aprovado**; preservar o nome atual até nova decisão.

### EUA — gigantismo militar

- **Tiro normal — Super Size Me™:** projéteis **saem pequenos e crescem durante o voo** (opção B aprovada), aumentando tamanho físico, área de colisão e dano conforme os níveis. A trajetória passa a ser **teleguiada**, corrigindo rota para perseguir alvos. Evoluções tornam os projéteis progressivamente gigantescos e precisos, com limite de legibilidade e desempenho. Não são projéteis gigantes já na boca do canhão.
- **Especial — Choque e Pavor™:** míssil colossal teleguiado que procura agrupamentos e causa explosão gigantesca e onda de choque; melhorias ampliam detonação e defesa/interceptação do escudo.
- **Supremo nível 9 — Operação Liberdade Duradoura™:** após código temático (proposta `FREEDOM`, ainda a confirmar), esquadrilha de **bombardeiros gigantes** lança bombas descomunais; um míssil final ocupa quase toda a largura da tela e causa a finalização cinematográfica. Não substituir por águia mecânica: escolhida a direção **Operação Liberdade™**, com tudo em escala enorme.
- **Transformação nível 10 — Liberdade Irrestrita™:** projéteis enormes, crescentes, teleguiados e explosivos.

### Rússia — inverno, matryoshka e tecnologia orbital

- **Tiro normal — Vórtice Siberiano / Sopro Criogênico (revisão 18/10/2026):** a munição russa tem **visual de sopro de névoa de gelo**, branca, azul-pálida e translúcida, com pequenas volutas e cristais que desaparecem rapidamente. Evitar aspecto de bala quente/laranja e rastro de fogo; **a trajetória, colisão, dano e cadência continuam físicos**. Em híbridos a névoa acompanha os tiros sem apagar as características ofensivas dos demais países.
- **Congelamento contagioso:** o disparo direto congela e mantém a **atração/vórtice** previamente aprovados. Um inimigo congelado diretamente pode emitir **uma única onda contagiosa por ciclo de congelamento** quando outro entra em alcance, quando recebe novos impactos ou quando morre. A onda congela até **quatro alvos vizinhos**, sem dano adicional, com **60% da duração** do congelamento direto. O contágio é **de uma geração**: alvos congelados somente pelo contágio atraem normalmente, mas **não propagam** a onda; se acertados diretamente com gelo posteriormente, podem se tornar novas fontes primárias. Reinicia-se o direito a uma onda apenas após o congelamento anterior expirar e um novo congelamento direto começar. Raio indicativo por progressão: **48/66/84/104/126 px** nos níveis de tiro russo **1/3/5/7/10**; limites de desempenho e legibilidade mantidos.
- **Especial — Matryoshka de Estilhaços:** continua detonando os congelados e emitindo fragmentos de gelo sem replicação infinita, conservando o escudo criogênico. **Recarga 25% mais curta** sempre que o especial russo estiver desbloqueado (Rússia nível 2 ou superior): referência de **8,0 s → 6,0 s** antes de quaisquer outros modificadores do híbrido. A redução combina multiplicativamente com modificadores de recarga de outros países, sem diminuir dano ou alcance.
- **Supremo nível 9 — Protocolo Cortina de Ferro:** o canhão brasileiro **desaparece/retrai**, uma **cúpula metálica gigantesca** cobre **todas** as defesas do Rio (não uma parede vertical). Visual industrial soviético: placas, rebites, estrela vermelha, luzes de alerta. Um satélite espacial dispara um **raio orbital colossal** contra os invasores. Durante a cinemática, todas as defesas ficam invulneráveis. Cúpula recolhe e canhão retorna ao final; elimina inimigos comuns e causa dano massivo a chefes se aplicável, respeitando a regra global de encerramento de onda.
- **Código:** sugestão `SPUTNIK`, `SIBERIA` ou `BURAN`; seleção definitiva pendente.

## Progressão e estado

- Catálogo com **10 upgrades por país**, cinco países, com níveis ímpares de tiro principal, pares de especial/escudo, nível 9 Supremo e nível 10 transformação final. O nível 9 é uma exceção à alternância regular.
- As descrições dos **EUA e Rússia** já foram atualizadas em `src/gameplay/v1Upgrades.js`, **mas não suas mecânicas de combate**.
- **Pendente:** atualizar o nome e descrição do Supremo brasileiro no catálogo; implementar a nova ativação por botão vermelho + câmera lenta de 10% + digitação; implementar os Supremos cinematográficos e as novas mecânicas de EUA e Rússia; testar performance, combinações, acessibilidade e legibilidade.
- Este commit altera **apenas o GDD**, não modifica código, builds ou publicação.

## China — Atacado da Destruição (aprovado em 18/10/2026)

Tema: comércio eletrônico, promoções e logística. Tiro principal multiplica projéteis, herdando efeitos compatíveis de outros países. Especial e escudo usam as mesmas embalagens: drones entregam caixas explosivas, e caixas ao redor do canhão representam a proteção.

| Nível | Nome aprovado | Mecânica |
|---|---|---|
| 1 | Compre 1, Leve 2 | Dispara dois projéteis. |
| 2 | Entrega Expressa | Drone pequeno entrega caixinha explosiva; caixinhas protegem canhão. |
| 3 | Leve 3, Pague 2 | Dispara três projéteis. |
| 4 | Frete Grátis | Drone maior entrega caixa maior; caixas reforçadas protegem canhão. |
| 5 | Compre 3, Leve 6 | Três tiros, cada um se divide em dois durante voo: seis finais. |
| 6 | Carga Pesada | Drone industrial entrega caixona; embalagens pesadas protegem canhão. |
| 7 | Atacado da Destruição | Cinco tiros, cada um se divide em dois: dez finais. |
| 8 | Frete Internacional | Drone colossal entrega contêiner; segmentos de contêineres protegem canhão. |
| 9 | Seu Pedido Chegou! | Supremo cinematográfico com drone espacial colossal e milhares de drones. |
| 10 | Estoque Infinito | Dez tiros, cada um se divide em dois: vinte finais. |

**Regras de divisão:** cada projétil só pode se dividir uma vez; cópias não se dividem novamente. Os tiros divididos causam menos dano do que os originais, mas preservam efeitos compatíveis. Referência de balanceamento a testar: original 100% do dano-base, cópia 50% (valor ainda não aprovado definitivamente). Otimizar efeitos visuais sem alterar o dano efetivo.

**Escudo:** as embalagens são representação do escudo existente, sem vida ou regeneração separadas. Ao se quebrarem, são repostas automaticamente sob as mesmas regras de recuperação do escudo. Especial e escudo evoluem juntos do pacote pequeno ao contêiner.

**Supremo — Seu Pedido Chegou!:** depois do botão vermelho e código, drone aparentemente pequeno aparece no espaço carregando uma caixa; Terra surge ao lado revelando escala gigantesca. Drone solta caixa rumo à Terra. Ela se abre sobre o Rio e libera milhares de drones menores que destroem todos os alienígenas restantes. Mensagem: **PEDIDO ENTREGUE COM SUCESSO!**. Código `ENTREGA` é provisório. Simular enxames com efeitos agregados para desempenho. A onda termina após a cinemática.

**Estado:** design aprovado, não implementado. A atualização deste GDD não modifica o jogo.

## Coreia do Sul — lasers e reflexos (planejamento aprovado em 18/10/2026)

**Identidade:** K-pop futurista, lasers perfurantes e espelhos de palco. O canhão central permanece brasileiro. Tiros podem herdar efeitos compatíveis dos outros países, respeitando limites de desempenho e geração adicional.

**Tiro principal:** evolução proposta: nível 1 **Lightstick Tático** (laser e perfuração inicial); nível 3 **Refrão Perfurante** (mais perfuração); nível 5 **Coreografia de Plasma** (rastro luminoso persistente); nível 7 **Solo de Luz** (feixes longos e perfurantes); nível 10 **Encore Infinito**, **laser contínuo**, que causa dano continuado ao atravessar múltiplos inimigos. Nomes intermediários e detalhes finos permanecem propostas; laser contínuo do nível 10 está aprovado.

**Especial — Bola de Discoteca Orbital:** fica estacionária no ponto de impacto por **4 segundos**. O jogador deve acertar o globo: **cada tiro recebido gera a quantidade de reflexos do nível**, direcionados aos inimigos. Esta decisão substitui a reflexão automática por ativação. Progressão aprovada: **nível 2 = 3 reflexos**, **nível 4 = 6**, **nível 6 = 12**, **nível 8 = 24**. O nível 4 corrige a menção casual ao nível 5, preservando níveis pares de especial. Raios distribuem-se entre inimigos, preservam efeitos compatíveis, sem multiplicação ilimitada. Nomes propostos: nível 2 **Espelho, Espelho Meu**; 4 **Pista de Dança**; 6 **Febre de Sábado à Noite**; 8 **Discoteca Intergaláctica**.

**Escudo — Espelhos de Palco:** pequenos painéis espelhados orbitam o canhão e representam a defesa existente. Podem refletir ataques inimigos; desaparecem ao receber dano e reaparecem conforme a regeneração normal do escudo, sem sistema separado de vida. Evoluem em número e capacidade de reflexão junto à bola orbital.

**Supremo nível 9 — Último Encore (Kim Lin Doo):** ativado pela regra global do botão vermelho e digitação. Código sugerido `ENCORE` (ainda não confirmado). Um palco gigantesco surge no Rio, com fumaça, holofotes rosa e luzes apagando. **Kim Lin Doo é humano em pixel art**, não holograma gigante: a câmera dá um **zoom cinematográfico** nele, revelando roupa extravagante, microfone e cabelo elaborado. Surge legenda **“KIM LIN DOO — AO VIVO NO RIO”**. Ele canta um **refrão curto e original de K-pop (~12 segundos)**; a câmera abre para o palco e dezenas de lasers disparam **continuamente para cima, coreografados e sincronizados com a música**, destruindo os alienígenas. No final, close no artista fazendo um coração com os dedos, lasers convergem e eliminam a frota restante. Mensagem cômica proposta: **“TURNÊ INTERGALÁCTICA CANCELADA”**. A onda encerra após a cinemática.

**Música:** refrão original curto com sintetizadores brilhantes, baixo eletrônico e batida dançante; letra de trabalho proposta com “Bitna, bitna”, “Higher, higher, touch the sky”, “Boom, boom, light it up”, “We own the night”. Produção de áudio posterior, não implementada.

**Estado:** decisões de identidade, laser contínuo, reflexão automática, contagens de reflexos, Kim Lin Doo humano com zoom e coreografia musical aprovadas. Detalhes marcados como propostos ainda não são definitivos. **Nenhum código alterado nesta atualização.**

## Brasil — implementação incremental da cadência e do Arraial (18/10/2026)

- **Tiro principal:** metralhadora rápida desde o nível 1, deslocamento horizontal alternado desde o começo, ciclos automáticos de aceleração, pico sustentado e desaceleração (sem travamento por calor). Níveis 3, 5 e 7 ampliam a cadência; nível 10 **Metralhadora da Soberania** transforma os disparos em feixe visual quase contínuo de **balas físicas**, com picos de superaquecimento mais intensos.
- **Especial Arraial Balístico:** fogos por ativação nos níveis 2/4/6/8: **4/8/16/32**. Ativar especial concede **5 segundos de turbo** ao tiro principal, com multiplicadores **1,5× / 2× / 2,5× / 3×** sobre a cadência do momento; multiplicadores são valores iniciais de implementação para balanceamento.
- **Escudo:** preservar Fogueira de São João, eletricidade e pulsos já existentes; sem vida separada.
- **Código alterado nesta rodada:** `src/gameplay/v1Upgrades.js` e `src/scenes/GameScene.js` na branch de desenvolvimento. **Ainda sem validação em navegador ou testes automatizados nesta sessão**. O Supremo brasileiro continua pendente de implementação conforme decisões anteriores.

## Implementação das transformações de nível 10 — 18/10/2026

Nesta etapa, o conteúdo base dos cinco tiros principais de nível 10 foi acrescentado à branch `feat/brasil2-arraial-balístico`, ainda **sem publicação nem teste de navegador**. A verificação feita até aqui é de sintaxe e das estatísticas de combate; a jogabilidade requer teste manual.

| País | Nível 10 | Mecânica adicionada |
|---|---|---|
| Brasil | **Metralhadora da Soberania** | Mantém projéteis físicos; cadência muito alta nos picos automáticos de calor, varredura horizontal e velocidade de tiro ampliadas. |
| EUA | **Liberdade Irrestrita™** | Balas crescem **gradualmente durante o voo até 12×** o tamanho inicial, ajustam trajetória para perseguir alienígenas e causam impacto em área. |
| Rússia | **Inverno Eterno** | Tiros congelam os inimigos por **3 segundos**, anulando movimento e ataques durante o estado; alvos congelados atraem inimigos próximos num raio de **160 px**. Atrações podem se somar, com teto de intensidade. |
| China | **Estoque Infinito** | Cada salva lança **10 tiros**, cada qual se divide em dois após percorrer parte do voo, chegando a **20 projéteis**. Filhos não podem se dividir novamente. |
| Coreia do Sul | **Encore Infinito** | Tiro principal torna-se **laser contínuo e perfurante**, com um único feixe visual persistente enquanto o botão de atirar é mantido; danos acontecem em pulsos frequentes. |

**Parâmetros provisórios:** números exatos de cadência, dano, alcance e taxa de acerto serão balanceados após teste. Filhos chineses preservam inicialmente o dano dos tiros originais; a redução sugerida anteriormente ainda não é decisão definitiva. Limite de representação gráfica continua independente do cálculo de dano.

**Cobertura automatizada acrescentada:** `tests/v1Transformations.test.js` valida o desbloqueio somente no nível 10, progressões fundamentais e proteção de geração única. Os testes foram adicionados ao repositório, mas ainda não executados no ambiente do projeto nesta etapa.

**Pendências:** testes de navegador, verificação de desempenho com muitas naves/projéteis e alinhamento das descrições/implementações dos níveis 1–9 e dos especiais híbridos. Seções antigas deste documento com status “não implementado” são registros históricos e não substituem este estado mais recente.

## Especiais híbridos e escudos — implementação base (18/10/2026)

Esta seção registra as decisões finais e o **código acrescentado**, prevalecendo sobre as notas históricas de “não implementado” acima. Tudo está na branch `feat/brasil2-arraial-balístico`, **sem publicação ou playtest de navegador**.

### Regras do especial híbrido

1. O **primeiro país a alcançar nível 2** determina a identidade visual do único projétil especial (não necessariamente a primeira escolha da campanha).
2. Cada país evolui seus **próprios componentes** exclusivamente nos níveis **2/4/6/8**. Aumentar o Brasil não fortalece o choque americano, e vice-versa.
3. **Uma ativação, um projétil-base.** A carga chinesa se distribui em impactos internos; raios coreanos e fragmentos russos são calculados sem gerar projéteis recursivos. Marcadores e formas geométricas continuam sendo placeholders.
4. Resolução em fases: **(1) congelamento/atração russos → (2) distribuição chinesa → (3) dano por fogos brasileiros, gelo russo e explosão americana → (4) raios coreanos → (5) empurrão americano**. O fogo brasileiro ainda tem seu cronograma de fogos visual/dano independente, mas é iniciado na fase 3.
5. **Dano integral dos componentes**, sem redutor por misturar países. A onda de choque dos EUA causa **metade do dano da explosão americana apenas fora do raio principal**, evitando sobrepor o dano principal ao choque. O empurrão puro não causa dano.
6. O especial segue acionado pelo **botão direito** do mouse na implementação atual; a tecla ESPAÇO continua reservada ao painel do Supremo. O indicador próximo ao canhão mostra identidade do especial e recarga. Adequação final dos controles fica para a etapa de interface.

### Mecânicas e representação dos escudos

| País | Especial (níveis 2/4/6/8) | Escudo correspondente |
|---|---|---|
| **Brasil** | Arraial: **4/8/16/32 fogos**, turbo por 5 s (**1,5×/2×/2,5×/3×**). | Fogueira de São João, com cerca elétrica e pulsos já existentes. |
| **EUA** | Choque e Pavor: míssil guiado (escala **1×/2×/4×/8×**), explosão, onda de choque para fora da zona principal e empurrão **para cima** de sobreviventes. | **Duas antenas** laterais de choque crescentes; pulsos de empurrão, **sem dano**. |
| **Rússia** | Matryoshka: **8/12/16/24** estilhaços de gelo, congelamento e **detonação em cadeia** em alvos congelados, cada alvo detonando uma vez por ativação, mesmo se morrer pelo fragmento. | Placas de gelo que soltam congelamento de **2/3/4/5 segundos** ao receber impacto, sem dano. Campos de atração se combinam até um limite. |
| **China** | Entrega: **1/2/3/4** impactos de carga agrupados por especial, com raio crescente, dentro de um único ataque; drones/caixas definitivos ainda serão desenhados. | Caixas de proteção tornam-se visualmente maiores/mais numerosas; usam **a vida e regeneração normais** do escudo. |
| **Coreia do Sul** | Discoteca: globo estacionário por **4 s**, com **3/6/12/24 reflexos por tiro que o atingir**; raios se distribuem entre inimigos vivos, repetindo alvos se necessário, e não se replicam. | Placas de espelho que refletem parte dos disparos alienígenas e consomem o HP normal do escudo, com chance provisória crescente. |

**Controles técnicos:** `src/gameplay/v1Specials.js` mantém progressão e identidade; `src/scenes/GameScene.js` processa efeitos, escudos e placeholders; `src/gameplay/v1Upgrades.js` contém nomes e descrições atualizados. Testes adicionados em `tests/v1Specials.test.js`.

**Estado de validação:** sintaxe dos módulos verificada, progressões por níveis checadas e resolução combinada executada em simulação com substitutos leves de Phaser (incluindo cadeia de Matryoshka). Ainda faltam `npm test`, `npm run build`, desempenho e interação de navegador, arte definitiva, sons e balanceamento. Os valores de dano, raio, reflexão e empurrão são provisórios.

## Campanha — Ondas 10 e 11 e dez finais (base implementada em 18/10/2026)

A campanha passa a seguir **Onda 0 → escolha 1 → ... → Onda 9 → escolha 10 → Onda 10 → Onda 11 → final narrativo**. Não há 11ª escolha de upgrade.

### Onda 10 — Fortaleza-Mãe alienígena

- Confronto de **60 segundos** com um chefe central, escoltas, bombardeiro, caças e formações. **Destruir a Fortaleza-Mãe dentro do prazo** avança à Onda 11; tempo esgotado ou canhão destruído permitem repetir a Onda 10.
- **Placeholder gráfico/técnico:** enquanto não existir o chefe Tipo 6 definitivo, reutiliza-se o **Cruzador Tipo 5** reforçado, com faixa de identificação **FORTALEZA-MÃE** e HP adicional. Isso **não substitui** a especificação futura do Tipo 6.
- As dez melhorias acumuladas continuam ativas no confronto, inclusive as transformações de nível 10. Supremo quando desbloqueado usa a janela correta dos cinco segundos finais da onda de 60 segundos.

### Onda 11 — Batalha pela soberania

- Se há países estrangeiros na build, **todos os estrangeiros empatados na maior quantidade de escolhas traem simultaneamente**, usando as regras preexistentes de `src/gameplay/wave11Rules.js`. Brasil puro nunca é traído.
- O confronto cria **um chefe placeholder Tipo 5 por país traidor**, identificado por país e nível próprio. O HP individual recebe o fator de coalizão já definido: **1 chefe 100%, 2 chefes 65%, 3 chefes 45%, 4 chefes 35%**. Os valores finais de vida e habilidade ainda requerem balanceamento.
- Poderes provisórios das frotas adversárias: **EUA** salva extra de mísseis, **Rússia** geada que bloqueia brevemente disparos brasileiros, **China** drones/OVNIs de reforço e **Coreia do Sul** lasers rosados telegrafados. Frequência/carga crescem conforme o nível efetivamente adquirido daquele país.
- Todos os upgrades dos traidores **somem do armamento do jogador durante a Onda 11**. Os demais, inclusive os brasileiros, continuam.
- **Brasil puro (10 escolhas brasileiras):** em vez de traidores, Onda 11 traz a **derradeira nave alienígena**, preservando as duas conclusões Full Brazil.
- A batalha dura no máximo **60 segundos**. É preciso destruir **todos os chefes principais** para vencer; sobrevivência até o relógio zerar não garante vitória.
- Após derrota numa campanha com traidores, aparece a opção **“Continuar resistindo”**, que concede o próximo nível brasileiro disponível, de acordo com `continueResistanceAfterDefeat`, e **reinicia toda a Onda 11 com os chefes originais**. A opção de aceitar a derrota leva ao final de colonização. Depois de esgotar os níveis disponíveis, a derrota se torna definitiva. Não se regeneram upgrades estrangeiros traidores. Níveis de resistência funcionam inicialmente como desbloqueios de arma/escudo; torres de animais legadas não reaparecem.
- O Supremo, se ainda disponível na build sobrevivente, respeita a cinemática estática aprovada. O relógio usa o limite de 60 segundos. Os chefes não podem encerrar a onda antes de terminarem os quadros do Supremo.

### Finais: 10 roteiros canônicos

| Estado | Vitória | Derrota |
|---|---|---|
| **Full Brazil** | Soberania Absoluta | A Última Noite |
| **EUA** | Liberdade, sem a Marca Registrada | Brasil Prime™ |
| **Rússia** | Nem um Palmo de Gelo | Inverno em Copacabana |
| **China** | Pedido Devolvido | Colônia com Frete Grátis |
| **Coreia do Sul** | Encore da Independência | Brasil World Tour |

- Todos os finais possuem **quatro painéis estáticos com texto original**, navegáveis com botão ou Enter/Espaço. A arte ainda é placeholder geométrica em estilo slide/anime.
- Quando vários traidores empatam, o texto reconhece **toda a coalizão**; para preservar dez finais canônicos, o roteiro temático principal segue o primeiro traidor na ordem técnica de coalizão aprovada **EUA → Coreia → Rússia → China**.
- O epílogo pode ser visto depois de vencer ou de aceitar/sofrer a derrota; o menu permite iniciar uma nova campanha.
- Fonte de regras/roteiros: `src/gameplay/campaignFinale.js`; interface: `src/scenes/EndingScene.js`; encontros: `src/gameplay/waves.js` e `src/scenes/GameScene.js`. A Onda 11 foi exposta no menu de playtest V1.

**Estado técnico:** arquivos e testes foram adicionados à branch de desenvolvimento. Foram verificadas sintaxe e regras puras de coalizão/roteiros, mas **não foi executado `npm run build` nem um playtest real no navegador**. Os chefes e as cenas são placeholders deliberados, sujeitos a aprimoramento artístico e balanceamento.

## Ajustes após o primeiro playtest dos finais — 18/10/2026

**Feedback confirmado em jogo:** spritesheet do bombardeiro Tipo 3 aprovada; jogador concluiu a Onda 11 com dez melhorias brasileiras. Ondas 10 e 11 estavam fáceis demais, e o epílogo tentava abrir imediatamente a Onda 0, com travamento relatado.

**Corrigido no código:**
- Após o quarto quadro do epílogo, o botão indica **VOLTAR AO MENU**. Não é mais iniciado automaticamente um novo `GameScene` com a Onda 0; a pessoa escolhe iniciar a próxima campanha no menu.
- Nova função pura `src/gameplay/finaleBalance.js` calibra o HP dos chefes das ondas 10 e 11 segundo o poder de fogo estimado da build que chegou à batalha, sem alterar as ondas anteriores. Para **dez escolhas brasileiras**, as referências atuais são **2.356 HP (Onda 10)** e **2.828 HP (Onda 11)**, em vez dos valores anteriores de aproximadamente **87 e 64 HP**.
- Na Onda 11, o HP de cada chefe da coalizão é reduzido proporcionalmente à quantidade de chefes, respeitando as regras de 65%/45%/35% para 2/3/4 traidores. A resistência brasileira **não aumenta a vida dos adversários** ao melhorar o arsenal do jogador nas novas tentativas.
- Chefes finais têm **duas transições de fúria**, nos limiares de 70% e 35% da vida, com avisos, salvas e invocações mais frequentes. A Fortaleza-Mãe dispara duas balas por salva; chefes de coalizões numerosas disparam uma cada, para manter legibilidade. Balas de chefe causam menos dano individualmente do que as bombas padrão do resto da campanha.
- Barra de vida dos chefes ficou mais larga e muda de cor conforme a fase. Total de escoltas simultâneas fica limitado a dez durante a batalha com coalizão.

**Validação:** teste automatizado específico `tests/finaleBalancing.test.js` foi incluído; expectativas de outros testes foram atualizadas para as mecânicas híbridas e fluxo de ondas presentes. A ação de CI **Verificação do protótipo** passou em 18/10/2026, executando testes e compilação. Falta **novo playtest real no navegador** para confirmar o nível de dificuldade e que retornar ao menu, iniciar outra campanha e jogar a Onda 0 não apresenta travamentos. A causa profunda do travamento original após reinício direto ainda não foi isolada.

## Segundo ajuste de dificuldade das Ondas 10–11 — 18/10/2026

**Feedback:** o novo final retornou corretamente ao menu, mas as Ondas 10 e 11 ainda estavam um pouco fáceis, inclusive na campanha com 10 melhorias brasileiras.

**Diretriz aplicada:** **não aumentar novamente o HP dos chefes**. As resistências continuam determinadas por `finaleBossHp` e pelas mesmas regras de coalizão/resistência. Aumentar desafio com **pressão tática, variedade e antecipação dos ataques**, sem inflar o tempo para destruir os chefes.

- **Onda 10:** primeira escolta ao redor de **4,2 s** (antes 7,5 s); bombardeiro aos **6,7 s**; pinça de caças aos **9,2 s**; outros grupos de Tipo 1/2, bombardeiros e caças até 42 s. O inimigo Tipo 3 já usa sua spritesheet.
- **Onda 11:** pinça aos **3,8 s**, escoltas em **6,2 s**, bombardeiro aos **9,1 s**, novos grupos a cada alguns segundos até 44,5 s. O calendário serve também ao combate contra até quatro países traidores.
- **Chefe final (ondas 10–11):** as fases de 70% e 35% da barra de vida intensificam a cadência e o volume de salvas; o chefe isolado dispara **2/3/4 projéteis** por salva nas três fases, com velocidade e dano crescentes. Coalizões de 2–4 chefes disparam somente **1/1/2 por chefe** para preservar legibilidade.
- Ao entrar em cada fase de assalto, o chefe anuncia e, após **660 ms**, chama um pequeno **contra-ataque de caças**, com bombardeiro extra na última fase dos chefes isolados. O limite é de **duas ativações por chefe isolado** ou **três eventos compartilhados na coalizão**.
- A **onda 11 Full Brazil** tem uma nova **salva orbital alienígena** aproximadamente a cada **8,5 s** enquanto o chefe está vivo, com aviso de **580 ms** e projéteis interceptáveis.
- Preservados: HP anterior dos chefes, tempo máximo de **60 s**, Supremo com eliminação final, melhorias brasileiras da resistência, mecanismos dos outros países e inimigos das Ondas 0–9.
- Testes: `tests/finaleBalancing.test.js` e `tests/campaignFinale.test.js` verificam eventos antecipados, escalonamento de tiros, limites da coalizão e travas de progressão. **Playtest manual ainda pendente** para verificar se este novo ajuste é suficiente.

## Spritesheet inimigo Tipo 4 — Caça Relâmpago (18/10/2026)

- **Arte aprovada:** **Opção C**, caça alienígena ágil de dois estabilizadores, pontas alongadas, asas curvas, casco grafite/aço e núcleos laranja-vermelhos, em **pixel art 16-bit**, simples e legível. Visual distinto do Tipo 3 (Bombardeiro), porém da mesma família industrial alienígena.
- **Imagem pronta para uso:** 512×384 px, fundo transparente, **grade 4×3 de quadros 128×128 px**. O PNG deve ser colocado no clone local em `public/assets/inimigos/tipo4/spritesheet.png` e versionado por Git. A imagem é fornecida separadamente ao desenvolvedor, **não acompanha os commits de código** desta etapa.
- **Animações Phaser:** quadros **0–1** voo normal; **2–3** curva à esquerda; **4–5** curva à direita; **6–7** investida/ataque veloz; **8–9** propulsão; **10** dano; **11** destruição. A spritesheet se encaixa nas fases já existentes do Tipo 4 (`flyby`, `swoop1`, `swoop2`, `telegraph`, `laser`).
- O jogo usa o PNG se a textura estiver carregada; caso contrário mantém o visual vetorial anterior. **IA, HP, velocidade, raio de colisão, rota e dano do Tipo 4 permanecem intactos.** Sprite em campo: 70×70 px, com possibilidade de ajuste visual após teste.
- Arquivo alterado: `src/scenes/GameScene.js`. Testes adicionados: `tests/enemyType4Spritesheet.test.js`; o CI de testes e build passou.
- **Correção adjacente:** o temporizador de invocação de escoltas dos chefes finais passou a usar o perfil de fase calculado, eliminando uma referência a variável `intensity` não definida que poderia interromper a batalha.
- **Próximo teste manual:** criar/colocar o PNG nessa pasta do clone, atualizar código com `Pull origin`, abrir a campanha ou laboratório que gera o Tipo 4 e confirmar voo lateral, curvas, hit e explosão. Somente após `commit` e `push` do PNG o asset fica disponível nos builds do repositório/Pages.

### Tipo 4 — estabilização da animação lateral (18/10/2026)

**Feedback de playtest:** o Caça Relâmpago Tipo 4 aparentava tremer/piscar durante a travessia horizontal e ao trocar de sprites, com pixels laranja soltos no rastro da nave.

**Correção de código aprovada (opção A), aplicada em `src/scenes/GameScene.js`:** voo lateral `flyby` usa um único quadro fixo para cada sentido (frame **2** para direita, **4** para esquerda), em vez de repetir continuamente a animação de dash com rastros de fogo. Quadros laterais passaram a ser animações de um frame sem repetição. A lógica de curvas `swoop1`/`swoop2` usa histerese (+/-105 px/s para alternar lateralmente; abaixo de 45 px/s, propulsão frontal) e trava trocas por **140 ms**. A animação de dash (quadros 6/7) só aparece brevemente no começo de `swoop2`. O frame de impacto 10 fica preservado por 160 ms e a pose lateral é restaurada uma única vez após o dano. Não há espelhamento horizontal desnecessário; mantidos física, colisões, vida e comportamento original.

**Verificação:** `tests/enemyType4Spritesheet.test.js` atualizado com simulações das transições, contenção do jitter e restauração pós-dano; testes e build de CI aprovados. **Pendente:** novo teste visual do jogador. Caso persistam pixels laranja desconectados, é necessário limpar/recortar a arte da spritesheet (opção B), pois a correção A não edita os pixels do PNG.

## Destruição do canhão — sequência dramática (18/10/2026)

Ao perder toda a vida do canhão, uma sequência de aproximadamente **4,8 segundos** precede a interface de derrota:

1. **0–2,7 s:** trinta explosões em salvas ocupam a faixa inferior, com fumaça, estilhaços, clarão localizado e tremor. A última explosão é centrada no canhão.
2. **0–2,1 s:** a mira perde progressivamente a resposta ao mouse, deriva para baixo e o cano cede. Disparos e habilidades cessam na destruição. A música perde volume até silenciar em 1,9 s, preservando o volume escolhido pelo jogador.
3. **2,7–3,35 s:** a imagem real da tela, incluindo o HUD, é comprimida verticalmente como uma TV de tubo desligando.
4. **3,35–4,15 s:** a linha luminosa se contrai em um ponto e apaga.
5. **4,15–4,8 s:** pausa em preto; depois aparecem as opções normais de derrota. Na onda 11, continuam válidas as regras de resistência e de acesso ao epílogo.

A sequência dispara uma vez por destruição. A batalha e seu cronômetro param; não há novas ondas ou disparos durante a cena. Derrota por tempo esgotado mantém o fluxo direto, pois não houve destruição do canhão. Reiniciar limpa o estado da sequência.

**Prévia:** menu TESTAR UPGRADES V1 → TESTAR DESTRUIÇÃO DO CANHÃO (ou D). Abre uma onda de teste e provoca a destruição após a contagem inicial.

Implementação em `src/ui/cannonDestruction.js` e `GameScene`. Efeitos geométricos, sem novos sprites ou sons de explosão; a música existente desvanece. Uma única captura de tela e uma Graphics de explosões limitam a criação de objetos. A validação visual final deve ser feita no navegador do jogador.

**Refinamento após playtest (18/10):** explosões concentradas na região central, até 125 px de cada lado do canhão, e acima de sua base; clarão também centralizado. A interferência começa mais cedo e cresce com chuva de pixels, linhas horizontais e faixas de perda de sincronismo. Chiado sonoro sintetizado acompanha o ruído e cessa ao começar o desligamento, respeitando silenciar/volume e aba oculta. O efeito de contração da tela e sua duração permanecem os aprovados.

## Registro de versão — 0.39 (18/10/2026)

Versão exibida no menu atualizada para **0.39**. Este lançamento reúne a integração musical, a correção do Tipo 4 e a sequência de destruição com refinamentos de interferência e explosões centrais. Notas e situação dos testes em `docs/versao-0.39.md`. Próximas entregas jogáveis devem atualizar o número visível e seu registro de mudanças.

## Versão 0.40 — zoom e ritmo da destruição (18/10/2026)

Refinamento solicitado após playtest: zoom gradual até **1,65×**, com foco no canhão e nas explosões. Interferência visual/sonora e tremor duram **4 segundos**; as salvas centrais continuam até o fim desse trecho. O fechamento em linha leva **220 ms**, a linha e o ponto apagam até **4,47 s** e o resultado entra em **4,7 s**. Essa temporização substitui a da versão 0.39. A captura de desligamento preserva o enquadramento ampliado; zoom e posição da câmera são restaurados ao terminar ou sair da cena.

## Versão 0.41 — globo coreano alimentado por tiros (18/10/2026)

- O componente coreano deixa um globo parado no ponto de impacto por 4000 ms de combate ativo, sem disparar uma salva automática na chegada. A pausa congela sua duração.
- Cada bala recebida é consumida e gera **3/6/12/24 raios** nos níveis **2/4/6/8**. Laser contínuo conta uma vez por pulso de dano, limitado pela cadência da arma, sem depender da taxa de quadros. O feixe termina no globo.
- Raios atingem diretamente inimigos próximos, distribuídos entre alvos distintos quando possível; os excedentes voltam a alvos vivos. Sem inimigos, não há raios nem carga guardada.
- Reflexos não reativam globos nem geram cópias recursivas. Dano por raio e congelamento russo compatível preservados. Escudo coreano mantém as regras existentes.
- Em especiais híbridos, os demais componentes resolvem no impacto e o componente coreano permanece como globo. A vida começa na chegada. Múltiplas ativações têm globos independentes; cada tiro acerta primeiro o globo mais próximo em sua trajetória.
- Contador de duração visível. Globos são retirados ao expirar, limpar a arena ou encerrar o combate.


## Tipo 6 e traidor único — planejamento aprovado (18/10/2026)

**Esta decisão substitui as regras anteriores de coalizão. Implementação pendente; versão jogável permanece 0.41.**

- O Tipo 6 será uma fortaleza enorme e horizontal, ocupando o alto da tela como uma grande barra. Todas as versões compartilham a estrutura, com aparência e ataques próprios para o chefe alienígena e cada país traidor.
- Apenas um país estrangeiro trai. O país com mais upgrades estrangeiros escolhidos é o adversário; em empate, sorteia-se um dos empatados.
- O sorteio ocorre uma única vez por campanha e seu resultado deve ser preservado ao continuar resistindo ou repetir a batalha.
- Não existem coalizões nem vários chefes de países simultâneos. Os fatores de HP por quantidade de chefes serão retirados quando esta regra for implementada.
- Full Brazil enfrenta a versão alienígena.
- A perda de upgrades de países não sorteados ainda precisa ser definida; não aplicar automaticamente a antiga remoção de todos os empatados.

**Ainda são propostas, não decisões aprovadas:** núcleo central, duas alas, quatro posições de armas, hangares inferiores, ocupação de 80–90% da largura e 20–25% da altura, módulos destrutíveis, janelas de vulnerabilidade e padrões específicos de cada país. Próxima decisão: interação entre núcleo e módulos durante a luta.
