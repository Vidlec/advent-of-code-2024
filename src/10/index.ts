const inputFile = Bun.file("src/10/input.txt")
const inputRaw = await inputFile.text()
const grid = inputRaw.split("\n").map((line) => line.split("").map((v) => parseInt(v, 10)))

const directions = [
  [-1, 0], // * Up
  [1, 0], // * Down
  [0, -1], // * Left
  [0, 1], // * Right
]

console.time("elapsed")

let trailHeads: [number, number][] = []
grid.forEach((row, y) => {
  row.forEach((col, x) => {
    if (col === 0) trailHeads.push([y, x])
  })
})

let trails = new Map<string, Set<string>>()
let distinct = new Map<string, number>()

const walk = ([y, x]: [number, number], [oy, ox] = [y, x]) => {
  const value = grid[y][x]

  if (value === 9) {
    const key = [oy, ox].join("-")
    // * Longest trails
    const currentTrails = trails.get(key) ?? new Set()
    currentTrails.add([y, x].join("-"))
    trails.set(key, currentTrails)
    // * Distinct trails
    const currentDistinct = distinct.get(key) ?? 0
    distinct.set(key, currentDistinct + 1)

    return
  }

  const validDirections = directions.reduce((acc: [number, number][], [dy, dx]) => {
    const ny = y + dy
    const nx = x + dx
    const nValue = grid[ny]?.[nx]
    if (!nValue) return acc // * Out of bounds
    if (nValue - value === 1) acc.push([ny, nx])
    return acc
  }, [])

  validDirections.forEach((direction) => walk(direction, [oy, ox]))
}

// * PART 1
trailHeads.forEach((head) => walk(head))
const score1 = trails.values().reduce((acc, path) => acc + path.size, 0)

console.log("Part 1: ", score1)

// * PART 2
const score2 = distinct.values().reduce((acc, size) => acc + size, 0)
console.log("Part 2: ", score2)

console.timeEnd("elapsed")
