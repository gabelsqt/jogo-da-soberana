# Operação Soberania v0.867 — manutenção da suíte completa

- Atualizados os testes de campanha, Zeca (uma única revanche), Cubo News, retratos sem animais, pausa/Supremo, HUD, colisões, tiros russos e rótulo de versão para os comportamentos efetivamente presentes na branch.
- Corrigido **limiar de precisão** em `type6ModuleVisualState`: 70% de dano liga consistentemente a avaria intensa, mesmo que o cálculo de HP produza uma fração ligeiramente acima de 0,3 por ponto flutuante.
- A elevação mínima atual do canhão é **2 graus**, e não 15; o teste do especial acompanha `MIN_CANNON_ELEVATION_DEGREES` e a detonação real.
- Os testes do Supremo injetam `playSfx` simulado quando extraem os métodos para executá-los sem Phaser, preservando o áudio verdadeiro no gameplay.
- A introdução legada permanece apenas como compatibilidade provisória: sua substituição narrativa já planejada está pendente e não foi revertida.
- Sem regressão intencional de gameplay, salvo o ajuste de estado visual de avarias do Tipo 6. Os números de balanceamento permanecem intactos.
