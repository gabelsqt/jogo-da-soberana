# Operação Soberania v0.874 — leitura mais tranquila da introdução

- Após a digitação completa da convocação para **MESÁRIO***, mantê-la na tela por **5,5 s**, antes do plantão.
- As demais páginas de e-mail mantêm **2,9 s** de leitura após terminar a digitação (antes eram 1,9 s). As três falas do Zeca ficam **3,2 s** cada após a última letra (antes 2,4 s).
- Plantões preservam seus **5,2 s** para acompanhar a pixel art narrativa, e a velocidade de digitação continua em 32 ms por caractere.
- Clique, toque, espaço e Enter continuam acelerando a introdução conforme o comportamento já existente: durante a digitação revelam o restante; na pausa avançam.
- Tempo centralizado em `introHoldForSlide()`, com regressões dedicadas em `tests/introPacing874.test.js`.
- **Mecânicas nacionais não modificadas nesta versão**. Diferenciação de EUA e Rússia segue em discussão.
