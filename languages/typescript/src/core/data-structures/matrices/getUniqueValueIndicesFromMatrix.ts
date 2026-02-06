export const getUniqueValueIndicesFromMatrix = <T>(matrix: T[][]): number[][] => {
  const indices: number[][] = [];
  const valueMap = new Map<T, number[][]>();
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (!valueMap.has(value)) {
        valueMap.set(value, []);
      }
      valueMap.get(value)?.push([rowIndex, colIndex]);
    });
  });
  valueMap.forEach((positions, value) => {
    if (positions.length === 1) {
      indices.push(positions[0]);
    }
  });
  return indices
};
