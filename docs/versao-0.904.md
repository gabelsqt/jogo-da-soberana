# Operação Soberania — v0.904 — Prólogo canônico e Zé Maria

## Alterações implementadas

- **Introdução:** mantém convocação eleitoral, plantões Cubo News e promoção para General de Guerra, revelando a cláusula depois. O mecânico **não aparece** antes de o General solicitar ajuda.
- **Onda 0:** mesma arma física/canhão já existente; potência temporária de prólogo (dano 12 por bala, intervalo mínimo de 65 ms, projéteis mais rápidos), inimigos comuns fáceis e defesa protegida contra derrota acidental nesta sequência.
- **Cinemática do Tipo 6:** o mesmo spritesheet do casco alienígena usado no confronto posterior aparece no fim da onda. A sobrecarga provocada pelo raio deixa o Obuseiro **gravemente danificado**, sem destruí-lo por completo.
- **Onda 0.5 — O Céu Tomado:** cena jogável e roteirizada de **15 segundos**, com 84 invasores Tipo 1 previstos, descida lenta em massa e nenhuma ofensiva hostil. O canhão visual reaproveita a base/cabeça/tubo existentes, tem tiro básico lento (1.200 ms entre balas), fraco e só pode abater até seis naves, sem haver condição de vitória por limpar o céu. Ao amanhecer os invasores se retiram simultaneamente para portais; não há punição por sobrevivência.
- **Chegada de Zé Maria:** o General telefona para seu antigo mecânico depois da retirada; chegada por caminhão-guincho azul antigo, apresentação e frase autoral aprovada: “Se eu fiz um Marea andar, faço isso aqui funcionar.”
- **Reconstrução:** apresenta *três etapas sucessivas*: diagnóstico ouvindo e batendo levemente no mecanismo, instalação da arma escolhida e teste do primeiro tiro. A terceira etapa ocorre **após** a primeira negociação, pois a identidade do tiro principal precisa ser escolhida antes da instalação.
- **Boteco:** a cena e arte diurna existente permanecem. Uma transição curta mostra o elevador de carga que liga o Obuseiro ao Boteco, sem redesenhar a área como bunker. Primeira identidade é negociada no Boteco e instalada antes da onda 1.
- **Segundo conserto:** a segunda escolha de país no Boteco instala e testa o especial antes da onda 2. Depois da onda 2 a progressão P1–P4 / S1–S4 permanece normal, com dez escolhas no total.
- **Seu Anselmo:** dono do Boteco, amigo de Zé Maria e ex-militar aposentado, aparece nos diálogos de transição. Nas últimas negociações deixa pistas de que já viu invasões no Rio nos anos 1980, sem tomar o protagonismo.
- **Representante brasileiro:** textos e biografia passam a dizer Zé Maria, mecânico da oficina, não Zeca Carrara nem soldado convocado.

## Novos arquivos

- `src/gameplay/prologueStory.js`: regras temporais e batidas narrativas.
- `src/scenes/PrologueSurvivalScene.js`: combate roteirizado da onda 0.5.
- `src/scenes/PrologueRepairScene.js`: ligação, caminhão-guincho e reconstrução sequencial.
- `src/scenes/BotecoElevatorScene.js`: transição entre o Obuseiro e a mesa.
- `tests/canonicalPrologue904.test.js`: regras de cronologia, transição, upgrade, tempos e personagens.

## Limitações e pendências

- As ilustrações procedurais em blocos/pixels da oficina, do caminhão e do elevador são **provisórias**: falta substituir por ilustrações e sprite de Zé Maria de acordo com o design fixado no GDD, inclusive retrato brasileiro ainda herdado do antigo asset.
- O casco do Tipo 6 é reutilizado na cinemática; sua entrada **não inicia uma luta de chefe** na onda 0, porque é um evento narrativo obrigatório.
- A nova onda 0.5 possui seu próprio microcombate roteirizado para garantir os 15 segundos e ausência de danos; não usa o sistema regular de padrões de ataque.
- A trilha própria do prólogo e as ilustrações finais ainda não foram fornecidas/definidas.
- Renomear identificadores internos do sistema antigo de revanche Zeca pode quebrar saves; estes identificadores permanecem internamente por compatibilidade, mas a revisão dos textos legíveis ao jogador está em andamento.
- **Não muda** o número de dez escolhas, nem alonga as ondas 1–11, nem libera Supremos antes do nível 10.
