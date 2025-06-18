export const isUpperCased = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }
  const upperCasePattern = /^[A-Z][A-Z0-9_]*[A-Z0-9]$/;
  return upperCasePattern.test(value);
}