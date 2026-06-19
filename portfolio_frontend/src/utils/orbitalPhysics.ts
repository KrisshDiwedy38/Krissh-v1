export interface OrbitParams {
  a: number; // semi-major axis
  e: number; // eccentricity
  period: number; // orbital period in seconds
  initialM?: number; // initial mean anomaly
}

export interface OrbitPosition {
  x: number;
  y: number;
}

export function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 5; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
}

export function getOrbitalPosition(timeMs: number, params: OrbitParams): OrbitPosition {
  const { a, e, period, initialM = 0 } = params;
  
  // Mean motion
  const n = (2 * Math.PI) / period;
  
  // Mean anomaly, normalized
  let M = initialM + n * (timeMs / 1000);
  M = M % (2 * Math.PI);
  
  // Solve for Eccentric Anomaly
  const E = solveKepler(M, e);
  
  // Focus distance from center
  const c = a * e;
  
  // Semi-minor axis
  const b = a * Math.sqrt(1 - e * e);
  
  // Calculate X and Y relative to focus
  // We place the focus at (0,0), so we shift X by -c.
  const x = a * Math.cos(E) - c;
  const y = b * Math.sin(E);
  
  return { x, y };
}

export function getOrbitPathParams(params: OrbitParams) {
  const { a, e } = params;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e;
  return { a, b, c };
}
