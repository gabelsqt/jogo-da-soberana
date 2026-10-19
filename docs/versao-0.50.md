# Game Soberana v0.50 — Boteco diurno, Cubo News noturna e expediente do protagonista

Data: 19/10/2026
Branch: `feat/brasil2-arraial-balístico`. Não alterar `main`.

## Objetivo
Prioridade a **mecânica e arte**, com textos narrativos **provisórios**, para polimento específico antes do lançamento. Nenhum novo sistema de escudo nem mudança de balanceamento dos tiros especiais.

## Correção prioritária — Brasil nível 10 × inimigo Tipo 6
- A metralhadora do Brasil nível 10 dispara balas físicas densas, direcionadas frequentemente ao centro do casco. Como os quatro módulos do Tipo 6 têm intervalos entre hitboxes, o tiro acertava o centro visual da nave, mas era absorvido pelo casco sem reduzir qualquer escudo/HP.
- `type6BulletContact` mantém colisão contínua, barreira frontal e os quatro escudos/módulos. Depois de atingir o casco, se não encontrou uma hitbox de módulo direto, resolve o impacto no **módulo vivo mais próximo da trajetória**. O núcleo exposto mantém prioridade e sua vulnerabilidade definida.
- Teste automatizado com estatísticas reais do Brasil nível 10, tiros que passam pelo centro, perda de escudo do módulo, barreira e núcleo exposto. Não houve alteração no dano básico, cadência ou velocidade do tiro especial.

## Decisões 170–172 — Boteco diurno
- A imagem fornecida pelo usuário foi convertida para WebP de **960×540**, incorporada a `public/assets/cenario/boteco_dia.webp`, sem alterar sua composição. É usada na cena `UpgradeScene` e incluída pelo exportador HTML único do itch.io.
- Cinco retratos provisórios sobre as cadeiras, alinhados em x=116, 298, 480, 662 e 844. Países: Brasil, EUA, Coreia do Sul, Rússia, China. Retratos finais ainda pendentes; placeholders têm silhuetas e nome/emblema.
- Ao clicar em um: escurece todo o cenário, reduz o brilho dos outros retratos; o selecionado anima em 320 ms até x=155, y=163, escala 1,47. Painel simultâneo com **flavor** (história provisória) e **nome/explicação mecânica real do upgrade**.
- Área abaixo do diálogo reservada para futura prévia animada; sem gerar vídeos ou programar sua reprodução agora. Aceitar confirma a aliança; Voltar cancela a seleção. Teclas 1–5, ENTER e ESC continuam funcionando.
- Histórias dos representantes vão sendo reveladas progressivamente a cada duas melhorias, sem textos definitivos. Brasil: rojões de festa junina confundidos com foguetes; EUA: milhas para sala VIP confundidas com patente; Coreia: Kim Lin Doo, músico de K-pop obrigado a se alistar e promovido a general contra sua vontade; Rússia: congelamento bancário confundido com armas de gelo; China: logística e avaliações cinco estrelas transformadas em patente por algoritmo. O BTS continua significando **Batalhão Tático de Seul**, segundo Kim.

## Decisões 173–175 — Cubo News escura
- Reverte-se a identidade brilhante verde/ouro da v0.49. Paleta **Azul-noturno jornalístico**: fundo `#0B1621`, painéis `#193043`, texto `#DCE8EE`, âmbar `#E2A45E`, vermelho de emergência `#C45151`.
- IBM Plex Sans para interface e manchetes, IBM Plex Mono para números. O relógio volta a ser **grande e discreto, sem moldura**, agora em `11.4cqw`, mantendo só segundos e HUD externo independente da câmera.
- Menus usam os componentes compartilhados, com botões secundários em azul-aço e primários em âmbar. Não restaurar fontes pixeladas para textos de interface.

## Decisões 176–178 — Visual novel do expediente
- O jogador seleciona "Começar campanha" no menu principal e é levado ao computador velho de sua repartição, não a um modal de cadastro da emissora. Login usa input HTML acessível e salva o nome no navegador; vazio sorteia um dos 40 nomes brasileiros previstos.
- Após login, aparece uma área de trabalho de PC antigo. O jogador deve **clicar para abrir o site da Cubo News**; somente então começa uma visual novel de 24 segundos (6 quadros × 4 segundos).
- Quadros automáticos permitem avanço por clique, ESPAÇO ou ENTER; ESC ou botão visível pula a introdução. O login não está sujeito a limite de tempo.
- Sequência: notícia da chegada dos ETs; diálogo DIRETO dos extraterrestres indignados com braços abertos do Cristo; etiqueta alienígena de não atacar durante o dia; falsa segurança da Cubo News; mensagem de vingança da pessoa de SP que terminou o relacionamento por causa de biscoito/bolacha e inscreveu o protagonista como mesário; por baixas na cadeia de comando, a escala vira lista de generais.
- A pessoa que terminou o relacionamento **não recebe gênero**. São placeholders narrativos intencionalmente provisórios. Humor e diálogos serão revisados integralmente em uma etapa final antes do lançamento.

## Validação / limites
- Testes: colisões físicas, retratos/cadeiras, arquivo real da imagem, interface de foco, cinco histórias, narrativas, cronômetro e abertura, progressão.
- Arte dos retratos e vídeo de upgrade são placeholders explícitos; dependem de ativos definitivos que virão depois.
- Avaliação visual em navegador permanece obrigatória para sobreposição dos retratos, legibilidade dos painéis e navegação responsiva. Publicação em Pages após CI verde.
