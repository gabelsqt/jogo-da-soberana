# Soberana v0.68 — correção de resíduos da cutscene da onda 11

## Problema
Após revelar a traição (reproduzido em captura da Coreia), selecionar **RESISTIR À TRAIÇÃO** removia apenas os fundos e textos principais dos botões, deixando as barras vermelhas, sombras e partes da moldura Cubo News por cima do combate.

## Correção
- `destroyMenuButton` remove **fundo, rótulo, barra lateral e sombra** do botão.
- `addCuboBroadcastFrame` passa a retornar todos os GameObjects da moldura, permitindo destruir os elementos temporários sem afetar a interface permanente do jogo.
- A cutscene da onda 11 usa os dois helpers e limpa integralmente a tela tanto em **RESISTIR** quanto em **ACEITAR SUBMISSÃO**.
- A cutscene da onda 10 também remove os elementos decorativos do botão de continuar.
- Teste de regressão `tests/finalePreludeCleanup.test.js` preparado com simulação das duas escolhas e rota Full Brazil.

## Como validar
No clone da branch:
```bash
git pull
npm test
npm run build
npm run dev
```
Acessar a onda 11 com Coreia traidora, escolher resistir e verificar que nenhuma barra vermelha, sombra ou tarja temporária continua na tela. Repetir escolhendo submissão e com rota Full Brazil.

**Status:** alterações enviadas ao GitHub; execução local dos testes/build e inspeção no navegador ainda pendentes neste ambiente.
