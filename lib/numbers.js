export const intToHex = int => Number(int).toString(16)
export const hexToInt = hex => parseInt(hex, 16)

export const round = (number, decimals = 0) => Number(`${Math.round(`${number}e${decimals}`)}e-${decimals}`)
