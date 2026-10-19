# Versão 0.48 — Cubo News em todos os menus e fonte pixel com minúsculas
Data: 19/10/2026 • Branch `feat/brasil2-arraial-balístico`.

## O que mudou
- A fonte bitmap interna `src/ui/pixelFont.js` agora inclui 26 glifos minúsculos **desenhados separadamente**, preserva letras maiúsculas/minúsculas e continua desenhando diacríticos portugueses em pixels. `normalizePixelText` mantém compatibilidade antiga; a nova `normalizePixelMixedCase` é usada pelo renderizador.
- A faixa externa da Cubo News volta a usar **fonte bitmap** para marca, manchete, rodapé rolante, cronômetro em segundos e vinheta central `Tempo até o amanhecer`. Manchetes salvas inteiramente em CAIXA ALTA são **apresentadas em caixa mista**, sem reescrever o banco: transformam-se em caixa de frase com siglas e nomes próprios preservados (CBF, ETs, Cubo News, Brasil, Flamengo etc.).
- O relógio segue **grande, em pixels e sem caixa**, e a vinheta mantém o zoom-in 1,48×, 2,2 s de permanência e zoom-out de 1,75 s, com transparência suave. Nenhum tempo é descontado durante a animação; o Tipo 6 continua congelando a contagem até ficar alvejável.
- Identidade unificada da emissora no menu principal, pausa, laboratório de upgrades V1, laboratório tático, configuração de laboratório, mesa de negociações, finais e painéis da própria partida (interlúdio, derrota e vitória). O estilo combina **Cubo News**, marca AO VIVO, vermelho/prata/azul-marinho, tarja inferior e blocos angulares.
- O título da tela inicial e outros títulos essenciais em Phaser agora são imagens da fonte bitmap interna, geradas em runtime por `src/ui/cuboNewsTheme.js`. Textos extensos de informação permanecem em fonte monoespaçada normal, para legibilidade e acessibilidade visual.
- Botões de menu em vermelho (primários) e azul-marinho (secundários), com destaque de enquadramento, foco de mouse e clique, preservando as callbacks, atalhos e `.label.setText` dos epílogos.
- A **mesa de boteco** continua presente na escolha diplomática; o jornal a enquadra como boletim de relações internacionais. Não foram adicionadas torres de animais nem modificações de combate.
- O HUD de combate externo continua independente da câmera: zooms e screenshake não deslocam relógio nem noticiário. O canvas Phaser segue em 960×540 com faixa externa de 44 pixels lógicos.

## Arquivos
`src/ui/pixelFont.js`, `src/ui/cuboNewsTheme.js`, `src/ui/menuButton.js`, `src/ui/cuboNewsHud.js`, `index.html`; cenas `MenuScene`, `PauseScene`, `UpgradeScene`, `V1PlaytestScene`, `LabSetupScene`, `UpgradeLabScene`, `EndingScene`, `GameScene`. GDD consolidado em `docs/GDD.md`.

## Validação
- Testes automatizados incluem os glifos mistos (maiusculação, minúsculas e acentos), relógio pixelado, cobertura do HUD e presença da marca nos menus; testes existentes de campanha, pausas, upgrade e epílogos preservados.
- `npm test` e `npm run build:itch` pelo workflow `Verificação do protótipo`.
- A aparência final ainda requer playtest visual em desktop e celular, sobretudo nas manchetes longas e telas de seleção; nenhuma validação automatizada atesta o acabamento visual.
