# Operação Soberania — v0.901 — Laboratório Matemático (experimental)

## Entrar
No menu principal: **LABORATÓRIO** (antigo “TESTAR UPGRADES”).

1. Escolher obrigatoriamente a **identidade do tiro principal**.
2. Escolher obrigatoriamente a **identidade do tiro especial** (o mesmo país é permitido).
3. Distribuir melhorias **P1–P4 e S1–S4 por país**, em ordem independente e sequencial.
4. Clicar em **⚙ BALANCEAMENTO** para alterar valores da proposta matemática.
5. Escolher arena (Arena Livre ou Onda 0–11) e **TESTAR COMBINAÇÃO**.
6. Durante a arena, clicar em **⚙ BALANCEAMENTO**: os números são reaplicados ao **próximo disparo/ativação** sem recompilar ou reiniciar a arena. Botão **VOLTAR AO LAB** retorna à configuração.

## Arquivo da proposta e perfis
- **Fonte versionada dos 40 upgrades, com campos, valores iniciais e limites:** `src/gameplay/labBalanceProfile.js`
- **Interpretador matemático experimental:** `src/gameplay/labMathRuntime.js`
- **Editor de parâmetros (browser):** `src/ui/labBalanceEditor.js`
- **Perfil editável e exportável:** botão **EXPORTAR JSON** gera `operacao-soberania-balanceamento.json`. Pode ser editado externamente e importado por **IMPORTAR JSON**.
- O último perfil é salvo no `localStorage` do navegador. Dados podem ser descartados pelo navegador em modo privado; exporte um JSON para guardá-los.
- **Restaurar padrão** desfaz os ajustes experimentais.
- Dados do Laboratório são isolados da **campanha normal**.

## Limitações importantes deste primeiro protótipo
Este é um **bancada de balanceamento**, não a implementação concluída das 40 novas mecânicas. O editor registra todos os números, mas vários efeitos visuais e combinações ainda não se manifestam no combate. Os efeitos conectados neste primeiro ciclo são:
- Brasil: aquecimento, multiplicador de dano/raio, varredura, rojões, área, dano, descarga com limite temporal, turbo e explosão final.
- EUA: tamanho físico, raio de explosão e dano do foguete; raio, duração, formação, força de repulsão e dano refletido do Grande Muro. **Onda de choque do P3 ainda não está conectada.**
- Rússia: dano direto, congelamento, velocidade dos tiros, estilhaçamento; raio, duração e multiplicador criogênico do Sputnik. **O bônus específico em módulos do P4 e reação em cadeia do S4 ainda não estão conectados.**
- China: quantidade inicial, geração única de divisão, fração de dano da cópia e intervalo entre salvas; **Feixe de Convergência experimental durante o teste**, com 1,5 s de reunião, 1,5 s de separação, fase central variável, pulso e danos configuráveis. O feixe converte os tiros em vez de disparar simultaneamente, acompanha a mira e termina no primeiro alvo.
- Coreia: periodicidade e dano dos pulsos laser; números, orçamento e intensidade dos reflexos. **Eco extra do P3 e limite por alvo de S4 ainda não estão conectados.**
- Efeitos híbridos avançados entre identidades diferentes ainda precisam de regras próprias e integração. Valores não conectados ficam no JSON para essa etapa futura.

O **nível 10 nacional** no Laboratório só existe quando as duas identidades são o mesmo país e os oito espaços P/S daquele país são completados. Ele libera transformação do principal e especial, além do Supremo; a representação final ainda precisa de arte e ajustes específicos.

## Testes
`tests/labMath901.test.js` valida os 40 upgrades, os limites, a exclusividade do nível 10 e a recomputação de atributos. A verificação de compilação e os testes do repositório ocorrem no CI.

## Próximas prioridades
1. Teste manual no navegador do novo fluxo obrigatório de identidades e dos campos numéricos editáveis durante a arena.
2. Conectar as habilidades ainda pendentes (marcadas acima), comparar DPS real e identificar limites contra Tipo 6.
3. Finalizar transformações visuais dos especiais e UX das escolhas de destino na campanha.
