const inputFile = Bun.file("src/23/input.txt")
const inputRaw = await inputFile.text()
const lines = inputRaw.split("\n")
console.time("elapsed")

type Graph = Map<string, Set<string>>

const isFullyConnected = (graph: Graph, subset: string[]): boolean => {
  const [a, b, c] = subset
  return !!(graph.get(a)?.has(b) && graph.get(a)?.has(c) && graph.get(b)?.has(c))
}

const generateConnectedSets = (connections: string[]) => {
  const graph: Graph = new Map()

  for (const connection of connections) {
    const [a, b] = connection.split("-")
    graph.get(a)?.add(b) ?? graph.set(a, new Set([b]))
    graph.get(b)?.add(a) ?? graph.set(b, new Set([a]))
  }

  const nodes = [...graph.keys()]
  const result: string[][] = []

  // * Generate 3-combinations of nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const subset = [nodes[i], nodes[j], nodes[k]]
        if (isFullyConnected(graph, subset)) result.push(subset)
      }
    }
  }

  let longestClique: string[] = []

  // * Bron–Kerbosch Algorithm
  // * https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
  const bronKerbosch = (r: Set<string>, p: Set<string>, x: Set<string>) => {
    if (p.size === 0 && x.size === 0) {
      // Found a maximal clique
      if (r.size > longestClique.length) {
        longestClique = Array.from(r)
      }
      return
    }

    for (const node of Array.from(p)) {
      const neighbors = graph.get(node) || new Set()

      bronKerbosch(
        new Set([...r, node]),
        new Set([...p].filter((v) => neighbors.has(v))),
        new Set([...x].filter((v) => neighbors.has(v)))
      )

      p.delete(node)
      x.add(node)
    }
  }

  bronKerbosch(new Set(), new Set(graph.keys()), new Set())

  return { result, longestSet: longestClique }
}

const { result: sets, longestSet } = generateConnectedSets(lines)

console.log("Part 1: ", sets.filter((set) => set.some(([firstChar]) => firstChar === "t")).length)
console.log("Part 2: ", longestSet.sort().join(","))
console.timeEnd("elapsed")
