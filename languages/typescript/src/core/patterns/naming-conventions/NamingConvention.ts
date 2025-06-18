// import { isCamelCased } from './isCamelCased.js';
import { isPascalCased } from './isPascalCased.js';
// import { isUpperCased } from './isUpperCased.js';
// import { toCamelCase } from './toPascalCase.js';
import { toPascalCase } from './toPascalCase.js';

export class NamingConvention {
  static isPascalCase(value: string) {
    return isPascalCased(value)
  }
  static toPascalCase(name: string) {
    return toPascalCase(name);
  }
}