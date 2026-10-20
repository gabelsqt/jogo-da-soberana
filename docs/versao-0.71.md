# Soberana v0.71 — Menu inicial mais limpo

## O que mudou
- Removida **somente na tela inicial** a identidade visual da Cubo News: cabeçalho, faixa inferior, painel central opaco e camada escura de tela inteira. O noticiário segue intacto durante o jogo.
- O **cenário pixel art do Rio de Janeiro** ocupa toda a tela sem essas molduras.
- O menu exibe apenas o título **Soberana**, o subtítulo **O RIO NÃO VAI CAIR** e os botões **COMEÇAR CAMPANHA** e **TESTAR UPGRADES**. Informações secundárias, legendas de comandos e a contagem de upgrades foram removidas da tela, mas continuam disponíveis no jogo/laboratório quando pertinentes.
- A versão permanece no canto inferior direito, sem tarja Cubo News.
- O antigo controle musical com botões ± no centro do menu foi substituído por **♫ MÚSICA** discreto no canto inferior esquerdo. Ele abre, sob demanda, um painel com **slider de volume clicável/arrastável** e botão de **silenciar/ligar**. Salva o volume/mudo nas preferências existentes. O menu de pausa conserva seus controles anteriores.
- Atalhos **ENTER** (campanha) e **U** (laboratório) continuam funcionando.

## Arquivos
- `src/scenes/MenuScene.js` — layout minimalista com o Rio em destaque.
- `src/audio/music.js` — `addMenuMusicControl` para o popup recolhível.
- `tests/menuClean071.test.js` — regressões de menu e controles musicais.
- `docs/GDD.md` e `docs/CHECKLIST-TESTES.md` — documentação e pendências.

## Como conferir
```bash
git pull
npm test
npm run build
npm run dev
```
Abrir a página inicial, comparar a visibilidade da pixel art, iniciar a campanha, visitar o laboratório, abrir/fechar MÚSICA e testar slider e mudo.

**Validação até agora:** verificação de sintaxe de `MenuScene.js` e `music.js` passou. A operação do slider/mudo foi exercitada com uma cena simulada (abrir → volume 100% → arrastar para 0% → silenciar → fechar), sem erros. **Ainda não foram executados o build, a suíte completa nem um playtest visual em navegador real**.
