export const getMaxFloatPrecisionInteger = (...values: number[]): number => {
    return Math.max(...values.map(value => {
        const [, fractional] = value.toString().split('.')
        return fractional ? fractional.length : 0
    }))
}