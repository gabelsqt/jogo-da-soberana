# Soberana v0.53 — proteção ao atualizar textos do HUD

- Evitar chamadas `setText` nos rótulos especiais invisíveis durante as ondas, inclusive a 11.
- Reduzir atualizações de `Phaser.Text` quando o conteúdo exibido não muda.
- Corrigir a chamada em `updateHud` apontada no stack trace Firefox, sem mudar regras de combate.

## Validação pendente
- Testar onda 11 com build full Rússia e full Coreia no laboratório, e onda 0.
- Confirmar se o travamento desaparece; se houver novo erro, copiar o stack trace.
- `npm test` e `npm run build` ainda precisam ser executados no clone local.
- Quadrado preto depois de reforço brasileiro continua pendente.
