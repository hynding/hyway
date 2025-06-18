export const toUpperCase = (name: string) => {
  if (typeof name !== 'string') {
    throw new TypeError('Expected a string');
  }

  return name.toUpperCase(); // Convert the entire string to uppercase
}