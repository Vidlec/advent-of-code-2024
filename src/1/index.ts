const inputFile = Bun.file("src/1/input.txt")
const inputRaw = await inputFile.text()

let { left, right } = inputRaw.split("\n").reduce((acc, pair) => {
  const [leftValue, rightValue] = pair.split(" ").filter(Boolean).map(Number)
  acc.left.push(leftValue)
  acc.right.push(rightValue) 
  return acc
}, { left: [], right: []} as { left: number[], right: number[]})

left.sort()
right.sort()


// * PART 1

const distance = left.reduce((acc, leftValue, index) => {
  const rightValue = right[index] ?? 0
  return acc + Math.abs(leftValue - rightValue)
}, 0)

console.log(distance)

// * PART 2

const appearances = right.reduce((acc, key: number) => {
  const current = acc.get(key) ?? 0
  return acc.set(key, current + 1)
}, new Map<number, number>())

const similarity = left.reduce((acc, leftValue) => {
  const multiplier = appearances.get(leftValue) ?? 0
  return acc + (leftValue * multiplier)
}, 0)

console.log(similarity)