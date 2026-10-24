# Operação Soberania v0.893 — Balão de Rojões com frases de caminhão

## Especial brasileiro
- O especial posiciona o balão sobre a mira, como antes. Ele **não dispara fogos automaticamente**.
- O círculo verde translúcido mostra a área onde os fogos poderão surgir.
- **Cada tiro principal que atingir fisicamente o balão** (segmento da trajetória × raio físico do balão) é consumido e cria **uma mini-explosão colorida em um ponto aleatório dentro do círculo**; para a distribuição espacial ficar uniforme, o raio é amostrado por `sqrt(random())`.
- A mini-explosão tem **raio de dano de 27 px** e efeito visual menor (até ~20 px), durante **290 ms**; cores alternam entre amarelo, vermelho, verde, azul e rosa.
- O dano de **1 HP por mini-explosão** aplica-se igualmente a inimigos (inclusive Tipo 6, respeitando a vulnerabilidade dos módulos) e a projéteis inimigos. Os Tipo 1 básicos (HP 1) morrem com um único rojão; Tipo 2+ e projéteis resistentes precisam de múltiplos acertos. Inimigos Tipo 1 mais avançados podem possuir HP adicional conforme a progressão normal de onda.
- Todas as explosões causam o dano mesmo que o limite de dez efeitos visuais simultâneos seja atingido. O som de estouro é limitado por throttle; a física não depende dele.
- O balão permanece **2,2 segundos** e explode no final com o mesmo raio da sua zona: 100 px no estágio 1, crescendo 10 px por estágio brasileiro seguinte. A explosão final aplica o dano normal de 5 HP em área a naves e projéteis.
- Junto do estouro, uma **frase aleatória no estilo de para-choque de caminhão** aparece sobre o céu, em texto pixelado, com breve animação de subida, e desaparece depois.
- A metralhadora mantém o **turbo brasileiro de 5 s** após ativar o especial, conforme o bônus existente.
- Brasil conserva a interação híbrida com efeitos de outras nações. Coreia/EUA/Rússia/China não foram reformulados nesta versão.

## Regras de performance e integridade
- Balão tem hitbox de 19 px, enquanto a área do Arraial é visível e bem maior (100 a 130 px).
- Disparos podem atingir o balão a FPS baixos porque a colisão verifica o segmento real da trajetória do projétil, não apenas a posição de um frame.
- A geometria de cada fogo é gerada sobre um Graphics localizado na origem do estouro, e destruída ao terminar. O limite de efeitos visuais não reduz nem cancela o dano causado.
- Limpeza de balões ainda segue a rotina central de GameScene; não ficam hitboxes após 2,2 s.
- Testes de regressão cobrem frases, aleatoriedade, limites, danos, tempo, raios e evolução de upgrades.

## Situação da implementação
Diretamente no branch `feat/brasil2-arraial-balístico`, versão v0.893. As animações antigas de anel/espiral permanecem no arquivo de matemática para compatibilidade, mas não são mais chamadas no combate.
