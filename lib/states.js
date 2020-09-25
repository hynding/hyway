import { EventManager } from './events'
import { toObjectProperties } from './reductions'
import { fromMatching } from './filters'

const { publish } = EventManager

export const config = (options = {}) => Object.assign({
  state: {},
  id: Date.now()
}, options)

export const browse  = (state = {}) => properties => Object.keys(state)
  .filter(fromMatching(properties))
  .reduce(toObjectProperties(state), {})
export const read    = (state = {}) => property => state[property]
export const edit    = (state = {}) => (property, value) => state[property] = value
export const add     = (state = {}) => (property, value) => state[property] = value
export const destroy = (state = {}) => property => delete state[property]

export const manager = configOptions => {
  const store = config(configOptions || {})
  const { state } = store
  const publishMethod = (name, method) => (property, value) => publish({name, property, value}) && method(state)(property, value)
  return Object.assign({}, store, {
    browse:  publishMethod('browse',  browse),
    read:    publishMethod('read',    read),
    edit:    publishMethod('edit',    edit),
    add:     publishMethod('add',     add),
    destroy: publishMethod('destroy', destroy)
  })
}
export const StateManager = manager()