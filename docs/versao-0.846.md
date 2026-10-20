# v0.846 — Sopro russo efetivo contra o Tipo 6; estilhaços equilibrados

## Redução do dano dos estilhaços
| Nível russo | Antes (v0.845) | Agora |
| --- | ---: | ---: |
| 1 — Geada Siberiana | 2 | 2 |
| 3 — Inverno Russo | 4 | 3 |
| 5 — Estilhaço Siberiano | 7 | 4 |
| 7 — Zero Absoluto | 12 | 5 |
| 10 — Inverno Eterno | 18 | 7 |

- Alcance, congelamento, aparência facetada dos cristais, tamanho e rotação permanecem iguais.
- Morte congelada pode desencadear estilhaçamentos secundários, limitados pelo princípio de uma morte/estilhaçamento por inimigo.
- Dano do tiro normal pré-transformação continua seguindo a v0.845.

## Sopro contínuo (Rússia nível 10)
- Cada ciclo de 110 ms inflige `4 + 0,45 × dano básico` a inimigos normais. **Existe dano mínimo próprio** mesmo quando o dano do tiro básico variar.
- Contra o Tipo 6, aplica adicional fixo de **24** por ciclo: `28 + 0,45 × dano básico`. Com a Rússia pura no nível 10, o dano é aproximadamente **33,62** por ciclo contra módulos/núcleo, versus **9,62** contra naves normais.
- A fumaça e as partículas não causam hits separados nem multiplicam dano visualmente.
- O Tipo 6 não congela. O cone detecta cada módulo vivo por seu retângulo específico, em vez de procurar apenas a posição central da fortaleza.
- **Barreira principal:** absorve somente uma aplicação de dano por ciclo e impede dano nos módulos. Depois que cai, o cone pode afetar vários módulos que estiverem realmente na área. O núcleo recebe dano somente após destruir os módulos e completar a animação de exposição.
- Mantidos alcance e abertura visual do cone, 530 px e 0,32 radianos por lado.

## Verificação
- Novos testes em `tests/iceBreathBossDamage.test.js` cobrem o dano base, detecção de módulos laterais e simulação da destruição do Tipo 6 nas ondas 10 e 11 dentro dos 30 segundos, com HP escalado pela build.
- Atualizados `tests/russianFrost.test.js`, `tests/russianDamageProgression.test.js` e `tests/iceBreath.test.js`.
- Testes específicos novos passaram no GitHub Actions; a suíte total ainda falha em testes anteriores não associados a essa mudança. A build completa e validação com Phaser no navegador continuam pendentes.
