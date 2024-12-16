const inputFile = Bun.file("src/16/input.txt")
const inputRaw = await inputFile.text()

const grid = inputRaw.split("\n").map((line) => line.split(""))

type Direction = "north" | "south" | "east" | "west"

interface Position {
  x: number
  y: number
  path: string[]
  score: number
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

// Directions for movement
const directions: { [key in Direction]: [number, number] } = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
}

const PriorityQueue = <T>(bucketSize: number) => {
  let buckets: T[][] = []
  let minBucket: number = Infinity

  return {
    enqueue: (value: T, priority: number) => {
      const index = Math.floor(priority / bucketSize)
      if (!buckets[index]) {
        buckets[index] = []
      }
      buckets[index].push(value)
      minBucket = Math.min(minBucket, index)
    },
    dequeue: (): T | undefined => {
      while (buckets[minBucket] && buckets[minBucket].length === 0) {
        minBucket++
      }

      if (buckets[minBucket] && buckets[minBucket].length > 0) {
        return buckets[minBucket].shift()
      }

      return undefined
    },
    isEmpty: (): boolean => {
      return buckets.every((bucket) => !bucket || bucket.length === 0)
    },
    items: () => buckets.flat(),
  }
}

const findPathWithLeastTurns = (grid: string[][]) => {
  const start = findPosition("S")
  const end = findPosition("E")

  if (!start || !end) throw new Error("Start or End position not found!")

  let queue = PriorityQueue<Position>(1000)
  queue.enqueue(
    { x: start.x, y: start.y, path: [`${start.y},${start.x}`], score: 0, direction: "east" },
    0
  )

  const visited = new Set<string>()
  const scoreTracker = new Map<string, number>()
  let bestPaths: Position[] = []
  let minScore = Infinity

  while (!queue.isEmpty()) {
    const path = queue.dequeue()!

    if (path.x === end.x && path.y === end.y) {
      if (path.score === minScore) {
        bestPaths.push(path)
      }
      if (path.score < minScore) {
        minScore = path.score
        bestPaths = [path]
      }
      continue
    }

    for (const [newDirection, [dx, dy]] of Object.entries(directions)) {
      const nx = path.x + dx
      const ny = path.y + dy

      if (grid[ny][nx] !== "#") {
        const newScore = path.direction === newDirection ? path.score + 1 : path.score + 1001
        const key = `${ny},${nx}`
        const scoreVector = `${key},${newDirection}`
        const vector = scoreTracker.get(scoreVector)

        if (!visited.has(key) || !vector || newScore <= vector) {
          visited.add(key)
          scoreTracker.set(scoreVector, newScore)
          queue.enqueue(
            {
              y: ny,
              x: nx,
              path: [...path.path, key],
              score: newScore,
              direction: newDirection as Direction,
            },
            newScore
          )
        }
      }
    }
  }

  return bestPaths
}

console.time("elapsed")

const result = findPathWithLeastTurns(grid)

if (result[0]) {
  const { score } = result[0]
  console.log("Part 1: ", score)
}

const bestPaths = new Set()
result.forEach(({ path }) => {
  path.forEach((key) => {
    const [y, x] = key.split(",")
    bestPaths.add(`${y},${x}`)
  })
})

console.log("Part 2: ", bestPaths.size)

console.timeEnd("elapsed")
