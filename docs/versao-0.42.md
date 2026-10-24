# Soberana — notas da versão 0.42

## Chefões Tipo 6 (primeira implementação)

- Encontros das **Ondas 10 e 11** utilizam Tipo 6, substituindo o Tipo 5 provisório nesses eventos.
- Uma nave gigantesca atravessa horizontalmente o céu; desacelera e inverte o sentido nas bordas.
- Quatro módulos espelhados com escudos independentes, HP individual, hitboxes não sobrepostas, estados visuais de dano e funções específicas por variante.
- Módulos podem cair em qualquer ordem; escudos quebrados não se regeneram. A blindagem externa é invulnerável e gera ricochetes cosméticos. Os módulos destruídos continuam no casco como carcaças.
- O núcleo central fica exposto somente depois que os quatro módulos forem destruídos. Apenas o núcleo mostra uma barra de vida.
- Ataques coordenados e avisados, contrajogo através da destruição dos módulos responsáveis, invocações limitadas e pausas/reconfiguração após perder módulos.
- Ao destruir um módulo, seus projéteis restantes explodem em cadeia. Morte do núcleo produz onda de choque, limpa inimigos e balas e encerra o encontro com explosões em fases.
- **Últimos cinco segundos:** o chefão interrompe os disparos e absorve os projéteis inimigos existentes. Quando resta um segundo, se o núcleo ainda não caiu, um raio terminal destrói a defesa.
- O Supremo já existente, se ativado no momento de carga, causa vitória imediata. Detalhes dessa exceção continuam em aberto na direção de jogo.
- Um único traidor estrangeiro **sorteado entre os países escolhidos** substitui coalizões. O resultado se mantém entre tentativas da mesma batalha e alimenta os finais.
- Artes geradas por **Phaser Graphics** são placeholders, não sprites finais. Funções de módulo / estatísticas iniciais provisórias para playtest.
- Atalhos DEV: `Shift+0` abre Onda 10 e `Shift+1` abre Onda 11 durante uma onda.

## Escopo e pendências

Esta implementação não substitui os sprites definitivos, efeitos de áudio exclusivos dos chefões nem o balanceamento final. A regra de dano excedente ao romper escudos usa uma solução provisória: um disparo que quebra o escudo não transfere dano restante para o módulo. Os valores de HP, resistência e cadência são ajustáveis após playtest.

## Qualidade

Testes puros adicionados para módulos, escudos, geometria, núcleo e cruzeiro, e atualizados para um traidor sorteado. As verificações de sintaxe e testes puros foram executadas isoladamente; validar também `npm test`, `npm run build` e o combate interativo no ambiente Phaser antes de considerar a entrega definitiva.
