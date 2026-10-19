# Soberana v0.55 — Retratos dos cinco líderes

## Implementação
- Integração da arte na cena de seleção do boteco (`src/scenes/UpgradeScene.js`): imagens dos cinco líderes no lugar das silhuetas provisórias quando os PNGs correspondentes estiverem disponíveis.
- Os cinco nomes oficiais são mostrados na seleção ampliada: Zeca Carrara, Victor McDollar, Kim Lin Doo, Tatiana Tanquova e Mei Taxaram.
- Permanece intacto o fluxo existente de escolha de upgrade, cliques, foco e retorno.
- `preload` prevê duas variantes por país, `assets/lideres/{br,us,jp,ru,cn}_{retrato,personagem}.png`.
- Fallback de silhueta existente mantido se a imagem não carregar.

## Entrega dos assets / limitação
- Dez imagens em PNG preparadas em 384×384: 5 retratos com cenário e 5 personagens com transparência.
- **Os PNGs ainda não foram enviados para o GitHub**. O pacote `soberana_retratos_v055.zip` entregue nesta conversa deve ser descompactado **na raiz do repositório** para povoar `public/assets/lideres/` antes do teste. Fazer commit desses binários a partir do computador, se desejar versioná-los no GitHub.
- Os arquivos são derivados de ilustrações maiores geradas no chat; não foi modificada a lógica de combate.

## Teste manual
1. Extrair ZIP na raiz, confirmando os 10 arquivos em `public/assets/lideres/`.
2. `git pull`, `npm test`, `npm run build`, `npm run dev`.
3. Iniciar uma campanha, terminar a primeira onda e abrir o boteco; conferir os cinco retratos, foco/zoom e confirmação de upgrade.
4. Verificar se cada imagem carrega sem erro 404 e se o arquivo `_personagem` possui canal alfa.

**Não houve execução remota de build ou playtest de navegador nesta entrega.**
