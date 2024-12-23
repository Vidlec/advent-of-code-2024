const inputFile = Bun.file("src/11/input.txt")
const inputRaw = await inputFile.text()
let numbers = inputRaw.split(" ").map((v) => parseInt(v, 10))

type Counts = Map<number, number>

const trySet = (map: Counts, key: number, value: number) =>
  map.set(key, (map.get(key) ?? 0) + value)

const countNumbers = (iterations: number) => {
  let counts: Counts = new Map()

  numbers.forEach((number) => {
    counts.set(number, 1)
  })

  Array.from({ length: iterations }).forEach(() => {
    let nCounts: Counts = new Map()

    counts.entries().forEach(([num, count]) => {
      if (num === 0) {
        return trySet(nCounts, 1, count)
      }

      const numString = num.toString()
      if (numString.length % 2 === 0) {
        const mid = numString.length / 2

        trySet(nCounts, parseInt(numString.slice(0, mid), 10), count) // * Left
        trySet(nCounts, parseInt(numString.slice(mid), 10), count) // * Right
        return
      }

      trySet(nCounts, num * 2024, count)
    })

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
