export const getBoxMatrix = <T>(matrix: T[], boxWidth: number, boxHeight: number): T[][] => {
    const length = Math.sqrt(matrix.length)
    const boxMatrix = []
    for (let i = 0; i < length; i += boxHeight) {
        for (let j = 0; j < length; j += boxWidth) {
            const box = []
            for (let k = 0; k < boxHeight; k++) {
                box.push(...matrix.slice(i * length + j + k * length, i * length + j + k * length + boxWidth))
            }
            boxMatrix.push(box)
        }
    }
    return boxMatrix
}