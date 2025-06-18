export const getRandomIndexFromArray = <T>(array: T[], matchingValue?: number): number => {
    if (matchingValue === undefined) {
        return Math.floor(Math.random() * array.length)
    }

    const matchCount = array.filter(value => value === matchingValue).length
    if (matchCount === 0) {
        return -1
    }

    let randomIndex = Math.floor(Math.random() * matchCount)
    for (let i = 0; i < array.length; i++) {
        if (array[i] === matchingValue) {
            if (randomIndex === 0) {
                return i
            }
            randomIndex--
        }
    }
    
    return randomIndex
}
