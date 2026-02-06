export const getGroupConsolidatedCollectionArray = <T>(collectionArray: T[][]): T[][] => {
    const clonedCollection: T[][] = collectionArray.map(arr => [...arr]);
    const lengths = clonedCollection.map(arr => arr.length);
    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);

    for (let length = minLength; length <= maxLength; length++) {
      // First, we want to be sure any value(s) for a given length does not clash with sets of the same length
      const arraysWithinLength = clonedCollection.filter(arr => arr.length === length);
      // console.log("arraysWithinLength", length, arraysWithinLength);
      arraysWithinLength.forEach((currentArray, i) => {
          // Check if currentArray has duplicates in the same length
          const duplicates = arraysWithinLength.filter((arr, j) => 
            j !== i && 
            arr.length === length && 
            arr.every(item => currentArray.includes(item)) && 
            currentArray.every(item => arr.includes(item)));
            // console.log('duplicates', duplicates);

          if (currentArray.length < 2) {
            // console.log('currentArray too small', currentArray, duplicates);
            clonedCollection.forEach((arr, k) => {
              if (arr.length > 1 || arr[0] !== currentArray[0]) {
                // console.log('!!!!single', currentArray, arr)
                clonedCollection[k] = arr.filter(item => !currentArray.includes(item));
              }
            });
            return;
          }

          // There shouldn't be more duplicates than the current length
          if (duplicates.length > length - 1) {
            // console.log('duplicates', duplicates);
            throw new Error(`Too many duplicates found for length ${length}: ${duplicates.length}`);
          } else if (duplicates.length === length - 1) {
            console.log('inner duplicates', duplicates, length);
            // Remove items from all other arrays that are in the current pair
            clonedCollection.forEach((arr, k) => {
              if (arr !== currentArray && !duplicates.includes(arr)) {
                // console.log('executing for dups', currentArray, duplicates, arr)
                clonedCollection[k] = arr.filter(item => !currentArray.includes(item));
              }
            });
          } else {
            // Check if the smaller currentArray is a subset of any other array of the current length
            const duplicates = arraysWithinLength.filter((arr, j) =>
              j !== i &&
              arr.every(item => currentArray.includes(item)) &&
              currentArray.every(item => arr.includes(item)));

            const subSets = clonedCollection.filter((arr, j) =>
              // j !== i &&
              arr.length < length &&
              arr.length > 1 &&
              arr.every(item => currentArray.includes(item)));

            if (subSets.length) {
              console.log('currentArray', currentArray);
              console.log('duplicates', duplicates);
              console.log('subSets', subSets);
              console.log('subSets all?', currentArray.every(item => subSets.flat().includes(item)));
              console.log('subSets all 2?', currentArray.every(item => [...subSets, ...duplicates].flat().includes(item)));
            }
            if (duplicates.length + subSets.length !== currentArray.length - 1) {
              return;
            }

            if (currentArray.every(item => [...subSets, ...duplicates].flat().includes(item))) {
            // if (currentArray.every(item => subSets.flat().includes(item))) {
              // Remove items from all other arrays that are in the current subset
              clonedCollection.forEach((arr, k) => {
                if (arr !== currentArray && !subSets.includes(arr) && !duplicates.includes(arr)) {
                  console.log('executing for', arr, currentArray, arr.filter(item => !currentArray.includes(item)))
                  clonedCollection[k] = arr.filter(item => !currentArray.includes(item));
                }
              });
            }
            
          }
      })
    }

    const originalHash = collectionArray.map(arr => arr.join(',')).join('|');
    const newHash = clonedCollection.map(arr => arr.join(',')).join('|');

    if (originalHash !== newHash) {
      // console.log('rerunning', clonedCollection)
      try {
        return getGroupConsolidatedCollectionArray(clonedCollection);
      } catch (error) {
        console.error("Error during rerun:", error);
      }
    } else {
      // console.log('no rerun')
    }

    console.log("clonedCollection", clonedCollection);

    return clonedCollection;
}