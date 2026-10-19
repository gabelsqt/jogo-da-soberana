# Game Soberana — Checklist acumulado de testes

> Checklist persistente, mantido na branch `feat/brasil2-arraial-balístico`. **Não marcado:** nada foi validado em browser nesta rodada. Continuar atualizando a cada pacote, e só assinalar itens após teste real do usuário ou evidência de execução.

## Preparação
- [ ] Conferir que a branch local é `feat/brasil2-arraial-balístico`; executar `git pull`.
- [ ] Executar `npm test` sem erros.
- [ ] Executar `npm run build` sem erros.
- [ ] Executar `npm run dev` e abrir o jogo; confirmar versão **0.58** na tela.
- [ ] Verificar no console e na aba Network se há erros de JavaScript ou imagens ausentes (especialmente `assets/lideres/{br,us,jp,ru,cn}_retrato.png` e `_personagem.png` da v0.55).

## Primeira noite e boteco — v0.57/0.58
- [ ] Jogar onda 0 sem trapaças; confirmar que ela pode ser vencida com build básica.
- [ ] Ao vencer, confirmar exibição do resultado ANTES da cinemática (sem repetição ou salto).
- [ ] Nave superior entra lentamente no alto da tela, sem cortar a arte ou tremer indevidamente.
- [ ] Núcleo da nave pulsa antes do disparo.
- [ ] Feixe atinge visualmente a posição do canhão; conferir comprimento/âncora, efeitos de impacto e screenshake.
- [ ] Plantão informa a destruição e a cena transita automaticamente ao boteco, sem travar nem iniciar onda 0 novamente.
- [ ] Destruição é tratada como evento roteirizado, não como derrota contabilizada.
- [ ] Os cinco retratos/conselheiros aparecem na mesa; observar visual, enquadramento e nomes oficiais **Kátia Strófika** e **Ming Da**.
- [ ] Diálogos da primeira visita avançam por clique/toque e Enter, apenas uma fala por ação.
- [ ] Durante diálogos, seleção de retratos e upgrades fica bloqueada.
- [ ] Depois dos diálogos, selecionar um representante e confirmar upgrade e início da onda 1.
- [ ] Nas visitas seguintes ao boteco, testar comentário de Zeca + conselheiro antes de liberar as escolhas.
- [ ] Conferir que a nova introdução não duplicou a narrativa de destruição do canhão.

## Combate, projéteis e ondas — v0.56
- [ ] Ondas 0–9: verificar se projéteis comuns podem ser abatidos com um único disparo.
- [ ] Conferir limite crescente dos projéteis disparados pela rotina comum (onda 0: 25; onda 1: 32; ... onda 9: 88).
- [ ] Observar se salvas com vários projéteis respeitam o limite por quadro sem excedê-lo.
- [ ] Conferir se tipos de inimigos especiais ainda produzem excesso de tiros fora do limite comum (registrar situação e onda).
- [ ] Testar jogabilidade das ondas 1–9 com build brasileira básica, sem pressão excessiva de projéteis.
- [ ] Confirmar que ondas comuns terminam por tempo conforme as regras existentes, inclusive com sobreviventes.
- [ ] Conferir fim de onda com sobreviventes, transições de portal, boteco e próxima onda.
- [ ] Confirmar preservação dos ataques e módulos já implementados dos chefões Tipo 6.

## Narrativa pré-onda 10 e traição — v0.56
- [ ] Antes da onda 10, a transmissão e tradução pelos linguistas aparecem **antes** da batalha.
- [ ] Avançar cada quadro por clique; conferir legibilidade do texto e se uma ação não pula dois quadros.
- [ ] Conferir explicação dos braços abertos do Cristo e das praias, sem spoilers antecipados.
- [ ] Testar entrada da nave-mãe após a revelação; confirmar que o relógio inicia corretamente.
- [ ] Na rota com traidor, testar a tela anterior à onda 11 e as duas escolhas: lutar / aceitar submissão.
- [ ] Aceitar submissão leva ao final do país sorteado **sem combate** e sem erro de navegação.
- [ ] Recusar ou lutar inicia a batalha contra o país traidor sorteado.
- [ ] Na luta da traição, rótulo de tempo exibe **“Tempo até o Brasil virar colônia”**.
- [ ] Rota **Full Brazil** não oferece botão de rendição e preserva o último combate alienígena.
- [ ] Testar vitória e derrota do traidor e Full Brazil; verificar que os dez finais permanecem acessíveis segundo as regras.
- [ ] Verificar se os elementos e molduras de transmissão são removidos corretamente ao trocar de cena.

## A validar após implementações futuras — NÃO IMPLEMENTADO AINDA
- [ ] Animação de dano das bombas do Tipo 6: piscada branca, tremor e quatro estágios visuais.
- [ ] Cores dos lasers finais: EUA azul-claro, Coreia roxo, China vermelho, Rússia amarelo.
- [ ] Superarma: módulos param de atacar, absorção progressiva de projéteis e confronto com núcleo.
- [ ] Explosão final exagerada com colapso em cadeia.
- [ ] Aparição e fala do representante quando Supremo fica disponível, antes de digitar.
- [ ] Textos personalizados e expressões por relacionamento/nível de upgrade.
- [ ] Comparação numérica e visual de upgrades e prévia animada.
- [ ] Opções independentes de redução de tremor e flashes/partículas.
- [ ] Epílogos revisados, plantão específico para rendição e suspense das pistas anteriores.
- [ ] Alienígenas humanoides de braços cruzados (apenas quando seus visuais estiverem implementados).

## Registros de teste / bugs encontrados
| Data | Versão | Onda/cena | Resultado | Bug ou observação |
|---|---|---|---|---|
| — | 0.58 | Aguardando teste geral | Não testado | Anotar aqui após o primeiro playtest |

> Ao receber resultados, marcar apenas o que foi efetivamente verificado e registrar bugs reproduzíveis com a onda e as etapas para repetir.

## Continuidade narrativa L1–L10 — conferir após implementação futura
- [ ] Notícias iniciais relatam OVNIs observando o Cristo Redentor, mas **não explicam** a motivação antes da revelação.
- [ ] Flagrantes de alienígenas na praia, tomando sol e bebendo água de coco, aparecem em notícias ao longo da campanha.
- [ ] Humanoides alienígenas pequenos, arrogantes e **sempre de braços cruzados**.
- [ ] Transmissão alienígena antes da onda 10 é inicialmente **ininteligível**; linguistas brasileiros traduzem progressivamente, começando por ameaças.
- [ ] A exigência de fechar os braços só fica inteligível depois do esforço dos linguistas.
- [ ] **Zeca fala com o jogador**, não negocia nem conversa diretamente com alienígenas; revisar fala provisória da v0.56.
- [ ] Alienígenas continuam atacando sem dar tempo para explicações; **não** justificar a guerra com burocracia imperial.
- [ ] Linguistas explicam **posteriormente** aos alienígenas o que é uma estátua e o gesto de acolhimento.
- [ ] Comandante alienígena insiste que o Cristo feche os braços.
- [ ] Epílogo Full Brazil celebra no boteco, seguido de pedidos internacionais de ajuda.
- [ ] Última notícia mostra outra estátua provocando confusão intergaláctica.

## Menu Extras e desbloqueios N11–N55 — testes futuros (ainda não implementados)
- [ ] Menu Extras só aparece após o primeiro final concluído; contém três botões distintos e telas com retorno.
- [ ] Grade com dez finais em posições fixas, pares por país/Full Brazil: **derrota esquerda, vitória direita**.
- [ ] Bloqueados mostram **somente ? centralizado** em quadro escuro, sem bandeiras, nomes ou contadores.
- [ ] Desbloqueados exibem **somente miniatura**, sem título sobreposto; título aparece ao selecionar.
- [ ] Conquista do final salva automaticamente ao determinar vitória/derrota; rendição também salva ao aceitar o ultimato.
- [ ] Galeria preserva desbloqueios entre campanhas/reabertura do navegador, não tem botão de apagar nem avisos de conquista.
- [ ] Seleção de final desbloqueado reproduz sequência completa imediatamente; avança por clique/toque e Esc retorna à galeria.
- [ ] Após a conclusão normal, tela escura **FIM** por 5 segundos; em seguida aceita tecla/clique para voltar ao menu.
- [ ] Ficha de cada representante libera após qualquer final do país; Zeca após qualquer final; alienígenas apenas após final Full Brazil.
- [ ] Fichas estáticas mostram retratos, descrições, falas e tecnologias **sem revelar planos colonizadores**.
- [ ] Jukebox libera músicas conforme ouvidas e músicas de desfecho somente no final correspondente.
- [ ] Jukebox mostra nomes de cenas, um título por vez, controles simples; música continua dentro do menu Extras e para ao retornar ao menu principal.
- [ ] Menu Extras usa visual retrô pixel art 16-bit.


## Critérios futuros de teste O1–O10 — não implementados nesta rodada
- [ ] Verificar redução de tiros por **aumento dos intervalos** e **redução da quantidade por rajada**; comparar densidade antes/depois.
- [ ] Wave Maker permite definir **limite de projéteis simultâneos individualmente por onda**; confirmar que o combate aplica os valores configurados.
- [ ] Pausas de recuperação ocorrem **entre eventos**, sem alterar arbitrariamente os padrões individuais de tiro.
- [ ] Cada projétil comum abatido com um acerto exibe **clarão branco e explosão colorida curta** (sem alterar necessariamente a cor em voo).
- [ ] Bombas do Tipo 6 possuem **quatro estágios visuais de desgaste**, com rachaduras e fragmentos que não mudam a colisão.
- [ ] Piscadas brancas de impacto duram aproximadamente **120 ms**; comparar percepção em disparos consecutivos.
- [ ] Tremor das bombas escala com o dano recebido, sem mover a área de colisão.
- [ ] **Cada** projétil interceptado produz sua explosão visível, inclusive em rajadas numerosas; observar desempenho.
- [ ] Confirmar viabilidade das ondas com **build brasileira básica e margem para erros**, sem depender de execução perfeita.
- [ ] Registrar métricas antes/depois do pacote prioritário de projéteis e dificuldade; priorização O10 não autoriza implementação sem novo pedido.


## Wave Maker — validações futuras P1–P10 (não implementadas nesta rodada)
- [ ] Campo numérico define teto de projéteis inimigos ativos por onda e respeita valores válidos.
- [ ] **P2 pendente:** confirmar com usuário como editar a frequência de tiros (global/por tipo/ambos) antes de criar testes finais para o recurso.
- [ ] Quantidade de projéteis por rajada editável por tipo de inimigo, independentemente do teto de projéteis ativos.
- [ ] Espaços vazios entre eventos produzem pausas reais; editor não precisa de marcador adicional.
- [ ] Gráfico mostra estimativa temporal de projéteis ativos e comunica claramente que é estimativa.
- [ ] Avisos discretos destacam intervalos próximos ao teto configurado, sem bloquear salvamento.
- [ ] Botão de teste rápido abre onda com build brasileira básica; opção avançada testa outras builds.
- [ ] Resumo do teste apresenta resultado, dano, tiros disparados, projéteis interceptados e inimigos eliminados.
- [ ] Comparação antes/depois mostra lado a lado métricas de dois testes.
- [ ] Salvar rascunho NÃO altera campanha; somente publicar aplica as mudanças. Verificar persistência, importação e versões.


## Wave Maker / Enemy Maker — critérios Q1–Q10 (futura implementação)
- [ ] Cadência: multiplicador de disparos para toda a onda e ajuste complementar específico por tipo (P2 resolvida por Q1 C).
- [ ] Menu de ferramentas oferece **Wave Maker** e **Enemy Maker** como opções distintas.
- [ ] Mudanças locais de onda não sobrescrevem configurações globais dos inimigos; Enemy Maker modifica explicitamente as propriedades gerais conforme regras a definir.
- [ ] Prévia animada reproduz entrada e posicionamento dos inimigos no editor.
- [ ] Ícones/miniaturas e cores permitem distinguir os eventos na linha do tempo.
- [ ] Duplicar onda inteira e copiar/colar seleção de eventos funciona sem alterar a original.
- [ ] Desfazer/refazer alterações e recuperar snapshots nomeados.
- [ ] Após teste, repetir imediatamente na mesma build ou escolher outra.
- [ ] Resultados ficam em histórico local e podem ser exportados.
- [ ] Indicador de dificuldade usa quantidade, tiros, velocidade e pausas, indicando claramente que é estimativa.
- [ ] Antes de implementar controles, verificar prioridade de limites, cadência e rajadas. Não marcar como concluído sem testar no navegador.


## Enemy Maker — validação futura R1–R10 (não implementado nesta rodada)
- [ ] Laboratório exibe **Wave Maker** e **Enemy Maker** como opções distintas.
- [ ] Galeria de inimigos mostra nomes e miniaturas corretas, sem selecionar tipo errado.
- [ ] Interface completa prevista contempla atributos de combate e movimentação.
- [ ] Valores globais do tipo e ajustes por nível funcionam com precedência documentada.
- [ ] Apenas ataques já existentes podem ser ajustados; nenhuma ferramenta cria ataque novo implicitamente.
- [ ] Sprite animado é exibido sem cortes/tremores indevidos; botão de testar ataques abre cenário correto.
- [ ] Arena permite testar um inimigo isolado e, futuramente, um grupo configurável.
- [ ] Enemy Maker altera base global; Wave Maker sobrescreve apenas valores locais à onda, sem modificar a base global.
- [ ] Salvar rascunho de inimigo NÃO altera campanha; publicação explícita aplica o conjunto validado.
- [ ] Primeira entrega limita escopo a atributos de combate e arena individual; marcar funcionalidades avançadas somente após implantação efetiva.


## Enemy Maker — testes previstos S1–S10 (ainda não implementados)
- [ ] Alternar entre modos básico e avançado sem perder rascunho; mostrar propriedades essenciais e opções expansíveis.
- [ ] Editar números com unidades corretas e validação de entrada.
- [ ] Básico restringe valores a faixas seguras; avançado amplia opções sem aceitar dados inválidos.
- [ ] Selecionar variante para edição e comparar todos os níveis numa tabela.
- [ ] Herança de atributos: mudança do valor-base propaga apenas a níveis sem sobrescrita; níveis personalizados preservam diferenças.
- [ ] Restaurar atributo isolado ou nível inteiro sem alterar outros níveis e sem publicar automaticamente.
- [ ] Prévia compacta de movimento e arena completa refletem parâmetros atuais do rascunho.
- [ ] Comparação de valores originais versus novos e testes comparativos antes/depois.
- [ ] Publicação mostra resumo, exige confirmação e guarda backup recuperável.
- [ ] Fechar editor com rascunho não deve alterar os inimigos ativos nas campanhas.


## Enemy Maker — simulação T1–T10 (testar após implementação, ainda pendente)
- [ ] Arena de teste usa fundo neutro e distingue claramente inimigo, tiros e defesa.
- [ ] Pausar/retomar congela a simulação corretamente; velocidades 0,5×, 1× e 2× preservam lógica e resultados esperados.
- [ ] Valores de movimento existentes (velocidade/aceleração) afetam a simulação sem criar rotas novas.
- [ ] Canhão automático e canhão manual são selecionáveis; comparar resultados sem misturar métricas.
- [ ] Hitboxes e trajetórias podem ser mostradas/ocultadas **independentemente** e não alteram colisões.
- [ ] Painel básico apresenta métricas essenciais; modo avançado expande estatísticas e não atrapalha visão.
- [ ] Duas execuções com as mesmas condições/seed produzem resultados consistentes; variação aleatória é opcional.
- [ ] Testar quantidade variável de inimigos e formações disponíveis, respeitando compatibilidade.
- [ ] Simulação termina por eliminação de todos ou prazo configurado; validar também saída manual.
- [ ] Após teste, repetir, visualizar resultados ou retornar ao Enemy Maker sem perder alterações não publicadas.


## Integração Enemy Maker ↔ Wave Maker — validação futura U1–U10
- [ ] Identificador técnico tipo + nível permanece estável mesmo após alterar nome descritivo opcional.
- [ ] Editor impede criação de novos tipos/classes e edita apenas inimigos existentes.
- [ ] JSON central representa todos os inimigos e variantes; exportação individual preserva esquema e dados.
- [ ] Atualização global publicada reflete nas ondas sem override; sobrescritas locais permanecem intactas.
- [ ] Wave Maker avisa que a base publicada mudou, mostra versão disponível e não descarta rascunhos ao recarregar.
- [ ] Publicação executa verificação de esquema e testes básicos de ataque/movimento; falhas impedem aplicar dados.
- [ ] Painel mostra ondas afetadas e detalhes de variantes/overrides antes de publicar.
- [ ] Comparar snapshots publicados e restaurar versão anterior sem perder a possibilidade de nova reversão.
- [ ] Importar JSON com prévia de diferenças e validação, sem modificar dados ativos antes da publicação.
- [ ] Publicação separada e publicação conjunta opcional preservam consistência; testar falha parcial e recuperação.
- [ ] **Não marcar como testado** antes de implementar e validar em ambiente real.
