# Operação Soberania v0.877 — Grande Muro lançado pelo canhão

- **Posicionamento corrigido:** a mira aponta para o meio da faixa do arco, não para o centro geométrico do círculo. Funciona em todas as orientações e com todos os raios dos upgrades.
- **Lançamento animado:** uma centelha azul e branca parte da boca do canhão e viaja até a coordenada escolhida. O deslocamento varia com a distância (130–480 ms).
- **Abertura em 120°:** ao chegar, a energia abre a curvatura simetricamente a partir do meio da mira em 300 ms, preservando estrelas, listras e brilho.
- **Colisão por etapas:** nada bloqueia durante o trajeto; a abertura bloqueia apenas a parte de arco que já foi formada, crescendo até a barreira completa.
- **Balanceamento preservado:** o tempo de proteção de 6 s conta depois da formação completa; recarga de 14 s, HP, repulsão sem dano e passagem de foguetes aliados não mudam.
- **Áudio:** disparo no lançamento e acionamento de escudo ao chegar à mira.
- **Validação:** testes específicos de geometria, animação e integração adicionados ao fluxo do playtest.
