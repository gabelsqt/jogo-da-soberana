// Quarta escolha de cada país: acréscimos ao especial e ao escudo com uma única tecnologia.
// Mantém mira e detonação original, e não cria uma nova tecla.
export const FOURTH_UPGRADES = Object.freeze({
  br: { title: 'Embraer Arara-Azul', description: 'O especial convoca uma arara mecânica teleguiada para atacar outro invasor; reforça também o escudo elétrico.', tower: false },
  us: { title: 'Entrega de Democracia', description: 'O especial ganha uma onda explosiva adicional e mais ampla; escudos ganham proteção por fragmentação.', tower: false },
  jp: { title: 'Solo de Laser', description: 'O especial lança um feixe de energia no trajeto até a detonação marcada; escudos ganham reforço luminoso.', tower: false },
  ru: { title: 'Boneca Matrioska', description: 'A explosão especial se divide em três explosões secundárias menores; escudos ganham reforço cinético.', tower: false },
  cn: { title: 'SHEINvasão — Compre 1, Leve 3', description: 'O especial libera três minidrones perseguidores além da explosão; escudos ganham reforço com minidrones.', tower: false },
});

export function unlockedFourthUpgradeCountries(state = {}) {
  const counts = {};
  for (const country of (Array.isArray(state?.choices) ? state.choices : [])) {
    counts[country] = (counts[country] ?? 0) + 1;
  }
  return Object.keys(FOURTH_UPGRADES).filter(id => (counts[id] ?? 0) >= 4);
}
