# GDD — Fortaleza de Cerco (Inimigo Tipo 6) — decisões 1–101

> **Atualização de planejamento e implementação:** v0.44, 19/10/2026. Este documento substitui as regras provisórias da v0.42. A identidade visual procedural e alguns acabamentos nacionais ainda são protótipos; não confundir planos aprovados com assets finais.

## Premissas e encontro
- Chefão colossal horizontal na parte superior, com núcleo central, quatro módulos destrutíveis e movimento horizontal suavizado.
- Cinco variantes: alienígena, EUA, Coreia do Sul, Rússia e China. Um único país participante é sorteado como traidor na onda 11, sem coalizões.
- Canhão brasileiro **fixo**, sem esquiva por movimento; a defesa depende de interceptar bombas/naves, interromper armas durante a carga, mirar nas peças e usar escudo.
- O cronômetro **só começa após a entrada e quando o chefão é alvejável**. A abertura cinematográfica não gasta tempo. A batalha dos chefões tem duração-base de 60 s.
- Na entrada: quatro segundos de vulnerabilidade inicial sem a grande barreira frontal. Gerador anima acúmulo e descarga ao erguer o primeiro escudo.
- As cinco entradas aprovadas: alienígena desce cobrindo as estrelas; EUA com escoltas precedendo o porta-aviões; Coreia materializa-se em pixels e hologramas; Rússia emerge de nevasca; China chega precedida por enxame de reconhecimento. Escoltas de apresentação são cosméticas.

## Módulos, escudos e acertos
Módulos e posições fixos em todos os países, da esquerda para a direita:
1. **Bombardeio Pesado** — externo esquerdo. Lança uma Bomba Colossal por turno.
2. **Laser de Cerco** — interno esquerdo. Laser contínuo com carga interrompível.
3. **Hangar de Invasores** — interno direito. Lança grupos de inimigos existentes do **Tipo 3**.
4. **Gerador de Escudos** — externo direito. Projeta e reconstrói barreira frontal.

- Os quatro módulos possuem **igual HP de estrutura**; cada um conserva escudo individual destrutível e sem regeneração. Barra de vida dos módulos é proibida; usar cor, estilhaçamento e danos visuais (rachaduras, faíscas, fumaça).
- Grande barreira frontal translúcida (azul; roxo-prismático na versão coreana), cobrindo **todos os módulos, inclusive o gerador**, e o núcleo. Bloqueia integralmente tiros comuns, especiais, explosões e lasers: nenhum dano atravessa enquanto ativa. Escudo frontal HP = **30% do HP de um módulo**.
- Barreiras ativas perdem cor em direção ao **vermelho**, racham, sofrem falhas e estilhaçam brevemente ao chegar a zero; sem barra de HP.
- Depois de destruída, o gerador pode reconstruir a barreira **no seu próximo turno**, com animação de acúmulo durante **6 segundos** e restauração a **100% de HP**.
- A reconstrução só é cancelada por destruição **completa do módulo gerador**, não por dano parcial. Se destruído com a barreira ativa, a barreira entra em colapso imediatamente; novos escudos tornam-se impossíveis.
- A barreira é **unidirecional**: as próprias armas da fortaleza e os Tipo 3 saem normalmente, criando ondulações ao atravessar.
- Ataques em área danificam o núcleo se sua área realmente alcançar a hitbox vermelha; os impactos no casco fora do núcleo continuam ineficazes.

## Ataques e turnos
- Sequência fixa dos módulos sobreviventes: **Hangar → Bombardeio → Laser → Gerador**, repetida. Apenas **um ataque principal de cada vez**.
- Pausa normal de **1 segundo** entre turnos. Quando o gerador recebe seu turno e a barreira já está intacta, **pula imediatamente**. Módulos destruídos são ignorados sem acelerar o ritmo dos remanescentes.
- Luzes e animações do **próprio módulo** anunciam o próximo ataque. Sem marcadores persistentes extras no HUD.
- O dano e a destruição dos módulos removem gradualmente as capacidades de ataque; nenhum enrage, bônus oculto ou aumento da frequência dos sobreviventes.
- Projetéis **já disparados** permanecem ativos após a destruição de um módulo.

### Bomba Colossal
- **Uma bomba** enorme, lenta, com HP = **25% do HP de um módulo**.
- Desce em **7 segundos**, mirando o canhão fixo; impacto causa dano elevado.
- Pode ser interceptada com disparos normais ou explosões (dano integral), detonando em área e podendo explodir outros projéteis hostis próximos, inclusive bombas em cadeia. Não causa dano ao canhão quando destruída no ar.

### Laser de Cerco
- **10 segundos** de carga vermelha crescente, anunciada claramente.
- Para interromper antes do disparo, é preciso quebrar primeiro a barreira frontal, remover eventual escudo individual e causar ao **módulo** dano de **25% de seu HP máximo durante a carga atual**. Dano estrutural permanece; progresso da interrupção reinicia a cada carga.
- Interrompido: sobrecarga, faíscas e **perda do turno**. Na próxima oportunidade começa nova carga.
- Se não interrompido: feixe **contínuo de 3 segundos**, dano muito frequente ao canhão estático.
- Durante a emissão, apenas **destruir completamente o módulo** interrompe antecipadamente o laser. Dano parcial já não interrompe.

### Hangar
- Preparação com luzes e comportas por **2 segundos**; lança o grupo **simultaneamente**. Se destruído durante a preparação, o lançamento é cancelado.
- Base: **3 inimigos Tipo 3 por lançamento**, com máximo de **6** ativos provenientes do hangar; apenas libera grupo inteiro se houver vagas.
- Os Tipo 3 lançados continuam lutando quando o hangar é destruído. Quando o núcleo da fortaleza é destruído, todos os invasores remanescentes explodem na sequência final.
- **China:** exceção de **10 Tipo 3 por lançamento**, saída simultânea e abertura em leque, até **30** ativos simultâneos, cada um com **100% do HP normal**. Aguarda até haver 10 vagas antes de novo grupo. Formações exibem efeitos elétricos e coordenação visual.

## Núcleo e vitória
- Só fica exposto após **destruir os quatro módulos**. Blindagem central se abre mecanicamente ao longo de **2 segundos**; núcleo recebe dano quando aparece.
- Apenas a hitbox central vermelha recebe dano de impactos diretos ou de área que a alcancem; HP do núcleo = **100% do HP de um módulo**.
- Núcleo indefeso: **nenhum ataque novo** após exposição. Bombas e invasores que já estiverem no campo continuam ameaçando o canhão.
- Ao chegar a zero HP, **vitória imediata**, cronômetro para. A explosão cinematográfica dura **6 segundos**; projéteis e invasores restantes são eliminados.
- Diferentes destruições: alienígena reação vermelha em cadeia ao núcleo; EUA pista do porta-aviões se parte; Coreia detonação prismática rosa/roxa/azul terminando branca; Rússia tempestade de gelo e explosão azul; China efeito dominó industrial.

## Superarma e fim do prazo
- Aos **últimos 5 segundos**, o núcleo central carrega uma superarma. Nenhum **novo** ataque comum começa; ataques existentes terminam.
- Apenas destruir o **núcleo** cancela a superarma. No fim do prazo, disparo cinematográfico monumental contra o canhão, interferência e derrota.
- Superarmas: alienígena raio aniquilador vermelho; EUA ogiva energética convertida em coluna luminosa; Coreia arco-íris em raio branco iridescente; Rússia espiral de gelo com raio azul; China cabos energizam o núcleo que lança raio dourado.
- Alerta de Cubo News: cronômetro vermelho pulsante, sirene contínua e substituição da manchete por plantão desesperado.

## Identidades nacionais
- **Alienígena:** fortaleza orbital industrial em grafite, placas e torres, núcleo vermelho.
- **EUA:** porta-aviões voador, casco naval futurista, pistas e silos. Bomba substituída por **míssil gigantesco de trajetória direta**, capaz de destruir instantaneamente um canhão **sem proteção**.
- **Coreia do Sul (chave interna `jp`):** branco/preto, neon rosa/roxo, holografia, laser prismático e barreira roxa com brilhos iridescentes.
- **Rússia:** couraçado do Ártico, gelo, blindagem/submarino. Bomba criogênica destrói escudo brasileiro e **congela o canhão por 2 s**, com cristal grande visível ao redor do canhão.
- **China:** megafábrica aérea, esteiras, guindastes, hangares. Bomba com visual de **drone único com contêiner integrado**, interceptável como bomba, além de enxame de dez Tipo 3.
- Escudos brasileiros, independentemente da origem do upgrade, passam por **azul → verde → amarelo → vermelho**, estilhaçando rapidamente quando esgotados.

## Balanceamento inicial
- Vida estrutural de módulos iguais; núcleo igual a um módulo; barreira frontal 30%; bomba colossal 25%.
- Os valores absolutos de HP, danos e escalas de sprite são ajustáveis durante playtest, sem alterar as proporções aprovadas.
- O modo **Full Brazil** mantém onda 10 difícil e **onda 11 de Revanche Brasileira fácil**, contra nova frota alienígena incluindo fortaleza mais fraca e melhorias temporárias de ofensiva nacional.
- Sem torres de apoio de animais na versão inicial: esse conceito fica para versão futura (código legada existente não implica aprovação para V1).

## Status e pendências
- **Motor da v0.44:** estrutura comum, escudos, turno, entrada/timer, bomba, laser, hangar, núcleo, superarma e integração inicial à Cubo News.
- **Visuais provisórios:** desenho vetorial das cinco variantes e efeitos iniciais; sprites definitivos, cinematografias de entrada específicas, decomposição de destroços e efeitos nacionais completos exigem arte/iteração adicional.
- **Testes de balanceamento:** aferir dificuldade real em 60 s e estabilidade com 30 invasores chineses; taxas base provisórias dos escudos individuais e dano real do feixe.
- Consultar também **GDD.md**, seção Cubo News para redação, interface e textos aprovados.


## Interface de transmissão v0.45 (revisão do lower third)
A faixa da Cubo News **não cobre mais** os 960×540 pixels da cena. É uma camada HTML de **44 pixels lógicos adicionada externamente abaixo do canvas**, com manchete prata e texto rolante em faixa vermelha. O canhão permanece em (480, 494), acima da nova faixa, assim como os prédios; não modificar colisões por motivos de HUD. Cronômetro na direita, maior, transparente e sem moldura. Nos últimos 5 s pisca em vermelho e substitui a notícia por alerta. Zoom e screenshake de combate ou derrota afetam somente a cena, nunca o noticiário externo. Detalhes em `docs/GDD.md` e `docs/versao-0.45.md`.


## Apresentação de ondas v0.46
Antes das ondas 10/11 (e de qualquer onda comum), apresentar **“TEMPO ATÉ O AMANHECER”** com `30` ou `60` em fonte pixel bitmap gigante no centro da tela. O número desliza até a posição grande do cronômetro externo da Cubo News e **só então a onda começa**. A lógica já aprovada permanece: no encontro Tipo 6 o relógio congela durante a entrada cinematográfica do chefão e só conta quando ele fica alvejável. Nas ondas 0–9, o noticiário mantém tom aliviado e confiante devido à falsa promessa de retirada dos invasores ao amanhecer, condicionada ao Cristo Redentor (“Líder Supremo”) cruzar os braços; o impasse é permanente.


## v0.47 — Refinamento de vinheta inicial
A entrada de qualquer onda apresenta `TEMPO ATÉ O AMANHECER` com zoom real de 1,48× no palco, número ampliado e pausa de 2,2 segundos para leitura. A câmera recua até o padrão em 1,75 segundos, enquanto o número se recolhe com fade suave até o relógio externo. **Este efeito não consome o relógio de combate.** O Tipo 6 segue congelando a contagem até ficar alvejável. A faixa jornalística continua independente da câmera no restante da onda.


## v0.49 — Tiros normais e proteção contra travamento
- Corrigido tunneling dos projéteis comuns ao atravessar um módulo Tipo 6 em um único frame. A colisão agora examina o **segmento da trajetória** entre posição anterior e posição atual, e entrega dano à barreira frontal, escudo do módulo, estrutura ou núcleo exposto conforme estado; todos os países preservam o mesmo motor de encontro.
- A barreira principal e os quatro escudos individuais **não foram removidos**: a simplificação de escudos da v0.49 se aplica somente aos upgrades defensivos do canhão brasileiro e aliados.
- Travas de desempenho para megafábrica chinesa e fortaleza neon coreana: renderização do casco em até 30 fps com ataque atualizado em plena cadência, limite de 140 tiros hostis convencionais na tela, agregação dos traços visuais de reflexo, e prevenção de Type 6 duplicado. Danos e contadores continuam independentes do desenho, sem sacrificar o cálculo de projéteis disparados.
- Testes automatizados incluem colisão contínua em cinco variantes (alien, EUA, Rússia, Coreia, China), integridade de barreira/módulos/núcleo e verificações contra regressão dos limites de desempenho. Necessário confirmar também em jogatina real.

## Decisão implementada: feedback de dano no Tipo 6 (v0.51)
Acertos com dano efetivo produzem flash localizado no módulo/núcleo, tremor curto apenas no desenho, e efeitos de impacto maiores. Preservar hitboxes, HP, dano e cadência. Testar localmente no laboratório após git pull.
