const inputFile = Bun.file("src/22/input.txt")
const inputRaw = await inputFile.text()
const initial = inputRaw.split("\n").map((v) => BigInt(v))

const mixAndPrune = (a: bigint, b: bigint) => (a ^ b) % 16777216n

const sum = (a: number, b: number) => a + b
const max = (a: number, b: number) => (b > a ? b : a)

console.time("elapsed")

const patterns = new Map<string, number>()
const LENGTH = 2000

const secrets = initial.map((initial) => {
  const prices: number[] = []
  const usedPatterns = new Set()

  const result = Array.from({ length: LENGTH }).reduce((acc: bigint, _, index) => {
    prices.push(Number(acc) % 10)

    const first = mixAndPrune(acc, acc * 64n)
    const second = mixAndPrune(first, first / 32n)
    const result = mixAndPrune(second, second * 2048n)

    // * Push last price
    if (index === LENGTH - 1) prices.push(Number(result) % 10)
    return result
  }, initial)

  const changes = prices
    .map((value, index) => (index === 0 ? null : value - prices[index - 1]))
    .filter((v) => v !== null)

  changes.forEach((change, index) => {
    const pattern = [change, changes[index + 1], changes[index + 2], changes[index + 3]]
    const key = pattern.join(",")

    if (usedPatterns.has(key)) return
    usedPatterns.add(key)

    const value = prices[index + 4]
    patterns.set(key, (patterns.get(key) ?? 0) + value)
  })

  return result
})

console.log("Part 1: ", secrets.map(Number).reduce(sum))

const v = [...patterns.values()]
console.log("Part 2:", v.reduce(max))
console.timeEnd("elapsed")
