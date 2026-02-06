// 1. Iterate through an array of an array of values, skipping over any saved indices
// 2. If the current array (A) length is n and index is i, iterate through the array from i+1 for each subsequent array (B)
//   a. If the length of array (B) is equal to n, check if it is a subset and superset of the current array (A)
//.     i. If true, save the length and matching indices of the current array (A) and the current array (B)
//.  b. If the length of array (B) is less than n, check if is a subset of the current array (A)
//.     i. If true, map the index of the current array (A) to include the difference of the current array (A) and the current array (B)
// 


// [A,B], [B,C], [A,C] are an exclusive value set
//. at 1, B is include but not C, look for sets now that include either [A,C] or [A,B,C]
// [A,B], [A,B,C], [A,C] are an exclusive value set
// [A,B,C], [A,B,C], [A, C] are an exclusive value set


export const getExclusiveValueSetIndicesFromMatrix = <T>(matrix: T[][]): number[][] => {
  const exclusiveValueSetIndices: number[][] = [];
  const orderedMatrixByLength = matrix.slice(0).sort((a, b) => a.length - b.length);

  return exclusiveValueSetIndices
};