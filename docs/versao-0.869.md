# Operação Soberania v0.869 — diálogos digitados no boteco

- Falas do **Zeca, das introduções pós-onda e das propostas dos cinco representantes** surgem letra por letra, com a mesma velocidade de `INTRO_CHAR_DELAY_MS` e com o mesmo áudio `introKey` da abertura, incluindo variação de pitch e teto de três vozes.
- **Clique, Enter ou Espaço** completam a frase atual na caixa de diálogo antes de avançar para a seguinte; próximo comando avança normalmente. Dica visual acompanha o estado.
- Ao escolher um representante, a **história/proposta** é digitada; selecionar outro representante interrompe o timer anterior. Clicar no painel ou na área escurecida completa a proposta, sem aceitar upgrade.
- Ao **confirmar upgrade**, a fala de aceitação também é digitada (22 ms por caractere); o próximo combate só começa depois que a fala terminar e permanecer visível por mais 850 ms.
- A rotina compartilhada `createDialogueTypewriter` previne sons/timers pendentes ao trocar de personagem, fechar diálogo ou sair da cena. Não modifica armas, opções, custos ou escolhas de upgrades.
- Testes de avanço, digitação, sons por caractere visível, cancelamento de timers e integração ao boteco adicionados.
