/**
 * Bit-level helpers for the Kademlia lab.
 *
 * IDs are represented as fixed-width binary strings (e.g. 8 bits: "10110100").
 * This keeps the visual easy and aligned with the lecture notes.
 */

export const BITS = 8

export function parseId(raw: string): string | null {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return null
  // accept binary string of exact length
  if (/^[01]+$/.test(trimmed)) {
    if (trimmed.length > BITS) return null
    return trimmed.padStart(BITS, '0')
  }
  // accept decimal 0..255
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed)
    if (n < 0 || n > 2 ** BITS - 1) return null
    return n.toString(2).padStart(BITS, '0')
  }
  return null
}

export function xorBits(a: string, b: string): string {
  if (a.length !== b.length) throw new Error('id length mismatch')
  let out = ''
  for (let i = 0; i < a.length; i++) {
    out += a[i] === b[i] ? '0' : '1'
  }
  return out
}

export function xorDistance(a: string, b: string): number {
  return parseInt(xorBits(a, b), 2)
}

export function commonPrefixLength(a: string, b: string): number {
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  return i
}

/**
 * Greedy Kademlia-like routing path: among the candidate node IDs, repeatedly
 * pick the one with smallest XOR distance to target, stop when we reach the
 * target or no progress can be made.
 *
 * Returns the visited node IDs in order (excluding the start).
 */
export function lookupPath(
  start: string,
  target: string,
  pool: readonly string[],
): string[] {
  const visited = new Set<string>([start])
  const path: string[] = []
  let current = start
  let safety = 0
  while (current !== target && safety < pool.length + 1) {
    safety++
    const candidate = [...pool]
      .filter((p) => !visited.has(p))
      .sort((a, b) => xorDistance(a, target) - xorDistance(b, target))[0]
    if (!candidate) break
    if (xorDistance(candidate, target) >= xorDistance(current, target)) break
    visited.add(candidate)
    path.push(candidate)
    current = candidate
  }
  return path
}

export function randomIds(count: number, seed = 1): string[] {
  // Deterministic xorshift so the lab is reproducible.
  let s = seed | 0
  const next = () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 256)
  }
  const ids = new Set<string>()
  while (ids.size < count) {
    ids.add(next().toString(2).padStart(BITS, '0'))
  }
  return Array.from(ids)
}
