const inputFile = Bun.file("src/7/input.txt")
const inputRaw = await inputFile.text()

const input = inputRaw.split("\n").map((line) => {
  const [sum, eq] = line.split(":")
  return [Number(sum), eq.trim().split(" ").map(Number)]
}) as [number, number[]][]

type Operation = "+" | "*" | "||"
const operations: Operation[] = ["+", "*"]

const calc = (a: number, b: number, operation: Operation): number => {
  switch (operation) {
    case "+":
      return a + b
    case "||":
      return Number(`${a}${b}`)
    case "*":
      return a * b
  }
}

const isSolvable = (
  numbers: number[],
  currentResult: number,
  index: number,
  targetResult: number
): boolean => {
  if (index === numbers.length) {
    // * Check if the current result matches the target
    return currentResult === targetResult
  }

  // * Try each operation with the current number
  for (const operation of operations) {
    const nextResult = calc(currentResult, numbers[index], operation)

    if (isSolvable(numbers, nextResult, index + 1, targetResult)) {
      return true
    }
  }

  return false
}

// * PART 1
const solvablePart1 = input.filter(([result, numbers]) => {
  return isSolvable(numbers, numbers[0], 1, result)
})

console.log(
  "Part 1: ",
  solvablePart1.reduce((acc, [target]) => acc + target, 0)
)

// * PART 2

operations.push("||")
const solvablePart2 = input.filter(([result, numbers]) => {
  return isSolvable(numbers, numbers[0], 1, result)
})

console.log(
  "Part 1: ",
  solvablePart2.reduce((acc, [target]) => acc + target, 0)
)
