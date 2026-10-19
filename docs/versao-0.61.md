# Soberana v0.61 — teste jogável de ondas no Wave Maker

- Botão **TESTAR** no Wave Maker inicia combate real usando uma cópia dos eventos do rascunho.
- Fluxo isolado do jogo oficial: sem publicação na campanha. Após vitória/derrota, há retorno ao editor.
- `GameScene` aceita o snapshot de eventos apenas no modo de teste com configuração de Laboratório e preserva a cópia ao tentar novamente.
- GDD e checklist atualizados; versão sincronizada com package.json.

## Limites
Não gera ainda resumo detalhado de dano, projéteis ativos, taxa de vitória ou testes em lote. Ondas 10/11 e lógica de final exigem validação adicional. **Não foram executados testes locais nem build nesta sessão**.

## Testar
`git pull`, `npm test`, `npm run build`, `npm run dev`; Laboratório → Wave Maker → TESTAR. Testar principalmente vitória, derrota, retorno e mudanças apenas no rascunho.
