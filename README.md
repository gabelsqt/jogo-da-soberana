# Soberania — Jogo para a Soberana Game Jam

Jogo arcade de defesa antiaérea em pixel art ambientado no Rio de Janeiro, inspirado em **Missile Command** e **Utopia Must Fall**.

> **Protótipo 0.14** — ajustes de playtest dos cinco upgrades de nível 2: escudos brasileiros maiores e choque com recarga, Dano Colateral ampliado, Corte Residual como fenda de vácuo turquesa duradoura, impacto russo mais expressivo e três tiros chineses em todas as rajadas. A primeira torre segue no **nível 3** (somente laboratório até a Onda 3 existir); a segunda permanece prevista para o **nível 7**. A campanha ainda termina na Onda 2.

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

Para publicação no itch.io, compacte **o conteúdo de `dist/`**, não a pasta inteira, e selecione jogo HTML5.

## Fluxo jogável nesta versão

1. Menu inicial → **Começar**.
2. **Onda 0:** contagem regressiva **3, 2, 1** antes de começar; **32 invasores Tipo 1** (20 em sequência, a cada 1,28 s, mais três grupos simultâneos de 3, 4 e 5). O primeiro aparece 0,25 s após a contagem; continua sendo possível perder.
3. Após concluir a Onda 0, aparecem cinco cartões para escolher **um upgrade inicial**.
4. **Onda 1:** nova contagem **3, 2, 1**; são **70 inimigos**: 32 invasores básicos em sequência (a cada 0,96 s), grupos simultâneos com 3, 4 e 5 básicos, dois trios Tipo 2, um ataque circular de dez Tipo 2 avançados e uma **fileira final de dez OVNIs Tipo 1**, ocupando a largura do céu. A onda só termina depois que todas as ameaças são neutralizadas.
5. Ao vencer a Onda 1, surge a **segunda escolha de país**. Cada cartão oferece o próximo upgrade daquele país: se repetir um país, ganha sua **melhoria de nível 2**, SEM instalar torre; se mudar de país, recebe o primeiro upgrade do novo aliado. O escudo elétrico brasileiro, por exemplo, pode ser testado escolhendo Brasil duas vezes.
6. **Onda 2:** contagem regressiva 3–2–1, 80 inimigos programados com bombardeiros (Tipo 3) e caças relâmpago (Tipo 4), além dos básicos e formações. Termina em uma tela de conclusão provisória; as Ondas 3–11 virão depois.
7. **Testar inimigos**, no menu inicial, apresenta os Tipos 2–5 e seus padrões.
8. **Testar upgrades** abre laboratório independente e agora permite testar também as cinco torres sem passar pelas ondas.

## Cinco upgrades iniciais

| País | Upgrade | Efeito no protótipo |
| --- | --- | --- |
| Brasil | Gambiarra Balística | +25% de cadência (500 ms → 400 ms) |
| EUA | Munição de Fragmentação | Cada projétil que acerta um inimigo provoca uma explosão de raio 78 px, causando 1,5 de dano aos outros inimigos próximos e destruindo projéteis hostis na área |
| Japão | Katana de Plasma | A cada três disparos básicos, solta um feixe de energia na direção da mira, atravessando todos os inimigos alinhados e causando 3 de dano a cada um |
| Rússia | Camarada Canhão | +75% de dano, aplica **recuo gradual** aos inimigos em mergulho (em vez de saltar a posição) |
| China | AliExplode — Frete Grátis | Dois projéteis simultâneos com pequena dispersão |

Os upgrades de **nível 2** já funcionam. O nível 3 foi definido para liberar a **primeira torre**, mas a terceira escolha de campanha e a Onda 3 ainda não estão disponíveis; níveis 4–10 seguem em planejamento.

## Cinco upgrades de nível 2 (v0.14)

| País | Melhoria | Efeito jogável |
| --- | --- | --- |
| Brasil | **Minha Casa, Meu Escudo** | Amplia o raio de todas as cúpulas ativas em **18 px**, inclusive de torres estrangeiras; caco de vidro + cerca elétrica, choque de **1 de dano** por cúpula com **800 ms de recarga**, lentidão de 10% e faixa de ativação de 35 px |
| EUA | **Dano Colateral** | Quando a Fragmentação destrói um OVNI, ocorre UMA explosão secundária de raio **94 px** e **0,75 de dano**, sem reações em cadeia; maior que os 78 px da Fragmentação básica |
| Japão | **Corte Residual** | Após a Katana roxa, abre uma **fenda de vácuo** com centro escuro e bordas turquesa: ela se expande e permanece por **2,2 s**, causando **1 de dano** uma vez por alvo novo que a atravessar |
| Rússia | **Recuo Estratégico** | Mantém até **2×** o recuo amortecido perto das defesas, agora com **anéis vermelhos de impacto e estilhaços luminosos** que ficam maiores e mais intensos quanto mais próximo do solo estiver o inimigo |
| China | **Compre 2, Leve 3** | O canhão dispara **três projéteis em todas as rajadas**, sem contador, quinta rajada especial ou aviso “GRÁTIS!” |

Os valores são parâmetros provisórios para playtest, não balanceamento final. A ampliação do raio brasileiro aumenta **o alcance da proteção visual e a zona de choque**, mas não aumenta HP do escudo nem cria novas cúpulas. As cercas só descarregam com escudo ativo, têm recarga individual por cúpula e não consomem energia ao atacar.

## Terceiros upgrades — primeiras torres mecanizadas (testáveis no laboratório)

| País | Terceiro upgrade | Torre provisória e efeito |
| --- | --- | --- |
| Brasil | Projeto Caramelo | **Caramelo**: torre automática de tiros frequentes contra invasores próximos |
| EUA | Águia da Liberdade I | **Águia**: mísseis que perseguem o alvo |
| Japão | Projeto Tsuru I | **Tsuru**: laser de precisão disparado automaticamente |
| Rússia | Urso de Ferro | **Urso**: Artilharia de Choque com mira preditiva, explosão e empurrão em área |
| China | PandaPrime I — Envio Econômico | **PandaPrime**: pares de minidrones perseguidores |

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
- **Shift+1–5 no painel** instala ou retira os animais correspondentes, até duas torres simultâneas, para testá-los **antes de a Onda 3 existir**. O laboratório não altera a campanha.
- Clique em **VOLTAR AO CAMPO [U]**, pressione **U** ou **Esc** para retornar ao combate com a configuração escolhida.
- No campo, pressione **1–5** para gerar os inimigos Tipos 1–5 (2 gera um trio); **Shift+1** gera uma fileira de dez Tipo 1; **Shift+2** gera **dez Tipo 2 circulando em órbita antes de parar e mergulhar**; **Shift+3/4/5** gera as variantes de nível 2. **C** limpa os inimigos e projéteis; **U** reabre o painel.
- Há **barras de vida** nos inimigos resistentes e **números flutuantes de dano** ao acertar. As melhorias têm cores de disparo próprias; o Japão solta uma lâmina violeta de plasma a cada três tiros básicos e os EUA produzem uma explosão azul de fragmentação ao atingir naves.
- O painel e o HUD mostram **tiros por segundo, dano, quantidade de projéteis e presença de fragmentação e Katana**. Na campanha com Japão, o HUD apresenta o contador de tiros até a próxima Katana.
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
- **Tipo 5 — Nave-Mãe:** **quadrado ciano** grande com 24 HP no nível 1; paira, dispara projéteis e gera invasores Tipo 1. A transição da descida para o voo lateral agora é suave, sem o salto horizontal; no nível 2, possui mais vida, ataca mais vezes e **lança pares de invasores de nível 2**.

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
- **Botão direito:** bomba especial que protege a área durante 3 segundos (recarga 8 segundos).
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
- `src/scenes/GameScene.js` — Onda 0, Onda 1, laboratório e combate.
- `src/scenes/UpgradeScene.js` — cinco cartões de escolha na campanha.
- `src/scenes/UpgradeLabScene.js` — painel de upgrades acumuláveis e substituíveis em campo de teste.
- `src/scenes/PauseScene.js` — pausa, reinício e menu.
- `src/gameplay/upgrades.js` — primeiros efeitos reais das melhorias.
- `src/gameplay/progression.js` — histórico das escolhas por país, nível 2 sem torres, primeiras torres no nível 3, bloqueios e transições de ondas.
- `src/gameplay/secondUpgrades.js` — cinco melhorias de nível 2, parâmetros de alcance e regras puras de dano, recuo e promoções.
- `src/gameplay/towers.js` — cinco perfis de torres, suas armas, alcance e aquisição de alvos.
- `src/gameplay/shockArtillery.js` — mira preditiva, colisão contínua, dano da explosão e deslocamento amortecido do Urso.
- `src/gameplay/enemies.js` — definições dos cinco tipos, níveis de dificuldade, matemática do círculo, fileira e movimento suave da Nave-Mãe.
- `src/gameplay/waves.js` — agenda das Ondas 0, 1, 2 e dos laboratórios.
- `src/gameplay/combat.js` e `src/gameplay/specialBlast.js` — regras matemáticas de mira, dano e explosão persistente.
- `src/gameplay/weaponEffects.js` — intervalos, alinhamento de laser e alcance da Fragmentação.
- `tests/` — testes automatizados das regras, incluindo padrões, dificuldade, continuidade da Nave-Mãe e diferenças de upgrades.
- `.github/workflows/checks.yml` — testes e build automáticos no GitHub.

## Documento de design

[GDD no Google Docs](https://docs.google.com/document/d/1pEUznP_ckv5UFM_jNl8M3KIh0l2A-ebswir4bkLb0lo/edit).

O [repositório do GitHub](https://github.com/gabelsqt/jogo-da-soberana) é privado enquanto o protótipo estiver sendo desenvolvido.
