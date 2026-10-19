# Soberana v0.52

## Correção preventiva: início de onda
- O início de combate da Cubo News foi tornado idempotente: spawns e cronômetro não podem ser iniciados duas vezes.
- Caso a animação DOM do relógio não conclua, uma chamada de segurança aos 5,3 s limpa a intro e inicia o combate.
- Preservar intro normal quando não há falha.

## Pendências
- Verificar várias entradas em onda 0 e onda 11 full coreana via laboratório local.
- Investigar quadrado preto após reforço brasileiro.
- Executar `npm test` e `npm run build` no clone local; não foram executados aqui.
