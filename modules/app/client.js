import ensureObject from '../../objects/ensureObject'

const AppClientModule = props => {
  const {
    components = {},
    providers = {},
    services = {},
    pages = {},
    api = {},
  } = ensureObject(props)

  return {

  }
}