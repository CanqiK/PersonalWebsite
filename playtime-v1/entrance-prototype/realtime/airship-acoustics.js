const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const smooth = value => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

// World-space distance, rather than a timed audio loop, drives each passing ship.
export function airshipAcoustics(position, listener, right, routeProgress, active = true) {
  const x = position.x - listener.x;
  const y = position.y - listener.y;
  const z = position.z - listener.z;
  const distance = Math.max(1, Math.hypot(x, y, z));
  const proximity = 1 / (1 + (Math.max(0, distance - 12) / 16) ** 2);
  // Quiet at both route ends, so teleporting back to the start is inaudible.
  const envelope = smooth(routeProgress / .065) * smooth((1 - routeProgress) / .09);
  const radialVelocity = -1.8 * z / distance;
  return {
    distance,
    level: active ? proximity * envelope : 0,
    pan: clamp((x * right.x + y * right.y + z * right.z) / distance, -.92, .92),
    cutoff: 190 + 560 * proximity,
    doppler: clamp(343 / (343 + radialVelocity), .98, 1.02),
  };
}
