# Game Soberana — versão 0.39

Data: 18/10/2026. Versão de pacote: 0.39.0.

## Mudanças reunidas nesta versão

- **Música:** 12 faixas para menu, configuração de testes, mesa de upgrades, ondas iniciais/intermediárias, chefe e traições. Volume e silêncio persistentes; pausa ao ocultar a aba. Mapeamento em `docs/musicas.md`.
- **Inimigo Tipo 4:** substituição da folha incompatível de 1448 × 1086 por 512 × 384, quadros de 128 × 128; direção esquerda e espelhamento da investida corrigidos.
- **Destruição do canhão:** sequência de 4,8 s com explosões concentradas no canhão, fumaça, estilhaços, perda gradual da mira e redução da música. Interferência visual e chiado sonoro crescem até a TV comprimir a imagem em linha, ponto e preto.
- **Derrota:** opções aparecem após a sequência. Onda 11 preserva resistência e epílogos; tempo esgotado continua com derrota direta.
- **Prévia:** botão TESTAR DESTRUIÇÃO DO CANHÃO e atalho D no menu de upgrades V1.
- **Versionamento:** tela inicial passa de 0.35 para 0.39; pacote e documentação sincronizados. Não foram inventadas notas intermediárias para 0.36–0.38.

## Validação e pendências

O usuário aprovou a correção do Tipo 4 e o efeito de desligamento. Depois, pediu mais chiado e explosões centrais, já implementados; esse refinamento ainda aguarda avaliação visual/sonora no navegador do jogador. Testes automatizados verificam fluxo de derrota, restauração de entrada, áudio, dimensões da folha e demais regras. Compilação Vite validada.

Músicas próprias de vitória/derrota e sons de explosão ainda não foram adicionados. Os efeitos de explosão atuais são geométricos; o chiado usa síntese de áudio.

## Como conferir

1. Atualizar a branch `feat/brasil2-arraial-balístico` com `git pull`.
2. Executar `npm run dev` e recarregar o navegador com Ctrl + F5.
3. Conferir **v0.39 • PROTÓTIPO** no rodapé do menu.
4. Abrir TESTAR UPGRADES V1 → TESTAR DESTRUIÇÃO DO CANHÃO.
