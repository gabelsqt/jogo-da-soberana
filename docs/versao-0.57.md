# Game Soberana — v0.57 (primeira noite e boteco)

## Implementado
- Após vencer a onda 0, o boteco apresenta uma sequência de diálogos avançáveis por clique/toque (ou Enter): plantão de vitória, aparição de nave superior e destruição **narrativa** do canhão, reação de Zeca, entrada conjunta dos cinco conselheiros e convite à escolha de apoio.
- Depois das outras ondas normais, duas falas breves comentam o resultado antes da escolha de upgrade.
- Enquanto os comentários estão em exibição, cliques nos retratos e atalhos de seleção não escolhem upgrades.
- Mantido o sistema de upgrades e a ordem de transições existente, sem adicionar inimigo real ao fim da onda zero.

## Limitações e pendências
- A destruição do canhão é **apresentada como diálogo narrativo**, sem novo efeito cinematográfico de destruição ou inimigo jogável adicional. Essa animação continua pendente.
- Textos provisórios para aprovar ritmo; ainda não há diálogo individual dos cinco conselheiros nem retratos emocionais, relatório de upgrades ou prévias.
- Requer playtest no navegador para verificar posição, sobreposição e retorno ao jogo.

## Teste local
git pull; npm test; npm run build; npm run dev. Verificar onda zero, boteco, cliques, Enter e visitas subsequentes.
