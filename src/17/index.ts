const inputFile = Bun.file("src/17/input.txt")
const inputRaw = await inputFile.text()

const [registersRaw, programRaw] = inputRaw.split("\n\n")
const registers = registersRaw
  .split("\n")
  .flatMap((line) => (line.match(/\d+/gm) ?? []).map((v) => BigInt(v)))
const program = programRaw.match(/\d+/gm)?.map((v) => Number(v)) ?? []

const run = (registers: bigint[], program: number[]) => {
  let code = [...program]
  let [A, B, C] = registers
  let ip = 0
  let output: string[] = []

  // Define valid operand combos
  const combos: Record<number, () => bigint> = {
    [0]: () => BigInt(0),
    [1]: () => BigInt(1),
    [2]: () => BigInt(2),
    [3]: () => BigInt(3),
    [4]: () => A,
    [5]: () => B,
    [6]: () => C,
    [7]: () => {
      throw new Error("Invalid operand")
    },
  }

  while (ip < program.length) {
    const opcode = code[ip]
    const operand = code[ip + 1]
    const combo = combos[operand]?.()

    ip = ip + 2

    // * adv (division)
    if (opcode === 0) {
      A = A / 2n ** combo
    }

    // * bxl (bitwise XOR)
    if (opcode === 1) {
      B = B ^ BigInt(operand)
    }

    // * bst (modulo 8)
    if (opcode === 2) {
      B = combo % BigInt(8)
    }

    // * jnz (jump)
    if (opcode === 3) {
      if (A !== BigInt(0)) {
        ip = operand
        continue
      }
    }

    // * bxc (bitwise XOR)
    if (opcode === 4) {
      B = B ^ C
    }

    // * out (output value of modulo)
    if (opcode === 5) {
      output.push((combo % 8n).toString())
    }

    // * bdv (division) -> B
    if (opcode === 6) {
      B = A / BigInt(2) ** combo
    }

    // * adv (division) -> C
    if (opcode === 7) {
      C = A / BigInt(2) ** combo
    }
  }

  return output.join(",")
}

const findLowestA = (registers: bigint[], program: number[]) => {
  let [_, B, C] = registers
  const target = program.join(",")
  let A = 1n

  // * For every multiple of 8, new number is added
  while (true) {
    const output = run([A, B, C], program)
    if (target === output) return A
    if (target.endsWith(output)) {
      A = A * 8n
      continue
    }
    A++
  }
}

console.time("elapsed")
console.log("Part 1: ", run(registers, program))
console.log("Part 2: ", Number(findLowestA(registers, program)))
console.timeEnd("elapsed")
