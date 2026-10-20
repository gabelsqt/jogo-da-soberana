# Soberania v0.860 — efeitos sonoros dos especiais nacionais

**10 efeitos novos** com paletas nacionais em síntese digital mono PCM 22050 Hz (11/12 bits quantizados em WAV de 16 bits). Inspirados em jogos de ação de 16 e 32 bits, sem samples externos.

## Brasil
- **Fogueira:** crepitação contínua com baixo quente, ativa apenas enquanto existe uma fogueira Arraial.
- **Subida dos fogos:** pavio assoviando e propelente, uma vez ao lançar o especial brasileiro.
- **Estouro de fogos:** estalos festivos breves; limitação de 95 ms entre reproduções evita excesso com até 32 fogos.

## Estados Unidos
- **Míssil:** compressor grave e propulsão pesada no disparo americano.
- **Onda de choque:** onda de pressão em graves e detonação secundária na explosão, uma por especial mesmo com múltiplas vítimas.

## China
- **Drones e carga:** cliques mecânicos/servos ao liberar a carga distribuída (inclusive em híbridos).
- **Impacto do contêiner:** metal, impacto grave e detritos, uma reprodução por especial híbrido (não por subcarga).

## Coreia do Sul
- **Ativação:** sintetizador eletrônico prismático ao criar o globo de discoteca.
- **Giro:** motor disco digital discreto em loop enquanto houver globo ativo, para ao expirar.
- **Ricochete laser:** reflexos eletrônicos que soam uma vez por salva visível, e não por raio individual.

## Integração
- Arquivos `20_...wav` a `29_...wav`, gerados por `scripts/generate-national-special-sfx.mjs`.
- Geração executada junto com os oito efeitos russos nos comandos `npm run dev` e `npm run build`; também incluídos no HTML exportado para itch.io.
- Efeitos contínuos param nas pausas, quando a cena encerra ou o objeto desaparece.
- Continua havendo uma faixa de música por vez; os SFX respeitam volume/ativação.
- A mecânica dos especiais, danos, duração, torres, congelamento e colisões não foi alterada.
- Testes `tests/nationalSpecialSfx.test.js` executados na publicação do GitHub Pages.

## Observação
Sons são vinculados aos eventos **existentes no jogo**: a carga chinesa do V1 é distribuída internamente, não cria novas entidades físicas de drones. O áudio acompanha a liberação da carga, sem alterar a mecânica.
