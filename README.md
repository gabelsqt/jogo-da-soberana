# Soberania — Jogo para a Soberana Game Jam

Jogo arcade de defesa antiaérea em pixel art ambientado no Rio de Janeiro, inspirado em **Missile Command** e **Utopia Must Fall**.

## Versão atual — 0.896 (escudos, cruzadores e caças)

- Escudos do Tipo 5 e da Fortaleza Tipo 6 agora ondulam e piscam discretamente ao absorver dano, sem flash branco no casco.
- O Cruzador Tipo 5 recebe escudo próprio, carrega por **5 segundos** um **laser pesado** telegráfico de **68 de dano**, dispara uma única vez e depois recarrega. Seus enxames continuam funcionando.
- O Caça Tipo 4 não desaparece após o ataque: recolhe altitude e volta a patrulhar até ser destruído; sua morte tem **três detonações** e flash branco curto.
- Whoosh retrô de voo em PCM, com pequenas variações de afinação e limite de repetição, acompanha suas passagens.
- [Detalhes técnicos v0.896](docs/versao-0.896.md).

## Versão anterior — 0.895 (Coreia + laboratório combinado)

Corrigido o travamento do **Lightstick contínuo coreano**, especialmente na **onda 10**, quando bombas da Fortaleza Tipo 6 são removidas no mesmo quadro. O **laboratório V1** agora permite selecionar **níveis 0–10 independentemente nos cinco países**, combinar efeitos primários e especiais, definir o país do especial principal e retornar à tela de combinações pelo botão **ALTERAR COMBINAÇÃO [U]** da arena. A campanha continua limitada às dez escolhas tradicionais. Veja [notas da v0.895](docs/versao-0.895.md).

## Versão anterior — 0.894 (progressão de spawns)

O número de naves **agendadas na campanha cresce em todas as ondas 0–9**: 20, 23, 26, 33, 40, 47, 53, 59, 65 e 71. As ondas 3/4 não expandem mais a população para quase cem inimigos; as ondas 5–9 passam a ter quantidades explicitamente controladas, mantendo a identidade dos padrões, os bombardeiros, as pinças e o miniboss Tipo 5 nas ondas 8/9. Os cinco portais da onda 0 permanecem nas mesmas posições. Todos os encontros comuns abrem em até 13,5 segundos; os 15 segundos restantes continuam dedicados à defesa. Reforços gerados por Tipo 5 durante o combate não estão incluídos nesses totais. Veja [notas da v0.894](docs/versao-0.894.md).

## Registro anterior — 0.50

**Boteco diurno:** imagem enviada pelo criador integrada em 960×540 (WebP) ao menu de negociações, com cinco retratos provisórios nas cadeiras. Selecionar representante escurece o cenário, faz o retrato crescer no canto superior esquerdo e apresenta simultaneamente flavor, descrição real do upgrade e uma área reservada para futura prévia animada. Histórias de Brasil, EUA, Coreia, Rússia e China aparecem progressivamente como placeholders.

**Correção Brasil nível 10 × Tipo 6:** tiros físicos que acertam o casco no vão entre módulos agora causam dano no módulo vivo mais próximo, mantendo barreira, escudos e núcleo corretamente protegidos. Há teste específico da Metralhadora da Soberania contra o Tipo 6.

**Identidade da Cubo News:** paleta azul-noturno jornalístico `#0B1621`, azul-aço `#193043`, branco suave `#DCE8EE`, âmbar `#E2A45E` e vermelho discreto `#C45151`. IBM Plex Sans para interface e IBM Plex Mono para números; cronômetro ainda maior, sem caixa.

**Visual novel do expediente:** após escolher iniciar, o protagonista faz login em um computador velho da repartição, abre manualmente o site da Cubo News e assiste a aproximadamente 24 segundos de notícias/diálogos alienígenas, com clique para avançar e opção de pular. As histórias e piadas continuam provisórias para a revisão de texto perto do lançamento.

Veja [notas técnicas e de design da v0.50](docs/versao-0.50.md).

## Versão anterior — 0.49.3

**Novos portais da onda 0:** 48 inimigos distribuídos em **cinco portais realmente distintos**, com entradas em três etapas: um portal central sozinho (8 naves, 0,8 s); dois portais simultâneos à esquerda/direita (10 + 10 naves, 4,6 s); e outros dois simultâneos mais externos (10 + 10 naves, 9,6 s). Posições X: 480; 235 e 725; 125 e 835. O portal final conclui a entrada de todos antes dos 15 segundos regulamentares. Os disparos graduais e as pausas longas da onda 0 foram preservados.

**Velocidade dos inimigos em todas as ondas:** voos, perseguições e mergulhos dos invasores comuns (tipos 1–5) passam a usar **78% da velocidade anterior**, além de coreografias desaceleradas nas outras ondas; a onda 0 conserva o mergulho didático a 70% e a dança lenta de 6,5 s. O Tipo 6 mantém seu ritmo especial para não alterar o equilíbrio dos chefões.

## Versão anterior — 0.49.2

**Balanceamento da onda 0:** 22 inimigos em quatro grupos (5, 5, 6 e 6). Entradas aos 0,9 s, 4,2 s, 7,8 s e 11,4 s. Os movimentos sincronizados foram desacelerados: cada formação passa 6,5 segundos coreografando, seguida de 3,1 segundos pairando antes do mergulho. O primeiro tiro acontece no mínimo 1,5 segundo após começar a pairar, com defasagem de 0,2 segundo entre as naves. Durante a onda 0, mergulhos têm 70% da velocidade anterior e projéteis, 85%. **Ondas 1–11, regras de amanhecer e mecânicas ofensivas dos países permanecem inalteradas.**

## Versão anterior — 0.49.1

**Ajuste de balanceamento da onda 0:** 16 inimigos em quatro formações coreografadas (3, 4, 4 e 5 naves), espaçadas de 1,1 s até 11,6 s; preserva os padrões e reduz significativamente a pressão inicial. As ondas 1–11 não foram modificadas neste ajuste.

## Versão anterior — 0.49

**Cubo News — Emissora Oficial Brasileira:** abandona tipografia em pixels na interface e passa para **IBM Plex Sans**, fundo verde-petróleo, ouro, creme e grafite, mantendo todos os menus na mesma linguagem visual. A imprensa elogia gastronomia, música e cinema dos países que ajudam o Brasil e muda imediatamente de discurso quando ocorre uma traição.

**Nova introdução (22,5 s):** jogador identifica seu nome (lembrado pelo navegador, sorteio entre 40 nomes comuns se deixar em branco). Um plantão explica que os ETs consideram o Cristo Redentor de braços abertos uma afronta e só atacam à noite, por etiqueta. Um ex de São Paulo se vingou do jogador carioca depois de ouvir “biscoito” em vez de “bolacha”, inscrevendo-o como mesário; após baixas na cadeia de comando, a lista de mesários vira a lista de generais. Intro ilustrada e com opção de pular. Kim Lin Doo, representante sul-coreano, usa BTS como “Batalhão Tático de Seul”.

**Correções e simplificação:** projéteis comuns fazem colisão contínua contra o Tipo 6; limites de render e projéteis protegem a onda 11 com China e Coreia; todos os benefícios de escudo das melhorias da campanha foram removidos **sem reduzir os 50 upgrades ou mudar os efeitos ofensivos existentes**. O escudo básico se torna uma cúpula 180% maior (inclusive colisão), azul → verde → amarelo → vermelho.

**Ondas mais agressivas:** Tipos 1 e 2 disparam ao pairar; formam senoides, círculos e espirais coordenados. Inimigos não entram mais após 15 s decorridos nas ondas comuns; nos dez finais, atacam diretamente. Tiros inimigos 50% maiores e interceptáveis. O Lightstick exige o dobro do acúmulo. Amanhecer cinematográfico começa **somente no zero** (imagem definitiva do Rio amanhecendo ainda pendente).

Leia [notas da versão 0.49](docs/versao-0.49.md).

## Versão anterior — 0.48

**Cubo News assume os menus:** a tela inicial, pausa, negociação de upgrades, laboratório tático, configuração de testes, finais e telas de resultado passam a usar uma identidade compartilhada de telejornal: cabeçalho vermelho com **Cubo News**, indicação **AO VIVO**, molduras azul-marinho, botões retangulares de plantão e faixa editorial inferior. A mesa de negociações continua no cenário de boteco.

**Fonte pixel com letras minúsculas:** o renderizador bitmap 5×7 ganhou **26 glifos minúsculos autênticos**, além dos maiúsculos, com acentuação do português preservada. Manchetes e subtítulos voltam à fonte em pixels, agora em **caixa mista**; chamadas originalmente em CAIXA ALTA são apresentadas em forma de frase, preservando nomes próprios e siglas como CBF, ETs, Brasil, Cristo, Flamengo e Cubo News. O **cronômetro grande volta a ser bitmap**, com apenas os segundos, sem a caixa.

**A vinheta cinematográfica do amanhecer continua igual** (2,2 segundos de destaque, depois zoom-out de 1,75 segundo). O HUD da partida continua fora do canvas, imóvel durante screenshake. Toda a implementação está na branch `feat/brasil2-arraial-balístico`, sem modificar a `main`.

Leia as [notas da versão 0.48](docs/versao-0.48.md).

## Versão anterior — 0.47

**Cubo News mais legível e abertura cinematográfica:** as letras 5×7 de baixa resolução foram substituídas na interface ativa por **tipografia retrô nítida**, com contornos duros, blocos de cor e molduras quadradas preservando a estética de pixel art. Manchetes e subtítulos ficam mais fáceis de acompanhar. O relógio segue mostrando **somente segundos**, enorme e sem caixa.

A abertura **TEMPO ATÉ O AMANHECER** agora começa com **zoom real da câmera sobre o cenário**, enquanto o número central é significativamente maior. O jogador tem aproximadamente **2,2 segundos de leitura**, seguidos de **1,75 segundo de zoom-out sincronizado**: cenário se afasta, moldura e título desaparecem por transparência e o número se desloca e dissolve suavemente no relógio do canto direito. Somente então começa a batalha, sem consumir tempo. A camada do telejornal continua **fora da câmera** e não recebe zoom/screen shake durante as ondas.

Veja [notas da versão 0.47](docs/versao-0.47.md).

## Versão anterior — 0.46

**Cubo News em pixel art + abertura do amanhecer:** o HUD inferior agora usa uma fonte bitmap 5×7 própria do jogo, cores chapadas e contornos retos. O cronômetro está ainda maior e exibe apenas os **segundos** (30, 29, 28...), sem `00:`. Antes de cada onda, o texto **TEMPO ATÉ O AMANHECER** e o número total (30 ou 60) aparecem centralizados; o número desliza até o relógio à direita, e **somente depois** os disparos, spawns e o cronômetro começam. Nos chefões, a contagem permanece parada até que a fortaleza esteja alvejável.

Nas ondas **0–9**, a Cubo News se mantém tranquilíssima: os ETs prometeram deixar o Rio ao amanhecer assim que o “Líder Supremo” cruzar os braços. Como o Cristo Redentor nunca cruza os braços, a invasão se repete todas as noites. A emissora insiste em tratar o compromisso como confiável. A cobertura de emergência passa a ser desesperada somente nas ondas 10–11.

O noticiário continua uma **faixa externa e imóvel** abaixo do canvas; zoom/screen shake não afetam letras, ticker ou relógio. Nenhum PNG ou fonte extra é necessário. [Notas da versão 0.46](docs/versao-0.46.md).

## Versão anterior — 0.45

**Cubo News compacta e independente da câmera:** a faixa agora ocupa apenas **44 pixels lógicos** de altura, renderizada em HTML **ABAIXO** do canvas do jogo, como uma transmissão televisiva. O canhão e os prédios ficam inteiramente acima da faixa, sem trocar a imagem do Rio e sem alterar a posição ou a física das armas. Manchete preta sobre prata, selo vermelho `CUBO NEWS` e **subtítulo rolando da direita para a esquerda** sobre uma tira vermelha, conforme a referência aprovada. À direita, um relógio **maior, sem caixa e semitransparente**, piscando em vermelho nos últimos cinco segundos. Como o HUD não é parte da cena Phaser, nem tremores de câmera nem zooms de destruição o movem.

Em menus, o jogo volta a usar toda a área normal de 960×540. Durante ondas, a composição ajusta automaticamente o canvas + faixa ao espaço disponível, inclusive no celular e em iframes. O selo de versão antigo fica oculto durante a transmissão. [Notas da versão 0.45](docs/versao-0.45.md).

## Versão anterior — 0.44

**Fortaleza de Cerco + Cubo News:** a versão 0.44 atualiza os chefões Tipo 6 com quatro módulos de função fixa, barreira frontal e escudos individuais, ataques alternados, projéteis interceptáveis, laser de 10 s de carga e 3 s de emissão, hangares de invasores Tipo 3 e diferenças entre os países traidores. A entrada do chefão pausa o cronômetro até que fique alvejável. O HUD único da Cubo News ocupa a faixa inferior, com cronômetro grande à direita e manchetes e subtítulos rotativos, além de alerta nos cinco segundos finais.

**Atenção:** os sprites definitivos e as cinematografias nacionais continuam em produção. O banco de notícias inclui somente textos aprovados e algumas notícias iniciais provisórias; duas variantes seguem pendentes de revisão. Os testes automatizados não substituem o playtest visual e de balanceamento. Veja [notas da versão 0.44](docs/versao-0.44.md) e [GDD atualizado do Tipo 6](docs/GDD-TIPO-6.md).

### Testar a v0.44

No GitHub Actions, abra **Verificação do protótipo** na branch `feat/brasil2-arraial-balístico` e baixe o artefato `soberana-v1-playtest` (HTML único para executar no navegador). Alternativamente, rode `npm install && npm run dev` no checkout dessa branch; use **Shift+0** para a onda 10 ou **Shift+1** para a onda 11 durante desenvolvimento. **Playtest com um clique:** https://gabelsqt.github.io/jogo-da-soberana/ — GitHub Pages publicou a build v0.44 a partir da branch de desenvolvimento.

## Versão anterior — 0.43

**Rússia reformulada:** os tiros comuns passam a parecer sopros de névoa gelada branca-azulada, com volutas e partículas de gelo. O congelamento mantém a atração e agora **contagia** até quatro alvos próximos, com um único salto e duração menor nos alvos contagiados. O especial Matryoshka ganha **25% de redução no cooldown** (8 s → 6 s como base), preservando bônus de builds híbridas. [Notas da versão 0.43](docs/versao-0.43.md).

### Como testar a Rússia

No menu, use **TESTAR UPGRADES V1 → Rússia**: nível 1 para névoa e contágio, nível 2 para a Matryoshka com recarga de 6 segundos; níveis 3/5/7/10 ampliam o raio de propagação. Procure grupos de inimigos: o contágio ocorre quando se aproximam, quando a origem congelada recebe novos tiros ou quando morre. O jogo ainda precisa de validação visual e ajuste fino no navegador.

## Versão anterior — 0.42

**Chefão Tipo 6 — primeira versão jogável.** Ondas 10 e 11 passam a usar uma nave colossal com quatro módulos independentes, escudos individuais e núcleo exposto na fase final; variantes alienígena, americana, russa, chinesa e sul-coreana, com **um único traidor estrangeiro sorteado** na Onda 11. Superarma carrega nos últimos 5 s e dispara no segundo final, caso o núcleo sobreviva. Os visuais de naves são **provisórios em Phaser Graphics**; spritesheets definitivas e ajustes de balanceamento ficam para a próxima etapa. [Notas da versão 0.42](docs/versao-0.42.md).

### Teste rápido (ambiente de desenvolvimento)

Em qualquer onda, **Shift+0** abre diretamente a Onda 10 (fortaleza alienígena) e **Shift+1** abre a Onda 11 (confronto final). Para testar traidores estrangeiros, comece com a campanha contendo uma escolha estrangeira; o sorteio considera apenas os países estrangeiros escolhidos. Esses atalhos funcionam somente com `npm run dev`, não na versão de produção.

## Versão anterior — 0.41

Especial coreano: globo estacionário por 4 segundos, gerando 3/6/12/24 reflexos direcionados aos inimigos por tiro recebido. Compatível com balas e pulsos do laser contínuo. [Notas da versão 0.41](docs/versao-0.41.md).

Para conferir o globo: **TESTAR UPGRADES V1 → Coreia → nível 2, 4, 6 ou 8**. Lance o especial e atire no globo. A prévia de destruição continua disponível pelo atalho D.

**Registro de versões:** a cada nova versão jogável, atualizar o número visível em `src/config/version.js`, o equivalente semântico em `package.json`, este resumo e as notas em `docs/versao-<versão>.md`. Registrar mudanças de design no GDD e distinguir testes automatizados de validação visual pelo jogador. A versão 0.39 reúne as mudanças recentes; não atribui retrospectivamente versões 0.36–0.38.

## Histórico anterior

> **Protótipo 0.26 — Torres mecanizadas com sprites independentes.** Substituímos os retângulos provisórios das primeiras cinco torres por 10 PNGs transparentes, cada corpo e sua arma lateral em texturas separadas. Os canhões apontam suavemente para o alvo e recuam sozinhos; o animal não gira nem recua ao disparar. A lógica de danos, alcance, alvos, HP, escudo e intervalo das torres permanece intacta. O identificador 'jp' continua mapeado ao sprite KR/Kkachi sem alterar os saves. As artes aprovadas foram reduzidas a 128 px na maior dimensão, com 48 cores, para publicação mais leve; os PNGs de alta resolução permanecem preservados no pacote original.\n\n> **Protótipo 0.25 — Identidade da Coreia do Sul.** Os nomes mostrados ao jogador foram atualizados: **Coreia do Sul (KR)**, **Lightstick Tático** (nível 1), **Encore!** (nível 2) e **Projeto Kkachi I / KKACHI** (torre do nível 3). HUD, cartões, laboratório e histórico de escolhas exibem a identidade coreana. O identificador interno legado `jp` permanece para preservar a progressão e as combinações já existentes. Nenhuma mecânica de combate, valor de dano ou arma foi alterado.

> **Protótipo 0.24 — Feedback de impacto e destruição de OVNIs.** Todos os tipos de inimigo implementados (1–5) ganharam piscar branco curto e sacudida ao sobreviver a um disparo, além de explosões geométricas escalonadas ao serem abatidos. O Tipo 4 (Caça Relâmpago) recebe explosão rosa/branca em duas etapas, anel, estilhaços e microtremida; o Tipo 5 recebe celebração ainda maior e em duas etapas. O Tipo 6 já possui parâmetros de VFX planejados, mas **ainda não existe nas ondas jogáveis**. Nenhum atributo de HP, dano, movimento ou cooldown foi modificado.

> **Protótipo 0.23 — Refinamentos visuais do nível 2.** Todos os cinco países ganharam uma evolução visual de seus upgrades de nível 2, preservando dano, cadência e área de efeito: escudos brasileiros com brilho e pequenas descargas, segunda explosão americana laranja levemente atrasada **apenas na animação**, fenda coreana com bordas pulsantes, choques russos com ondas e reflexos mais fortes perto do chão e flash triplo chinês com projétil central destacado. Os efeitos estão disponíveis tanto na campanha quanto no laboratório; a migração de identidade foi concluída na v0.25.

> **Protótipo 0.22 — Calibre visual russo.** Os projéteis do Camarada Canhão estão ligeiramente maiores, de **9 × 14 px para 11 × 17 px**, também em builds combinadas, sem modificar colisão, dano, velocidade ou recuo físico. Demais efeitos da v0.21 preservados.

> **Protótipo 0.21 — Efeitos visuais dos upgrades de nível 1.** Gambiarra Balística passa de +25% para **+50% de cadência** (500 → 333 ms) e alterna suavemente o ângulo dos disparos. O canhão russo ganhou clarão, rastro quente, recuo visual, faíscas e microtremida; os tiros chineses têm flash duplo e rastros vermelho-dourados, também nas builds combinadas. Fragmentação americana ganhou estilhaços luminosos. O laser coreano (identificado visualmente como Lightstick a partir da v0.25) permanece aprovado. Mantidas Ondas 0–9, Phaser 960 × 540 e a base responsiva da v0.20.

## Torres de nível 3 — sprites e pivôs (v0.26)

- Os sprites utilizados em jogo estão em `public/assets/torres/`, com arquivos `*_corpo.png` e `*_arma.png`. 
- `src/gameplay/mechSpriteMounts.js` define o ponto de encaixe do canhão em cada animal, carrega 10 texturas no Phaser e gira apenas a arma, sem mover o corpo.
- A seleção de alvos continua a mesma: o canhão acompanha o inimigo durante o cooldown e atira com a cadência anterior. O recuo visual afeta apenas a imagem da arma.
- O ID de lógica `jp` utiliza o sprite de aparência `kr` (Kkachi), preservando progressão e combinações.
- A exportação HTML único do itch.io embute todos os PNGs automaticamente, inclusive os novos, sem requisições externas.
- **Teste visual:** abrir `TESTAR UPGRADES [U]`, instalar a torre com `Shift+1` a `Shift+5`, retornar ao campo com `U` e gerar alvos com `1`–`5`. Observe o encaixe na lateral, a rotação independente e o recuo. O tamanho e os pivôs ainda precisam de confirmação no navegador antes da aprovação final.

## Feedback de tiros e mortes dos invasores (v0.24)

Cada tiro que **não mata imediatamente** dá uma resposta visual: a nave fica branca por 60–100 ms, treme e inclina brevemente, e retorna à trajetória normal. A reação cresce com o tipo de ameaça; o PNG animado do Tipo 1 conserva a escala original, e os Tipos 2–5 ainda usam as artes geométricas provisórias. O efeito é visual: não aplica dano extra ou recuo físico ao inimigo. Quando o tiro mata o alvo, a explosão inclui um clarão branco inicial.

| Tipo | Shake ao tomar dano | Flash branco | Raio visual da explosão | Estilhaços | Morte |
| --- | ---: | ---: | ---: | ---: | --- |
| 1 — Invasor básico | 2 px | 60 ms | 23 px | 5 | pequena e rápida |
| 2 — Esquadrão | 3 px | 70 ms | 31 px | 7 | explosão lilás |
| 3 — Bombardeiro | 4 px | 80 ms | 45 px | 10 | anel de energia |
| **4 — Caça Relâmpago** | **5 px** | **90 ms** | **62 px** | **16** | **duas etapas**, flash rosa/branco, anel, cicatriz luminosa e pequena sacudida de tela |
| **5 — Cruzador-Colmeia** | **6 px** | **100 ms** | **103 px** | **23** | **duas etapas**, colapso luminoso turquesa e segunda explosão |
| 6 — Chefão final | planejado | 120 ms | 155 px | 30 | três etapas previstas, **não implementado no combate** |

A morte só dispara quando o HP do inimigo chega a zero: inimigos que completam um ataque, atingem a base ou são removidos por **C: LIMPAR** no laboratório não geram explosões. Os efeitos não são ataques em área: não causam dano nem encadeiam novas mortes. Há um máximo de **24 Graphics simultâneos** para impedir excesso de partículas e pequenas tremidas de câmera nos abates de Tipos 4 e 5 são limitadas a no máximo uma a cada 220 ms. Objetos animados são descartados ao fim da animação.

**Código:** `src/gameplay/enemyFeedback.js` define os perfis e cálculos puros; `src/scenes/GameScene.js` aplica flash, shake e explosões; `tests/enemyFeedback.test.js` valida perfis, morte real versus desaparecimento e o limite de efeitos.

**Playtest sugerido:** no **Laboratório de Inimigos** use as teclas **1–5** para gerar cada tipo de OVNI (Shift+4/5 para versões resistentes). Na campanha, foque no Caça Relâmpago e no Cruzador-Colmeia para avaliar se a recompensa por derrota está suficientemente marcante. É importante conferir visualmente performance e legibilidade com muitos alvos.

## Melhorias visuais de nível 2 (v0.23)

Os upgrades de nível 2 agora mostram uma evolução claramente reconhecível do nível 1, **sem alterar atributos de gameplay**:

| País | Nível 2 | Novo feedback visual |
| --- | --- | --- |
| Brasil | Minha Casa, Meu Escudo | Halo verde pulsante, cacos de vidro com reflexos em movimento e arcos curtos sobre **escudos ativos**. Descarga contra OVNI ganha núcleo branco/verde. São efeitos desenhados diretamente no `shieldGraphics`, sem partículas criadas continuamente |
| EUA | Dano Colateral | Fragmentação azul seguida por explosão laranja e oito raios de estilhaços com **95 ms de atraso visual**. Dano, raio e cálculo de acertos continuam imediatos, sem explosões recursivas |
| Coreia do Sul | Encore! | Fenda turquesa existente recebe bordas que pulsam discretamente e reflexos nas extremidades; mantém duração de **2,2 s**, largura de colisão e dano residual |
| Rússia | Recuo Estratégico | O choque perto do chão recebe reflexos concêntricos e arcos luminosos, crescendo conforme a intensidade de recuo que já existia; nenhuma mudança na força mecânica |
| China | Compre 2, Leve 3 | A rajada de três projéteis produz **flash triplo**, com projétil central delineado e com trilha dourada mais brilhante. O nível 1 ainda usa flash duplo e duas balas |

**Como testar:** entre em **Testar upgrades**, pressione **N** para mostrar os upgrades de nível 2, ative o país desejado e retorne ao combate com **U**. O laboratório habilita automaticamente o nível 1 correspondente quando o nível 2 é ativado. Alterne os países e use várias combinações para verificar a legibilidade de partículas, raios e disparos.

**Arquivos:** `src/gameplay/secondUpgradeVisuals.js` reúne parâmetros e funções visuais puras; `src/scenes/GameScene.js` renderiza os efeitos; `src/gameplay/secondUpgrades.js` atualiza apenas as descrições visíveis do laboratório; `tests/secondUpgradeVisuals.test.js` valida as animações e a preservação dos atributos mecânicos.

**Estado:** a identidade da Coreia do Sul foi integrada na v0.25; o identificador interno `jp` permanece por compatibilidade. Upgrades de níveis 4–10 ainda não foram implementados. Playtest visual no navegador permanece necessário.

## Upgrades de nível 1 com impacto visual (v0.21)

A campanha e o **Laboratório de Upgrades** usam os mesmos efeitos. Para testar, escolha **Testar upgrades** no menu e marque um país na aba de nível 1; depois pressione **VOLTAR AO CAMPO [U]**. Também é possível selecionar vários países e observar as combinações.

| País | Mecânica | Feedback visual |
| --- | --- | --- |
| Brasil — Gambiarra Balística | **+50% de cadência** (500 ms → aproximadamente 333 ms) e leve alternância esquerda/direita a cada rajada | Flash esverdeado alternado e recuo mais animado. O desvio é determinístico (±0,045 rad, cerca de 2,6°), sem curva durante o voo |
| EUA — Munição de Fragmentação | Mesmas explosões e dano de antes | Sete raios curtos de estilhaços azuis/brancos no impacto, sem dano extra |
| Coreia do Sul — Lightstick Tático | Laser perfurante a cada três disparos, com rastro residual no nível 2 | Feixe violeta já aprovado. **Agora exibido como Lightstick Tático** na v0.25 |
| Rússia — Camarada Canhão | +75% de dano e mesmo recuo físico de antes | Projétil **11 × 17 px** (antes 9 × 14), rastro vermelho/quente, clarão forte, recuo animado de 8 px, microtremida curta com limite de frequência, anel/faíscas ao acertar |
| China — AliExplode — Frete Grátis | Dois projéteis por rajada (três com nível 2) | Rastros dourados por projétil, flash duplo vermelho/âmbar e recuo visual de dois pulsos |

O aumento de tamanho russo é **somente visual**: o acerto usa a mesma distância de colisão de antes. Em combinação com o plasma da Coreia, a munição básica preserva a cor e o comprimento violeta, mas ganha a largura de projétil russo. Essa regra foi adicionada aos testes de regressão.

**Acúmulo de aliados:** a rajada chinesa mantém seu espalhamento simétrico, mesmo com o pequeno desvio brasileiro; os efeitos de trilha da Rússia e China aparecem juntos, sem mudar dano. O feixe coreano continua apontado para a mira original, independente do zigue-zague dos tiros básicos do Brasil. O recuo do canhão é somente uma animação e não altera a origem ou a direção física das balas.

**Implementação:** `src/gameplay/upgrades.js` define cadência, ângulo alternado e marcas visuais; `src/scenes/GameScene.js` desenha flashes, estilhaços, trilhas e recuo com objetos temporários destruídos ao finalizar a animação ou o projétil. `tests/firstUpgradeVisuals.test.js` cobre valores, alternância, limites de ângulo e compatibilidade entre países; os testes de progressão foram atualizados para a nova cadência.

**Observação:** as intensidades visuais ainda dependem de playtest no navegador. A troca dos nomes do Japão pelos da Coreia do Sul chegou na v0.25; os upgrades 4–10 continuam pendentes de implementação.

## Layout responsivo e preparação mobile (v0.20)

- **Resolução lógica:** o Phaser continua rodando em **960 × 540**, que já é 16:9, exatamente como 1920 × 1080. Não alteramos posições de armas, torres, sprites nem hitboxes.
- **Escala:** `Phaser.Scale.FIT` e `CENTER_BOTH` centralizam e ampliam o jogo sem cortar ou esticar a imagem. Nas telas de proporção diferente, surgem faixas vazias ao redor, sem perda do cenário.
- **Pixel art:** o canvas mantém a renderização sem suavização, inclusive quando ampliado no PC.
- **Área segura:** a moldura `#viewport` incorpora `viewport-fit=cover`, `env(safe-area-inset-*)` e `100dvh`. O elemento `#game` segue **sem padding**, como recomendado pelo Phaser, para não quebrar os cálculos de escala.
- **Celular na vertical:** em tela sensível ao toque, aparece a mensagem “Gire o celular para jogar”. A partida pausa automaticamente e retoma ao mudar para paisagem; também funciona para orientação do aparelho detectada dentro de um iframe.
- **Barras do navegador e redimensionamento:** a mudança de tamanho da janela ou de `visualViewport` recalcula a escala. O `index.html` continua integrado ao HTML único de itch.io.
- **Fase futura:** controles específicos de toque (mira, tiro principal, tiro especial, menus), avaliação de legibilidade do HUD em telas pequenas e testes em celulares reais. **Esses controles ainda não estão prontos.**

**Teste no PC:** execute `npm.cmd run dev`, redimensione a janela e verifique que a proporção continua 16:9. **Teste no celular:** abra o servidor numa rede acessível pelo aparelho, gire a tela e verifique o aviso/pausa. A incorporação no itch.io também depende das dimensões do iframe da própria página; mantenha a proporção de exibição 16:9.

## Novo cenário fixo do Rio

O menu, a tela de escolha e o combate agora usam **uma única imagem fixa** como plano de fundo, no lugar das oito camadas originais. A nova arte foi fornecida pelo criador e deve ser copiada para:

```
public/assets/cenario/rio_fundo_fixo.png
```

A imagem é carregada pela função compartilhada em `src/config/scenery.js`; `src/scenes/GameScene.js` reutiliza esse carregador. A proporção é adaptada ao canvas **960 × 540**. Até o novo arquivo PNG ser inserido no repositório, o jogo usa temporariamente as antigas oito camadas como **fallback** para evitar tela vazia. Quando o arquivo existir, **somente a imagem nova é desenhada**.

Para incluir a arte no GitHub a partir de um ZIP com o caminho correto:

```powershell
cd "$HOME\Projects\jogo-da-soberana"
git pull
Expand-Archive "$HOME\Downloads\soberania-cenario-fixo.zip" -DestinationPath . -Force
git add public/assets/cenario/rio_fundo_fixo.png
git commit -m "Adiciona cenário fixo do Rio"
git push
npm.cmd run dev
```

**Atenção:** o ZIP citado acima era uma referência antiga e pode não estar disponível. Se ele não existir, copie manualmente o PNG original fornecido para `public/assets/cenario/rio_fundo_fixo.png`; o arquivo precisa estar no projeto para aparecer no HTML de publicação.

## Publicar no itch.io sem arquivos externos — RECOMENDADO

Houve erro MIME/404 no CDN do itch.io para o arquivo JavaScript do build normal. Agora existe um **exportador HTML único** que incorpora tanto o JavaScript quanto os PNGs do jogo (inclusive o cenário fixo) no próprio HTML:

```powershell
cd "$HOME\Projects\jogo-da-soberana"
git pull
npm.cmd install
npm.cmd run build:itch
```

Ele gera **`itch-build/index.html`**. Na página **Edit game** do itch.io:

1. Mantenha **Kind of project: HTML**.
2. Remova os ZIPs anteriores da seção de upload.
3. Envie **diretamente `itch-build/index.html` como um único arquivo HTML**, sem ZIP.
4. Ative a opção de execução no navegador, se solicitada, e mantenha viewport **960 × 540**.
5. Salve e faça um teste na página.

Esse HTML não precisa pedir `assets/index-*.js` nem os PNGs a caminhos separados, portanto contorna o erro MIME causado por JS ausente. O projeto continua com `npm.cmd run dev` para desenvolver e `npm.cmd run build`/`preview` para testar o build normal.

**Atenção:** é importante fazer `git pull` antes. Se o arquivo `rio_fundo_fixo.png` ainda não estiver no computador, o exportador avisará que está usando o cenário antigo como fallback.

## Jogar no computador (PowerShell)

Requisitos: Node.js 20+ e Git.

```powershell
cd "$HOME\Projects\jogo-da-soberana"
git pull
npm.cmd install
npm.cmd run dev
```

Abra a URL exibida (normalmente http://localhost:5173/). Em atualizações futuras, basta `git pull` e `npm.cmd run dev` se as dependências não mudarem.

Para executar os testes e gerar o build:

```powershell
npm.cmd test
npm.cmd run build
```

Para publicação no itch.io, prefira `npm.cmd run build:itch` e envie diretamente o **`itch-build/index.html`**, sem ZIP. O ZIP normal de `dist/` continua possível, mas apresentou erro no CDN do itch.io nos testes anteriores.

### Playtest rápido das novas ondas (apenas no servidor de desenvolvimento)

Durante uma partida aberta com `npm.cmd run dev`, use **Shift+5, Shift+6, Shift+7, Shift+8 ou Shift+9** para abrir imediatamente a onda correspondente. Se você ainda não selecionou três aliados, o salto usa Brasil três vezes como loadout temporário (com Caramelo), exclusivamente para teste. **Os atalhos não existem no HTML de produção/itch.io.**

## Fluxo jogável nesta versão

1. Menu inicial → **Começar**.
2. **Onda 0:** contagem regressiva **3, 2, 1** antes de começar; **32 invasores Tipo 1** (20 em sequência, a cada 1,28 s, mais três grupos simultâneos de 3, 4 e 5). O primeiro aparece 0,25 s após a contagem; continua sendo possível perder.
3. Após concluir a Onda 0, aparecem cinco cartões para escolher **um upgrade inicial**.
4. **Onda 1:** nova contagem **3, 2, 1**; são **70 inimigos**: 32 invasores básicos em sequência (a cada 0,96 s), grupos simultâneos com 3, 4 e 5 básicos, dois trios Tipo 2, um ataque circular de dez Tipo 2 avançados e uma **fileira final de dez OVNIs Tipo 1**, ocupando a largura do céu. A onda só termina depois que todas as ameaças são neutralizadas.
5. Ao vencer a Onda 1, surge a **segunda escolha de país**. Cada cartão oferece o próximo upgrade daquele país: se repetir um país, ganha sua **melhoria de nível 2**, SEM instalar torre; se mudar de país, recebe o primeiro upgrade do novo aliado. O escudo elétrico brasileiro, por exemplo, pode ser testado escolhendo Brasil duas vezes.
6. **Onda 2:** contagem regressiva 3–2–1, 80 inimigos programados com bombardeiros (Tipo 3) e caças relâmpago (Tipo 4), além dos básicos e formações. Ao vencer, abre a **terceira escolha de país**.
7. **Terceira escolha:** repetir o mesmo país três vezes desbloqueia sua **primeira torre mecanizada** (Caramelo/Águia/Kkachi/Urso/Panda); escolher um país diferente concede o próximo upgrade daquela linha, sem pular níveis.
8. **Onda 3 — Céu Fechado:** 88 inimigos programados em quatro momentos: bombardeio inicial, órbita de Tipo 2, caças Tipo 4 cruzando com bombardeiros Tipo 3 e ataque final de Tipo 1 nível 2 em linha. Duração mínima de 54 s; ao vencer, começa a Onda 4 diretamente, preservando o conjunto de três upgrades/torres.
9. **Onda 4 — Ataque em Pinça:** 80 inimigos, TODOS nível 3 de resistência e coloração laranja: **47 Tipo 1 (2 HP), 20 Tipo 2 (4 HP), 5 Tipo 3 (10 HP) e 8 Tipo 4 (6 HP)**. Pinças simultâneas e retardadas. Mínimo 70 s; ao vencer começa a Onda 5 automaticamente.
10. **Ondas 5–9:** cinco novas ondas com identidade própria, cores e HP maiores (tabela abaixo). A última termina numa tela provisória anunciando o boss da Onda 10.
11. **Testar inimigos**, no menu inicial, apresenta os Tipos 2–5 e seus padrões.
12. **Testar upgrades** abre laboratório independente e permite testar as cinco torres sem passar pelas ondas.

## Resistência progressiva e cores da frota

Os níveis **1 e 2** permanecem com os atributos anteriores nas Ondas 0–3. A partir da Onda 4, a resistência cresce **para TODOS os inimigos da onda** (não apenas para parte da frota), sem modificar largura, altura ou hitbox:

| Onda / nível | Tipo 1 | Tipo 2 | Tipo 3 | Tipo 4 | Cor do nível |
| --- | ---: | ---: | ---: | ---: | --- |
| 4 / III | 2 | 4 | 10 | 6 | Laranja |
| 5 / IV | 3 | 5 | 12 | 7 | Magenta |
| 6 / V | 4 | 6 | 14 | 8 | Roxo |
| 7 / VI | 5 | 7 | 16 | 9 | Azul elétrico |
| 8 / VII | 6 | 8 | 18 | 10 | Ciano |
| 9 / VIII | 7 | 9 | 20 | 11 | Dourado pálido |
| 10 / IX (planejado) | 8 | 10 | 22 | 12 | Branco frio |

As **Ondas 5–9 são jogáveis**. A Onda 10 e seu **Tipo 6 — Fortaleza-Mãe** (boss gigante que ocupa o topo e invoca outros inimigos) permanecem somente planejados. Os caças continuam velozes e fazem uma segunda passagem antes do laser; bombardeiros pairam por mais tempo, enquanto formações demoram mais para mergulhar.

| Onda | Tema tático | Inimigos agendados | Duração mínima | Nova mecânica |
| --- | --- | ---: | --- | --- |
| 5 | Cerco Aéreo | 83 | 79 s | Bombardeiros escoltados por Tipo 2 |
| 6 | Chuva de Ferro | 77 | 82 s | Leques de até três bombardeiros |
| 7 | Enxame Organizado | 78 | 90 s | Dois círculos e duas fileiras de naves blindadas |
| 8 | Superunidades | 62 + até 12 invocados | 94 s | Primeiro Cruzador-Colmeia (Tipo 5), 52 HP |
| 9 | Último Cerco | 77 + até 12 invocados | 105 s | Cruzador-Colmeia reforçado, 56 HP, mais ataques combinados |

As quantidades são de **inimigos programados**; nas Ondas 8 e 9, o Cruzador-Colmeia pode invocar até **12 básicos adicionais de mesmo nível**, com máximo de **6 invocações vivas simultaneamente**. Ao derrotar a superunidade, o jogador ainda precisa eliminar os invasores restantes para terminar a onda.

**Importante:** ainda não há quarta escolha de aliado nem upgrades de nível 4. **As vitórias das Ondas 3–8 iniciam a onda seguinte automaticamente**, preservando as três escolhas e torres conquistadas. A tela final provisória aparece somente depois da Onda 9.

## Cinco upgrades iniciais

| País | Upgrade | Efeito no protótipo |
| --- | --- | --- |
| Brasil | Gambiarra Balística | **+50% de cadência** (500 ms → 333 ms), com leve alternância esquerda/direita dos tiros |
| EUA | Munição de Fragmentação | Cada projétil que acerta um inimigo provoca uma explosão de raio 78 px, causando 1,5 de dano aos outros inimigos próximos e destruindo projéteis hostis na área |
| Coreia do Sul | Lightstick Tático | A cada três disparos básicos, solta um feixe de energia na direção da mira, atravessando todos os inimigos alinhados e causando 3 de dano a cada um |
| Rússia | Camarada Canhão | +75% de dano, aplica **recuo gradual** aos inimigos em mergulho (em vez de saltar a posição) |
| China | AliExplode — Frete Grátis | Dois projéteis simultâneos com pequena dispersão |

Os upgrades de **nível 2** já funcionam. O **nível 3** instala a primeira torre mecanizada e já pode ser alcançado na terceira escolha da campanha, **desde que o mesmo país tenha sido escolhido três vezes**. Níveis 4–10 e a segunda torre do nível 7 seguem em planejamento.

## Cinco upgrades de nível 2 (v0.14)

| País | Melhoria | Efeito jogável |
| --- | --- | --- |
| Brasil | **Minha Casa, Meu Escudo** | Amplia o raio de todas as cúpulas ativas em **18 px**, inclusive de torres estrangeiras; caco de vidro + cerca elétrica, choque de **1 de dano** por cúpula com **800 ms de recarga**, lentidão de 10% e faixa de ativação de 35 px |
| EUA | **Dano Colateral** | Quando a Fragmentação destrói um OVNI, ocorre UMA explosão secundária de raio **94 px** e **0,75 de dano**, sem reações em cadeia; maior que os 78 px da Fragmentação básica |
| Coreia do Sul | **Encore!** | Após o feixe violeta, abre uma **fenda de vácuo** com centro escuro e bordas turquesa: ela se expande e permanece por **2,2 s**, causando **1 de dano** uma vez por alvo novo que a atravessar |
| Rússia | **Recuo Estratégico** | Mantém até **2×** o recuo amortecido perto das defesas, agora com **anéis vermelhos de impacto e estilhaços luminosos** que ficam maiores e mais intensos quanto mais próximo do solo estiver o inimigo |
| China | **Compre 2, Leve 3** | O canhão dispara **três projéteis em todas as rajadas**, sem contador, quinta rajada especial ou aviso “GRÁTIS!” |

Os valores são parâmetros provisórios para playtest, não balanceamento final. A ampliação do raio brasileiro aumenta **o alcance da proteção visual e a zona de choque**, mas não aumenta HP do escudo nem cria novas cúpulas. As cercas só descarregam com escudo ativo, têm recarga individual por cúpula e não consomem energia ao atacar.

## Terceiros upgrades — primeiras torres mecanizadas (testáveis no laboratório)

| País | Terceiro upgrade | Torre provisória e efeito |
| --- | --- | --- |
| Brasil | Projeto Caramelo | **Caramelo**: torre automática de tiros frequentes contra invasores próximos |
| EUA | Águia da Liberdade I | **Águia**: mísseis que perseguem o alvo |
| Coreia do Sul | Projeto Kkachi I | **Kkachi**: laser de precisão disparado automaticamente |
| Rússia | Urso de Ferro | **Urso**: Artilharia de Choque com mira preditiva, explosão e empurrão em área |
| China | Panda I — Envio Econômico | **Panda**: pares de minidrones perseguidores |

### Urso de Ferro — Artilharia de Choque

O Urso agora funciona de modo diferente das outras torres:
- Dispara a cada **2 segundos**, dentro de **600 px** de alcance; o tiro é pesado, mas não teleguiado.
- Estima a velocidade atual do alvo e tenta antecipar seu movimento. O projétil também explode se acertar outro inimigo pelo caminho.
- Explode no impacto ou no ponto previsto, com **85 px de raio**: **3,7 de dano** no centro e **2,4 de dano** mais perto da borda.
- Aplica **empurrão amortecido** às naves que sobrevivem; evita o teleporte visual que ocorria com o recuo anterior.
- Tem rastro de fumaça, pequeno recuo da torre ao disparar e tremor discreto da câmera quando a bomba explode.
- A explosão também intercepta projéteis hostis próximos.

O Urso é intencionalmente diferente da **Fragmentação americana**: atira muito mais lentamente, mas controla uma área com explosões mais fortes e empurrão. Os atributos são provisórios e serão ajustados com os testes.

As torres aparecem como **formas coloridas com letras**, ainda sem sprites definitivos. Ocupam uma de duas posições (esquerda e direita), **possuem vida e escudo próprios com regeneração** e podem ser destruídas sem que o jogador perca imediatamente. A destruição do **canhão central** continua sendo a condição de derrota.

O limite global é de **duas torres instaladas**. Se futuramente as duas posições estiverem ocupadas, um upgrade de país que instalaria uma terceira torre fica visível, mas bloqueado. Cada país acumula sua própria quantidade de escolhas, sem pular níveis.

## Laboratório de upgrades

No menu inicial, clique em **TESTAR UPGRADES [U]**. O jogo abre um campo de testes pausado, com cinco cartões. Um seletor no alto do painel permite alternar entre os **níveis 1 e 2** (também pela tecla **N**).

- Clique em um cartão ou use **1–5** para alternar a melhoria do nível mostrado na aba. **N** ou clique no seletor superior para mudar entre **NÍVEL 1** e **NÍVEL 2**.
- Ao ativar um nível 2 no laboratório, o nível 1 do mesmo país é ligado automaticamente. Desativar o nível 1 retira também o nível 2 dependente.
- Clique em **ZERAR MELHORIAS [0]** para voltar ao canhão sem upgrades nem torres.
- **Shift+1–5 no painel** instala ou retira os animais correspondentes, até duas torres simultâneas, para testar combinações sem disputar as escolhas da campanha. O laboratório não altera a campanha.
- Clique em **VOLTAR AO CAMPO [U]**, pressione **U** ou **Esc** para retornar ao combate com a configuração escolhida.
- No campo, pressione **1–5** para gerar os inimigos Tipos 1–5 (2 gera um trio); **Shift+1** gera uma fileira de dez Tipo 1; **Shift+2** gera **dez Tipo 2 circulando em órbita antes de parar e mergulhar**; **Shift+3/4/5** gera as variantes de nível 2. **C** limpa os inimigos e projéteis; **U** reabre o painel.
- Há **barras de vida** nos inimigos resistentes e **números flutuantes de dano** ao acertar. As melhorias têm cores de disparo próprias; a Coreia do Sul solta um feixe violeta de plasma a cada três tiros básicos e os EUA produzem uma explosão azul de fragmentação ao atingir naves.
- O painel e o HUD mostram **tiros por segundo, dano, quantidade de projéteis e presença de fragmentação e Lightstick**. Na campanha com Coreia do Sul, o HUD apresenta o contador de tiros até o próximo Lightstick.
- Além dos invasores básicos automáticos, surgem alvos resistentes (Tipos 2 e 3) para testar o benefício de dano elevado e perfuração.
- Um invasor Tipo 1 aparece automaticamente a cada 2,7 segundos, desde que haja menos de dez em campo.
- O canhão é indestrutível nos dois laboratórios para não interromper os testes. A regeneração do escudo continua visível.
- **R** reinicia o campo de teste mantendo os upgrades básicos e torres instaladas.

Esse modo é **separado da campanha**: não consome escolhas, não habilita níveis futuros e não altera a progressão da Onda 0 / Onda 1.

## Inimigos

- **Tipo 1 — Invasor Básico:** sprite animado, 1 HP, trajetória curva para o escudo do canhão.
- **Tipo 2 — Esquadrão de Formação:** **quadrados roxos**. Nível 1: trio que se posiciona antes de mergulhar. Nível 2: **dez naves giram em círculo**, param numa linha, sinalizam o ataque e depois mergulham.
- **Tipo 3 — Bombardeiro:** **quadrado amarelo/laranja** com 6 HP; paira e atira projéteis interceptáveis (2 HP), depois mergulha.
- **Tipo 4 — Caça Relâmpago:** **quadrado rosa/vermelho** com 4 HP; cruza a tela rapidamente, faz mergulhos e prepara um laser sinalizado.
- **Tipo 5 — Cruzador-Colmeia:** **quadrado ciano** grande com 24 HP no nível 1; paira, dispara projéteis e gera invasores Tipo 1. A transição da descida para o voo lateral é suave. No nível 2, tem mais vida, ataca mais vezes e lança pares de invasores. Nas Ondas 8 e 9, funciona como miniboss, com **52 ou 56 HP** e reforços que herdam a cor e o HP da onda, limitados a 12 invocações.

**Aparência dos Tipos 2–5 é provisória:** quadrados com o número do tipo. O contorno dourado e o sufixo `II` indicam dificuldade 2. O Tipo 1 de nível 2 é levemente dourado e mais rápido. Os níveis 2 dos Tipos 3 e 4 também possuem mais vida e velocidade; o **Bombardeiro II dispara duas bombas convergentes por salva**, e o **Caça Relâmpago II prepara o laser mais rapidamente**. O balanceamento ainda pode mudar.

### Padrões avançados
- **Onda 0:** inimigos Tipo 1 surgem a partir de 0,25 segundo após a contagem, com cadência de 1,28 s e três ataques em grupo; total de 32 OVNIs.
- **Onda 1:** ritmo mais intenso: um básico a cada 0,96 s (32 na sequência), três grupos adicionais simultâneos, trios Tipo 2, uma formação circular avançada e a fileira final de dez Tipo 1. Total de 70 inimigos. A nova distribuição preserva a possibilidade de usar o tiro especial para defender uma área.
- **Entrada dos básicos:** os sprites aparecem mais cedo na borda superior, em vez de percorrer uma área invisível acima da tela.
- **Contagem regressiva:** aparece antes das Ondas 0 e 1; os eventos e o relógio da onda começam após o 1. A pausa também interrompe a contagem. Laboratórios continuam entrando imediatamente.
- **Rússia:** o empurrão agora é uma força amortecida ao longo de vários frames, preservando a trajetória curva e eliminando o salto instantâneo.
- **Teste de inimigos:** surge automaticamente um grupo de dez Tipo 2 em órbita no final da sequência; também pode gerá-lo sob demanda.
- **Níveis 1 e 2 de todos os tipos:** selecionáveis nos laboratórios com teclas numéricas normais ou com Shift.

## Controles

- **Mouse:** mira do canhão (arco superior, limitado a 15° acima das laterais).
- **Botão esquerdo pressionado:** tiros básicos contínuos.
- **Mira circular azul semitransparente:** acompanha o mouse e marca o ponto exato de detonação do tiro especial, incluindo os limites de direção (15°) e alcance (140–580 px). Fica mais apagada durante a recarga e desaparece ao sair da tela do jogo.
- **Botão direito:** lança a bomba especial **até a mira indicada**, onde explode e protege a área durante 3 segundos (recarga 8 segundos). A bomba não explode antes por contato direto com naves ou tiros inimigos durante o voo; a explosão no ponto marcado ainda atinge essas ameaças.
- **Esc ou P:** pausar/retomar.
- **R:** reinicia o modo atual, preservando o histórico de escolhas e torres da campanha.
- **Enter:** começar pelo menu.
- **T:** entrar no laboratório de inimigos pelo menu.
- **U (no menu):** entrar no laboratório de upgrades.
- **U (no laboratório de upgrades):** abrir/fechar o painel para alterar melhorias instantaneamente.
- **1–5 (qualquer laboratório em combate):** gerar inimigos de nível 1; **Shift+1–5** gera nível 2 (Shift+1 = fileira; Shift+2 = círculo com dez naves); **C** limpa o campo.
- **1–5 (painel do laboratório):** ativar/desativar o nível 1 ou 2 do país, conforme a aba; **N** troca a aba; **Shift+1–5** instala/remove a torre do respectivo país; **0** zera todos os upgrades e torres.
- **Clique nos cartões:** escolher aliado após a Onda 0.

## Estrutura técnica

- `src/scenes/MenuScene.js` — menu inicial e laboratório.
- `src/scenes/GameScene.js` — Ondas 0–9, laboratório, torres automáticas e combate.
- `src/scenes/UpgradeScene.js` — cinco cartões de escolha na campanha.
- `src/scenes/UpgradeLabScene.js` — painel de upgrades acumuláveis e substituíveis em campo de teste.
- `src/scenes/PauseScene.js` — pausa, reinício e menu.
- `src/gameplay/upgrades.js` — primeiros efeitos reais das melhorias.
- `src/gameplay/progression.js` — histórico das escolhas por país, nível 2 sem torres, primeiras torres no nível 3, bloqueios e transições de ondas.
- `src/gameplay/secondUpgrades.js` — cinco melhorias de nível 2, parâmetros de alcance e regras puras de dano, recuo e promoções.
- `src/gameplay/towers.js` — cinco perfis de torres, suas armas, alcance e aquisição de alvos.
- `src/gameplay/shockArtillery.js` — mira preditiva, colisão contínua, dano da explosão e deslocamento amortecido do Urso.
- `src/gameplay/enemies.js` — definições dos cinco tipos, níveis de dificuldade, matemática do círculo, fileira e movimento suave do Cruzador-Colmeia.
- `src/gameplay/waves.js` — agenda das Ondas 0–9 e laboratórios.
- `src/gameplay/advancedWaves.js` — agendas das Ondas 5–9, com escoltas, leques, círculos e miniboss.
- `src/gameplay/combat.js` e `src/gameplay/specialBlast.js` — regras matemáticas de mira, dano e explosão persistente.
- `src/gameplay/weaponEffects.js` — intervalos, alinhamento de laser e alcance da Fragmentação.
- `tests/` — testes automatizados das regras, incluindo padrões, dificuldade, continuidade do Cruzador-Colmeia e diferenças de upgrades.
- `.github/workflows/checks.yml` — testes e build automáticos no GitHub.

## Documento de design

[GDD no Google Docs](https://docs.google.com/document/d/1pEUznP_ckv5UFM_jNl8M3KIh0l2A-ebswir4bkLb0lo/edit).

O [repositório do GitHub](https://github.com/gabelsqt/jogo-da-soberana) é privado enquanto o protótipo estiver sendo desenvolvido.
