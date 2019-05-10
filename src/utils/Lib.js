
export function normalize (point, scale) {
  const normalized = {
    x: 0,
    y: 0
  }
  const norm = Math.sqrt(point.x * point.x + point.y * point.y)
  if (norm !== 0) {
    normalized.x = scale * point.x / norm
    normalized.y = scale * point.y / norm
  }
  return normalized
}
