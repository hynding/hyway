const ensureObject = (input, fallback = {}) => {
  const isNotNull = !!input
  const isObject = typeof input === 'object'
  const isValid = isNotNull && isObject

  return isValid
    ? input
    : ensureObject(fallback)
}

export default ensureObject