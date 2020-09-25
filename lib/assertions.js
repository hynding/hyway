class Assertions {
  static isIndex (index, array) {
    return (array && array.length && array.length > index && index > -1) || !!~index
  }
}

export default Assertions
