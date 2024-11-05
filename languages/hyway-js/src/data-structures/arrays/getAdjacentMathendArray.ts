const defaultOptions = {
    isEnd: false,
    equation: (value: number) => value*2,
    skipValue: 0,
    matchCount: 2
}

export const getAdjacentMathendArray = (
    array: number[], 
    isEnd = false,
    equation = (value: number) => value*2,
    skipValue = 0,
    matchCount = 2): number[] => {
        const values = array.filter(value => value !== skipValue)
        if (isEnd) {
            values.reverse()
        }
        const mathendValues = []
        for (let i = 0; i < values.length; i++) {
            let currentMatchCount = 1
            for (let j = 1; j < matchCount; j++) {
                if (values[i] === values[i + j]) {
                    currentMatchCount++
                } else {
                    break
                }
            }
            if (currentMatchCount === matchCount) {
                mathendValues.push(equation(values[i]))
            } else {
                mathendValues.push(values[i])
            }
            i += currentMatchCount - 1
        }
        while (mathendValues.length < array.length) {
            mathendValues.push(skipValue)
        }
        return !isEnd ? mathendValues : mathendValues.reverse()
}