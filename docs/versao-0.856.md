# Soberania v0.856 — Funk brasileiro na onda 11

- Recebida a faixa `public/assets/musicas/Funk da vitória Brasileira.mp3`.
- Nova chave musical `brazilFinal` em `src/audio/music.js`.
- Na **onda 11 do caminho 100% brasileiro**, a faixa substitui a música `Chefão Alien - onda 10.mp3` e toca em loop durante o combate final.
- Onda 10 continua tocando `Chefão Alien - onda 10.mp3`.
- Na onda 11 com traição (EUA, Rússia, China ou Coreia do Sul), continua tocando o respectivo tema de traição, inclusive quando o traidor é sorteado.
- Mantidos os temas dos epílogos de colonização, Game Over, limite de volume, pausa, mute e a vinheta de notícias.
- `tests/music.test.js` verifica a existência do novo MP3, a separação das ondas 10/11 e as variantes com ou sem traição.
- Alteração exclusivamente musical, sem mudanças de combate ou progressão.
