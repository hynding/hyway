import { isHyphenated } from './isHyphenated.js';

export const toCamelCase = (name: string) => {
  if (typeof name !== 'string') {
    throw new TypeError('Expected a string');
  }
  
  return name
    .split(/[\s_-]+/) // Split by spaces, underscores, or hyphens
    .map(word => word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
    .join(''); // Join the words without any separator
}