export const isHyphenated = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }
  const hyphenatedPattern = /^[a-z]+(-[a-z]+)+$/;
  return hyphenatedPattern.test(value);
}