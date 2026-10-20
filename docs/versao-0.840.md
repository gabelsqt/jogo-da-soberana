# v0.840 — Mira lateral e saída do tiro

- Amplia a mira de 15° para 2° de elevação mínima: o canhão pode quase apontar para os lados.
- Origem dos projéteis do canhão em sprites deslocada de 40 para 76 pixels, acompanhando o ângulo discreto do cano desenhado (nove direções). A velocidade/direção real das balas segue a mira contínua.
- Fallback vetorial mantém origem anterior de 40 pixels.
- Teste da restrição angular ajustado; checagem visual no navegador ainda necessária para o alinhamento fino.
