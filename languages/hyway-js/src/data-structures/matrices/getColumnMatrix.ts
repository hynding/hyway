export const getColumnMatrix = <T>(matrix: T[], length: number): T[][] => {
  const column = []
  for (let i = 0; i < length; i++) {
    column.push(matrix.filter((_, index) => index % length === i))
  }
  return column
}