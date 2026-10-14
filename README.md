# Soberania — jogo para a Soberana Game Jam

Protótipo do jogo de defesa antiaérea em pixel art ambientado no Rio de Janeiro. Inspirado por **Missile Command** e **Utopia Must Fall**.

> Estado: **protótipo 0.1** (implementação inicial da Onda 0). Ainda não inclui o sistema de cinco países, os 50 upgrades ou a Onda 11.

## Executar localmente

Requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
```

Abra a URL exibida pelo Vite. Para compilar o jogo para distribuição:

```bash
npm run build
```

Para o itch.io, compacte **o conteúdo da pasta `dist/`** (não a pasta em si) em um ZIP e marque a opção de jogo HTML5 no upload.

## Controles da primeira versão

- **Mouse:** mira.
- **Botão esquerdo pressionado:** dispara continuamente (2 tiros por segundo).
- **Botão direito:** bomba de pulso básica (recarga de 8 segundos).
- **R:** reinicia a demonstração.

## Protótipo atual

- Camadas do cenário noturno carioca.
- Canhão central desenhado provisoriamente com formas geométricas.
- Invasor alienígena Tipo 1 com quatro quadros de animação.
- Onda 0 tutorial de cerca de 10 segundos e quatro inimigos fáceis.
- Escudo provisório do canhão central, danos e regeneração.
- Fim de jogo quando o canhão central é destruído.

## Estrutura

```text
jogo-da-soberana/
├── index.html
├── package.json
├── public/
│   └── assets/
│       ├── cenario/              # camadas PNG do Rio
│       └── inimigos/tipo1/       # frames PNG da nave Tipo 1
└── src/
    ├── main.js                  # Phaser e configuração inicial
    └── scenes/GameScene.js      # demonstração da Onda 0
```

## Design e material visual

O [GDD está no Google Docs](https://docs.google.com/document/d/1pEUznP_ckv5UFM_jNl8M3KIh0l2A-ebswir4bkLb0lo/edit).

As imagens originais e a versão aprovada do inimigo Tipo 1 estão no Drive: **Jogo para a Soberana Jam**. Assets neste projeto foram redimensionados para o protótipo; mantenha os originais como fonte para futuros sprites.

## Próximas etapas

1. Ajustar cenário e escala dos sprites dentro do protótipo.
2. Refinar projéteis, colisões, escudos e condição de derrota.
3. Criar a tela de escolha de upgrades por país com bloqueio de terceira torre.
4. Implementar progressão por ondas, tipos 2–5 e batalhas contra chefes.
5. Integrar evolução dos animais, traição da Onda 11, efeitos e áudio.

## Publicação

Repositório sugerido: `jogo-da-soberana`. Crie inicialmente como **privado** no GitHub; depois podemos publicar quando estiver pronto.
