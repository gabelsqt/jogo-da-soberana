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

## v0.66 — reforço do Tipo 6
- [ ] Confirmar HP de módulos em 36% da vida-base e HP do núcleo em 16%, para todas as variantes (alien/países).
- [ ] Comparar tempo de sobrevivência dos quatro módulos com versões anteriores usando build brasileira forte e build básica.
- [ ] Confirmar que módulos ainda podem ser destruídos, o núcleo é exposto e pode ser derrotado; verificar escudos/barreira.
- [ ] Rodar `npm test` e `npm run build`; verificar navegador e estabilidade das ondas 10/11.

## v0.67 — globo coreano com reflexos curvos (a validar)
- [ ] Ao atingir o globo com tiro básico ou laser, reflexos surgem em **arcos curvos** a partir do globo na direção dos inimigos.
- [ ] Brilho violeta/lilás, núcleo quase branco, flash na origem e pequeno impacto no destino são visíveis sem prejudicar legibilidade em pixel art.
- [ ] Quantidade e dano dos reflexos permanecem iguais aos da v0.66 em todos os níveis coreanos; foco em 3/6/12/24 reflexos.
- [ ] Com múltiplos inimigos, arcos variam suavemente; com nenhum inimigo, não há efeitos desnecessários.
- [ ] Rajadas frequentes, níveis altos e luta Tipo 6 não causam travamento: máximo de oito raios **visuais** por salva, sem reduzir o dano.
- [ ] Efeitos são removidos após animação e ao trocar de cena; não deixar Graphics/tweens residuais.
- [ ] Executar `npm test` (inclui discoGlobe e discoReflectionVfx) e `npm run build`; rodar playtest visual — pendentes nesta sessão.

## v0.68 — evitar rastros da cutscene antes da onda 11
- [ ] Iniciar onda 11 com **Coreia traidora** e escolher **RESISTIR À TRAIÇÃO**; confirmar ausência de barras vermelhas, fundos de botões, sombras, rótulos, rodapé e cabeçalho da cutscene sobre combate.
- [ ] Confirmar que a interface normal do combate permanece e que contagem regressiva/inimigos aparecem corretamente.
- [ ] Aceitar submissão **antes** da onda 11 e confirmar entrada direta no final correspondente, sem vazamento de elementos.
- [ ] Testar outras nações traidoras e a rota Full Brazil (sem botão de submissão).
- [ ] Passar pela cutscene da onda 10 para verificar limpeza do botão de continuar.
- [ ] Executar `npm test` (inclusive `finalePreludeCleanup.test.js`) e `npm run build`; validar visualmente no navegador. Ainda não executado.


## v0.69 — Operação Desvio de Carga (validar em jogo)
- [ ] Com traidor dos EUA/Coreia/Rússia/China na onda 11, **primeira derrota**: tela de aceitar derrota com retrato pequeno e sério do Zeca ao lado; não aparecer na luta nem na rota Full Brazil.
- [ ] Clicar retrato abre proposta do Zeca. **Recusar** leva diretamente ao final colonial; **aceitar** abre cena de recuperação específica do traidor.
- [ ] Cena da operação permanece até clicar; texto apresenta motorista **brasileiro** sem explicação de logística. Arte geométrica provisória visível sem erro de assets (substituir por 4 artes do usuário quando disponíveis).
- [ ] Depois de aceitar, recomeçar a **onda 11 inteira**, com **o mesmo traidor**, todos os módulos/escudos/ataques do boss intactos, vida de canhão 100 e escudo cheio; **sem mostrar novamente** a cutscene de traição.
- [ ] Todas as melhorias do traidor que estavam confiscadas voltam com efeito original (inclusive transformação final); **Supremo do traidor permanece indisponível**. Melhorias dos outros países permanecem ativas.
- [ ] Testar traidor no nível 9 e 10 para conferir bloqueio do Supremo com transformação ativa.
- [ ] Na **segunda derrota**, não oferecer Zeca novamente. Mostrar a despedida do Zeca e permitir somente ver o final colonial.
- [ ] Na vitória da revanche, mostrar final de vitória apropriado ao traidor original; não alterar contagem de finais.
- [ ] "ACEITAR SUBMISSÃO" no prelúdio continua levando diretamente ao final colonial, sem Zeca. Full Brazil continua com fluxo original.
- [ ] O atalho R e opção de pausa para "Reiniciar onda" não permitem revanches ilimitadas na onda 11; reinício normal segue disponível em ondas anteriores.
- [ ] Executar `npm test` (testes novos de Zeca + antigos da campanha) e `npm run build`; testes sintáticos e verificações diretas isoladas passaram, mas suíte/build/playtest ainda **pendentes**.


## v0.70 — escudos, Tipo 6, Wave Maker e Rússia (a validar no navegador)
- [ ] Escudo principal tem aparência de **sprite pixel-art**, acompanha mudanças de HP azul/verde/amarelo/vermelho; colisão e raio da cúpula permanecem idênticos.
- [ ] Escudo de cada torre aparece como sprite independente com tamanho correto; desaparece ao morrer e reaparece na regeneração.
- [ ] Após cair da faixa vermelha para **0 HP**, o escudo quebra em pequenos estilhaços, sem permanecer visível nem afetar dano. Testar perda por tiro normal, gelo russo e ogiva americana.
- [ ] Tipo 6 ondas **10 e 11** surge **com escudo principal ativo e cheio**, e os escudos dos módulos resistem mais; núcleos e sequência de ataques preservados.
- [ ] Tipo 6 entra lentamente (4,2 s alienígena, 4,6 s traidores) e estabiliza por 2 s; nenhum dano ao boss antes disso; **relógio de 60 s não cai até o chefe ficar alvejável**, então inicia em 60 s.
- [ ] A entrada e cronômetro funcionam tanto na onda 11 inicial quanto na única revanche do Zeca.
- [ ] WAVE MAKER abre a partir do Laboratório de Upgrades sem erro de método `events()`; alterna onda, edita, salva, testa e retorna corretamente.
- [ ] Rússia: tiros diretos congelam e alvos congelados **não atraem nem contagiam** outros inimigos.
- [ ] Rússia: destruir um inimigo ainda congelado provoca explosão de gelo que causa dano próximo (níveis 1/3/5/7/10: 44/60/76/96/120 px, dano 2/3/4,5/6/9). Não estilhaçar depois de descongelar.
- [ ] Estilhaçamentos em cadeia não travam nem afetam indevidamente o boss Tipo 6; Matryoshka, Supremo e builds híbridas com Coreia/China continuam funcionando.
- [ ] Executar `npm test` (russianFrost, type6Boss, balance069Plus e regressão completa), `npm run build`, `npm run dev`. **Ainda pendentes** neste ambiente.


## v0.71 — tela inicial limpa e música recolhível
- [ ] Menu inicial apresenta panorama do Rio **sem faixas Cubo News nem painel central opaco**; não há escurecimento geral cobrindo a pixel art.
- [ ] Título, subtítulo e dois botões de navegação legíveis sobre o céu, sem cobrir o Cristo Redentor ou elementos importantes. Conferir aspecto em desktop, tela pequena e proporção responsiva.
- [ ] **COMEÇAR CAMPANHA** abre a introdução/campanha; **TESTAR UPGRADES** abre o laboratório V1; teclas **ENTER** e **U** continuam funcionando.
- [ ] Botão discreto **♫ MÚSICA** no canto inferior esquerdo; painel de volume começa **fechado**.
- [ ] Clique em MÚSICA revela slider, porcentagem e mudo; clique e arraste mudam volume e persistem ao trocar de cena/recarregar navegador.
- [ ] Controle de silenciar/ligar funciona sem alterar o volume selecionado; botão MÚSICA recolhe o painel novamente.
- [ ] Versão **v0.71** no canto inferior direito, sem tarja jornalística, e controles de música da pausa não foram afetados.
- [ ] Rodar `npm test` (inclui `tests/menuClean071.test.js`), `npm run build` e playtest visual em desktop/mobile. **Ainda pendentes no ambiente de edição.**


## v0.72 — onda 1: menos tiros e altitude mais baixa
- [ ] Ao entrar na **onda 1**, enxames básicos surgem perto de y=120 e descem em curvas suaves até ~y=235, sem subir para o alto da tela; esquadrilhas táticas aparecem/maniobram na faixa média, perto de y=190–230.
- [ ] Conferir o ritmo visual de sete enxames (4,5,5,5,5,6,6 naves) e três esquadrilhas táticas (3,4,4), sem tela saturada. Total: 47 inimigos programados.
- [ ] Conferir a frequência de tiros: **um disparo por grupo Tipo 1 e até dois disparos por grupo Tipo 2**, não tiros de cada integrante ou salvas duplas. Limite esperado de 13 tiros de formação se todos os atiradores designados sobreviverem.
- [ ] Conferir que os tiros básicos e táticos causam 10 de dano (antes 14) e têm velocidade 0,9×; colisões da onda 1 causam 0,75× o dano normal.
- [ ] Última formação abre aos 12,7 segundos de batalha e os integrantes devem ser liberados antes de 15 segundos, inclusive quando duas formações usam o mesmo corredor.
- [ ] Confirmar que **onda 0 e ondas 2–11 não mudaram** em quantidade, movimento ou disparos; Wave Maker abre e, em rascunho novo/oficial, mostra a nova onda 1, sem sobrescrever rascunho salvo.
- [ ] Com build Brasil nível 1 e outro país nível 1, verificar que a onda 1 continua desafiadora, mas vencível sem tantos projéteis.
- [ ] Executar `npm test` (incluindo `tests/wave1Balance.test.js` e `tests/formation035.test.js`), `npm run build` e teste visual no navegador. **Ainda pendentes no ambiente de edição.**


## v0.73 — botão PAUSAR visível e responsivo
- [ ] **Desktop (Firefox/Chrome):** onda 1 após contagem de 30 segundos, PAUSAR [P] aparece **inteiro**, centralizado e com margem superior, sem corte pelo browser.
- [ ] Durante o zoom 1,48× da abertura da onda, botão PAUSAR mantém seu tamanho e posição; não sobe junto com a câmera nem desaparece.
- [ ] Testar janela maximizada, janela estreita, F11/tela cheia, zoom do navegador e barras de interface móveis: botão não sai do viewport.
- [ ] Testar iframe itch.io ou safe area simulada: manter margem no topo, incluindo notch em dispositivo móvel horizontal.
- [ ] Clique/tap PAUSAR abre PauseScene; botão do jogo desaparece durante pausa; botão Retomar e tecla P/ESC retomam o jogo e fazem o botão reaparecer.
- [ ] Trocar de onda, voltar ao menu e reiniciar: nenhum botão DOM duplicado nem sobreposição com cortes de cena.
- [ ] Layout Cubo News (onda) e modo laboratório (sem faixa): reposicionar sobre o jogo sem afetar faixa, cronômetro, tiro ou mira.
- [ ] Executar `npm test` (inclui `tests/pauseHudResponsive.test.js`), `npm run build`, `npm run dev`; **pendentes** neste ambiente.


## v0.74 — Supremo: palavras e segurança do teclado
- [ ] Com Supremo desbloqueado (nove melhorias de um país), **Espaço antes dos últimos 5 s** não reinicia nem inicia o Supremo; apresenta aviso claro sobre a janela de disponibilidade.
- [ ] Quando faltarem 5 s, o indicador **SUPREMO PRONTO — ESPAÇO** aparece de forma legível mesmo com Cubo News ativo.
- [ ] Apertar Espaço abre painel central com a palavra exigida e quebras de linha corretas; jogo, inimigos, projéteis e relógio param **completamente** até concluir ou cancelar a digitação.
- [ ] Digitar **REVEILLON** (Brasil), **FREEDOM** (EUA), **SPUTNIK** (Rússia), **ENTREGA** (China) e **ENCORE** (Coreia) — letras R, F, P etc. **não reiniciam nem pausam**; palavra completa ativa o Supremo exatamente uma vez.
- [ ] Digitar letra incorreta indica erro, permite **Backspace** e após corrigir conclui. **Esc** cancela e restaura tempo/combate; pressionar Espaço depois permite reabrir enquanto a janela está disponível.
- [ ] Durante combate normal, teclas **R** e **F** sozinhas não provocam reinício. **P/Esc** abrem pausa normalmente; não devem pausar quando fazem parte da digitação do Supremo.
- [ ] Após Supremo ativado, a cena cinematográfica decorre e conclui a onda conforme final aprovado; não reaparecer prompt na mesma batalha.
- [ ] Em modo DEV, **Shift+1/5 isolado** não salta a onda; somente o atalho deliberado **Ctrl+Alt+Shift+número** continua funcionando.
- [ ] Retestar Type 6 e onda 11 para confirmar que digitação do Supremo congela o relógio/ataques e não interfere na revanche do Zeca.
- [ ] Rodar `npm test`, `npm run build` e playtest visual em Firefox/Chrome — **ainda pendentes** no ambiente de edição. Regressões em `tests/supremeCodeInput.test.js`.
