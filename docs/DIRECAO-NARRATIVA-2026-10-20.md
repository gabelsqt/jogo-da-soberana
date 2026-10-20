# Direção narrativa — revisão de 20/10/2026

**Projeto:** Soberania  
**Estado:** decisões autorais registradas. Abertura/Zeca/alienígenas permanecem em planejamento; **apenas os textos do personagem Victor McDollar foram atualizados no código**, sem mudança de mecânicas, arte, áudio ou duração.  
**Precedência:** estas decisões mais recentes substituem o material anterior que lhes for incompatível em `docs/GDD.md`, `src/gameplay/introScript.js`, `src/scenes/IntroScene.js` e demais diálogos/cenas.

## 1. Silêncio alienígena até a onda 10 — decisão aprovada

- Antes da onda 10, os alienígenas **não se comunicam com os humanos** em português ou em outro idioma. Não mostrar mensagens, ultimatos, diálogos, legendas de tradução, comunicação telepática ou transcrições alienígenas na introdução ou ondas 0–9.
- Na onda 10 ocorre **a primeira comunicação inteligível**, em português, feita pelos próprios alienígenas.
- A origem do português alienígena é a convivência com **vendedores de chá mate e Biscoito Globo nas praias do Rio de Janeiro**. Eles aprenderam a falar português conversando com esses vendedores, e seu modo de falar reflete essa influência.
- **Revelação na onda 10 — contato por meio de lanche:** linguistas brasileiros encontram alienígenas nas praias cariocas e **usam Biscoito Globo e chá mate para convencê-los a conversar**. Os visitantes já haviam aprendido expressões e português de praia **conversando com vendedores ambulantes**, mas só aceitam conversar com a equipe de linguistas quando são atraídos pelo lanche. Assim, os linguistas fazem a primeira aproximação e obtêm a conversa; **não decifram uma transmissão cifrada nem ensinam o idioma aos ETs**.
- **Timing:** a conversa, seu conteúdo e o fato de que eles falam português só são revelados **no prólogo/começo da onda 10**, nunca antes. As notícias podem mencionar boatos/avistamentos de alienígenas curtindo a praia antes disso, sem atribuir-lhes falas, acordos ou intenções confirmadas.
- Preservar como revelação cômica tardia: eles interpretam os braços abertos do Cristo Redentor como uma afronta diplomática; a associação com o Cristo e a presença das naves pode ser observada pelos humanos, mas **o motivo não deve ser explicado antes da onda 10**.
- Preservar a outra premissa já aprovada compatível: alienígenas aproveitam as praias de dia e atacam à noite.
- A Cubo News e personagens humanos podem especular livremente, porém **não podem afirmar ter recebido promessas, tratados ou explicações alienígenas** antes da onda 10.
- Esta regra substitui a lógica prévia de linguistas decodificarem o idioma na onda 10 e a promessa alienígena de partida ao amanhecer; se houver participação futura de linguistas, não é condição para compreender a primeira fala alienígena.
- Também substitui trechos antigos do GDD sobre emissões, ultimatos ou comunicação alienígena anteriores à onda 10, mesmo quando anteriormente apresentados como indecifráveis.

## 2. Nova abertura por e-mail e texto digitado — decisão aprovada

A abertura será **simples**, com texto aparecendo **letra por letra**, em uma interface mínima de e-mail (não a antiga cena interativa do computador), sem a antiga sequência inicial de seis quadros da Cubo News e sem narração do comandante alienígena. **Não haverá tela de login nem solicitação do nome do jogador na introdução.**

**Ordem narrativa obrigatória:**
1. A pessoa abre um e-mail de convocação para atuar como **mesário(a)** nas eleições.
2. **Imediatamente depois**, um segundo e-mail chega (notificação ou chegada visual clara).
3. O segundo e-mail informa que **as eleições foram canceladas devido à invasão alienígena**.
4. Informa também que **todos os mesários foram promovidos a generais de guerra**, com efeito imediato.
5. Após os dois e-mails, o jogador **conhece Zeca Carrara** numa apresentação breve (ver seção 3), antes de assumir o obuseiro e iniciar o primeiro combate. Manter apresentação curta, legível, com humor burocrático e sem revelar ainda o motivo da invasão.

### Texto provisório para revisão editorial (ainda não aprovado palavra por palavra)

**E-mail 1**  
**Assunto:** Convocação para serviço eleitoral  
Prezada pessoa convocada,  
Você foi selecionada para atuar como mesária nas próximas eleições. Aguarde novas instruções.

**[Novo e-mail recebido — imediatamente]**

**E-mail 2**  
**Assunto:** URGENTE — CANCELAMENTO DAS ELEIÇÕES  
Em razão da invasão alienígena, informamos que as eleições foram canceladas.  
Todos os mesários foram automaticamente promovidos a generais de guerra, com efeito imediato.  
Apresente-se à defesa de sua cidade.  
Agradecemos a compreensão.

Os textos acima são um **rascunho sugerido**, não frases autoralmente aprovadas. A mecânica de leitura/avanço e duração poderão ser definidas no polimento.

## 3. Primeiro encontro com Zeca Carrara — decisão aprovada em 20/10/2026

- **Logo depois dos e-mails**, o jogador encontra Zeca Carrara, que se apresenta brevemente, falando **diretamente com o jogador** (o recém-promovido general).
- **Zeca é mecânico de carros**, não um militar veterano e nem um operador profissional de obuseiro. Foi **obrigado/designado a trabalhar na manutenção do obuseiro** em razão da invasão.
- É um civil improvisador com conhecimento real de mecânica automotiva, aplicado de forma precária e inventiva ao armamento. Manter o humor de gambiarra e burocracia e sua personalidade carismática; não apresentá-lo como especialista em artilharia.
- O encontro vem **antes do primeiro combate** e introduz a relação jogador-general ↔ Zeca-mecânico; Zeca orienta e interage com o jogador ao longo da campanha.
- Não estabelecer por conta própria quem o obrigou ou o processo de requisição — detalhe ainda aberto.
- **Zeca deve explicar ao jogador que “obuseiro” é o canhão que ele está vendo**, com linguagem simples, natural e bem-humorada, na própria apresentação; evitar pressupor que o jogador conheça o termo militar.
- **Rascunho de fala (não aprovado literalmente):** “Ô, general! Você que era o mesário? Sou Zeca Carrara, mecânico de carros. Quer dizer, era. Me botaram pra cuidar desse obuseiro aqui. Obuseiro é esse canhão, tá? Eu também não sabia. Disseram que era tudo mecânica. Eu tentei explicar a diferença, mas já tinham me dado a chave.”
- Apresentação simples, sem alongar a abertura; formato visual e número de falas permanecem a definir.

## 4. Continuidade e revisão necessárias

- **Substituir** na implementação atual o fluxo de login no PC velho → escolher/salvar nome → abrir Cubo News → seis slides de notícias/diálogos por **dois e-mails com efeito de digitação → apresentação de Zeca → primeiro combate**, quando autorizado. Não pedir nome ao jogador nessa abertura.
- **Retirar** da introdução antiga as falas do comandante/oficial alienígena e a notícia de acordo diplomático baseado em promessa alienígena.
- **Revisar** notícias Cubo News e possíveis roteiros de revelação antes da onda 10, removendo comunicações/decodificação contraditórias.
- **Remover da abertura** quase toda a antiga apresentação do(a) ex e a explicação de vingança ligada ao cadastro como mesário. A convocação eleitoral é o ponto de partida por si só. Isso **não equivale a proibir qualquer menção futura** ao(à) ex, apenas retira sua importância da introdução; eventual uso em outras partes da narrativa depende de decisão posterior.
- O fato de todos os mesários serem promovidos prevalece sobre a explicação anterior de promoção exclusiva do protagonista por baixas militares.
- A origem profissional de Zeca como **mecânico de automóveis recrutado à força para manutenção** substitui qualquer caracterização anterior de operador experiente do canhão ou técnico militar de carreira, inclusive a definição I1 do GDD quando houver conflito.
- **Não modificar**, nesta etapa, progressão de ondas, gameplay, finais, sprites ou código. Essas alterações ficam para uma implementação posterior explícita.

## 5. Victor McDollar — direção de personagem aprovada em 20/10/2026

- **Victor McDollar representa os Estados Unidos.** Seu traço dominante é a paixão por tudo que é **grande, enorme, monumental e exagerado**: equipamentos, poder de fogo, investimentos, espetáculos, promessas e até gestos.
- É **nostálgico de quando, na visão dele, os Estados Unidos eram grandiosos como antigamente**. Fala frequentemente dessa grandeza perdida e tem o impulso de recuperá-la. Trata-se de sua visão de mundo e bordão, não de um fato objetivo que o narrador precise afirmar.
- **Ele oferece ajuda de modo insistente, caloroso e aparentemente muito bem-intencionado.** Deve parecer que realmente quer ajudar o Brasil e está empolgado em oferecer coisas maiores e melhores, não um vilão óbvio ou um negociador agressivo.
- **A maioria de suas interações deve remeter ao tamanho/grandeza**, com variações criativas, em vez de repetir exatamente a mesma frase toda vez. Quando recebe uma proposta modesta, tende a ampliá-la.
- **Voz:** confiante, otimista, ligeiramente espalhafatosa, nostálgica e cheia de entusiasmo comercial/diplomático. Humor na insistência em aumentar a escala e na comparação com os bons tempos.
- **Traição sorteada continua independente:** Victor não é automaticamente traidor nem se torna suspeito de saída. Se for escolhido como traidor numa campanha, sua motivação e a mudança de tom serão reveladas apenas no momento narrativo adequado. Sua aparente boa intenção anterior deve funcionar tanto em campanhas em que ajuda como naquelas em que trai.
- **Aplicação editorial:** apresentar Victor como uma caricatura de personalidade **à la Donald Trump**: política de espetáculo, autoconfiança enorme, superlativos, nostalgia da grandeza americana, disposição para construir **muros enormes como resposta recorrente a problemas**, desejo de ser maior e melhor que os concorrentes, e ofertas entusiasmadas que pareçam sinceramente prestativas. **Victor representa oficialmente os Estados Unidos e buscou o cargo por vontade e ambição próprias; não caiu ali por acidente, promoção errada, confusão ou milhas.**
- **Eliminar definitivamente da biografia, do texto e das histórias de Victor** as piadas de sala VIP, aeroporto, passagens, milhas, pontos, bagagem e assinatura premium. Nada disso explica sua carreira. O humor vem de sua ideologia de grandeza, sua proposta de construir muros até contra naves voadoras e sua necessidade de declarar tudo 'o melhor'.
- **Consistência:** o traidor continua sorteado, portanto nenhuma fala deve antecipar que Victor trairá; ele pode ser um aliado voluntariamente generoso mesmo sendo ambicioso. Não prometer um muro como mecânica efetiva de jogo antes de planejá-la.
- **Textos implementados:** as cinco histórias de Victor, suas falas de oferta/aceitação e suas dez falas de upgrade foram reescritas em `src/gameplay/representatives.js` e `src/gameplay/upgradeDialogue.js`. Outras aparições (notícias, cutscenes e finais) permanecem para revisão editorial futura.
- **Exemplos provisórios para o revisor (não são falas finais aprovadas):**
  - Apresentação: “Victor McDollar, representante dos Estados Unidos! Eu vim porque quis. E vou ajudar vocês a vencer. Grande! A maior vitória que já viram!”
  - Oferta de armamento: “Esse canhão é ótimo. Sabe o que seria melhor? Um MUITO maior! E um muro enorme. Confie em mim: eu faço os melhores projetos!”
  - Upgrade: “Mais potência! Mais alcance! Os melhores mísseis! É assim que a gente fazia nos tempos de grandeza!”
  - Após combate: “Excelente trabalho, general! Agora imagine tudo isso... só que dez vezes maior!”
  - Comentário nostálgico: “Nos velhos tempos, nós éramos os melhores em tudo. Eu quero aquela grandeza de volta. E ninguém vai pensar pequeno comigo!”
- **Estado:** história, apresentação e falas de upgrades alteradas na branch de trabalho, **sem modificações em mecânicas, assets ou outros personagens**.

## 6. Cubo News — linha editorial canônica (20/10/2026)

**Decisão aprovada para TODO o noticiário, incluindo manchetes, subtítulos e plantões da campanha:**

- **Nunca se referir à própria emissora pelo nome dentro do conteúdo editorial.** Evitar “Cubo News afirma”, “Cubo News celebra”, “segundo a Cubo News”, “a emissora”, “a redação”, “nós da Cubo News” e equivalentes autocentrados quando não acrescentam piada. O logotipo e a marca gráfica **CUBO NEWS** continuam existindo nas molduras e na identidade da transmissão: a proibição é de **autorreferência editorial**, não do crédito visual.
- **Nunca pedir desculpas, corrigir-se humildemente, admitir erro ou mostrar arrependimento.** Não publicar retratação nem ressalvas honestas que reconheçam incoerência.
- **Hipocrisia absoluta:** a cobertura muda de opinião conforme o patrocinador, upgrade e resultado da guerra. Elogiou ontem, despreza hoje, proclama que **sempre** teve a posição atual; trata evidências do passado como boato, montagem, contexto distorcido ou outra invenção conveniente.
- **Interesses próprios mascarados como objetividade:** patrocínios, publicidade e interesses estrangeiros definem sua linha. A voz é de jornalismo sensacionalista e falsamente imparcial, porém com convicção total e sem metacomentário do tipo “a emissora mentiu”.
- **Exibir as contradições pelas manchetes sucessivas**, não por subtítulos que explicam ao jogador “apesar dos elogios de ontem”. O público infere sozinho a fraude e a cara de pau.
- **Compatibilidade com o mistério alienígena:** nas ondas 0–9 ninguém recebeu promessa ou comunicação dos ETs; remover todas as manchetes e subtítulos que falem de acordos, ultimatos, garantias e mensagens extraterrestres antes da onda 10. A emissora pode **inventar unilateralmente** explicações para os acontecimentos, se o texto deixar claro que é uma afirmação humana, não uma comunicação real.
- **Revisão separada e sem aplicação automática:** a rodada de revisão jornalística deve apresentar **todas as notícias**, em grupos de 10, com manchete e subtítulo juntos e possibilidade de substituição/comentário. As mudanças só serão consolidadas no código após avaliação editorial do usuário.

**Rascunho de manchete para a onda 10 (não aprovado literalmente):**
- **Manchete:** “LINGUISTAS CONSEGUEM PRIMEIRO CONTATO COM MATE E BISCOITO GLOBO”.
- **Subtítulo:** “Equipe encontrou extraterrestres na praia e os convenceu a conversar oferecendo o tradicional lanche carioca. Visitantes já falavam português aprendido com vendedores ambulantes.”
- A emissora não deve pedir desculpas por ter passado nove ondas sem entender os invasores e não deve citar seu nome dentro da notícia.

**Exemplo de contraste editorial (rascunho, não aprovado como fala final):**
- Primeiro: “ARMAMENTO BRASILEIRO LEVANTA DÚVIDAS; ANALISTAS RECOMENDAM CAUTELA”.
- Depois: “TECNOLOGIA NACIONAL SEMPRE FOI SUPERIOR, GARANTEM ESPECIALISTAS”.
- Se cobrada: “ANTIGAS REPORTAGENS CONTRÁRIAS SÃO APONTADAS COMO MONTAGEM”.

**Estado:** regra de escrita aprovada e registrada; conteúdo das notícias ainda será revisado. Nenhum texto do noticiário ou mecânica alterado no jogo nesta decisão.

## Fonte da decisão

Conversa de direção narrativa e revisão textual do projeto em **20/10/2026**.
