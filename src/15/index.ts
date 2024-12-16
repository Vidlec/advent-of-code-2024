const inputFile = Bun.file("src/15/input.txt")
const inputRaw = await inputFile.text()

const [gridRaw, movesRaw] = inputRaw.split("\n\n")

const grid = gridRaw.split("\n").map((line) => line.split(""))
const moves = movesRaw.split("").filter((value) => value !== "\n") as Direction[]

enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

enum Cell {
  Wall = "#",
  Space = ".",
  Crate = "O",
  Robot = "@",
}

enum WideCrate {
  Left = "[",
  Right = "]",
}

type Coords = [number, number]

const next = ([y, x]: Coords, direction: Direction): Coords => {
  const directions: Record<Direction, Coords> = {
    [Direction.UP]: [y - 1, x],
    [Direction.DOWN]: [y + 1, x],
    [Direction.LEFT]: [y, x - 1],
    [Direction.RIGHT]: [y, x + 1],
  }

  return directions[direction]
}

const startY = grid.findIndex((line) => line.includes(Cell.Robot))
const startX = grid[startY].findIndex((cell) => cell === Cell.Robot)

const tryMoveCrate = (
  matrix: string[][],
  [y, x]: Coords,
  direction: Direction,
  coords: Map<string, string> | null,
  previous?: Cell
): Map<string, string> | null => {
  if (coords === null) return null
  let [ny, nx] = next([y, x], direction)
  const nextCell = matrix[ny]?.[nx]
  const currentCell = matrix[y][x]

  if (nextCell === Cell.Wall) {
    return null
  }

  if (previous) {
    coords.set(`${y},${x}`, previous)
  } else if (!coords.has(`${y},${x}`)) {
    coords.set(`${y},${x}`, Cell.Space)
  }

  if (currentCell === Cell.Space) return coords

  if (nextCell === Cell.Space) {
    coords.set(`${ny},${nx}`, currentCell)
    return coords
  }
  if (
    nextCell === currentCell ||
    nextCell === Cell.Crate ||
    direction === Direction.LEFT ||
    direction === Direction.RIGHT
  ) {
    return tryMoveCrate(matrix, [ny, nx], direction, coords, currentCell as Cell)
  }

  let [nby, nbx] = nextCell === WideCrate.Left ? [ny, nx + 1] : [ny, nx - 1]

  const results = [
    [ny, nx, currentCell],
    [nby, nbx],
  ].map(([y, x, cell]) => tryMoveCrate(matrix, [y, x] as Coords, direction, coords, cell as Cell))
  if (results.includes(null)) return null
  return coords
}

const move = (matrix: string[][], [y, x]: Coords, directions: Direction[]) => {
  const grid = [...matrix.map((line) => [...line])]

  directions.forEach((direction) => {
    const [ny, nx] = next([y, x], direction)
    const moves = tryMoveCrate(grid, [y, x], direction, new Map())
    if (moves === null) return
    moves.entries().forEach(([key, value]) => {
      const [y, x] = key.split(",").map(Number)
      grid[y][x] = value
    })
    y = ny
    x = nx
  })

  return grid
}

console.time("elapsed")

const simple = move(grid, [startY, startX], moves)
const distances = simple.flatMap((row, y) =>
  row.map((col, x) => {
    if (col === Cell.Crate) return 100 * y + x
    return 0
  })
)

console.log(
  "Part 1: ",
  distances.reduce((a, b) => a + b)
)

const wideMap: Record<Cell, string[]> = {
  [Cell.Crate]: ["[", "]"],
  [Cell.Wall]: ["#", "#"],
  [Cell.Robot]: ["@", "."],
  [Cell.Space]: [".", "."],
}

let wideGrid: string[][] = []

grid.forEach((row, y) => {
  wideGrid.push([])
  row.forEach((col) => {
    const wideCells = wideMap[col as Cell]
    wideCells.forEach((cell) => wideGrid[y].push(cell))
  })
})

const y = wideGrid.findIndex((line) => line.includes(Cell.Robot))
const x = wideGrid[startY].findIndex((cell) => cell === Cell.Robot)

const wide = move(wideGrid, [y, x], moves)

const distancesWide = wide.flatMap((row, y) =>
  row.map((col, x) => {
    if (col === WideCrate.Left) return 100 * y + x
    return 0
  })
)

console.log(
  "Part 2: ",
  distancesWide.reduce((a, b) => a + b)
)

console.timeEnd("elapsed")
