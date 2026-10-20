# v0.81 — Variação sutil de pitch

- Cada disparo do canhão varia aleatoriamente entre 0,95× e 1,05× da taxa original.
- Explosões comuns variam entre 0,93× e 1,07×; chefes entre 0,96× e 1,04×.
- Outros efeitos preservam pitch fixo.
- Alteração aplicada individualmente em cada clone de áudio; mantém limitações de repetição, volumes e fontes WAV.
- A variação de `playbackRate` também altera discretamente a duração do som.
- Incluído teste de limites em `tests/sfxPitch.test.js`; execução da suíte e teste no navegador pendentes.
