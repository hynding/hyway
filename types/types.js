export const BOOLEAN_TYPE = 'boolean'
export const NUMBER_TYPE = 'number'
export const OBJECT_TYPE = 'object'
export const STRING_TYPE = 'string'
export const UNDEFINED_TYPE = 'undefined'

export const FALSE_BOOLEAN = false
export const FALSE_NUMBER = 0
export const FALSE_OBJECT = null
export const FALSE_STRING = ''
export const FALSE_UNDEFINED = undefined

export const TYPES = [
  BOOLEAN_TYPE,
  NUMBER_TYPE,
  OBJECT_TYPE,
  STRING_TYPE,
  UNDEFINED_TYPE,
]

export const KNOWN_TYPES_MAP = TYPES.reduce((map, type) => ({...map, [type]: true}), {})

export const FALSE_TYPES_MAP = {
  [BOOLEAN_TYPE]: FALSE_BOOLEAN,
  [NUMBER_TYPE]: FALSE_NUMBER,
  [OBJECT_TYPE]: FALSE_OBJECT,
  [STRING_TYPE]: FALSE_STRING,
  [UNDEFINED_TYPE]: FALSE_UNDEFINED,
}

export const ensureType = type => (value, fallbackValue) => {
  const valueType = typeof value
  const isKnownType = KNOWN_TYPES_MAP[type]

  if (!isKnownType) {
    console.error('hyway/types/types', 'ensureType', 'Unregistered type:', valueType)
  }

  if (isKnownType && valueType === type) {
    return value
  }

  return fallbackValue
    ? ensureType(fallbackValue, type)
    : FALSE_TYPES_MAP[valueType]
}

export const ensureBoolean = ensureType(BOOLEAN_TYPE)
export const ensureNumber = ensureType(NUMBER_TYPE)
export const ensureObject = ensureType(OBJECT_TYPE)
export const ensureString = ensureType(STRING_TYPE)
export const ensureUndefined = ensureType(UNDEFINED_TYPE)