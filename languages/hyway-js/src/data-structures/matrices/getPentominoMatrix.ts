export const getPentominoMatrix = <T>(array: T[], pentominoIndices: number[][]): T[][] => {
    return pentominoIndices.map(indices => indices.map(index => array[index]))
}