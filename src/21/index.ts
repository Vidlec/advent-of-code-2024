const inputFile = Bun.file("src/21/input.txt")
const inputRaw = await inputFile.text()
const codes = inputRaw.split("\n")

console.time("elapsed")

type Coord = [number, number]
type Direction = "^" | "v" | ">" | "<"

const numGrid = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
]
const dirGrid = [
  [" ", "^", "A"],
  ["<", "v", ">"],
]

const numToCoord: Record<string, Coord> = {
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "0": [3, 1],
  A: [3, 2],
}
const dirToCoord: Record<string, Coord> = {
  "^": [0, 1],
  A: [0, 2],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
}

const directions: { [key in Direction]: [number, number] } = {
  "^": [-1, 0],
  v: [1, 0],
  ">": [0, 1],
  "<": [0, -1],
}

const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>()
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

const isValidPath = (grid: string[][], y: number, x: number, path: string) => {
  let ny = y
  let nx = x

  for (const step of path) {
    const [dy, dx] = directions[step as Direction]
    ny = ny + dy
    nx = nx + dx
    const cell = grid[ny]?.[nx]
    if (!cell || cell === " ") return false
  }
  return true
}

const getMoves = memoize((isNumeric: boolean, start: Coord, end: Coord): string[] => {
  const grid = isNumeric ? numGrid : dirGrid
  const [sy, sx] = start
  const [ey, ex] = end

  const rowDir = ey > sy ? "v".repeat(ey - sy) : "^".repeat(sy - ey)
  const colDir = ex > sx ? ">".repeat(ex - sx) : "<".repeat(sx - ex)

  const first = rowDir + colDir
  const second = colDir + rowDir
  const results: string[] = []
  if (isValidPath(grid, sy, sx, first)) results.push(first)
  if (isValidPath(grid, sy, sx, second)) results.push(second)
  if (!results.length) throw new Error(`No valid path from ${start} to ${end}`)
  return results
})

const solve = memoize((sequence: string, keyboards: number, index: number): number => {
  if (index === keyboards + 1) return sequence.length
  const coords = index > 0 ? dirToCoord : numToCoord

  let start = coords["A"]
  let total = 0

  for (const char of sequence) {
    const end = coords[char]
    if (!end) throw new Error(`Invalid char='${char}' in '${sequence}' at ${index}`)

    let bestComplexity = Infinity
    const possibleMoves = getMoves(index === 0, start, end)

    for (const variant of possibleMoves) {
      const complexity = solve(variant + "A", keyboards, index + 1)
      if (complexity < bestComplexity) bestComplexity = complexity
    }
    total += bestComplexity
    start = end
  }
  return total
})

const computeCost = (codes: string[], keyboards: number) => {
  return codes
    .map((code) => {
      const num = code.match(/\d+/)?.map(Number)[0] ?? 0
      return num * solve(code, keyboards, 0)
    })
    .reduce((a, b) => a + b, 0)
}

console.log("Part 1:", computeCost(codes, 2))
console.log("Part 2:", computeCost(codes, 25))
console.timeEnd("elapsed")
