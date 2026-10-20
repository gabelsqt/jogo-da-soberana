# Soberania v0.861 — munição inimiga circular e feedback ao ser interceptada

## Alterações visuais
- Disparos inimigos comuns passam de retângulos 16,5×16,5 para círculos com raio 8,25; mesma cor e contorno original.
- As bombas colossais do Tipo 6 também passam de quadrados/retângulos a círculos. As variantes EUA, Rússia e China conservam suas cores e escalas.
- Tiros que sobrevivem a um acerto piscam em branco por 80 ms e retornam à cor original.
- Tiros pequenos destruídos por um único acerto geram uma microexplosão com núcleo branco, anel e seis raios/fragmentos luminosos; fade de 160 ms. O clarão permanece visível mesmo se o projétil for removido imediatamente.
- Interceptações por metralhadora, laser, onda de choque, estilhaços, explosões especiais e reação em cadeia também geram feedback visual.
- Bombas colossais mantêm sua explosão já existente ao morrer (sem duplicar explosões grandes).
- A simples saída da tela, impacto no canhão ou encerramento de cena não geram microexplosão de interceptação.

## Integridade
- Colisão, HP, dano, velocidade, número de projéteis e mecânicas de onda não mudaram. Apenas os GameObjects de desenho são circulares e as interceptações têm VFX temporários.
- Uma única Graphics por impacto e tween de destruição curta evitam efeitos acumulados.
- Testes adicionados em `tests/enemyBulletVisuals.test.js` e executados no workflow do GitHub Pages.
