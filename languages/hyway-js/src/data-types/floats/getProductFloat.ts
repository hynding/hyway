import { getMaxFloatPrecisionInteger } from "@/data-types/integers/getMaxFloatPrecisionInteger"

export const getProductFloat = (...values: number[]): number => {
    const maxPrecision = getMaxFloatPrecisionInteger(...values)
    const factor = Math.pow(10, maxPrecision)
    return values.reduce((sum, value) => sum * Math.round(value * factor), 1) / Math.pow(10, maxPrecision * 2)
}