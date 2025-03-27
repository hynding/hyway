export const getStringSplitArray = (
    string: string,
    maxLength: number = 1
): string[] => {
    if (maxLength === 1) {
        return string.split("");
    }
    const splitArray: string[] = [];
    for (let i = 0; i < string.length; i += maxLength) {
        splitArray.push(string.slice(i, i + maxLength));
    }
    return splitArray;
}