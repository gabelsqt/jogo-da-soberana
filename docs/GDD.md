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
