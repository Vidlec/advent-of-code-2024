const inputFile = Bun.file("src/2/input.txt")
const inputRaw = await inputFile.text()

const reports = inputRaw.split("\n").map(report => report.split(" ").map(Number))

const remove = <T extends number>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

const isSafe = (remaining: number[], index: number): boolean => {
  const value = remaining[index]
  const prev = remaining[index - 1]
  if (!prev) return isSafe(remaining, index + 1)
    
  const diff = Math.abs(prev - value)
  if (diff < 1 || diff > 3) return false

  const prec = remaining[index - 2]
  if (!prec) return isSafe(remaining, index + 1)

  const direction = prec > prev ? "down" : "up"
  if (direction === "down") {
    if (value > prev) return false
  }
  if (direction === "up") {
    if (value < prev) return false
  }

  if (index === remaining.length - 1) return true
  return isSafe(remaining, index + 1)
}

// * Part 1
const safeReports = reports.filter(report => isSafe(report, 0))
console.log("Part 1: ", safeReports.length)

// * Part 2
// * ENTER BRUTE FORCE 😎

const unsafeReports = reports.filter(report => !isSafe(report, 0))

const fixableReports = unsafeReports.filter(report => {
  const variants = report.map((_, index) => remove(report, index))
  return variants.some(variant => isSafe(variant, 0))
})

console.log("Part 2:", safeReports.length + fixableReports.length)