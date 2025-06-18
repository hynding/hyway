import { isCamelCased } from './isCamelCased.js';
import { isHyphenated } from './isHyphenated.js';
import { isPascalCased } from './isPascalCased.js';
import { isUpperCased } from './isUpperCased.js';

export const toHyphenated = (name: string) => {
  if (typeof name !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (isHyphenated(name)) {
    // If already hyphenated, return as is
    return name;
  }

  if (isCamelCased(name)) {
    // Convert camelCase to hyphenated-case
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  if (isPascalCased(name)) {
    // Convert PascalCase to hyphenated-case
    return name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  }
  
  if (isUpperCased(name)) {
    // Convert UPPER_CASE to hyphenated-case
    return name.toLowerCase().replace(/_/g, '-');
  }

  // Convert regular string to hyphenated-case
  return name
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .toLowerCase(); // Convert to lowercase
}