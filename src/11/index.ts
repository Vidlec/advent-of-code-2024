const inputFile = Bun.file("src/11/input.txt")
const inputRaw = await inputFile.text()
let numbers = inputRaw.split(" ").map((v) => parseInt(v, 10))

type Counts = Map<number, number>

const countNumbers = (iterations: number) => {
  let counts: Counts = new Map()

  numbers.forEach((number) => {
    counts.set(number, 1)
  })

  Array.from({ length: iterations }).forEach(() => {
    let nCounts: Counts = new Map()

    for (const [num, count] of counts.entries()) {
      if (num === 0) {
        nCounts.set(1, (nCounts.get(1) ?? 0) + count)
        continue
      }

      const numString = num.toString()
      if (numString.length % 2 === 0) {
        const mid = Math.floor(numString.length / 2)
        const left = parseInt(numString.slice(0, mid), 10)
        const right = parseInt(numString.slice(mid), 10)

        nCounts.set(left, (nCounts.get(left) ?? 0) + count)
        nCounts.set(right, (nCounts.get(right) ?? 0) + count)
        continue
      }

      const newNum = num * 2024
      nCounts.set(newNum, (nCounts.get(newNum) ?? 0) + count)
    }

    counts = nCounts
  })

  return counts.values().reduce((a, b) => a + b, 0)
}

console.time("elapsed")
const result1 = countNumbers(25)
console.log("Part 1: ", result1)
console.timeEnd("elapsed")

console.time("elapsed")
const result2 = countNumbers(75)
console.log("Part 2: ", result2)
console.timeEnd("elapsed")
