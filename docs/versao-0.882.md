# Operação Soberania v0.882 — decolagem real e diálogo digitado

## Correção do Tipo 6 repetido
- A Onda 10 transmitia v1Playtest para a Onda 11, mas o teste fullBrazilVoyageEligible o bloqueava. Agora builds com dez escolhas brasileiras entram na viagem espacial **inclusive** nesse caminho.
- A agenda padrão wave11 também retorna somente reforços Tipos 1–5 quando detecta dez escolhas brasileiras; nenhuma fortaleza Tipo 6 é agendada por engano.
- Traições continuam com o Tipo 6 nacional e suas regras de cronômetro.

## Transição espacial
- Abertura da primeira cidade e troca entre destinos usam a mesma animação startVoyageTransition.
- O corpo provisório do prédio e as imagens já existentes da base, cabeça e tubo do canhão são animados dentro de **um único Phaser.Container**; não teleportar o canhão sozinho.
- Duração: decolagem 900 ms, cruzeiro com estrelas móveis 4.000 ms, pouso 1.000 ms. 5,9 s de animação por trecho; o combate começa após o pouso.
- Estrelas em parallax com velocidades variadas, flamas, flutuação da nave, aproximação da cidade seguinte.
- HUD Cubo News oculto durante o voo e restaurado ao pousar; sem tiros ou ondas durante a viagem.
- O primeiro trecho é a decolagem após vencer o Tipo 6 da Onda 10. Trechos seguintes começam quando a cidade foi totalmente defendida.
- Para substituir arte provisória do corpo: textura voyage-building. Para cidades: chaves backgroundKey em src/gameplay/fullBrazilVoyage.js. As imagens definitivas ainda **não estão presentes** no repositório, portanto o corpo/cidade recebem fallback visual (o prédio isolado não foi encontrado entre os arquivos binários existentes).

## Comentários dos representantes
- Painel inferior esquerdo reduzido de 326×100 para 268×96 px, retrato menor, texto em largura de 194 px.
- Falas aparecem letra a letra com createDialogueTypewriter, o mesmo sistema da introdução, a cada 28 ms, com som de tecla discreto.
- Timers são cancelados no desaparecimento da fala e ao sair da cena. Interatividade do combate preservada.

## Verificação
- Adicionados testes de encaminhamento wave10 → wave11 em modo playtest, seleção de ondas, durações exatas, movimento de estrelas e digitação.
