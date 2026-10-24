# Operação Soberania v0.881 — Viagem espacial Full Brazil e falas em combate

## Decisão de gameplay
**Opção B aprovada:** cada cidade apresenta **uma batalha longa e contínua**, com grupos de reforços alienígenas chegando durante toda a defesa. Não dividir em 3–5 rodadas por parada.

## Ativação da rota
- Só na Onda 11 da campanha real, com dez escolhas brasileiras (full Brazil).
- Modos de laboratório, Wave Maker e playtest continuam com suas regras independentes.
- Nenhum Tipo 6 reaparece na rota espacial. O chefe alienígena da Onda 10 é o último Tipo 6 desta campanha.
- Combates contra traições estrangeiras permanecem iguais.

## Viagem entre cidades
- Quatro destinos **provisórios** numerados (sem atribuir cidades ou estátuas reais): configuração em src/gameplay/fullBrazilVoyage.js.
- Cada parada define id, city, statue, backgroundKey, accent e quantidade de eventos. Trocar os dados depois que o usuário fornecer a lista e as artes.
- Placeholder geométrico do prédio-foguete durante a decolagem e a viagem, com transição espacial curta.
- Placeholder escuro para as cidades; trocar por imagem associada a backgroundKey quando os sprites definitivos chegarem.
- Reforços Tipos 1–5 chegam continuamente, em intervalos de ~3–3,8 s. Pressão aumenta por cidade.
- Nenhum cronômetro de derrota ou vitória por sobrevivência: o marcador Cubo News informa o número de reforços ainda por lançar. A parada acaba **somente** após a chegada do último reforço, desaparecimento de todos os portais e destruição de todos os inimigos e projéteis remanescentes.
- Depois do último destino, conclusão normal Full Brazil e epílogo atualizado com viagem global.

## Zeca
- Removido o botão adicional «ZECA • PEDIR AJUDA».
- Permanecem retrato e legenda «ZECA?», mais hitbox ampliada e a correção da trava de propostas em partidas reutilizadas.

## Falas durante batalha
- Catálogo em src/gameplay/battleBanter.js, retratos existentes em public/assets/lideres.
- Painel compacto não-interativo na região inferior esquerda (x=168, y=421), sem bloquear mira/tiros.
- Apenas um personagem por vez, até 3,6 s, intervalo de 6,8 s.
- Gatilhos: início de batalha, alertas de perigo, especial recarregado, módulo destruído, chegada e vitória na cidade.
- Aliados habilitados conforme escolhas; país traidor não comenta como aliado. Zeca participa sempre, e exclusivamente na rota 100% brasileira.
- Falas breves provisórias, revisáveis depois.

## Integração / testes
- Suite fullBrazilVoyage881.test.js verifica roteamento, progressão contínua e ausência de Tipo 6.
- Suite battleBanter881.test.js verifica elegibilidade, cooldown, Zeca e assets.
- Regressão fixes880.test.js ajustada para o novo retrato sem botão.
- O número provisório de cidades poderá ser alterado livremente quando o usuário enviar seus destinos; nenhum destino definitivo foi escolhido.
