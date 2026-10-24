# Operação Soberania v0.891 — Onda 2 mais acessível e especiais que sempre detonam

## Dificuldade Onda 2
- Causa confirmada: a expansão automática dos eventos originais criava mais de cem inimigos, com salvas simultâneas de muitos naves.
- Agora são **41 naves**, divididas em seis enxames (4, 4, 5, 5, 5, 5), duas formações táticas (3, 4) e um círculo final com 6 Tipo 2.
- A maior parte dos inimigos ainda está no nível 1, subindo para nível 2 nas últimas formações.
- Chegadas progressivas entre 0,45 s e 12,8 s, dentro da janela de 15 s, preservando a segunda metade da onda para a defesa.
- Somente um Tipo 1 por enxame e dois Tipo 2 por esquadrilha disparam durante as fases paradas; a segunda ogiva continua reservada às formações táticas a partir da Onda 2.
- Tipo 2 mantém o movimento circular amplo já aprovado; não alteramos outras ondas.

## Tiro especial (todos os países)
- Causa confirmada: origem real na boca do canhão não coincidia com a linha geométrica até o alvo, e o teste de proximidade (6 px) falhava; além disso, alcance 580 px deixava a marca fora dos limites do jogo, removendo o projétil.
- `specialTargetPoint` agora garante detonação visível com margem de 24 px das bordas. Vale até com cursor fora do canvas, mantendo restrições de elevação e distância mínima.
- `advanceSpecialProjectile` vai da posição atual REAL até o ponto marcado, em linha reta, limitando o passo para nunca ultrapassar o alvo, inclusive em frames lentos.
- Ao chegar, dispara o mesmo `detonateV1HybridSpecial` de antes: balão/arraial brasileiro, Sputnik russo, carga chinesa ou globo coreano; EUA continua colocando o Grande Muro diretamente pela mira.
- A regra de descartar balas fora da tela só vale para projéteis comuns, nunca para especiais sem detonação.
- Não alteramos cooldown, dano, efeitos visuais de escudo ou som UOM.
- Testes cobrem todas as bordas, tiro inclinado, origem física deslocada, FPS baixo, contagem de naves, organização de disparos e ativação híbrida.

## Validação
- Testes novos v0.891 e correção da expectativa legada de ponto além da tela em `tests/specialBlast.test.js`.
