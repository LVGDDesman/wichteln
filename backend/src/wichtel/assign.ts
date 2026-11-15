import { randomInt } from "node:crypto"

/** Fisher–Yates shuffle (non-mutating) using a CSPRNG. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Arranges all participants in one random circle: everybody gifts the next
 * person. Nobody draws themselves and nobody is left out.
 */
export function assignCircle<T extends { id: number }>(
  participants: readonly T[]
): { id: number; wichtelee: number }[] {
  if (participants.length < 2) {
    throw new Error("At least two participants are needed for a draw")
  }
  const circle = shuffle(participants)
  return circle.map((p, i) => ({
    id: p.id,
    wichtelee: circle[(i + 1) % circle.length].id,
  }))
}
