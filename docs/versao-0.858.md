# Soberania v0.858 — hotfix dos efeitos sonoros russos

## Falha corrigida
- A v0.857 acessava `this.russianSputniks.length` no método de atualização de áudio antes de inicializar a lista, causando `TypeError` em qualquer campanha, inclusive sem Rússia.
- Inicialização explícita de `russianSputniks` em `GameScene.create()`, junto com as outras listas de entidades.
- O método `createRussianSputnik` também faz inicialização defensiva caso seja chamado em outro contexto.
- O loop de áudio agora usa comprimento opcional `(this.russianSputniks?.length??0)>0`, interpretando ausência como zero.
- Reiniciar a cena cria a lista vazia, impedindo reaproveitamento de Sputniks da rodada anterior.
- Nenhuma alteração em dano, física, duração do Sputnik ou configuração dos demais países.

## Testes
- Teste de regressão em `tests/russianRetroSfx.test.js` para inicialização, ausência e ativação com/sem Sputnik.
- A versão 0.858 substitui a 0.857 no GitHub Pages.
