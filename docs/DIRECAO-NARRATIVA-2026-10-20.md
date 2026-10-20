# Direção narrativa — revisão de 20/10/2026

**Projeto:** Soberania  
**Estado:** decisões autorais registradas para futura revisão/implementação. **Nenhum código, arte, áudio ou duração foi alterado nesta etapa.**  
**Precedência:** estas decisões mais recentes substituem o material anterior que lhes for incompatível em `docs/GDD.md`, `src/gameplay/introScript.js`, `src/scenes/IntroScene.js` e demais diálogos/cenas.

## 1. Silêncio alienígena até a onda 10 — decisão aprovada

- Antes da onda 10, os alienígenas **não se comunicam com os humanos** em português ou em outro idioma. Não mostrar mensagens, ultimatos, diálogos, legendas de tradução, comunicação telepática ou transcrições alienígenas na introdução ou ondas 0–9.
- Na onda 10 ocorre **a primeira comunicação inteligível**, em português, feita pelos próprios alienígenas.
- A origem do português alienígena é a convivência com **vendedores de chá mate e Biscoito Globo nas praias do Rio de Janeiro**. Eles aprenderam a falar português conversando com esses vendedores, e seu modo de falar reflete essa influência.
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
- **Rascunho de fala (não aprovado literalmente):** “Ô, general! Você é o mesário? Sou Zeca Carrara, mecânico de carros. Quer dizer, era. Me botaram pra fazer manutenção desse obuseiro aqui. Disseram que era tudo mecânica. Eu tentei explicar a diferença, mas já tinham me dado a chave.”
- Apresentação simples, sem alongar a abertura; formato visual e número de falas permanecem a definir.

## 4. Continuidade e revisão necessárias

- **Substituir** na implementação atual o fluxo de login no PC velho → escolher/salvar nome → abrir Cubo News → seis slides de notícias/diálogos por **dois e-mails com efeito de digitação → apresentação de Zeca → primeiro combate**, quando autorizado. Não pedir nome ao jogador nessa abertura.
- **Retirar** da introdução antiga as falas do comandante/oficial alienígena e a notícia de acordo diplomático baseado em promessa alienígena.
- **Revisar** notícias Cubo News e possíveis roteiros de revelação antes da onda 10, removendo comunicações/decodificação contraditórias.
- **Remover da abertura** quase toda a antiga apresentação do(a) ex e a explicação de vingança ligada ao cadastro como mesário. A convocação eleitoral é o ponto de partida por si só. Isso **não equivale a proibir qualquer menção futura** ao(à) ex, apenas retira sua importância da introdução; eventual uso em outras partes da narrativa depende de decisão posterior.
- O fato de todos os mesários serem promovidos prevalece sobre a explicação anterior de promoção exclusiva do protagonista por baixas militares.
- A origem profissional de Zeca como **mecânico de automóveis recrutado à força para manutenção** substitui qualquer caracterização anterior de operador experiente do canhão ou técnico militar de carreira, inclusive a definição I1 do GDD quando houver conflito.
- **Não modificar**, nesta etapa, progressão de ondas, gameplay, finais, sprites ou código. Essas alterações ficam para uma implementação posterior explícita.

## Fonte da decisão

Conversa de direção narrativa e revisão textual do projeto em **20/10/2026**.
