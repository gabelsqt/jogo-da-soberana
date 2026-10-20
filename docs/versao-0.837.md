# v0.837 — Teste do novo canhão em sprites

- Integração experimental da primeira linha do spritesheet fornecido: nove quadros direcionais recortados.
- A mira seleciona o quadro correspondente ao ângulo do canhão, sem rotação física da textura. Mantém lógica de tiros, dano e colisões.
- Se os PNGs faltarem, o canhão vetorial antigo continua visível.
- Extraia `soberania_canhao_sprites.zip` na raiz do repositório, fazendo com que as nove imagens fiquem em `public/assets/canhao/direcao_0.png` a `direcao_8.png`.
- Os quadros de fogo/fumaça ainda não foram ligados; este pacote é uma primeira tentativa para testar enquadramento, leitura e ângulo da mira.
- Validar visualmente em browser e rodar testes/build locais.
