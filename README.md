# Soberania — Jogo para a Soberana Game Jam

Jogo arcade de defesa antiaérea em pixel art ambientado no Rio de Janeiro, inspirado em **Missile Command** e **Utopia Must Fall**.

> **Protótipo 0.7** — upgrades com efeitos visuais e medidores, dois níveis de dificuldade dos cinco tipos, fileira final na Onda 1 e esquadrão circular de dez inimigos Tipo 2. Ainda **não** implementa as ondas 2–11, os upgrades de nível 2–10, as torres dos animais nem a traição final.

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
2. **Onda 0:** dez invasores Tipo 1, tutorial de no mínimo 30 segundos; é possível perder se ignorá-los.
3. Após concluir a Onda 0, aparecem cinco cartões para escolher **um upgrade inicial**.
4. **Onda 1:** começa do zero com o upgrade escolhido, invasores básicos, dois esquadrões Tipo 2 e uma **fileira final de dez OVNIs Tipo 1**, ocupando a largura do céu.
5. Ao vencer, surge o painel de conclusão com acesso ao **laboratório de inimigos** ou ao menu.
6. **Testar inimigos**, disponível também no menu inicial, apresenta os Tipos 2–5 sem fingir que as ondas seguintes estão completas.
7. **Testar upgrades** abre um laboratório independente, sem ondas nem derrota: ative/desative livremente as cinco primeiras melhorias e experimente combinações.

## Cinco upgrades iniciais

| País | Upgrade | Efeito no protótipo |
| --- | --- | --- |
| Brasil | Gambiarra Balística | +25% de cadência (500 ms → 400 ms) |
| EUA | Balas da Liberdade | Dano básico duplicado |
| Japão | Protocolo Otaku | Tiros mais rápidos, perfuram até dois alvos |
| Rússia | Camarada Canhão | +75% de dano, empurra inimigos em mergulho |
| China | AliExplode — Frete Grátis | Dois projéteis simultâneos com pequena dispersão |

Os upgrades posteriores e o limite de duas torres de animais serão implementados numa etapa própria, seguindo o GDD.

## Laboratório de upgrades

No menu inicial, clique em **TESTAR UPGRADES [U]**. O jogo abre um campo de testes pausado, com cinco cartões que representam apenas os upgrades de nível 1 atualmente funcionais.

- Clique em qualquer cartão ou use **1–5** para alternar cada melhoria entre ativa e desativada. É possível deixar várias ativas e testar combinações.
- Clique em **ZERAR MELHORIAS [0]** para voltar ao canhão padrão.
- Clique em **VOLTAR AO CAMPO [U]**, pressione **U** ou **Esc** para retornar ao combate com a configuração escolhida.
- No campo, pressione **1–5** para gerar os inimigos Tipos 1–5 (2 gera um trio); **Shift+1** gera uma fileira de dez Tipo 1; **Shift+2** gera **dez Tipo 2 circulando em órbita antes de parar e mergulhar**; **Shift+3/4/5** gera as variantes de nível 2. **C** limpa os inimigos e projéteis; **U** reabre o painel.
- Há **barras de vida** nos inimigos resistentes e **números flutuantes de dano** ao acertar. Cada melhoria dá uma cor/formato diferente aos projéteis; o Japão aumenta também a velocidade real da munição.
- O painel e o HUD exibem **tiros por segundo, dano, velocidade de projétil, perfuração e quantidade de tiros**, para comparar combinações de forma objetiva.
- Além dos invasores básicos automáticos, surgem alvos resistentes (Tipos 2 e 3) para testar o benefício de dano elevado e perfuração.
- Um invasor Tipo 1 aparece automaticamente a cada 2,7 segundos, desde que haja menos de dez em campo.
- O canhão é indestrutível nos dois laboratórios para não interromper os testes. A regeneração do escudo continua visível.
- **R** reinicia o campo de teste mantendo a combinação de melhorias.

Esse modo é **separado da campanha**: não consome escolhas, não habilita níveis futuros e não altera a progressão da Onda 0 / Onda 1.

## Inimigos

- **Tipo 1 — Invasor Básico:** sprite animado, 1 HP, trajetória curva para o escudo do canhão.
- **Tipo 2 — Esquadrão de Formação:** **quadrados roxos**. Nível 1: trio que se posiciona antes de mergulhar. Nível 2: **dez naves giram em círculo**, param numa linha, sinalizam o ataque e depois mergulham.
- **Tipo 3 — Bombardeiro:** **quadrado amarelo/laranja** com 6 HP; paira e atira projéteis interceptáveis (2 HP), depois mergulha.
- **Tipo 4 — Caça Relâmpago:** **quadrado rosa/vermelho** com 4 HP; cruza a tela rapidamente, faz mergulhos e prepara um laser sinalizado.
- **Tipo 5 — Nave-Mãe:** **quadrado ciano** grande com 24 HP no nível 1; paira, dispara projéteis e gera invasores Tipo 1. A transição da descida para o voo lateral agora é suave, sem o salto horizontal; no nível 2, possui mais vida, ataca mais vezes e **lança pares de invasores de nível 2**.

**Aparência dos Tipos 2–5 é provisória:** quadrados com o número do tipo. O contorno dourado e o sufixo `II` indicam dificuldade 2. O Tipo 1 de nível 2 é levemente dourado e mais rápido. Os níveis 2 dos Tipos 3 e 4 também possuem mais vida e velocidade; o **Bombardeiro II dispara duas bombas convergentes por salva**, e o **Caça Relâmpago II prepara o laser mais rapidamente**. O balanceamento ainda pode mudar.

### Padrões avançados
- **Onda 1:** último evento é a fileira de dez Tipo 1, entrando simultaneamente de toda a largura da tela.
- **Teste de inimigos:** surge automaticamente um grupo de dez Tipo 2 em órbita no final da sequência; também pode gerá-lo sob demanda.
- **Níveis 1 e 2 de todos os tipos:** selecionáveis nos laboratórios com teclas numéricas normais ou com Shift.

## Controles

- **Mouse:** mira do canhão (arco superior, limitado a 15° acima das laterais).
- **Botão esquerdo pressionado:** tiros básicos contínuos.
- **Botão direito:** bomba especial que protege a área durante 3 segundos (recarga 8 segundos).
- **Esc ou P:** pausar/retomar.
- **R:** reinicia o modo atual, preservando o upgrade escolhido na Onda 1.
- **Enter:** começar pelo menu.
- **T:** entrar no laboratório de inimigos pelo menu.
- **U (no menu):** entrar no laboratório de upgrades.
- **U (no laboratório de upgrades):** abrir/fechar o painel para alterar melhorias instantaneamente.
- **1–5 (qualquer laboratório em combate):** gerar inimigos de nível 1; **Shift+1–5** gera nível 2 (Shift+1 = fileira; Shift+2 = círculo com dez naves); **C** limpa o campo.
- **1–5 (painel do laboratório):** ativar ou desativar os cinco upgrades disponíveis; **0** zera.
- **Clique nos cartões:** escolher aliado após a Onda 0.

## Estrutura técnica

- `src/scenes/MenuScene.js` — menu inicial e laboratório.
- `src/scenes/GameScene.js` — Onda 0, Onda 1, laboratório e combate.
- `src/scenes/UpgradeScene.js` — cinco cartões de escolha na campanha.
- `src/scenes/UpgradeLabScene.js` — painel de upgrades acumuláveis e substituíveis em campo de teste.
- `src/scenes/PauseScene.js` — pausa, reinício e menu.
- `src/gameplay/upgrades.js` — primeiros efeitos reais das melhorias.
- `src/gameplay/enemies.js` — definições dos cinco tipos, níveis de dificuldade, matemática do círculo, fileira e movimento suave da Nave-Mãe.
- `src/gameplay/waves.js` — agenda de entradas e término dos modos.
- `src/gameplay/combat.js` e `src/gameplay/specialBlast.js` — regras matemáticas de mira, dano e explosão persistente.
- `tests/` — testes automatizados das regras, incluindo padrões, dificuldade, continuidade da Nave-Mãe e diferenças de upgrades.
- `.github/workflows/checks.yml` — testes e build automáticos no GitHub.

## Documento de design

[GDD no Google Docs](https://docs.google.com/document/d/1pEUznP_ckv5UFM_jNl8M3KIh0l2A-ebswir4bkLb0lo/edit).

O [repositório do GitHub](https://github.com/gabelsqt/jogo-da-soberana) é privado enquanto o protótipo estiver sendo desenvolvido.
