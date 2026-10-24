## Revisão 0.923 — Panda Express: especial chinês (primeiro protótipo jogável)

- Substitui o antigo modo experimental de concentração da China quando o especial principal é chinês: drone com corpo vermelho, rosto de panda e dois braços magnéticos.
- Um único drone por vez; pressionar ESP novamente reposiciona o drone em 500 ms com aceleração/desaceleração suaves; ele carrega a munição consigo e continua capturando no voo.
- Raio de captura S1–S4: **100/130/160/200 px**; capacidade: **8/14/22/32 projéteis**. Os projéteis físicos são removidos temporariamente da lista ativa e orbitam individualmente o drone, preservando as instâncias e suas propriedades (dano, divisão e aparência).
- Ao completar a capacidade, o drone espera alvos válidos, então dispara automaticamente, um tiro a cada **75/60/45/30 ms**, em direção aos inimigos mais próximos do canhão. Para de capturar durante a descarga; projéteis dirigidos buscam novo alvo quando o alvo anterior deixa de existir.
- Após a descarga, drone desaparece. Na conclusão normal da onda, drone e munição restante são removidos com efeito de fogos coloridos.
- A cena limpa o drone no shutdown. O protótipo utiliza Phaser Graphics; os sprites definitivos do panda ainda não foram gerados.
- **Pendente:** teste real de build e balanceamento da captura/descarga, inclusão de feedback de espera sem inimigos, refinamento visual da espiral e dos fogos e verificação nas variantes de campanha/laboratório.

## Revisão 0.922 — impactos Tipo 2 e sincronia da reconstrução

- Tipo 2: ao completar mergulho ou investida tática, apresenta anel de explosão, faíscas e SFX antes de desaparecer; a chamada preexistente a `damageTarget` permanece em ambos os caminhos.
- Regeneração do escudo: o arco externo avança durante todos os **6 segundos**, enquanto a malha preenche progressivamente. A piscada branca e a restauração do HP ocorrem assim que o desenho se completa, sem intervalo extra.
- Pendente validação manual com inimigos Tipo 2 e com escudo rompido.

## Revisão 0.921 — reconstrução do escudo e efeitos nacionais

- Escudo do canhão: quando chega a zero HP, inicia recomposição visual progressiva da cúpula ao longo de **6000 ms**. Durante a montagem, permanece sem HP funcional; ao fim, retorna à capacidade total e executa o clarão branco e o SFX de ativação usados no início da onda.
- Laser principal coreano: caminhos de ricochete redesenhados com **curva quadrática amostrada em 18 trechos** e três camadas (halo difuso, luz colorida e núcleo branco). P4 alterna rosa/ciano/violeta.
- Congelamento russo: flocos de neve hexagonais com seis braços, ramificações e núcleo cristalino ao redor do alvo; os ramos se tornam mais detalhados conforme os estágios do tiro russo. Sem mudança no congelamento mecânico.
- Validar visualmente em celular/desktop, sobretudo a animação de retorno do escudo após destruição e o custo do frost quando há muitos inimigos congelados.

## Revisão 0.920 — Correntes e cópias dos lasers coreanos

- Principal da Coreia: laser físico ~22% mais lento e mais grosso, com comprimento/largura crescentes em P1–P4.
- Ricochetes P1–P4: **2 / 4 / 6 / 9** saltos; raio de busca ampliado para **190 px**. Retenção de dano de 85% por salto permanece.
- Ramificação por corrente original P1–P4: **0 / 1 / 2 / 3 cópias** no máximo. Uma cópia segue para alvo alternativo vivo, herda os alvos já atingidos, os saltos restantes e o estágio visual; causa 55% do dano reduzido do próximo salto. Cópias não se multiplicam novamente (controle de crescimento).
- Guarda de desempenho: impedir novas ramificações quando há pelo menos 95 projéteis ativos. O especial da discoteca mantém seu próprio orçamento de reflexos e não passa a criar ramificações infinitas.
- Revisar em execução balanceamento e efeitos visuais, inclusive no celular.

## Revisão 0.918 — Discoteca K-pop (implementação visual)

- Bola de Discoteca Orbital redesenhada em Phaser Graphics: esfera espelhada com facetas escalonadas, brilho cintilante e rotação de cores ciano/rosa/violeta/dourado.
- Anéis de palco em perspectiva, quatro holofotes móveis, halo pulsante de 250 px e contorno luminoso. Atualização reutiliza o Graphics existente, sem criar sprites/tweens por frame.
- Reflexos múltiplos e ricochetes permanecem inalterados; o estágio final continua multicolorido.
- Pendente validação visual/performance em desktop e celular.

## Revisão 0.917 — Progressão do laser coreano

- Estágios P1–P4 do principal coreano: aumento moderado de cadência de **0%/+6%/+12%/+18%** e de dano de **0%/+8%/+16%/+25%**, mantendo 1/2/4/7 saltos e retenção de 85% por salto.
- Em P4, projétil principal recebe rastro holográfico multicolorido animado; o último estágio dos reflexos da discoteca também alterna cores nas curvas prismáticas.
- Geometria do globo preservada para decisão estética posterior. Validação visual pendente.

## Revisão 0.916 — amanhecer com troca de cenários na onda 0.5

- O prólogo de sobrevivência (onda 0.5) passa a carregar as mesmas quatro imagens `01_pre_amanhecer.png`, `02_noite_azul.png`, `03_nascer_sol.png`, `04_dia_claro.png` usadas no restante das ondas.
- Ao iniciar a retirada dos invasores, a transição entre os quatro cenários ocorre em sequência durante `PROLOGUE_WITHDRAWAL_MS`; o overlay laranja fica mais discreto e não substitui a mudança real do fundo.
- A retirada alienígena continua sincronizada ao amanhecer. Teste visual em jogo pendente.

## Revisão 0.915 — mira exclusiva pelo analógico e Grande Muro ampliado

- No celular, tocar no cenário deixa de selecionar posição do especial. A direção é determinada exclusivamente pelo analógico virtual; ESP no primeiro toque arma e no segundo lança. Mouse no desktop permanece inalterado.
- Grande Muro americano S1–S4: raios alterados de 85/110/140/175 para **110/145/185/230 px**, preservando abertura de 120°, recarga e duração.
- Validar manualmente a ergonomia do analógico e o posicionamento de muros grandes nas bordas da tela.

## Revisão 0.914 — Grande Muro e especial touch

- Grande Muro americano: raios S1–S4 ampliados de **60/79/101/125 px** para **85/110/140/175 px**, mantendo 120° de abertura e a mesma duração e recarga.
- Mobile: o primeiro toque em ESP apenas prepara a habilidade; proteção de 180 ms impede que o mesmo evento/tap a dispare automaticamente. Toques sobre controles móveis também não contam como escolha de ponto no cenário. Segundo toque em ESP ou toque deliberado no cenário confirma o posicionamento.
- Validar em celular o tamanho do arco, bordas da tela e seleção de ponto usando multitouch.

## Revisão 0.913 — Discoteca multiplicadora restaurada

- Tiro principal da Coreia permanece um laser por disparo, com progressão de 1/2/4/7 saltos e retenção de 85% do dano a cada salto.
- Ao tocar a Bola de Discoteca, o laser é consumido e gera **3/6/12/24 reflexos máximos** conforme S1–S4, limitados a inimigos vivos e distintos dentro do raio de 250 px.
- Cada reflexo pode continuar ricocheteando pelo raio normal de 150 px, herdando a quantidade restante de saltos; cada ramo não repete o mesmo alvo.
- O orçamento de dano `krSalvoDamage` é dividido pelo número de reflexos criados. Saltos adicionais decaem multiplicativamente 15%.
- A representação visual reutiliza os arcos prismáticos animados da discoteca antiga; o total de traçados simultâneos é limitado para preservar performance móvel. Impactos e efeitos visuais são processados separadamente.
- Pendente teste de execução em dispositivos e ajuste fino das curvas/rastros por estágio.

## Revisão 0.912 — pausa em combate e Boteco

- Menu de pausa unificado em GameScene e UpgradeScene (Boteco), aberto por ícone touch ou teclas P/Esc.
- Opções: continuar, reiniciar onda (ou rejogar última onda no Boteco), menu principal, controles musicais e orientação dos comandos; preservar proibição de reinício na onda 11.
- No celular, a edição do posicionamento dos controles agora é iniciada pelo menu de pausa: **Mover controles** retoma com arraste habilitado; abrir pausa novamente oferece **Salvar posição dos controles**.
- Remover botão MOVER permanente da tela de batalha. Persistência do layout local no navegador preservada.

## Revisão 0.911 — especial touch e layout móvel personalizável

- **Especial touch com duas formas de ativação:** primeiro toque no botão ESP prepara a habilidade e marca o botão como ALVO. Em seguida, tocar num ponto do cenário dispara o especial naquela posição, ou tocar ESP novamente dispara na direção atual do analógico. A pontaria segue as regras de cada especial no código (inclusive limitações de distância/posicionamento).
- **Controles reposicionáveis:** botão MOVER abre modo de edição; arrastar analógico, TIRO, ESP e pausa altera suas posições, e SALVAR encerra a edição. Coordenadas persistidas localmente no navegador por `localStorage`, com posições-padrão quando indisponível.
- Durante a edição, os botões não ativam habilidades; o tiro em modo segurar continua sem disparo automático fora da área de toque.
- A testar em aparelho: multitouch, sobreposição de controles, dimensão variável da tela e interação do toque no cenário com outros elementos interativos.

## Revisão 0.910 — pausa touch

- Botão translúcido de pausa (Ⅱ) no canto superior direito da área lógica 960 × 540, posição (916, 40), independente do analógico e de TIRO/ESP.
- Aciona a PauseScene existente; interrompe o disparo ao pausar. Não altera o comando de pausa por teclado no desktop.

## Revisão 0.909 — controles touch e onda 0.5

- Analógico touch movido de (100, 435) para (160, 420) na tela lógica 960 × 540, oferecendo mais margem à esquerda.
- Botão TIRO agora é **pressionar e segurar**: começa ao encostar e termina ao levantar o dedo ou sair da janela. Não é mais alternância ON/OFF.
- Onda 0.5: invasores mantêm a proporção nativa e avançam em leque espaçado (12 colunas e 5 fileiras) para não se sobreporem de modo que pareçam deformados. Quando a luz do amanhecer começa, cada invasor recua de sua posição atual em direção aos portais enquanto o céu clareia progressivamente.

## Revisão 0.908 — Coreia ricocheteante e controles móveis

- Coreia: tiro principal passa a ser **um projétil laser por disparo**, com corrente de ricochetes para o inimigo mais próximo até 150 px; mesmo alvo não pode repetir na corrente. Estágios P1–P4: 1/2/4/7 saltos, cada salto retém 85% do dano do anterior.
- Discoteca: raio de seleção visual de 250 px; o laser pode ser redirecionado para inimigo dentro do halo, sem perder saltos ou sofrer redução extra de dano. A trajetória desviada deixa arco luminoso temporário. Não há alcance global.
- Touch: controle analógico transparente à esquerda para apontar o canhão; à direita, botão TIRO ON/OFF (alternância) e ESP (acionamento). Desktop permanece com mouse.
- Validação pendente em aparelho: tamanho dos botões, multitouch, interações com cenas de laboratório, renderização de rastros curvos e comportamento do laser diante de múltiplos globos.

## Revisão 0.907 — terminologia, amanhecer e upgrades (23/10/2026)

- O armamento fixo do protagonista é denominado **canhão**, não obuseiro, em falas, interface e documentação. Não alterar nomes internos de variáveis/arquivos que sejam identificadores técnicos.
- **Onda 0.5:** 60 invasores avançam até muito perto do canhão (sem colisão); o canhão avariado ainda dispara lentamente, com dano **zero** e tiros que somem ao encostar nos inimigos. Aos 15 segundos, um amanhecer gradual com clarão e sol crescente interrompe o ataque e provoca a retirada pelos portais.
- **Upgrades:** revisão sem implementação de números. Cada melhoria precisa afetar apenas atributos coerentes com a arma: o Grande Muro dos EUA não deve receber aumento de cadência como benefício principal. Avaliar duração, alcance angular, velocidade de formação, repulsão, cobertura e estabilidade sem introduzir dano no muro. Exigir análise de interações entre tiro principal e especial de todos os países antes de aprovar rebalanceamento.

> Revisão 0.906: retirada do prólogo em 6,5 s, Tipo 1 proporcional com altura 72 px; combate somente depois da animação do relógio; conclusão no laboratório oferece seguir as ondas com a combinação experimental ou voltar ao editor; escudos com HP usam azul (>75%), verde (>50%), amarelo (>25%) e vermelho (≤25%) em toda a superfície.

> Revisão 0.905 — abertura em apartamento simples de classe média baixa no Rio, em uma manhã tranquila: laptop abre e liga, e-mail de convocação; plantão na televisão informa que as Forças Armadas foram destruídas e os mesários estão sendo alocados nas armas antiaéreas. A antiga “onda 0.5” é a segunda parte contínua da onda 0, sem título ou cronômetro próprios. Após o Tipo 6, canhão fumegante sem escudo, disparos quase inoperantes e 60 Tipo 1 grandes em dois grupos de 30 no céu. Sprite destruído fica para revisão futura. Clarão branco do domo reduzido de 840 ms para 180 ms. Esta revisão prevalece sobre referências anteriores a 0.5/84 inimigos.

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

### Implementação parcial aprovada — v0.56 (19/10/2026)
- Primeiro pacote incremental após autorização expressa: nomes Kátia Strófika/Ming Da no boteco, revelação alienígena pré-onda 10, rendição pré-onda 11, relógio de colonização e limite progressivo de tiros comuns em ondas 0–9. Demais decisões B–K continuam planejadas, com pendências detalhadas em docs/versao-0.56.md. Testes locais e build ainda pendentes.

### Implementação parcial v0.57 — primeira noite e boteco (19/10/2026)
- Cena de diálogos avançáveis por clique/toque ao abrir o boteco após onda 0: vitória seguida de **destruição narrada** do canhão por nave superior, reação de Zeca e entrada conjunta dos cinco conselheiros. Em visitas posteriores, comentários breves de Zeca e conselheiro antes da seleção. A seleção fica temporariamente bloqueada durante a conversa.
- **Não há destruição animada nem nave adicional nesta versão**; falta produzir e implementar cinematografia. Consultar docs/versao-0.57.md. Teste local pendente.

### Implementação v0.58 — cinematográfica após onda 0
- Uma nave inimiga de nível superior entra lentamente após a vitória inicial, carrega disparo no núcleo, atinge a posição do canhão com feixe, gera impacto e tremor e conduz o jogador ao boteco. Cena provisória construída com formas Phaser; não altera as regras de combate nem conta como derrota. O boteco deixa de narrar duas vezes a destruição. Documentação: docs/versao-0.58.md. Validação local pendente.

### Revelação alienígena e epílogo — decisões L1–L10 aprovadas (19/10/2026; somente planejamento)
- **L1 A:** desde cedo, a Cubo News noticia que naves parecem **observar especificamente o Cristo Redentor**, sem explicar o motivo.
- **L2 B:** alienígenas humanoides **pequenos, arrogantes, expressões de superioridade, braços permanentemente cruzados**.
- **L3 A com correção:** os alienígenas transmitem ultimato exigindo que o suposto Imperador da Terra feche os braços, **mas usam a própria língua; ninguém entende a mensagem inicialmente**. A tradução inteligível só ocorre com o trabalho dos linguistas perto da onda 10. **Não mostrar tradução ou falas alienígenas compreensíveis antes disso.**
- **L4 C:** tradução **progressiva**: surgem primeiro termos ameaçadores; a exigência referente aos braços só é decodificada depois.
- **L5 B substituída pelo comentário autoral:** **Zeca não negocia nem fala com os alienígenas.** Ele é o operador do canhão, conhece pessoas capazes de melhorá-lo e **suas interações são com o jogador**. A tentativa de explicar o significado acolhedor da estátua ficará para **linguistas brasileiros**, posteriormente.
- **L6 C substituída pelo comentário autoral:** **não há burocracia imperial nem razão adicional** para a guerra prosseguir: os alienígenas simplesmente **continuam o ataque sem dar tempo para explicações**. Só **depois**, os linguistas conseguem explicar aos alienígenas **o conceito de estátuas** e o sentido do gesto.
- **L7 A:** a Cubo News pode mostrar, **ao longo da campanha**, flagrantes de alienígenas **tomando sol e bebendo água de coco na praia**, sem entregar imediatamente a razão dos ataques noturnos.
- **L8 B:** o comandante insiste que o Cristo **feche os braços imediatamente**, de maneira absurda, após a tradução.
- **L9 B:** epílogo Full Brazil começa com **celebração no boteco**; Zeca recebe notícias/ligações internacionais pedindo assistência.
- **L10 C:** última notícia apresenta **outra estátua de braços abertos**, provocando nova confusão diplomática intergaláctica.
- **Observação de continuidade importante:** versões 0.56–0.58 têm textos provisórios potencialmente incompatíveis (especialmente Zeca respondendo diretamente à transmissão ou tradução demasiadamente explícita). **Corrigir somente quando houver autorização para implementação; não alterar código agora.**
- **Status:** apenas GDD e checklist atualizados.

### Menu Extras — decisões N46–N55 (19/10/2026; apenas planejamento)
- **N46 C:** cada quadro de final desbloqueado mostra **apenas a miniatura em pixel art**; o título aparece ao selecioná-lo, não sobre a miniatura.
- **N47 A:** final bloqueado = **quadro escuro com apenas '?' centralizado**, sem identidade, bandeira ou dica.
- **N48 B:** desbloqueio persistente acontece **no momento em que a vitória ou derrota da batalha é determinada**; para rendição, no momento em que se aceita a submissão e se resolve o desfecho, antes de mostrar a sequência narrativa.
- **N49 A:** qualquer um dos dois finais relacionados a um país libera a ficha daquele representante.
- **N50 A:** a ficha de **Zeca Carrara** aparece após a conclusão de qualquer campanha/final.
- **N51 B:** a ficha da espécie/personagens alienígenas só é desbloqueada por **um final da rota Full Brazil**, não apenas ao enfrentar a onda 10.
- **N52 A:** música de final liberada na Jukebox **exclusivamente após alcançar seu final específico**, conforme a regra de desbloqueio das músicas ouvidas.
- **N53 B:** títulos da Jukebox correspondem à **cena** de uso (ex.: 'Traição Russa', 'Vitória Brasileira', 'Derrota'), não títulos criativos separados.
- **N54 B:** o menu Extras apresenta **três botões de entrada** (Galeria de Finais, Galeria de Personagens, Jukebox); cada seção tem sua tela e botão de retorno.
- **N55 C:** linguagem visual **retrô de videogame 16-bit**, menus simples em pixel art.
- **Preservar N11–N45:** finais salvos localmente, dez posições fixas agrupadas por país/Full Brazil, derrota à esquerda/vitória à direita; reproduzir finais desbloqueados com clique para avançar e Esc para voltar; menu Extras visível apenas após primeiro final; fichas sem spoilers, Jukebox manual, sem contadores e sem notificações.
- **Status:** decisões documentadas; não implementar, alterar assets/código ou avançar versão.


### Gameplay e balanceamento — decisões O1–O10 aprovadas (19/10/2026; somente planejamento)
- **O1 C:** reduzir a quantidade de projéteis combinando **intervalos maiores entre disparos e menos tiros por rajada**; respeitar repertórios já implementados e a preferência por evitar novas mecânicas.
- **O2 C:** **limite próprio de projéteis inimigos simultâneos por onda**, configurável no **Wave Maker**, substituindo progressão fixa automática como meta de design. Números serão definidos após balanceamento.
- **O3 C:** pausas planejadas **entre eventos da onda**, mantendo os ataques individuais dos inimigos; parametrizar agendamento no Wave Maker.
- **O4 A:** projéteis inimigos comuns, ao serem interceptados, exibem **clarão branco seguido de pequena explosão colorida conforme o tipo**. Isso não obriga alterar a cor do projétil ainda em voo.
- **O5 C:** bombas resistentes do Tipo 6 exibem **quatro estágios de dano visual** com rachaduras e perda de pequenas peças, **sem modificar suas colisões**.
- **O6 B:** piscada branca de impacto dura **cerca de 0,12 s**.
- **O7 B:** tremor visual da bomba **proporcional ao dano recebido**, sem interferir na hitbox.
- **O8 A:** **cada projétil interceptado deve gerar seu pequeno efeito visível**; não agregar impactos próximos em uma única explosão. Usar efeitos eficientes em vez de omitir os efeitos, com ajustes de desempenho que preservem feedback individual.
- **O9 C:** todas as ondas devem ser sobrevivíveis com **build brasileira básica e margem de erro humana**, sem exigir desempenho praticamente perfeito; validar com testes reais.
- **O10 A:** prioridade do próximo pacote de implementação: **projéteis e dificuldade**, começando por limites configuráveis, cadência, pausas entre eventos e interceptação; **não executar ainda**.
- **Status:** somente GDD e checklist atualizados; nenhum código, asset ou versão alterado nesta rodada.


### Wave Maker — decisões P1–P10 (19/10/2026; somente planejamento)
- **P1 A:** limite de projéteis inimigos simultâneos editável com **campo numérico**, por onda.
- **P2 — PENDENTE DE ESCLARECIMENTO:** o formulário retornou **C (multiplicador geral e ajustes por tipo de inimigo)**, porém o usuário comentou **“Não entendi a pergunta”**. **Não tratar C como decisão consolidada nem implementar até explicar e reconfirmar.** P2 fala da *frequência dos disparos*, não da quantidade de tiros de cada rajada (P3).
- **P3 A:** limite da **quantidade de projéteis por rajada** configurado separadamente por **tipo de inimigo**.
- **P4 A:** pausas entre eventos representadas pelos próprios **espaços vazios na linha do tempo**; não criar novo tipo de marcador.
- **P5 A:** exibir **gráfico de estimativa de projéteis inimigos ativos ao longo do tempo**; identificar visualmente trechos densos, sem confundir estimativa com simulação comprovada.
- **P6 A:** **alerta discreto no editor** ao aproximar do limite de projéteis, sem impedir salvar.
- **P7 C:** teste rápido com **build brasileira básica** e opção avançada para selecionar outras builds.
- **P8 B:** resultado do teste inclui sobrevivência/resultado, dano recebido, disparos, interceptações e inimigos eliminados.
- **P9 A:** comparação **lado a lado dos resultados de dois testes**, antes/depois.
- **P10 A:** alterações no Wave Maker ficam em **rascunho separado** e só afetam a campanha depois de **publicação explícita**, preservando fluxo de rascunhos já aprovado.
- **Estado:** registrar sem implementar nem alterar versões; P2 requer confirmação verbal/seleção posterior.


### Wave Maker e Enemy Maker — decisões Q1–Q10 (19/10/2026; somente planejamento)
- **Q1 C — resolve P2:** cadência/frequência de disparos poderá ser ajustada tanto por **multiplicador geral da onda** quanto por **ajustes específicos por classe de inimigo**. Esta confirmação encerra a pendência P2.
- **Q2 A com complemento autoral prioritário:** alterações do **Wave Maker** são locais à onda editada. Criar como ferramenta **separada o Enemy Maker**, destinado a ajustar propriedades **gerais/globais de cada tipo de inimigo**. Wave Maker e Enemy Maker devem aparecer como **duas opções próprias** de ferramenta; detalhar relação entre valores globais e substituições locais antes de implementar. Não editar globalmente inimigos como efeito colateral de salvar uma onda.
- **Q3 B:** prévia animada da entrada e posicionamento dos inimigos na onda.
- **Q4 C:** eventos na linha do tempo têm **ícone/miniatura e cor** para distinguir as classes.
- **Q5 C:** duplicar ondas completas **e** copiar/colar eventos selecionados.
- **Q6 C:** comandos de **desfazer/refazer** e versões/snapshots nomeados de ondas.
- **Q7 C:** após um teste, **repetir imediatamente com a mesma build** ou ajustar a build e repetir.
- **Q8 C:** histórico de testes **no navegador** e **exportação de resultados** (arquivo, com formato a determinar).
- **Q9 B:** indicador estimado de dificuldade combina quantidade de inimigos, projéteis, velocidade e intervalos; não apresentar essa estimativa como chance de vitória real comprovada.
- **Q10 A:** primeira prioridade de implementação do Wave Maker: **limites de projéteis por onda, cadência e tamanho das rajadas**. Isto não autoriza implementar ainda.
- **Status:** somente planejamento no GDD; nenhuma alteração de código, assets ou versão.


### Enemy Maker — decisões R1–R10 aprovadas (19/10/2026; somente planejamento)
- **R1 A:** Wave Maker e Enemy Maker aparecem como **opções separadas no menu do Laboratório**.
- **R2 A:** selecionar tipos de inimigos por **galeria visual com nomes e miniaturas**.
- **R3 C:** editor reúne **atributos de combate e movimentação** no mesmo ambiente.
- **R4 C:** permitir **valores gerais do tipo** e **ajustes específicos por nível/variante**, com precedência bem definida.
- **R5 A:** editar **apenas os ataques já existentes**, incluindo cadência, velocidade e quantidade de projéteis; **não adicionar novos ataques** como parte desta ferramenta.
- **R6 C:** prévia do **sprite animado** e botão para **testar seus ataques**.
- **R7 C:** arena de testes com **um inimigo ou grupo configurável** do tipo selecionado.
- **R8 A:** Enemy Maker define os valores-base globais; **Wave Maker pode sobrescrever atributos localmente apenas na onda editada**. Não alterar configuração global quando salvar rascunho de onda.
- **R9 A:** **salvar rascunhos sem afetar o jogo** e **publicar explicitamente** para aplicar modificações ao conjunto ativo de inimigos, coerente com os rascunhos Wave Maker.
- **R10 B:** primeira versão prioriza **atributos de combate e arena de teste individual**; interface de movimentação, variantes e testes de grupo permanecem metas aprovadas para fases seguintes.
- **Status:** documentação apenas; não implementar nem alterar código, assets ou versão.


### Enemy Maker — decisões S1–S10 aprovadas (19/10/2026; planejamento somente)
- **S1 C:** editor com **modo básico e avançado**; atributos essenciais aparecem primeiro, detalhes sob demanda.
- **S2 C:** propriedades principais à vista; demais parâmetros existentes em **área expansível avançada**, sem introdução automática de mecânicas.
- **S3 A:** edição por **campos numéricos exatos**, com unidades visíveis, não por sliders.
- **S4 C:** validação em dois níveis: **faixas seguras no básico** e **liberdade ampliada no avançado**, com proteção contra valores tecnicamente inválidos.
- **S5 C:** **seletor de variante/nível para edição** e **tabela comparativa entre níveis**.
- **S6 A:** cada nível **herda os valores-base** e armazena apenas diferenças/sobrescritas; evitar duplicação de valores.
- **S7 C:** restaurar tanto **um atributo individual** quanto **a variante inteira** ao valor original, preservando rascunho até publicação.
- **S8 C:** prévia **compacta de movimento** no painel e opção de abrir **arena em tamanho real**.
- **S9 C:** comparação **numérica original × modificada** e opção de testes em separado para antes/depois.
- **S10 C:** publicação protegida por **resumo de alterações, confirmação explícita e backup/snapshot automático** do estado anterior para reversão.
- **Estado:** apenas documentar; não implementar nem modificar código, assets ou versão.


### Enemy Maker — simulação e comportamento, decisões T1–T10 aprovadas (19/10/2026; só planejamento)
- **T1 A:** arena de teste **neutra**, com fundo simples e visual desobstruído para observar inimigos e ataques; não usar cenário obrigatório do Rio.
- **T2 C:** controles independentes de **pausar/retomar** e **velocidade de simulação** (por exemplo 0,5×, 1× e 2×).
- **T3 A:** movimentação: editar **velocidade, aceleração e demais atributos já implementados**; não acrescentar ferramenta para desenhar rotas nesta decisão.
- **T4 C:** escolher entre **canhão automático** para teste padronizado e **controle manual pelo jogador**.
- **T5 C:** overlays de debug **independentes** para hitboxes e trajetórias.
- **T6 C:** indicadores compactos de simulação com **painel avançado expansível** de métricas.
- **T7 C:** execuções **reproduzíveis** com as mesmas condições, podendo optar por variação de aleatoriedade; registrar condições ou semente para comparação.
- **T8 C:** teste com **quantidade configurável de inimigos** e **formações existentes compatíveis**.
- **T9 C:** encerrar o teste quando **todos os inimigos forem derrotados** ou o **tempo configurado terminar** (o evento que ocorrer primeiro); preservar encerramento manual.
- **T10 C:** ao finalizar, oferecer **repetir, visualizar resultados ou retornar à edição**, mantendo o rascunho.
- **Escopo:** essas funcionalidades descrevem o editor completo planejado; a primeira entrega permanece a versão incremental R10 B (atributos de combate + teste individual). **Não implementar nem versionar** agora.


### Enemy Maker — dados e integração, decisões U1–U10 aprovadas (19/10/2026; somente planejamento)
- **U1 C:** identificação técnica estável **tipo + nível**, com **nome descritivo opcional** que não substitui o identificador.
- **U2 A:** Enemy Maker edita **somente tipos existentes**; não cria classes inéditas nem novos comportamentos.
- **U3 C:** dados publicados em **arquivo JSON central versionado**, com opção de exportar **cada tipo** isoladamente.
- **U4 A:** publicar valores globais de um inimigo faz com que **todas as ondas utilizem os novos valores**, exceto onde o Wave Maker definiu sobrescritas locais.
- **U5 C:** quando a base publicada de inimigos mudar, Wave Maker **avisa sobre a atualização** e permite recarregar, protegendo alterações ainda não publicadas; distinguir versão carregada da versão disponível.
- **U6 C:** publicação inclui **validação estrutural/técnica** e **testes básicos de comportamento**, com falhas impedindo confirmação até correção.
- **U7 C:** antes de publicar, mostrar **lista das ondas afetadas**, com acesso a detalhes de variantes e sobrescritas.
- **U8 C:** histórico de versões publicadas permite **comparar uma versão anterior com a atual** e então restaurá-la.
- **U9 C:** importação de JSON apresenta **prévia das diferenças e validação** antes de incorporar dados ao rascunho.
- **U10 B:** Enemy Maker e Wave Maker mantêm publicação independente, com **publicação conjunta opcional** quando existirem dependências entre alterações; documentar procedimento de consistência/rollback posteriormente.
- **Estado:** registro no GDD apenas, sem implementar, alterar código, assets, configurações publicadas ou número de versão.


### Wave Maker e Enemy Maker — publicação e recuperação, decisões V1–V10 (19/10/2026; somente planejamento)
- **V1 A:** quando houver valor global e sobrescrita local, **o ajuste local do Wave Maker prevalece** naquela onda.
- **V2 C:** valores herdados e sobrescritos aparecem com **ícone de origem e explicação detalhada ao selecionar**, sem poluir a interface.
- **V3 C:** antes de publicar alterações globais, mostrar **resumo de impacto** e **lista expansível** das ondas e propriedades afetadas.
- **V4 A:** publicação conjunta deve ser **atômica**: se qualquer etapa falhar, **nenhuma configuração entra em vigor**; prever restauração consistente do estado anterior.
- **V5 C:** **autosave local dos rascunhos** e botão explícito **Salvar rascunho**; jamais confundir salvar com publicar.
- **V6 C:** histórico de publicações com **data, hora e nota descritiva opcional**.
- **V7 A:** restaurar uma versão publicada **não apaga nem substitui rascunhos em andamento**.
- **V8 C:** exportar tanto **backup completo de Enemy Maker + Wave Maker** quanto arquivos separados de cada editor.
- **V9 C:** ao importar backup completo, escolher **somente inimigos, somente ondas ou ambos**; compatibilizar com prévia de diferenças e validação aprovada em U9.
- **V10 C:** publicação requer **validação estrutural dos dados e execução automática de testes básicos** antes de aplicar modificações.
- **Estado:** registro documental sem implementação, alteração de código, configurações ativas ou versão.


### Laboratório / Wave Maker / Enemy Maker — UX, decisões W1–W10 (19/10/2026; planejamento)
- **W1 C:** tela inicial do Laboratório usa **cartões com nome, descrição e acesso** às ferramentas, incluindo Wave Maker e Enemy Maker.
- **W2 C:** há **atalho direto para alternar** Wave Maker ↔ Enemy Maker e **retorno ao Laboratório**, preservando rascunhos e prevenindo perda de dados.
- **W3 B:** ondas acessadas por **barra horizontal de botões numerados de 0 a 11** (conforme conjunto de ondas planejado atualmente).
- **W4 C:** ao selecionar inimigo, mostrar **ficha resumida de atributos com detalhes expansíveis**.
- **W5 C:** eventos reposicionados **arrastando na linha do tempo** ou ajustando **tempo numericamente**.
- **W6 C:** seleção múltipla de eventos por **cliques modificados (ex.: Shift)** e **seleção por área/retângulo**.
- **W7 C:** **desfazer/refazer** com atalhos de teclado e **botões visíveis**.
- **W8 C:** painel de propriedades **recolhível** para ganhar área útil.
- **W9 C:** rascunhos não publicados identificados por **marcador discreto**, com **detalhes sob demanda**.
- **W10 A:** priorizar experiência de edição **desktop (mouse/teclado)**; celular destinado **somente à consulta**, sem exigir editor completo em telas pequenas.
- **Estado:** decisões documentadas apenas; nenhum código, assets ou número de versão alterado.


### Testes e balanceamento — X1–X10 aprovadas (19/10/2026)
- **X1 C:** testes de onda usam a **mesma regra de vitória da campanha** correspondente.
- **X2 C:** avaliar margem de erro da build básica com **taxa de vitória em testes repetidos e vida restante**.
- **X3 C:** permitir analisar/testar **onda inteira ou trecho selecionado** na linha do tempo.
- **X4 C:** localizar picos de **projéteis inimigos ativos e dano recebido**, por gráficos temporais distintos.
- **X5 C:** quantidade **configurável de execuções automáticas** em lote.
- **X6 C:** canhão automático oferece modo de **precisão ideal** e **precisão humana simulada**.
- **X7 C:** resumo de taxa de vitórias em destaque, com **estatísticas expansíveis** sobre HP, dano e interceptações.
- **X8 B:** quando uma onda parecer injusta, sugerir **ajustes de cadência, tamanho das rajadas ou quantidade de inimigos**, sem alterar dados automaticamente.
- **X9 C:** suportar **teste de onda isolada e simulação de campanha inteira**.
- **X10 C:** onda só pode ser considerada balanceada após **limites técnicos respeitados e viabilidade da build brasileira básica verificada na prática**.
- **Implementação incremental v0.59:** Wave Maker inclui botão **ANALISAR** com uma **heurística de concentração temporal das ENTRADAS de inimigos**, calculada do rascunho em intervalos de 1 s e sugestão de espaçamento. **Não é** simulação física de projéteis, danos, precisão de mira, sobrevivência ou campanha. X1–X10 continuam **parcialmente implementadas** até integração de simulador real. Não confundir score heurístico com dificuldade validada.

### Implementação incremental v0.60 — Wave Maker
- Adicionado **gráfico em barras da concentração estimada de entradas** ao longo do tempo.
- **TRECHO** permite escolher intervalo inicial/final em segundos para o relatório e para o gráfico.
- **COMPARAR** memoriza a pressão estimada da onda em edição e, após mudanças, mostra **antes/depois** (eventos, média e pico); a referência só dura a sessão atual do editor.
- **ANALISAR** passa a respeitar o intervalo selecionado.
- Escopo continua **heurístico**: não é contagem de projéteis em voo, dano registrado, resultado do jogo, taxa de vitória ou bot automatizado. Nenhuma alteração automática nas ondas/campanha.
- A implementação do pacote X1–X10 ainda é **parcial**; simulações reais estão pendentes.

### Implementação incremental v0.61 — teste jogável de rascunho Wave Maker
- Novo botão **TESTAR** no Wave Maker inicia `GameScene` com **cópia dos eventos da onda em rascunho**, `waveMakerTest: true` e duração configurada, preservando campanha e dados oficiais.
- A `GameScene` aceita eventos de teste exclusivamente quando iniciada com `labConfig` e modo válido. A repetição do combate mantém o snapshot do teste.
- Vitória de teste não segue a progressão da campanha; permite **voltar ao Wave Maker**. Derrota de teste também oferece retorno ao editor.
- **Limitações importantes:** ainda não há relatórios persistentes de dano, HP, taxa de vitórias, IA automática nem simulações em lote. A lógica de ondas especiais/chefões exige playtest cuidadoso. Sem alterar publicação de rascunhos.
- **Validação:** implementação enviada ao GitHub sem testes locais/build realizados nesta sessão.

### v0.62 — resultados do teste jogável Wave Maker
- Em `waveMakerTest`, coletar quantidade de projéteis inimigos disparados, abates de inimigos por dano no método comum, interceptações por explosões especiais, dano bruto recebido pelo canhão/escudo, tiros básicos do canhão e HP/escudo restantes ao finalizar.
- Gravar últimos 30 relatórios de testes finalizados no `localStorage` sob chave `soberana-wave-maker-results-v1`; Wave Maker oferece botão RESULTADOS que lista os cinco resultados mais recentes da onda corrente.
- Estes números são contagens instrumentadas parciais: interceptações feitas por outras mecânicas e abates de chefes via lógica especial podem não estar incluídos; não anunciar métricas como totais completos até instrumentação centralizada. Sem execução automática, taxa de vitórias estatisticamente confiável ou exportação nesta versão.
- Resultado registrado em vitória ou derrota de teste; sem publicação da onda nem interferência nas campanhas oficiais.

### Implementação incremental v0.63 — resultados comparáveis
- Wave Maker: botão RESULTADOS mostra últimos cinco testes da onda e oferece **comparar os dois testes mais recentes** lado a lado (resultados e delta das métricas numéricas medidas).
- Novo botão EXPORTAR salva arquivo JSON com até 30 resultados de testes do navegador e metadata de versão/esquema.
- Histórico de teste centralizado em `src/gameplay/waveTestResults.js`; GameScene usa o mesmo módulo para salvar.
- Testes de unidade documentam histórico, comparação, limite e exportação.
- Métricas de abates/interceptações seguem **parciais**; testes não são automáticos. Sem alterar dados de campanha ou publicar rascunhos.
- Funcionalidade ainda **não validada visualmente/no build** nesta sessão.


### v0.64 — acessibilidade do Laboratório e Enemy Maker inicial
- Corrigido acesso: a tela principal de testes de upgrades (`V1PlaytestScene`) oferece botões **WAVE MAKER** e **ENEMY MAKER**. O Wave Maker existia antes, mas era acessível apenas através da tela separada `LabSetupScene`.
- Removido botão de build fixa **BR+EUA+CHINA** da tela de upgrades, conforme pedido.
- Criada interface inicial do Enemy Maker, acessível na tela de upgrades: selecionar **Tipo 1–6**, nível 1–10, visualizar atributos de combate já definidos e editar numericamente os valores presentes.
- Rascunhos Enemy Maker salvos em **localStorage**, separados por tipo e nível. Restaurar redefine valores da variante corrente apenas no rascunho; alterações **não afetam a campanha**.
- **Não implementado ainda:** publicação de dados globais no jogo, testes diretos do Enemy Maker, prévia animada e demais funções avançadas já aprovadas. Não confundir este MVP com Enemy Maker completo.

### v0.65 — opção de submissão exclusivamente na revelação da traição
- Na cutscene **anterior à onda 11**, revelar traição e oferecer **RESISTIR À TRAIÇÃO** ou **ACEITAR SUBMISSÃO** (não disponível no percurso Full Brazil).
- Ao escolher resistir, **destruir ambos os botões e a sobreposição da cutscene** antes do contador e do combate. A opção de submissão **nunca fica visível durante a luta**.
- Ao aceitar submissão, ir diretamente ao final de derrota por colonização, sem iniciar a batalha.
- A tela posterior à derrota em combate pode permitir ver o final, mas não representa uma nova oferta de submissão durante a batalha.

### Balanceamento Tipo 6 — v0.66
- A vida de **cada um dos quatro módulos** passa de 16% para **36% da vida-base do chefe** (2,25×). Escudos individuais e barreira seguem proporções existentes e, portanto, também ficam mais resistentes.
- A vida do **núcleo** permanece em 16% da vida-base, para preservar um encerramento mais rápido após a destruição de todos os módulos.
- Mantêm-se os papéis, sequência de ataques, hitboxes e mecânica do núcleo. Sujeito a playtest, especialmente com builds brasileiras avançadas.

### v0.67 — reflexos curvos do globo coreano
- **Apenas efeito visual:** raios refletidos pelo globo deixam de aparecer como linhas retas estáticas e passam a seguir **trajetórias quadráticas curvas**, com controle de arco e leves diferenças entre raios de uma salva.
- Três camadas de luz: aura violeta ampla e translúcida, brilho lilás intermediário e núcleo estreito quase branco. Flash curto no globo, ponto luminoso em movimento e faíscas/anel de impacto ao chegar aos alvos.
- Animação de aproximadamente **200 ms**, desenhada em poucos segmentos inteiros para preservar a leitura pixel art.
- **O dano e a seleção de alvos são imediatos e permanecem inalterados.** O globo segue ativo por quatro segundos e o número de reflexos por tiro não muda.
- Para desempenho, manter o limite visual de **até 8 trajetórias por pulso** e intervalo de 80 ms entre salvas visuais; reflexos adicionais **continuam causando todo o dano**.
- Implementação: `src/gameplay/discoReflectionVfx.js` e integração em `fireV1DiscoReflections`.
- Testes automatizados preparados mas **não executados neste ambiente**; validar comportamento e desempenho no navegador.

### Correção de cutscenes — v0.68 (onda 11)
- A cutscene da traição deve desaparecer **inteiramente** quando o jogador escolhe **RESISTIR À TRAIÇÃO**: sobreposição, texto, moldura temporária do Cubo News, fundos, legendas, sombras e faixas vermelhas decorativas de ambos os botões.
- **ACEITAR SUBMISSÃO** continua disponível somente na cutscene anterior ao combate e leva ao final colonial sem lutar; a escolha de resistir inicia o contador e a batalha com tela livre.
- `addMenuButton` produz quatro GameObjects independentes; limpar o botão implica destruir todos. `addCuboBroadcastFrame` agora devolve todos os objetos criados para permitir limpeza integral nas telas temporárias.
- Limpeza equivalente do botão de continuar na cutscene anterior à onda 10.
- Testes de regressão em `tests/finalePreludeCleanup.test.js` verificam resistência, submissão e Full Brazil. Não executar mudanças na campanha/arte.


### Planejamento — Operação Desvio de Carga de Zeca, D1–D4 (19/10/2026; NÃO implementar)
- **Direção geral aprovada (A):** substituir a progressão de resistência brasileira automática após derrota por uma mecânica narrativa na qual **Zeca recupera tecnologias confiscadas pelo país traidor** graças aos contatos de mecânico de táxis. A recuperação alimenta as novas tentativas contra **o mesmo traidor**.
- **D1 A:** o estoque recuperável é composto **somente por melhorias adquiridas daquele país traidor que foram roubadas**; não criar novas melhorias aleatórias nem recuperar equipamentos de outros países.
- **D2 C — SUBSTITUÍDA pela correção posterior E6 (ver E5–E10):** a progressão antiga de recuperar 1, depois 2, depois 3 melhorias **não vale mais**. Zeca recupera **todas as melhorias roubadas elegíveis de uma vez, exceto o Supremo**, e concede uma única revanche; não há outras operações de recuperação.
- **D3 B:** Zeca recupera as melhorias **na mesma ordem em que foram adquiridas originalmente**, sem escolha do jogador ou sorteio.
- **D4 B:** após recuperar todas as melhorias elegíveis, o jogador tem **uma última tentativa** contra o traidor, em vez de tentativas infinitas. Resultado da última derrota e comportamento após esgotar estoque serão detalhados em rodadas futuras.
- **Proposta narrativa do usuário, ainda a detalhar:** perto da ação **ACEITAR DERROTA / VER FINAL** na tela após derrota, surge **um pequeno retrato do Zeca com expressão séria**, sugerindo discretamente que ele tem uma proposta. **Ao clicar no retrato**, Zeca apresenta a Operação Desvio de Carga. **Momento exato de aparição e interação ainda não confirmados**; não colocar a escolha de aceitar submissão em combate. Preservar a regra anterior: submissão oferecida inicialmente apenas na cutscene da traição, antes da luta.
- **Status:** decisões e proposta narrativa registradas no GDD apenas. **Nenhum arquivo de código, versão, assets ou configuração de jogo deve ser alterado** nesta etapa.


### Planejamento — Operação Desvio de Carga de Zeca, E1–E4 (continuação de D1–D4; NÃO implementar)
- **E1 A — Retrato discreto na derrota:** na tela exibida **após a derrota na luta contra o traidor**, ao lado do botão **ACEITAR DERROTA / VER FINAL**, mostrar um **pequeno retrato de Zeca olhando seriamente para o jogador**, sugerindo que tem algo a propor. O retrato é clicável. **Não** é um botão de submissão durante o combate; manter a submissão inicial exclusivamente na cutscene da traição, antes da onda 11.
- **E2 B — Proposta com escolha:** ao clicar no retrato, **Zeca explica o plano para recuperar equipamentos**; o jogador pode **aceitar ou rejeitar a ajuda**. O fluxo exato após a rejeição ainda será definido, sem presumir automaticamente qualquer caminho não aprovado.
- **E3 A — Cena ilustrada por país:** cada operação de recuperação apresenta **uma ilustração curta em pixel art, específica para o país traidor**, acompanhada de **fala humorística de Zeca**, sem obrigatoriedade de uma nova conversa no boteco.
- **E4 B — Despedida na derrota definitiva:** após esgotar todas as melhorias recuperáveis e **perder a última tentativa** (D4 B), **Zeca faz um último comentário**, reconhecendo que seus contatos/alternativas se esgotaram, e então começa o **final de colonização**. Não inserir novas tentativas.
- **D1, D3, D4 continuam válidas, com D2 revisada:** somente melhorias roubadas do traidor, entrega organizada na ordem original de aquisição, **todas recuperadas de uma vez exceto o Supremo**, com **uma única tentativa de revanche**; nunca múltiplas operações incrementais.
- **Status:** apenas decisões narrativas e de UX documentadas no GDD. **Nenhum código, sprites, testes, versão ou configuração publicados alterados nesta etapa.**


### Planejamento — Operação Desvio de Carga de Zeca, E5–E10 (correção definitiva de D2; NÃO implementar)
- **E5 A — rejeitar proposta:** o jogador que **recusa a ajuda de Zeca** aceita a derrota e segue **direto ao final de colonização**.
- **E6 — CORREÇÃO DO USUÁRIO PREVALECE SOBRE OPÇÃO C:** a opção inicialmente marcada descrevia uma nova recuperação por derrota, mas o usuário esclareceu: **“Não existe próxima recuperação. Ele devolveu todos os upgrades. Foi a última chance. Acabou.”** Portanto, existe **somente uma operação** de Desvio de Carga. Ao aceitar, Zeca devolve **de uma só vez TODAS as melhorias daquele país traidor que haviam sido roubadas**, **exceto o Supremo**; a batalha seguinte é a **última tentativa**. Se perder, não há nova oferta, desbloqueio ou ciclo de resistência. A recuperação escalonada previamente indicada em **D2 C está expressamente revogada**. D3 B permanece como ordem da apresentação/entrega dos equipamentos (ordem de aquisição), **não** como recuperação em múltiplas derrotas.
- **E7 A — equipamentos intactos:** toda melhoria recuperada funciona **exatamente como antes**, com todos os efeitos originais, sem penalidade, adaptação ou versão improvisada.
- **E8 A — outros aliados intactos:** a traição remove apenas tecnologias do **país traidor**. Melhorias dos outros países permanecem ativas; Zeca não precisa roubá-las de volta.
- **E9 A — uma ilustração por país:** para cada país traidor, produzir **uma cena de recuperação em pixel art reutilizável**, variando a fala engraçada de Zeca para o traidor; **não exibir lista nem quantidade de melhorias recuperadas** (E13, comentário do usuário). Manter a decisão E3 A.
- **E10 B — última chance dita por Zeca:** durante a proposta/recuperação, Zeca explica naturalmente que **não tem mais equipamentos para recuperar e aquela revanche é a última tentativa**. Não depender de aviso técnico obrigatório; E4 B prevê uma despedida de Zeca depois de perder a tentativa final.
- **Fluxo decidido até agora:** derrota inicial contra o traidor → tela de derrota com retrato sério e clicável de Zeca (E1) ao lado de “Aceitar derrota / ver final” → clicar na cara e ouvir a proposta (E2) → recusar encerra campanha no final colonial (E5); aceitar mostra cena específica do país e devolve todas as melhorias confiscadas elegíveis, exceto Supremo (D1/E6/E9) → **uma única revanche**, mantendo equipamentos dos aliados (E7/E8) → vitória segue seu desfecho; **derrota definitiva** inclui última fala de Zeca e final de colonização (D4/E4/E10).
- **Questões E11–E14 resolvidas posteriormente:** transformação final volta (menos o Supremo); a situação sem melhorias roubadas é considerada impossível pelas regras da campanha, sem cutscene alternativa; não exibir contador ou relação de itens recuperados; cena ilustrada avança por clique. **Sem implementação ainda.**
- **Status:** somente GDD atualizado. **Não implementar, alterar código, sprites, testes ou versão agora.**


### Planejamento — Operação Desvio de Carga de Zeca, E11–E14 (19/10/2026; NÃO implementar)
- **E11 A:** Zeca recupera **todas as melhorias confiscadas do país traidor, incluindo a transformação definitiva do canhão**, restauradas com seus efeitos originais. **Única exceção: o Supremo daquele país NÃO é recuperado.**
- **E12 — comentário do usuário prevalece sobre A:** a hipótese de o traidor não possuir melhorias compradas **não pode ocorrer no fluxo válido do jogo**, segundo a regra indicada pelo usuário. Portanto **não desenvolver uma cena narrativa ou escolha especial de “sem recuperação”**; quando se implementar, verificar a consistência dessa premissa no fluxo de seleção do traidor, sem inventar um novo resultado.
- **E13 — comentário do usuário prevalece sobre C:** **NÃO precisa mostrar nem a quantidade nem os nomes das melhorias recuperadas**. O retorno das melhorias ocorre na mecânica; a ilustração e a fala de Zeca são suficientes. A opção inicial “lista e resumo” foi **expressamente substituída** por essa correção.
- **E14 A:** a **ilustração em pixel art** da Operação Desvio de Carga e a **fala de Zeca permanecem até o jogador clicar/tocar para continuar**. Não avançar automaticamente por tempo.
- **Preservar as decisões anteriores já corrigidas:** uma única oferta e uma única recuperação total (exceto Supremo) após a primeira derrota para o traidor; rejeitar = fim colonial; aceitar = única revanche; se perder essa revanche, fala final de Zeca e fim colonial, sem novas propostas ou tentativas; as tecnologias de outros países permanecem ativas.
- **Status:** somente texto do GDD modificado. **Não implementar, alterar código, assets, testes ou versão agora.**


### Planejamento — Operação Desvio de Carga de Zeca, E15–E18 (19/10/2026; NÃO implementar)
- **E15 A — revanche completa:** aceitar a proposta de Zeca após a primeira derrota inicia **a onda 11 inteira do início**, enfrentando **o mesmo país traidor sorteado originalmente**. O inimigo Tipo 6 reaparece com **todos os módulos, vida, escudos e ataques restaurados**; nada do dano causado na primeira luta é mantido.
- **E16 A — defesa inteiramente restaurada:** na única revanche, o canhão brasileiro começa com **vida e escudo completos**; todas as melhorias elegíveis recuperadas já funcionam desde o início, com os efeitos originais, sem penalidade; equipamentos dos outros países não traidores continuam disponíveis. O Supremo confiscado do traidor continua excluído da recuperação (E11).
- **E17 A — piada rápida sobre o Supremo:** Zeca menciona brevemente e com humor que não conseguiu trazer de volta o Supremo porque **a arma secreta era difícil demais de transportar**. Não transformar essa fala em explicação longa ou nova missão.
- **E18 B — contatos do Zeca, com correção posterior do usuário:** cada cena de recuperação associada a um país traidor pode ter um motorista conhecido de Zeca; **todos são brasileiros e taxistas ou motoristas de van**, com humor cotidiano absurdo e falas convictas, tomando como **referência de tom** os motoristas de *Choque de Cultura*. **Não existe uma explicação** para como conhecem Zeca, onde estavam ou como obtiveram os equipamentos: simplesmente aparecem e resolvem a situação. Os personagens/visuais serão **criados pelo usuário**; não presumir nomes, nacionalidades estrangeiras, residências no exterior ou biografias. Os exemplos de contatos internacionais (Big Mike, Kim GPS, Vladimir do Volante, Senhor Wang) foram sugestões **não aprovadas** e não são canônicos.
- **Fluxo consolidado:** derrota inicial → tela de derrota com retrato discreto e clicável do Zeca junto a "Aceitar derrota" (E1) → jogador escuta a proposta e pode recusá-la (fim colonial) ou aceitá-la (E2/E5) → cena em pixel art específica para o país, com contato taxista/motorista de van e fala bem-humorada; avança apenas com clique (E3/E9/E14/E18) → **todas** as melhorias confiscadas daquele traidor são restauradas de uma vez, inclusive a transformação definitiva, **exceto Supremo** (E6/E7/E11), sem lista/contador visual (E13) → única revanche com onda 11 e defesas reiniciadas (E15/E16), avisada como última chance (E10) → se vencer, desfecho de vitória existente; se perder, despedida do Zeca e final de colonização (E4). Não oferecer nova recuperação nem outra revanche.
- **Status:** apenas decisões documentadas. **NÃO implementar, alterar código, sprites, testes ou versão** até autorização explícita.

### Ajuste narrativo de E18 — motoristas brasileiros sem explicação (planejamento, NÃO implementar)
- Os contatos de Zeca **não são estrangeiros** nem membros de uma rede internacional de taxistas: são **motoristas brasileiros de táxi ou van**. A ambientação da operação pode variar conforme o país traidor, **sem explicar por que o motorista está envolvido ou como resolveu a logística**.
- **Referência humorística definida pelo usuário:** os tipos de *Choque de Cultura* — gente normal, comentários absurdos feitos com total seriedade e confiança. A adaptação concreta dos personagens será feita pelo próprio usuário. Não importar nomes ou diálogos da obra como se já fossem decisões aprovadas.
- **Regra de narrativa:** Zeca só aciona seus conhecidos, eles **resolvem a coisa**, e o jogo segue. **Não escrever exposição de origem, currículo, mudança para o exterior, grupo de WhatsApp ou missão internacional**.
- Mantidas as decisões D1–E17, incluindo a cena diferente por país, recuperação de todas as melhorias roubadas exceto Supremo, uma única revanche e ausência de novas operações após perder.
- **Somente GDD.** Nenhuma implementação, asset ou alteração de versão nesta etapa.


### v0.69 — Operação Desvio de Carga de Zeca IMPLEMENTADA (substitui resistência anterior)
- **Novo fluxo jogável da onda 11:** na **primeira derrota** contra o país traidor, a tela oferece "ACEITAR DERROTA / VER FINAL" e, **ao lado**, um pequeno retrato sério e clicável de **Zeca Carrara**. Clicar no retrato abre a proposta: aceitar ajuda ou recusar (final colonial).
- **Aceitar:** abre `ZecaRecoveryScene`, com chamada de Zeca a motoristas **brasileiros** (taxistas ou motoristas de van, sem explicar a logística) e apresentação curta da operação. A cena tem variações de texto e cor para EUA, Coreia do Sul, Rússia e China e **avança somente ao clicar no botão**. Imagens dos motoristas e retrato final de Zeca seguem **provisórios**, aguardando arte do usuário; não criar biografias/nomes novos.
- **Recuperação efetiva:** `zecaRevengeLoadout` restaura exatamente o histórico original de escolhas, logo **TODOS os upgrades confiscados do país traidor, inclusive transformação final**, e preserva os de países não traidores; **o Supremo do traidor não é restaurado**, via `disabledSupremeCountry` em `v1SupremeFor`/`v1CombatStats`. A interface **não mostra quantidades ou lista** de tecnologias.
- **Revanche:** reinicia fisicamente a **onda 11 completa**, com o **mesmo traidor** (não sorteia outro), seus módulos e ataques novos, **vida do canhão 100 e escudo máximo**. Flag `zecaRevenge:true` atravessa a nova cena e impede que a traição seja anunciada uma segunda vez.
- **Encerramento:** somente **uma** operação e **uma** revanche. Se perder de novo, Zeca faz sua despedida na tela de derrota e o jogador vai ao final colonial. Se ganhar, vai ao final de vitória habitual. A rota Full Brazil não oferece Zeca. A opção de submissão continua somente **antes** da primeira luta, na cutscene da traição.
- **Acessos a reinício removidos na onda 11:** tecla `R` e o reinício via pausa ficam inativos para não ignorar o encerramento de última tentativa. Demais ondas continuam podendo reiniciar normalmente.
- **Sistema antigo desativado/removido:** `continueResistanceAfterDefeat` e `nextBrazilianResistanceUpgrade` não participam mais do fluxo nem são exportados, e o HUD deixa de mostrar "RESISTÊNCIA BR N". Ver `src/gameplay/zecaRecovery.js`, `src/scenes/GameScene.js`, `src/scenes/ZecaRecoveryScene.js`.
- **Validação:** verificações de sintaxe passaram em arquivos JS alterados; execução direta isolada confirmou, para os quatro países, desbloqueio único, bloqueio do Supremo traidor e preservação da transformação nível 10. **Suíte `npm test`, build Vite e playtest no navegador ainda não executados**; conferir testes `tests/zecaRecovery.test.js` e `tests/wave11Rules.test.js`.
- **Precedência:** este comportamento implementado e as últimas decisões E5–E18 **substituem** todas as propostas anteriores de múltiplas recuperações, escalonamento 1/2/3, níveis brasileiros pós-derrota e várias revanches.


### v0.70 — escudos em sprites, Tipo 6, Wave Maker e reformulação russa
- **Escudos brasileiros em sprites de pixel art:** a cúpula do canhão e das torres agora usa sprites Phaser (`Image`) baseados em texturas pixeladas, geradas uma única vez em `src/gameplay/shieldSprites.js`. Preservar raios, cores por faixas de HP (azul, verde, amarelo, vermelho), colisões e defesa. Texturas programáticas podem ser substituídas por PNGs finais quando houver artes; não confundir com spritesheets externos.
- **Ruptura:** quando o escudo sai da faixa vermelha e cai a **zero**, o sprite some no mesmo frame e dispara uma curta animação de dez fragmentos de cristal, inclusive quando o dano fatal vem de gelo/ogiva inimiga. Escudo regenerado reaparece normalmente. Não causar dano adicional com os estilhaços visuais.
- **Tipo 6 — blindagem reforçada:** cada módulo passa a ter escudo próprio de **42% da vida do módulo** (antes 20%); barreira compartilhada passa a **85% da vida de um módulo** (antes 30%). A barreira **já está cheia e visível na entrada do chefe**, inclusive na onda 10 e 11, antes de permitir que seja atingido. Módulos conservam os HPs reforçados da v0.66, núcleo não muda.
- **Tipo 6 — entrada e relógio:** descida fica em **4,2 s (alienígena) e 4,6 s (traidores)**, seguida de **2 s de estabilização não alvejável**. O chefe só libera colisão, ataques e relógio **depois do fim da estabilização**. Durante entrada/estabilização a contagem da onda fica congelada; no início do confronto, `elapsed=0`. Entrada da onda 11 preserva o mesmo país sorteado e a revanche de Zeca da v0.69.
- **Wave Maker volta a abrir:** o editor chamava `this.events()`, método que colide com o `this.events` EventEmitter interno do Phaser. Renomeado para `waveEvents()` em todo `WaveMakerScene`, eliminando o erro de abertura.
- **Rússia reformulada:** congelados **não atraem nem contagiam** outros inimigos. Se um inimigo morrer enquanto ainda congelado, ele **estilhaça com efeitos de gelo e causa dano AoE** em inimigos próximos; mortes em cadeia podem gerar novos estilhaçamentos, cada alvo somente uma vez. A explosão também pode atingir a barreira/módulos do Tipo 6 sem congelá-lo. Novos escalões de raio/dano por nível russo: **nível 1: 44 px/2; nível 3: 60 px/3; nível 5: 76 px/4,5; nível 7: 96 px/6; nível 10: 120 px/9**. Durações de congelamento progressivas continuam (1 / 1,5 / 2 / 2,5 / 3 segundos). Especial Matryoshka conserva progressão 8,12,16,24 fragmentos; Supremo Cortina de Ferro e recarga do especial preservados.
- **Árvore russa (títulos atualizados):** 1 Geada Siberiana; 2 Matryoshka de Estilhaços; 3 Inverno Russo; 4 Boneca Matryoshka; 5 Estilhaço Siberiano; 6 Frente Fria; 7 Zero Absoluto; 8 Tempestade de Estilhaços; 9 Protocolo Cortina de Ferro; 10 Inverno Eterno. Alterar as descrições antigas de atração/vórtice para estilhaçamento sem alterar os demais países.
- **Testes:** `tests/russianFrost.test.js` e `tests/type6Boss.test.js` ajustados; adicionado `tests/balance069Plus.test.js` para regressões no editor, escudos e explosões. Verificação de sintaxe em arquivos alterados passou e simulações isoladas confirmaram sprite gerado, dano russo e escudo inicial do Tipo 6. Ainda **pendentes** `npm test`, `npm run build` e playtest navegador para esses fluxos.


### v0.71 — menu inicial minimalista e pixel art em destaque (IMPLEMENTADO)
- **Remover Cubo News da tela de título SOMENTE:** `MenuScene` não chama `addCuboBroadcastFrame`, `addCuboPanel` ou `addCuboPixelText`. Foram removidas a barra de notícia superior, tarja inferior, painel opaco central e escurecimento pesado em tela cheia. A identidade Cubo News **continua no noticiário e nas demais cenas**.
- **Composição limpa:** panorama noturno do Rio exibido diretamente como fundo, com título **Soberana** e subtítulo **O RIO NÃO VAI CAIR** flutuando sobre o céu, com contorno escuro para leitura; somente dois botões centrais: **COMEÇAR CAMPANHA** e **TESTAR UPGRADES**. Retirados textos explicativos, instruções de teclado/mouse, contagem de países e separadores decorativos da tela inicial. Atalhos **ENTER** (campanha) e **U** (upgrades) preservados.
- **Música fora da área principal:** criado `addMenuMusicControl` em `src/audio/music.js`: botão **♫ MÚSICA** discreto no **canto inferior esquerdo**. Ao clicar revela pop-up compacto com **slider clicável e arrastável**, porcentagem e opção de silenciar/ligar; inicia fechado. Usa o `musicPlayer` existente para persistir preferência no armazenamento do navegador. `addMusicControls` antigo segue funcionando no menu de pausa, sem mudanças.
- **Rodapé discreto:** versão v0.71 exibida no canto inferior direito, sem tarja de telejornal. Campanha, laboratório, áudio e cenário preservados.
- **Validação:** sintaxe dos arquivos novos/editados e simulação direta do controle (abrir, arrastar, silenciar e fechar) passaram; novo teste `tests/menuClean071.test.js` cobre regressões. **Execução completa de `npm test`, build e playtest visual ainda pendentes.**


### v0.72 — onda 1 mais acessível e combate em altura média
- **Escopo:** somente `wave1` da campanha e os testes que refletem suas regras; demais ondas (`wave0`, `wave2`–`wave11`) e editores mantêm sua agenda, coreografia e parâmetros originais. Wave Maker continua carregando a programação oficial atualizada da onda 1 como rascunho inicial, sem apagar rascunhos já salvos.
- **Menos inimigos simultâneos:** substituída a conversão genérica da onda 1 por **sete enxames Tipo 1** com `[4,5,5,5,5,6,6]` naves nos tempos `[400,2300,4300,6400,8600,10800,12700]` ms e **três esquadrilhas Tipo 2** com `[3,4,4]` naves nos horários de eventos Tipo 2 já existentes. Total programado **47 naves em dez formações**. Todas as formações são programadas antes de 13,5 segundos; última liberação nominal de nave até 14,8 segundos. Ritmo menos saturado do que as grandes formações anteriores.
- **Faixa de voo mais baixa:** Tipo 1 entra por volta de y=120, com padrões alternados `lowSweep` e `lowZigzag`, movimentos laterais legíveis e **descida contínua até y≈235**, sem subida inicial para fora do céu. Tipo 2 entra perto de y=192 e executa manobras táticas reduzidas no céu médio, antes da investida. Os outros padrões globais permanecem inalterados.
- **Projéteis substancialmente reduzidos:** na fase de formação da onda 1, **um atirador por enxame Tipo 1** e **dois por esquadrilha Tipo 2**, com **um projétil por atirador**. Isso limita as salvas programadas dessas formações a **13 tiros** se todos os integrantes correspondentes sobreviverem, em lugar de permitir que cada nave dispare (e algumas, duas vezes). Inimigos continuam podendo mergulhar e colidir.
- **Dano e velocidade da onda 1:** projéteis Tipos 1/2 passam a causar **10 de dano** (antes 14) e a viajar com **90% da velocidade anterior**. Colisões contra a defesa passam a **75% do dano usual**. Efeito restrito à onda 1.
- **Implementação:** `src/gameplay/formation035.js` exporta `WAVE1_PACING`, `wave1FormationShooter` e padrões de voo baixo. `src/scenes/GameScene.js` aplica os ajustes exclusivamente quando `this.mode==='wave1'`. `tests/formation035.test.js` separa a onda 1 da progressão genérica das ondas seguintes; `tests/wave1Balance.test.js` valida contagem, distribuição, altitude, salvas e restrição de escopo.
- **Validação de código:** verificação de sintaxe passou para arquivos alterados; simulação da agenda efetiva resultou em **47 naves, 13 tiros potenciais de formação, último evento em 12,7 s e última liberação nominal até 14,8 s**. **Suíte `npm test`, `npm run build` e playtest visual no navegador ainda não executados**.


### v0.73 — Pause responsivo e independente do zoom (IMPLEMENTADO)
- **Problema observado em navegador:** o botão "Ⅱ PAUSAR [P]" era desenhado dentro da câmera Phaser em `(W/2, y=20)`. A câmera sofre zoom temporário durante a abertura do cronômetro, podendo projetar o botão para cima dos limites visíveis do viewport; tela redimensionada/barra do navegador também torna o topo pouco seguro.
- **Solução:** `GameScene.createHud()` agora monta o botão **DOM real**, com `mountPauseHudButton` em `src/ui/pauseHudButton.js`, diretamente no `#viewport`. O controle permanece **fora de qualquer zoom/screen shake da câmera**, centrado horizontalmente e com altura/largura responsivas.
- **Safe area:** a posição vertical usa o maior valor entre o topo visível + **16 px**, a margem segura do CSS `env(safe-area-inset-top)` + **16 px**, e o topo da composição do jogo + 16 px, limitada à região visível. Para canvas parcialmente acima da janela, o botão continua dentro do viewport. Ajusta-se após `resize`, `visualViewport.resize`, mudanças de composição Cubo News e `scale.resize`.
- **Fluxo e limpeza:** clicar/tocar pausa como antes; botão é ocultado durante `PauseScene`, reaparece ao retomar e é removido com os listeners no `shutdown`, evitando restos de interface. `P` e `Esc` permanecem funcionais. A tela de orientação de celular continua acima do botão.
- **Fallback:** em testes/embeds sem `#viewport` DOM, a posição Phaser alternativa fica em `y=68` em vez de `y=20`, preservando a ação.
- **Verificação:** cálculo de margens, clique, pausa/retomada e limpeza de listeners exercitados em simulação JS isolada; adicionada regressão `tests/pauseHudResponsive.test.js`. **`npm test`, `npm run build` e avaliação visual em browser real ainda pendentes.**


### v0.74 — Supremo com digitação segura e remoção de atalhos perigosos
- **Erro corrigido:** as teclas **R** e **P** tinham listeners globais de reinício/pausa que eram acionados antes de o listener de digitação do Supremo receber as letras. Isso interrompia códigos como **REVEILLON**, **FREEDOM**, **SPUTNIK**, **ENTREGA** e **ENCORE**. A tecla F não tinha uma ação de reiniciar cadastrada diretamente no GameScene, mas agora também é ignorada como comando de jogo fora do Supremo, funcionando como letra dentro dele.
- **Input isolado:** novo `src/gameplay/supremeCodeInput.js`, com tabela única dos códigos dos países e avanço por tecla; `GameScene` usa um único despachante de teclado que dá **prioridade absoluta à digitação** quando `supremeTyping` está ativo. Não existe mais `keydown-R` para reiniciar a onda. **R e F não são atalhos de reinício**. Durante o Supremo, **P é letra**, não pausa; Esc cancela; Backspace apaga. Espaço abre o protocolo quando disponível. Fora do Supremo, **P e Esc continuam abrindo a pausa**. A entrada não reage a combinações com Ctrl/Alt/Meta nem à repetição de tecla segurada.
- **Tempo para digitação:** preservado o desbloqueio do Supremo nos **últimos cinco segundos da onda**, conforme regra atual; ao abrir a interface, **relógio Phaser e tweens são pausados** e `GameScene.update()` não avança combate, cronômetro, movimento ou dano enquanto o usuário digita. As escalas anteriores são restauradas ao concluir ou cancelar a palavra. O botão DOM PAUSAR não abre outra cena durante a digitação.
- **Feedback visível:** antes da janela final, apertar Espaço mostra aviso de que o Supremo fica disponível nos últimos cinco segundos (com limite de frequência). Quando o Supremo fica pronto, surge um aviso claro **"★ SUPREMO PRONTO — ESPAÇO"** durante a campanha; antes o antigo indicador ficava oculto junto dos rótulos de laboratório. Prompt inicial e feedback corrigidos com **quebras de linha reais**; erro de digitação marca texto e orienta usar Backspace.
- **Debug com acesso seguro:** saltos de onda durante desenvolvimento passam de **Shift+número** para **Ctrl+Alt+Shift+número**, para não trocar de fase acidentalmente. Disponíveis apenas em `import.meta.env.DEV`; não são comandos normais da campanha.
- **Testes:** `tests/supremeCodeInput.test.js` exercita todas as palavras, P/R/F, correção de erro, cancelamento, abertura apenas no fim da onda, pausa/restauração do relógio e despacho do teclado. Simulação direta das regras nos seis IDs técnicos (inclui alias kr) passou. **Ainda pendentes suíte completa `npm test`, `npm run build` e playtest no navegador.**

---

## Atualização aprovada — 20/10/2026 — Sputnik, identidade visual e Tipo 6 (v0.848)

Esta seção **substitui as especificações anteriores** de Matryoshka 8/12/16/24 fragmentos e seus efeitos instantâneos. Não altera o tiro principal russo dos níveis 1, 3, 5 e 7 nem as regras atuais do Supremo russo.

**Cores institucionais:** Brasil verde (`#37C878`), EUA azul (`#4897F5`), Rússia dourado (`#E8B84C`), China vermelho (`#E84D51`) e Coreia do Sul roxo (`#A46CF0`). Tons criogênicos ciano e detalhes de metal continuam permitidos para efeitos físicos; cor institucional rege destaques de interface, seleção, bordas, identidade das facções e cor-base de seus especiais.

**Especial russo — Sputnik Criogênico:** satélite metálico com quatro antenas, núcleo ciano, cristais orbitais e névoa. Viaja até o local selecionado e permanece estacionário. Em contato, congela e aplica Cristalizado, aumentando o dano do tiro principal russo; ao morrer congelado, o alvo provoca estilhaços com raio ampliado. Sputnik por si só **não causa dano direto**, não elimina inimigos e não muda a imunidade do Tipo 6 a congelamento. Máximo de três Sputniks simultâneos por performance. Atualizações aprovadas:
- **Nível 2 — Sputnik Criogênico:** duração 4 s, raio 43 px; cristalizados tomam ×1,30 dano primário e têm explosão ×1,25 em raio.
- **Nível 4 — Órbita Fria:** duração 5 s e raio de contato 59 px.
- **Nível 6 — Reator de Permafrost:** explosões em cristalizados ganham ×1,55 de raio e ×1,25 de dano; sem substituir o dano base normal de estilhaços.
- **Nível 8 — Zero Absoluto Orbital:** raio 67 px, pulsos de congelamento a cada 1,05 s dentro de 112 px e onda final congelante de 152 px. Sem dano automático por pulso/expiração.

O sistema de danos continua limitado a um estilhaçamento por vítima congelada; visuais obedecem ao orçamento de partículas. O especial híbrido de outros países continua compatível: o Sputnik é um componente persistente e não bloqueia as demais cargas do disparo especial.

**Tipo 6:** barreira protetora em semicírculo invertido, curvado para baixo (∪), preservando lógica/colisão da barreira anterior. Todos os módulos e o núcleo têm animação **estritamente visual** de energia convergente; o laser de cerco (99 px) e o núcleo (116 px) têm raio maior que os outros módulos (58 px). Não altera HP, ataque, capacidade real de absorção ou o relógio do boss.

**UX:** relógio do Cubo News fica invisível até o instante final da transição da contagem central, sem interpolação de opacidade nem CSS transition. Retrato do Zeca Carrara no diálogo ampliado com `setDisplaySize` executado após `setTexture` para evitar herança da escala microscópica do placeholder; usa prévia redimensionada/crop específico para diálogo.

**Validação:** testes funcionais adicionados para mecânica do Sputnik, estágios de upgrade, identidade visual, domo, retrato e cronômetro. Verificação no navegador deve confirmar alinhamento, legibilidade e desempenho, especialmente no Tipo 6 e na mesa de negociações.


### v0.849 — Nave Tipo 2 em sprite 2D animado (20/10/2026)
- Atualizado o inimigo **Tipo 2 — Esquadrão de Formação** com atlas 4×2 de oito quadros (112×112 cada, PNG transparente), baseado na arte original aprovada: fuselagem escura azul-metal e luzes vermelhas.
- **0 a 5:** animação de voo; **6:** avariado/recebendo dano; **7:** destruição animada junto ao burst existente. Mantida rotação progressiva conforme a direção de deslocamento.
- O feedback de impacto apenas acrescenta shake à direção, sem sobrescrever a orientação da nave. Formação, velocidade, HP, colisão, tiros e fallback vetorial permanecem inalterados.
- Arquivo `public/assets/inimigos/tipo2/spritesheet.png`, criado diretamente no GitHub.


### v0.850 — Spritesheet do Tipo 5 (20/10/2026)

O **Tipo 5 — Cruzador-Colmeia**, usado como miniboss e invocador de escoltas, recebe atlas técnico 4×4 com dezesseis quadros (224×128 por quadro), preservando a identidade de metal escuro e núcleos vermelhos da arte original. Fases: voo [0–3], abertura das baias [4–7] durante invocação, quatro níveis visuais de dano [8–11] e destruição [12–15]. A animação não altera HP, colisão, movimento, tempo dos disparos ou limite de minions; continua havendo fallback vetorial caso o spritesheet falhe.


### v0.851 — Correção de cor do Tipo 5
O PNG do Cruzador-Colmeia agora é RGBA verdadeiro em 896×512. O feedback de dano não usa mais tint branco sólido, que estava ocultando a textura original; aplica um flash discreto por opacidade e limpa quaisquer tints residuais. As animações 0–15 e a lógica do inimigo permanecem inalteradas.


### v0.852 — Casco alienígena Tipo 6 em quatro estados (20/10/2026)
- Atlas 4×1, PNG RGBA 3360×280, com quadros de 840×280 do casco original enviado pelo usuário (inteiro, avariado, núcleo exposto e destruído).
- Transições: inicial até 1 módulo destruído; avariado após 2 módulos; núcleo aberto depois de destruídos os 4 módulos; ruínas durante a sequência de vitória.
- Arte é camada de fundo independente: escudo do tipo 6, módulos, núcleo e energia continuam por cima, sem mudança de colisões. Chefes das nações traidoras continuam provisoriamente com cascos vetoriais exclusivos.

### v0.864 — Coreia: globo reforçado e lasers (20/10/2026)
- **Dano total por salva** do globo nos níveis 2/4/6/8: **6 / 12 / 22 / 36** dividido entre 3/6/12/24 reflexos; jamais multiplicar o orçamento pelo número de raios.
- **Uma salva a cada 180 ms por globo; duração de 4 s**. Retirados os arcos altos: reflexos quase retos, em laser roxo/magenta com núcleo branco, brilho no alvo e fade de 155 ms. No máximo oito feixes VISUAIS por salva, mantendo todos os acertos de gameplay.
- Disparos físicos com upgrade coreano usam trilha curta de pulso laser, compatível com efeitos das outras nações e sem alteração de dano, cadência, trajetória ou colisão. As habilidades de laser perfurante continuam inalteradas.
- Esta decisão de implementação substitui o orçamento de dano da v0.862 e o estilo antigo dos reflexos.

### v0.865 — Coreia: restauração dos arcos e som de laser principal (20/10/2026)
- Corrigida a direção visual da v0.864: **reflexos do globo continuam curvos**, com arco quadrático ascendente, várias camadas violeta, miolo claro, arcos menores paralelos e ramificações elétricas breves. Essas descargas são exclusivamente visuais, limitadas a oito feixes por salva, com um objeto gráfico e animação por salva.
- Os feixes tradicionais do Lightstick recebem também duas bordas elétricas oscilantes e discretas durante cada pulso (efeito visual, sem alteração de dano).
- **Tiro principal coreano usa som de laser retrô independente** em lugar da metralhadora comum. Vale com qualquer upgrade coreano ativo, inclusive builds híbridas; na transformação russa, o som de sopro continua prevalecendo.
- Mantidos os limites e orçamentos de dano do globo aprovados na v0.864 (**6/12/22/36 por salva**, cooldown 180 ms), duração de 4 segundos, contagem 3/6/12/24 raios e mecânicas de todos os países.

---

## Atualização canônica de narrativa e personagens — 23/10/2026 (PLANEJAMENTO)

> **Precedência:** decisões aprovadas pelo criador, ainda **não implementadas**. Esta seção substitui referências anteriores incompatíveis a Zeca Carrara, sua convocação, prólogo, Boteco e personagem brasileiro. O nome atual do jogo é **Operação Soberania**. Manter os sistemas aprovados dos demais países e das ondas posteriores; reconciliar numeração/progressão no futuro, sem alterar mecanicamente o jogo agora.

### José Maria — Zé Maria, representante do Brasil

- **Identidade:** José Maria, chamado **Zé Maria**, dono da **Oficina do Zé Maria**; civil, não militar nem convocado. Oficina tradicional e familiar de bairro, célebre por fazer andar Marea, Peugeot 206 e qualquer lata velha; resolve praticamente qualquer problema mecânico. Antigo mecânico de confiança do General.
- **Personalidade:** 48–55 anos, alegria contagiante, prestativo e confiante na própria competência. É contratado para recuperar o Canhão e fica também para proteger a cidade. Aceita propostas estrangeiras de início; só nas ondas finais passa a desconfiar dos representantes. Suas propostas brasileiras são alternativas plenamente válidas.
- **Design permanente:** homem grande, largo, forte, barrigudo; rosto redondo, bochechas cheias, pele marrom escuro quente (base de referência `#985B3A`), olhos castanhos abertos e amigáveis, bigodão espesso. Cabelo afro curto, crespo e **achatado pelo boné**, com volume nas laterais, sem grandes cachos esféricos. Boné verde bastante surrado e amassado (variação visual 16 aprovada).
- **Uniforme:** macacão verde usado, com discretas manchas de graxa, gola aberta, camiseta branca antiga, mangas dobradas até os cotovelos, patch **retangular “ZÉ MARIA”**, botinas marrons gastas, relógio **analógico de ponteiros** com pulseira de couro marrom.
- **Itens invariáveis:** no bolso do peito, uma **chave Phillips** e uma **caneta Bic azul**. Na mão, **chave inglesa ajustável de 12”**, prateada, com mandíbula móvel e rosca de ajuste aparente. Não substituí-la por chave fixa, grifo ou outro instrumento.
- **Improvisação brasileira:** adapta uma coleção de peças automotivas improváveis/incompatíveis. Tem experiência com foguetes e rojões de comemoração de vitórias no futebol, que informa as soluções de armamento brasileiro. Não reduzir o Brasil a alternativa inferior.
- **Arte:** retratos em pixel art JRPG anos 1990/PS1; **todas as cenas narrativas em pixel art**. Consistência rigorosa dos traços e dos acessórios.

### Prólogo revisto: onda 0, Tipo 6 e onda 0.5

1. **Onda 0 — falsa superioridade:** o **mesmo modelo visual de canhão base** opera provisoriamente com cadência extrema e dano muito alto. Inimigos comuns caem com facilidade. No final surge um **Tipo 6**; trata-se do **mesmo chefe que retornará mais tarde**. Seu laser causa sobrecarga e deixa o Canhão **gravemente danificado, não completamente destruído**. Cena obrigatória, não derrota por falha do jogador.
2. **Onda 0.5 — “O Céu Tomado”:** começa **imediatamente** após o laser e dura **15 segundos**. O Canhão mantém somente o tiro básico, **muito lento e fraco**. Grandes grupos de alienígenas **Tipo 1 descem lentamente em massa**, lotando o céu. Não disparam nem causam dano nessa sequência, mas não podem ser todos eliminados. Objetivo é sobreviver, sem punição injusta por batalha impossível. **Ao amanhecer todos fogem simultaneamente para os portais, inexplicavelmente.** Direção sonora: tensão musical crescente e ruptura na fuga; música específica não definida.
3. **Telefonema:** depois da retirada, o General constata os danos e que muitos militares/especialistas morreram na invasão; sem outra equipe de apoio, **liga imediatamente para Zé Maria**, seu antigo mecânico.
4. **Chegada:** Zé Maria chega dirigindo um **caminhão-guincho azul antigo**, mostrado em curta cena de pixel art. O General reage com **alívio imediato**. Piada escolhida de Zé Maria ao ver o Canhão: **“Se eu fiz um Marea andar, faço isso aqui funcionar.”**

### Reconstrução e primeiras escolhas de país

- Zé Maria faz o diagnóstico **ouvindo o mecanismo e dando batidas leves**, identificando o defeito pela experiência.
- A primeira reconstrução é apresentada por **três quadros/cenas sucessivas de pixel art**: diagnóstico, montagem/instalação e teste do disparo. Não transformar a sequência em três quadros simultâneos. Manter estilo em todas as cutscenes.
- **Antes da onda 1:** primeiro conserto instala o **TIRO PRINCIPAL** do país escolhido; opções incluem as peças estrangeiras e a adaptação de veículos e rojões do Zé Maria.
- **Antes da onda 2:** segundo conserto instala o **TIRO ESPECIAL** correspondente à escolha. Estas duas seleções são momentos fundamentais de gameplay e não podem ser omitidas nos menus futuros.
- Os quatro representantes estrangeiros **já estão esperando o General no Boteco**; Zé Maria pode instalar suas peças, mas lembra que possui soluções próprias. Desconfiança mais forte só nas ondas finais.
- **Compatibilidade pendente:** formalizar como a onda 0.5 e as escolhas de tiro principal/especial convivem com a progressão numérica e os upgrades seguintes já documentados. Não assumir modificações automáticas nas dez escolhas por campanha.

### O Boteco e a antiga instalação

- Boteco **diretamente abaixo da área do Canhão**, com acesso por **elevador antigo de carga**.
- É um **boteco carioca simples, tradicional e com vista bonita**, no cenário pixel art **já aprovado e existente**. Preservar o layout, a mesa, a TV CRT, as cadeiras e a composição visual; **não redesenhar como bunker**.
- O Boteco **ocupou parte de uma instalação militar antiga e abandonada**. Motivos originais de sua construção, abandono e reativação ainda não foram definidos.
- É o local das negociações recorrentes com os cinco representantes. Preservar a transição existente planejada entre o combate e a televisão do Boteco, compatibilizando-a com o elevador de carga quando houver storyboard.

### Seu Anselmo — dono do Boteco

- **Seu Anselmo** é um ex-militar aposentado, dono do Boteco e **amigo de longa data de Zé Maria**. Calmo, imperturbável e econômico nas palavras.
- **Na década de 1980**, foi o **responsável pela instalação militar** e participou da defesa do Rio contra **invasões alienígenas anteriores**. Logo, a invasão atual não é a primeira.
- **Finge não saber** da instalação e de sua história porque **quer viver em paz**, não se intrometer e cuidar do Boteco.
- Atua como **coadjuvante**, com comentários curtos entre negociações e **revelações discretas nas ondas finais**. Não roubar a trama dos representantes nem do General.
- **Em aberto:** se ajudará em alguma batalha; o que aconteceu exatamente nos anos 1980, como terminou a invasão anterior e quais equipamentos/segredos permanecem ativos. Não fixar “nunca participa de batalha” como proibição.

### Estado e pendências

**Somente GDD — sem código, assets, novas imagens ou implementação.** Diálogos de exemplo de conversas anteriores são provisórios, exceto a frase aprovada do Marea. Pendem: storyboard completo; parâmetros do canhão forte/lento; integração da onda 0.5; reconciliação do calendário de upgrades; faixa musical; passado completo de Anselmo e finalidade antiga da instalação. Esta seção é fonte de verdade para novas implementações diante de trechos históricos conflitantes no restante do GDD.


---

## Direção de arte canônica dos cinco representantes — 24/10/2026 (PLANEJAMENTO, NÃO IMPLEMENTADO)

> **Precedência visual:** decisões aprovadas pelo criador em 24/10/2026. Esta seção prevalece sobre descrições visuais anteriores incompatíveis, inclusive na seção de 23/10/2026. **Não** altera a história, personalidade, mecânicas ou diálogos aprovados. Nenhum sprite, código ou imagem foi produzido nesta atualização.

### Referência estética comum

- Referência visual escolhida pelo criador: **segunda imagem de teste de Zé Maria**, pixel art de JRPG 16-bit/início da era PS1, pixels grandes e nítidos, contraste forte, detalhes controlados e **dithering discreto** nas sombras. Evitar suavização/blur.
- Personagens de corpo inteiro com proporções de **JRPG clássico, aproximadamente 4–5 cabeças de altura**.
- **Retratos estáticos nos diálogos**; reservar animação de personagens para cutscenes.
- **Um único figurino oficial por personagem durante toda a campanha**.
- Cada personagem terá quatro vistas de corpo inteiro (**frente, costas, esquerda, direita**) e seus gestos característicos; essas vistas não implicam obrigação de ciclos de caminhada.
- Alturas oficiais são referências de escala **entre personagens**, não de tamanho de retrato.

### Fichas físicas, alturas e gestos oficiais

| Representante | Altura real | Porte físico | Gesto/pose característica | Identidade cromática |
| --- | ---: | --- | --- | --- |
| **Zé Maria (Brasil)** | **1,73 m** | Forte, barrigudinho, braços grossos | **Polegar para cima e chave inglesa apoiada no ombro** | Verde |
| **Victor McDollar (EUA)** | **1,94 m** | Muito musculoso, quase um super-herói | **Braços muito abertos**, exibindo grandiosidade | Azul |
| **Kátia Strófika (Rússia)** | **1,80 m** | Muito musculosa, ombros largos; graça de ginasta | **Braços cruzados e olhar severo** | Dourado |
| **Mingda Mai (China)** | **1,59 m** | Pequena e elegante | **Oferecendo uma caixa com um sorriso** | Vermelho |
| **Kim Lin Du (Coreia do Sul)** | **1,79 m** | Magro e atlético, físico de dançarino | **Finger heart** e sorriso ensaiado | Roxo |

**Zé Maria — retrato principal visualmente fechado:** pele marrom-escura, rosto simpático, sorriso largo com dentes à mostra, olhos acolhedores, **afro curto arredondado e crespo visível**, **bigodão grosso curvado nas pontas**, corpo robusto; **macacão verde gasto, aberto no pescoço, com camiseta BEGE por baixo**; chave inglesa prateada na outra mão. O retrato principal usa polegar para cima e ferramenta no ombro. **Estas escolhas posteriores substituem, para a arte padrão, o boné que achatava o afro e a camiseta branca descritos em 23/10/2026.** Manter a profissão civil de mecânico, o conceito de roupa de trabalho e, salvo revisão explícita, a ferramenta como **chave inglesa ajustável de 12 polegadas**, além dos acessórios menores anteriormente aprovados que couberem no enquadramento. Não retomar a aparência obsoleta de Zeca Carrara.

**Demais figurinos e direção:** Victor com visual de showman americano, cabelo louro volumoso, terno azul-marinho, gravata vermelha e sorriso confiante (óculos escuros conforme a versão visual aprovada); Kátia com uniforme militar de inverno, medalhas esportivas no pescoço e expressão disciplinada; Mingda com identidade visual comercial vermelha/dourada e sorriso de negociadora; Kim com roupa branca inspirada em idol, acentos roxos e visual de estrela de K-pop. Refinamentos de silhueta devem preservar as diferenças de porte físico aprovadas acima.

### Atuação facial aprovada

- **Zé Maria:** expressões calorosas, naturais e espontâneas.
- **Victor:** expressões extremamente teatrais e exageradas.
- **Kátia:** séria, mas com emoções claramente legíveis.
- **Mingda:** muito expressiva e energética.
- **Kim:** duas faces na interpretação geral — idol em público, ambicioso em privado; **a expressão exclusiva escolhida NÃO é “máscara caída”**.

### Pacote de 12 expressões por representante

**Onze categorias comuns**, na ordem fixa:
1. Neutro
2. Feliz
3. Gargalhando
4. Surpreso
5. Preocupado
6. Irritado
7. Desconfiado
8. Convencido
9. Triste
10. Assustado
11. Determinado

**Quadro 12 — exclusivo:**
- **Zé Maria:** **Decepcionado**, tristeza sincera, sorriso desaparece, olhar abatido.
- **Victor:** **Grandioso**, triunfo teatral, sorriso monumental e braços abertos.
- **Kátia:** **Desprezo glacial**, superioridade silenciosa, olhar cortante e mínimo sorriso de desdém.
- **Mingda:** **Oferta irrecusável**, entusiasmo comercial, olhos brilhantes e sorriso expansivo.
- **Kim:** **Estrela absoluta**, êxtase durante o show, sorriso radiante e entusiasmo de palco.

Total: **5 × 12 = 60 retratos** (**55 de categorias compartilhadas + 5 exclusivos**). As categorias compartilhadas têm a mesma função narrativa, mas interpretação visual específica de cada personalidade.

### Especificação técnica dos retratos e spritesheets

- **Quadro individual:** **256 × 256 px**, enquadramento **do peito para cima**.
- **Fundo:** **cor sólida do país correspondente**, não fundo transparente, conforme decisão explícita. Identidade: Brasil verde, EUA azul, Rússia dourado, China vermelho, Coreia do Sul roxo. **Valores HEX exatos ainda não foram aprovados**; cores apresentadas em protótipos são referências.
- **Uma spritesheet por personagem**: **4 colunas × 3 linhas**, **1024 × 768 px**, com os 12 retratos dispostos da esquerda para a direita e de cima para baixo na ordem 1–12 acima. Última célula: expressão exclusiva.
- Estilo de pixel art: pixels nítidos e sombreamento com dithering discreto; manter consistência de luz, escala do rosto, figurino e enquadramento entre as 12 células e os cinco personagens.

### Escala aprovada dos sprites de corpo inteiro

**Zé Maria = 64 px de altura.** Demais alturas proporcionais a seus valores oficiais, com arredondamento para pixels inteiros:

`altura_sprite = arredondar(64 × altura_real_cm / 173)`

| Personagem | Altura do sprite |
| --- | ---: |
| Zé Maria | **64 px** |
| Victor | **72 px** |
| Kátia | **67 px** |
| Mingda | **59 px** |
| Kim | **66 px** |

Essas alturas são alvos para o **personagem desenhado**, não necessariamente dimensões fixas do canvas, que pode ter margem para cabelo, ferramentas, adereços ou gestos. O enquadramento e a escala devem manter a leitura das diferenças reais.

### Estado

**Aprovado apenas no GDD como planejamento.** Nenhuma arte final, spritesheet, código ou integração foi gerada. A direção de arte está pronta para orientar produção futura, que exige autorização específica.


### Kátia Strófika — personalidade, passado esportivo e relações (24/10/2026; aprovado, planejamento)

- **Identidade:** além de comandante russa austera, Kátia é uma **ex-atleta multiesportiva extremamente premiada**, obcecada por vencer. Foi campeã de uma quantidade deliberadamente absurda de modalidades incompatíveis entre si, particularmente **força, resistência e dança**, incluindo **ginástica artística**. Outros títulos podem ser revelados gradativamente em diálogos; evitar fixar uma contagem total de medalhas.
- **Físico:** **muito musculosa**, ombros largos, braços fortes de halterofilista e presença intimidadora, **sem perder graça, equilíbrio, flexibilidade e precisão de ginasta**. Sua postura é disciplinada, mas sua movimentação pode ser inesperadamente elegante e acrobática. Esta definição **refina e prevalece** sobre a descrição anterior “atlética, ombros fortes” da tabela de proporções; manter altura oficial de **1,80 m**, uniforme militar de inverno, trança loira, gorro de inverno, expressão severa e identidade cromática dourada.
- **Medalhas:** usa **medalhas esportivas visivelmente penduradas no pescoço mesmo durante a guerra**. São distintas de condecorações militares e devem ser legíveis no retrato, sem esconder completamente o uniforme. O excesso de medalhas pode ser tratado com humor.
- **Competitividade:** despreza empates e vitórias morais; quer **derrotar completamente o adversário** e ganhar a qualquer custo no sentido de buscar superioridade total na competição e na guerra. Isso **não estabelece** disposição de sacrificar aliados (alternativa não escolhida). Enxerga ondas, batalhas e desafios como provas de recorde. Converte **qualquer conversa** em comparação de tempos, títulos, marcas pessoais e resultados esportivos.
- **Humor:** fala com seriedade e secura mesmo ao citar conquistas esportivas improváveis. Não precisa fazer piadas de propósito; a comicidade decorre de medir todas as situações com a régua dos recordes. Continua exigente, mas reconhece mérito autêntico.
- **Relação com Zé Maria:** respeita sua **força física real, adquirida no trabalho**, sua competência como mecânico e a capacidade de **instalar, consertar e manter o canhão**, mesmo improvisando ferramentas e soluções em condições difíceis. Pode compará-lo a um atleta de força que nunca treinou profissionalmente.
- **Relação com o protagonista/jogador:** inicialmente o considera amador ou tecnicamente inferior, mas passa a admirá-lo por **nunca desistir**, continuar combatendo após dificuldades e insistir em defender a cidade até o fim. Elogios são **raros, diretos e sinceros**; reconhece na perseverança outra forma de força. Seu respeito pela determinação não elimina sua obsessão por ganhar.
- **Exemplos de tom (não necessariamente falas finais):** “Sobreviver é medalha de participação.”; “Você não é o mais forte. Não é o mais rápido. Mas nunca desiste. Isso eu respeito.”; ao saber que Zé Maria montou o canhão com ferramentas de oficina, elogia sua força e sugere levantamento de peso.

### Terminologia canônica do armamento (24/10/2026)

- O equipamento de defesa controlado pelo jogador chama-se **canhão** em toda a narrativa, diálogos, UI e documentação, **não obuseiro**. A confirmação do criador substitui denominações anteriores. Zé Maria instala e repara o **canhão**. Corrigir textos antigos na futura revisão/implementação; este registro documental não implica edição automática dos arquivos de jogo nem alteração de identificadores técnicos internos.


### Mingda Mai — personalidade, relações e traição (24/10/2026; aprovado, planejamento)

> **Precedência:** estas escolhas do criador consolidam a personagem e sua motivação; são canônicas para a próxima revisão narrativa, mas **não** autorizam implementação de cenas, diálogos, arte ou código. A cena de exemplo abaixo é orientação de tom, não roteiro final.

- **Origem:** começou vendendo produtos baratos em uma pequena banca e construiu, com talento comercial, um vasto império de comércio e logística. Conserva a energia de vendedora de rua: rápida, comunicativa, sorridente, persuasiva e sempre pronta a oferecer algo.
- **Ética e afeto:** é oportunista e gosta de levar vantagem, mas tem limites com os amigos; presta **favores enormes** e depois disfarça a generosidade dizendo que tudo foi apenas um **investimento**. Desenvolve afeição quase familiar pelo grupo, mas isso **não impede nem cancela sua traição**.
- **Humor:** oferece produtos e descontos nos momentos mais inadequados, inclusive durante batalhas e revelações dramáticas. **Detesta desperdício** de qualquer recurso, inclusive sucata e tecnologia alienígena; ver recursos valiosos desperdiçados é o que a faz perder o sorriso.
- **Objeto de bolso:** leva uma **calculadora** que saca inesperadamente para estimar preços, descontos, perdas e possibilidades de lucro.
- **Relação com Zé Maria:** admira suas soluções técnicas e tenta contratá-lo repetidamente, chegando a cogitar comprar sua oficina. Pode oferecer-lhe cargo na indústria que pretende instalar.
- **Relação com o protagonista:** quer torná-lo seu **garoto-propaganda** e explorar comercialmente suas vitórias; o afeto e os favores são reais, mas não substituem sua ambição.
- **Objetivo de conquista:** pretende **dominar o Brasil e transformá-lo em uma gigantesca loja e plataforma de fabricação e distribuição de eletrônicos**, explorando os recursos **minerais e energéticos** brasileiros como insumos para seus produtos. Na sua lógica empresarial, trata a invasão como “aquisição”, “reestruturação” ou “expansão operacional”, não como uma agressão.
- **Regra geral de campanha:** **todos os representantes estrangeiros traem o jogador**; nenhum desiste da tentativa de dominar o Brasil por causa da amizade. Mingda é exemplar dessa contradição: gosta sinceramente do grupo, mas permanece decidida a conquistar o país.
- **Acessório visual e revelação:** sua decoração de cabelo vermelha/dourada **esconde uma adaga**. O ornamento está presente desde as primeiras aparições, parecendo apenas decorativo. **No momento da traição**, ela o retira, revela a lâmina e **aponta simbolicamente para o jogador**; não foi aprovada uma luta corpo a corpo com a adaga.
- **Entrada da traição:** apresenta **um contrato de aquisição do Brasil** e anuncia a invasão como simples formalidade contratual. Continua **alegre e oferecendo produtos e descontos como se nada tivesse mudado**, inclusive com a adaga em mãos.
- **Derrota:** sua reação principal é **reclamar do prejuízo financeiro**: frota, investimentos, estoque e infraestrutura perdidos. Não alterar essa reação para discurso de arrependimento ou desistência do comércio.
- **Tom de diálogo ilustrativo, ainda não aprovado palavra por palavra:** Zé Maria protesta que ninguém concordou com a aquisição; Mingda descreve isso como “pequeno detalhe contratual”, aponta a adaga e apresenta as tropas como sua “equipe de negociação”. Após perder, lamenta os investimentos destruídos.


## Regra permanente de manutenção do GDD — 24/10/2026

**Instrução explícita do criador para todo o projeto:** toda decisão tomada/aprovada durante as conversas de Operação Soberania deve ser registrada no GDD **tanto no GitHub quanto no Google Drive**, sem depender de um pedido adicional para “implementar no GDD”. Registrar decisão, data, contexto, precedência sobre versões conflitantes e situação (planejamento versus implementado). Não confundir atualização documental com autorização para implementar sprites, textos jogáveis ou código. Manter ambos sincronizados em cada rodada de decisões; se uma das gravações falhar, comunicar claramente a divergência e não alegar sincronização.

## Victor McDollar — identidade e traição aprovadas — 24/10/2026 (SOMENTE PLANEJAMENTO)

- **Histórico:** ex-apresentador de televisão que chegou ao poder por carisma e autopromoção. Sabe que exagera; considera propaganda e controle da narrativa instrumentos deliberados de poder.
- **Personalidade e humor:** declara que tudo que faz é “o maior”, “o melhor” ou “o mais importante da história”; discurso espalhafatoso, autoconfiança teatral e sorrisos públicos. Jamais precisa reconhecer uma derrota como derrota.
- **Relação com Zé Maria:** considera o mecânico seu **melhor amigo**, embora Zé Maria não concorde. Diz que ele é o **melhor mecânico do mundo** e quer levá-lo aos Estados Unidos para construir **a maior e melhor oficina**, possivelmente com o nome McDollar.
- **Relação com o protagonista:** gosta dele porque acredita que foi o próprio Victor quem o transformou em herói; elogia o jogador apropriando-se de parte do crédito por suas vitórias.
- **Motivação da conquista:** tomar o Brasil para construir **o maior muro do mundo** ao redor do país e transformá-lo numa fortaleza americana, além de usar **recursos minerais e energéticos brasileiros para enriquecer os EUA**. A promessa de muro total é **obsessão verbal**, sem projeto real coerente; isso não cancela o especial americano **Grande Muro** (escudo mecânico de 120°).
- **Revelação da traição:** oferece ao protagonista **um cargo em seu governo**; quando o jogador recusa, **ordena a invasão**. Continua **sorridente** e vende a operação como uma **oportunidade histórica**.
- **Derrota:** proclama que **venceu moralmente** e exige **uma cerimônia de premiação**. Não usar, como conclusão canônica, a alternativa de retirada estratégica.
- **Orientação de fala, não roteiro final:** elogios grandiosos, linguagem de propaganda, promessas contraditórias sobre o muro, convites à oficina, inversão oportunista de qualquer revés em vitória moral.
- **Status:** decisões documentadas; **não implementar** cenas, retratos, diálogos finais ou código sem autorização própria.


## Kim Lin Du — personalidade, origem e motivação (24/10/2026; APROVADO, SOMENTE PLANEJAMENTO)

> Estas decisões do criador são canônicas e prevalecem sobre alternativas incompatíveis de planejamento. Não implementar automaticamente arte, cenas, textos jogáveis ou código. A encenação exata da traição e a reação à derrota ainda não foram aprovadas.

- **Dupla carreira:** Kim **continua sendo líder de um grupo de K-pop em atividade**. Não é ex-idol. Por ter atingido a idade de cumprir o serviço militar obrigatório, entrou no exército. Sua obsessão por liderar, performar e ter sucesso o fez ascender até o posto de **general do BTS — Batalhão Tático de Seul**, sigla deliberadamente cômica dentro do universo fictício do jogo. Veio ao Brasil com suas forças para ajudar a combater a invasão alienígena.
- **Personalidade privada:** perfeccionista **exausto**, incapaz de parar de trabalhar, treinar ou ensaiar, mesmo longe das câmeras. É obcecado pela qualidade de suas apresentações e por exercer liderança.
- **Personalidade pública e humor:** demonstra carinho pelos fãs, mas **transforma operações militares em shows**, exigindo coreografias, entradas triunfais, ritmo, teatralidade e espetáculo. Faz comentários frequentes sobre como deixar **o canhão** mais bonito, interessante ou visualmente impressionante. A teatralidade não cancela sua competência militar nem seu cansaço pessoal.
- **Relação com Zé Maria:** adora a autenticidade do mecânico; afirma que Zé Maria seria ótimo integrante de um grupo e insiste em **transformá-lo num astro do K-pop**.
- **Relação com o protagonista:** trata o jogador como **parceiro de palco**, quer ensiná-lo a se apresentar e acredita que ele precisa **aprender a gostar mais dos palcos**.
- **Objetivo de conquista e traição:** Kim pretende dominar o Brasil para **explorar seus recursos e minérios**, impulsionando a indústria sul-coreana de **K-pop, tecnologia, maquinaria de palco, shows e espetáculos**. Quer fortalecer o império tecnológico-musical da Coreia, com mais equipamentos e máquinas para apresentações. **A regra geral da campanha permanece: Kim, como todos os líderes estrangeiros, trairá o jogador; amizade não cancela a conquista.** Forma específica de anúncio da traição e fala de derrota: **a definir**.
- **Visual anterior preservado:** homem jovem de **1,79 m**, magro e atlético (físico de dançarino), figurino branco inspirado em idol com detalhes roxos, sorriso ensaiado, gesto de **finger heart**, estética de espetáculo e laser. Direção artística retro JRPG em pixel art aprovada para os cinco líderes permanece vigente.


### Kim Lin Du — traição e confronto (24/10/2026; DECISÕES APROVADAS, SOMENTE PLANEJAMENTO)

- **Anúncio da traição:** Kim **convida o protagonista a subir ao palco** e anuncia que **os dois governarão o Brasil**. Isso é a oferta de Kim, não uma aceitação do protagonista. A traição estrangeira permanece inevitável, conforme a regra geral da campanha.
- **Justificativa para conquistar o Brasil:** afirma que a conquista é necessária para **financiar a próxima geração de tecnologia musical coreana**, usando os recursos brasileiros em benefício do império de K-pop e tecnologia da Coreia, já estabelecido.
- **Atitude:** durante a revelação e o ataque continua **sorridente, encantador e teatral**, tratando toda a batalha como uma apresentação. Não adotar a opção de revelar um comandante frio que abandona a persona pública.
- **Proposta para Zé Maria:** anuncia que Zé Maria será **diretor técnico de todos os palcos do novo império**, coerente com sua admiração pelo mecânico e com a tentativa de recrutá-lo ao K-pop.
- **Identidade do confronto:** um **concerto militar**, com **luzes, lasers e coreografias sincronizadas**. A apresentação audiovisual deve aproveitar as mecânicas coreanas já aprovadas, **sem alterá-las por esta decisão documental**.
- **Reação à derrota:** **exige repetir a batalha**, afirmando que **a coreografia saiu errada**. A indignação se concentra na execução imperfeita do espetáculo, coerente com seu perfeccionismo.
- **Status:** seis decisões canônicas de narrativa; **planejamento apenas**. Falas exemplificativas não equivalem a diálogos finais aprovados. Nenhum sprite, cena jogável ou código autorizado por esta seção.


### Kátia Strófika — traição, objetivos e derrota (24/10/2026; APROVADO, SOMENTE PLANEJAMENTO)

- **Motivação principal:** quer provar que consegue **conquistar um país inteiro**, estabelecendo um recorde impossível. **Principalmente, deseja que os melhores atletas brasileiros passem a ser da Rússia, com foco especial nos jogadores de futebol**. A apropriação do talento esportivo brasileiro é objetivo central, não detalhe secundário; não substituir pelo plano de exploração mineral/militar oferecido como outra alternativa.
- **Revelação da traição:** **desafia o protagonista para uma competição final valendo o controle do Brasil**. A amizade e o respeito que desenvolveu pelo jogador não impedem a traição.
- **Atitude no conflito:** trata o protagonista como **adversário digno** e exige que dê tudo de si, mantendo o espírito competitivo e o reconhecimento pela perseverança do jogador.
- **Zé Maria:** tenta convencê-lo a **abandonar o Brasil**, alegando que **um homem forte merece estar do lado dos vencedores**; isso coexiste com o respeito por sua força física e habilidade mecânica.
- **Identidade do confronto aprovada como direção narrativa:** **competição militar, com placar de recordes e contagem regressiva**. Preservar as regras de combate existentes até autorização específica de implementação.
- **Ideia adicional explicitamente adiada para o fim das prioridades:** explorar **um placar de pontos e/ou mecânicas esportivas** na batalha contra Kátia. É um **conceito em aberto, não mecânica aprovada detalhadamente**; deixar como último item de desenvolvimento, sem implementar ou fixar pontuação, regras ou equilíbrio agora.
- **Reação à derrota:** **aceita a derrota com dignidade e entrega simbolicamente uma medalha ao protagonista**. Não insistir em revanche imediata na versão canônica desta cena.
- **Status:** decisões canônicas de planejamento. As falas e a encenação exatas ainda dependerão de roteiro; nenhum código, sprite ou sistema de pontos deve ser alterado por este registro.


## Seu Nelson — identidade definitiva, visual e revelação final (24/10/2026; APROVADO, SOMENTE PLANEJAMENTO)

> **Precedência:** **Seu Nelson** substitui **Seu Anselmo** como identidade atual do dono do Boteco. Não é Zé Maria, que permanece o mecânico brasileiro. Reaproveita a inspiração visual da antiga versão de Zeca Carrara sem retomar esse nome/personagem. Descrições antigas incompatíveis são históricas. A revelação do fim não deve ser antecipada em diálogos comuns.

- **Nome definitivo:** **Seu Nelson**, apenas; não adotar sobrenome Carrara nem conservar Anselmo como nome oficial.
- **Visual canônico de referência:** **terceira imagem** da rodada de quatro conceitos visuais de Seu Nelson aprovada pelo criador. Estilo pixel art JRPG 16-bit/início PS1 compatível com os demais. Homem mais velho, cabelos escuros/grisalhos penteados para trás, bigode marcante, blazer bege, camisa estampada retrô, corrente dourada, acessórios elegantes e pequeno distintivo/condecoração militar. Aparência de malandro/bicheiro carioca charmoso com indícios de passado militar e forte senso de justiça. A imagem é referência de conceito, não sprite final implementado.
- **Função na campanha:** **dono do Boteco e conselheiro experiente**. Não ampliar automaticamente para articulador de rede criminosa, operador militar estratégico ou combatente.
- **Personalidade cotidiana:** **calmo, irônico e econômico nas palavras**. Não perde a tranquilidade diante de acontecimentos absurdos; preserva senso de justiça e lealdade aos moradores.
- **Participação na guerra atual:** **não luta mais e ajuda apenas com conselhos**. Não prever seu retorno a combate nem participação direta como mecânica sem decisão posterior.
- **Relação e antecedentes preservados:** amigo de longa data de **Zé Maria**; veterano de acontecimentos alienígenas dos anos **1980**, ligado a uma instalação militar. Seu passado deve ser revelado de modo contido; a nova decisão de revelação final prevalece sobre insinuações que revelem cedo demais o segredo central.
- **Grande revelação em um confronto de final definitivo contra os alienígenas:** quando o **Alien Supremo** se revela, ele **reconhece Seu Nelson como alguém que já o ajudou no passado em uma batalha contra outros inimigos do espaço**. Trata-se de relação surpreendente entre os dois, que recontextualiza o passado do veterano. **Não estabelecer ainda** como, por que, onde, em que termos se deu a ajuda ou quem eram os outros inimigos: esses detalhes seguem abertos. A revelação não significa que Seu Nelson retorne ao combate atualmente.
- **Status:** somente planejamento aprovado; não houve alteração de cenas, diálogos finais, arte, sprites ou código.


## Boteco — apresentações, relações e cenas coletivas (24/10/2026; APROVADO, SOMENTE PLANEJAMENTO)

> Decisões explícitas do criador. Prevalecem sobre orientações anteriores incompatíveis para a estrutura narrativa do Boteco, mas não mudam automaticamente o fluxo de upgrades nem autorizam programação. Cenas e falas exatas continuam pendentes de roteiro.

1. **Estrutura híbrida:** preservar **negociações individuais** com os representantes e acrescentar **pequenas conversas coletivas ocasionais**. A prioridade dramática inicial são **as apresentações dos personagens**: **cada personagem deve aparecer com retrato de corpo inteiro e ter uma pequena cena própria de apresentação**, distinguível das negociações comuns. Respeitar a direção visual canônica de corpo inteiro; isso não substitui os retratos de diálogo 256×256 já aprovados, usados em outros contextos.
2. **Evolução dos vínculos:** as amizades crescem **gradualmente ao longo das ondas**, com elogios, confiança e provocações progressivamente mais pessoais. Evitar uma virada abrupta de intimidade e preservar a regra de que **todos os representantes estrangeiros traem o jogador** independentemente do afeto acumulado.
3. **Tom:** **humor frequente**, derivado das personalidades, alternado com **momentos sinceros e dramáticos**. Evitar transformar toda fala em piada ou interromper excessivamente cenas emocionais.
4. **Seu Nelson:** permanece **quase sempre calado** nas conversas coletivas e **solta uma frase breve e certeira ao final**. Preservar sua ironia, economia de palavras e o segredo sobre a ligação antiga com o Alien Supremo.
5. **Antecipação das traições:** utilizar **pistas pequenas, ambíguas e discretas**, reconhecíveis sobretudo em uma **segunda campanha**. Não revelar explicitamente os planos de conquista durante as apresentações ou as conversas ordinárias.
6. **Frequência das interações:** além das negociações, haverá **uma cena coletiva após cada onda**, com diálogos e composição adequados ao ritmo. Essas cenas podem ser curtas, mesmo que o volume total de diálogos seja maior. A opção de poucas cenas extras não é a escolhida.

**Pendências de criação, não decisões adicionais:** roteirizar as cenas de apresentação individuais e a progressão das cenas coletivas onda a onda; ajustar duração, transições, posicionamento dos retratos de corpo inteiro e convivência com a UX do Boteco já existente. **Nenhum sprite, diálogo jogável ou código foi implementado por este registro.**

## Nova abertura — condução do protagonista ao canhão via Boteco (24/10/2026; APROVADO, SOMENTE PLANEJAMENTO)

> **Precedência narrativa:** esta decisão do criador define a ordem espacial e dramática imediatamente anterior à onda 0. Substitui versões anteriores incompatíveis nas quais o jogador chega diretamente ao canhão ou visita o Boteco somente depois da primeira batalha. Não altera automaticamente as mecânicas, o balanceamento ou o código.

1. **Convocação e busca:** no começo da história, **alguém do governo vai buscar pessoalmente o protagonista**, para conduzi-lo ao posto de defesa. Sua identidade, cargo, veículo e falas ainda estão em aberto.
2. **Destino real:** o ponto de acesso ao canhão é **o Boteco do Seu Nelson**, e não uma base militar convencional. O protagonista é levado até lá pelo representante do governo.
3. **Chegada ao Boteco:** a primeira entrada no estabelecimento ocorre antes da primeira batalha. **Seu Nelson** é o dono do local; o encontro inicial pode ser breve, sem transformar a chegada numa rodada de upgrades ou nas apresentações completas dos representantes estrangeiros.
4. **Elevador:** depois da chegada, **o protagonista sobe pelo elevador do Boteco até a posição do canhão**.
5. **Revelação do canhão:** ao sair do elevador, o jogador vê o **canhão** e sua posição defensiva pela primeira vez.
6. **Início da ação:** **só então começa a onda 0**, com a transição e contagem em ordem correta; não permitir que inimigos apareçam ou o jogador dispare antes do começo efetivo da onda.

**Compatibilidade com decisões anteriores:** a abertura em apartamento simples no Rio, o laptop e e-mail de convocação e as notícias de TV podem anteceder a busca do representante do governo. A sequência específica deve ser ajustada no roteiro, sem eliminar esses elementos por inferência. As cenas individuais de apresentação com retratos de corpo inteiro e as negociações permanecem planejadas para visitas adequadas ao Boteco, não necessariamente para essa breve passagem inicial. O que acontece depois da onda 0 (inclusive reparos/onda 0.5 conforme versões canônicas) não é alterado nesta decisão.

**Status:** planejamento aprovado. Não houve implementação de roteiro jogável, cutscene, elevador, sprites ou código.



## Direção de arte — retratos e Victor McDollar (24/10/2026; APROVADO)

- **Referência visual atual:** a última prancha conjunta de seis personagens aprovada pelo criador (Seu Nelson, Zé Maria, Victor McDollar, Kátia Strófika, Mingda Mai e Kim Lin Du). Preservar a pixel art de JRPG 16-bit/início PS1, pixels legíveis e nítidos, sombreamento controlado e consistência entre rostos, proporções, figurinos e expressões. Esta aprovação atual prevalece sobre testes de estilo anteriores incompatíveis.
- **Ajuste global de paleta:** manter exatamente essa linguagem de pixel art, mas usar **cores ligeiramente mais vivas e variadas**, sem perder contraste, leitura nem a identidade cromática de cada país. Não transformar em pintura lisa, arte vetorial ou imagem suavizada.
- **Victor McDollar — expressão canônica:** deve parecer **sempre extremamente satisfeito e autoconfiante**, com **sorriso largo mostrando dentes muito brancos**. O sorriso é característica visual permanente, inclusive nas variações emocionais; modular olhos e sobrancelhas sem convertê-lo num personagem habitualmente sisudo. Preservar cabelo louro volumoso, óculos escuros quando aplicáveis, terno azul-marinho, gravata vermelha, porte imponente e teatralidade.
- **Aplicação:** seguir essas regras em novos retratos, spritesheets, apresentações de corpo inteiro, telas do Boteco e futuras variantes. Preservar as referências individuais aprovadas, sobretudo Zé Maria e Seu Nelson; não reintroduzir personagens removidos.


## Kátia Strófika — figurino esportivo-militar de inverno (24/10/2026; APROVADO)

> **Precedência:** estas quatro decisões substituem representações visuais anteriores incompatíveis, em especial as de braços ou abdômen expostos. Preservar sua identidade de comandante russa, ex-atleta multiesportiva extremamente premiada e orgulhosa da própria musculatura.

1. **Silhueta e cobertura (C):** uniforme militar **ajustado ao corpo**, valorizando ombros largos, braços fortes, tríceps e musculatura de atleta **sem expor a pele**. O físico deve ser legível pelo corte, volume e tensão do tecido; não usar barriga ou braços descobertos como visual padrão.
2. **Camada interna (A):** **top esportivo com estrela e cores militares**, usado **por baixo** da jaqueta, sem contrariar a cobertura do uniforme externo. Poderá aparecer apenas nos detalhes do colarinho ou numa abertura discreta que não exponha o torso, preservando a escolha C.
3. **Gestos e atuação (A + comentário):** Kátia **flexiona o bíceps frequentemente**, inclusive no meio de conversas sérias; **cruza os braços evidenciando os tríceps**; nas vitórias faz **poses de fisiculturista** com orgulho genuíno. Essas atitudes combinam com sua competitividade e disciplina, sem mudar seu temperamento austero.
4. **Elemento de inverno (C):** **jaqueta esportiva de inverno com insígnias militares e medalhas esportivas visíveis**, preferencialmente com **listras esportivas paralelas nas mangas**, evocando o visual clássico de agasalhos de treinamento como os da Adidas **sem exigir logotipo ou marca real**. A jaqueta deve manter a musculatura evidente e funcionar com seu gorro, trança loira e demais traços oficiais.
5. **Direção geral:** unir **treinamento esportivo, militarismo e inverno russo** numa única roupa oficial. Paleta dourada da Rússia preservada com contrastes frios e detalhes militares. Estilo pixel art JRPG 16-bit/início PS1, pixels nítidos, sombreamento controlado e cores mais vivas conforme a direção coletiva aprovada. Evitar figurinos distintos entre expressões.
6. **Aplicação:** novo padrão para retratos, expressões, poses de corpo inteiro, apresentações e futuras cenas. Não alterar o jogo nem os sprites atuais apenas por este registro de planejamento.


## Kátia Strófika — referência visual final aprovada (24/10/2026)

**Decisão final de direção artística:** o criador aprovou a versão refinada **sem capa** como visual oficial de Kátia, e aprovou também a **pose agachada estilo gopnik** como referência característica. Essas imagens recentes têm precedência sobre as propostas anteriores A/B/C/D onde houver conflito.

- **Figurino padrão:** jaqueta/uniforme esportivo-militar de inverno roxo-escuro, muito ajustado à musculatura; listras brancas paralelas nas mangas e calças; gola de pele clara; ombreiras e detalhes dourados; botões, insígnias, estrela vermelha e medalhas esportivas. **Sem capa.** Luvas, gorro de pele escuro com estrela, cabelo loiro e botas robustas. Pele dos braços e abdômen coberta na roupa padrão.
- **Silhueta:** atleta extremamente musculosa com ombros amplos, bíceps e tríceps grandes e postura muito orgulhosa, transmitidos mesmo através do uniforme. Rosto confiante, belo, severo e levemente desdenhoso.
- **Pose de referência adicional:** agachamento profundo **gopnik/slav squat**, pés firmes no chão, joelhos abertos, cotovelos ou mãos apoiados próximos aos joelhos; expressão confiante e descontraída, mantendo todas as peças do figurino padrão. Usar como pose expressiva/cinematográfica, **não** como obrigação de animação de caminhada.
- **Outras poses:** flexionar bíceps, cruzar braços salientando tríceps; poses de fisiculturismo ao vencer. **Ideia reservada para o futuro, não visual padrão:** numa cena de vitória ela poderá tirar o casaco para mostrar a musculatura, mediante definição posterior.
- **Linguagem visual:** pixel art JRPG 16-bit/início da era PS1 já aprovada para o elenco, cores vibrantes, pixels nítidos, contraste forte e acabamento consistente. Manter o mesmo rosto, cabelo, gorro, traje e acessórios em todas as variantes.
- **Referências de imagens:** (1) retrato de Kátia refinado sem capa, gerado na conversa em 24/10/2026; (2) imagem de Kátia agachada em pose gopnik gerada logo depois. Essas são as referências visuais principais para reproduções futuras; não reinterpretar livremente o figurino.


## Padrão canônico de spritesheets — 16 expressões e separação obrigatória (24/10/2026; APROVADO)

> **Precedência:** a decisão expressa de **16 expressões por personagem** substitui o pacote anterior de 12 expressões e sua grade 4×3. Esta seção estabelece também uma regra **global**, válida para TODAS as futuras spritesheets do projeto (personagens, inimigos, efeitos, elementos mecânicos e outros), sem redesenhar retroativamente assets existentes.

### Retratos de personagens: matriz 4×4

- **16 expressões por personagem** em **4 colunas × 4 linhas**, indexadas em ordem de leitura (esquerda→direita, cima→baixo).
- Preservar as 12 categorias já aprovadas na mesma ordem: **01 neutro; 02 feliz; 03 gargalhando; 04 surpreso; 05 preocupado; 06 irritado; 07 desconfiado; 08 convencido; 09 triste; 10 assustado; 11 determinado; 12 exclusivo A** (Zé Maria: decepcionado; Victor: grandioso; Kátia: desprezo glacial; Mingda: oferta irrecusável; Kim: estrela absoluta).
- Acrescentar: **13 orgulhoso; 14 envergonhado; 15 pensativo; 16 exclusivo B**, interpretados de forma coerente com cada personalidade. Expressão 16 exclusiva B e a interpretação específica das novas expressões podem ser refinadas individualmente mais tarde; não considerá-las figurinos diferentes.
- **Quadro de conteúdo nominal: 256×256 px por expressão**. Para reservar separação entre quadros, adotar inicialmente **gutter de 16 px** e **margens externas de 16 px**; sprites completos não podem invadir essas áreas. Dimensões propostas do atlas final: **1104×1104 px** (4×256 + 3×16 + 2×16). Cada retrato pode ser recortado em retângulo 256×256 sem sobreposição. A textura individual mantém pixels nítidos e proporções consistentes.
- Regra de fundo dos retratos: cor sólida da identidade nacional aprovada, com separação física visível entre células na folha de produção; não acrescentar linhas, textos ou molduras dentro dos recortes de 256×256. O espaçamento pode ficar transparente para facilitar extração e evitar vazamento de pixels.
- Seu Nelson usa o mesmo padrão técnico se receber spritesheet de expressões; suas categorias específicas podem ser aprovadas separadamente.

### Regra global de atlas (todos os spritesheets novos)

1. **Sempre deixar área livre entre sprites/células**: nenhum cabelo, arma, partícula, sombra, pose ou acessório pode encostar ou atravessar a área reservada do quadro vizinho. Nunca gerar personagens colados uns aos outros.
2. **Células de recorte uniformes e retangulares**, com origem e dimensões documentadas. Em cada atlas, definir formalmente: largura e altura da célula, número de colunas/linhas, margem externa e gutter horizontal/vertical; manter os valores constantes ao longo daquela folha.
3. **Gutter padrão de partida: 16 px; margem externa: 16 px** para atlas de retratos de 256 px; em sprites menores, ajustar proporcionalmente mantendo no mínimo uma faixa livre de pixels visível (e registrá-la no manifest). Os 16 px NÃO são obrigatórios para sprites minúsculos.
4. **Fundo do intervalo preferencialmente transparente**, com fundo/arte limitada à célula. Não inserir rótulos na própria área dos sprites. Exportar PNG sem interpolação/blur.
5. **Metadados de importação:** quando integrar via Phaser, configurar corte por coordenadas de célula com margin/spacing compatíveis (ou atlas JSON explícito); **não** presumir que uma folha com gutter possa ser dividida diretamente sem considerar margens. Verificar a extração da primeira e última célula.
6. **Integridade visual:** manter a mesma escala, centro do rosto, altura dos olhos, luz, figurino e tamanho de pixel em todas as expressões de um mesmo personagem. Variar emoção e gesto, não identidade.

**Status:** especificação de produção aprovada. Nenhuma spritesheet binária ou código foi alterado por esta decisão.


## Moldura de retrato de Kátia — dourado (24/10/2026; APROVADO E IMPLEMENTADO)

- **Decisão:** moldura **dourada**, padrão fixo, para a representante russa Kátia Strófika no Boteco, tanto no retrato de seleção quanto no retrato exibido durante diálogos. Cor de referência da implementação: `#E3B94E` (`0xE3B94E`).
- A borda dourada expressa a identidade cromática nacional da Rússia e se distingue do uniforme roxo-escuro, das medalhas e dos demais personagens. A decisão é sobre **a moldura do retrato**, não recolorização do figurino ou alteração do conteúdo dos 16 quadros.
- **Código:** `src/scenes/UpgradeScene.js` define a cor da borda na seleção e durante falas, preservando o fallback das imagens existentes. Foi corrigida também a variável local usada para carregar o atlas opcional da Kátia na seleção.
- **Observação:** a integração visual completa das novas expressões ainda depende da publicação do PNG do atlas no repositório e de teste com o jogo em execução.


## Zé Maria — expressões de retrato (24/10/2026; ARTE APROVADA)

- Referência visual aprovada: mecânico brasileiro robusto, pele escura, cabelo afro curto, bigode grande curvado, macacão verde sobre camiseta clara, sorriso generoso e olhar geralmente tranquilo. Não usar óculos na cabeça, barba pontuda ou aparência militar.
- Spritesheet: 16 expressões em grid 4×4; cada quadro 256×256 px, 16 px de margens/gutters, atlas total 1104×1104 px. Moldura verde.
- O quadro 12 (aprovando, joinha) não deve ter tinta branca no dedo. Expressões: neutro, feliz, gargalhando, surpreso, preocupado, irritado, desconfiado, convencido, triste, assustado, determinado, aprovando, orgulhoso, envergonhado, pensativo, vitória.
- Arquivos esperados: `public/assets/lideres/ze_maria_expressoes_4x4.png` e `.json`. `UpgradeScene.js` usa o novo atlas quando disponível e preserva o retrato legado como fallback.
- Integração **parcial** até o PNG ser copiado para o repositório; as trocas automáticas de expressão por emoção do diálogo permanecem para etapa posterior.


## Seu Nelson — retratos de diálogo (24/10/2026; APROVADO)

- Aprovada a segunda spritesheet de Seu Nelson: homem mais velho e elegante, cabelo grisalho penteado para trás, bigode marcante, blazer bege, camisa floral vermelha, corrente de ouro e pequena medalha. Expressões discretas e contidas, com serenidade e malandragem; ele é quase imperturbável.
- Atlas de 16 expressões 4×4, 256×256 px por quadro, 16 px de margens externas e espaçamento, 1104×1104 px total; moldura da arte dourada.
- `UpgradeScene.js` reconhece `SEU NELSON` independentemente dos representantes e usa `nelson-expressions` nos diálogos quando o PNG estiver presente; caso contrário, permanece sem novo retrato, sem afetar as outras falas.
- O PNG `public/assets/lideres/seu_nelson_expressoes_4x4.png` precisa ser instalado no repositório; JSON já integrado. Troca dinâmica de emoções é etapa futura.


## Mingda Mai — retratos aprovados (24/10/2026)

- Arte aprovada: representante chinesa de olhar persuasivo e comercial, cabelo preto preso em coque com adereços vermelhos, dourados e pingentes, vestido vermelho com ornamentos dourados. Personalidade de quem sempre está prestes a fechar um ótimo negócio.
- Grade 4×4 de 16 expressões, retratos de 256×256 px, espaçamento e margens transparentes de 16 px (atlas total de 1104×1104 px), moldura vermelha.
- As expressões incluem ajustar os óculos e conter uma risada, características da personagem.
- `UpgradeScene.js` carrega `mingda-expressions` como atlas opcional e usa o retrato neutro no Boteco. Quando ainda não há PNG, permanece o retrato existente. O JSON foi integrado em `public/assets/lideres/mingda_mai_expressoes_4x4.json`. Falta publicar o PNG e validar visualmente no jogo.


## Kim Lin Du: retratos aprovados em 24/10/2026

Visual: idol sul-coreano jovem, simpático, cabelo prateado/lilás, uniforme branco com detalhes roxos e dourados. Expressões menos arrogantes e mais amáveis. O quadro 16 mostra Kim piscando e fazendo coração com os dedos, com um coração rosa pequeno. Padrão de atlas 4x4, 16 expressões, 256px por retrato, gutters/margens de 16px, tamanho 1104x1104px. Moldura roxa. UpgradeScene carrega kim-expressions e mantém fallback para retrato legado. PNG ainda precisa ser publicado no caminho public/assets/lideres/kim_lin_du_expressoes_4x4.png. JSON Phaser 3 hash correspondente já no GitHub.


## Comentários durante as ondas — cronologia (24/10/2026)

- Onda 0 e onda 0.5: **nenhum representante fala no painel de comentários de batalha**; Zé Maria só chega depois da retirada e do telefonema para consertar o canhão, antes da onda 1.
- Da onda 1 em diante, Zé Maria pode falar. Os representantes estrangeiros só participam se já houver uma escolha do país na campanha; personagens não recrutados ficam fora do sorteio de falas.
- Traidor da onda 11 nunca comenta como aliado. Na viagem brasileira o rádio é de Zé Maria, com falas de chegada/partida específicas, sem antecipar os acontecimentos do prólogo.
- O gatilho de especial pronto continua condicionado à recarga de combate. Eventos de conclusão e chegada de cidade são exclusivos da viagem final.
- Código de seleção: `src/gameplay/battleBanter.js`; contexto da onda fornecido por `GameScene.queueBattleBanter`.
