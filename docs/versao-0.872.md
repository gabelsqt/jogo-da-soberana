# Operação Soberania v0.872 — canhão principal mais rápido por padrão

- **Cadência-base global do canhão:** 400 ms → **300 ms** por disparo (2,5 → 3,33 tiros/s, aumento de 33,3%).
- Aplicada ao canhão **sem upgrades**, desde a onda 0, e também como referência inicial para **todos os upgrades nacionais** (Brasil, EUA, Rússia, China e Coreia) e para o laboratório antigo.
- O intervalo comum está definido em `BASE_CANNON_INTERVAL_MS` dentro de `src/gameplay/upgrades.js` e é reutilizado por `v1CombatStats`.
- Não adiciona bônus específico à onda 0, não altera spawn, velocidade dos inimigos, vida, dano-base ou tiros especiais.
- Multiplicadores próprios de cada país continuam funcionando. Transformações de ritmo próprio, como o laser contínuo coreano, mantêm sua configuração particular.
- Testes verificam explicitamente que campanha, upgrades e laboratório derivam do mesmo novo valor.
