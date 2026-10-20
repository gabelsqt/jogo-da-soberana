# Operação Soberania v0.868 — abertura narrativa definitiva

- **Sem login ou nome no começo da campanha.** Tela de e-mail oficial com convocação do jogador como **MESÁRIO***. A cláusula do asterisco fica oculta.
- Transmissão da **Cubo News interrompe a convocação**: notícia da invasão alienígena, seguida por manchete sobre o cancelamento das eleições; nenhum alienígena fala ou explica suas intenções antes da onda 10.
- Segundo e-mail atualiza a convocação: o jogador foi promovido automaticamente a **GENERAL DE GUERRA**. Só após o anúncio aparece, digitada lentamente, a nota de rodapé do asterisco esclarecendo a conversão obrigatória para funções militares.
- **Zeca Carrara** entra com o retrato brasileiro já disponível em `assets/lideres/br_retrato.png`, como mecânico de carros recrutado para manutenção e explicando que obuseiro é o canhão mostrado. A primeira batalha e a contagem de entrada permanecem como estavam.
- **Typewriter audiovisual** nos e-mails e na fala de Zeca: `introKey` para cada caractere não branco, com pitch [0.88,1.14] e máximo de três vozes sobrepostas. Sons adicionais `introAlert` para plantão e `introNotice` para promoção, todos gerados em PCM mono 22.050 Hz. `predev` e `prebuild` já incluem esse gerador.
- Espaço/Enter/clique completam o segmento atual antes de avançar; Esc ou botão permite pular. Avanço automático após a leitura mantém duração da introdução razoável.
- Testes de narrativa, som sintetizado e fluxo de avanço atualizados; testes legados de login e seis slides removidos.
