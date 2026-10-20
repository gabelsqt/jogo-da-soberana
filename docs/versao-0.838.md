# v0.838 — Canhão em camadas

- Canhão da cena de combate usa `base.png` e nove `head_0.png` a `head_8.png` em `public/assets/canhao/`.
- A base fica parada e o cabeçote troca a textura ao mirar, sem deformar a pixel art por rotação contínua.
- Mantém o canhão vetorial se os arquivos estiverem ausentes.
- O recorte `barrel_*.png` está disponível no pacote de arte, mas não é sobreposto ao `head_*.png`, pois duplicaria o cano que já aparece no cabeçote completo.
- A animação de clarão e fumaça fica para outro passo após inspeção visual.
- Validar tamanho, posição, ângulos e testes no navegador.
