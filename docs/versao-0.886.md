# Operação Soberania v0.886 — pulsação holográfica e formação a cada onda

## Escudo hexagonal (somente visual)
- Hexágonos no interior alternam independentemente seus níveis de transparência, chegando a quase apagar e reacendendo em um ritmo orgânico.
- A variação de alpha usa uma senoide por célula, com fases e velocidades diferentes; não move nem modifica a malha.
- As células externas permanecem estáveis para preservar a leitura do contorno e da borda luminosa.
- O visual do canhão permanece visível atrás do escudo.
- Dano, colisão, pontos de escudo, regeneração e estilhaçamento permanecem intactos.

## Formação em todas as fases
- Em `startWaveCountdown()`, a cúpula desliga durante a introdução/contagem.
- Na execução de `startCombat()`, ela se forma de baixo para cima (780 ms), seguida por pulso de brilho na borda (450 ms).
- A lógica é comum a todas as ondas, independentemente de escolhas de país; não fica restrita à viagem da Onda 11.
- A transição espacial mantém sua própria desativação; o começo da batalha da próxima cidade reconstrói a malha.
- Tests: opacidades no tempo, defasagem entre hexágonos, borda estável, gatilho em todas as ondas.
