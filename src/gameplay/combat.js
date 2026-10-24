// Regras matemáticas sem dependência do Phaser; fáceis de testar separadamente.
export const MIN_CANNON_ELEVATION_DEGREES = 2;

// No canvas, Y cresce para baixo. A direção válida fica entre -165° e -15°.
export function restrictedAimAngle(originX, originY, targetX, targetY) {
  const minElevation = MIN_CANNON_ELEVATION_DEGREES * Math.PI / 180;
  const dx = targetX - originX;
  const dy = Math.min(targetY - originY, -1);
  const desired = Math.atan2(dy, dx);
  return Math.max(-Math.PI + minElevation, Math.min(-minElevation, desired));
}

export function availableDefenseTargets(cannon, supportTowers = []) {
  const cannonTarget = {
    kind: 'cannon', id: 'cannon', x: cannon.x, y: cannon.y - 52,
  };
  const liveTowers = supportTowers
    .filter((tower) => tower && tower.health > 0)
    .map((tower) => ({
      kind: 'tower', id: tower.id,
      x: tower.x, y: tower.y - (tower.shieldRadius ?? 52),
      tower,
    }));
  return [cannonTarget, ...liveTowers];
}

// Curva de Bézier quadrática: voo começa no céu, faz uma aproximação lateral
// e termina exatamente no escudo da estrutura escolhida.
export function positionOnRoute(route, progress) {
  const t = Math.max(0, Math.min(1, progress));
  const u = 1 - t;
  return {
    x: u * u * route.x0 + 2 * u * t * route.x1 + t * t * route.x2,
    y: u * u * route.y0 + 2 * u * t * route.y1 + t * t * route.y2,
  };
}

export function routeLength(route) {
  let length = 0;
  let last = positionOnRoute(route, 0);
  for (let i = 1; i <= 12; i += 1) {
    const next = positionOnRoute(route, i / 12);
    length += Math.hypot(next.x - last.x, next.y - last.y);
    last = next;
  }
  return Math.max(length, 1);
}

export function applyShieldedHit(shield, health, amount) {
  const absorbed = Math.min(shield, amount);
  return {
    shield: Math.max(0, shield - absorbed),
    health: Math.max(0, health - (amount - absorbed)),
  };
}


// Recuo físico para o upgrade russo: o impacto adiciona velocidade contrária,
// e essa velocidade se dissipa ao longo de vários frames. Não altera a posição
// instantaneamente, evitando o efeito visual de teleporte para trás.
export function applyRecoilImpulse(currentRecoil, knockbackFactor, maxRecoil = 400) {
  const impulse = Math.max(0, knockbackFactor) * 2400;
  return Math.min(maxRecoil, Math.max(0, currentRecoil) + impulse);
}

export function advanceRouteWithRecoil(progress, speed, recoilSpeed, pathLength, deltaSeconds) {
  const dt = Math.max(0, deltaSeconds);
  const remainingRecoil = Math.max(0, recoilSpeed) * Math.exp(-6 * dt);
  const averageRecoil = (Math.max(0, recoilSpeed) + remainingRecoil) / 2;
  return {
    progress: Math.max(0, Math.min(1,
      progress + (speed - averageRecoil) * dt / Math.max(1, pathLength),
    )),
    recoilSpeed: remainingRecoil < 0.5 ? 0 : remainingRecoil,
  };
}
