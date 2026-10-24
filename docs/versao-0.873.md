# Operação Soberania v0.873 — abertura narrativa e reparo do boteco

## Abertura
- Na primeira convocação, o **MESÁRIO** é destacado em laranja, letra a letra, com ondulação de pixels suave; asterisco permanece normal.
- Na promoção, **GENERAL DE GUERRA** aparece com fonte de 43 px, vermelha e ondulação mais forte, sem mexer na cláusula jurídica já aprovada.
- O primeiro plantão inclui painel narrativo pixel art sem legenda: celulares e selfies diante de OVNIs no Cristo, ataque repentino e consequências sem violência gráfica. O segundo mostra a urna com faixa diagonal **CANCELADO**.
- Os dois painéis usam SVG de geometria pixelada, carregados e rasterizados pelo Phaser com filtro NEAREST.
- Zeca se apresenta em três telas consecutivas, uma fala por vez, explicando ter sido convocado porque consertava ônibus e confundiram essa experiência com manutenção de obuseiro.
- Demora do plantão estendida para permitir acompanhar a história na imagem; clique/espaço seguem acelerando o fluxo.

## Boteco
- Corrigida exceção ao tentar usar `focusPanel` antes da criação: esse erro impedia a montagem da cena e todas as propostas.
- O painel de foco e os botões de aceite/voltar começam não interativos enquanto ocultos, são ativados após selecionar um representante e desativados ao fechar.
- Encerrar o diálogo inicial destrói a sobreposição e libera os retratos.
- Textos continuam com digitação e aceite só após confirmação explícita.
- Clique primário e toque na tela são aceitos pelas propostas, botões e avanço das falas, sem depender de flags exclusivas do mouse desktop.
- A terceira fala do Zeca mantém a explicação de que `obuseiro` é o canhão do jogador.

## Testes
- Atualizados testes de roteiro e introdução para 7 telas totais (três do Zeca).
- Adicionadas verificações de ordem de inicialização no boteco, ativação de controles, conteúdo dos três quadros, efeitos de ondulação e ativos gráficos.
