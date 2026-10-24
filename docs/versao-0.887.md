# Operação Soberania v0.887 — formação sequencial e escudo hexagonal UOM

## Visual
- **Todos** os hexágonos agora têm o mesmo estilo, incluindo uma pequena bolinha de luz no centro de cada um.
- **Todos** os hexágonos, inclusive os próximos à borda, alternam níveis de transparência suavemente e sem sincronia entre si.
- A borda contínua do escudo permanece visível, preservando a leitura do campo protetor.
- Mantidos os tons azuis e a transparência para revelar o canhão sem esconder a pixel art.

## Formação em três atos
1. O arco é desenhado progressivamente de **esquerda para direita** (primeiros 36% dos 780ms).
2. Com o arco completo, os hexágonos surgem também da **esquerda para direita** (64% restantes). Nenhum hex aparece durante o desenho do arco.
3. No fechamento, ocorre **um flash branco único** da cúpula (340ms de decaimento) e dispara um novo efeito sonoro grave, eletrônico, descendente, tipo **UOM**.

## Áudio
- Novo arquivo próprio `public/assets/sons/34_escudo_hexagonal_uom.wav`, sintetizado em PCM 16-bit mono, 22.050 Hz, 0,8 s.
- Registrado como `shieldReady` em `src/audio/sfx.js`, sujeito ao volume e à opção de desligar sons do jogo.
- Disparado apenas na mudança `forming → active`, uma vez por formação; não reinicia a cada quadro de animação.

## Compatibilidade
- Continua formando em todas as fases via `startWaveCountdown`, com novas regras visuais.
- Vida, colisões, cor de dano e regeneração dos escudos permanecem intactas.
- Escudos secundários continuam seguindo sua implementação atual.
- Testes cobrem ordem, direção, bolinha por hexágono, pulsação geral, flash e som único.
