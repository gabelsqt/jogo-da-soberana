# Operação Soberania — v0.903 — Identidades nacionais e duas propostas P/S no boteco

## Mudanças de campanha
- A campanha **continua com dez escolhas** e **ondas 0–11**.
- **Depois da onda 0**, o boteco abre a **1ª escolha: identidade do tiro PRINCIPAL**. O tiro dessa nação passa a definir a arma do botão esquerdo.
- **Depois da onda 1**, o boteco abre a **2ª escolha: identidade do tiro ESPECIAL**. A habilidade do botão direito fica disponível imediatamente, mesmo que o jogador nunca tenha escolhido o país antes. A história apresenta um diálogo sobre a diferença entre as duas armas.
- **Depois das ondas 2–9**, cada um dos cinco representantes oferece duas propostas separadas: **P1–P4** para melhorar a arma principal ou **S1–S4** para melhorar o especial. O jogador escolhe o país, seleciona P ou S e **confirma**; clicar no retrato sozinho não instala melhoria.
- Existem **quatro espaços globais** para propriedades do principal e **quatro do especial** (total oito). Os estágios de cada país e de cada árvore são sequenciais e independentes; Brasil P2 exige Brasil P1, mas não exige S1.
- O primeiro e o segundo país permanecem visíveis no cabeçalho do boteco.
- Ao completar dez escolhas do mesmo país, o nível 10 concede **as duas transformações e o Supremo** juntos. Uma mistura internacional não dá Supremo.
- Os números de cada melhoria são derivados da especificação do Laboratório v0.901, usando valores padrão. O editor matemático continua exclusivo do Laboratório.

## Persistência e compatibilidade
- O estado da campanha conserva `choices`, agora com `armament:{principal,especial,upgrades:[{country,track,stage}]}`.
- `normalizeCampaignState` valida a alocação, preserva o histórico de países, ignora estágios forjados e limita a 4 melhorias por arma, 8 no total.
- O código V1 antigo continua como compatibilidade para configurações e testes legados, mas o fluxo de novos acordos do boteco usa apenas `armamentOffers` e `chooseArmamentUpgrade`.
- O motor de combate converte o estado de campanha para o mesmo cálculo e propriedades do Laboratório, sem ativar o painel de edição durante o jogo.
- Onda 1 tem somente arma principal; especial fica indisponível até a segunda escolha.
- China usa fila alinhada de tiros reais, Coreia usa saraivadas de lasers com ricochetes (sem fenda residual), conforme v0.902.

## Limitações de balanceamento
- Embora os valores comuns das 40 melhorias já estejam no motor matemático, alguns efeitos avançados continuam marcados como **em preparação** no Laboratório e ainda não têm implementação de combate completa. Isso inclui parte das sinergias híbridas complexas.
- Os diálogos e a demonstração visual de efeitos ainda devem passar por revisão editorial e de UX.
- A progressão anterior permanece em saves de formato legado; recomenda-se **COMEÇAR CAMPANHA** para verificar o novo fluxo desde a onda 0.
- A regra de roubo de upgrades na onda 11 exige futura harmonização com a identidade permanente das armas.

## Testes
- `tests/campaignArmament903.test.js` valida fluxo 1→2→P/S, limites, ordem, histórico persistido e Supremo nível 10.
- Testes de regressão do boteco continuam cobrindo toque, digitação, foco e fechamento de diálogos.
- A verificação do protótipo no GitHub Actions cobre testes e compilação HTML único.
