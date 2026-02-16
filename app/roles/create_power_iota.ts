// Creates a generator that produces sequential powers of 2 (1 << 0, 1 << 1, 1 << 2, ...)
// return: 1, 16, 32, 64 ...
export default function createPowerIota() {
  let value = 1n

  return () => {
    const result = value
    value = value << 1n // Shift left to generate the next power of 2
    return result
  }
}
