export const getUniqueGroupedSetsArray = <T>(collection: T[][]): T[][] => {
  const uniqueSets: T[][] = [];
  const lengths = collection.map(arr => arr.length);
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);

  for (let length = minLength; length <= maxLength; length++) {
    const setsOfLength = collection.filter(arr => arr.length <= length);

    if (setsOfLength.length === 0) continue;

    setsOfLength.forEach(set => {
      const isUnique = !uniqueSets.some(existingSet => {
        return existingSet.length === set.length && existingSet.every(value => set.includes(value));
      });

      if (isUnique) {
        uniqueSets.push(set);
      }
    });
  }

  return uniqueSets
}