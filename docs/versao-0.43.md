# Game Soberana — versão 0.43: Sopro Criogênico

## Identidade visual da Rússia
- O tiro principal russo passa a ser uma **rajada compacta de vapor congelante**, construída com um núcleo translúcido branco-azulado e uma cauda de cinco volutas que se dissipam. O canhão libera uma pequena nuvem fria na boca. Os flashes/rastros quentes laranja e vermelho foram removidos do estilo russo.
- A aparência usa uma Graphics reutilizada por tiro, redesenhada a cada quadro, sem gerar novas partículas no percurso. O limite de projéteis visuais já presente continua ativo.
- Os tiros mantêm velocidade, hitbox, dano e upgrades combináveis. Híbridos RU + JP preservam a tonalidade violeta do núcleo coreano e acrescentam névoa fria; RU + CN preservam a identidade chinesa em seus efeitos próprios.

## Geada contagiosa
- Congelar por impacto direto permite **uma propagação por ciclo** quando outros inimigos entram em alcance, ao acumular novos impactos ou na morte do alvo. Em morte, o raio aumenta 35%; com impactos repetidos, 18%.
- Uma propagação infecta até **quatro alvos ainda não congelados**, priorizando os mais próximos. O congelamento secundário dura 60% do principal e mantém a atração dos vórtices.
- O contágio só tem **uma geração**: alvos infectados não propagam até serem congelados diretamente por um disparo subsequente. Não causa dano adicional e não cria projéteis físicos.
- Raio da propagação: nível 1 e 2 48 px; níveis 3 e 4 66 px; níveis 5 e 6 84 px; níveis 7 a 9 104 px; nível 10 126 px.
- Tipo 6 é imune ao status (escudos/módulos mantêm o sistema próprio). A Matryoshka continua responsável por estilhaçamento em cadeia limitado, sem confundir contágio com dano.

## Especial
- A partir do nível 2 russo, `specialCooldown` recebe fator **0,75**. Ex.: 8.000 → 6.000 ms. Os demais bônus de cooldown (ex.: Coreia) combinam multiplicativamente. Dano, alcance e durações anteriores preservados.

## Controle de qualidade
- `tests/russianFrost.test.js` cobre limite de gerações, múltiplos alvos, duração, reinício da propagação, chefões, cooldown e visual híbrido.
- Status: implementar e validar com testes automatizados; a aparência da fumaça exige avaliação visual no navegador.
