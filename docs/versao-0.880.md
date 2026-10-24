# Operação Soberania v0.880 — Sopro russo, Zeca e confronto final

## Canhão russo
- Do nível 1 ao 10, usar o loop existente de sopro congelante enquanto o botão esquerdo é mantido. O som de tiro criogênico pontual deixa de tocar.
- O áudio para ao soltar, pausar, morrer ou trocar de cena; o efeito visual de cone continua exclusivo da transformação nível 10.

## Zeca nas traições americanas e russas
- A flag zecaProposalOpened é reiniciada em GameScene.init quando Phaser reutiliza a cena, corrigindo a impossibilidade de voltar a falar com Zeca em partidas posteriores.
- Área clicável do retrato e da legenda ampliada; criado botão adicional ZECA • PEDIR AJUDA. Ambos levam à mesma proposta. Regras de revanche mantidas.

## Sucção dos módulos Tipo 6
- Módulos comuns partem de 94 px de alcance visual e laser de 118 px, com expansão de até 72% perto do ataque.
- A quantidade, o tamanho e a velocidade dos traços de energia crescem durante o carregamento (bomba 0,65 s; hangar 2 s; laser 10 s; barreira 6 s).
- Energia some ao destruir o módulo. Núcleo também intensifica a sucção durante os últimos cinco segundos.
- Efeito exclusivamente visual: hitboxes, dano e cronograma do Tipo 6 são preservados.

## Cronômetro e derrota
- Em wave10 e wave11, o relógio é limitado à duração e atualizado para 00:00 antes do feixe fatal.
- A superarma pode carregar nos últimos cinco segundos, mas só dispara no zero; nunca antecipa o laser.
- Vencer exige destruir o Tipo 6 (não basta resistir até 00:00). O disparo do núcleo no zero leva à derrota após a animação.
- Testes novos de relógio, derrota, áudio, Zeca e progressão da sucção.
