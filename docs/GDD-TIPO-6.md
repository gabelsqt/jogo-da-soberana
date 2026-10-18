# GDD — Inimigo Tipo 6: Chefões finais

> **Status:** especificação aprovada em planejamento, **não implementada**. Esta seção documenta as decisões tomadas para o Tipo 6 e não altera o comportamento do jogo.

## Conceito e variantes
O Tipo 6 é uma nave colossal que ocupa a faixa superior da tela como uma grande barra. Há cinco variantes: **chefão alienígena** e chefões traidores dos **Estados Unidos, China, Rússia e Coreia do Sul**. O país traidor é **sorteado**, sem coalizões. As cinco versões compartilham a mesma estrutura técnica, mas possuem identidade visual e padrões de ataque próprios, com dificuldade global equivalente.

## Arquitetura e vulnerabilidade
- Cada nave possui **quatro módulos destrutíveis**, distribuídos **simetricamente: dois à esquerda e dois à direita** do núcleo central.
- O jogador pode destruir os quatro módulos **em qualquer ordem**. Só após destruir todos eles o **núcleo** fica exposto e vulnerável.
- Cada módulo tem **escudo individual**: é necessário esgotá-lo antes de danificar o módulo; **escudos não se regeneram** e a destruição de um módulo não altera a resistência dos escudos restantes.
- Escudos variam conforme a função do módulo: ofensivos tendem a ter proteção menor; defensivos/estratégicos, maior. Equilibrar o total de resistência entre variantes.
- As funções dos quatro módulos podem variar entre chefões (armas pesadas, drones, defesa, reforços etc.), preservando a arquitetura comum.
- **Hitboxes independentes e sem sobreposição** para os quatro módulos. O núcleo tem hitbox separada, ativada somente na fase final.
- O restante da fuselagem é blindado e invulnerável: tiros ricocheteiam visualmente, com faíscas, **sem gerar projéteis hostis** nem causar dano.
- Ataques de área que alcançam vários módulos causam **dano integral a cada módulo atingido**, respeitando escudos individuais e os limites específicos de cada upgrade. Perfuração, explosões, ricochetes e demais efeitos dos upgrades funcionam contra os módulos segundo suas regras já existentes; um ataque pode destruir vários módulos simultaneamente.
- Módulos destruídos deixam de receber dano e permanecem como **carcaças carbonizadas**, com metal retorcido, fumaça e faíscas ocasionais, preservando a silhueta da nave.

## Movimento e padrões de combate
- O chefão se move **apenas horizontalmente**, de um lado ao outro, sem deslocamento vertical.
- Mantém a mesma velocidade de cruzeiro durante toda a batalha, inclusive na fase do núcleo. Perto das bordas desacelera, para brevemente, inverte o sentido e volta à velocidade de cruzeiro.
- Módulos combinam ataques em **sequências coordenadas**, com intervalos de recuperação. Ataques especiais são **antecipados por sinais visuais** (luzes, carregamento, marcas de perigo).
- Há **contrajogo com tiros**: interceptar projéteis especiais, atingir pontos vulneráveis ou destruir o módulo responsável durante a carga, cancelando o ataque.
- O chefão pode convocar **reforços limitados**, em momentos específicos. Destruir o módulo correspondente pode interromper essas convocações.
- A destruição de cada módulo provoca **breve pane** (faíscas, luzes piscando, pausa curta nos ataques); módulos sobreviventes **reconfiguram seus padrões**. Alguns ataques deixam de existir, outros ficam mais fortes ou surgem novos padrões.
- Ao destruir um módulo, os projéteis que ele já lançou **explodem em cadeia**, podendo causar dano a inimigos menores próximos.

## Feedback visual e interface
- **Não há barras de vida dos módulos**. O estado é comunicado por escudos, flashes curtos de impacto, faíscas e dano visível. **Somente o núcleo exposto** recebe barra de vida.
- Escudo individual: reage aos impactos e, ao chegar a zero, apresenta **rachaduras luminosas**, pisca e **se estilhaça em partículas de energia** que se dispersam, deixando o módulo vulnerável. O efeito deve ser distinto da destruição do módulo.
- Quatro estados visuais do módulo: **intacto**, **levemente danificado** (rachaduras/faíscas), **criticamente danificado** (fumaça, metal danificado, falhas elétricas) e **destruído** (carcaça carbonizada). O desgaste dos módulos é mostrado após a queda de seus escudos.
- Feedback contextual, sem indicadores permanentes de alvo.

## Apresentação e transições
- **Entrada cinematográfica:** pausa breve do combate, céu escurece, interferência nas comunicações, troca da música, nave gigantesca entra, mensagem especial no letreiro de notícias; então o combate retoma.
- **Abertura do núcleo:** quando o último módulo é destruído, pane geral e tremor de câmera; núcleo se abre, barra de vida aparece, aviso breve anuncia a fase final.
- **Destruição do chefão:** quando o núcleo chega a zero, uma onda de choque elimina inimigos menores e limpa projéteis; seguem-se explosões progressivas na nave, tremor de câmera e grande detonação final.
- **Derrota do jogador:** canhão explode, comunicações entram em colapso com interferência, chefão domina a tela por alguns segundos e então é exibido o final narrativo correspondente.

## Fase final: núcleo e superarma
- Depois de exposto, o núcleo utiliza **ataques convencionais próprios** (projéteis e rajadas), até o período terminal do cronômetro.
- Quando restam **5 segundos**, o núcleo **para completamente de disparar novos ataques convencionais** e começa a carregar a **superarma**.
- Nesse instante, os projéteis **inimigos** já presentes na tela são **atraídos e absorvidos pelo núcleo** como energia visual, limpando o campo para a última oportunidade de ataque. A quantidade absorvida **não aumenta o dano** da superarma.
- O carregamento tem intensificação audiovisual (brilho, arcos, tremor). Quando resta **1 segundo**, se o núcleo ainda estiver ativo, a superarma dispara um **raio devastador** que encerra a partida e desencadeia a derrota.
- **Destruir o núcleo** antes do raio concede vitória.
- **Uso do Supremo durante o carregamento:** o conceito aprovado é **vitória imediata**. Contudo, o criador indicou que esse cenário não deve ocorrer normalmente na campanha; **detalhes de integração ficam adiados**. Não presumir regras adicionais de disponibilidade, custo ou temporização do Supremo.

## Balanceamento e restrições
- As cinco variantes devem ter **dificuldade semelhante**: durabilidade total dos escudos/módulos/núcleo, frequência geral de ataques e duração esperada da luta comparáveis. Diferenças principais: estética, funções dos módulos e padrões.
- Limitar reforços e efeitos para preservar desempenho e legibilidade, sem reduzir dano calculado.
- A implementação futura deve preservar a distinção entre **escudo quebrado**, **módulo destruído**, **núcleo exposto** e **chefão derrotado**.

## Pontos ainda não definidos
- Ataques e funções exatas de cada um dos quatro módulos em cada variante.
- Valores numéricos de HP, escudo, dano, frequência, duração e cronômetro.
- Tratamento de dano excedente no disparo que quebra o escudo.
- Integração excepcional do Supremo na campanha e seus detalhes.
- Como a derrota pelo cronômetro interage com eventuais outras condições de vitória/derrota.

**Registro:** compilação das decisões aprovadas para o Tipo 6 em 18/10/2026. **Somente GDD: sem alterações no código.**
