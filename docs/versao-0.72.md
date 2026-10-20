# Soberana v0.72 — Onda 1 mais acessível

## Pedido
Na onda 1, os inimigos estavam muito altos, alguns movimentos pareciam levá-los ainda mais para cima e havia excesso de projéteis na tela. Esta versão altera **somente a onda 1**, mantendo as demais intactas.

## Mudanças implementadas

**Densidade:** a onda 1 passa a ter sete enxames Tipo 1, com [4,5,5,5,5,6,6] naves, e três esquadrilhas Tipo 2, com [3,4,4] naves. Ao todo, **47 inimigos em dez formações**. Os enxames aparecem nos tempos 0,4 / 2,3 / 4,3 / 6,4 / 8,6 / 10,8 / 12,7 segundos. Os três eventos Tipo 2 preservam seus horários originais convertidos.

**Movimento:** o Tipo 1 sai do portal aproximadamente em y=120 e faz curvas horizontais suaves enquanto **desce progressivamente para ~y=235**, alternando padrões `lowSweep` e `lowZigzag`, sem voltar ao topo. Tipo 2 começa por volta de y=192 e manobra perto da faixa média, sem as grandes subidas anteriores. Depois ambos continuam suas investidas na direção das defesas.

**Disparos:** em vez de cada inimigo atirar (Tipo 2 chegava a disparar duas vezes), apenas **um Tipo 1 por enxame** e **dois Tipo 2 por esquadrilha** disparam **uma vez cada** durante a formação. São no máximo **13 disparos de formação** caso todos sobrevivam até o momento de atirar.

**Dificuldade:** projéteis da onda 1 causam 10 de dano em vez de 14 e voam a 90% da velocidade anterior. Colisões de inimigos com a defesa causam 75% do dano padrão. O canhão e os upgrades continuam inalterados.

## Arquivos
- `src/gameplay/formation035.js`: `WAVE1_PACING`, novos padrões de voo baixo, seleção dos atiradores e agenda especial da onda 1.
- `src/scenes/GameScene.js`: movimento e disparos exclusivos da onda 1, sem afetar outras ondas.
- `tests/formation035.test.js`: progressão genérica reservada às ondas 2–9.
- `tests/wave1Balance.test.js`: contagem, posições, cronograma, limite de salvas e escopo.
- `docs/GDD.md` e `docs/CHECKLIST-TESTES.md`: documentação.

## Validação
Verificação direta de lógica confirmou **47 inimigos, 13 disparos de formação, último grupo aos 12,7 s e liberação nominal final às 14,8 s**. Verificação sintática passou para os arquivos JS editados.

**Pendente:** rodar a suíte completa `npm test`, `npm run build` e conferir visualmente a onda 1 no navegador.

```bash
git pull
npm test
npm run build
npm run dev
```
