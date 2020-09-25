'use strict';

const upperCaseCharacter = require('./upper-case-character');
const upperCaseFirstCharacter = upperCaseCharacter(0);

const HYPHEN = '-';

const hyphenToCamelCase = hyphenCasedString =>
  typeof hyphenCasedString === 'string'
    ? hyphenCasedString
        .split(HYPHEN)
        .map(upperCaseFirstCharacter)
        .join('')
    : '';

module.exports = hyphenToCamelCase;
