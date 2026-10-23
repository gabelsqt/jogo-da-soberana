# Operação Soberania — v0.902 — China colinear + Coreia com saraivadas e ricochetes

## Objetivo
Experimento isolado do **Laboratório**, sem alterar os dez acordos nem as árvores da campanha atual.

## China — especial de alinhamento dos projéteis
- O especial **não produz um feixe**, laser ou aplicação instantânea de dano.
- Clique direito inicia uma conversão automática de disparos normais em **fila de projéteis físicos individuais**, cada um com sua própria trajetória, colisão e dano.
- O alinhamento leva **1,5 s**: os ângulos saem de uma pequena dispersão e convergem para exatamente a direção da mira. Ao término, a dispersão retorna gradualmente durante **1,5 s**.
- Na fase central, todos os tiros seguem a mesma linha reta; **não atravessam** o primeiro alvo.
- Não é preciso manter o botão pressionado. Durante o especial, disparos normais independentes ficam suspensos.
- A fila pode ser alimentada por projéteis extras de upgrades chineses; eventuais cópias entram na mesma linha, sem bifurcar após o disparo.
- O intervalo entre tiros da fila usa: `max(30 ms, basicInterval / (count × splitFactor) × rateFactor)`, onde `splitFactor=1+copyDamage` quando a árvore tiver divisão.
- Controles de especial disponíveis: **S1** multiplicador de intervalo entre tiros; **S2** duração da fase alinhada; **S3** multiplicador de dano em módulos/escudos; **S4** multiplicador do dano individual dos projéteis.
- O limite de 30 ms evita sobrecarga visual e física (>33 disparos/segundo).

## Coreia — principal de saraivadas discretas
- Tiro principal lança **3 projéteis laser individuais por salva**, levemente distribuídos em ângulo. Cada laser segue trajetória balística normal.
- **Sem rastro ou fenda residual do Lightstick** no Laboratório. Nada de coluna de energia contínua.
- Cada laser pode **ricochetear para outro inimigo dentro do alcance**, e nunca voltar ao mesmo alvo numa mesma trajetória. Não ricocheteia na carcaça Tipo 6.
- **P1:** 1 salto, alcance de 180 px, preservação de 70% do dano a cada salto.
- **P2:** 2 saltos, 215 px, 4 lasers por salva.
- **P3:** 3 saltos, 260 px, 5 lasers por salva.
- **P4:** 4 saltos, 320 px, 6 lasers por salva.
- Salto não cria uma duplicação recursiva: redireciona **o mesmo projétil** para um novo alvo; o dano decai após cada contato.
- Outros países podem receber o efeito secundário coreano no principal **sem mudar a identidade gráfica da arma-base**.
- Na transformação nacional nível 10: canhão dispara **9 lasers por salva** a cada **160 ms**; um emissor holográfico projetado na boca do canhão aparece enquanto dispara. O Supremo continua desbloqueado só no nível 10.

## Laboratório
Os novos parâmetros continuam no arquivo editável `src/gameplay/labBalanceProfile.js`, com os controles numéricos e importação/exportação JSON existentes. Perfis JSON antigos ainda carregam campos conhecidos; os campos descartados (feixe/Lightstick) voltam aos novos valores padrão.

## Limites
- Somente o modo **Laboratório** usa estas duas novas mecânicas. O jogo de campanha continua funcionando com o comportamento anterior até a migração das escolhas de identidade e P/S para a campanha.
- A parte holográfica é procedural provisória (não arte final).
- Dano/recarga ainda precisam de playtest, especialmente Korean nível 10 e builds de muita multiplicação chinesa.
- A propriedade coreana de ricochete sobre projéteis americanos explosivos precisa de balanceamento próprio, pois vários impactos podem produzir várias explosões.

## Testes
`tests/chinaKoreaSalvos902.test.js` contém testes puros de convergência, fila colinear, limites e ricochetes, somados aos regressivos do Laboratório (`tests/labMath901.test.js`). O GitHub Actions compila o jogo e disponibiliza artefatos/Pages.
