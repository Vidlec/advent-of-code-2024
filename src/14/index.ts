const inputFile = Bun.file("src/14/input.txt")
const inputRaw = await inputFile.text()

const coords = inputRaw
  .split("\n")
  .map(
    (line) =>
      line.match(/\d+|-\d+/gm)?.map((v) => parseInt(v, 10)) as [number, number, number, number]
  )

const desc = (a: number, b: number) => b - a
const mx = coords.map(([x]) => x).sort(desc)[0] + 1
const my = coords.map(([_, y]) => y).sort(desc)[0] + 1

const generateGridAt = (iteration: number) => {
  let positions = new Map<string, number>()

  // * Using modulo to wrap around
  // * https://dev.to/jvon1904/how-to-wrap-around-a-range-of-numbers-with-the-modulo-cdo

  coords.forEach(([x, y, dx, dy]) => {
    const nx = (((x + iteration * dx) % mx) + mx) % mx
    const ny = (((y + iteration * dy) % my) + my) % my

    const key = `${ny},${nx}`
    positions.set(key, (positions.get(key) ?? 0) + 1)
  })

  const ylimit = Math.floor(my / 2)
  const xlimit = Math.floor(mx / 2)

  let q1 = 0,
    q2 = 0,
    q3 = 0,
    q4 = 0

  positions.entries().forEach(([key, count]) => {
    const [y, x] = key.split(",").map(Number)
    if (y === ylimit || x === xlimit) return

    if (y < ylimit) {
      if (x > xlimit) {
        q1 = q1 + count
      }
      if (x < xlimit) {
        q2 = q2 + count
      }
      return
    }

    if (x > xlimit) {
      q3 = q3 + count
      return
    }
    q4 = q4 + count
  })

  return {
    sum: q1 * q2 * q3 * q4,
    positions,
    iteration,
  }
}

console.time("elapsed")
console.log("Part 1: ", generateGridAt(100).sum)

const outputs = Array.from({ length: mx * my }).map((_, index) => generateGridAt(index))
outputs.sort(({ sum: a }, { sum: b }) => a - b)

const final = outputs[0]

console.log("Part 2: ", final.iteration)
console.timeEnd("elapsed")

// * Generate final image
const header = `P1\n${mx} ${my}`
const data = Array.from({ length: my })
  .map((_, y) => {
    return Array.from({ length: mx })
      .map((_, x) => {
        const value = final.positions.get(`${y},${x}`)
        return value ? 1 : 0
      })
      .join(" ")
  })
  .join("\n")

await Bun.write("happy_christmas.pbm", `${header}\n${data}`)
