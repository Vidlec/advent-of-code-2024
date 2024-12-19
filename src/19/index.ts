const inputFile = Bun.file("src/19/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

interface TreeNode {
  substring: string
  startIndex: number
  children: TreeNode[]
}

const [substrings, originals] = inputRaw
  .split("\n\n")
  .map((v, index) => v.split(index === 0 ? ", " : "\n"))

const getTree = (original: string, substrings: string[]): { tree: TreeNode[]; matches: number } => {
  const cache: Map<number, { nodes: TreeNode[]; matches: number }> = new Map()

  const buildTree = (
    startIndex: number,
    constructedString: string
  ): { nodes: TreeNode[]; matches: number } => {
    if (constructedString === original) {
      return { nodes: [], matches: 1 }
    }

    if (constructedString.length > original.length || !original.startsWith(constructedString)) {
      return { nodes: [], matches: 0 }
    }

    if (cache.has(startIndex)) {
      return cache.get(startIndex)!
    }

    const nodes: TreeNode[] = []
    let matchCount = 0

    for (const substring of substrings) {
      if (original.startsWith(substring, startIndex)) {
        const node: TreeNode = {
          substring,
          startIndex,
          children: [],
        }

        const { nodes: childNodes, matches: childCount } = buildTree(
          startIndex + substring.length,
          constructedString + substring
        )

        node.children = childNodes
        nodes.push(node)

        matchCount += childCount
      }
    }

    const result = { nodes, matches: matchCount }
    cache.set(startIndex, result)
    return result
  }

  const { nodes, matches } = buildTree(0, "")

  return { tree: nodes, matches }
}

const matches = originals.map((original) => getTree(original, substrings).matches)
console.log("Part 1: ", matches.filter((matches) => matches > 0).length)
console.log(
  "Part 2: ",
  matches.reduce((a, b) => a + b)
)

console.timeEnd("elapsed")
