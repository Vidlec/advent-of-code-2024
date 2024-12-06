const inputFile = Bun.file("src/6/input.txt")
const inputRaw = await inputFile.text()

const matrix = inputRaw.split("\n").map((line) => line.split(""))

enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

const isStart = (cell: string) => Object.values(Direction).includes(cell as Direction)

const startY = matrix.findIndex((line) => line.some(isStart))
const startX = matrix[startY].findIndex(isStart)

const nextDirection: Record<Direction, Direction> = {
  [Direction.UP]: Direction.RIGHT,
  [Direction.DOWN]: Direction.LEFT,
  [Direction.LEFT]: Direction.UP,
  [Direction.RIGHT]: Direction.DOWN,
}

const move = ([y, x]: [number, number], direction: Direction): [number, number] => {
  const directions: Record<Direction, [number, number]> = {
    [Direction.UP]: [y - 1, x],
    [Direction.DOWN]: [y + 1, x],
    [Direction.LEFT]: [y, x - 1],
    [Direction.RIGHT]: [y, x + 1],
  }

  return directions[direction]
}

const simulatePath = (
  matrix: string[][],
  [startY, startX]: [number, number],
  startDirection: Direction
): Set<string> | boolean => {
  let y = startY
  let x = startX
  let direction = startDirection
  let visitedVectors = new Set<string>()

  while (true) {
    const key = `${y},${x}`
    const vector = `${key},${direction}`

    if (visitedVectors.has(vector)) return true // * Loop
    visitedVectors.add(vector)

    const [nextY, nextX] = move([y, x], direction)
    const nextCell = matrix[nextY]?.[nextX]

    if (!nextCell) return false // * Not a loop
    if (nextCell === "#") {
      direction = nextDirection[direction]
    }

    if (nextCell !== "#") {
      const [moveY, moveX] = move([y, x], direction)
      y = moveY
      x = moveX
      visitedVectors.add(vector)
    }
  }
}

const startDirection = matrix[startY][startX] as Direction

let path = new Set<string>()
let obstacles = new Set()

const placeObstacles = (
  matrix: string[][],
  [startY, startX]: [number, number],
  startDirection: Direction
) => {
  let y = startY
  let x = startX
  let direction = startDirection

  while (true) {
    const key = `${y},${x}`
    path.add(key)

    const [nextY, nextX] = move([y, x], direction)
    const nextCell = matrix[nextY]?.[nextX]
    if (!nextCell) break // * Out of bounds

    if (nextCell === "#") {
      direction = nextDirection[direction]
      continue
    }

    if (nextCell !== "#") {
      // * Don't try to place obstacles where we already were
      if (!path.has(`${nextY},${nextX}`)) {
        // * Check for possible loops
        let newMatrix = matrix.map((line) => [...line])
        newMatrix[nextY][nextX] = "#"
        const isLoop = simulatePath(newMatrix, [y, x], direction)
        if (isLoop) obstacles.add(`${nextY},${nextX}`)
      }

      const [moveY, moveX] = move([y, x], direction)

      y = moveY
      x = moveX
    }
  }
}

console.time("Time")
placeObstacles(matrix, [startY, startX], startDirection)
console.log("Part 1: ", path.size)
console.log("Part 2: ", obstacles.size)
console.timeEnd("Time")
