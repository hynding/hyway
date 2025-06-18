export const isPascalCased = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }
  const pascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/;
  return pascalCasePattern.test(value);
}