# Soberana v0.63 — comparar resultados do Wave Maker

## Entregue
- RESULTADOS mostra os cinco testes jogáveis mais recentes da onda, com opção de comparar os dois últimos: resultados, valores e diferenças.
- EXPORTAR gera um JSON de histórico local (até 30 testes), sem publicar nenhuma onda.
- Módulo `src/gameplay/waveTestResults.js` centraliza leitura, gravação, comparação e exportação.
- Testes unitários adicionados em `tests/waveTestResults.test.js`.

## Limitações e validação
A telemetria de abates e interceptações continua parcial; não há execução automática de simulações nem estatísticas de vitória em lote. **Código enviado ao GitHub; build, testes automatizados e inspeção visual não executados nesta sessão.** Verificar no clone usando `npm test`, `npm run build`, `npm run dev`, Laboratório → Wave Maker → TESTAR/RESULTADOS/EXPORTAR.
