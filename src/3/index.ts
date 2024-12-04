const inputFile = Bun.file("src/3/input.txt")
const inputRaw = await inputFile.text()

// * Part 1

const valuesPart1 = [...inputRaw.matchAll(/mul\((\d*\,\d*)\)/gm)]
  .map((match) => match[1])
  .map((value) => {
    const [a, b] = value.split(",").map(Number)
    return a * b
  })

console.log(
  "Part 1: ",
  valuesPart1.reduce((acc, value) => acc + value, 0)
)

// * Part 2

const isEnabled = (match: string | null) => {
  if (match === "don't()") return false
  if (match === "do()") return true
  return null
}

const valuesPart2 = [...inputRaw.matchAll(/mul\((\d*\,\d*)\)|don't\(\)|do\(\)/gm)].reduce(
  (acc, [match, capture]) => {
    const enabled = isEnabled(match) ?? acc.enabled
    if (!capture || !enabled) return { ...acc, enabled }

    const [a, b] = capture.split(",").map(Number)
    return { value: acc.value + a * b, enabled }
  },
  { value: 0, enabled: true }
)
console.log("Part 2: ", valuesPart2.value)
