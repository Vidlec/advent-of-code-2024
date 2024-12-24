const inputFile = Bun.file("src/24/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const [wiresRaw, gatesRaw] = inputRaw.split("\n\n")
const wires = new Map(
  wiresRaw.split("\n").map((line) => line.split(":").map((v) => v.trim())) as [string, string][]
)

type GateType = "AND" | "OR" | "XOR"

const gates = gatesRaw
  .split("\n")
  .map((line) => line.split(" "))
  .map(([a, gate, b, _, output]) => ({
    a,
    b,
    gate: gate as GateType,
    output,
  }))

type Gate = (typeof gates)[0]

const logic: Record<GateType, (a: string, b: string) => string> = {
  AND: (a: string, b: string) => {
    if (a === "0" || b === "0") return "0"
    return "1"
  },
  OR: (a: string, b: string) => {
    if (a === "0" && b === "0") return "0"
    return "1"
  },
  XOR: (a: string, b: string) => {
    if (a === b) return "0"
    return "1"
  },
}

const run = (gates: Gate[], wires: Map<string, string>) => {
  while (gates.length > 0) {
    const gate = gates.shift()!
    const { a, b, output, gate: gateType } = gate
    const valueA = wires.get(a)
    const valueB = wires.get(b)

    if (valueA === undefined || valueB === undefined) {
      gates.push(gate)
      continue
    }

    const result = logic[gateType](valueA, valueB)
    wires.set(output, result)
  }

  return { wires }
}

const result = run([...gates], new Map(wires))

const sorted = [...result.wires.entries()]
  .filter(([key]) => key[0] === "z")
  .map(([key, value]) => [key, Number(value)] as [string, number])
  .sort(([keyA], [keyB]) => (keyA as string).localeCompare(keyB as string))

const binary = sorted
  .map(([_, bit]) => bit)
  .reverse()
  .join("")

const isSus = (gates: Gate[]): Set<string> => {
  const sus = new Set<string>()
  const highestZ = "z45"

  gates.forEach(({ a, gate, b, output }) => {
    // * Rule 1: output can't be z and not XOR unless it is the last bit
    if (output.startsWith("z") && gate !== "XOR" && output !== highestZ) {
      sus.add(output)
    }

    // * Rule 2: if gate is XOR and neither output, a, nor b start with x, y, or z.
    if (
      gate === "XOR" &&
      !["x", "y", "z"].includes(output[0]) &&
      !["x", "y", "z"].includes(a[0]) &&
      !["x", "y", "z"].includes(b[0])
    ) {
      sus.add(output)
    }

    // * Rule 3: If gate is AND and neither a nor b is x00,
    // * ensure that output is not an input for a non-OR operation.
    if (gate === "AND" && a !== "x00" && b !== "x00") {
      gates.forEach(({ a: subA, gate: subGate, b: subB }) => {
        if ((output === subA || output === subB) && subGate !== "OR") {
          sus.add(output)
        }
      })
    }

    // * Rule 4: If gate is XOR, ensure that output is not an input for an OR operation.
    if (gate === "XOR") {
      gates.forEach(({ a: subA, gate: subGate, b: subB }) => {
        if ((output === subA || output === subB) && subGate === "OR") {
          sus.add(output)
        }
      })
    }
  })

  return sus
}

const susWires = isSus(gates)

console.log("Part 1: ", parseInt(binary, 2))
console.log("Part 2: ", [...susWires.values()].sort().join(","))
console.timeEnd("elapsed")
