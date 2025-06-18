export const getRandomBoolean = (probability: number = 0.5): boolean => {
  if (probability < 0 || probability > 1) {
    throw new Error('Probability must be between 0 and 1');
  }
  return Math.random() < probability;
}