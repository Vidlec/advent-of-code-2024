const inputFile = Bun.file("src/8/input.txt")
const inputRaw = await inputFile.text()
const matrix = inputRaw.split("\n").map((line) => line.split(""))

const inBounds = ([y, x]: readonly [number, number]) => !!matrix[y]?.[x]
const antennas = new Map<string, [number, number][]>()

console.time("elapsed")
matrix.forEach((line, y) => {
  line.forEach((node, x) => {
    if (node !== ".") {
      const current = antennas.get(node) ?? []
      antennas.set(node, [...current, [y, x]])
    }
  })
})

const resonancesPart1 = new Set<string>()

antennas.forEach((coords) => {
  coords.forEach(([y, x], index) => {
    coords.forEach(([yb, xb], indexB) => {
      if (indexB === index) return
      const deltaY = yb - y
      const deltaX = xb - x

      const a = [y - deltaY, x - deltaX] as const
      const b = [yb + deltaY, xb + deltaX] as const
      if (inBounds(a)) resonancesPart1.add(a.join("-"))
      if (inBounds(b)) resonancesPart1.add(b.join("-"))
    })
  })
})

console.log("Part 1: ", resonancesPart1.size)

const resonancesPart2 = new Set<string>()

antennas.forEach((coords) => {
  coords.forEach(([y, x], index) => {
    coords.forEach(([yb, xb], indexB) => {
      if (indexB === index) return
      const deltaY = yb - y
      const deltaX = xb - x

      let ay = y - deltaY
      let ax = x - deltaX

      let by = y + deltaY
      let bx = x + deltaX

      while (true) {
        const a = [ay, ax] as const
        if (!inBounds(a)) break
        resonancesPart2.add(a.join("-"))
        ay = ay - deltaY
        ax = ax - deltaX
      }

      while (true) {
        const b = [by, bx] as const
        if (!inBounds(b)) break
        resonancesPart2.add(b.join("-"))
        by = by + deltaY
        bx = bx + deltaX
      }
    })
  })
})

console.log("Part 2: ", resonancesPart2.size)
console.timeEnd("elapsed")
