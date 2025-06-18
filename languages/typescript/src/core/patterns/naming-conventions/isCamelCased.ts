export const isCamelCased = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }
  const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
  return camelCasePattern.test(value);
}