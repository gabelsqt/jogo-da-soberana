# Operação Soberania v0.890 — formação cerimonial do escudo e novo UOM grave

## Formação do escudo (todas as ondas)
- Duração total passou de **780 ms para 1.600 ms**, sem modificar escudos, colisões, HP ou a rotina de defesa.
- **650 ms:** arco ciano desenhado da esquerda para a direita. A ponta móvel emite uma luz azul em quatro camadas (halo externo + núcleo), acompanhada de sete segmentos de rastro de intensidade decrescente. A extremidade é calculada ao longo do arco de forma contínua, sem salto entre pontos.
- **950 ms:** hexágonos e seus pontos centrais aparecem progressivamente da esquerda para a direita. Todos permanecem sujeitos à pulsação assíncrona de transparência já aprovada.
- A ponta se apaga ao concluir o arco. A cúpula conserva a transparência para revelar o canhão.

## Flash final e expansão suave
- O flash de conclusão continua sendo **um único** pulso branco.
- Sua duração foi de **340 para 840 ms**, somando meio segundo.
- Nesse intervalo, a cúpula aumenta gradualmente até **3,5%** de raio e retorna ao tamanho normal, com movimento suave; os hexágonos e a borda expandem juntos.
- O tamanho de colisão é invariável: o inchaço é **somente do desenho Phaser**, não altera dano, escudo ou tamanho do canhão.

## Novo UOM eletrônico grave
- Novo som sintetizado de **1,24 s**, com frequência principal descendente de aproximadamente **176 Hz a 55 Hz**, harmônicos de corpo e eco curto; mais grave que o anterior.
- Arquivo `public/assets/sons/35_escudo_hexagonal_uom_grave.wav`: WAV PCM mono, 16 bit, 16.000 Hz.
- `shieldReady` agora seleciona o novo arquivo; o áudio anterior é preservado para comparação.
- A reprodução dispara **uma vez por formação**, no início do flash branco, respeitando o volume de efeitos.
- Sem mudanças nas músicas.

## Verificação
- Testes de temporização, direção do arco, rastro azul, raio visual do domo, flash de 840 ms, arquivo PCM, único trigger do SFX e física não modificada.
- Compatibilidade com os testes do escudo das versões anteriores.
