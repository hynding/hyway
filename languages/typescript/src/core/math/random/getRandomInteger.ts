export const getRandomInteger = (minOrMax: number = 0, maxOrMin: number = 0): number => {
  const min = Math.min(maxOrMin, minOrMax)
  const max = Math.max(maxOrMin, minOrMax)
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}