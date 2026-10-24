# Game Soberana — versão 0.41

18/10/2026 — pacote 0.41.0.

O especial da Coreia agora deixa um globo estacionário por quatro segundos. Cada tiro que o atinge gera 3/6/12/24 reflexos nos níveis 2/4/6/8, dirigidos aos inimigos. Não há disparo automático ao criar o globo.

Balas são consumidas ao acertá-lo. O laser contínuo termina no globo e o alimenta por pulso de dano. Reflexos distribuem dano entre inimigos vivos, repetindo alvos quando necessário, sem recursão. O componente russo mantém congelamento; outros componentes híbridos resolvem no impacto. O escudo coreano não mudou.

Inclui contador de duração, colisão por segmento para balas rápidas, limpeza ao encerrar o combate e atualização das descrições dos upgrades.

Teste manual: TESTAR UPGRADES V1, escolher Coreia e nível 2, 4, 6 ou 8; lançar especial com botão direito, mirar no globo e segurar o esquerdo. Conferir repetição das salvas durante quatro segundos e ausência de reflexos quando errar a bola. Validação visual final no navegador do jogador pendente.
