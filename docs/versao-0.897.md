# Operação Soberania v0.897 — Vinheta da Cubo News exclusiva da introdução

## Solicitação
O tema da Cubo News era retomado com frequência excessiva, apesar das
mudanças de trilha das batalhas. O objetivo é permitir **uma execução
durante a introdução**, sem loops e sem recomeços nas outras notícias.

## Mudanças
- Em `IntroScene`, o **primeiro plantão** (invasão, slide 2) dispara
  `music.play('news', {loop:false})` apenas se a vinheta ainda não tocou.
  O flag `newsThemePlayed` é reinicializado a cada nova introdução.
- A segunda notícia da introdução permanece com a mesma vinheta, caso
  o trecho ainda esteja tocando; não cria um novo áudio nem reinicia a faixa.
  Ao sair do noticiário, a cena interrompe a vinheta para continuar os e-mails.
- A abertura da onda 0 chama `waveMusic('wave0')` como todas as outras
  ondas, em vez de iniciar a trilha Cubo News novamente.
- O boletim anterior à onda 11 mantém seu visual e botões, mas **não**
  substitui a trilha de batalha pela música do jornal.
- `MusicPlayer` mantém a faixa `news` no catálogo, apenas para a intro.
  Preferências de volume, outros efeitos, temas das ondas e vitória não mudam.

## Regressões
- `tests/cuboNewsMusic897.test.js` comprova via simulação do método real
  da cena que uma entrada repetida no slide 2 não reinicia a trilha;
  o slide 3 não a repete e o próximo slide a encerra.
- Confere que `GameScene` não reproduz `news` e que a onda 0 utiliza
  a trilha comum.
- Confere que uma faixa sem loop terminada não recomeça ao clicar/teclar.
