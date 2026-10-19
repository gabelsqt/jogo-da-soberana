# Versão 0.45 — Cubo News independente e ticker de telejornal
Data: 19/10/2026 • Branch: `feat/brasil2-arraial-balístico`.

## Solicitação
- A faixa da v0.44 ocupava muita área visual, cobria o canhão e não se mantinha estática quando a câmera tremia ou ampliava a cena.
- Referência aprovada: pequena chamada em vermelho, manchete preta em fundo cinza-prata e subtítulo num ticker vermelho com deslocamento horizontal contínuo da **direita para a esquerda**.
- Cronômetro enorme, sem painel, branco semitransparente, no canto inferior direito, com alerta vermelho final.
- O **canhão e os prédios devem estar acima** da faixa; nenhuma necessidade de substituir o fundo se o HUD não o cobrir.

## Alterações
1. `index.html`: novo `#broadcast` envolve **canvas Phaser (`#game`)** e **faixa DOM (`#cubo-news-overlay`)** como elementos irmãos. A faixa só existe visualmente nas ondas. Em vez de obscurecer o mapa, adiciona **44 unidades lógicas fora da cena 960×540**.
2. `src/config/responsive.js`: ajuste de escala da composição **960×584** em ondas ou **960×540** no menu/laboratório, sem deformar a proporção e sem modificar coordenadas de tiros/colisões. O modo muda via evento `cubo-layout-change`, com cleanup dos listeners.
3. `src/ui/cuboNewsHud.js`: a Cubo News deixa de criar Phaser GameObjects; atualiza manchete e texto rolante por DOM. Animar o ticker em CSS com cópia duplicada evita lacuna ao repetir. O elemento não pertence à câmera e fica estático mesmo sob `camera.shake`, `camera.zoom` ou efeitos CRT.
4. Cronômetro: apenas números grandes, sem caixa; a cor fica vermelha pulsante nos últimos 5 segundos, preservando o efeito sonoro. O selo de versão antigo some durante a transmissão para não cobrir o visor.
5. `GameScene.js`: preserva **CANNON=(480,494)** e **fundo Rio original** sem alterações; `createCuboNewsHud` integra com o fluxo de ondas preexistente e a faixa é escondida no `shutdown` da cena.

## Garantias e testes
- Manchetes e subtítulos, frequência de 5 segundos, fila de três e regras editoriais aprovadas são mantidos.
- Os testes adicionais exercitam cálculo de dimensões com e sem ticker, HTML separado do canvas, ciclo de vida DOM, alerta terminal e animação horizontal.
- GDDs atualizados apenas para modificar apresentação, sem reabrir decisões de balanceamento dos chefões.
- Dev/test: `npm test`; exportador itch: `npm run build:itch`.

## Validação visual pendente
Após publicação, testar desktop, janela estreita e dispositivo em paisagem; observar legibilidade da manchete e do relógio em 16:9, posição do canhão, scroll contínuo, zoom e screenshake. Testes automatizados não comprovam a aparência subjetiva.
