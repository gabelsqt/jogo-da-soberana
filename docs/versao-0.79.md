# v0.79 — Efeitos sonoros sintetizados

Criado `src/audio/sfx.js` com um registro para os dez WAVs, volume independente da música, carregamento sob demanda e limitação de repetição para evitar som excessivo.

### Eventos atualmente conectados
- Canhão principal (volume reduzido e throttle 95 ms)
- Explosão especial (throttle 130 ms)
- Escudo estilhaçando (throttle 450 ms)
- Abertura do protocolo Supremo
- Aceite de upgrade no boteco

### Arquivos ainda a instalar
Extraia `soberania_efeitos_sonoros_v1.zip` em `public/assets/sons/`. Os dez nomes originais devem ser mantidos (01 a 10). Os demais efeitos do pacote estão registrados mas ainda não vinculados a todos os respectivos eventos.

### Validação
Testar no navegador após publicar os WAVs. Checar que tiros frequentes não saturam, música continua independente e o jogo não quebra quando áudio está bloqueado pelo navegador. Testes automatizados não foram executados.
