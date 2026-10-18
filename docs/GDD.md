# Game Soberana — GDD (decisões de identidade e Supremos)

> Atualizado em 17/10/2026. Documento de design; **não representa implementação concluída**. Esta seção registra decisões aprovadas em conversa. A tabela de upgrades atual está em `src/gameplay/v1Upgrades.js`; mecânicas em código podem ainda divergir.

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

- **Tiro normal — Vórtice Siberiano:** projéteis congelam inimigos; inimigos próximos são **atraídos para o ponto congelado**. A progressão amplia congelamento e atração.
- **Especial — Matryoshka de Estilhaços:** detona os inimigos congelados atingidos e espalha **estilhaços de gelo** que danificam outros; não permitir replicação infinita de fragmentos. Escudo associado a efeitos criogênicos.
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

**Especial — Bola de Discoteca Orbital:** intercepta automaticamente parte dos tiros e gera um número fixo de **raios refletidos por ativação**, não por projétil; jogador não precisa mirar na bola. Progressão aprovada: **nível 2 = 3 reflexos**, **nível 4 = 6**, **nível 6 = 12**, **nível 8 = 24**. O nível 4 corrige a menção casual ao nível 5, preservando níveis pares de especial. Raios distribuem-se entre inimigos, preservam efeitos compatíveis, sem multiplicação ilimitada. Nomes propostos: nível 2 **Espelho, Espelho Meu**; 4 **Pista de Dança**; 6 **Febre de Sábado à Noite**; 8 **Discoteca Intergaláctica**.

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
| **Coreia do Sul** | Discoteca: **3/6/12/24 reflexos por ativação**, não por bala disparada; raios atingem alvos distintos quando possível e não se replicam. | Placas de espelho que refletem parte dos disparos alienígenas e consomem o HP normal do escudo, com chance provisória crescente. |

**Controles técnicos:** `src/gameplay/v1Specials.js` mantém progressão e identidade; `src/scenes/GameScene.js` processa efeitos, escudos e placeholders; `src/gameplay/v1Upgrades.js` contém nomes e descrições atualizados. Testes adicionados em `tests/v1Specials.test.js`.

**Estado de validação:** sintaxe dos módulos verificada, progressões por níveis checadas e resolução combinada executada em simulação com substitutos leves de Phaser (incluindo cadeia de Matryoshka). Ainda faltam `npm test`, `npm run build`, desempenho e interação de navegador, arte definitiva, sons e balanceamento. Os valores de dano, raio, reflexão e empurrão são provisórios.
