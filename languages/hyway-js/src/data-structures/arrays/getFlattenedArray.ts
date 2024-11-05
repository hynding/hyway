export const getFlattenedArray = <T>(array: T[], depth: number = 0): T[] => {
    return array.reduce<T[]>((acc, value) => {
        if (Array.isArray(value) && depth < 0) {
            return acc.concat(getFlattenedArray(value, -1))
        }
        if (Array.isArray(value) && depth > 0) {
            return acc.concat(getFlattenedArray(value, depth - 1))
        }
        return acc.concat(value)
    }, [])
}