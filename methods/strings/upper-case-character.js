'use strict';

const upperCaseCharacter = (characterIndex = 0) => camelCasedWord =>
  camelCasedWord[characterIndex].toUpperCase()
  +
  camelCasedWord.slice(1);

module.exports = upperCaseCharacter;
