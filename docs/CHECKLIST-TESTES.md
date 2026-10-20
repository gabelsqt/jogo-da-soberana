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


## Publicação e recuperação — testes futuros V1–V10 (não implementados)
- [ ] Sobrescrita local no Wave Maker prevalece sobre valor publicado global; outras ondas herdam normalmente.
- [ ] Ícones distinguem valores herdados e locais; explicação ao selecionar identifica origem e valor efetivo.
- [ ] Antes de publicar Enemy Maker, resumo mostra impacto e lista expansível detalha ondas e propriedades afetadas.
- [ ] Falha proposital em qualquer etapa de publicação conjunta faz rollback completo; nem Enemy Maker nem Wave Maker fica parcialmente ativo.
- [ ] Rascunhos possuem autosave local e botão Salvar; fechar/abrir editor recupera dados, sem publicá-los.
- [ ] Histórico identifica data, hora e notas opcionais de versões publicadas.
- [ ] Restaurar versão publicada preserva rascunhos e histórico de recuperação.
- [ ] Exportação de backup completo e exportações separadas produzem arquivos válidos e reimportáveis.
- [ ] Importação permite selecionar inimigos, ondas ou ambos, com prévia e validação de dependências antes de afetar rascunhos.
- [ ] Publicação valida esquema e executa testes básicos automaticamente; dados inválidos não entram em vigor.
- [ ] Nenhum item marcado como concluído antes de implementação e teste real.


## UX do Laboratório / Wave Maker / Enemy Maker — testes futuros W1–W10
- [ ] Laboratório mostra cartões claros com descrições e entradas distintas para Wave Maker e Enemy Maker.
- [ ] Atalho entre editores e botão de retorno funcionam e não descartam rascunhos.
- [ ] Barra horizontal exibe ondas numeradas 0–11, permite selecionar cada onda e comunica a seleção atual.
- [ ] Seleção de inimigo mostra atributos essenciais e expande detalhes sem ocultar indevidamente dados.
- [ ] Eventos podem ser movidos por arraste e tempo exato via campo numérico; valores permanecem sincronizados.
- [ ] Seleção múltipla de eventos por clique modificador e por área, inclusive para copiar/mover.
- [ ] Ctrl+Z/Ctrl+Y e botões de desfazer/refazer refletem mesmo histórico e lidam com operações múltiplas.
- [ ] Painel de propriedades recolhível amplia área da linha do tempo; reabertura não perde edição.
- [ ] Marcador de rascunho não publicado aparece nos objetos modificados e apresenta detalhes sob demanda, desaparecendo somente após publicação efetiva.
- [ ] Interface desktop funciona com teclado e mouse; em celular há consulta legível, sem exigir ferramentas completas.
- [ ] Manter testes desmarcados até implementação e validação reais.


## Testes de balanceamento X1–X10 — aprovados / implantação gradual
- [ ] Testar vitória conforme a regra real da campanha para cada onda.
- [ ] Testes repetidos calculam taxa de vitória e HP restante para build básica.
- [ ] Simular combate da onda inteira e de trecho selecionado com reset consistente de estado.
- [ ] Exibir gráficos ao longo do tempo de projéteis efetivamente ativos e dano realmente sofrido.
- [ ] Quantidade configurável de simulações automáticas em lote; isolar parâmetros e random seeds.
- [ ] Canhão automático oferece mira ideal e simulação de erro/tempo de reação humanos.
- [ ] Resumo de taxa de vitórias e painel de estatísticas expansível com dano, vida e interceptações.
- [ ] Recomendações de balanceamento não alteram automaticamente rascunho/campanha.
- [ ] Simular onda isolada e campanha completa.
- [ ] Verificar limites técnicos e viabilidade prática da build brasileira básica antes de classificar onda como balanceada.
- [ ] **v0.59 parcial:** abrir Wave Maker > ANALISAR; validar mensagem de concentração de entradas, pico e sugestões; confirmar que não são apresentados como resultados de combate.
- [ ] Rodar `npm test` e `npm run build` no clone antes de marcar a v0.59 como validada.

## Wave Maker v0.60 — verificação de interface ainda pendente
- [ ] Gráfico da linha do tempo representa entradas estimadas e identifica pico; não confundir com projéteis ativos.
- [ ] TRECHO aceita valores em segundos dentro da duração da onda, rejeita intervalos inválidos e não altera eventos.
- [ ] ANALISAR considera o intervalo selecionado.
- [ ] COMPARAR cria referência da onda atual e depois exibe valores antes/depois; troca de onda limpa referência.
- [ ] Selecionar onda, mover eventos, salvar rascunho e reiniciar editor não causa erros gráficos.
- [ ] Rodar testes com `npm test`, build com `npm run build` e inspecionar layout 960×540 no navegador.
- [ ] Simulação real, métricas de dano, sobrevivência, lote de testes e campanha completa continuam pendentes (X1–X10).

## Wave Maker v0.61 — teste real de rascunho (validar no navegador)
- [ ] Em Laboratório > Wave Maker, editar evento e clicar TESTAR; confirmar spawn do evento do rascunho no jogo, sem afetar a campanha.
- [ ] Resultado de vitória no teste mostra VOLTAR AO WAVE MAKER, sem avançar campanha.
- [ ] Derrota no teste mostra retorno ao Wave Maker e botão de tentar novamente mantém o snapshot.
- [ ] Eventos oficiais e estado de campanha não mudam após salvar/testar um rascunho.
- [ ] Testar ondas 0, 1, 9, 10 e 11; verificar principalmente chefes, timers e cenas especiais.
- [ ] Rodar `npm test` e `npm run build` no clone; corrigir regressões antes de considerar estável.
- [ ] Relatórios com HP/dano/interceptações, IA e lotes de simulação **ainda pendentes**.

## v0.62 — telemetria de teste no Wave Maker (pendente de validação)
- [ ] Teste jogável de onda registra relatório ao vencer e ao perder, sem publicar rascunhos.
- [ ] RESULTADOS exibe os cinco testes mais recentes da onda atual e mensagem adequada se vazio.
- [ ] Persistência de até 30 testes em localStorage; a lista permanece após recarregar o site.
- [ ] Dano bruto, HP, escudo, tiros básicos, tiros inimigos, abates e interceptações instrumentadas têm valores coerentes.
- [ ] Interceptações por outros mecanismos e abates de chefes requerem instrumentação adicional; não divulgar como contagens completas.
- [ ] Confirmar estabilidade de testes nas ondas 0, 1, 9, 10 e 11, incluindo derrota por destruição, tempo e vitória.
- [ ] Executar `npm test` e `npm run build` e verificar no navegador; não validados nesta sessão.

## Wave Maker v0.63 — validação pendente
- [ ] RESULTADOS mostra últimos cinco testes por onda sem misturar dados de outras ondas.
- [ ] Comparar os dois testes mais recentes mostra valor anterior, novo, delta e resultado; dados não medidos recebem n/d.
- [ ] EXPORTAR cria JSON com metadados e até 30 registros, sem mutar o histórico salvo.
- [ ] Histórico de resultados sobrevive à recarga, tolera armazenamento corrompido ou indisponível.
- [ ] Métricas incompletas são explicitamente identificadas como medidas parciais.
- [ ] Rodar `npm test`, `npm run build`, testar interações no navegador; pendente nesta sessão.


## v0.64 — acesso e Enemy Maker inicial (validação pendente)
- [ ] Em Menu > Testar upgrades V1, botões WAVE MAKER e ENEMY MAKER aparecem sem sobreposição com o seletor de ondas ou outros controles.
- [ ] Botão antigo BR+EUA+CHINA não aparece; seu comportamento de build fixa foi retirado da tela.
- [ ] WAVE MAKER abre o editor de ondas e VOLTAR retorna ao Laboratório.
- [ ] ENEMY MAKER abre a galeria/lista inicial de tipos 1–6 e seleção de nível 1–10.
- [ ] Campos numéricos alteram os atributos mostrados; valores inválidos são rejeitados; SALVAR persiste após voltar e abrir novamente.
- [ ] RESTAURAR NÍVEL volta aos padrões do tipo/nível sem alterar configurações publicadas.
- [ ] Rascunhos do Enemy Maker não modificam estatísticas reais de inimigos ou campanha nesta versão.
- [ ] Executar `npm test` e `npm run build`; validar visualmente 960×540 no navegador antes de marcar a versão como estável.

## v0.65 — cutscene da traição / submissão
- [ ] Abrir onda 11 com país traidor: a cutscene apresenta RESISTIR À TRAIÇÃO e ACEITAR SUBMISSÃO antes do combate.
- [ ] Escolher RESISTIR: ambos os botões, labels e a sobreposição da cutscene desaparecem antes da contagem regressiva; nenhum botão de submissão aparece durante a luta.
- [ ] Escolher ACEITAR SUBMISSÃO: abre o final de colonização sem entrar no combate.
- [ ] Rota Full Brazil não oferece submissão.
- [ ] Testar retorno/derrota/repetição da onda 11 e verificar ausência de botões residuais.
- [ ] Rodar `npm test` e `npm run build` e verificar visualmente no navegador; pendente.
