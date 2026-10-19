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


## Cubo News — HUD e redação dinâmica (decisões 96, 102–146; v0.44)
- Uma única interface persistente de campanha, na **faixa inferior** da tela: manchete + subtítulo à esquerda, **cronômetro grande e branco à direita**, moldura azul-escura/branca/vermelha de telejornal clássico.
- Cronômetro da onda mostra a duração cheia antes do combate; nas entradas dos chefões só começa quando o Tipo 6 fica alvejável. Nos últimos cinco segundos, moldura pulsa em vermelho, sirene contínua, cobertura interrompida por **plantão desesperado**, notícias pendentes descartadas.
- Manchetes a cada **5 segundos**; fila de no máximo **3** (descartar as mais antigas ao exceder), eventos semelhantes combinados, urgentes aguardam a manchete atual; nenhuma barra adicional de vida permanente.
- Emissora satírica apresenta absurdos com absoluta seriedade: futebol carioca/CBF, cotidiano do Rio, transporte, comércio, burocracia. Manchete faz a piada e subtítulo explica o contexto factual.
- Propaganda estrangeira a partir do primeiro upgrade: 1 elogio discreto, 2–3 elogios fortes, 4+ diplomacia descarada; vários aliados recebem elogios proporcionalmente. A escolha do traidor permanece **sorteio independente** da propaganda.
- No Brasil, upgrades **1–4** recebem desconfiança comercial ("não é importado", concorrência e contratos dos patrocinadores); no **5º upgrade brasileiro em diante**, emissora se torna torcida patriótica e garante que **sempre acreditou** no Brasil.
- Após a traição, Cubo News condena imediatamente o país e diz que **sempre desconfiou**, nega ter publicado elogios e alega falsificação de seus arquivos. Explicação alienígena é o pretexto editorial da emissora, não fato estabelecido.
- Na Revanche Brasileira Full Brazil, arrogância patriótica está no máximo desde o início, com delírios de grandeza, até superioridade às leis da física.
- Banco **compacto**, alvo de três manchetes por situação, **rodízio sem repetição**. Textos confirmados no primeiro lote: 142 A/B, 143 A/B/C (com espaço para PIX), 144 A/B/C, 145 A/B/C, 146 A/B. **142-C deve ser retrabalhada com CBF e clubes cariocas, sem FIFA**; 146-C necessita versão com Cubo News explicitamente 100% patriota, não tratando o traidor como "antigo aliado"; registrar esses textos como **pendentes de aprovação editorial**, não como aprovados.
- Tom editorial das manchetes em docs e módulo `src/gameplay/cuboNews.js`; novas manchetes têm de ser aprovadas individualmente antes de se tornarem definitivas.
- A arte final da faixa, a sonorização e legibilidade em telas menores devem ser avaliadas no playtest; nenhuma alteração de regra é inferida disso.

## Implementação 0.44 — Fortaleza e Cubo News (19/10/2026)
- Regras compartilhadas do Tipo 6 e cinco variantes atualizadas em `docs/GDD-TIPO-6.md`.
- Motor de combate, efeitos de escudo, entrada cronometrada, novo lower-third e notícias dinâmicas integrados à branch de desenvolvimento.
- O desenho de sprites e algumas cinematografias permanecem como **placeholders** até fase de arte.


## Cubo News v0.45 — Composição de televisão separada da cena (19/10/2026)
**Esta seção substitui o desenho anterior do lower third da v0.44, sem alterar a linha editorial, intervalos ou fila aprovados.**
- O **canvas de jogo permanece com resolução lógica 960×540**; o noticiário é um elemento HTML **externo** logo abaixo do canvas, com altura nominal de **44 px**, dimensionado junto com ele. Assim, os prédios do Rio e o canhão continuam inteiros dentro da imagem, acima do noticiário: **não há necessidade de mudar a arte de fundo nem deslocar o canhão**.
- O visor completo em ondas ocupa 960×584 unidades lógicas; nos menus, o ticker desaparece e o jogo retorna a 960×540. A função de responsividade reduz a composição para caber integralmente na área útil, respeitando safe areas e o aspecto original do jogo.
- Referência editorial: etiqueta **vermelha trapezoidal CUBO NEWS**, bloco fino de **manchete em preto sobre prata/cinza**, e rodapé **vermelho** com subtítulo **em movimento contínuo da direita para a esquerda** (duas cópias, laço sem lacunas).
- O cronômetro ocupa a **direita**, com números muito maiores, **sem moldura**, cor branca semitransparente, leve sombra. Nos últimos 5 segundos pulsa em **vermelho**; a sirene e o plantão final permanecem.
- A faixa, incluindo relógio, é **DOM externo**, nunca GameObjects Phaser. Não recebe efeitos de `camera.shake`, `camera.setZoom`, CRT ou deslocamento do mapa. A mira e as hitboxes continuam relativas apenas ao canvas 960×540.
- A cada notícia troca manchete e subtítulo; o ticker reinicia o movimento com duas cópias de texto. A fila, a publicidade, as notícias urgentes e os intervalos de **5 s** permanecem idênticos aos definidos na v0.44.
- Badge de versão e outros textos persistentes de campanha não são desenhados sobre a faixa. O selo de versão fica oculto enquanto a transmissão está ativa.
- A nova apresentação usa apenas HTML e CSS; não exige nova imagem de fundo nem sprites extras. A troca de cenas mostra/oculta o noticiário e recalcula o layout sem interferir com o estado do jogo.


## V0.46 — Amanhecer, cobertura otimista e HUD 5×7 pixel art (19/10/2026)
- **Premissa editorial para ondas 0–9:** os invasores prometeram ir embora **ao amanhecer**, condicionando a retirada a que o **Líder Supremo cruzasse os braços**. O Líder Supremo é o Cristo Redentor, cujos braços não se cruzam. Assim, os alienígenas continuam atacando todas as noites; a Cubo News não percebe ou minimiza a contradição, mantendo tom **aliviado, confiante e alegre** até o final da onda 9. Apenas a partir da onda 10 a cobertura assume urgência real. A promessa é parte do enredo ficcional, não uma afirmação sobre fatos reais.
- Adicionar `dawnPromise`, `dawnRoutine`, `dawnEmergency` ao banco dinâmico; revezar com o humor comercial, o futebol, as manchetes brasileiras e a propaganda estrangeira já aprovada, sem reescrever manchetes antigas definitivas.
- Alertas nos últimos cinco segundos continuam existindo em todas as ondas, mas até a onda 9 são **esperançosos/otimistas**, sem “catástrofe iminente”; das ondas 10 e 11 em diante, seguem desesperados conforme aprovado anteriormente.
- **Cronômetro:** só números de segundos, sem minutos, zeros à esquerda nem separador: `30`, `29`, ..., `0`; `60` para chefões. É **ainda maior** à direita, sem caixa, semitransparente, passando a vermelho nos últimos cinco segundos.
- **Abertura de todas as ondas:** antes do primeiro disparo, pausa do relógio e dos spawns; exibir título **“TEMPO ATÉ O AMANHECER”** e número grande `30`/`60` centralizados. Após pausa para leitura, deslocar o **mesmo número** suavemente até o canto direito sobre a Cubo News. Só liberar o combate/spawns após essa transição. Substitui a contagem antiga 3–2–1. A entrada cinematográfica do Tipo 6 ainda congela separadamente o cronômetro até o chefe ficar **alvejável**.
- **Estética:** todos os textos visíveis da faixa — cabeçalho, marca, ticker e relógio — usam glifos bitmap desenhados em matriz **5×7** nativa, com pixels rígidos (`image-rendering:pixelated`), cores sólidas e bordas quadradas. Nenhuma fonte externa/download; a exportação single-file deve funcionar offline.
- O ticker mantém movimento da direita para a esquerda e o HUD, incluindo a animação central da contagem, é **HTML independente da câmera Phaser**, imune a zoom e screenshake. A faixa permanece fora do canvas de combate, abaixo do cenário. Preservar canhão em (480,494), fundo do Rio e todas as hitboxes.
- Testes automatizados para temporização, contagem por segundos, render bitmap, histórias otimistas 0–9 e ciclo de vida do DOM; validação visual e ajustes de duração e tamanho ainda dependem de playtest.


## Refinamento Cubo News — v0.47 (19/10/2026)
- A matriz de glifos 5×7 era pixelada demais e **prejudicava a leitura**. Na interface ativa, usar tipografia retrô legível nativa do navegador (fonte monoespaçada forte na manchete, ticker e título; algarismos grandes e claros no relógio), mantendo **blocos de cor sólidos, bordas retas e estética de jogo em pixel art**. Não depender de fontes externas ou CDN para exportar HTML offline.
- O relógio continua mostrando **apenas os segundos** (`30`, `29`, `60` etc.) sem `00:`; permanece maior e semitransparente no canto inferior direito, fora do canvas e imune a zoom e screenshake durante combate.
- Na abertura de **todas as ondas**, a câmera do cenário inicia aproximada (zoom 1,48×). O título `TEMPO ATÉ O AMANHECER` e o número, **maior que na v0.46**, ficam legíveis por **2,2 s**. Depois há um zoom-out do cenário até 1× de **1,75 s**, ao mesmo tempo que o número se reduz, desliza até a posição do relógio e faz **crossfade** gradual com o relógio final. Título e moldura somem por **fade** de 0,75–0,85 s, não por corte brusco.
- A onda e os spawns só começam depois que ambas as transições terminam. Pausar a cena pausa a vinheta; encerrar a cena no meio restaura zoom=1 para não deixar câmera aproximada.
- As regras do Tipo 6 continuam: após a abertura do contador, o tempo só começa quando o chefão está alvejável.
- O HUD de notícias segue externo ao canvas (faixa de 44 px sob 960×540), sem cobrir o Rio nem o canhão; notícias/ritmo/editorial inalterados.


## Game Soberana v0.48 — Fonte de caixa mista e menus Cubo News (19/10/2026)
- A fonte bitmap 5×7 existente passa a ter **glifos minúsculos próprios**. Preserve o caso e os acentos originais no renderer, sem converter todos os textos a maiúsculas. O uso indiscriminado de CAIXA ALTA prejudicou a leitura.
- Manchetes de origem em maiúsculas são apresentadas no HUD em **caixa de frase**, preservando nomes próprios, siglas, referências brasileiras e o conteúdo original do banco de notícias. Subtítulos são corridos em pixels com minúsculas; manter contraste e bom espaçamento.
- O **cronômetro maior, apenas em segundos**, e o número central da vinheta “Tempo até o amanhecer” recuperam a **fonte verdadeiramente pixelada**. O zoom-out e o tempo total da v0.47 permanecem inalterados.
- **Identidade comum em todos os menus:** cabeçalho vermelho azul-marinho `Cubo News`, marca AO VIVO, chamadas jornalísticas, títulos em pixel art misturando maiúsculas e minúsculas, botões retangulares com detalhes vermelhos, e tarja de plantão. Telas abrangidas: MenuScene, PauseScene, UpgradeScene (mesa de boteco preservada), V1PlaytestScene, LabSetupScene, UpgradeLabScene, EndingScene e painéis de derrota/vitória/última batalha em GameScene.
- **Sem alterar navegação, teclas, fluxo da campanha, regras de upgrades ou de chefões.** Scripts reutilizáveis: `src/ui/cuboNewsTheme.js`, `src/ui/menuButton.js` e `src/ui/pixelFont.js`.
- A faixa de notícias de combate permanece fora do canvas Phaser. O menu é renderizado pelo Phaser com layout nativo e texto em imagem bitmap para elementos de destaque; textos longos de ajuda ficam monoespaçados, legíveis.


## DECISÕES 147–169 — Pacote v0.49 (19/10/2026)

**Decisões aprovadas no planejamento e agora autorizadas à implementação, prevalecendo as observações sobre a letra original de cada opção.**

147-A: Remover efeitos defensivos dos upgrades de escudo preservando o número de 50 escolhas. 148-C e 158-A: o domo universal do canhão ganha 180% do raio antigo, inclusive na colisão, mantendo progressão azul/verde/amarelo/vermelho. 149-C: o jogador é um burocrata do RJ que entra sem querer na cadeia de comando, depois que um ex de São Paulo se vingou de “biscoito” contra “bolacha” inscrevendo o jogador como mesário — gênero do ex nunca especificado. 150-B: intro de 20 a 25 segundos. 151-C: ondas 0–2 mais intensas, mais naves e ataques antecipados, tipos 1 e 2 disparam enquanto pairam. 152-A: nenhum spawn após restarem 15 s nas ondas comuns; formações organizadas geometricamente. 153-A e 163-B: Lightstick exige duas vezes o acúmulo, com rastro luminoso. 154-A: Cubo News elogia e depois despreza a cultura dos aliados traidores. 155-A: manter escudos individuais e barreira frontal dos chefões Tipo 6.

156-A ajustada: razão única do término é falar “biscoito” em vez de “bolacha”, não o relacionamento burocratizado. 157-B ajustada: nome primeiro, plantão alienígena, ex comunica vingança, mesário vira general após baixas militares, deve escolher apoios internacionais. 159-B ajustada: os especiais já tinham propriedades ofensivas, então **apenas retirar suas propriedades defensivas e textos**, sem criar substitutos e sem rebalancear ataques (exceto Lightstick). 160-B: dança sincronizada em senoides, círculos e espirais. 161-C: Tipo 1 projétil único, Tipo 2 salva anunciada; tiros suficientemente grandes para interceptação. 162-A: não sumir acima do céu visível. 164-B ajustada: nos 10 segundos finais **somente ataques**, nenhuma coreografia; nos 15 segundos finais não surgem novas naves.

165-C: nome salvo e editável entre campanhas, nome aleatório caso vazio (20 exemplos masculinos e 20 femininos, não exige gênero). 166-A: plantão em slides ilustrados e pulável. 167-C: luz do amanhecer e retirada alienígena **somente após cronômetro atingir zero**, arte da cidade nascer do sol chegará depois. 168-B: aproximações ofensivas diretas e coordenadas no fim. 169-A: disparos inimigos crescem 150% também na hitbox.

**História canônica alienígena:** etiqueta interplanetária considera braços cruzados expressão de respeito, relaxados toleráveis e braços abertos uma ofensa máxima. Ao chegar à Terra, os alienígenas julgam o Cristo Redentor o Líder Supremo e exigem braços cruzados; só atacam à noite porque bombardear de dia é falta de educação; como o Cristo nunca cruza os braços, a guerra se repete. Cubo News confia ingenuamente no acordo e continua a anunciar que a retirada será iminente. Kim Lin Doo confunde BTS com **Batalhão Tático de Seul**.

**Identidade Cubo News aprovada:** Emissora Oficial Brasileira, IBM Plex Sans (sem fonte bitmap para textos de UI), verde-petróleo #134B45, ouro #EDC75A, creme #F5F0DC, grafite #152926. Menus e faixa noticiosa unificados.

**Bugs obrigatórios:** tiros comuns precisam atingir barreiras/módulos/núcleo Tipo 6; onda 11 China e Coreia não pode congelar/travar. Pré-requisitos de publicação: CI de regressão, Vite build, exportação itch.io e playtest GitHub Pages na branch de desenvolvimento; não alterar main. Para detalhes implementados, consulte `docs/versao-0.49.md`.


## Ajuste v0.49.1 — Onda 0 mais acessível (19/10/2026)
Feedback do playtest: os padrões sincronizados agradaram, mas havia **inimigos demais na onda 0**, tornando o começo desproporcionalmente difícil. Preservar todos os padrões (senoide, círculos, espiral, cruzamento); reduzir exclusivamente a programação da primeira noite para **quatro grupos de Tipo 1**, com 3, 4, 4 e 5 naves, total de 16. Chegadas programadas em 1,1 s, 4,6 s, 8,1 s e 11,6 s. Assim há mais tempo para aprender os controles e interceptar os disparos durante as pausas; encerramento de spawns antes dos últimos 15 s permanece. Ondas 1–11 não são alteradas por este hotfix. A v0.49.1 é um ajuste de dificuldade, não uma nova regra de formação ou de inimigo.


## Hotfix v0.49.2 — Densidade com tempo de reação (19/10/2026)

**Balanceamento da onda 0:** 22 inimigos em quatro grupos (5, 5, 6 e 6). Entradas aos 0,9 s, 4,2 s, 7,8 s e 11,4 s. Os movimentos sincronizados foram desacelerados: cada formação passa 6,5 segundos coreografando, seguida de 3,1 segundos pairando antes do mergulho. O primeiro tiro acontece no mínimo 1,5 segundo após começar a pairar, com defasagem de 0,2 segundo entre as naves. Durante a onda 0, mergulhos têm 70% da velocidade anterior e projéteis, 85%. **Ondas 1–11, regras de amanhecer e mecânicas ofensivas dos países permanecem inalteradas.**

Aumentar quantidade não significa antecipar dano: primeiro mostrar a coreografia e dar ao jogador tempo suficiente para mirar e agir. Quatro formações serão preservadas, com incrementos de dificuldade graduais. O limite de novos spawns até 15 segundos decorridos, e a exigência de últimos dez segundos dedicados a ataques, continuam válidos.


## Hotfix v0.49.3 — 48 naves e cinco portais, voos globais desacelerados (19/10/2026)

**Novos portais da onda 0:** 48 inimigos distribuídos em **cinco portais realmente distintos**, com entradas em três etapas: um portal central sozinho (8 naves, 0,8 s); dois portais simultâneos à esquerda/direita (10 + 10 naves, 4,6 s); e outros dois simultâneos mais externos (10 + 10 naves, 9,6 s). Posições X: 480; 235 e 725; 125 e 835. O portal final conclui a entrada de todos antes dos 15 segundos regulamentares. Os disparos graduais e as pausas longas da onda 0 foram preservados.

**Velocidade dos inimigos em todas as ondas:** voos, perseguições e mergulhos dos invasores comuns (tipos 1–5) passam a usar **78% da velocidade anterior**, além de coreografias desaceleradas nas outras ondas; a onda 0 conserva o mergulho didático a 70% e a dança lenta de 6,5 s. O Tipo 6 mantém seu ritmo especial para não alterar o equilíbrio dos chefões.

A abertura continua educativa por causa do atraso de tiros e da pausa anterior aos mergulhos. Não antecipar a fase ofensiva do relógio: após os 20 segundos decorridos (últimos dez segundos), as coreografias cessam, conforme decisão 164.


## Decisões 170–180 — Pacote v0.50 (19/10/2026)
**170-A:** cinco retratos sobre as cadeiras da imagem do boteco de DIA do usuário (Brasil, EUA, Coreia, Rússia, China). **171-A:** clique escurece todo o boteco/outros retratos; retrato selecionado cresce, anima ao canto superior esquerdo. **172-A:** texto flavor e informações mecânicas do upgrade simultâneos, com espaço abaixo para vídeo futuro (não implementar vídeo agora).
**173-A:** Cubo News retorna à paleta AZUL-NOTURNO jornalístico `#0B1621`/ `#193043`/ `#DCE8EE`/ `#E2A45E`/ `#C45151`. **174-B:** IBM Plex Sans no texto, IBM Plex Mono nos números. **175-A:** cronômetro maior, discreto e sem moldura.
**176-A:** introdução visual novel de 20–30 segundos com avanço automático e por clique. **177-A modificada:** o nome é digitado ao LOGIN no PC velho de trabalho; depois surge a área de trabalho e o jogador CLICA o link da Cubo News no navegador em vez de trabalhar. **178-A:** diálogos dos próprios alienígenas ao verem o Cristo, não só jornalista narrando.
**179-C e observações posteriores:** histórias idiotas de representantes com humor brasileiro, escolhidas como base. Brasil = foguete de São João confundido com armamento aeroespacial; EUA = pontos de milhas/sala VIP confundidos com promoção militar; Coreia = Kim Lin Doo, integrante de K-pop convocado ao serviço militar e promovido involuntariamente, brinca com BTS (Batalhão Tático de Seul); Rússia = congelamento de contas bancárias interpretado como tecnologia criogênica; China = logística com cinco estrelas que vira comando militar automaticamente. **180-B:** cada biografia aparece progressivamente conforme o jogador escolhe novos upgrades daquele país.
Todos os diálogos de humor e manchetes são **PLACEHOLDERS editáveis**; a revisão integral de textos ocorrerá perto do lançamento. Textos mecânicos dos upgrades devem ser sempre precisos. Personagem ex sem gênero.
**BUG OBRIGATÓRIO:** Brasil nível 10, `Metralhadora da Soberania`, deve atingir Tipo 6 corretamente mesmo se mirar no vão entre módulos, sem contornar barreira, escudos próprios ou núcleo vulnerável.

Implementação e testes de referência: `docs/versao-0.50.md`. Não incluir novos sistemas defensivos nem rebalancear efeitos ofensivos. `main` permanece intocada.

## Fluxo de trabalho aprovado (19/10/2026)
- Usar `origin/feat/brasil2-arraial-balístico` como branch de desenvolvimento; testar por `git pull` e laboratório local, sem exigir GitHub Actions ou Shift+0.
- Registrar cada decisão aprovada no GDD. Registrar toda alteração implementada também no histórico da versão, sincronizando a versão exibida no jogo.
- Etapa atual: jogabilidade e apresentação visual. Etapa posterior: revisão literária, piadas e diálogos. Preservar fatos canônicos dos cinco representantes; falas e humor provisórios, textos mecânicos precisos.
- Próximas prioridades: boteco diurno com cinco retratos e seleção animada; Cubo News com HUD escuro e fontes aprovadas; abertura em visual novel no computador da repartição; diálogos provisórios; polimento textual ao final.
- Reservar espaço para prévias animadas de upgrades, sem implementar os vídeos agora.
- Feedback visual Tipo 6 implementado na v0.51: flashes localizados, microtremor exclusivamente gráfico e bursts reforçados.

## Bugs reportados em playtest — 19/10/2026 (investigação, não corrigidos)
- Travamento intermitente ao iniciar a onda 0.
- Travamento intermitente na onda 11 com build totalmente coreana.
- Após derrota na onda 11 e aceite de reforço brasileiro, foi observado um retângulo preto cobrindo parte inferior esquerda do cenário.
- Evidências: capturas fornecidas pelo jogador no chat. Investigar logs do console, etapas de transição/reinício de `GameScene`, limpeza dos objetos de efeitos da build coreana, carregamento e desempenho. Não atribuir causa sem reprodução.
- Critérios de aceite: onda 0 inicializa repetidamente sem travar; onda 11 coreana conclui várias tentativas; reinício com reforço brasileiro não deixa artefatos visuais; `npm test` e `npm run build` passam. Registrar correções na próxima versão quando confirmadas.

### Proteção de inicialização de ondas — implementada v0.52 (19/10/2026)
- A contagem 30/60 da Cubo News continua cinematográfica e não consome tempo de combate.
- O início da onda deve ser idempotente: se o callback da animação visual não concluir, um limite de segurança de 5,3 segundos encerra a intro e inicia a onda exatamente uma vez.
- O mecanismo cobre onda 0 e onda 11; esta é uma correção preventiva para o relato de tela estática sem inimigos e cronômetro. Causa real ainda depende de reprodução.
- Quadrado preto depois do reforço brasileiro permanece em investigação; não marcar como resolvido.

### Correção do HUD Phaser — v0.53 (19/10/2026)
- Erro observado na onda 11 full Rússia: `Uncaught TypeError: can't access property "drawImage", this.data is null` em `Phaser.Text.setText`, chamado por `updateHud` ao atualizar o rótulo do especial.
- Decisão implementada: rótulos de texto ocultos/inativos não devem receber `setText`; textos visíveis só são atualizados quando o conteúdo muda, reduzindo regeneração de texturas.
- A campanha mantém `specialLabel` e `ultimateLabel` ocultos (informação exibida pela Cubo News); nenhuma alteração de jogabilidade.
- Ainda é necessário reproduzir/validar no Firefox e executar testes locais antes de considerar a origem completa do erro resolvida.

## Soberania Wave Maker — direção aprovada para planejamento (19/10/2026)
- Criar ferramenta visual integrada ao laboratório para projetar e testar ondas sem editar código: origem/posição dos inimigos, tipo, quantidade, instante de entrada e sequência de eventos.
- Proposta arquitetural em avaliação: editor com mapa de spawn, linha do tempo e prévia jogável, persistência local e exportação/importação JSON; definições separadas da lógica de execução para permitir reaproveitar o sistema de ondas.
- Escopo, interface, parâmetros avançados e modo de publicação no jogo ainda precisam de decisão; não confundir este registro de intenção com funcionalidade implementada.

### Decisão aprovada — Wave Maker integrado ao Laboratório (19/10/2026)
- **Opção A aprovada:** o Soberania Wave Maker será uma ferramenta dentro do Laboratório Soberana, não um site independente.
- Objetivo: criar, visualizar, ajustar e testar ondas por eventos (tempo, origem, tipo, quantidade e formação) com seleção visual e linha do tempo, reaproveitando o motor de eventos existente.
- Plano de implementação em etapas: (1) schema independente e validação de eventos; (2) cena/aba do editor e controles de eventos; (3) prévia jogável via GameScene e retorno ao editor; (4) salvar/carregar e importar/exportar JSON; (5) mecanismo explícito de publicar uma onda aprovada na campanha.
- Isolar rascunhos de mudanças oficiais: testar uma onda editada não pode sobrescrever a definição canônica da campanha. Não alterar as ondas existentes nesta fase de planejamento.
- Parâmetros extras (rotas customizadas, IA de tiro e análises automáticas de dificuldade) ficam para fases posteriores. Continuar decisões antes de implementar; registrar implementações também por versão.

### Wave Maker — edição temporal aprovada (19/10/2026)
- **Opção A aprovada:** os eventos podem ser arrastados na linha do tempo para mudar o instante de entrada, e também editados por campos numéricos com precisão (por exemplo, 7,5 s).
- Ambos os controles devem permanecer sincronizados; a posição do evento e o valor do campo representam o mesmo tempo.
- Planejamento apenas: nenhuma mudança no comportamento das ondas ou código do editor nesta decisão.

### Wave Maker — posicionamento espacial aprovado (19/10/2026)
- **Posicionamento livre aprovado:** selecionar e arrastar o ponto de entrada de cada evento diretamente no campo de batalha.
- A posição deve também ser editável numericamente por coordenadas X/Y. Alterações no campo e nos valores numéricos permanecem sincronizadas.
- O editor deve mostrar claramente limites do cenário e posição real de surgimento, sem modificar os padrões de movimento já definidos para cada tipo sem decisão posterior.
- Apenas planejamento nesta etapa; não implementar nem mudar ondas atuais ainda.

### Wave Maker — grupos automáticos e processo de decisões (19/10/2026)
- **Opção A aprovada:** criar grupos de inimigos com distribuição automática por formação (por exemplo linha, V, coluna ou círculo) a partir de tipo, quantidade e posição do grupo; ajustes individuais são possíveis, sem perder a estrutura de grupo.
- **Preferência de planejamento do usuário:** agrupar várias perguntas de múltipla escolha em uma rodada e oferecer um campo de comentário específico para cada pergunta. Evitar sequência de uma pergunta por turno quando decisões relacionadas puderem ser reunidas.
- Apenas decisão de design: editor não implementado nesta etapa.

### Wave Maker — decisões 5–9 aprovadas (19/10/2026; planejamento)
- **Decisão 5 — B, somente padrões existentes:** movimentos disponíveis no Wave Maker devem reutilizar os padrões já implementados no jogo. Não desenhar rotas personalizadas nesta fase.
- **Decisão 6 — B, perfis de agressividade:** controlar disparos dos grupos por perfis predefinidos (por exemplo pacífico, leve, moderado, intenso, extremo), em vez de exigir edição detalhada de cadência, quantidade, velocidade e primeiro disparo. Definições numéricas exatas dos perfis ainda precisam ser planejadas.
- **Decisão 7 — A, simulação visual e teste jogável:** oferecer prévia da onda sem comandar o canhão e execução jogável com a build de teste selecionada.
- **Decisão 8 — C, ambos (aprovação com dúvida expressa):** prever duplicação manual de eventos e repetição automática por quantidade/intervalo. **Comentário do usuário: "Não entendi essa pergunta."** Esclarecer com exemplos antes de especificar o funcionamento detalhado; não tomar a aprovação como definição dos detalhes.
- **Decisão 9 — C, versões e histórico de alterações:** permitir salvar rascunhos, recuperar versões anteriores e importar/exportar JSON. Persistência técnica e política de retenção ainda a definir.
- **Status:** somente planejamento. Não alterar código do editor, ondas da campanha nem lógica dos inimigos por estas decisões.

### Soberania Wave Maker — decisões 10–14 aprovadas (19/10/2026; somente planejamento)
- **Decisão 10 — A: cinco níveis fixos de agressividade.** Perfis: Pacífico, Leve, Moderado, Intenso e Extremo. Cada perfil determinará automaticamente o comportamento ofensivo do grupo, sem controles avançados individuais na versão planejada. Valores precisos e interações com os padrões atuais ainda a definir.
- **Decisão 11 — A: simulação visual completa.** O editor deverá mostrar naves, movimentos e projéteis e permitir pausar, acelerar e navegar para um instante específico da onda; oferecer separadamente o teste jogável já aprovado. A implementação técnica da navegação temporal permanece aberta.
- **Decisão 12 — C: histórico automático mais versões nomeadas.** Recuperação de rascunhos por salvamento automático e criação manual de marcos nomeados; definir depois armazenamento, limites e restauração.
- **Decisão 13 — A: criar uma cópia editável.** Abrir uma onda oficial no editor gera rascunho independente; alterações e testes não alteram a definição original.
- **Decisão 14 — A: exportar JSON para integração no código.** Publicação oficial é feita pela integração deliberada do JSON no código/repositório, não por substituição automática no navegador. A exportação não modifica sozinha a campanha.
- **Status:** decisões de design registradas, sem implementação, alteração das ondas atuais ou incremento de versão. Próximos pontos de planejamento: parâmetros numéricos dos cinco perfis, formato do JSON, arquitetura da simulação e histórico.

### Soberania Wave Maker — decisões 15–19 aprovadas (19/10/2026; somente planejamento)
- **Decisão 15 — A, apenas frequência dos tiros:** os cinco perfis fixos de agressividade (Pacífico, Leve, Moderado, Intenso, Extremo) modificam somente a cadência/frequência de disparos. Quantidade por disparo, velocidade e identidade dos projéteis, padrões e demais atributos do inimigo permanecem intactos. Multiplicadores numéricos ainda não definidos.
- **Decisão 16 — A, usar o motor real do jogo:** a simulação completa do Wave Maker reutilizará as mecânicas e a lógica reais da partida, em vez de criar uma simulação paralela simplificada. Pausa, aceleração e navegação temporal devem ser projetadas com cuidado para manter determinismo e fidelidade; estratégia técnica ainda aberta.
- **Decisão 17 — A, 10 versões automáticas + versões nomeadas:** guardar no máximo as dez versões automáticas mais recentes por onda, além dos marcos nomeados pelo usuário. Definir gatilhos de snapshot e tratamento do limite posteriormente.
- **Decisão 18 — A, armazenamento no navegador + JSON:** rascunhos e históricos locais persistem no navegador; exportar/importar JSON para backups e posterior integração deliberada ao código. Não pressupor sincronização entre dispositivos.
- **Decisão 19 — A, pixels e milissegundos:** salvar posições X/Y em pixels do campo de jogo e os tempos dos eventos em milissegundos, seguindo a referência do motor atual. O editor pode apresentar segundos legíveis ao usuário, sem mudar o formato persistido.
- **Status:** exclusivamente planejamento. Nenhum código, configuração de onda ou número de versão alterado por esta rodada.

### Soberania Wave Maker — decisões 20–24 aprovadas (19/10/2026; somente planejamento)
- **Decisão 20 — B, progressão ampla:** perfis fixos de agressividade de disparos: **Pacífico = 0%** (não atira); **Leve = 50%**, **Moderado = 100%** (cadência original do tipo), **Intenso = 150%**, **Extremo = 200%**. Percentuais aplicam-se à frequência de disparos, sem alterar tipo, dano, velocidade ou quantidade por disparo. Regras específicas para inimigos sem tiros ou padrões especiais ainda precisam de detalhamento técnico.
- **Decisão 21 — A, reiniciar e reproduzir até o instante:** ao retroceder na simulação, recriar o estado inicial da onda e avançar internamente, com o motor real de jogo, até o instante escolhido. Determinismo e avanço rápido serão requisitos de implementação, não funcionalidades já disponíveis.
- **Decisão 22 — A, após cada sessão de edição:** gravar um ponto de recuperação ao finalizar uma sequência de alterações; não criar snapshots a cada movimento do mouse durante o arraste. Manter o limite de dez versões automáticas por onda, além das versões nomeadas (decisão 17).
- **Decisão 23 — A, indicadores objetivos:** exibir total de inimigos, grupos simultâneos e estimativa de disparos. **Sem** nota subjetiva de dificuldade nem alerta automático de saturação nesta etapa.
- **Decisão 24 — A, escolher build antes do teste:** antes de executar a onda editada, selecionar a configuração de upgrades no laboratório e iniciar diretamente o teste jogável dessa onda; não presumir build brasileira fixa.
- **Status:** decisões exclusivamente no GDD. Não modificar código, dados existentes de onda nem número de versão.

### Soberania Wave Maker — decisões 25–29 aprovadas (19/10/2026; somente planejamento)
- **Decisão 25 — B, único arquivo com todas as ondas:** a configuração exportada da campanha fica em **um único arquivo JSON**, reunindo todas as ondas para visão geral e versionamento. Definir futuramente nomes de campos e schema.
- **Decisão 26 — A, preservar todos os parâmetros existentes:** ao importar ondas, conservar tipo, nível, formação, posição, avisos e demais propriedades avançadas, inclusive aquelas sem controle visual no editor. Edição não pode apagar silenciosamente dados desconhecidos ou não expostos na interface.
- **Decisão 27 — A, semente aleatória fixa por teste:** testes devem ser reproduzíveis com a mesma semente, permitindo trocá-la para explorar variações. Integrar a semente ao motor real sem mudar a aleatoriedade da campanha inadvertidamente.
- **Decisão 28 — C, perguntar ao alterar duração:** oferecer escolha explícita entre manter instantes originais dos eventos ou redistribuí-los proporcionalmente à nova duração.
- **Decisão 29 — A, grupos expansíveis:** cada grupo é um bloco na linha do tempo, expansível para visualizar e ajustar as naves individualmente; preservar identificação/pertencimento ao grupo e seus padrões.
- **Status:** apenas documentação de decisões. Não implementar o Wave Maker nem modificar ondas, código ou versão nesta etapa.

### Soberania Wave Maker — decisões 30–34 aprovadas (19/10/2026; somente planejamento)
- **Decisão 30 — A, painel de propriedades avançadas:** exibir e permitir editar atributos técnicos dos eventos com validação e preservação de propriedades importadas, inclusive as que não possuem widget próprio.
- **Decisão 31 — A, lista lateral de ondas:** navegação rápida entre ondas 0–11 em uma lista lateral, utilizando o JSON único de campanha.
- **Decisão 32 — C, relatório antes de retornar:** ao concluir ou encerrar o teste jogável, apresentar um relatório de resultados e, em seguida, voltar ao Wave Maker preservando onda, rascunho, seleção e contexto de edição. Métricas exatas ainda dependem de instrumentação.
- **Decisão 33 — C, importar ou substituir:** ao importar JSON, oferecer criar um novo projeto ou substituir o projeto selecionado, com confirmação explícita ao substituir. Importar nunca publica automaticamente na campanha.
- **Decisão 34 — A, primeira entrega funcional:** implementar primeiro editor de eventos básicos com criar, mover, duplicar e excluir grupos; editar tempos e posições; salvar rascunho. Não exigir simulação, relatório ou publicação nessa primeira entrega.
- **Especificação técnica consolidada:** ver `docs/GDD-WAVE-MAKER.md`. Ainda depende de revisão/aprovação final; nenhuma implementação autorizada nesta etapa.

### Wave Maker — Etapa 1 entregue para teste, v0.54 (19/10/2026)
- Registrada como **implementada inicialmente**: `WaveMakerScene` integrada ao Laboratório; lista de ondas 0–11, importação de eventos efetivos em rascunhos independentes, mapas e blocos temporais arrastáveis, edição numérica via diálogo, criação/duplicação/exclusão de grupos e salvamento local.
- Os eventos existentes e campos extras ficam preservados no modelo. Ainda não se edita o comportamento da campanha nem se executam rascunhos em combate.
- Limitações e pendências de interface/recursos planejados em `docs/versao-0.54.md`. Testes automatizados e playtest local pendentes.

### Artes dos cinco líderes — decisões A1–A5 aprovadas (19/10/2026; planejamento)
- **A1 — A, formato:** retratos em **busto / meio corpo** para os representantes de Brasil, Estados Unidos, Rússia, China e Coreia do Sul.
- **A2 — A, estilo:** **pixel art detalhada**, coerente com a direção de arte do Game Soberana.
- **A3 — A, tom:** **semi-realista com exagero leve**; silhuetas e expressões distinguíveis sem caricatura excessiva.
- **A4 — A, fundo:** cenário **simples com cores e símbolos do país**, padronizado para os cinco.
- **A5 — B, animação:** **retratos totalmente estáticos**. Comentário aprovado: haverá **vários retratos de cada personagem representando momentos diferentes**, mas **por enquanto produzir somente os retratos-base**; variantes de expressão/situação ficam para planejamento e produção posteriores.
- **Processo de arte:** desenvolver um conceito consistente para cada personagem, com enquadramento, escala e linguagem de pixel art comuns; não gerar spritesheets ou implementar retratos no jogo sem autorização posterior.

### Artes dos cinco líderes — designs de referência mantidos (19/10/2026; planejamento)
- Usuário confirmou **manter como estão** os cinco conceitos da imagem de referência enviada, sem nova rodada de mudanças de personalidade/visual: **Zeca Carrara (Brasil)** — bigode, sorriso, camisa florida, bebida, Rio; **Victor McDollar (EUA)** — boné vermelho, óculos escuros, terno, pose de político-showman e símbolos americanos; **Kim Lin Doo (Coreia do Sul)** — jovem de estética pop/militar, finger heart, Seul neon; **Tatiana Tanquova (Rússia)** — ushanka, tranças, casaco de inverno, caneca e Moscou; **Mei Taxaram (China)** — traje chinês vermelho, arranjo floral, pacote comercial e porto/logística.
- Preservar os **nomes, aparências, paletas, acessórios, gestos e ambientações** vistos na referência. Não reabrir decisões conceituais A6–A10; tratá-las como substituídas pela aprovação direta da referência.
- Mantêm-se as decisões A1–A5: bustos de meio corpo em pixel art detalhada semi-realista, fundos nacionais, retratos-base **estáticos**; outras expressões/situações futuramente. Próximo planejamento: dimensões, enquadramento, recorte, transparência, organização de assets e exportação.
- Somente planejamento: não gerar nem implementar artes até solicitação posterior.

### Artes dos cinco líderes — v0.55 (19/10/2026)
- Aprovadas as decisões **A11 B** (384×384), **A12 A** (cabeça e ombros, rosto em evidência), **A13 C** (versão retrato completo + personagem isolado), **A14 A** (alta fidelidade à referência aprovada), **A15 A** (começar pelo Zeca Carrara).
- **Zeca Carrara:** usuário aprovou trocar camisa floral multicolorida por **camisa floral retrô em tons marrons/bege com flores claras**, mantendo bigode, cabelo, blazer claro, colar, copo de cerveja e gesto positivo. Versões com Rio de Janeiro e personagem isolado geradas.
- Produzidos também os retratos-base de **Victor McDollar** (EUA), **Kim Lin Doo** (Coreia do Sul), **Tatiana Tanquova** (Rússia) e **Mei Taxaram** (China), cada qual nas versões com cenário e recorte transparente. Futuros retratos de expressões diversas permanecem planejados.
- Integração inicial dos retratos ao **boteco / UpgradeScene**, sem alterar escolhas ou upgrades. **PNG binários fornecidos via ZIP da conversa, ainda não commitados no GitHub**; a interface depende da extração para `public/assets/lideres/`. Referência: `docs/versao-0.55.md`.

### Boteco — decisões B1–B10 aprovadas (19/10/2026; somente planejamento)
- **B1 A — após cada onda:** o jogador visita o boteco a cada vitória.
- **B2 C — cinco líderes com estados:** exibir todos, indicando claramente disponível, indisponível ou já escolhido.
- **B3 A — clique direto no retrato:** abre a proposta do líder. **Comentário do usuário:** antes de liberar os cliques, apresentar **comentários curtos sobre o que acabou de acontecer** na onda recém-encerrada, e só então permitir clicar num retrato.
- **B4 B — pequenas conversas:** cada proposta é precedida por diálogo breve de duas ou três falas.
- **B5 A — expressões por situação:** futuras variantes estáticas de retratos (neutro, feliz, irritado, assustado etc.) escolhidas segundo o contexto; apenas retratos-base estão em produção agora.
- **B6 A — foco e painel lateral:** manter ampliação do líder selecionado e painel lateral de informações.
- **B7 C — indicadores + demonstração:** comparar estatísticas antes/depois do upgrade e, quando viável, apresentar pequena prévia visual.
- **B8 B — alternar humor e seriedade:** leveza nos encontros comuns, maior peso dramático nos momentos importantes.
- **B9 B — reação breve do líder:** após confirmação, uma fala e um efeito visual discretos antes da continuação.
- **B10 B — Zeca participativo:** o protagonista comenta propostas e responde aos demais líderes.
- **Estado:** decisões de design aprovadas e documentadas; **não implementar** nesta rodada. Preservar o fluxo jogável até uma etapa de implementação expressamente autorizada.

### Upgrades, builds e progressão — decisões C1–C10 aprovadas (19/10/2026; somente planejamento)
- **C1 A — uma proposta por líder:** cada país oferece uma melhoria específica a cada visita ao boteco.
- **C2 A — sequência fixa:** ofertas de cada país seguem ordem predeterminada, respeitando a progressão já estabelecida.
- **C3 A — novos aliados disponíveis normalmente:** o jogador pode começar a investir em outro país em qualquer visita, sujeito aos limites já aprovados.
- **C4 B — efeito e caminho de evolução:** ao inspecionar a proposta, mostrar benefício imediato e prévia dos próximos níveis do país.
- **C5 A — sinergias emergentes:** interações entre países decorrem dos efeitos reais dos upgrades; não introduzir bônus exclusivos de combinação.
- **C6 A — limites preservados:** manter regras de progressão, composição e limite de torres já aprovadas.
- **C7 C — números e barras:** comparação antes/depois apresenta valores concretos e indicadores visuais das mudanças.
- **C8 A — demonstração animada:** a proposta apresenta pequena demonstração automática do funcionamento do upgrade; não exige minijogo de teste interativo.
- **C9 A — escolhas permanentes:** não desfazer alianças e melhorias dentro da campanha.
- **C10 C — revelação narrativa:** o líder apresenta a forma definitiva de seu país quando ela se torna acessível.
- **Status:** somente decisões registradas. Não implementar, modificar código, balanceamento ou versão até aprovação posterior.

### Inimigos e dificuldade — decisões D1–D10 aprovadas (19/10/2026; somente planejamento)
- **D1 C com ressalva prioritária:** progressão futura de ataques espaçados para padrões mais densos, **mas por enquanto apenas reduzir a quantidade de tiros inimigos, sem adicionar mecânicas**. A ressalva prevalece sobre qualquer leitura da opção C que implique introdução imediata de novos padrões.
- **D2 A:** projéteis inimigos comuns são destruídos por **um único acerto** de disparo do jogador.
- **D3 B:** interceptação gera **explosão colorida conforme o tipo/categoria de tiro**; compatibilizar com D7, que mantém cor uniforme dos projéteis em voo.
- **D4 B:** aumentar dificuldade sobretudo pela **coordenação de tipos de inimigo e padrões já existentes**, sem simplesmente multiplicar a quantidade de inimigos.
- **D5 A:** inserir **pausas de recuperação planejadas**, permitindo eliminar sobreviventes e reorganizar a defesa.
- **D6 B, restrição expressa:** ataques importantes recebem **mensagens curtas exclusivamente na barra de notícias inferior da Cubo News**; **não adicionar marcadores, avisos ou componentes extras à interface**.
- **D7 C com ajuste:** identificar as ameaças pela **silhueta/forma** e por pistas acessíveis; **os projéteis podem permanecer sempre com a mesma cor**. Explosões de interceptação ainda podem variar de cor (D3). **Bombas do Tipo 6 devem mostrar claramente quando recebem dano**, sem poluir a HUD.
- **D8 A com progressão:** aplicar **limite rígido de projéteis inimigos simultaneamente ativos**; inimigos aguardam oportunidade de disparar quando o limite é atingido; **limites podem crescer gradualmente ao longo das ondas**. Definir números no balanceamento posterior. Não interpretar essa regra como autorização para adicionar novas mecânicas agora.
- **D9 A:** manter **fim da onda por tempo**, inclusive quando restarem inimigos, conforme regras existentes.
- **D10 A:** critério de avaliação prioritário: todas as ondas regulares devem ser testáveis/viáveis usando **build brasileira básica**, sem depender de investimento em aliados.
- **Status:** decisões documentadas exclusivamente; não implementar nem alterar o código, a versão ou o balanceamento neste momento.

### Chefões Tipo 6 e traição — decisões E1–E10 aprovadas (19/10/2026; somente planejamento)
- **E1 A — revelação por diálogo e transmissão:** primeiro um **diálogo com o país traidor**, que revela explicitamente suas intenções; **depois cortar para uma transmissão da Cubo News** noticiando o ataque ao Rio de Janeiro, antes do confronto.
- **E2 A — arquitetura comum, variação nacional:** os chefões Tipo 6 usam **a mesma estrutura e silhueta básica**, mas diferem visualmente (cores, módulos, aparência) e em **alguns ataques exclusivos**. Não reprojetar quatro estruturas independentes.
- **E3 A — entrada lenta ameaçadora:** nave ocupa o alto da tela antes de começar a atacar.
- **E4 A — núcleo central e módulos laterais:** módulos destrutíveis e núcleo determinante da derrota do chefe. **Regra previamente aprovada; não tratar como novidade.**
- **E5 A — módulo destruído desativa arma correspondente:** **regra já definida e implementada**, conforme comentário explícito do usuário; preservar comportamento existente.
- **E6 A — telegráficos na própria nave:** armamentos brilham, se abrem ou acumulam energia; sem HUD extra.
- **E7 A — feedback nas bombas:** ao receber dano, bomba **pisca em branco e treme**, além de **quatro estágios visuais de destruição** até explodir. Evitar indicadores intrusivos.
- **E8 A — sucção progressiva na superarma:** nos segundos finais, animação de **sucção de energia e projéteis ao núcleo**, reaproveitando a decisão prévia de absorver tiros existentes quando restarem 5 s. Núcleo concentra energia antes do disparo.
- **E9 A — explosão em cadeia:** destruição do núcleo deflagra colapso em módulos e uma **explosão final deliberadamente exagerada**, sem queda da nave como etapa obrigatória.
- **E10 A — desafio equivalente:** chefões traidores precisam oferecer chances de vitória semelhantes, apesar da identidade de ataques de cada país.
- **Status:** somente planejamento destas decisões; nenhuma implementação, modificação de gameplay ou versionamento nesta rodada. As decisões E4 e E5 reafirmam regras já existentes.

### Ataques dos quatro traidores — decisões F1–F10 aprovadas (19/10/2026; planejamento)
- **F1 A, EUA:** poder de fogo concentrado, rajadas frontais fortes. **Já definido e implementado**, conforme confirmação do usuário; preservar.
- **F2 B, Coreia do Sul:** ataques coreografados, rajadas rítmicas e efeitos sincronizados. **Já definido e implementado**; preservar.
- **F3 A, Rússia:** artilharia pesada, bombas grandes e lentas de alto dano. **Já definido e implementado**; preservar.
- **F4 B, China:** precisão e coordenação entre módulos. **Já definido e implementado**; preservar.
- **F5 B:** planejar **dois ataques exclusivos por traidor** no repertório do Tipo 6; ao desenvolver, conferir o que já existe para não duplicar sistemas ou golpes.
- **F6 C:** progressão por fases: um ataque exclusivo desde o começo, outro liberado ao avançar a batalha. Respeitar fases existentes.
- **F7 A:** cada ataque exclusivo se vincula a um módulo destrutível; destruí-lo desativa o ataque correspondente. **Lasers finais nacionais:** EUA **azul-claro**, Coreia do Sul **roxo**, China **vermelho**, Rússia **amarelo**. O laser final pertence à sequência de superarma/núcleo; a relação com módulos deve preservar as regras da superarma já aprovadas, sem assumir que destruir módulo cancela o disparo central.
- **F8 A:** projéteis exclusivos distinguíveis sobretudo pela **silhueta**, mantendo paleta inimiga coerente. Exceção explícita: cores específicas dos lasers finais F7.
- **F9 A:** enquanto o núcleo carrega a superarma, os módulos **param de atacar**; combate se concentra no núcleo e na animação de sucção progressiva.
- **F10 A:** o jogador aprende os ataques durante a luta por meio de animações das próprias armas. Não incluir HUD/alertas adicionais.
- **Status:** somente documentação desta rodada; não implementar, modificar balanceamento, código ou versão. F1–F4 são reafirmações de comportamentos já presentes no jogo.

### UX e feedback visual — decisões G1–G10 aprovadas (19/10/2026; somente planejamento)
- **G1 A — HUD mínimo:** exibir somente informações essenciais, mantendo a área do combate desobstruída e evitando banners.
- **G2 C — impacto no canhão:** clarão local, pequeno tremor de tela e som breve ao receber dano.
- **G3 C — acertos por classe:** inimigos comuns exibem clarões discretos, inimigos pesados têm resposta visual mais forte.
- **G4 A — dano progressivo:** rachaduras, faíscas e degradação visual em alvos resistentes, sem depender de barras extras.
- **G5 C — Supremo pronto:** ícone compacto junto ao canhão e brilho do próprio canhão. **Comentário vinculante:** quando o Supremo ficar disponível, o **representante do país associado ao Supremo aparece e faz um comentário rápido antes de o jogador ter que digitar** para acioná-lo. Planejar apresentação curta sem poluir a HUD nem alterar a regra de acionamento já existente; o instante exato da fala e da digitação deve ser especificado antes de implementar.
- **G6 A — prioridade das notícias:** alertas críticos substituem mensagens de menor importância na barra inferior da Cubo News (canal narrativo único).
- **G7 B — adaptação de telas:** reposicionar elementos conforme a tela, sem mudar a lógica do combate.
- **G8 B — explosões por importância:** impactos comuns discretos; grandes explosões reservadas a acontecimentos decisivos.
- **G9 C — módulo Tipo 6 destruído:** explosão localizada, efeitos elétricos e módulo permanentemente apagado/inativo.
- **G10 C — acessibilidade:** opções independentes para reduzir/desligar tremores de tela e reduzir flashes/partículas.
- **Status:** somente GDD atualizado; nada implementado nem alterado em código, assets ou versão nesta rodada.

### História e finais — decisões H1–H10 aprovadas (19/10/2026; somente planejamento)
- **H1 B — dia comum vira caos:** Zeca está resolvendo problemas cotidianos quando a invasão começa. **Não revelar por que os alienígenas atacam à noite até as noites finais**; sustentar mistério.
- **H2 A — defesa insuficiente com acontecimento roteirizado:** o canhão brasileiro **vence a primeira onda**, mas **pouco antes de amanhecer** surge um inimigo de nível superior que **destrói o canhão** em sequência narrativa. **Depois aparecem os cinco conselheiros/líderes oferecendo ajuda** ao protagonista. Tratar essa destruição como evento da história, não derrota arbitrária do jogador; detalhar transição e coerência com encerramento por tempo antes de implementar.
- **H3 A — Zeca improvisador carismático:** enfrenta problemas com criatividade, humor e gambiarra.
- **H4 B — relação crescente e falsidade:** quanto mais propostas o Brasil aceita de um líder, **mais sorridente e aparentemente bem-intencionado ele fica**; suas falas deixam escapar gradativamente intenções suspeitas, sem denunciar antecipadamente o traidor sorteado.
- **H5 B — presságios ambíguos:** comentários diplomáticos suspeitos, sem identificar claramente o traidor.
- **H6 B — proposta real de submissão:** antes da luta contra o país traidor, ele oferece a rendição. O jogador pode **aceitar**, o que leva **imediatamente ao final de colonização daquele país**, sem combate; recusar inicia o confronto. **Na onda da traição, substituir o rótulo do relógio “Tempo até amanhecer” por “Tempo até o Brasil virar colônia”.** Não alterar a barra de notícias inferior nem adicionar HUD extra.
- **H7 A — finais ilustrados curtos:** alguns quadros estáticos com narração e falas, preservando 10 desfechos já aprovados.
- **H8 C — humor amargo nas derrotas:** início satírico e desfecho de consequências políticas mais duras.
- **H9 A — vitória contra traidor como festa:** festa popular da soberania, com música e humor brasileiro (sem necessidade de epílogo diplomático).
- **H10 A — Full Brazil: vitória pela gambiarra:** tecnologia improvisada, criatividade nacional; **Brasil passa a ser reconhecido como potência mundial de referência, com as melhores tecnologia e cultura**. Derrota na rota Full Brazil permanece como final distinto já previsto.
- **Status:** decisões documentadas **sem implementação**; verificar compatibilidade da primeira onda, destruição roteirizada, nova opção de rendição e rótulo do relógio antes de programar.

### Personagens e diálogos — decisões I1–I10 aprovadas (19/10/2026; somente planejamento)
- **I1 B:** **Zeca Carrara é operador experiente do canhão**, militar ou técnico; assume o comando da defesa. Seu carisma improvisador (H3) continua valendo.
- **I2 A:** após a destruição roteirizada do canhão, os **cinco conselheiros chegam juntos ao boteco** e oferecem ajuda numa conversa que apresenta suas personalidades.
- **I3 C:** humor de Zeca mistura ironia sobre cotidiano e burocracia com absurdos ocasionais.
- **I4 C:** Victor McDollar (EUA) é empresário diplomático, mistura charme e marketing a ameaças econômicas discretas.
- **I5 C:** Kim Lin Doo (Coreia do Sul) mantém imagem pública de ídolo cuidadosamente construída, sorriso ensaiado e ambições ocultas.
- **I6 A e correção nominal:** a representante russa chama-se **Kátia Strófika** (**substitui Tatiana Tanquova** em textos, identificações e futuras artes); humor seco, comentários curtos, ironia severa e confiança militar. O conceito visual já aprovado permanece salvo até revisão expressa.
- **I7 C e correção nominal:** a representante chinesa chama-se **Ming Da** (**substitui Mei Taxaram** em textos, identificações e futuras artes); gentileza estratégica e condições veladas. Preservar conceito visual aprovado.
- **I8 C:** depois de cada onda, Zeca faz comentário breve sobre o combate e **um dos conselheiros responde** antes da escolha.
- **I9 A:** diálogos de visual novel avançam **por clique ou toque**, no ritmo escolhido pelo jogador.
- **I10 C:** suspeitas são comunicadas com falas ambíguas e futuras variações de retrato/expressão situacional, sem entregar antecipadamente o traidor sorteado.
- **Status e consistência:** somente planejamento. **Nenhum código ou asset alterado nesta rodada**; arquivos e falas existentes que contenham os nomes antigos serão atualizados numa etapa de implementação autorizada. Todas as regras anteriores compatíveis permanecem válidas.

### Mistério alienígena, traição e finais — decisões J1–J10 aprovadas (19/10/2026; planejamento)
- **J1 C:** os ataques exclusivamente noturnos decorrem de estratégia/objetivo oculto mais surpreendente; motivo definitivo ainda será definido.
- **J2 B:** o chefão alienígena revela suas intenções por meio de comunicação durante o confronto final. **Conciliar com J10:** a revelação substancial do motivo ocorre **antes da onda 10**, durante a sequência narrativa que antecede esse confronto; o chefão pode ser a fonte ou confirmar a revelação por comunicação prévia. Não postergar a informação para depois da batalha.
- **J3 A:** traição dos países e invasão alienígena são **conflitos independentes**. Traidor se aproveita da crise, sem pacto ou manipulação alienígena.
- **J4 C:** cada país traidor tem motivação própria ligada à personalidade e aos seus interesses.
- **J5 B:** cena de discussão: traidor justifica sua ação, Zeca contesta, seguindo-se a oferta de rendição já aprovada.
- **J6 C:** se o jogador aceitar o ultimato, a **Cubo News anuncia a submissão** antes do respectivo final de colonização. Nenhuma batalha contra o traidor nessa ramificação.
- **J7 C:** quatro finais de colonização compartilham estrutura inicial, mas incluem consequências e piadas específicas de cada país.
- **J8 A:** vitória contra o traidor é celebrada **no boteco**, centro da história; não exigir festa nas ruas.
- **J9 A:** líder traidor derrotado recebe **humilhação cômica** após sua derrota; detalhar contexto e tom em roteirização futura.
- **J10 C com comentário:** o verdadeiro motivo da invasão é esclarecido **antes da onda 10**; a vitória Full Brazil confirma/fecha a revelação. **Derrotar o chefão com o Supremo brasileiro pode render tratamento especial ainda a especificar**, sem mudar agora a regra de Supremo, a vitória ou as dez terminações aprovadas. O usuário considera especialmente interessante vencer dessa forma; definir mais tarde como reconhecer essa condição sem criar um 11º final obrigatório.
- **Status:** planejamento apenas; nenhum código, asset, balanceamento ou versão alterado.

### O segredo alienígena — decisões K1–K10 aprovadas com correções autorais (19/10/2026; planejamento)
**Comentários do usuário prevalecem integralmente sobre alternativas A/B/C contraditórias.**
- **K1 — motivo real (substitui opção B):** alienígenas interpretam o Cristo Redentor, tratado por eles como **“Nosso Imperador da Terra”**, com os braços abertos como uma afronta extremamente desrespeitosa e declaração de guerra. **Não** existe profecia de futuro brasileiro ameaçador.
- **K2 — por que apenas à noite (substitui opção C):** invasores **adoraram a praia do Rio** e reservam os dias para aproveitar a praia; por isso atacam à noite. **Não** escavam, não buscam recursos subterrâneos e não existe restrição solar tecnológica estabelecida.
- **K3 — objetivo real (substitui opção B):** querem obrigar o “Imperador da Terra” (Cristo) a **se submeter e fechar os braços**, pois, na cultura alienígena, **abrir os braços é declarar guerra**. Não pretendem especificamente impedir a capacidade brasileira de resistência como objetivo central.
- **K4 B com comentário:** o Tipo 6 alienígena é a **nave-mãe/inteligência central** coordenadora. Os extraterrestres humanoides devem **andar sempre de braços cruzados**, em coerência com seu código cultural. Definir futuramente como aparecem em cenas, sem exigir novo tipo de inimigo jogável.
- **K5 — comunicação (substitui opção B):** **nenhuma comunicação alienígena inteligível até a onda 10**. Então alienígenas transmitem mensagem e **linguistas brasileiros decodificam seu idioma**, revelando o equívoco sobre o Cristo. Conciliação temporal: a decodificação e revelação acontecem **antes de começar a batalha da onda 10**, conforme J10; a transmissão pode integrar o prólogo dessa onda.
- **K6 A:** desde cedo, **notícia estranha na Cubo News** aponta anomalias aparentemente irrelevantes, sem antecipar o segredo de forma explícita.
- **K7 A:** pistas sutis **desde a primeira noite**.
- **K8 C:** revelação começa com tom ameaçador e sério, terminando na interpretação cultural **absurda** da posição dos braços do Cristo e das férias na praia.
- **K9 C:** vitória com Supremo brasileiro **não muda o final narrativo nem cria final extra**; pode manter espetáculo visual próprio da habilidade, sem tratamento narrativo especial obrigatório. Esta decisão substitui a possibilidade narrativa especial antes aventada em J10.
- **K10 B com epílogo:** vitória dá ao Brasil **prestígio internacional tecnológico e cultural**. Outros países **pedem ajuda brasileira**, porque os alienígenas estão atacando **todas as cidades do mundo com estátuas de braços abertos**. Construir cena/epílogo que explicite a extensão global do mal-entendido.
- **Estado:** decisões de roteiro somente no GDD; sem implementação, nova cena, efeito, arte ou alteração de versão nesta rodada.
