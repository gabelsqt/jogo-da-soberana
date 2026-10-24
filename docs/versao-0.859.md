# Soberania v0.859 — redesign de áudio da Rússia (16/32 bits)

## Direção sonora
O Sputnik, o tiro russo e o congelamento foram refeitos em linguagem **sci-fi militar-industrial**. Foram eliminados os glissandos agudos, arpejos musicais de videogame infantil e os timbres de sinos. A nova síntese utiliza impulsos graves, motores modulados, ruído metálico filtrado, caudas curtas e bit depth de 11/12 bits.

## Sons modificados
- **Sputnik (lançamento):** partida hidráulica grave, pulsação pesada, exaustão pneumática.
- **Sputnik suspenso:** motor de baixa frequência sem melodia, com modulação sutil, em loop.
- **Contato e congelamento:** vitrificação seca, fissura metálica, ressonância inarmônica curta.
- **Cristalização profunda:** carga grave e fraturas mecânicas em vez de escadinha musical.
- **Estilhaçamento:** impacto granular e cristais mais baixos e contidos.
- **Pulso e colapso do Sputnik:** descarga de gravidade, sem chirps agudos.
- **Sopro nível 10:** ruído de ventania áspera e turbina, sem tons infantis.
- **NOVO tiro básico russo:** descarga criogênica curta e grave, independente do som comum `cannon`.

## Integração e segurança
- Gerador atualizado: `scripts/generate-russian-sfx.mjs` produz **8 WAVs** mono PCM 22050 Hz, sem baixar dependências externas.
- Arquivos renomeados com `_v2` para evitar cache dos áudios antigos no navegador e no GitHub Pages.
- O tiro básico russo usa `ruBasicShot` com pequena variação de pitch (0,96–1,04) e limitação de vozes simultâneas; os demais países mantêm seu tiro.
- O congelamento do tiro principal soa apenas quando o alvo **entra** no estado congelado, não a cada hit de renovação. O Sputnik continua com seu gatilho próprio de primeiro contato.
- O bip do especial genérico deixa de tocar no disparo de um especial primariamente russo.
- As regras de ataques, dano, duração, combo de congelamento, sprites, inputs e hitboxes não foram alteradas.
- Regressões verificadas em `tests/russianRetroSfx.test.js` e `tests/sfxPitch.test.js`; novos áudios são gerados automaticamente no `prebuild` e `predev`.

## Teste auditivo
Conferir especialmente a combinação tiro básico + congelamento na metralhadora russa, a presença contínua do hum em 1–3 Sputniks e a parada ao soltar o sopro ou trocar de cena.
