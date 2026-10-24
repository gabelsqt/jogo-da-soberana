// Progressão deliberada de população na campanha, da onda 3 à 9.
// Estas agendas são o que GameScene realmente usa, após a conversão
// de eventos em portais/grupos; não reutilizar os totais legados de waves.js.
// Número agendado exclui os reforços que um Tipo 5 pode invocar no combate.
export const CAMPAIGN_SCHEDULED_TOTALS = Object.freeze({
  0: 20, 1: 23, 2: 26, 3: 33, 4: 40,
  5: 47, 6: 53, 7: 59, 8: 65, 9: 71,
});

const BALANCED_CAMPAIGN_PACING = {
  "3": {
    "swarm": [
      [
        400,
        4
      ],
      [
        3800,
        4
      ],
      [
        7800,
        5
      ],
      [
        11000,
        5
      ]
    ],
    "tactical": [
      [
        2400,
        4
      ],
      [
        9000,
        5
      ]
    ],
    "special": [
      {
        "at": 3200,
        "type": 3,
        "warning": "BOMBARDEIRO SE APROXIMANDO!"
      },
      {
        "at": 6300,
        "type": 4,
        "pattern": "pincer",
        "warning": "ATAQUE CRUZADO!"
      },
      {
        "at": 8600,
        "type": 3
      },
      {
        "at": 11600,
        "type": 4,
        "side": "left"
      },
      {
        "at": 12800,
        "type": 3,
        "warning": "ÚLTIMO BOMBARDEIRO!"
      }
    ]
  },
  "4": {
    "swarm": [
      [
        450,
        4
      ],
      [
        3700,
        5
      ],
      [
        7100,
        6
      ],
      [
        10400,
        6
      ]
    ],
    "tactical": [
      [
        2200,
        5
      ],
      [
        8500,
        6
      ]
    ],
    "special": [
      {
        "at": 2900,
        "type": 3
      },
      {
        "at": 4800,
        "type": 4,
        "pattern": "pincer",
        "warning": "ATAQUE PELOS DOIS LADOS!"
      },
      {
        "at": 5500,
        "type": 3
      },
      {
        "at": 10000,
        "type": 3
      },
      {
        "at": 11300,
        "type": 4,
        "pattern": "pincer",
        "warning": "PINÇA FINAL!"
      },
      {
        "at": 12700,
        "type": 3
      }
    ]
  },
  "5": {
    "swarm": [
      [
        420,
        5
      ],
      [
        3200,
        6
      ],
      [
        7000,
        6
      ],
      [
        10200,
        7
      ]
    ],
    "tactical": [
      [
        2400,
        5
      ],
      [
        8250,
        5
      ]
    ],
    "special": [
      {
        "at": 4200,
        "type": 3
      },
      {
        "at": 5100,
        "type": 3,
        "pattern": "escort",
        "count": 2,
        "center": 350,
        "warning": "BOMBARDEIRO COM ESCOLTA!"
      },
      {
        "at": 6500,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 9100,
        "type": 3
      },
      {
        "at": 11200,
        "type": 3,
        "pattern": "escort",
        "count": 2,
        "center": 610
      },
      {
        "at": 11900,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 13000,
        "type": 3
      }
    ]
  },
  "6": {
    "swarm": [
      [
        500,
        5
      ],
      [
        3100,
        6
      ],
      [
        6900,
        7
      ],
      [
        9900,
        8
      ]
    ],
    "tactical": [
      [
        2100,
        7
      ],
      [
        8300,
        8
      ]
    ],
    "special": [
      {
        "at": 3500,
        "type": 4,
        "side": "left"
      },
      {
        "at": 4500,
        "type": 3,
        "pattern": "bomberFan",
        "count": 2,
        "warning": "CHUVA DE FERRO!"
      },
      {
        "at": 6100,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 7600,
        "type": 3
      },
      {
        "at": 10100,
        "type": 3,
        "pattern": "bomberFan",
        "count": 2
      },
      {
        "at": 11500,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 12500,
        "type": 4,
        "side": "right"
      },
      {
        "at": 13000,
        "type": 3
      }
    ]
  },
  "7": {
    "swarm": [
      [
        450,
        6
      ],
      [
        2900,
        7
      ],
      [
        6500,
        8
      ],
      [
        10100,
        8
      ]
    ],
    "tactical": [
      [
        2100,
        5
      ],
      [
        8300,
        5
      ]
    ],
    "special": [
      {
        "at": 3500,
        "type": 3
      },
      {
        "at": 4900,
        "type": 2,
        "pattern": "orbit",
        "count": 5,
        "warning": "PRIMEIRO CÍRCULO!"
      },
      {
        "at": 6100,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 7100,
        "type": 3
      },
      {
        "at": 8800,
        "type": 4,
        "side": "left"
      },
      {
        "at": 10700,
        "type": 3
      },
      {
        "at": 11700,
        "type": 2,
        "pattern": "orbit",
        "count": 5,
        "warning": "SEGUNDO CÍRCULO!"
      },
      {
        "at": 11900,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 12600,
        "type": 4,
        "side": "right"
      },
      {
        "at": 13100,
        "type": 3
      }
    ]
  },
  "8": {
    "swarm": [
      [
        350,
        6
      ],
      [
        2850,
        7
      ],
      [
        6200,
        9
      ],
      [
        10100,
        10
      ]
    ],
    "tactical": [
      [
        1800,
        7
      ],
      [
        8200,
        7
      ]
    ],
    "special": [
      {
        "at": 2600,
        "type": 3
      },
      {
        "at": 4300,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 5100,
        "type": 3
      },
      {
        "at": 6300,
        "type": 4,
        "side": "left"
      },
      {
        "at": 7100,
        "type": 5,
        "warning": "SUPERUNIDADE ALIENÍGENA!"
      },
      {
        "at": 8800,
        "type": 4,
        "side": "right"
      },
      {
        "at": 9500,
        "type": 3
      },
      {
        "at": 10900,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 12000,
        "type": 2,
        "pattern": "orbit",
        "count": 7
      },
      {
        "at": 12500,
        "type": 4,
        "side": "left"
      },
      {
        "at": 13200,
        "type": 3
      }
    ]
  },
  "9": {
    "swarm": [
      [
        340,
        7
      ],
      [
        2780,
        8
      ],
      [
        6150,
        9
      ],
      [
        9700,
        10
      ]
    ],
    "tactical": [
      [
        1600,
        8
      ],
      [
        7800,
        8
      ]
    ],
    "special": [
      {
        "at": 3100,
        "type": 4,
        "side": "left"
      },
      {
        "at": 4150,
        "type": 3,
        "pattern": "bomberFan",
        "count": 2,
        "warning": "CERCO FINAL: FOGO CRUZADO!"
      },
      {
        "at": 5400,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 6800,
        "type": 5,
        "warning": "ÚLTIMO CRUZADOR INIMIGO!"
      },
      {
        "at": 7100,
        "type": 3
      },
      {
        "at": 8500,
        "type": 4,
        "side": "right"
      },
      {
        "at": 10200,
        "type": 3
      },
      {
        "at": 11000,
        "type": 4,
        "pattern": "pincer"
      },
      {
        "at": 11900,
        "type": 2,
        "pattern": "orbit",
        "count": 8
      },
      {
        "at": 12500,
        "type": 4,
        "side": "left"
      },
      {
        "at": 13200,
        "type": 3,
        "warning": "ÚLTIMA MURALHA! NÃO RECUEM!"
      }
    ]
  }
};

export function getBalancedWaveEvents(wave) {
  const pacing = BALANCED_CAMPAIGN_PACING[wave];
  if (!pacing) return null;
  const level = wave - 1;
  const events = [
    ...pacing.swarm.map(([at, count], index) => ({
      at, type: 1, pattern: 'swarm', count,
      level: wave === 3 && index < 2 ? 1 : level,
    })),
    ...pacing.tactical.map(([at, count]) => ({
      at, type: 2, pattern: 'tactical', group: true, count, level,
    })),
    ...pacing.special.map(event => ({ level, ...event })),
  ];
  return events.sort((a, b) => a.at - b.at);
}
