# Operação Soberania v0.885 — Voo sem deformação e escudo hexagonal Phaser

## Problema resolvido
A animação anterior redesenhava o canhão e o prédio com partes artificiais de tamanhos distintos, produzindo um canhão duplicado e deformado. A nova animação **não cria outro canhão** e não contém sprites artificiais de cabeça/cano.

## Transição da Onda 11 Full Brazil
- Inicia na cena de GameScene que já é uma onda normal.
- `countdownActive` bloqueia mira, disparo e cronômetro enquanto decorre o voo, sem alterar controles permanentes.
- Anima as **posições Y dos próprios objetos** `cannonVisualParts`, respeitando origem, tamanho, rotação e coordenada X original.
- No início: o escudo desliga; motores aquecem; os sprites reais sobem verticalmente.
- Viagem: 4 s de estrelas multicoloridas com movimento vertical e sem cópia do canhão.
- Pouso: os mesmos sprites originais retornam às mesmas coordenadas, depois a próxima parada é iniciada.
- Após o pouso, os controles são restaurados automaticamente pelo começo da onda.
- A estrutura definitiva do prédio-foguete continua dependendo da arte a ser fornecida; foi removido o modelo geométrico falso do canhão/prédio.
- Fundo espacial com estrelas segue separado dos objetos reais e não altera a física.

## Novo escudo hexagonal
- Módulo `src/gameplay/hexShieldDome.js`: dezenas de hexágonos desenhados com `Phaser.GameObjects.Graphics`, sem depender de imagens com marca d'água.
- Cúpula semicircular com borda ciano luminosa, preenchimento quase transparente e hexágonos em tons azuis.
- A cor de dano do escudo continua comunicada por pequenos segmentos laterais.
- Desativa em 380 ms ao preparar decolagem; refaz a malha de baixo para cima durante 780 ms após o pouso; brilho/flash final de 450 ms.
- A cúpula original em sprite é ocultada, mas sua **colisão, HP, regeneração e estilhaçamento** continuam inalterados. Escudos das torres mantidos.
- O escudo se forma também durante os quadros com a onda pausada.

## Compatibilidade
- Vida reforçada dos Tipos 4/5 da v0.884 intacta.
- Onda 11 Full Brazil continua com batalhas contínuas e sem Tipo 6.
- Testes novos para malha, efeito de construção, ausência de sprite duplicado, travamento e retorno das coordenadas originais.
