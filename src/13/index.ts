const inputFile = Bun.file("src/13/input.txt")
const inputRaw = await inputFile.text()

const prizes = inputRaw.split("\n\n").map((section) =>
  section.split("\n").map((line) => {
    return line.match(/\d+/gm)?.map((value) => parseInt(value, 10)) as [number, number]
  })
)

const toSolutions = ([[ax, ay], [bx, by], [tx, ty]]: [number, number][]):
  | [number, number]
  | null => {
  const determinant = by * ax - bx * ay
  if (determinant === 0) return null

  const a = (ax * ty - ay * tx) / determinant
  const b = (tx - a * bx) / ax

  if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0) {
    return [b, a]
  }

  return null
}

const toCosts = (solution: null | [number, number]) => {
  if (solution === null) return 0
  return solution[0] * 3 + solution[1]
}

// * PART 1
console.time("elapsed")
const solutions1 = prizes.map(toSolutions)
const costs1 = solutions1.map(toCosts)

console.log(
  "Part 1: ",
  costs1.reduce((a, b) => a + b)
)
console.timeEnd("elapsed")

// * PART 2
console.time("elapsed")
const solutions2 = prizes
  .map(([a, b, t]) => [a, b, t.map((v) => v + 10000000000000)] as [number, number][])
  .map(toSolutions)
const costs2 = solutions2.map(toCosts)

console.log(
  "Part 2: ",
  costs2.reduce((a, b) => a + b)
)

console.timeEnd("elapsed")
