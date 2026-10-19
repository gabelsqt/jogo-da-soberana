# Soberana v0.60 — Wave Maker: gráfico e comparação

## Implementado
- Gráfico temporal de **concentração estimada de entradas de inimigos**, usando o rascunho da onda.
- Botão **TRECHO**: intervalos inicial/final em segundos, usados no gráfico e no relatório ANALISAR.
- Botão **COMPARAR**: um clique captura uma referência; após editar a onda, outro compara quantidade de eventos, pressão média e pico estimados. A referência é temporária e reiniciada ao trocar de onda.
- GDD e checklist atualizados, versão de código e pacote sincronizada.

## Limitações
**Não simula o combate real:** o gráfico NÃO representa balas em voo, dano ou chance de vencer. Recursos X1–X10 para canhão automático, vitórias em lote, HP restante e campanha completa continuam pendentes. O Wave Maker permanece isolado da campanha e não publica dados por esses botões.

## Como verificar
No clone da branch: `git pull`, `npm test`, `npm run build`, `npm run dev`. Abrir Laboratório → Wave Maker e testar ANALISAR, TRECHO, COMPARAR. **Validação local e visual ainda não realizada.**
