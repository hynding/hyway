import { getStringSplitArray } from "../arrays/getStringSplitArray.js";

export interface StringTree {
    [key: string]: StringTree | boolean | number | string;
}

export type StringTreeFromArrayOptions = {
    maxKeyLength?: number
    getEndKey?: (wordArray: string[]) => number | string
    getEndValue?: (wordArray?: string[]) => boolean | number | string
}

const defaultOptions = {
    maxKeyLength: 1,
    getEndKey: (wordArray: string[]) => wordArray.length,
    getEndValue: () => 1
}

export const getStringTreeFromArray = (
    array: string[], 
    options: StringTreeFromArrayOptions = defaultOptions
) => {
    // get options excluding explicitly undefined values
    const maxKeyLength = options.maxKeyLength || defaultOptions.maxKeyLength;
    const getEndKey = options.getEndKey || defaultOptions.getEndKey;
    const getEndValue = options.getEndValue || defaultOptions.getEndValue;
    let wordCharacterMap: StringTree = {};
    array.forEach(word => {
        let currentMap: StringTree = wordCharacterMap;
        getStringSplitArray(word, maxKeyLength).forEach((
            splitString,
            index,
            splitArray
        ) => {
            if (currentMap[splitString] === undefined) {
                currentMap[splitString] = {};
            }
            currentMap = currentMap[splitString] as StringTree;
            if (index === splitArray.length - 1) {
                const key = getEndKey(splitArray);
                currentMap[key] = getEndValue(splitArray);
            }
        });
    });
    return wordCharacterMap
}