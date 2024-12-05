const inputFile = Bun.file("src/5/input.txt")
const inputRaw = await inputFile.text()

// * Parsing
const [rulesRaw, updatesRaw] = inputRaw
  .split("\n\n")
  .map((line) => line.split("\n").filter(Boolean))

const rules = rulesRaw.map((rule) => rule.split("|").map(Number))
const rulesMap = rules.reduce((acc, [value, key]) => {
  const current = acc.get(key)
  acc.set(key, current ? [...current, value] : [value])
  return acc
}, new Map<number, number[]>())

const updates = updatesRaw.map((update) => update.split(",").map(Number))

const isCorrect = (update: number[]) => {
  let before = new Set<number>()

  return update.every((value) => {
    if (before.has(value)) return false
    const rules = rulesMap.get(value)
    if (!rules) return true

    rules.forEach((rule) => before.add(rule))
    return true
  })
}

// * Part 1
const correctUpdates = updates.filter(isCorrect)
const middles = correctUpdates.map((update) => update[(update.length - 1) / 2])

console.log(
  "Part 1: ",
  middles.reduce((acc, value) => acc + value, 0)
)

// * Part 2
const incorrectUpdates = updates.filter((update) => !isCorrect(update))

// * Little bit of bruteforce
const sorted = incorrectUpdates.map((update) =>
  [...update].sort((a, b) => {
    const rulesA = rulesMap.get(a)
    const rulesB = rulesMap.get(b)

    return !rulesB?.includes(a) && rulesA?.includes(b) ? -1 : 1
  })
)
const middlesSorted = sorted.map((update) => update[(update.length - 1) / 2])

console.log(
  "Part 2: ",
  middlesSorted.reduce((acc, value) => acc + value, 0)
)
