const inputFile = Bun.file("src/9/input.txt")
const inputRaw = await inputFile.text()
const input = inputRaw.split("").map((value) => parseInt(value, 10))

let output: (number | string)[] = []

const toChecksum = (acc: number, value: string | number, index: number) => {
  if (typeof value === "number") return acc + index * value
  return acc
}

console.time("elapsed")

input.forEach((number, index) => {
  const isFreeSpace = index % 2
  const fileIndex = index === 0 ? 0 : index / 2

  Array.from({ length: number }).forEach(() => {
    const content = !!isFreeSpace ? "." : fileIndex
    output.push(content)
  })
})

// * PART 1

let outputPart1 = [...output]
let border = outputPart1.length - 1

outputPart1.forEach((value, index) => {
  if (value !== ".") return
  if (index >= border) return

  let lastIndex = border
  while (true) {
    const last = outputPart1[lastIndex]
    if (last === ".") {
      lastIndex--
      continue
    }
    outputPart1[index] = last
    border = lastIndex - 1
    break
  }
})

const checksum1 = outputPart1.slice(0, border + 1).reduce(toChecksum, 0)

console.log("Part 1: ", checksum1)

// * PART 2

const group = (input: (string | number)[]) => {
  let result: (number | string)[][] = []
  let group: (number | string)[] = []

  input.forEach((value, index) => {
    const groupItem = group[0]

    if (index === input.length - 1) {
      result.push(group)
    }

    if (groupItem === undefined || groupItem === value) {
      return group.push(value)
    }

    result.push(group)
    group = [value]
  })

  return result
}

const outputPart2 = group(output).reverse()

outputPart2.forEach((rightGroup, rightIndex) => {
  if (rightGroup[0] === ".") return
  const targetLength = rightGroup.length

  let leftIndex = outputPart2.length - 1
  while (true) {
    const leftGroup = outputPart2[leftIndex]
    if (rightIndex === leftIndex) return
    if (leftGroup[0] !== "." || leftGroup.length < targetLength) {
      leftIndex--
      continue
    }
    const spliced = outputPart2[leftIndex].splice(0, targetLength)
    outputPart2.splice(leftIndex + 1, 0, rightGroup)
    outputPart2.splice(rightIndex, 1, spliced)
    break
  }
})

console.log("Part 2: ", outputPart2.reverse().flat().reduce(toChecksum, 0))

console.timeEnd("elapsed")
