# Soberana v0.69 — Operação Desvio de Carga

## Mecânica implementada
A onda 11 oferece uma única recuperação de equipamentos após perder para o país traidor. Na primeira derrota, o retrato provisório do **Zeca** aparece discretamente ao lado de **ACEITAR DERROTA / VER FINAL**. Clicando no retrato, ele apresenta seu plano e permite **aceitar a recuperação** ou **desistir e seguir ao final colonial**.

Ao aceitar, uma nova tela `ZecaRecoveryScene` apresenta o desvio de carga: motorista **brasileiro** de táxi/van, sem explicação de como resolveu a situação, piada sobre não transportar o Supremo e botão para iniciar a revanche. A cena usa **ilustração geométrica provisória** (van em pixel art), com texto e cores diferentes para **EUA, Coreia do Sul, Rússia e China**; as artes e personagens definitivos serão fornecidos pelo criador do jogo.

## Regras do combate
- A revanche retoma **toda a onda 11 do zero**, incluindo todos os módulos e ataques do **mesmo** traidor.
- O canhão reinicia com **100 de vida** e **escudo máximo**, carregando **todas as escolhas originais**, recuperando os upgrades do traidor em sua forma original, **inclusive a transformação de nível 10**.
- O **Supremo do traidor é a única tecnologia que não retorna**. Os upgrades dos aliados não traidores permanecem ativos. Não há nova lista/contador na interface.
- A cutscene de traição não se repete na revanche.
- Se perder a revanche, Zeca se despede e o jogador segue ao final colonial, **sem novas operações ou tentativas**. Se vencer, segue ao final de vitória existente.
- Atalho **R** e reinício no menu de pausa não estão disponíveis na onda 11, evitando reinícios ilimitados fora do roteiro.

## Arquivos
- `src/gameplay/zecaRecovery.js` — regras puras, elegibilidade, loadout e falas por traidor.
- `src/scenes/ZecaRecoveryScene.js` — apresentação provisória e início da única revanche.
- `src/scenes/GameScene.js` — oferta na derrota, clique na cara de Zeca, perda definitiva e combate recuperado.
- `src/gameplay/v1Upgrades.js` — bloquear somente o Supremo do traidor.
- `src/main.js`, `src/scenes/PauseScene.js` — registro de cena e limite de reinícios.
- `src/gameplay/wave11Rules.js` — remover a antiga progressão brasileira pós-derrota.
- `tests/zecaRecovery.test.js` — testes de recuperação, quatro países, suprema e transformação.

## Como validar
```bash
git pull
npm test
npm run build
npm run dev
```
Testar a onda 11 com cada traidor. Perder uma vez, clicar em Zeca, aceitar a operação, concluir a cena, perder a revanche e confirmar que **não surge segunda proposta**. Também testar rejeição da proposta, vitória e Full Brazil.

**Validação realizada:** arquivos JS alterados passaram em verificação de sintaxe (parsing isolado) e verificações diretas das regras de recuperação e transformação passaram para os quatro países. **Ainda não foram executados** os testes completos via `npm test`, o build Vite ou o playtest visual no navegador.
