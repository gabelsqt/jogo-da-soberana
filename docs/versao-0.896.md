# Operação Soberania v0.896 — Escudos com impacto, laser de cruzador e caça persistente

## Escudos
- Os escudos dos quatro módulos do Tipo 6 e a barreira frontal fazem duas
  ondas sucessivas ao absorver impactos e piscam por cerca de 65 ms, sem
  piscar o casco inteiro. A barreira mantém sua silhueta em arco invertido.
- O Tipo 5 recebe proteção própria (12 HP no nível 1, +2 por nível até 30).
  Atingir a proteção gera ondulação e flash curto, além dos SFX de escudo.
  Quando a proteção quebra, há um efeito de fragmentação; a vida do cruzador
  passa a ser atingida nos tiros seguintes. Golpes letais de Supremo não são
  impedidos pela proteção.
- A colisão do Tipo 5 foi ampliada para refletir o halo visível, e não
  apenas a hitbox circular anterior menor que a nave.

## Laser do Tipo 5
- Sai a salva padrão de projéteis do cruzador.
- Ao entrar, o Tipo 5 marca um alvo e carrega por exatamente **5 s**.
- Durante a carga, fica visível um risco tênue de mira com núcleo luminoso
  progressivo. Um alerta avisa antes de disparar.
- Em seguida, dispara um laser vermelho espesso por **0,72 s**, com
  **68 pontos de dano** aplicados uma única vez ao início do feixe.
- Após **2,2 s** de recuperação, começa nova carga de cinco segundos,
  escolhendo outro alvo.
- A geração limitada de unidades de escolta continua inalterada.
- Congelamento interrompe normalmente o avanço das fases.

## Caça Tipo 4
- O ataque com laser de 40 HP continua com telegrafia, mas o caça **não é
  removido** após disparar; voa para uma posição de recuperação, inverte
  o sentido, recomeça o circuito e repete até que sua vida chegue a zero.
- A remoção e morte visual continuam exclusivas aos acertos letais.
- A morte ganhou flash de silhueta, estilhaços de spritesheet ampliados e
  três explosões sequenciais mais legíveis.
- Arquivo `public/assets/sons/34_tipo4_whoosh_retro.wav` contém som PCM
  mono de 22,05 kHz, com timbre granulado e descenso de frequência inspirado
  em 16-bit. É disparado ao cruzar a arena (não a cada frame) com variação
  discreta de pitch e throttle contra múltiplos caças simultâneos.

## Testes
- `tests/type45ShieldLaser896.test.js` cobre HP e absorção dos escudos,
  tempos do laser, persistência do Tipo 4, efeito de barreira do Tipo 6,
  arquivo de som e disparo do SFX.
- Sem alteração nas quantidades de spawns v0.894, nem nos upgrades v0.895.
