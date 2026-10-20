# Soberana v0.62 — relatórios de testes jogáveis

O modo TESTAR do Wave Maker agora coleta, por execução concluída: resultado, HP/escudo restante, quantidade de disparos básicos do jogador, projéteis inimigos criados, dano bruto ao canhão/escudo, abates registrados na rotina normal e interceptações por explosões especiais. O editor ganhou o botão RESULTADOS, que consulta os cinco últimos resultados da onda, com histórico de até 30 entradas salvo no navegador.

**Limitações:** métricas de abates/interceptações ainda parciais (outras rotinas não instrumentadas); sem simulador automático, lotes, gráficos de dano ou taxa de vitórias confiável. Sem alteração das ondas publicadas.

**Validação pendente:** executar `npm test`, `npm run build`, iniciar `npm run dev`, testar vitória/derrota e consultar RESULTADOS. Ainda não houve verificação local ou no navegador nesta sessão.
