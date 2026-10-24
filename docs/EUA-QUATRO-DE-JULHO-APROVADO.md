# EUA — Quatro de Julho (direção aprovada; ainda não implementar)

**Estado:** aprovado em 20/10/2026 e **implementado na v0.871** de Operação Soberania após autorização explícita. Testes de combate e playtest acompanham a alteração.

## Problema identificado
O tiro principal americano atualmente combina crescimento progressivo de projéteis até 12×, perseguição automática e explosões em área. Essa combinação automatiza demais os acertos e prejudica a habilidade do jogador.

## Solução aprovada — tiro principal “Quatro de Julho”
- Os disparos principais seguem a direção em que o jogador mirar: **sem perseguição automática (homing)** e **sem crescimento visual exagerado no voo**.
- **Acertos diretos** contra os alienígenas acumulam carga para o **Quatro de Julho**. Tiros errados não carregam.
- Assim que se completam **cinco acertos**, **o próximo disparo principal é automaticamente especial**; não exige botão ou tecla adicional e continua exigindo pontaria.
- O tiro especial provoca uma explosão temática **vermelha, branca e azul**, com dano em área. O efeito é visualmente diferente dos fogos juninos brasileiros.
- Acertos indiretos da explosão, reação em cadeia e estilhaços **não devem carregar** a próxima salva, impedindo efeitos recursivos.
- Progressão provisória explicitamente aprovada:
  - **Nível 1:** munição explosiva nos impactos.
  - **Nível 3:** Quatro de Julho ativado, próximo tiro especial após **5 acertos diretos**.
  - **Nível 5:** explosão patriótica com área ampliada e efeito audiovisual mais grandioso.
  - **Nível 7:** estilhaços adicionais quando explode o tiro patriótico.
  - **Nível 10 — Independence Day:** Quatro de Julho recarrega com **3 acertos diretos**; explosões mais impressionantes.
- Nos **níveis pares (2, 4, 6 e 8)**, preservar a evolução do **tiro secundário/especial**, o míssil ou **bomba gigante americana**, com explosão e onda de choque. **Não substituir nem reduzir esse especial** em razão da nova arma principal.
- Os detalhes numéricos de dano, raio, dispersão e frequência precisam de playtest e não foram aprovados como valores finais.

## Limites de escopo
A decisão **não muda automaticamente** upgrades de outros países, escudos, torres, progressão da campanha, Supremo ou balanceamento do Tipo 6. Implementado em `src/gameplay/usJuly.js`, `src/gameplay/v1Upgrades.js` e `src/scenes/GameScene.js`, sem mudanças no míssil gigante do especial.

## Identidade narrativa
Victor McDollar ama os maiores espetáculos e as maiores armas: o Quatro de Julho é uma salva militar coreografada de independência, enquanto o especial continua sendo a **bomba monumental**.
