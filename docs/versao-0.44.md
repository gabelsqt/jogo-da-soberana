# Versão 0.44 — Fortaleza de Cerco e Cubo News (19/10/2026)

Branch: `feat/brasil2-arraial-balístico`. Escopo: integrar decisões aprovadas no planejamento e preparar primeiro playtest, sem fazer merge em `main`.

## Entregas desta versão
- Motor puro do Tipo 6 atualizado para quatro módulos fixos: Bombardeio (esquerda exterior), Laser de Cerco (esquerda interior), Hangar Tipo 3 (direita interior), Gerador de Escudos (direita exterior), vida estrutural igual entre módulos.
- Escudos individuais destrutíveis, mais grande barreira frontal unidirecional (30% do HP de módulo). Carga inicial de 4 segundos e reconstrução por turno de 6 segundos, escudo novo a 100%; destruir o gerador impede reconstrução.
- Turnos alternados na ordem Hangar → Bomba → Laser → Gerador. Pausa de 1 segundo; gerador pula o turno se escudo intacto.
- Uma bomba pesada por turno (25% HP módulo), queda de 7 segundos e detonação de projéteis próximos quando interceptada. Laser com 10 segundos de preparação, 25% de HP estrutural para interromper e feixe contínuo de 3 segundos; hangar lança três Tipo 3 simultâneos (máximo seis).
- China: dez Tipo 3 por enxame, até trinta ativos, saindo em leque. Rússia: bomba criogênica rompe escudo do canhão e cria prisão de gelo por 2 segundos. EUA: míssil colossal direto, fatal sem proteção. Coreia: laser prismático e escudo roxo.
- Núcleo vermelho aparece após os quatro módulos, com abertura mecânica de 2 segundos, HP equivalente ao de um módulo. Sem novos ataques do núcleo; ameaças já lançadas permanecem. Vitória imediata ao destruí-lo e sequência de explosões de 6 segundos.
- Superarma carrega nos últimos 5 segundos; ataque terminal ao fim do prazo, somente destruição do núcleo a interrompe.
- Cronômetro grande no canto inferior direito para todas as ondas; lower third da Cubo News, manchete e subtítulo, sirene e alerta vermelho nos últimos 5 segundos.
- Motor de manchetes com fila máxima de três notícias, atualização de 5 segundos, rodízio sem repetição, propaganda progressiva por upgrades e revisão da linha editorial aprovada.
- Atualização do GDD de Tipo 6 e registro das decisões de redação no GDD geral. Novos testes puros de regras e notícias.

## Notas de produção e limites
- Silhuetas e efeitos são provisórios/procedurais. Entradas e destruições específicas por país precisam de arte e cinematografia final.
- O lote de manchetes 142-C (CBF, mais engraçado) e 146-C (emissora explicitamente 100% patriota) ainda não tem redação final aprovada e não deve ser tomado como concluído.
- Rodar playtest real do balanço de 60 s, inclusive com 30 invasores chineses, escudos e interferência de notícias no campo de jogo.
- Os testes automáticos validam regras e compilação, mas **não substituem teste visual em navegador**.

## Como testar
A branch publica o playtest pelo workflow GitHub Pages (se as permissões de Pages estiverem configuradas). Para testar localmente: `npm install && npm test && npm run dev`; para gerar HTML único: `npm run build:itch`.

## Testes
Em 19/10/2026, GitHub Actions executou **272 testes com 272 aprovações**, além de build Vite e geração de HTML único para itch.io. Commit anterior à configuração atualizada de publicação Pages.
