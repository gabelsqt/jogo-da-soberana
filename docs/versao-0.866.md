# Operação Soberania v0.866 — laser coreano com áudio mais grave

- **Tiro principal coreano:** nova síntese do mesmo disparo `krBasicShot`, mais grave e menos estridente. Osciladores principais passam a sweep triangular de **540 a 155 Hz** e sweep senoidal de **300 a 112 Hz**, com uma borda serrilhada discreta em vez do antigo square agudo.
- **Duração:** de **0,17 s** para **0,25 s**, com envelope suavizado.
- **Variador de pitch existente:** `randomSfxPlaybackRate` já variava o tom por disparo; a faixa do laser foi ampliada de **0,96×–1,04×** para **0,86×–1,10×**. Outras armas conservam suas faixas.
- **Mistura e cadência do áudio:** volume relativo passa de **0,52** para **0,46**, throttle de **85 ms** para **95 ms**, evitando sobreposição excessiva em disparos rápidos.
- Novo nome do arquivo gerado `30_kr_tiro_laser_v2.wav` evita cache do som antigo. O gerador já está ligado a `predev` e `prebuild`, incluindo a exportação do itch.io.
- Preservados arcos elétricos, todos os efeitos visuais, danos, balística e equilíbrio dos upgrades da Coreia e dos demais países.
- Testes atualizados para duração WAV, faixa de pitch e chamada do som no tiro básico. Ainda é necessário avaliar o timbre no navegador.
