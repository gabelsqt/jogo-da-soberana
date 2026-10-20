# Soberana v0.70 — Escudos em sprites, Tipo 6, Wave Maker, novo gelo russo

## Escudos
- A cúpula do canhão e os escudos das torres passam de arcos desenhados a cada frame para **sprites Phaser gerados como texturas pixel art** uma vez no navegador.
- Mantidas as quatro cores de resistência: azul, verde, amarelo e vermelho. Raio e colisão não mudaram.
- Quando o HP chega a zero (abaixo do vermelho), o sprite desaparece e **10 fragmentos animados** se espalham por ~300–440 ms. Vale inclusive para golpes especiais que quebram escudo instantaneamente.
- A regeneração faz a cúpula reaparecer. Implementação em `src/gameplay/shieldSprites.js`.
- Não há ainda spritesheets PNG externos. As texturas atuais são pixeladas e geradas por código, prontas para substituição futura por arte definitiva.

## Tipo 6
- **Barreira principal nasce cheia** e visível com a chegada do chefe.
- Escudo individual de cada módulo: 20% → **42% do HP do módulo**. Barreira principal: 30% → **85% do HP de um módulo**.
- Descida da fortaleza prolongada para **4,2 s (alienígena)** ou **4,6 s (país traidor)**, mais **2 s de estabilização**. Durante todo esse período o chefe não pode ser atingido.
- **Cronômetro de combate congelado** durante descida/estabilização e zerado (`elapsed=0`) quando a fortaleza passa a ser alvejável, com barreira já ativa.
- Funciona nas ondas 10 e 11, incluindo revanche de Zeca.

## Wave Maker
- Corrigida a falha de abertura: `WaveMakerScene.events()` colidia com a propriedade reservada `Phaser.Scene.events`. Renomeado para `waveEvents()` em todas as referências.

## Rússia — efeito principal substituído
- Tiros russos continuam **congelando diretamente** os inimigos, mas congelados **não contagiam nem atraem** outros alvos.
- Ao morrer enquanto congelado, cada nave estilhaça em gelo, causa dano radial e pode iniciar reação em cadeia ao matar outra nave congelada.
- Efeito por níveis: nível 1: 44px/2 dano; 3: 60px/3; 5: 76px/4,5; 7: 96px/6; 10: 120px/9.
- **Árvore atualizada**:
  1. Geada Siberiana — congela; estilhaça no abate.
  2. Matryoshka de Estilhaços — especial de 8 fragmentos, 25% menos recarga.
  3. Inverno Russo — mais duração/raio/dano do gelo.
  4. Boneca Matryoshka — especial de 12 fragmentos, reações.
  5. Estilhaço Siberiano — gelo de área maior e mais forte.
  6. Frente Fria — especial de 16 estilhaços.
  7. Zero Absoluto — congelamento e fragmentação reforçados.
  8. Tempestade de Estilhaços — especial de 24 fragmentos.
  9. Protocolo Cortina de Ferro — Supremo existente preservado.
  10. Inverno Eterno — transformação congela por 3 s, estilhaça em raio de 120px.
- A progressão do especial Matryoshka e Supremo foram preservados.

## Validação
- Arquivos JS editados passaram em verificação de sintaxe isolada.
- Regras de estilhaçamento e escudo inicial do Tipo 6 verificadas em simulação JS isolada; criação e desaparecimento dos sprites de escudo também verificados com ambiente gráfico simulado.
- Testes atualizados: `tests/russianFrost.test.js`, `tests/type6Boss.test.js`, `tests/balance069Plus.test.js`.
- **A suíte completa, o build do Vite e o teste gráfico no navegador ainda não foram executados neste ambiente.**

Para validar no clone:
```bash
git pull
npm test
npm run build
npm run dev
```
Depois testar Wave Maker no Laboratório de Upgrades; onda 10/11 com relógio parado antes de poder atacar; Rússia nível 1 e nível 10; escudos normais e especiais.
