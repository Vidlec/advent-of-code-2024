const inputFile = Bun.file("src/4/input.txt")
const inputRaw = await inputFile.text()
const grid = inputRaw.split("\n")

// * Inspired by https://www.geeksforgeeks.org/search-a-word-in-a-2d-grid-of-characters/

interface Direction {
  dx: number
  dy: number
}

const inBounds = (x: number, y: number, rows: number, cols: number) =>
  x >= 0 && y >= 0 && x < rows && y < cols

const searchWord = (grid: string[], word: string): number => {
  const directions: Direction[] = [
    { dx: 0, dy: 1 }, // Right
    { dx: 1, dy: 0 }, // Down
    { dx: 0, dy: -1 }, // Left
    { dx: -1, dy: 0 }, // Up
    { dx: 1, dy: 1 }, // Diagonal Down-Right
    { dx: -1, dy: -1 }, // Diagonal Up-Left
    { dx: 1, dy: -1 }, // Diagonal Down-Left
    { dx: -1, dy: 1 }, // Diagonal Up-Right
  ]

  const rows = grid.length
  const cols = grid[0].length
  const wordLength = word.length

  const isWordAt = (x: number, y: number, { dx, dy }: Direction): boolean => {
    return Array.from({ length: wordLength }).every((_, i) => {
      const newX = x + i * dx
      const newY = y + i * dy
      return inBounds(newX, newY, rows, cols) && grid[newX][newY] === word[i]
    })
  }

  // * Who needs for loops ✌️
  return grid.flatMap((row, x) =>
    Array.from(row).flatMap((_, y) => directions.filter((direction) => isWordAt(x, y, direction)))
  ).length
}

console.log("Part 1: ", searchWord(grid, "XMAS"))

const searchPattern = (grid: string[]): number => {
  const rows = grid.length
  const cols = grid[0].length

  const checkArm = (x1: number, y1: number, x2: number, y2: number): boolean => {
    if (!inBounds(x1, y1, rows, cols) || !inBounds(x2, y2, rows, cols)) return false
    return (
      (grid[x1][y1] === "M" && grid[x2][y2] === "S") ||
      (grid[x1][y1] === "S" && grid[x2][y2] === "M")
    )
  }

  const isValidXMas = (x: number, y: number): boolean => {
    // * Find A that is in bounds
    if (!inBounds(x, y, rows, cols) || grid[x][y] !== "A") return false

    // * Check both diagonals
    return (
      checkArm(x - 1, y - 1, x + 1, y + 1) && // Top-left to Bottom-right
      checkArm(x - 1, y + 1, x + 1, y - 1) // Top-right to Bottom-left
    )
  }

  return grid
    .flatMap((row, x) => row.split("").map((_, y) => ({ x, y })))
    .filter(({ x, y }) => isValidXMas(x, y)).length
}

console.log("Part 2: ", searchPattern(grid))
