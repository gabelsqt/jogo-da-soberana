# Soberana v0.67 — reflexos curvos e luminosos no globo coreano

## Implementação
- Raios refletidos agora têm trajetória quadrática curva (arco elevado, com variações suaves entre raios).
- Camadas de brilho violeta, lilás e núcleo branco; flash na origem, pulso viajando ao longo da curva e impacto luminoso no alvo.
- Desenho adaptado à pixel art e animado por aproximadamente 200 ms, com desaparecimento automático.
- Renderização em uma única animação por salva; **até oito raios visuais por pulso**, preservando a limitação de desempenho anterior.
- **Não houve alteração de dano, quantidade de reflexos, escolha de alvos, duração do globo ou regras de colisão.**
- Testes adicionados/atualizados em `tests/discoReflectionVfx.test.js` e `tests/discoGlobe.test.js`.

## Validação necessária
Executar no clone:
```bash
git pull
npm test
npm run build
npm run dev
```
No Laboratório de Upgrades, testar Coreia nível 2/4/6/8 contra vários inimigos. Verificar se os arcos aparecem, atingem visualmente os alvos e mantêm a quantidade de dano. Rodar também com muitas balas simultâneas.

**Status:** mudanças enviadas ao GitHub, mas os testes e o build ainda não foram executados neste ambiente (acesso de rede a github.com indisponível para o container local).
