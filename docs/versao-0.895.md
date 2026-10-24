# Operação Soberania v0.895 — Estabilidade da Coreia e laboratório combinado

## Coreia nível 10 contra Fortaleza Tipo 6
- `fireLightstickBeam` percorre os tiros inimigos enquanto aplica o laser contínuo.
- Bombas da Fortaleza Tipo 6 podem detonar e encolher o array de tiros
  durante o mesmo quadro. Antes, a iteração acessava `bullet.sprite`
  sem conferir se a posição ainda existia.
- O laser agora ignora posições removidas/destruídas antes de testar a hitbox.
- Incluído teste de regressão que executa o método real com uma bomba colossal
  removendo a lista inteira durante a iteração.
- Os avisos de autoplay de áudio e de WebGL do navegador não são
  a causa desse erro JavaScript.

## Laboratório V1 de combinações
- Cinco países exibidos simultaneamente, cada um com níveis independentes
  de 0 a 10. No laboratório **não existe limite de dez escolhas somadas**.
- Botões + e − alteram cada país sem substituir os outros.
- A seleção PRINCIPAL determina qual especial lidera a build híbrida
  quando o país escolhido tem nível 2 ou superior; os efeitos dos demais
  países continuam ativos.
- A Arena Livre dispõe de botão/atalho U para voltar ao editor, preservando
  níveis e país principal. Os testes de ondas também usam os mesmos níveis.
- Somente estados enviados pelo laboratório V1 possuem `labLevels`.
  `v1CountryLevels` e `v1SpecialLoadout` reconhecem esse estado
  experimental; o histórico normal da campanha permanece limitado
  a dez escolhas pela progressão habitual.
- Se várias transformações nível 10 estiverem ativas simultaneamente,
  a precedência atual de mecânica principal permanece no cálculo de
  estatísticas (Coreia tem precedência sobre as demais).
- `getRunOptions` preserva os níveis ao reiniciar o teste.

## Arquivos
- `src/scenes/GameScene.js` — guarda da lista de tiros, aplicação dos níveis
  laboratoriais, reabertura do editor e feedback visual híbrido.
- `src/scenes/V1PlaytestScene.js` — controles independentes por país.
- `src/gameplay/v1LabLoadout.js` — normalização e edição puras da build.
- `src/gameplay/v1Upgrades.js`, `src/gameplay/v1Specials.js` —
  reconhecimento isolado do modo laboratório.
- `tests/koreaBossLab895.test.js` — regressões contra o crash e misturas
  de upgrades. `tests/v1Menu.test.js` atualizado.

## Teste manual
1. No menu, abra TESTAR UPGRADES, configure Coreia nível 10 e
   teste a onda 10; atire continuamente nas bombas da Fortaleza Tipo 6.
2. Monte Coreia 10 + Brasil 4 + China 6 e confirme estatísticas híbridas.
3. Abra a Arena Livre e use U/ALTERAR COMBINAÇÃO para voltar e ajustar os níveis.
