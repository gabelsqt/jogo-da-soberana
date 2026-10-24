# Operação Soberania v0.888 — restauração das trilhas no GitHub Pages

## Problema relatado
Após o escudo hexagonal v0.887, músicas deixaram de tocar. Investigação encontrou um risco objetivo: o GitHub Pages servia o **HTML único do itch.io (97,24 MB)**, com todos os MP3 transformados em **data URIs** gigantes. Esse formato impede o carregamento progressivo e pode falhar no elemento `Audio` do navegador sem gerar erro de compilação.

## Correção
- **GitHub Pages** passa a publicar o diretório padrão `dist/` (Vite), mantendo JS e MP3 em arquivos separados.
- A trilha usada pelo `MusicPlayer` é resolvida normalmente como `./assets/musicas/<arquivo>.mp3`, permitindo requests de áudio externos com leitura progressiva.
- O site também deixa de precisar baixar e processar o HTML de 97 MB antes de começar a partida.
- **itch.io** continua recebendo tanto o HTML único (para upload direto) quanto o ZIP multi-arquivos; nenhum formato foi removido.
- O pipeline da publicação roda `scripts/verify-pages-audio.mjs pages-site`, que bloqueia a publicação se faltar qualquer MP3, se estiver truncado, se faltar o JS ou se o index for o HTML único.
- Testes novos em `tests/pagesMusic888.test.js`: empacotamento correto, ausência de MP3, integridade e retomar reprodução após interação.

## Preservação
- Nenhuma mudança no escudo hexagonal, sons UOM ou seus efeitos.
- Nenhuma alteração de volume e mute salvos pelo jogador.
- Nenhuma mudança de tema por onda ou por traição.
- Caso músicas sigam mudas após atualizar, verificar no menu inicial se a opção MÚSICA não foi silenciada nem está em 0%. Também testar atualizar sem cache (Ctrl+F5).

## Limites de validação
A suíte de CI verifica os arquivos na publicação e o gerenciador de música com mocks. Não equivale a confirmar áudio audível em todos os navegadores; verificar manualmente no Firefox após publicar.
