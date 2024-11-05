export const getRandomInteger = (max: number, min: number = 0): number => {
    if (max < min) {
        throw new Error(`Max value (${max}) must be greater than min value (${min})`)
    }
    return Math.floor(Math.random() * ((max - min) + 1)) + min
}