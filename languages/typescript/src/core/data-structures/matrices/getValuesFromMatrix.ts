export const getValuesFromMatrix = <T>(matrix: T[][]): T[] => {
  const values: T[] = [];
  matrix.forEach(row => {
    row.forEach(value => {
      if (value !== undefined && value !== null) {
        values.push(value);
      }
    });
  });
  return values;
}