# Game Soberana v0.49 — Foco, ofensiva e Cubo News
Data: 19/10/2026
Branch: `feat/brasil2-arraial-balístico` (sem alterações na `main`).

## Decisões 147–169: registro final
147-A: retirar melhorias de escudo e manter os 50 upgrades ofensivos. 148-C: domo padrão 180% do raio anterior, visual e colisão. 149-C: protagonista é um funcionário público do RJ nomeado por acidente, após vingança de uma pessoa de SP com quem se relacionava por causa de “biscoito” versus “bolacha”; nunca especificar o gênero da pessoa. 150-B: vinheta Cubo News de 20–25 segundos. 151-C: ondas 0, 1 e 2 com mais grupos e pressão antecipada, tipos 1 e 2 atiram quando param no ar. 152-A: zero novos spawns após 15 segundos decorridos nas ondas comuns, coreografias simétricas. 153-A: Lightstick mais lento e com rastro luminoso. 154-A: Cubo News elogia a cultura de cada país que apoia o Brasil, e a condena após a traição. 155-A: barreira e quatro escudos dos módulos do Tipo 6 são preservados.

156-A ajustada: término provocado pela pronúncia carioca “biscoito” diante de ex de São Paulo que prefere “bolacha”; não empregar a antiga versão burocrática como motivo central. 157-B ajustada: nome aparece primeiro, plantão sobre o primeiro contato, mensagem pessoal de vingança, portaria de mesário que se converte em linha sucessória do comando após baixas militares. 158-A: domo 180% também na colisão. 159-B ajustada: não inventar upgrades novos, basta preservar as melhorias ofensivas já existentes nos especiais e remover quaisquer efeitos/legendas defensivos; nenhum outro balanceamento especial agora. 160-B: senoides/círculos/espirais sincronizados. 161-C: Tipo 1 atira uma bala e Tipo 2 uma salva anunciada de duas balas; projéteis interceptáveis de dimensões maiores. 162-A: após entrar no campo de batalha, inimigos não devem sumir acima da área útil da tela. 163-B: Lightstick precisa de 100% mais acúmulo para ativar. 164-B ajustada: últimos 15 segundos são de pressão, últimos 10 segundos não há dança nem coreografia, só ataques.

165-C: nome lembrado pelo navegador e editável; se vazio, sorteio dentre 20 nomes masculinos e 20 femininos comuns, sem pedir gênero. 166-A: plantão ilustrado com manchetes e botão de pular. 167-C: recuo cinematográfico com nascer do sol **exatamente quando o cronômetro atingir zero**, nunca antes; arte definitiva do Rio amanhecendo será fornecida posteriormente. 168-B: naves aproximam-se de forma direta para ataques coordenados. 169-A: projéteis inimigos têm largura, altura e colisão ampliadas em 150%.

## Implementação — combate
- O bug dos projéteis comuns no Tipo 6 foi tratado com **colisão contínua no segmento por quadro**, respeitando a barreira frontal, os escudos individuais dos quatro módulos, a destruição e a exposição do núcleo.
- A onda 11 recebe proteções contra quedas/travamentos com China e Coreia: limite simultâneo de 140 projéteis convencionais, geometria procedural do Tipo 6 desenhada no máximo a 30 fps sem reduzir os passos de física, somente oito feixes visuais de reflexos por pulso preservando todos os danos, prevenção de duplicidade de um mesmo chefão ativo.
- `shieldDome049.js` contém a geometria semicircular do canhão (111,6 px de raio), interceptação de projéteis por segmento, quatro cores baseadas no HP e independência de país. As estatísticas da campanha deixam de aplicar bônus defensivos; projéteis especiais ofensivos preservados, incluindo multiplicadores de dano, recarga e efeitos nos inimigos.
- Lightstick coreano v1 é lançado a cada duas vezes a cadência de acúmulo anterior, mantendo o dano e o alcance. O traço luminoso mantém rastros/efeitos existentes.
- Normalização de spawns para até 13,5 segundos após iniciar a onda, com proteção de portais para impedir chegada real depois de 15 segundos. Novos grupos tipo 1 e 2 chegam mais cedo, com movimento síncrono e salvas interceptáveis. Ao restarem dez segundos abandonam dança e começam ataque direto. Tipo 3 recua somente até y=95; outros inimigos também devem permanecer na área útil.
- Quando ondas 0–9 atingem zero, o combate congela, projéteis hostis são limpos, nasce a luz do sol, as naves recuam e só depois aparece o resultado de sobrevivência. Vitória antecipada por eliminação total continua permitida, sem disparar a vinheta do amanhecer antes de zero.

## Implementação — narrativa e UI
- Em `playerIdentity.js`, sorteio entre 40 nomes brasileiros, persistência sob `soberana.playerName.v049`; formulário DOM com entrada editável. Ao confirmar, MenuScene inicia IntroScene.
- `introScript.js` define cinco quadros de 4,5 s: primeiro contato, Cristo e etiqueta extraterrestre, ataques noturnos, vingança por “bolacha/biscoito”, nomeação por escala de mesários. Sem atribuir gênero ao ex. IntroScene usa layouts ilustrados provisórios, pular em clique ou Escape/Enter.
- Kim Lin Doo, representante coreano, explica BTS como **Batalhão Tático de Seul** repetidamente.
- Cubo News e menus da campanha usam **IBM Plex Sans**, verde-petróleo `#134B45`, ouro `#EDC75A`, creme `#F5F0DC` e grafite `#152926`. Abandonado o texto pixelado do HUD/menus; pixel art permanece no cenário, naves e efeitos. Fonte é carregada do Google Fonts quando há internet, fallback system-ui offline no itch.io.
- Notícias específicas para EUA, Coreia, Rússia e China elogiam gastronomia, cinema, música e costumes conforme se acumulam upgrades; na traição, a Cubo News nega o próprio arquivo e ridiculariza os antigos elogios. Notícias do Cristo continuam otimistas nas ondas 0–9.

## Observações para o playtest
- Nomes, intro, legibilidade e tempo de leitura precisam de teste visual em navegador.
- A futura arte do amanhecer não está presente: foi usado um efeito de luz provisório substituível.
- Manter abertura de onda “Tempo até o amanhecer”, zoom 1,48×, pausa 2,2 s, pullback 1,75 s.
- Balanço final dos novos tiros inimigos e versões China/Coreia do chefão demanda playtest manual, além dos testes automatizados.
