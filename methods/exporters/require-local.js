'use strict';

const hyphenToCamelCase = require('../strings/hyphen-to-camel-case');

const requireLocal = (localRequireMethod, returnedMap = {}) => localJsFiles => localJsFiles.reduce((map, jsFileName) => {
  const requiredExport = localRequireMethod(localJsFiles);

  return {
    ...map,
    [jsFileName]: requiredExport,
    [hyphenToCamelCase(jsFileName)]: requiredExport,
  }
}, returnedMap);

module.exports = requireLocal;
