# Operação Soberania v0.870 — pacote ZIP para itch.io

**Correção de distribuição; nenhuma alteração no gameplay.**

## Diagnóstico
Na v0.869, `npm run build:itch` produzia `itch-build/index.html` com **97,13 MB**, reunindo ~112 recursos em base64. Embora um HTML único seja permitido, o tamanho pode tornar a carga lenta ou instável num iframe do itch.io. Esta é uma suspeita técnica, não diagnóstico conclusivo do erro da página de publicação sem ver o link e o console do navegador.

## Nova exportação
`npm run build:itch` agora gera **dois formatos**:
- `itch-build/index.html`: HTML único legado (preservado para o playtest do GitHub Pages).
- **`itch-build/operacao-soberania-itch.zip`: recomendado para itch.io.** Contém `index.html` na raiz mais o JS, as imagens, músicas e sons relativos de `dist/`, sem empacotar tudo em base64.

O ZIP é gerado por `scripts/build-itch-zip.mjs`, sem dependências extras, usando Deflate/Store, CRC-32 e validações de limites de quantidade, caminhos, tamanho descompactado e arquivos exigidos. Os workflows verificam o ZIP e publicam um artifact `operacao-soberania-itch`.

## Como publicar
1. Baixe o artifact `operacao-soberania-itch` de uma execução bem-sucedida no GitHub Actions e **extraia apenas o ZIP externo do GitHub**, mantendo o arquivo interno `operacao-soberania-itch.zip` intacto.
2. No itch.io, em **Kind of game** escolha **HTML Game**. Envie `operacao-soberania-itch.zip` e marque que o arquivo será **played in browser**.
3. Confirme que o `index.html` está na raiz do ZIP e ajuste a tela para proporção 16:9, idealmente 960×540 (ou modo de tela cheia). Salve e teste em aba anônima.
4. Se continuar em branco, informe o link do itch e a mensagem do Console (F12) para diagnóstico específico.

**Não confundir com a futura revisão do Quatro de Julho (EUA):** suas decisões estão registradas separadamente em `docs/EUA-QUATRO-DE-JULHO-APROVADO.md`, ainda sem mudanças de combate.
