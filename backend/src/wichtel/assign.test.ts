import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { assignCircle, shuffle } from "./assign.ts"

const people = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }))

describe("shuffle", () => {
  it("keeps all elements and does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    assert.deepEqual(input, [1, 2, 3, 4, 5])
    assert.deepEqual([...result].sort(), input)
  })
})

describe("assignCircle", () => {
  it("rejects fewer than two participants", () => {
    assert.throws(() => assignCircle([]))
    assert.throws(() => assignCircle(people(1)))
  })

  for (const n of [2, 3, 7, 50]) {
    it(`forms a single circle without self-assignment (n=${n})`, () => {
      for (let run = 0; run < 100; run++) {
        const result = assignCircle(people(n))
        const next = new Map(result.map((a) => [a.id, a.wichtelee]))

        assert.equal(result.length, n)
        assert.equal(new Set(next.values()).size, n, "everyone is gifted exactly once")
        for (const [giver, receiver] of next) assert.notEqual(giver, receiver)

        // following the chain from any start must visit everybody
        const seen = new Set<number>()
        let current = 1
        while (!seen.has(current)) {
          seen.add(current)
          current = next.get(current)!
        }
        assert.equal(seen.size, n)
      }
    })
  }
})
