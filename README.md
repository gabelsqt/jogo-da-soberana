# Soberania — Jogo para a Soberana Game Jam

Jogo arcade de defesa antiaérea em pixel art ambientado no Rio de Janeiro, inspirado em **Missile Command** e **Utopia Must Fall**.

> **Protótipo 0.5** — Onda 0, primeira seleção de aliados, Onda 1 e laboratório com inimigos Tipos 1–5. Ainda **não** implementa as ondas 2–11, os upgrades de nível 2–10, as torres dos animais nem a traição final.

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
4. **Onda 1:** começa do zero com o upgrade escolhido, invasores básicos e duas prévias de esquadrões Tipo 2.
5. Ao vencer, surge o painel de conclusão com acesso ao **laboratório de inimigos** ou ao menu.
6. **Testar inimigos**, disponível também no menu inicial, apresenta os Tipos 2–5 sem fingir que as ondas seguintes estão completas.

## Cinco upgrades iniciais

| País | Upgrade | Efeito no protótipo |
| --- | --- | --- |
| Brasil | Gambiarra Balística | +25% de cadência (500 ms → 400 ms) |
| EUA | Balas da Liberdade | Dano básico duplicado |
| Japão | Protocolo Otaku | Tiros mais rápidos, perfuram até dois alvos |
| Rússia | Camarada Canhão | +75% de dano, empurra inimigos em mergulho |
| China | AliExplode — Frete Grátis | Dois projéteis simultâneos com pequena dispersão |

Os upgrades posteriores e o limite de duas torres de animais serão implementados numa etapa própria, seguindo o GDD.

## Inimigos

- **Tipo 1 — Invasor Básico:** sprite animado, 1 HP, trajetória curva para o escudo do canhão.
- **Tipo 2 — Esquadrão de Formação:** **quadrados roxos** com 2 HP que se agrupam antes de mergulhar.
- **Tipo 3 — Bombardeiro:** **quadrado amarelo/laranja** com 6 HP; paira e atira projéteis interceptáveis (2 HP), depois mergulha.
- **Tipo 4 — Caça Relâmpago:** **quadrado rosa/vermelho** com 4 HP; cruza a tela rapidamente, faz mergulhos e prepara um laser sinalizado.
- **Tipo 5 — Nave-Mãe:** **quadrado ciano** grande com 24 HP; paira, dispara projéteis e gera invasores Tipo 1.

**Aparência dos Tipos 2–5 é provisória:** quadrados com o número do tipo. Ainda não são sprites finais; o comportamento e o balanceamento também poderão mudar.

## Controles

- **Mouse:** mira do canhão (arco superior, limitado a 15° acima das laterais).
- **Botão esquerdo pressionado:** tiros básicos contínuos.
- **Botão direito:** bomba especial que protege a área durante 3 segundos (recarga 8 segundos).
- **Esc ou P:** pausar/retomar.
- **R:** reinicia o modo atual, preservando o upgrade escolhido na Onda 1.
- **Enter:** começar pelo menu.
- **T:** entrar no laboratório pelo menu.
- **Clique nos cartões:** escolher aliado após a Onda 0.

## Estrutura técnica

- `src/scenes/MenuScene.js` — menu inicial e laboratório.
- `src/scenes/GameScene.js` — Onda 0, Onda 1, laboratório e combate.
- `src/scenes/UpgradeScene.js` — cinco cartões de escolha.
- `src/scenes/PauseScene.js` — pausa, reinício e menu.
- `src/gameplay/upgrades.js` — primeiros efeitos reais das melhorias.
- `src/gameplay/enemies.js` — definições dos cinco tipos.
- `src/gameplay/waves.js` — agenda de entradas e término dos modos.
- `src/gameplay/combat.js` e `src/gameplay/specialBlast.js` — regras matemáticas de mira, dano e explosão persistente.
- `tests/` — testes automatizados das regras.
- `.github/workflows/checks.yml` — testes e build automáticos no GitHub.

## Documento de design

[GDD no Google Docs](https://docs.google.com/document/d/1pEUznP_ckv5UFM_jNl8M3KIh0l2A-ebswir4bkLb0lo/edit).

O [repositório do GitHub](https://github.com/gabelsqt/jogo-da-soberana) é privado enquanto o protótipo estiver sendo desenvolvido.
