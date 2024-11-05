import { getMaxFloatPrecisionInteger } from "@/data-types/integers/getMaxFloatPrecisionInteger"

export const getSumFloat = (...values: number[]): number => {
    const maxPrecision = getMaxFloatPrecisionInteger(...values)
    const factor = Math.pow(10, maxPrecision)
    return values.reduce((sum, value) => sum + (value * factor), 0) / factor
}