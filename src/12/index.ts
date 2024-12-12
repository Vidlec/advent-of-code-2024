const inputFile = Bun.file("src/12/input.txt")
const inputRaw = await inputFile.text()
const matrix = inputRaw.split("\n").map((line) => line.split(""))

console.time("elapsed")

const plots = new Map<string, Coords[]>()

matrix.forEach((row, y) => {
  row.forEach((value, x) => {
    const current = plots.get(value) ?? []
    current.push([y, x])
    plots.set(value, current)
  })
})

// * PART 1
const distance = ([ay, ax]: Coords, [by, bx]: Coords) => {
  const dy = ay - by
  const dx = ax - bx
  return Math.abs(dy) + Math.abs(dx)
}

const splitAdjacentGroups = (
  groups: Coords[][],
  coord: Coords
): { adjacent: Coords[][]; nonAdjacent: Coords[][] } => {
  const adjacent: Coords[][] = []
  const nonAdjacent: Coords[][] = []

  groups.forEach((group) => {
    if (group.some((groupCoord) => distance(coord, groupCoord) === 1)) {
      adjacent.push(group)
    } else {
      nonAdjacent.push(group)
    }
  })

  return { adjacent, nonAdjacent }
}

const groupsMap = new Map<string, Coords[][]>()
plots.entries().forEach(([key, coords]) => {
  coords.forEach(([y, x]) => {
    const groups = groupsMap.get(key) ?? []
    const { adjacent, nonAdjacent } = splitAdjacentGroups(groups, [y, x])

    let group = adjacent.flat()

    if (group.length === 0) {
      nonAdjacent.push([[y, x]])
    } else {
      group.push([y, x])
      nonAdjacent.push(group)
    }
    groupsMap.set(key, nonAdjacent)
  })
})

const perimeter = (coords: Coords[]): number => {
  const coordSet = new Set(coords.map(([y, x]) => `${y},${x}`))
  let perimeter = 0

  coords.forEach(([y, x]) => {
    perimeter += 4

    if (coordSet.has(`${y + 1},${x}`)) perimeter--
    if (coordSet.has(`${y - 1},${x}`)) perimeter--
    if (coordSet.has(`${y},${x + 1}`)) perimeter--
    if (coordSet.has(`${y},${x - 1}`)) perimeter--
  })

  return perimeter
}

const part1 = groupsMap
  .values()
  .map((groups) => groups.reduce((acc, group) => acc + group.length * perimeter(group), 0))

console.log(
  "Part 1: ",
  [...part1].reduce((a, b) => a + b, 0)
)

// * PART 2

type Coords = [number, number]

const directions: Coords[] = [
  [-1, 0], // * Up
  [1, 0], // * Down
  [0, -1], // * Left
  [0, 1], // * Right
]

const serialize = ([y, x]: Coords) => `${y},${x}`
const deserialize = (key: string): Coords => key.split(",").map(Number) as Coords

const groupConsecutiveLines = (coords: Set<string>) => {
  const visited = new Set<string>()
  const groups: Coords[][] = []

  const search = (coord: Coords, group: Coords[]) => {
    const key = serialize(coord)
    if (visited.has(key) || !coords.has(key)) return

    visited.add(key)
    group.push(coord)

    directions.forEach(([dy, dx]) => {
      const neighbor: Coords = [coord[0] + dy, coord[1] + dx]
      search(neighbor, group)
    })
  }

  coords.forEach((key) => {
    if (!visited.has(key)) {
      const group: Coords[] = []
      search(deserialize(key), group)
      groups.push(group)
    }
  })

  return groups
}

const sides = (coords: Coords[]) => {
  const coordSet = new Set<string>()

  let borders = [
    new Set<string>(), // * Top
    new Set<string>(), // * Down
    new Set<string>(), // * Left
    new Set<string>(), // * Right
  ]

  coords.forEach((coords) => {
    coordSet.add(coords.join(","))
  })

  coords.forEach(([y, x]) => {
    directions.forEach(([dy, dx], index) => {
      const key = serialize([y + dy, x + dx])
      if (!coordSet.has(key)) {
        borders[index].add(key)
      }
    })
  })

  const sideCounts = borders.map((border) => {
    const groups = groupConsecutiveLines(border)
    return groups.length
  })

  return sideCounts.reduce((a, b) => a + b, 0)
}

const part2 = groupsMap.values().map((groups) =>
  groups.reduce((acc, group) => {
    return acc + group.length * sides(group)
  }, 0)
)

console.log(
  "Part 2: ",
  [...part2].reduce((a, b) => a + b, 0)
)
console.timeEnd("elapsed")
