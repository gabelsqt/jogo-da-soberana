# v0.831 — Som dedicado para o disparo especial

- Registra `specialShot` em `src/audio/sfx.js`, com arquivo `11_tiro_especial.wav` e variação reutilizável de pitch entre 0,91×–1,09× e volume 0,95×–1,05×.
- `GameScene.shootSpecial()` aciona o som somente depois de passar pelos impedimentos e pelo cooldown, quando registra o disparo.
- O WAV foi sintetizado externamente e precisa ser adicionado em `public/assets/sons/11_tiro_especial.wav` pelo usuário antes de funcionar no site publicado.
- Não altera dano, comportamento, cooldown ou demais sons. Teste auditivo e suíte automatizada pendentes.
