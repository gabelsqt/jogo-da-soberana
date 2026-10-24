# Game Soberana — v0.54 (Wave Maker: Etapa 1)

## Implementado
- Nova cena `WaveMakerScene` acessada pelo Laboratório Soberana.
- Seleção lateral das ondas 0–11; cópias isoladas dos eventos da campanha.
- Marcadores arrastáveis em campo 960×540 e blocos na linha do tempo; edição numérica de tempo, posição, quantidade e nível por diálogo e mudança do tipo pelo painel.
- Criar, duplicar e excluir eventos/grupos; recuperar versão oficial da onda com confirmação.
- Rascunhos salvos localmente no navegador; preservação das propriedades avançadas importadas no modelo de dados.
- Testes unitários adicionados para o modelo.

## Limitações e próximos passos
- Editor é somente de rascunhos; ondas oficiais e `GameScene` não foram alteradas.
- Ainda sem simulação, reprodução da onda editada, histórico de 10 versões/versões nomeadas, JSON exportável, painel avançado completo ou relatório. Essas funções são etapas futuras aprovadas, não estão implementadas nesta versão.
- A interface exibe até 45 marcadores por onda de uma vez; demais eventos permanecem preservados no projeto.
- Testar via `git pull`, `npm test`, `npm run build` e `npm run dev`, pois build/testes e interação gráfica não foram executados remotamente nesta entrega.
