# Soberania v0.857 — efeitos sonoros russos 16/32-bit

Sete efeitos originais sintetizados em PCM mono 22050 Hz com timbre digital inspirado em consoles clássicos.
Gerador determinístico versionado em scripts/generate-russian-sfx.mjs (sem dependências nem assets externos).

## Gatilhos
- 12_ru_sputnik_lancamento.wav — lançamento do Sputnik, uma vez por ativação.
- 13_ru_sputnik_zumbido_loop.wav — zumbido enquanto pelo menos um Sputnik estiver ativo.
- 14_ru_sputnik_contato.wav — primeiro contato/cristalização do alvo.
- 15_ru_cristalizacao_profunda.wav — contato com cristalização profunda (estágio russo 3+).
- 16_ru_estilhacamento_congelado.wav — estilhaçamento de um inimigo congelado abatido.
- 17_ru_pulso_colapso.wav — pulso periódico ou desaparecimento do Sputnik.
- 18_ru_sopro_congelante_loop.wav — som contínuo ao manter disparo do nível 10.

## Regras e integração
- O pré-build e o pré-dev geram os sete WAVs na pasta public/assets/sons; o exportador itch inclui os arquivos no HTML único.
- Limites de repetição evitam sobrepor centenas de sons quando muitos alvos são atingidos no mesmo instante.
- O zumbido e o sopro param com a desativação do efeito, nas pausas, na morte e ao trocar de cena.
- O SFX respeita os ajustes de volume/silenciamento já existentes.
- Apenas eventos sonoros foram adicionados; mecânica, upgrades, congelamento, dano e hitboxes permanecem intactos.
- Teste: tests/russianRetroSfx.test.js, incorporado ao playtest GitHub Pages.
