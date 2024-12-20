const inputFile = Bun.file("src/20/input.txt")
const inputRaw = await inputFile.text()

const grid = inputRaw.split("\n").map((line) => line.split(""))

type Direction = "north" | "south" | "east" | "west"

interface Position {
  x: number
  y: number
  path: string[]
  direction: Direction | null
}

// * Helper to find the start and end positions
const findPosition = (char: string): { x: number; y: number } | null => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === char) return { x, y }
    }
  }
  return null
}

const directions: { [key in Direction]: [number, number] } = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
}

const Queue = <T>() => {
  let queue: T[] = []

  return {
    enqueue: (value: T) => {
      queue.push(value)
    },
    dequeue: (): T | undefined => {
      return queue.shift()
    },
    isEmpty: (): boolean => {
      return queue.length === 0
    },
    items: (): T[] => {
      return [...queue]
    },
  }
}

const start = findPosition("S")
const end = findPosition("E")

if (!start || !end) throw new Error("Start or End position not found!")

const findPath = (
  grid: string[][],
  visited = new Set<string>(),
  initialPath: Position = {
    x: start.x,
    y: start.y,
    path: [`${start.y},${start.x}`],
    direction: "east",
  }
) => {
  let queue = Queue<Position>()
  queue.enqueue(initialPath)

  while (!queue.isEmpty()) {
    const path = queue.dequeue()!
    if (path.x === end.x && path.y === end.y) {
      return path
    }

    for (const [newDirection, [dx, dy]] of Object.entries(directions)) {
      const nx = path.x + dx
      const ny = path.y + dy
      const nCell = grid[ny]?.[nx]

      const key = `${ny},${nx}`

      if (!nCell) continue
      if (nCell !== "#") {
        if (!visited.has(key)) {
          visited.add(key)
          queue.enqueue({
            y: ny,
            x: nx,
            path: [...path.path, key],
            direction: newDirection as Direction,
          })
        }
      }
    }
  }

  return null
}

console.time("elapsed")

const generateMoves = (
  coordinate: [number, number],
  moveDistance: number,
  path: Set<string>
): string[] => {
  const [y, x] = coordinate
  const moves: string[] = []

  for (let distance = 1; distance <= moveDistance; distance++) {
    for (let dy = -distance; dy <= distance; dy++) {
      for (let dx = -distance; dx <= distance; dx++) {
        if (Math.abs(dy) + Math.abs(dx) === distance) {
          const ny = y + dy
          const nx = x + dx
          const key = `${ny},${nx}`
          if (path.has(key)) {
            moves.push(key)
          }
        }
      }
    }
  }

  return moves
}

const manhattanDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const [x1, y1] = coord1
  const [x2, y2] = coord2

  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

const findShortcuts = (path: string[], move: number, max: number) => {
  const pathSet = new Set(path)
  const pathSizes = new Map<string, number>(path.map((key, index) => [key, index + 1]))

  return path.flatMap((coord) => {
    const [y, x] = coord.split(",").map(Number)
    const moves = generateMoves([y, x], move, pathSet)
    const from = pathSizes.get(coord)

    return moves
      .map((moveKey) => {
        const to = pathSizes.get(moveKey)
        const [my, mx] = moveKey.split(",").map(Number)
        if (!to || !from) return 0
        return to - from - manhattanDistance([y, x], [my, mx])
      })
      .filter((v) => v >= max)
  })
}

const groupByCount = (acc: Map<number, number>, value: number) => {
  return acc.set(value, (acc.get(value) ?? 0) + 1)
}

const path = findPath(grid)
if (path) {
  const part1 = findShortcuts(path.path, 2, 100).reduce(groupByCount, new Map<number, number>())
  console.log(
    "Part 1: ",
    [...part1.values()].reduce((a, b) => a + b)
  )

  const part2 = findShortcuts(path.path, 20, 100).reduce(groupByCount, new Map<number, number>())
  console.log(
    "Part 2: ",
    [...part2.values()].reduce((a, b) => a + b)
  )
}

console.timeEnd("elapsed")
