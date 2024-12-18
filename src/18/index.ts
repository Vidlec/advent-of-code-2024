const inputFile = Bun.file("src/18/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const corruptedCells = inputRaw
  .split("\n")
  .map((line) => line.split(",").map((v) => parseInt(v, 10)))

const [mx, my] = corruptedCells.reduce(
  ([ax, ay], [x, y]) => [x + 1 > ax ? x + 1 : ax, y + 1 > ay ? y + 1 : ay],
  [0, 0]
)

type Direction = "north" | "south" | "east" | "west"
interface Position {
  x: number
  y: number
  path: string[]
  direction: Direction | null
}
// Directions for movement
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

const findPath = (grid: string[][]) => {
  let queue = Queue<Position>()
  queue.enqueue({ x: 0, y: 0, path: [`${0},${0}`], direction: null })

  const visited = new Set<string>()

  while (!queue.isEmpty()) {
    const path = queue.dequeue()!

    if (path.x === mx - 1 && path.y === my - 1) {
      return path
    }

    for (const [newDirection, [dx, dy]] of Object.entries(directions)) {
      const nx = path.x + dx
      const ny = path.y + dy

      const key = `${ny},${nx}`
      const nextCell = grid[ny]?.[nx]

      if (!nextCell || nextCell === "#" || visited.has(key)) continue
      visited.add(key)

      queue.enqueue({
        y: ny,
        x: nx,
        path: [...path.path, key],
        direction: newDirection as Direction,
      })
    }
  }

  return null
}

const find = (FALLEN_BYTES: number) => {
  const fallenBytes = [...corruptedCells].splice(0, FALLEN_BYTES)
  const fallenBytesSet = new Set(fallenBytes.map((v) => v.join(",")))

  const grid = Array.from({ length: my }).map((_, y) => {
    return Array.from({ length: mx }).map((_, x) => (fallenBytesSet.has(`${x},${y}`) ? "#" : "."))
  })

  return findPath(grid)
}

// * PART 1
const part1Path = find(1024)
if (part1Path) {
  console.log("Part 1: ", part1Path.path.length - 1)
}

// * PART 2
const findBlockingByteIndex = () => {
  let low = 0
  let high = corruptedCells.length
  let result: number | null = null

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const value = find(mid)

    if (value === null) {
      result = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return result
}
const blockingByteIndex = findBlockingByteIndex()
if (blockingByteIndex) {
  console.log("Part 2: ", corruptedCells[blockingByteIndex - 1].join(","))
}

console.timeEnd("elapsed")
