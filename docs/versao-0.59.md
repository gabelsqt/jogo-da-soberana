# Soberana v0.59 — análise preliminar no Wave Maker

## Entrega
- Botão **ANALISAR** no Wave Maker: exibe quantidade de eventos, concentração de inimigos por segundo, trecho mais denso e sugestões não automáticas para espaçar entradas.
- Módulo puro `src/gameplay/wavePressure.js` com cálculo por intervalo e aviso explícito de heurística.
- Testes de unidade adicionados em `tests/wavePressure.test.js`.
- GDD atualizado com decisões X1–X10 aprovadas; checklist dos testes que ainda faltam.
- Versão atualizada em `src/config/version.js` e `package.json`.

## Limitações / próximos passos
Isto **não** executa combate automático real, não calcula projéteis ativos nem dano, não mede taxa de vitórias e não simula campanha completa. X1–X10 foram aceitas para implementação, mas apenas o primeiro passo de análise está disponível nesta versão. Requerem um simulador com comportamento real do GameScene, instrumento de coleta de métricas e controle de seeds/mira; por ora, continuam no checklist como pendentes.

## Verificação
Código enviado ao GitHub, **sem validação local de build ou navegação**. Antes de publicar como estável, executar `npm test`, `npm run build`, abrir Laboratório > Wave Maker > ANALISAR e testar ondas vazias e densas.
