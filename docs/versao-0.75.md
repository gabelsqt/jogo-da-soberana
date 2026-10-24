# Game Soberana v0.75 — Retratos no diálogo do boteco

- A cena de upgrades agora mostra o retrato do representante ao lado das falas, quando o PNG correspondente estiver instalado.
- O painel usa as texturas `leader-<id>-full`, já carregadas pela cena a partir de `public/assets/lideres/<id>_retrato.png`.
- Zeca Carrara usa o retrato BR; o narrador CUBO NEWS e falas genéricas permanecem sem retrato.
- Sem imagem disponível, o diálogo usa layout centralizado, evitando espaços vazios.
- Mantidos os cinco retratos selecionáveis sobre as cadeiras, o foco e a confirmação existentes.
- **Pendência de arte:** os dez PNGs produzidos anteriormente ainda não estão versionados nesta branch. Para vê-los, é necessário copiar o pacote existente com `br/us/jp/ru/cn_retrato.png` e `br/us/jp/ru/cn_personagem.png` para `public/assets/lideres/` e publicá-los.
- Não houve mudança nas regras de combate nem nos upgrades.

## Validação pendente

Após instalar os PNGs: abrir a cena do boteco, conferir Zeca na fala, CUBO NEWS sem rosto, cinco cartões sobre as cadeiras e foco/aceitação. Executar `npm test` e `npm run build` localmente.
