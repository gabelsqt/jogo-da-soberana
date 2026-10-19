# Game Soberana — Especificação técnica do Soberania Wave Maker

> **Estado:** especificação proposta para revisão, consolidando decisões aprovadas 1–34 em 19/10/2026. **Planejamento apenas; não implementar nem alterar a campanha** até aprovação explícita. Branch de referência: `feat/brasil2-arraial-balístico`.

## 1. Objetivo e integração
Editor visual de ondas **dentro do Laboratório Soberana**, sem site separado. Importar as ondas existentes como **cópias editáveis** e conservar intactos os eventos oficiais; configurar tipo/nível de inimigo, quantidade, formação automática, posicionamento, cronograma e perfil ofensivo; testar a onda real usando a build definida no laboratório; exportar **um JSON com todas as ondas** para integração deliberada ao código. O editor não altera diretamente o repositório ou a campanha.

## 2. Decisões funcionais consolidadas (1–34)
| Decisão | Regra aprovada |
|---|---|
| 1–4 | Editor integrado ao laboratório; posicionar grupos em campo visual; controlar eventos por linha do tempo e parâmetros; distinguir rascunhos de ondas oficiais. Ver histórico do GDD principal para numeração original. |
| 5 | Apenas os padrões de movimento **já existentes**; sem desenho de trajetórias personalizadas. |
| 6 | Disparos configurados por perfis fixos de agressividade, não por parâmetros ofensivos finos. |
| 7 | Simulação visual completa e teste jogável separados. |
| 8 | Duplicação manual de eventos e repetição automática configurável; o usuário pediu esclarecimento: repetição significa gerar instâncias em intervalos, não multiplicar objetos a cada quadro. Detalhes de interface ainda podem ser refinados. |
| 9 | Histórico de versões de rascunhos, com restauração e JSON. |
| 10 | Cinco níveis fixos de agressividade. |
| 11 | Simulação completa de naves e projéteis, com pausa, velocidade e busca temporal. |
| 12 | Histórico automático e marcos nomeados manualmente. |
| 13 | Abrir onda oficial cria **cópia**, sem editar os dados da campanha. |
| 14 | Publicação oficial exclusivamente pela exportação JSON e integração no código. |
| 15 | Perfil ofensivo modifica **apenas frequência/cadência** de disparos. |
| 16 | Simulação utiliza **motor real do jogo**, não uma imitação de movimentos. |
| 17 | Máximo de **10 versões automáticas por onda** + versões nomeadas. |
| 18 | Persistência local no navegador + importação/exportação JSON. |
| 19 | Coordenadas em **pixels** e tempos em **milissegundos**. |
| 20 | Frequências relativas: Pacífico 0%, Leve 50%, Moderado 100%, Intenso 150%, Extremo 200%. 100% = cadência original do respectivo inimigo. |
| 21 | Buscar instante anterior reinicia e reproduz a simulação até o instante escolhido. |
| 22 | Snapshot automático **após uma sessão de edição**, não a cada movimento do mouse. |
| 23 | Mostrar métricas **objetivas** (total de inimigos, simultaneidade e estimativa de disparos); sem nota subjetiva e sem alertas automáticos nesta fase. |
| 24 | Selecionar a **build do laboratório** antes do teste jogável. |
| 25 | **Um único arquivo JSON** com todas as ondas. |
| 26 | Preservar todos os campos avançados importados, mesmo sem controle visual próprio. |
| 27 | **Semente fixa por teste**, alterável para experimentar variações. |
| 28 | Ao mudar duração, perguntar se mantém horários absolutos ou redistribui proporcionalmente. |
| 29 | Grupos são blocos **expansíveis**, com edição individual dos integrantes. |
| 30 | **Painel de propriedades avançadas** editável, com validação. |
| 31 | **Lista lateral** para selecionar ondas **0–11**. |
| 32 | Ao sair do teste jogável, apresentar **relatório** e então voltar ao editor, preservando contexto. |
| 33 | Importação permite **novo projeto** ou **substituir projeto atual**, com confirmação para a segunda opção. |
| 34 | Primeira entrega: editor de eventos básicos — criar, mover, duplicar, excluir grupos, editar tempo/posição e salvar rascunho. |

## 3. Base técnica examinada (estado atual; ainda não alterado)
- `src/scenes/LabSetupScene.js`: seleção de onda e upgrades, entradas para arena livre e teste de onda; ponto de navegação do novo editor.
- `src/gameplay/labConfig.js`: configurações de builds do laboratório e níveis de inimigos de teste.
- `src/gameplay/waves.js` e `src/gameplay/advancedWaves.js`: geração existente de eventos e metadados de ondas.
- `src/gameplay/formation035.js`: converte eventos legados em grupos, inclui padrões e regras de posição; **importar o resultado efetivo dos eventos**, não somente o gerador legado, para não perder o que o jogador vê.
- `src/scenes/GameScene.js`: `waveEvents`, `scheduleWaveEvents()`, `spawnWaveEvent(event)`, atualização real, e passagem de `labConfig`. Necessário acrescentar caminho isolado de `previewEvents` futuramente; não sobrescrever `getV035WaveEvents` em modos normais.
- `src/ui/cuboNewsHud.js`: relógio e entrada cinematográfica; prévia/retorno devem evitar estados presos e descartar efeitos ao trocar de cena.
- `src/gameplay/type6Encounter.js`: chefes Tipo 6 têm inicialização/fases específicas; editor pode preservar/mostrar esses eventos desde o início, mas controles avançados de boss podem ficar para etapa posterior.

## 4. Contrato de dados proposto (schema ainda sujeito a revisão)
Um arquivo JSON versionado com metadados e um mapa `waves`, de `wave0` a `wave11`. Duração em ms, `seed`, eventos com IDs estáveis, `at`, `type`, `level`, `count`, `x`, `y`, `pattern`, `formation` e `aggression` quando aplicáveis. **Não remover** `portalX`, `group`, `warning`, `side`, `bossCountry`, `bossLevel`, `finalBoss`, `coalitionSize`, `index`, ou qualquer outro campo importado do jogo. Se um parâmetro não puder ser editado visualmente, mantê-lo no painel avançado e no JSON.
Exemplo **ilustrativo, não definitivo**:

```json
{
  "schemaVersion": 1,
  "projectName": "Campanha Soberana",
  "waves": {
    "wave1": {
      "durationMs": 30000,
      "seed": 1031,
      "events": [
        {
          "id": "w1-e01",
          "at": 3000,
          "type": 1,
          "level": 1,
          "pattern": "swarm",
          "count": 5,
          "x": 240,
          "y": -30,
          "aggression": "moderate"
        }
      ]
    }
  }
}
```

**Importante:** o formato do exemplo não presume que `x/y` ou `aggression` já sejam reconhecidos por todos os caminhos de spawn. Criar adaptador/validador sem mudar a semântica de eventos antigos. Manter propriedades não reconhecidas por round-trip; validar limites e impedir objetos malformados/protótipos perigosos no JSON.

## 5. Editor — layout e interações
- Lista lateral de ondas 0–11; copiar versão oficial para rascunho selecionado sem alterar fonte da campanha.
- Campo 960×540 de referência (converter coordenadas de ponteiro para pixels do jogo e indicar área fora da tela); arrastar grupo e editar X/Y numericamente; mostrar origem efetiva, respeitando `portalX` e offsets do motor.
- Linha do tempo proporcional à duração, arraste de bloco + valor `at` numérico editável em segundos com conversão para milissegundos; snap opcional apenas visual, valor preciso preservado.
- Evento = bloco expansível; criar, copiar, excluir, alterar quantidade, formação, padrão existente, nível e agressividade; ajustes por nave são offsets associados ao grupo e **só podem afetar comportamento se suportados pelo adaptador**.
- Painel avançado exibe campos técnicos com tipos, enumerações e validações; mudanças preservam chaves não expostas.
- Repetir evento: quantidade de ocorrências e intervalo entre elas; representar no agendamento instâncias estáveis, evitando duplicidade de IDs ou disparos.
- Alterar duração abre escolha: manter `at` ou escalonar `atNovo = round(atAntigo × duraçãoNova/duraçãoAntiga)`; garantir política explícita para eventos além da nova duração.

## 6. Perfis ofensivos
`pacific=0`, `light=0.5`, `moderate=1`, `intense=1.5`, `extreme=2` representam fator de **frequência**, não intervalo direto. Se intervalo base é 2 s, `light` atira a cada 4 s, `intense` a cada ~1,33 s e `extreme` a cada 1 s. `pacific` não produz tiros. Perfis não alteram padrões, quantidade por disparo, velocidade, dano ou HP. Para chefes e ataques roteirizados que não usam cadência convencional, **não assumir mudança automática**; definir compatibilidade por mecanismo antes de ativar.

## 7. Simulação / testes
- O preview deve reutilizar as rotinas de `GameScene` numa execução de teste isolada; sem alterar progressão, saves da campanha ou inimigos reais do jogo oficial.
- Pausar, acelerar e buscar instante exigem controle sobre relógio, timers/tweens/Phaser Time, física, efeitos e áudio. Para voltar, reiniciar o estado e reproduzir até o tempo solicitado; **não tratar reprodução acelerada como determinística por padrão**.
- Semente fixa deve governar fontes de aleatoriedade relevantes; controlar ordem de eventos e, se necessário, usar step fixo. Caso fontes não determinísticas permaneçam, identificar e corrigir antes de prometer replay idêntico.
- No teste jogável: escolher build via laboratório; registrar relatório objetivo ao encerrar (resultado, tempo, inimigos criados/destruídos e projéteis conforme instrumentação disponível). Retornar ao editor preservando rascunho/onda/seleção.
- Métricas do editor: total previsto de inimigos, maior número de grupos com janelas sobrepostas e estimativa de disparos; projeção é aproximação e deve ser rotulada como tal.

## 8. Persistência, histórico e segurança
- Armazenamento local do navegador para rascunhos; esquema versionado/migrações. Planejar fallback de quota/armazenamento negado e lembrar que limpar dados do navegador apaga projetos locais.
- Salvar automaticamente **ao fim da sessão de edição** (por exemplo fim de arraste ou sequência de edições consolidada), máximo 10 snapshots automáticos por onda; snapshots nomeados preservados separadamente.
- Operações de substituir projeto/importação com confirmação; permitir importar em projeto novo. Exportar JSON como backup e integração com código. Só um passo de engenharia explícito e revisionado publica uma onda na campanha.

## 9. Etapas de entrega (nenhuma autorizada neste documento)
1. **MVP aprovado pela decisão 34:** schema/validação, cena do Wave Maker no laboratório, lista lateral, importar evento existente como cópia, linha do tempo e posicionamento, criar/mover/duplicar/excluir grupo, propriedades básicas e rascunho local. Não conectar ainda à campanha oficial.
2. Propriedades avançadas com preservação e import/export JSON único; versões automáticas e nomeadas.
3. Adaptador de eventos e execução de teste com build do laboratório; retorno ao editor e relatório.
4. Simulação visual completa com pausa/aceleração/busca/seed e medidores objetivos.
5. Integração explícita de JSON revisado ao repositório; playtest e ajuste de ondas feitos somente sob aprovação.

## 10. Critérios de aceite e riscos
- Operações de edição e JSON fazem round-trip **sem perda dos campos existentes**.
- Arraste e valor numérico mantêm tempo, X e Y sincronizados e precisos.
- Alterar `wave1` em rascunho **não altera** `wave1` oficial até exportação e integração deliberada.
- O editor de MVP permite restaurar trabalho depois de recarregar o navegador.
- Repetição e grupos expansíveis não duplicam spawns nem alteram contagem implícita por engano.
- O teste jogável respeita as builds do laboratório; resultados e retorno não deixam efeitos órfãos na tela.
- A simulação com seed produz replay equivalente ou informa explicitamente as limitações antes de ser considerada pronta.
- Confirmar por `npm test`, `npm run build` e playtest local (`git pull` + laboratório), não por GitHub Actions.
- **Riscos conhecidos:** inconsistências entre `getV035WaveEvents` e eventos editáveis, configuração de Tipo 6, atrasos da introdução Cubo News, aleatoriedade e sobrecarga de projéteis/texturas. Bugs existentes (quadrado preto após reforço e travamentos) não são declarados resolvidos pelo Wave Maker.

## 11. Pendências de engenharia
Antes da primeira implementação: definir schema exato dos offsets individuais e das repetições, lista de campos editáveis por tipo, limites da duração/quantidade, estratégia de persistência local e ponto de entrada das cenas. Antes da simulação: determinismo de timers e efeitos, física e ciclo de vida da cena. **Nenhuma dessas pendências autoriza mudança de gameplay neste documento.**
