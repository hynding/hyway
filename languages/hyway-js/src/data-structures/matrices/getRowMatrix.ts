export const getRowMatrix = <T>(matrix: T[], length: number): T[][] => {
  const row = []
  for (let i = 0; i < matrix.length; i += length) {
    row.push(matrix.slice(i, i + length))
  }
  return row
}